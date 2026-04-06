import { NextRequest, NextResponse } from "next/server";

import { generateDailyPlan } from "@/lib/ai/daily-plan";
import { AuthenticationError, requireAppUserId } from "@/lib/server/auth";
import { getDailyPlanContext, getSavedDailyPlan, getTelegramAlertTarget, saveDailyPlan } from "@/lib/server/persistence";
import { formatDailyPlanAlert, sendTelegramMessage } from "@/lib/telegram/service";
import { dailyPlanActionSchema } from "@/lib/validation/api";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return NextResponse.json({ plan: null, context: null });
  }
  try {
    const userId = await requireAppUserId(req);
    const [plan, context] = await Promise.all([
      getSavedDailyPlan(userId),
      getDailyPlanContext(userId),
    ]);

    return NextResponse.json({ plan, context });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    console.error("Daily plan fetch failed:", error);
    return NextResponse.json({ error: "Failed to load daily plan." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return NextResponse.json({ error: "Unavailable during build" }, { status: 503 });
  }
  try {
    const userId = await requireAppUserId(req);
    const body = await req.json();
    const parsed = dailyPlanActionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid daily plan payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const context = await getDailyPlanContext(userId);
    const generated = await generateDailyPlan(context);
    const plan = await saveDailyPlan(userId, generated);

    if (parsed.data.sendTelegram) {
      try {
        const chatId = await getTelegramAlertTarget(userId);
        if (chatId) {
          await sendTelegramMessage(chatId, formatDailyPlanAlert(plan));
        }
      } catch (telegramError) {
        console.error("Daily plan Telegram delivery failed:", telegramError);
      }
    }

    return NextResponse.json({ plan, context });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    console.error("Daily plan generation failed:", error);
    return NextResponse.json({ error: "Failed to generate daily plan." }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";

import { generateEndOfDayReview } from "@/lib/ai/end-of-day";
import { AuthenticationError, requireAppUserId } from "@/lib/server/auth";
import {
  getEndOfDayReviewContext,
  getSavedEndOfDayReview,
  getTelegramAlertTarget,
  saveEndOfDayReview,
} from "@/lib/server/persistence";
import { formatEndOfDaySummaryAlert, sendTelegramMessage } from "@/lib/telegram/service";
import { endOfDayReviewActionSchema } from "@/lib/validation/api";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return NextResponse.json({ review: null, context: null });
  }
  try {
    const userId = await requireAppUserId(req);
    const [review, context] = await Promise.all([
      getSavedEndOfDayReview(userId),
      getEndOfDayReviewContext(userId),
    ]);

    return NextResponse.json({ review, context });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    console.error("End-of-day review fetch failed:", error);
    return NextResponse.json(
      { error: "Failed to load end-of-day review." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return NextResponse.json({ error: "Unavailable during build" }, { status: 503 });
  }
  try {
    const userId = await requireAppUserId(req);
    const body = await req.json();
    const parsed = endOfDayReviewActionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid review payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const context = await getEndOfDayReviewContext(userId);
    const generatedReview = await generateEndOfDayReview(context);
    const review = await saveEndOfDayReview(userId, generatedReview, context);

    if (parsed.data.sendTelegram) {
      try {
        const chatId = await getTelegramAlertTarget(userId);
        if (chatId) {
          await sendTelegramMessage(chatId, formatEndOfDaySummaryAlert(review));
        }
      } catch (telegramError) {
        console.error("End-of-day Telegram delivery failed:", telegramError);
      }
    }

    return NextResponse.json({ review, context });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    console.error("End-of-day review generation failed:", error);
    return NextResponse.json(
      { error: "Failed to generate end-of-day review." },
      { status: 500 }
    );
  }
}

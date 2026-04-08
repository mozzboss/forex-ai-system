import { NextRequest, NextResponse } from "next/server";

import { analyzeNews } from "@/lib/ai/news-analysis";
import { AuthenticationError, requireAppUserId } from "@/lib/server/auth";
import { getTelegramAlertTarget } from "@/lib/server/persistence";
import { formatNewsAnalysisAlert, sendTelegramMessage } from "@/lib/telegram/service";
import { newsAnalysisRequestSchema } from "@/lib/validation/api";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return NextResponse.json({ error: "Unavailable during build" }, { status: 503 });
  }

  try {
    const userId = await requireAppUserId(req);
    const body = await req.json();
    const parsed = newsAnalysisRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { sendTelegram, ...analysisInput } = parsed.data;
    const result = await analyzeNews(analysisInput);

    if (sendTelegram) {
      try {
        const chatId = await getTelegramAlertTarget(userId);
        if (chatId) {
          await sendTelegramMessage(chatId, formatNewsAnalysisAlert(result));
        }
      } catch (telegramError) {
        console.error("News analysis Telegram alert failed:", telegramError);
      }
    }

    return NextResponse.json({ result, timestamp: new Date().toISOString() });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "News analysis failed.";
    console.error("News analysis error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

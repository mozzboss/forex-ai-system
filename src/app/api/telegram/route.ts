import { NextRequest, NextResponse } from "next/server";

import { handleTelegramUpdate } from "@/lib/telegram/bot";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET?.trim();

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Telegram webhook is ready.",
  });
}

export async function POST(req: NextRequest) {
  // Validate Telegram's secret token header when a secret is configured.
  // Set TELEGRAM_WEBHOOK_SECRET and pass it when registering the webhook:
  //   POST https://api.telegram.org/bot<TOKEN>/setWebhook
  //     ?url=https://your-domain.com/api/telegram
  //     &secret_token=<TELEGRAM_WEBHOOK_SECRET>
  if (WEBHOOK_SECRET) {
    const incoming = req.headers.get("x-telegram-bot-api-secret-token");
    if (incoming !== WEBHOOK_SECRET) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
  }

  try {
    const body = await req.json();
    await handleTelegramUpdate(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

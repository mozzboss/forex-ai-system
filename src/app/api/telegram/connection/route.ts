import { NextRequest, NextResponse } from "next/server";

import { AuthenticationError, requireAppUserId } from "@/lib/server/auth";
import {
  generateTelegramLinkCode,
  getTelegramConnectionStatus,
  setTelegramAlertsEnabled,
  unlinkTelegramConnection,
} from "@/lib/server/persistence";
import { telegramConnectionActionSchema } from "@/lib/validation/api";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const userId = await requireAppUserId(req);
    const connection = await getTelegramConnectionStatus(userId);
    return NextResponse.json({ connection });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    console.error("Telegram connection fetch failed:", error);
    return NextResponse.json({ error: "Failed to load Telegram connection." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await requireAppUserId(req);
    const body = await req.json();
    const parsed = telegramConnectionActionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid Telegram payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    if (parsed.data.action === "generate_code") {
      const connection = await generateTelegramLinkCode(userId);
      return NextResponse.json({ connection });
    }

    if (parsed.data.action === "unlink") {
      const connection = await unlinkTelegramConnection(userId);
      return NextResponse.json({ connection });
    }

    if (parsed.data.action === "set_alerts") {
      const connection = await setTelegramAlertsEnabled(userId, parsed.data.enabled);
      return NextResponse.json({ connection });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    console.error("Telegram connection update failed:", error);
    return NextResponse.json({ error: "Failed to update Telegram connection." }, { status: 500 });
  }
}

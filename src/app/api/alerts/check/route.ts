import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { sendTelegramMessage } from "@/lib/telegram/service";
import { getPricePrecision } from "@/config/trading";
import type { CurrencyPair } from "@/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Called by Vercel Cron every 5 minutes.
// Also callable manually: GET /api/alerts/check
export async function GET(_req: NextRequest) {

  if (!process.env.TWELVE_DATA_API_KEY) {
    return NextResponse.json({ skipped: true, reason: "No TwelveData key" });
  }

  try {
    // Load all untriggered alerts
    const alerts = await prisma.priceAlert.findMany({
      where: { triggered: false },
      include: { user: { select: { telegramChatId: true, telegramAlertsEnabled: true } } },
    });

    if (alerts.length === 0) {
      return NextResponse.json({ checked: 0, triggered: 0 });
    }

    // Collect unique pairs
    const pairs = [...new Set(alerts.map((a) => a.pair))] as CurrencyPair[];

    // Batch fetch prices from TwelveData — one request for all pairs
    const symbols = pairs.map((p) => `${p.slice(0, 3)}/${p.slice(3, 6)}`).join(",");
    const url = new URL("https://api.twelvedata.com/price");
    url.searchParams.set("symbol", symbols);
    url.searchParams.set("apikey", process.env.TWELVE_DATA_API_KEY!);

    const res = await fetch(url.toString(), { next: { revalidate: 0 } });
    if (!res.ok) {
      return NextResponse.json({ error: "TwelveData fetch failed" }, { status: 502 });
    }

    const data = await res.json() as Record<string, { price?: string; code?: number }>;

    // Build price map: pair → current price
    const priceMap = new Map<string, number>();
    for (const pair of pairs) {
      const symbol = `${pair.slice(0, 3)}/${pair.slice(3, 6)}`;
      // TwelveData returns the key as "EUR/USD" when multiple symbols
      const entry = data[symbol] ?? data;
      const raw = typeof entry === "object" && "price" in entry ? (entry as { price?: string }).price : undefined;
      const price = raw ? Number(raw) : NaN;
      if (isFinite(price)) priceMap.set(pair, price);
    }

    let triggered = 0;

    for (const alert of alerts) {
      const currentPrice = priceMap.get(alert.pair);
      if (currentPrice === undefined) continue;

      const target = Number(alert.targetPrice);
      const hit =
        (alert.condition === "above" && currentPrice >= target) ||
        (alert.condition === "below" && currentPrice <= target);

      if (!hit) continue;

      // Mark triggered
      await prisma.priceAlert.update({
        where: { id: alert.id },
        data: { triggered: true, triggeredAt: new Date() },
      });

      triggered++;

      // Send Telegram
      const chatId = alert.user.telegramChatId;
      if (chatId && alert.user.telegramAlertsEnabled) {
        const precision = getPricePrecision(alert.pair as CurrencyPair);
        const direction = alert.condition === "above" ? "reached above" : "dropped below";
        const message = [
          `🔔 PRICE ALERT — ${alert.pair}`,
          `Price ${direction} ${target.toFixed(precision)}`,
          `Current: ${currentPrice.toFixed(precision)}`,
          alert.note ? `Note: ${alert.note}` : "",
        ].filter(Boolean).join("\n");

        try {
          await sendTelegramMessage(chatId, message);
        } catch {
          // Don't fail the whole check if Telegram send fails
        }
      }
    }

    return NextResponse.json({ checked: alerts.length, triggered, pairs: pairs.length });
  } catch (error) {
    console.error("Alert check failed:", error);
    return NextResponse.json({ error: "Alert check failed" }, { status: 500 });
  }
}

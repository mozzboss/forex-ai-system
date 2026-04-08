import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { sendTelegramMessage } from "@/lib/telegram/service";
import { getPricePrecision } from "@/config/trading";
import type { CurrencyPair } from "@/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isCronAuthorized(req: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  // If no secret is configured, allow all calls (set CRON_SECRET in Vercel env to restrict)
  if (!secret) return true;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

// Called by Vercel Cron every 5 minutes.
// Also callable manually: GET /api/alerts/check
export async function GET(req: NextRequest) {
  if (!isCronAuthorized(req)) {
    return NextResponse.json(
      { error: "Unauthorized cron request. Configure CRON_SECRET and send it as Bearer token." },
      { status: 401 }
    );
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

    // Build price map: pair → current price
    const priceMap = new Map<string, number>();

    const apiKey = process.env.TWELVE_DATA_API_KEY?.trim();
    if (apiKey) {
      // Batch fetch from TwelveData — one request for all pairs
      const symbols = pairs.map((p) => `${p.slice(0, 3)}/${p.slice(3, 6)}`).join(",");
      const url = new URL("https://api.twelvedata.com/price");
      url.searchParams.set("symbol", symbols);
      url.searchParams.set("apikey", apiKey);

      try {
        const res = await fetch(url.toString(), { cache: "no-store" });
        if (res.ok) {
          const data = await res.json() as Record<string, unknown>;
          for (const pair of pairs) {
            const symbol = `${pair.slice(0, 3)}/${pair.slice(3, 6)}`;
            // Single-symbol: TwelveData returns { price: "..." } directly (not keyed)
            // Multi-symbol: returns { "EUR/USD": { price: "..." }, ... }
            const entry = (pairs.length === 1 ? data : (data[symbol] ?? {})) as Record<string, unknown>;
            const raw = typeof entry.price === "string" ? entry.price : null;
            const price = raw ? Number(raw) : NaN;
            if (isFinite(price) && price > 0) priceMap.set(pair, price);
          }
        }
      } catch (fetchErr) {
        console.error("TwelveData price fetch failed:", fetchErr);
      }
    }

    // For any pair still missing a price, try the internal market snapshot
    const missingPairs = pairs.filter((p) => !priceMap.has(p));
    if (missingPairs.length > 0) {
      const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000";
      await Promise.allSettled(
        missingPairs.map(async (pair) => {
          try {
            const res = await fetch(`${baseUrl}/api/market?pair=${pair}&timeframe=1min`, {
              cache: "no-store",
              headers: { "x-internal-cron": "1" },
            });
            if (!res.ok) return;
            const data = await res.json();
            const price = data?.snapshot?.price;
            if (typeof price === "number" && isFinite(price) && price > 0) {
              priceMap.set(pair, price);
            }
          } catch { /* skip */ }
        })
      );
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

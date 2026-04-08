import { NextRequest, NextResponse } from "next/server";

import { ALL_PAIRS } from "@/config/trading";
import { fetchMarketSnapshot } from "@/lib/market/prices";
import { MARKET_TIMEFRAMES, MarketTimeframe } from "@/lib/market/timeframes";
import { AuthenticationError, requireAppUserId } from "@/lib/server/auth";
import { CurrencyPair } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return NextResponse.json({ snapshot: null });
  }
  try {
    // Allow internal cron calls (from alerts/check) without user auth
    const isInternalCron = req.headers.get("x-internal-cron") === "1";
    if (!isInternalCron) await requireAppUserId(req);
    const { searchParams } = new URL(req.url);
    const rawPair = searchParams.get("pair")?.toUpperCase();
    const rawTimeframe = searchParams.get("timeframe");

    if (!rawPair || !ALL_PAIRS.includes(rawPair as CurrencyPair)) {
      return NextResponse.json({ error: "Unsupported pair" }, { status: 400 });
    }

    const timeframe: MarketTimeframe =
      rawTimeframe && MARKET_TIMEFRAMES.includes(rawTimeframe as MarketTimeframe)
        ? (rawTimeframe as MarketTimeframe)
        : "15min";

    const snapshot = await fetchMarketSnapshot(rawPair as CurrencyPair, timeframe);
    return NextResponse.json({ snapshot });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    console.error("Market snapshot fetch failed:", error);
    return NextResponse.json({ error: "Failed to load market snapshot" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { CURRENCIES } from "@/config/trading";
import { addDays, fetchEconomicCalendar, fetchFmpEconomicCalendar } from "@/lib/market/news";
import { AuthenticationError, requireAppUserId } from "@/lib/server/auth";
import { Currency } from "@/types";

export const dynamic = "force-dynamic";

// GET /api/news
// Returns upcoming economic events
export async function GET(req: NextRequest) {
  try {
    await requireAppUserId(req);
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("News route auth failed:", error);
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const limitParam = Number(searchParams.get("limit") || "10");
  const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 50) : 10;

  try {
    const impactParam = searchParams.get("impact");
    const primaryImpact = impactParam === "high" || impactParam === "low" ? impactParam : "medium";
    const currencyParams = searchParams
      .getAll("currency")
      .flatMap((value) => value.split(","))
      .map((value) => value.trim().toUpperCase())
      .filter((value): value is Currency => CURRENCIES.includes(value as Currency));

    const attempts: Array<{
      minimumImpact: "high" | "medium" | "low";
      extendDays?: number;
    }> = [
      { minimumImpact: primaryImpact },
      { minimumImpact: "low" },
      { minimumImpact: "low", extendDays: 7 },
    ];

    const currencies = currencyParams.length > 0 ? currencyParams : undefined;

    for (const attempt of attempts) {
      const to = attempt.extendDays ? addDays(new Date(), attempt.extendDays) : undefined;
      const options = {
        currencies,
        limit,
        minimumImpact: attempt.minimumImpact,
        to,
      } as const;

      const fmpEvents = await fetchFmpEconomicCalendar(options).catch((error) => {
        console.error("FMP news fetch failed:", error);
        return [];
      });

      if (fmpEvents.length > 0) {
        return NextResponse.json({
          events: fmpEvents,
          source: "fmp",
          fallback: false,
          minimumImpact: attempt.minimumImpact,
          window: attempt.extendDays ? `today+${attempt.extendDays}d` : "today+3d",
        });
      }

      const teEvents = await fetchEconomicCalendar(options).catch((error) => {
        console.error("TradingEconomics news fetch failed:", error);
        return [];
      });

      if (teEvents.length > 0) {
        return NextResponse.json({
          events: teEvents,
          source: "tradingeconomics",
          fallback: false,
          minimumImpact: attempt.minimumImpact,
          window: attempt.extendDays ? `today+${attempt.extendDays}d` : "today+3d",
        });
      }
    }

    return NextResponse.json({
      events: [],
      source: "none",
      fallback: false,
      error: "No upcoming events returned from providers.",
    });
  } catch (error) {
    console.error("News fetch failed:", error);
    return NextResponse.json({ error: "News feed unavailable" }, { status: 503 });
  }
}

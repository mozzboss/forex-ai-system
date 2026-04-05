import { NextRequest, NextResponse } from "next/server";
import { CURRENCIES } from "@/config/trading";
import { fetchEconomicCalendar, getFallbackNewsEvents } from "@/lib/market/news";
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
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const limitParam = Number(searchParams.get("limit") || "10");
  const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 50) : 10;

  try {
    const impact = searchParams.get("impact") === "high" ? "high" : "medium";
    const currencyParams = searchParams
      .getAll("currency")
      .flatMap((value) => value.split(","))
      .map((value) => value.trim().toUpperCase())
      .filter((value): value is Currency => CURRENCIES.includes(value as Currency));

    const events = await fetchEconomicCalendar({
      currencies: currencyParams.length > 0 ? currencyParams : undefined,
      limit,
      minimumImpact: impact,
    });

    return NextResponse.json({
      events,
      source: "tradingeconomics",
      fallback: false,
    });
  } catch (error) {
    console.error("News fetch failed, using fallback feed:", error);

    return NextResponse.json({
      events: getFallbackNewsEvents().slice(0, limit),
      source: "fallback",
      fallback: true,
    });
  }
}

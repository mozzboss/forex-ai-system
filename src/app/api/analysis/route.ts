import { NextRequest, NextResponse } from "next/server";
import { analyzeMarket } from "@/lib/ai/engine";
import { derivePairDecisionSignal, shouldSendDecisionAlert } from "@/lib/market/decision";
import { formatNewsContextForAnalysis, fetchEconomicCalendar, getPairCurrencies } from "@/lib/market/news";
import { fetchMultiTimeframeContext } from "@/lib/market/prices";
import { shouldAllowTrade } from "@/lib/market/denial";
import { AuthenticationError, requireAppUserId } from "@/lib/server/auth";
import { getTelegramAlertTarget, listAccounts } from "@/lib/server/persistence";
import { formatDecisionSignalAlert, sendTelegramMessage } from "@/lib/telegram/service";
import { CurrencyPair } from "@/types";
import { analysisRequestSchema } from "@/lib/validation/api";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST /api/analysis
// Body: { pair: string, marketData?: string }
export async function POST(req: NextRequest) {
  // During static build, avoid calling external APIs/DB
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return NextResponse.json(
      { error: "Analysis unavailable during static build" },
      { status: 503 }
    );
  }
  try {
    const userId = await requireAppUserId(req);
    const body = await req.json();
    const parsed = analysisRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid analysis payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { pair, marketData } = parsed.data as {
      pair: CurrencyPair;
      marketData?: string;
    };
    const accounts = (await listAccounts(userId)).filter((account) => account.isActive);

    if (accounts.length === 0) {
      return NextResponse.json(
        { error: "No active accounts available for analysis." },
        { status: 400 }
      );
    }

    let enrichedMarketData = marketData;

    try {
      const [mtfContext, pairNewsEvents] = await Promise.all([
        fetchMultiTimeframeContext(pair),
        fetchEconomicCalendar({
          currencies: getPairCurrencies(pair),
          limit: 6,
          minimumImpact: "medium",
        }),
      ]);

      const newsContext = formatNewsContextForAnalysis(pairNewsEvents, pair);
      enrichedMarketData = [marketData, mtfContext.formattedContext, newsContext].filter(Boolean).join("\n\n");
    } catch (newsError) {
      console.error("Analysis market/news enrichment failed:", newsError);
      enrichedMarketData = [
        marketData,
        `Live market or economic calendar feed for ${pair} is unavailable. Treat both price and news confidence as lower until verified manually.`,
      ]
        .filter(Boolean)
        .join("\n\n");
    }

    // Run full AI analysis
    const analysis = await analyzeMarket(pair, accounts, enrichedMarketData || undefined);
    const decisionSignal = derivePairDecisionSignal(analysis);

    // Run denial checks per account
    const denialResults: Record<string, ReturnType<typeof shouldAllowTrade>> = {};
    for (const account of accounts) {
      denialResults[account.id] = shouldAllowTrade(analysis, account);
    }

    if (shouldSendDecisionAlert(decisionSignal.mode)) {
      try {
        const chatId = await getTelegramAlertTarget(userId);
        if (chatId) {
          await sendTelegramMessage(chatId, formatDecisionSignalAlert(pair, decisionSignal));
        }
      } catch (telegramError) {
        console.error("Analysis decision alert failed:", telegramError);
      }
    }

    return NextResponse.json({
      analysis,
      denialResults,
      decisionSignal,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Analysis failed. Capital protection mode: do not trade." },
      { status: 500 }
    );
  }
}

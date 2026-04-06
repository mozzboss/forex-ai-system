import { NextRequest, NextResponse } from "next/server";
import { analyzeMarket } from "@/lib/ai/engine";
import { derivePairDecisionSignal, shouldSendDecisionAlert } from "@/lib/market/decision";
import { formatNewsContextForAnalysis, fetchEconomicCalendar, getPairCurrencies } from "@/lib/market/news";
import { fetchMarketSnapshot, formatMarketContextForAnalysis } from "@/lib/market/prices";
import { shouldAllowTrade } from "@/lib/market/denial";
import { AuthenticationError, requireAppUserId } from "@/lib/server/auth";
import { getAnalysisHistory, getTelegramAlertTarget, saveAnalysisLog } from "@/lib/server/persistence";
import { formatDecisionSignalAlert, sendTelegramMessage } from "@/lib/telegram/service";
import { CurrencyPair, TradingAccount } from "@/types";
import { analysisRequestSchema } from "@/lib/validation/api";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Server-side per-user+pair cooldown — prevents burning API credits on rapid re-runs.
// Stored in process memory; clears on restart (intentional — restarts are rare, sessions are not).
const ANALYSIS_COOLDOWN_MS = 3 * 60 * 1000; // 3 minutes
const analysisCooldowns = new Map<string, number>();

function checkAnalysisCooldown(userId: string, pair: string): { blocked: boolean; retryAfterSecs: number } {
  const key = `${userId}:${pair}`;
  const last = analysisCooldowns.get(key);
  if (!last) return { blocked: false, retryAfterSecs: 0 };
  const elapsed = Date.now() - last;
  if (elapsed >= ANALYSIS_COOLDOWN_MS) return { blocked: false, retryAfterSecs: 0 };
  return { blocked: true, retryAfterSecs: Math.ceil((ANALYSIS_COOLDOWN_MS - elapsed) / 1000) };
}

function recordAnalysisRun(userId: string, pair: string) {
  analysisCooldowns.set(`${userId}:${pair}`, Date.now());
}

function getAnalysisErrorDetails(error: unknown): { message: string; status: number } {
  const status = typeof (error as { status?: unknown })?.status === "number"
    ? (error as { status: number }).status
    : 500;

  const providerMessage =
    typeof (error as { error?: { error?: { message?: unknown } } })?.error?.error?.message === "string"
      ? (error as { error: { error: { message: string } } }).error.error.message
      : typeof (error as { error?: { message?: unknown } })?.error?.message === "string"
        ? (error as { error: { message: string } }).error.message
        : null;

  const rawMessage = providerMessage || (error instanceof Error ? error.message : "");

  if (/ANTHROPIC_API_KEY is not set/i.test(rawMessage)) {
    return {
      message: "ANTHROPIC_API_KEY is missing. Add it to Vercel environment variables and redeploy.",
      status: 503,
    };
  }

  if (/credit balance is too low/i.test(rawMessage)) {
    return {
      message: "Anthropic API credits are too low. Add credits or upgrade your Anthropic plan, then run pair analysis again.",
      status: 402,
    };
  }

  if (/invalid api key|authentication/i.test(rawMessage)) {
    return {
      message: "Anthropic API authentication failed. Check ANTHROPIC_API_KEY in .env.local.",
      status: 401,
    };
  }

  if (/rate limit/i.test(rawMessage)) {
    return {
      message: "Anthropic rate limit reached. Wait a moment, then run pair analysis again.",
      status: 429,
    };
  }

  if (/prisma|database|db|connection|ECONNREFUSED|ETIMEDOUT/i.test(rawMessage)) {
    return {
      message: "Database connection failed during analysis. Check DATABASE_URL in Vercel environment variables.",
      status: 503,
    };
  }

  if (/JSON|parse|unexpected token/i.test(rawMessage)) {
    return {
      message: "AI response could not be parsed. This is usually transient — try again in a moment.",
      status: 502,
    };
  }

  if (providerMessage) {
    return {
      message: providerMessage,
      status,
    };
  }

  return {
    message: `Analysis failed: ${rawMessage || "unknown error"}. Capital protection mode: do not trade.`,
    status,
  };
}

// GET /api/analysis?pair=EURUSD&limit=5
export async function GET(req: NextRequest) {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return NextResponse.json({ history: [] });
  }
  try {
    const userId = await requireAppUserId(req);
    const { searchParams } = new URL(req.url);
    const pair = searchParams.get("pair") as CurrencyPair | null;
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "5", 10), 20);

    if (!pair) {
      return NextResponse.json({ error: "pair is required" }, { status: 400 });
    }

    const history = await getAnalysisHistory(userId, pair, limit);
    return NextResponse.json({ history });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ history: [] });
  }
}

// POST /api/analysis
// Body: { pair: string, accounts: TradingAccount[], marketData?: string }
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

    const { pair, accounts, marketData } = parsed.data as {
      pair: CurrencyPair;
      accounts: TradingAccount[];
      marketData?: string;
    };

    const cooldown = checkAnalysisCooldown(userId, pair);
    if (cooldown.blocked) {
      return NextResponse.json(
        { error: `Analysis ran recently. Wait ${cooldown.retryAfterSecs}s before re-running ${pair}.` },
        { status: 429 }
      );
    }

    let enrichedMarketData = marketData;

    try {
      const marketSnapshot = await fetchMarketSnapshot(pair);
      const pairNewsEvents = await fetchEconomicCalendar({
        currencies: getPairCurrencies(pair),
        limit: 6,
        minimumImpact: "medium",
      });

      const marketContext = formatMarketContextForAnalysis(marketSnapshot);
      const newsContext = formatNewsContextForAnalysis(pairNewsEvents, pair);
      enrichedMarketData = [marketData, marketContext, newsContext].filter(Boolean).join("\n\n");
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

    recordAnalysisRun(userId, pair);
    void saveAnalysisLog(userId, pair, analysis);
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

    const rawErr = error instanceof Error ? error.message : String(error);
    console.error("Analysis error:", rawErr, error);
    const failure = getAnalysisErrorDetails(error);
    return NextResponse.json(
      { error: failure.message },
      { status: failure.status }
    );
  }
}

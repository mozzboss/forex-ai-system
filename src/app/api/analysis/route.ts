import { NextRequest, NextResponse } from "next/server";
import { analyzeMarket } from "@/lib/ai/engine";
import { derivePairDecisionSignal, shouldSendDecisionAlert } from "@/lib/market/decision";
import { formatNewsContextForAnalysis, fetchEconomicCalendar, getPairCurrencies } from "@/lib/market/news";
import { fetchMarketSnapshot, formatMarketContextForAnalysis } from "@/lib/market/prices";
import { shouldAllowTrade } from "@/lib/market/denial";
import { AuthenticationError, requireAppUserId } from "@/lib/server/auth";
import { getAnalysisHistory, getLastConfirmedAnalysisForPair, getTelegramAlertTarget, saveAnalysisLog } from "@/lib/server/persistence";
import { formatDecisionSignalAlert, formatMissedZoneAlert, formatReadyAlert, sendTelegramMessage } from "@/lib/telegram/service";
import { CurrencyPair, TradingAccount } from "@/types";
import { analysisRequestSchema } from "@/lib/validation/api";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Server-side per-user+pair cooldown — prevents burning API credits on rapid re-runs.
// Stored in process memory; clears on restart (intentional — restarts are rare, sessions are not).
const ANALYSIS_COOLDOWN_MS = 3 * 60 * 1000; // 3 minutes
const READY_ALERT_COOLDOWN_MS = 30 * 60 * 1000; // 30 minutes — prevents spam on slow-forming setups
const COOLDOWN_MAP_MAX = 5000; // prune when map grows beyond this
const COOLDOWN_PRUNE_AGE_MS = 24 * 60 * 60 * 1000; // drop entries older than 24h
const analysisCooldowns = new Map<string, number>();
const readyAlertCooldowns = new Map<string, number>();

function pruneMap(map: Map<string, number>) {
  if (map.size < COOLDOWN_MAP_MAX) return;
  const cutoff = Date.now() - COOLDOWN_PRUNE_AGE_MS;
  for (const [k, v] of map) {
    if (v < cutoff) map.delete(k);
  }
}

function checkAnalysisCooldown(userId: string, pair: string): { blocked: boolean; retryAfterSecs: number } {
  const key = `${userId}:${pair}`;
  const last = analysisCooldowns.get(key);
  if (!last) return { blocked: false, retryAfterSecs: 0 };
  const elapsed = Date.now() - last;
  if (elapsed >= ANALYSIS_COOLDOWN_MS) return { blocked: false, retryAfterSecs: 0 };
  return { blocked: true, retryAfterSecs: Math.ceil((ANALYSIS_COOLDOWN_MS - elapsed) / 1000) };
}

function recordAnalysisRun(userId: string, pair: string) {
  pruneMap(analysisCooldowns);
  analysisCooldowns.set(`${userId}:${pair}`, Date.now());
}

function getAnalysisErrorDetails(error: unknown): { message: string; status: number } {
  const status = typeof (error as { status?: unknown })?.status === "number"
    ? (error as { status: number }).status
    : 500;

  // SDK 0.82+ wraps API errors as APIError with .message directly on the instance.
  // Also handle legacy nested shape: error.error.error.message / error.error.message
  const providerMessage =
    typeof (error as { error?: { error?: { message?: unknown } } })?.error?.error?.message === "string"
      ? (error as { error: { error: { message: string } } }).error.error.message
      : typeof (error as { error?: { message?: unknown } })?.error?.message === "string"
        ? (error as { error: { message: string } }).error.message
        : null;

  const rawMessage = providerMessage || (error instanceof Error ? error.message : String(error));

  if (/ANTHROPIC_API_KEY is not set/i.test(rawMessage)) {
    return {
      message: "No AI provider key is configured. Add ANTHROPIC_API_KEY or OPENAI_API_KEY in environment variables and redeploy.",
      status: 503,
    };
  }

  if (/OPENAI_API_KEY is not set|No AI provider succeeded/i.test(rawMessage)) {
    return {
      message: "AI providers are not configured. Add ANTHROPIC_API_KEY and/or OPENAI_API_KEY in environment variables.",
      status: 503,
    };
  }

  if (/credit balance is too low/i.test(rawMessage)) {
    return {
      message: "Anthropic API credits are too low. Add credits or upgrade your Anthropic plan, then run pair analysis again.",
      status: 402,
    };
  }

  if (/invalid.?x?-?api.?key|invalid api key|authentication_error|Could not resolve authentication/i.test(rawMessage)) {
    return {
      message: "AI provider authentication failed. Check ANTHROPIC_API_KEY and OPENAI_API_KEY in environment variables.",
      status: 401,
    };
  }

  if (/rate.?limit|too.?many.?requests/i.test(rawMessage)) {
    return {
      message: "AI provider rate limit reached. Wait a moment, then run pair analysis again.",
      status: 429,
    };
  }

  if (/overloaded|529/i.test(rawMessage) || status === 529) {
    return {
      message: "Anthropic API is currently overloaded. Try again in a minute.",
      status: 503,
    };
  }

  if (/prisma|database|db|connection|ECONNREFUSED|ETIMEDOUT|EMAXCONN|max clients|session mode/i.test(rawMessage)) {
    return {
      message: "Database connection failed during analysis. Check DATABASE_URL in Vercel — use pooler URL (port 6543, pgbouncer=true).",
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
    message: `Analysis failed: ${rawMessage || "unknown error"}.`,
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

    // Fetch Telegram target once — reused for all alerts below
    let telegramChatId: string | null = null;
    try {
      telegramChatId = await getTelegramAlertTarget(userId);
    } catch {
      // Non-critical — alerts are best-effort
    }

    if (telegramChatId) {
      // Check if there was a missed confirmed zone from the previous analysis run
      try {
        const missedZone = await getLastConfirmedAnalysisForPair(userId, pair);
        if (missedZone) {
          void sendTelegramMessage(telegramChatId, formatMissedZoneAlert(pair, missedZone));
        }
      } catch (missedZoneError) {
        console.error("Missed zone check failed:", missedZoneError);
      }

      if (shouldSendDecisionAlert(decisionSignal.mode)) {
        try {
          await sendTelegramMessage(telegramChatId, formatDecisionSignalAlert(pair, decisionSignal));
        } catch (telegramError) {
          console.error("Analysis decision alert failed:", telegramError);
        }
      }

      if (analysis.entryStatus.status === "READY") {
        const readyKey = `${userId}:${pair}`;
        const lastReady = readyAlertCooldowns.get(readyKey) ?? 0;
        if (Date.now() - lastReady >= READY_ALERT_COOLDOWN_MS) {
          try {
            await sendTelegramMessage(
              telegramChatId,
              formatReadyAlert(pair, decisionSignal, analysis.entryStatus.whatMustHappenNext)
            );
            pruneMap(readyAlertCooldowns);
            readyAlertCooldowns.set(readyKey, Date.now());
          } catch (readyAlertError) {
            console.error("Ready alert failed:", readyAlertError);
          }
        }
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
    console.error("Analysis error:", rawErr, {
      type: (error as { constructor?: { name?: string } })?.constructor?.name,
      status: (error as { status?: unknown })?.status,
      errorBody: (error as { error?: unknown })?.error,
      stack: error instanceof Error ? error.stack : undefined,
    });
    const failure = getAnalysisErrorDetails(error);
    return NextResponse.json(
      { error: failure.message },
      { status: failure.status }
    );
  }
}

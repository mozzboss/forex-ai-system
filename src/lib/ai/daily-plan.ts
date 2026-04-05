import Anthropic from "@anthropic-ai/sdk";

import { ALL_PAIRS, MAJOR_PAIRS, TRADING_CONFIG } from "@/config/trading";
import type {
  CurrencyPair,
  DailyPlanContext,
  GeneratedDailyPlan,
  NewsEvent,
} from "@/types";

const PLAN_MODEL = "claude-sonnet-4-6";

function uniquePairs(pairs: CurrencyPair[]) {
  return Array.from(new Set(pairs));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getPairCandidates(context: DailyPlanContext): CurrencyPair[] {
  const activePairs = context.openTrades.map((trade) => trade.pair);
  const eventCurrencies = context.upcomingEvents.map((event) => event.currency);
  const eventPairs = ALL_PAIRS.filter((pair) => {
    const base = pair.slice(0, 3);
    const quote = pair.slice(3, 6);
    return eventCurrencies.includes(base as NewsEvent["currency"]) || eventCurrencies.includes(quote as NewsEvent["currency"]);
  });

  const fallbackPairs: CurrencyPair[] = ["EURUSD", "GBPUSD", "XAUUSD", "USDJPY", "AUDUSD"];

  return uniquePairs([...activePairs, ...eventPairs, ...fallbackPairs]).slice(0, TRADING_CONFIG.maxWatchlistPairs);
}

function formatEvent(event: NewsEvent) {
  return `${event.currency} ${event.event} at ${event.time.toISOString()} (${event.impact})`;
}

function getPreferredMaxTrades(context: DailyPlanContext) {
  if (context.accounts.length === 0) {
    return 1;
  }

  return context.accounts.reduce((currentMin, account) => {
    const remaining = Math.max(account.maxTradesPerDay - account.currentDailyTrades, 0);
    return Math.min(currentMin, remaining || 1);
  }, Number.POSITIVE_INFINITY);
}

function buildFallbackPlan(context: DailyPlanContext): GeneratedDailyPlan {
  const watchlist = getPairCandidates(context);
  const highImpactEvents = context.upcomingEvents.filter((event) => event.impact === "high");
  const maxTrades = clamp(getPreferredMaxTrades(context), 1, 3);
  const sessionFocus = highImpactEvents.length > 0
    ? "Wait until high-impact releases clear and only focus on clean London or New York continuation setups."
    : "Prioritize London and overlap session structure. Stay patient if the market opens messy.";

  const priorReviewFocus =
    context.priorReview?.tomorrowFocus?.slice(0, 2).join(" ") ||
    "Only act on CONFIRMED status. No stop loss means no trade.";

  return {
    date: context.date,
    pairs: watchlist,
    macroBias:
      highImpactEvents.length > 0
        ? `News-heavy session. Bias should stay flexible until ${highImpactEvents[0].currency} ${highImpactEvents[0].event} is out of the way.`
        : "Moderate conviction session. Favor continuation over prediction and let clean structure lead.",
    keyLevels: watchlist
      .map((pair) => `${pair}: mark prior day high and low, session range extremes, and nearest H4 structure before execution.`)
      .join(" "),
    newsEvents:
      highImpactEvents.length > 0
        ? highImpactEvents.slice(0, 3).map(formatEvent).join(" | ")
        : "No major high-impact releases are dominating the near-term session. Keep the normal 30-minute buffer anyway.",
    sessionFocus,
    maxTrades,
    planNotes: [
      `Watchlist: ${watchlist.join(", ") || "none selected"}.`,
      `Max planned executions today: ${maxTrades}.`,
      priorReviewFocus,
    ].join(" "),
  };
}

function serializePlanContext(context: DailyPlanContext) {
  return JSON.stringify(
    {
      date: context.date.toISOString(),
      accounts: context.accounts.map((account) => ({
        name: account.name,
        mode: account.mode,
        balance: account.balance,
        equity: account.equity,
        riskPercent: account.riskPercent,
        currentDailyTrades: account.currentDailyTrades,
        maxTradesPerDay: account.maxTradesPerDay,
        currentDailyLoss: account.currentDailyLoss,
        maxDailyLoss: account.maxDailyLoss,
        lossesInARow: account.lossesInARow,
      })),
      openTrades: context.openTrades.map((trade) => ({
        pair: trade.pair,
        direction: trade.direction,
        status: trade.status,
        entryStatus: trade.entryStatus,
        aiScore: trade.aiScore,
        notes: trade.notes || null,
      })),
      upcomingEvents: context.upcomingEvents.map((event) => ({
        time: event.time.toISOString(),
        currency: event.currency,
        event: event.event,
        impact: event.impact,
      })),
      priorReview: context.priorReview
        ? {
            disciplineScore: context.priorReview.disciplineScore,
            headline: context.priorReview.headline,
            riskFlags: context.priorReview.riskFlags,
            tomorrowFocus: context.priorReview.tomorrowFocus,
          }
        : null,
    },
    null,
    2
  );
}

function coercePlanShape(candidate: unknown, fallback: GeneratedDailyPlan): GeneratedDailyPlan {
  if (!candidate || typeof candidate !== "object") {
    return fallback;
  }

  const value = candidate as Partial<GeneratedDailyPlan>;
  const validPairs = Array.isArray(value.pairs)
    ? value.pairs.filter((pair): pair is CurrencyPair => typeof pair === "string" && ALL_PAIRS.includes(pair as CurrencyPair))
    : [];

  return {
    date: fallback.date,
    pairs: validPairs.length > 0 ? uniquePairs(validPairs).slice(0, TRADING_CONFIG.maxWatchlistPairs) : fallback.pairs,
    macroBias: typeof value.macroBias === "string" && value.macroBias.trim() ? value.macroBias.trim() : fallback.macroBias,
    keyLevels: typeof value.keyLevels === "string" && value.keyLevels.trim() ? value.keyLevels.trim() : fallback.keyLevels,
    newsEvents: typeof value.newsEvents === "string" && value.newsEvents.trim() ? value.newsEvents.trim() : fallback.newsEvents,
    sessionFocus: typeof value.sessionFocus === "string" && value.sessionFocus.trim() ? value.sessionFocus.trim() : fallback.sessionFocus,
    maxTrades:
      typeof value.maxTrades === "number"
        ? clamp(Math.round(value.maxTrades), 1, 3)
        : fallback.maxTrades,
    planNotes: typeof value.planNotes === "string" && value.planNotes.trim() ? value.planNotes.trim() : fallback.planNotes,
  };
}

export async function generateDailyPlan(context: DailyPlanContext): Promise<GeneratedDailyPlan> {
  const fallback = buildFallbackPlan(context);
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return fallback;
  }

  const anthropic = new Anthropic({ apiKey });
  const prompt = [
    "You are writing a disciplined forex morning plan.",
    "This is not a hype memo and not a signal sheet.",
    "Protect capital first, reduce overtrading, and keep the watchlist small.",
    "Return valid JSON only with this exact shape:",
    JSON.stringify(
      {
        pairs: MAJOR_PAIRS.slice(0, 3),
        macroBias: "Short paragraph",
        keyLevels: "Short paragraph",
        newsEvents: "Short paragraph",
        sessionFocus: "Short paragraph",
        maxTrades: 2,
        planNotes: "Concise summary of what to do and what to avoid",
      },
      null,
      2
    ),
    "Rules:",
    "- No more than 3 watchlist pairs.",
    "- Keep maxTrades between 1 and 3.",
    "- If news is heavy, explicitly slow the trader down.",
    "- Mention CONFIRMED-only execution logic implicitly or explicitly.",
    "- Use today's context only. Do not invent price levels or macro facts you were not given.",
    "",
    "Context:",
    serializePlanContext(context),
  ].join("\n");

  try {
    const response = await anthropic.messages.create({
      model: PLAN_MODEL,
      max_tokens: 1200,
      system:
        "You are a disciplined trading planner. Be practical, selective, and conservative. Output JSON only.",
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("");
    const cleaned = text.replace(/```json?|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return coercePlanShape(parsed, fallback);
  } catch (error) {
    console.error("Daily plan AI generation failed, using fallback plan:", error);
    return fallback;
  }
}

import Anthropic from "@anthropic-ai/sdk";

import { ALL_PAIRS } from "@/config/trading";
import type {
  Bias,
  Currency,
  CurrencyPair,
  EntryStatus,
  NewsAnalysisResult,
  TradeDirection,
} from "@/types";

export interface NewsAnalysisInput {
  headline: string;
  summary: string;
  pair?: CurrencyPair;
  currentPrice?: number;
}

const CURRENCIES: Currency[] = ["USD", "EUR", "GBP", "JPY", "CHF", "AUD", "NZD", "CAD"];

const NEWS_SYSTEM_PROMPT = `You are a senior Forex macro analyst. Your job is to read a news headline and summary and produce a structured trading signal.

RULES (non-negotiable):
1. Capital protection is priority #1. When in doubt, output WAIT.
2. A news headline alone is NEVER CONFIRMED. At best it is READY. Only output CONFIRMED if clear price action confirmation was described in the summary.
3. If no current price is provided, set tradeIdea to null. Never invent price levels.
4. Score < 7 means decision must be DENY.
5. decision TAKE_TRADE requires entryStatus CONFIRMED and score >= 7.
6. Be conservative — most news events score 4–6. Only break news with immediate clear directional impact scores above 7.

Respond in valid JSON only — no markdown, no explanation outside the JSON.`;

function buildNewsPrompt(input: NewsAnalysisInput): string {
  const priceContext = input.currentPrice
    ? `Current price: ${input.currentPrice}`
    : "No current price provided — do not invent price levels, set tradeIdea to null.";

  const pairContext = input.pair
    ? `Affected pair: ${input.pair}`
    : `No pair specified — infer the most affected major pair from the following list only: ${ALL_PAIRS.join(", ")}. If unclear, set tradingBias.pair to null.`;

  return `Analyze this news and produce a structured trading signal.

HEADLINE: ${input.headline}
SUMMARY: ${input.summary || "No additional summary provided."}
${pairContext}
${priceContext}

Respond with ONLY this JSON (no markdown):
{
  "newsSummary": "1–2 sentence plain-language recap of what happened",
  "marketImpact": {
    "strongerCurrency": "USD|EUR|GBP|JPY|CHF|AUD|NZD|CAD",
    "weakerCurrency": "USD|EUR|GBP|JPY|CHF|AUD|NZD|CAD",
    "reasoning": "one sentence explaining the causal link"
  },
  "tradingBias": {
    "pair": "EURUSD|GBPUSD|USDJPY|USDCHF|AUDUSD|NZDUSD|USDCAD|XAUUSD|null",
    "bias": "bullish|bearish|neutral",
    "confidence": "low|medium|high"
  },
  "entryStatus": "WAIT|READY|CONFIRMED|INVALID",
  "entryStatusReason": "why this status was assigned",
  "tradeIdea": null,
  "riskNotes": {
    "upcomingNews": "other events to watch in the next 24h",
    "fakeoutRisk": "likelihood and reason for a fakeout move",
    "volatilityWarning": "expected volatility and how to manage it"
  },
  "proInsight": {
    "shortTermView": "what likely happens in the next few hours",
    "longTermView": "what this means over the next days or weeks",
    "pricedIn": false,
    "waitForConfirmation": "specific price action or condition to wait for before entering"
  },
  "finalDecision": {
    "score": 1,
    "decision": "WAIT|DENY|TAKE_TRADE",
    "reasoning": "2–3 sentences explaining the score and decision"
  }
}

If a trade idea applies (entryStatus CONFIRMED and currentPrice was provided), replace the tradeIdea null with:
{
  "direction": "LONG|SHORT",
  "entryZoneLow": 0.00000,
  "entryZoneHigh": 0.00000,
  "stopLoss": 0.00000,
  "takeProfit": 0.00000
}`;
}

const VALID_ENTRY_STATUSES: EntryStatus[] = ["WAIT", "READY", "CONFIRMED", "INVALID"];
const VALID_DECISIONS = ["WAIT", "DENY", "TAKE_TRADE"] as const;
const VALID_BIASES: Bias[] = ["bullish", "bearish", "neutral"];
const VALID_CONFIDENCES = ["low", "medium", "high"] as const;

function coerceNewsAnalysisResult(
  raw: unknown,
  input: NewsAnalysisInput
): NewsAnalysisResult {
  const v = raw as Record<string, unknown>;

  const score = typeof v?.finalDecision === "object" && v.finalDecision !== null
    ? Math.max(1, Math.min(10, Number((v.finalDecision as Record<string, unknown>).score) || 1))
    : 1;

  const rawDecision = typeof v?.finalDecision === "object" && v.finalDecision !== null
    ? String((v.finalDecision as Record<string, unknown>).decision ?? "WAIT")
    : "WAIT";

  const rawEntryStatus = String(v?.entryStatus ?? "WAIT");
  const entryStatus: EntryStatus = VALID_ENTRY_STATUSES.includes(rawEntryStatus as EntryStatus)
    ? (rawEntryStatus as EntryStatus)
    : "WAIT";

  // Enforce business rules
  let decision = VALID_DECISIONS.includes(rawDecision as typeof VALID_DECISIONS[number])
    ? (rawDecision as "WAIT" | "DENY" | "TAKE_TRADE")
    : "WAIT";
  if (score < 7) decision = "DENY";
  if (decision === "TAKE_TRADE" && entryStatus !== "CONFIRMED") decision = "WAIT";

  // Downgrade CONFIRMED to READY when no current price was provided
  const resolvedEntryStatus: EntryStatus =
    entryStatus === "CONFIRMED" && !input.currentPrice ? "READY" : entryStatus;

  const rawBias = String((v?.tradingBias as Record<string, unknown> | null)?.bias ?? "neutral");
  const bias: Bias = VALID_BIASES.includes(rawBias as Bias) ? (rawBias as Bias) : "neutral";

  const rawConfidence = String((v?.tradingBias as Record<string, unknown> | null)?.confidence ?? "low");
  const confidence = VALID_CONFIDENCES.includes(rawConfidence as typeof VALID_CONFIDENCES[number])
    ? (rawConfidence as "low" | "medium" | "high")
    : "low";

  const rawPair = (v?.tradingBias as Record<string, unknown> | null)?.pair;
  const pair: CurrencyPair | null =
    typeof rawPair === "string" && ALL_PAIRS.includes(rawPair as CurrencyPair)
      ? (rawPair as CurrencyPair)
      : input.pair ?? null;

  const rawImpact = (v?.marketImpact ?? {}) as Record<string, unknown>;
  const strongerCurrency = CURRENCIES.includes(String(rawImpact.strongerCurrency) as Currency)
    ? (String(rawImpact.strongerCurrency) as Currency)
    : "USD";
  const weakerCurrency = CURRENCIES.includes(String(rawImpact.weakerCurrency) as Currency)
    ? (String(rawImpact.weakerCurrency) as Currency)
    : "EUR";

  // Only include trade idea if currentPrice was provided and conditions allow
  let tradeIdea: NewsAnalysisResult["tradeIdea"] = null;
  if (input.currentPrice && decision === "TAKE_TRADE" && v?.tradeIdea && typeof v.tradeIdea === "object") {
    const t = v.tradeIdea as Record<string, unknown>;
    const rawDir = String(t.direction ?? "LONG");
    const direction: TradeDirection = rawDir === "SHORT" ? "SHORT" : "LONG";
    const low = Number(t.entryZoneLow);
    const high = Number(t.entryZoneHigh);
    const sl = Number(t.stopLoss);
    const tp = Number(t.takeProfit);
    if (low > 0 && high > 0 && sl > 0 && tp > 0) {
      tradeIdea = { direction, entryZoneLow: low, entryZoneHigh: high, stopLoss: sl, takeProfit: tp };
    }
  }

  const rawRisk = (v?.riskNotes ?? {}) as Record<string, unknown>;
  const rawInsight = (v?.proInsight ?? {}) as Record<string, unknown>;
  const rawFinal = (v?.finalDecision ?? {}) as Record<string, unknown>;

  return {
    headline: input.headline,
    summary: input.summary,
    pair: pair,
    analyzedAt: new Date(),
    newsSummary: String(v?.newsSummary || input.headline),
    marketImpact: {
      strongerCurrency,
      weakerCurrency,
      reasoning: String(rawImpact.reasoning || "Impact unclear."),
    },
    tradingBias: { pair, bias, confidence },
    entryStatus: resolvedEntryStatus,
    entryStatusReason: String(v?.entryStatusReason || "See analysis."),
    tradeIdea,
    riskNotes: {
      upcomingNews: String(rawRisk.upcomingNews || "Monitor economic calendar."),
      fakeoutRisk: String(rawRisk.fakeoutRisk || "Unknown."),
      volatilityWarning: String(rawRisk.volatilityWarning || "Expect elevated volatility."),
    },
    proInsight: {
      shortTermView: String(rawInsight.shortTermView || "Unclear."),
      longTermView: String(rawInsight.longTermView || "Unclear."),
      pricedIn: Boolean(rawInsight.pricedIn),
      waitForConfirmation: String(rawInsight.waitForConfirmation || "Wait for price action confirmation."),
    },
    finalDecision: {
      score,
      decision,
      reasoning: String(rawFinal.reasoning || "Insufficient information for a high-confidence signal."),
    },
  };
}

function buildFallbackResult(input: NewsAnalysisInput): NewsAnalysisResult {
  return {
    headline: input.headline,
    summary: input.summary,
    pair: input.pair ?? null,
    analyzedAt: new Date(),
    newsSummary: input.headline,
    marketImpact: { strongerCurrency: "USD", weakerCurrency: "EUR", reasoning: "Analysis unavailable." },
    tradingBias: { pair: input.pair ?? null, bias: "neutral", confidence: "low" },
    entryStatus: "WAIT",
    entryStatusReason: "Analysis failed — treat as no signal.",
    tradeIdea: null,
    riskNotes: {
      upcomingNews: "Check economic calendar manually.",
      fakeoutRisk: "Unknown — analysis unavailable.",
      volatilityWarning: "Cannot assess.",
    },
    proInsight: {
      shortTermView: "Cannot assess.",
      longTermView: "Cannot assess.",
      pricedIn: false,
      waitForConfirmation: "Do not trade without a fresh analysis.",
    },
    finalDecision: { score: 1, decision: "DENY", reasoning: "Analysis failed. No signal produced." },
  };
}

export async function analyzeNews(input: NewsAnalysisInput): Promise<NewsAnalysisResult> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY is not set");

  const anthropic = new Anthropic({ apiKey: key });

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      system: NEWS_SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildNewsPrompt(input) }],
    });

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    const cleaned = text.replace(/```json?|```/g, "").trim();
    return coerceNewsAnalysisResult(JSON.parse(cleaned), input);
  } catch {
    return buildFallbackResult(input);
  }
}

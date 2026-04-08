import {
  CurrencyPair,
  FullAnalysis,
  TradingAccount,
  RiskOutput,
} from "@/types";
import { calculateRisk, validateTradeAgainstAccount } from "@/lib/risk/engine";
import { TRADING_CONFIG } from "@/config/trading";
import { prisma } from "@/lib/prisma";
import { generateAiText } from "@/lib/ai/providers";

const CACHE_TTL_MINUTES = 15;

// ============================================================
// AI DECISION ENGINE
// Uses hybrid provider routing (Claude + ChatGPT fallback).
// ============================================================

const SYSTEM_PROMPT = `You are a senior Forex trading analyst applying institutional-grade discipline. Your job is to analyze a currency pair and produce a structured, honest decision — not to find a trade.

CORE PRINCIPLES (non-negotiable):
1. Capital protection is priority #1. When in doubt, WAIT or DENY.
2. "No trade" is a valid outcome. Score it honestly; do not inflate to justify entry.
3. Every entry suggestion requires a stop loss. No SL = no trade.
4. Entry is only allowed at CONFIRMED status. WAIT and READY are not entry signals.
5. Always explain WHY — vague reasoning is a red flag, not a safety net.

SCORING RUBRIC (be strict — most setups score below 7):
- 9–10: All layers aligned (macro + sentiment + structure + session + news clear). Textbook entry with confluent confirmation. Rare.
- 7–8:  Most layers agree, minor conflict. Clear structure, valid R:R, low news risk. Actionable with full confirmation.
- 5–6:  Mixed signals or one layer strongly opposes. Setup exists but conditions are not favourable. WAIT.
- 3–4:  Weak structure, conflicting bias, or choppy market. Setup quality is poor. DENY.
- 1–2:  No identifiable setup, or multiple layers in direct conflict. DENY immediately.

ENTRY STATUS LOGIC:
- WAIT: Structure forming but no trigger event yet. Monitor only.
- READY: Key level reached, watching for candle confirmation. Do not enter yet.
- CONFIRMED: Clear price action trigger at valid level with all filters aligned. May execute.
- INVALID: Setup broken by price action, news, or conflicting move. Cancel.

You must respond in valid JSON only — no markdown, no explanation outside JSON. Be precise with price levels to the correct pip decimal for the pair.`;

// --- Analysis Cache ---

async function getCachedAnalysisText(pair: CurrencyPair): Promise<string | null> {
  try {
    const cached = await prisma.analysisCache.findFirst({
      where: { pair, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    });
    return cached?.analysis ?? null;
  } catch {
    return null;
  }
}

async function saveAnalysisToCache(pair: CurrencyPair, text: string): Promise<void> {
  try {
    const now = new Date();
    const expiresAt = new Date(Date.now() + CACHE_TTL_MINUTES * 60 * 1000);
    await prisma.$transaction([
      // Evict all globally expired entries (keeps table from growing unbounded)
      prisma.analysisCache.deleteMany({ where: { expiresAt: { lte: now } } }),
      prisma.analysisCache.create({
        data: { pair, analysis: text, expiresAt },
      }),
    ]);
  } catch {
    // Non-critical — swallow so a cache write failure never breaks analysis
  }
}

/**
 * Run full analysis on a currency pair.
 * Checks AnalysisCache first (15-min TTL) before calling the configured AI provider chain.
 */
export async function analyzeMarket(
  pair: CurrencyPair,
  accounts: TradingAccount[],
  marketData?: string // optional raw market data context
): Promise<FullAnalysis> {
  // Cache hit: re-parse with current accounts (risk is account-specific, not cached)
  const cached = await getCachedAnalysisText(pair);
  if (cached) {
    return parseAnalysisResponse(cached, pair, accounts);
  }

  const prompt = buildAnalysisPrompt(pair, accounts, marketData);

  const { text } = await generateAiText({
    systemPrompt: SYSTEM_PROMPT,
    userPrompt: prompt,
    maxTokens: 4096,
    temperature: 0.2,
  });

  // Save to cache (non-blocking)
  void saveAnalysisToCache(pair, text);

  return parseAnalysisResponse(text, pair, accounts);
}

/**
 * Quick pair check - lighter than full analysis.
 */
export async function quickPairCheck(
  pair: CurrencyPair
): Promise<{ bias: string; score: number; summary: string }> {
  const { text } = await generateAiText({
    systemPrompt: SYSTEM_PROMPT,
    userPrompt: `Quick analysis of ${pair}. Consider macro bias, price structure, and current session. Be honest - most pairs score below 7 right now.\n\nRespond in JSON only: { "bias": "bullish|bearish|neutral", "score": 1-10, "summary": "1-2 sentences covering bias, key level, and whether it is worth watching now" }`,
    maxTokens: 1024,
    temperature: 0.2,
  });

  try {
    return JSON.parse(text.replace(/```json?|```/g, "").trim());
  } catch {
    return { bias: "neutral", score: 5, summary: "Unable to parse analysis." };
  }
}
// --- Prompt Builder ---

function buildAnalysisPrompt(
  pair: CurrencyPair,
  accounts: TradingAccount[],
  marketData?: string
): string {
  const accountContext = accounts
    .map(
      (a) =>
        `- ${a.name} (${a.mode}): balance=$${a.balance}, risk=${a.riskPercent}%, ` +
        `daily_trades=${a.currentDailyTrades}/${a.maxTradesPerDay}, ` +
        `daily_loss=$${a.currentDailyLoss}/$${a.maxDailyLoss}, ` +
        `losses_in_row=${a.lossesInARow}, active=${a.isActive}`
    )
    .join("\n");

  const pairCurrencies = `${pair.slice(0, 3)} and ${pair.slice(3, 6)}`;

  return `Analyze ${pair} for a potential trade setup. Think through each layer in order before writing the JSON.

STEP 1 — MACRO: What is the fundamental backdrop for ${pairCurrencies}? Rate differentials, central bank bias, inflation trajectory.
STEP 2 — STRUCTURE: What does price structure say on H4 and D1? Higher highs/lows, key S/R, trend direction.
STEP 3 — SENTIMENT: Where is retail positioned? Is this a fade opportunity or trend continuation?
STEP 4 — SESSION & NEWS: Is this an active session? London (07:00–16:00 UTC) and New York (12:00–21:00 UTC) are active for all pairs. Asia (00:00–09:00 UTC) is an ACTIVE session specifically for JPY pairs (USDJPY, GBPJPY, EURJPY, AUDJPY, CADJPY, CHFJPY), AUD pairs (AUDUSD, AUDCAD, AUDCHF, AUDNZD, AUDJPY), and NZD pairs (NZDUSD, NZDJPY). Do NOT penalise Asia session for these pairs — treat it the same as London/NY. For EUR, GBP, USD, CHF, CAD pairs during Asia only, treat session as inactive. Are there high-impact events within 30 minutes?
STEP 5 — SETUP: Given the above, is there a valid trade setup? If the market is choppy, ranging without direction, or the session is inactive FOR THIS SPECIFIC PAIR — there is NO setup. Set tradeSetup to null.
STEP 6 — ENTRY STATUS: Based on current price action, what is the entry status? Be strict: CONFIRMED only when price has triggered at a key level with clear candle confirmation.
STEP 7 — SCORE & DECISION: Score the setup honestly (see rubric). Inflate nothing. Score below 7 = DENY. Score 7+ but entry not CONFIRMED = WAIT.

ACCOUNT CONTEXT (factor into risk assessment and funded-account logic):
${accountContext}

${marketData ? `LIVE MARKET DATA:\n${marketData}\n` : "Note: No live market data provided — base analysis on fundamental and macro context only.\n"}

Respond with ONLY the following JSON (no markdown, no preamble):
{
  "marketOverview": {
    "pair": "${pair}",
    "bias": "bullish|bearish|neutral",
    "structure": "precise description: trend direction, key levels, recent highs/lows",
    "volatility": "low|medium|high",
    "marketCondition": "trending|ranging|choppy"
  },
  "macro": {
    "interestRates": "rate differential context for ${pairCurrencies}",
    "centralBank": "current stance of relevant central banks",
    "inflation": "inflation trend and how it affects pair bias",
    "currencyStrength": { "USD": 0, "EUR": 0 },
    "summary": "one sentence: macro bias direction and conviction level"
  },
  "sentiment": {
    "retailPositioning": "what retail traders are doing and why it matters",
    "bias": "bullish|bearish|neutral",
    "crowdDirection": "LONG|SHORT|mixed",
    "summary": "one sentence: sentiment edge if any"
  },
  "tradeSetup": null,
  "entryStatus": {
    "status": "WAIT|READY|CONFIRMED|INVALID",
    "reason": "specific reason for this status based on current price action",
    "whatMustHappenNext": "exact condition required before escalating status"
  },
  "sessionAndNews": {
    "currentSession": "london|new_york|asia|overlap_lon_ny",
    "bestTiming": "specific session window and why",
    "newsRisk": "none|low|medium|high",
    "upcomingEvents": []
  },
  "finalDecision": {
    "score": 0,
    "decision": "TAKE_TRADE|WAIT|DENY",
    "reasoning": "2-3 sentences: score justification, key confluence or conflict, and what changes the decision"
  }
}

If a valid setup exists, replace the tradeSetup null with:
{
  "direction": "LONG|SHORT",
  "setupType": "pullback|breakout|reversal|liquidity_sweep",
  "entryZone": { "low": 0.00000, "high": 0.00000 },
  "stopLoss": 0.00000,
  "takeProfit": 0.00000,
  "confirmation": "exact price action event that confirms entry (e.g. bullish engulfing close above 1.0842)",
  "invalidation": "exact level or event that cancels the setup",
  "higherTimeframe": "H4|D1",
  "lowerTimeframe": "M15|H1"
}

FINAL RULES:
- currencyStrength: include ONLY the two currencies in ${pair} (${pairCurrencies}), not all 8
- Price levels must be exact to the correct decimal precision for ${pair}
- If funded account has used daily trades or hit loss limits, lower the score by 1-2 points and note it
- TAKE_TRADE requires score >= 7 AND entryStatus CONFIRMED simultaneously. Otherwise WAIT or DENY.
- For JPY, AUD, and NZD pairs during Asia session (00:00–09:00 UTC): do NOT reduce score solely because it is the Asia session. These pairs are at home in Asia.`;
}

// --- Response Parser ---

function parseAnalysisResponse(
  text: string,
  pair: CurrencyPair,
  accounts: TradingAccount[]
): FullAnalysis {
  try {
    const cleaned = text.replace(/```json?|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    // Calculate risk for each account if setup exists
    const riskPerAccount: Record<string, RiskOutput> = {};

    if (parsed.tradeSetup) {
      for (const account of accounts) {
        const risk = calculateRisk({
          accountBalance: account.balance,
          riskPercent: account.riskPercent,
          entryPrice: parsed.tradeSetup.entryZone.low, // use conservative entry
          stopLossPrice: parsed.tradeSetup.stopLoss,
          takeProfitPrice: parsed.tradeSetup.takeProfit,
          pair,
          direction: parsed.tradeSetup.direction,
        });

        // Check account-level denials
        const denials = validateTradeAgainstAccount(account, risk);
        if (denials.length > 0) {
          risk.isValid = false;
          risk.denial = denials.join(", ");
        }

        riskPerAccount[account.id] = risk;
      }
    }

    return {
      timestamp: new Date(),
      marketOverview: parsed.marketOverview,
      macro: parsed.macro,
      sentiment: parsed.sentiment,
      // Claude's JSON schema omits "pair" from tradeSetup — inject it here
      tradeSetup: parsed.tradeSetup ? { ...parsed.tradeSetup, pair } : null,
      entryStatus: {
        ...parsed.entryStatus,
        userAction:
          parsed.entryStatus.status === "WAIT" ? "WAIT" :
          parsed.entryStatus.status === "READY" ? "PREPARE" :
          parsed.entryStatus.status === "CONFIRMED" ? "EXECUTE" : "CANCEL",
        updatedAt: new Date(),
      },
      exitLogic: parsed.tradeSetup
        ? {
            stopLoss: parsed.tradeSetup.stopLoss,
            takeProfit: parsed.tradeSetup.takeProfit,
            breakEvenRule: `Move SL to entry after +${TRADING_CONFIG.breakEvenTriggerR}R`,
            trailingStop: "Trail behind structure after +2R",
          }
        : { stopLoss: 0, takeProfit: 0, breakEvenRule: "N/A", trailingStop: "N/A" },
      riskPerAccount,
      sessionAndNews: parsed.sessionAndNews,
      finalDecision: parsed.finalDecision,
    };
  } catch (error) {
    // Return safe default if parsing fails
    return buildDefaultAnalysis(pair);
  }
}

function buildDefaultAnalysis(pair: CurrencyPair): FullAnalysis {
  return {
    timestamp: new Date(),
    marketOverview: {
      pair,
      bias: "neutral",
      structure: "Unable to determine",
      volatility: "medium",
      marketCondition: "choppy",
    },
    macro: {
      interestRates: "N/A",
      centralBank: "N/A",
      inflation: "N/A",
      currencyStrength: {},
      summary: "Analysis unavailable",
    },
    sentiment: {
      retailPositioning: "N/A",
      bias: "neutral",
      crowdDirection: "mixed",
      summary: "Analysis unavailable",
    },
    tradeSetup: null,
    entryStatus: {
      status: "INVALID",
      userAction: "CANCEL",
      reason: "Analysis could not be completed. Do not trade without analysis.",
      whatMustHappenNext: "Retry analysis or wait.",
      updatedAt: new Date(),
    },
    exitLogic: { stopLoss: 0, takeProfit: 0, breakEvenRule: "N/A", trailingStop: "N/A" },
    riskPerAccount: {},
    sessionAndNews: {
      currentSession: "london",
      bestTiming: "N/A",
      newsRisk: "high",
      upcomingEvents: [],
    },
    finalDecision: {
      score: 0,
      decision: "DENY",
      reasoning: "Analysis could not be completed. Capital protection is priority #1.",
    },
  };
}

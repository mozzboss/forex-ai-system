import Anthropic from "@anthropic-ai/sdk";
import { createHash } from "crypto";
import {
  CurrencyPair,
  FullAnalysis,
  TradingAccount,
  RiskOutput,
} from "@/types";
import { calculateRisk, validateTradeAgainstAccount } from "@/lib/risk/engine";
import { TRADING_CONFIG, getAccountRules } from "@/config/trading";
import { prisma } from "@/lib/prisma";

const CACHE_TTL_MINUTES = 15;

// ============================================================
// AI DECISION ENGINE
// Uses Claude to analyze markets and make disciplined decisions.
// ============================================================

function getAnthropicClient() {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }
  return new Anthropic({ apiKey: key });
}

const SYSTEM_PROMPT = `You are an institutional forex trader. You apply Smart Money Concepts: you follow where institutional order flow is going, identify liquidity pools retail traders leave behind, and execute only when price gives a clear engineered entry. Your job is to find the trade IF it is there — but to say NO clearly when it is not.

TRADING FRAMEWORK — apply in this exact order:

1. HTF BIAS (Daily + Weekly)
   - Is price printing higher highs and higher lows → bullish bias → LONG setups only
   - Lower highs and lower lows → bearish bias → SHORT setups only
   - Is price in PREMIUM (above 50% of the weekly range) or DISCOUNT (below 50%)?
   - Institutional traders BUY in discount, SELL in premium. Counter-trend setups in the wrong zone get DENIED.
   - If bias is unclear (range-bound weekly candle, neutral daily), return no setup.

2. SESSION STRUCTURE (H4)
   - What did the prior session do? London typically engineers a high or low that NY then reverses or continues.
   - Look for: Fair Value Gaps (FVGs) — three-candle imbalances where price moved fast and left a void.
   - Look for: Order Blocks — the last bearish candle before a bullish impulse (bullish OB), or last bullish candle before a bearish impulse (bearish OB). These are where institutional orders rest.
   - Look for: Equal Highs / Equal Lows — clusters of wicks at the same level. These are liquidity pools. Price will sweep them before making the real move.

3. KILL ZONE (when price is most likely to move)
   - London Kill Zone: 07:00–09:30 UTC. Institutional manipulation occurs here — fake moves that sweep liquidity before the real direction starts.
   - New York Kill Zone: 12:00–14:00 UTC. Continuation or reversal of London. Highest volume, cleanest entries.
   - Outside kill zones, price is more likely to chop. Lower conviction outside these windows.

4. ENTRY TRIGGER (M15 / H1)
   - Has price swept a liquidity pool (briefly exceeded equal highs/lows, then rejected)?
   - Is price returning to an Order Block or FVG in the direction of HTF bias?
   - Entry trigger = M15 displacement candle (strong close through structure) or clear rejection wick from OB/FVG.
   - No trigger = WAIT. Do not anticipate.

5. RISK / REWARD
   - Stop loss: beyond the liquidity that was swept, or beyond the order block invalidation level.
   - Take profit: the next major liquidity pool in the trade direction (equal highs for LONG, equal lows for SHORT), or the opposing HTF level.
   - Minimum R:R 1:2. Anything below is not worth the risk to the account.

ENTRY STATUS DEFINITIONS:
- WAIT: HTF bias identified but no LTF structure or trigger yet. Monitor, do not act.
- READY: Price is approaching or sitting at a valid Order Block or FVG in the direction of bias. A trigger is needed on M15 before entry.
- CONFIRMED: A displacement candle or clear rejection has occurred at the entry level. Price has shown intent. May execute.
- INVALID: Liquidity swept in the wrong direction, structure broken against the trade, or HTF bias flipped. Cancel the idea.

SCORING (honest — do not inflate or deflate):
- 9–10: HTF bias strong, price in correct premium/discount zone, clear OB/FVG, liquidity swept, M15 trigger visible. Institutional fingerprint is clear.
- 7–8:  HTF bias clear, entry at valid structure, one layer missing or minor conflict. Actionable with trigger confirmation.
- 5–6:  Bias exists but price is in wrong premium/discount zone, or entry is mid-range with no clear OB/FVG. WAIT for better location.
- 3–4:  Choppy structure, no clear HTF bias, entry is guesswork. DENY.
- 1–2:  Price is ranging with no direction. No institutional footprint visible. DENY immediately.

HARD RULES:
- Never suggest a LONG in premium or a SHORT in discount unless it is a confirmed HTF reversal with 9+ score.
- Every setup needs a specific stop loss level beyond a swept liquidity pool or broken OB. No SL = no trade.
- News within 30 minutes = WAIT unless already in profit and managing the position.
- If you cannot identify a specific Order Block, FVG, or liquidity sweep — there is NO setup. Return tradeSetup: null.
- If market data is marked FALLBACK (synthetic), cap your score at 5 and set decision to DENY regardless.
- ATR(14) is provided — use it to validate that your SL distance is realistic (SL should be 0.5–2.0× ATR from entry, never tighter than 0.3× ATR).
- The premium/discount zone is pre-calculated from real H4 bars. Use it. A LONG in PREMIUM or SHORT in DISCOUNT without a 9+ reversal signal is an automatic DENY.

READING THE BAR DATA:
- H4 bars: scan for the last bearish candle before a bullish impulse (bullish Order Block) or vice versa. A Fair Value Gap is three candles where candle[n].low > candle[n-2].high (bullish FVG) or candle[n].high < candle[n-2].low (bearish FVG).
- M15 bars: look for the displacement candle that confirms the entry. A displacement candle closes strongly through a recent swing and has a larger-than-average body.
- Equal highs/lows: two or more wicks that top/bottom within 1-2 pips of each other are a liquidity pool. Note them explicitly.

You must respond in valid JSON only — no markdown, no explanation outside JSON. Be precise with price levels to the correct pip decimal for the pair.`;

// --- Analysis Cache ---

function buildAnalysisCacheKey(
  pair: CurrencyPair,
  accounts: TradingAccount[],
  marketData?: string
): string {
  const accountSnapshot = [...accounts]
    .map((account) => ({
      id: account.id,
      mode: account.mode,
      balance: account.balance,
      riskPercent: account.riskPercent,
      maxDailyLoss: account.maxDailyLoss,
      maxTradesPerDay: account.maxTradesPerDay,
      currentDailyLoss: account.currentDailyLoss,
      currentDailyTrades: account.currentDailyTrades,
      lossesInARow: account.lossesInARow,
      isActive: account.isActive,
      openExposure: [...account.openTrades]
        .filter((trade) => trade.status === "pending" || trade.status === "open")
        .map((trade) => ({
          pair: trade.pair,
          direction: trade.direction,
          status: trade.status,
          entryStatus: trade.entryStatus,
        }))
        .sort((left, right) =>
          `${left.pair}:${left.direction}:${left.status}:${left.entryStatus}`.localeCompare(
            `${right.pair}:${right.direction}:${right.status}:${right.entryStatus}`
          )
        ),
    }))
    .sort((left, right) => left.id.localeCompare(right.id));

  const normalizedMarketData = (marketData ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 6000);

  const digest = createHash("sha256")
    .update(
      JSON.stringify({
        v: 2,
        pair,
        accountSnapshot,
        marketData: normalizedMarketData,
      })
    )
    .digest("hex")
    .slice(0, 24);

  return `${pair}::${digest}`;
}

async function getCachedAnalysisText(cacheKey: string): Promise<string | null> {
  try {
    const cached = await prisma.analysisCache.findFirst({
      where: { pair: cacheKey, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    });
    return cached?.analysis ?? null;
  } catch {
    return null;
  }
}

async function saveAnalysisToCache(cacheKey: string, text: string): Promise<void> {
  try {
    const now = new Date();
    const expiresAt = new Date(Date.now() + CACHE_TTL_MINUTES * 60 * 1000);
    await prisma.$transaction([
      // Evict all globally expired entries (keeps table from growing unbounded)
      prisma.analysisCache.deleteMany({ where: { expiresAt: { lte: now } } }),
      prisma.analysisCache.create({
        data: { pair: cacheKey, analysis: text, expiresAt },
      }),
    ]);
  } catch {
    // Non-critical — swallow so a cache write failure never breaks analysis
  }
}

/**
 * Run full analysis on a currency pair.
 * Checks AnalysisCache first (15-min TTL) before calling Claude.
 */
export async function analyzeMarket(
  pair: CurrencyPair,
  accounts: TradingAccount[],
  marketData?: string // optional raw market data context
): Promise<FullAnalysis> {
  const cacheKey = buildAnalysisCacheKey(pair, accounts, marketData);

  // Cache hit: re-parse with current accounts (risk is account-specific, not cached)
  const cached = await getCachedAnalysisText(cacheKey);
  if (cached) {
    return parseAnalysisResponse(cached, pair, accounts);
  }

  const prompt = buildAnalysisPrompt(pair, accounts, marketData);

  const anthropic = getAnthropicClient();
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("");

  // Save to cache (non-blocking)
  void saveAnalysisToCache(cacheKey, text);

  return parseAnalysisResponse(text, pair, accounts);
}

/**
 * Quick pair check - lighter than full analysis.
 */
export async function quickPairCheck(
  pair: CurrencyPair
): Promise<{ bias: string; score: number; summary: string }> {
  const anthropic = getAnthropicClient();
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Quick analysis of ${pair}. Consider macro bias, price structure, and current session. Be honest — most pairs score below 7 right now.\n\nRespond in JSON only: { "bias": "bullish|bearish|neutral", "score": 1-10, "summary": "1-2 sentences covering bias, key level, and whether it is worth watching now" }`,
      },
    ],
  });

  const text = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("");

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
    .map((a) => {
      const rules = getAccountRules(a.mode);
      const tradesLeft = rules.maxTradesPerDay - a.currentDailyTrades;
      const dailyLossRemaining = a.maxDailyLoss - a.currentDailyLoss;
      const dailyLossPct = a.maxDailyLoss > 0
        ? Math.round((a.currentDailyLoss / a.maxDailyLoss) * 100)
        : 0;
      return (
        `- ${a.name} (${a.mode}): balance=$${a.balance}, risk=${a.riskPercent}%, ` +
        `daily_trades=${a.currentDailyTrades}/${rules.maxTradesPerDay} (${tradesLeft} remaining), ` +
        `daily_loss=$${a.currentDailyLoss.toFixed(0)}/$${a.maxDailyLoss} (${dailyLossPct}% used, $${dailyLossRemaining.toFixed(0)} remaining), ` +
        `losses_in_row=${a.lossesInARow}/${rules.stopAfterConsecutiveLosses}`
      );
    })
    .join("\n");

  const pairCurrencies = `${pair.slice(0, 3)} and ${pair.slice(3, 6)}`;

  const nowUtc = new Date().toUTCString();

  return `Analyze ${pair} for a potential trade setup. Real multi-timeframe bar data is provided below — use it. Do not guess structure you can read directly from the bars.

CURRENT TIME (UTC): ${nowUtc}
Use this to determine the active session (London 07:00–16:00 UTC, New York 12:00–21:00 UTC, overlap 12:00–16:00 UTC) and whether any upcoming news events are inside the 30-minute buffer.

STEP 1 — MACRO: What is the fundamental backdrop for ${pairCurrencies}? Rate differentials, central bank bias, inflation trajectory.
STEP 2 — STRUCTURE: Read the H4 bars directly. Identify the most recent swing highs and lows. Is price making higher highs/lows (bullish) or lower highs/lows (bearish)? Locate the last Order Block and any Fair Value Gap. Check the premium/discount zone provided — state explicitly whether price is in a buy zone or sell zone.
STEP 3 — SENTIMENT: Where is retail positioned? Is this a fade opportunity or trend continuation?
STEP 4 — SESSION & NEWS: Is this an active session (London/NY)? Are there high-impact events within 30 minutes?
STEP 5 — SETUP: Given the above, is there a valid trade setup? Read the M15 bars for the entry trigger. If no liquidity sweep or displacement candle is visible in the M15 data — set tradeSetup to null. Do not invent a setup.
STEP 6 — ENTRY STATUS: Base your entry status strictly on what the M15 bars show. CONFIRMED = a displacement candle is visible in the provided M15 data. READY = price is at a valid OB/FVG in the H4 data. WAIT = structure is there but no trigger yet.
STEP 7 — SCORE & DECISION: Score based only on what you can observe in the data. If data is FALLBACK, maximum score is 5. Inflate nothing.

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
- TAKE_TRADE requires score >= 7 AND entryStatus CONFIRMED simultaneously. Otherwise WAIT or DENY.`;
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

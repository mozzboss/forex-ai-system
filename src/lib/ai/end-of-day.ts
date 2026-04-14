import Anthropic from "@anthropic-ai/sdk";

import type {
  EndOfDayReview,
  EndOfDayReviewContext,
  EndOfDayReviewStats,
  JournalEntry,
  Trade,
} from "@/types";

const REVIEW_MODEL = "claude-sonnet-4-6";

function roundToCents(value: number) {
  return Math.round(value * 100) / 100;
}

function getClosedTrades(trades: Trade[]) {
  return trades.filter((trade) => trade.status === "closed" && typeof trade.pnl === "number");
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

export function buildEndOfDayReviewStats(
  trades: Trade[],
  journalEntries: JournalEntry[]
): EndOfDayReviewStats {
  const closedTrades = getClosedTrades(trades);
  const wins = closedTrades.filter((trade) => (trade.pnl || 0) > 0).length;
  const losses = closedTrades.filter((trade) => (trade.pnl || 0) < 0).length;
  const pnl = roundToCents(closedTrades.reduce((total, trade) => total + (trade.pnl || 0), 0));

  return {
    totalTrades: trades.length,
    executedTrades: trades.filter((trade) => trade.status !== "denied" && trade.status !== "cancelled").length,
    closedTrades: closedTrades.length,
    wins,
    losses,
    deniedTrades: trades.filter((trade) => trade.status === "denied").length,
    pnl,
    winRate: closedTrades.length > 0 ? Math.round((wins / closedTrades.length) * 100) : 0,
    journalEntries: journalEntries.length,
  };
}

function buildFallbackReview(context: EndOfDayReviewContext): EndOfDayReview {
  const { date, trades, journalEntries, stats } = context;
  const deniedReasons = uniqueValues(
    trades
      .filter((trade) => trade.status === "denied")
      .map((trade) => trade.denialReason || "")
  );
  const journalMistakes = uniqueValues(journalEntries.flatMap((entry) => entry.mistakes || []));
  const averageAiScore =
    trades.length > 0
      ? Math.round(
          trades.reduce((total, trade) => total + (trade.aiScore || 0), 0) /
            Math.max(trades.length, 1)
        )
      : 0;

  let disciplineScore = 8;
  if (stats.deniedTrades >= 2) disciplineScore -= 1;
  if (stats.losses >= 2) disciplineScore -= 1;
  if (stats.pnl < 0) disciplineScore -= 1;
  if (journalEntries.length === 0) disciplineScore -= 1;
  disciplineScore = Math.max(3, Math.min(10, disciplineScore));

  const strengths = uniqueValues([
    stats.deniedTrades > 0 ? "The system blocked lower-quality setups instead of forcing extra trades." : "",
    stats.journalEntries > 0 ? "You captured journal notes, which improves review quality." : "",
    stats.winRate >= 50 && stats.closedTrades > 0 ? "Execution quality stayed respectable on closed trades." : "",
    averageAiScore >= 7 ? "Most recorded setups stayed near or above the quality threshold." : "",
  ]).slice(0, 3);

  const mistakes = uniqueValues([
    journalMistakes[0] || "",
    journalMistakes[1] || "",
    stats.losses >= 2 ? "Loss clustering suggests pacing and selectivity need more respect." : "",
    stats.deniedTrades >= 3 ? "Repeated denied setups suggest impatience around marginal conditions." : "",
  ]).slice(0, 3);

  const riskFlags = uniqueValues([
    stats.pnl < 0 ? "The day finished negative, so tomorrow should begin with smaller emotional pressure and stricter filtering." : "",
    deniedReasons[0] ? `Denied setups repeatedly showed ${deniedReasons[0].replace(/_/g, " ")}.` : "",
    stats.journalEntries === 0 ? "No written review was captured during the day, which can hide behavioral drift." : "",
  ]).slice(0, 3);

  const tomorrowFocus = uniqueValues([
    "Only act on CONFIRMED status. READY still means watch, not execute.",
    stats.deniedTrades > 0 ? "Review denied setups before the next session so the same weak patterns do not reappear." : "",
    stats.losses > stats.wins ? "Reduce frequency tomorrow and wait for cleaner asymmetry." : "",
    journalMistakes[0] ? `Build a specific rule around: ${journalMistakes[0]}.` : "",
  ]).slice(0, 4);

  const headline =
    stats.closedTrades === 0
      ? "The biggest result today was restraint, not realized P&L."
      : stats.pnl >= 0
        ? "The day stayed constructive, but the real win was how rules shaped the decisions."
        : "Today asked for more restraint. The review is about preserving tomorrow's capital, not defending today's trades.";

  const summary = [
    `Closed trades: ${stats.closedTrades} with ${stats.winRate}% win rate and ${stats.pnl >= 0 ? "positive" : "negative"} realized P&L.`,
    stats.deniedTrades > 0
      ? `${stats.deniedTrades} setups were denied, which is evidence that the discipline system slowed down lower-quality risk.`
      : "No denied setups were recorded, so tomorrow's review should still sanity-check whether selectivity stayed high enough.",
    stats.journalEntries > 0
      ? `${stats.journalEntries} journal entries added context beyond the numbers.`
      : "Journal coverage was thin, so some behavior patterns may still be hidden.",
  ].join(" ");

  return {
    date,
    generatedAt: new Date(),
    disciplineScore,
    headline,
    summary,
    strengths: strengths.length > 0 ? strengths : ["You completed the session review instead of skipping reflection."],
    mistakes: mistakes.length > 0 ? mistakes : ["No explicit mistakes were logged. Verify that this reflects reality, not missing notes."],
    riskFlags: riskFlags.length > 0 ? riskFlags : ["No major risk flags surfaced from the stored data, but tomorrow still starts from zero."],
    tomorrowFocus: tomorrowFocus.length > 0 ? tomorrowFocus : ["Keep capital protection first and require CONFIRMED status before execution."],
    stats,
  };
}

function serializeContext(context: EndOfDayReviewContext) {
  return JSON.stringify(
    {
      date: context.date.toISOString(),
      stats: context.stats,
      trades: context.trades.map((trade) => ({
        pair: trade.pair,
        direction: trade.direction,
        setupType: trade.setupType,
        status: trade.status,
        entryStatus: trade.entryStatus,
        pnl: trade.pnl ?? null,
        pipsPnl: trade.pipsPnl ?? null,
        aiScore: trade.aiScore,
        denialReason: trade.denialReason ?? null,
        notes: trade.notes ?? null,
        aiReasoning: trade.aiReasoning,
      })),
      journalEntries: context.journalEntries.map((entry) => ({
        type: entry.type,
        content: entry.content,
        mistakes: entry.mistakes || [],
        disciplineScore: entry.disciplineScore ?? null,
        tags: entry.tags || [],
      })),
    },
    null,
    2
  );
}

function coerceReviewShape(candidate: unknown, fallback: EndOfDayReview): EndOfDayReview {
  if (!candidate || typeof candidate !== "object") {
    return fallback;
  }

  const value = candidate as Partial<EndOfDayReview>;

  return {
    ...fallback,
    disciplineScore:
      typeof value.disciplineScore === "number"
        ? Math.max(1, Math.min(10, Math.round(value.disciplineScore)))
        : fallback.disciplineScore,
    headline: typeof value.headline === "string" && value.headline.trim() ? value.headline.trim() : fallback.headline,
    summary: typeof value.summary === "string" && value.summary.trim() ? value.summary.trim() : fallback.summary,
    strengths: Array.isArray(value.strengths) && value.strengths.length > 0 ? value.strengths.slice(0, 5) : fallback.strengths,
    mistakes: Array.isArray(value.mistakes) && value.mistakes.length > 0 ? value.mistakes.slice(0, 5) : fallback.mistakes,
    riskFlags: Array.isArray(value.riskFlags) && value.riskFlags.length > 0 ? value.riskFlags.slice(0, 5) : fallback.riskFlags,
    tomorrowFocus:
      Array.isArray(value.tomorrowFocus) && value.tomorrowFocus.length > 0
        ? value.tomorrowFocus.slice(0, 5)
        : fallback.tomorrowFocus,
    generatedAt: new Date(),
    date: fallback.date,
    stats: fallback.stats,
  };
}

export async function generateEndOfDayReview(
  context: EndOfDayReviewContext
): Promise<EndOfDayReview> {
  const fallback = buildFallbackReview(context);
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return fallback;
  }

  const anthropic = new Anthropic({ apiKey });
  const prompt = [
    "You are reviewing a disciplined forex trading day.",
    "Your job is not to hype the trader. Your job is to protect future capital by identifying what was done well, what behavior was risky, and what tomorrow should look like.",
    "Return valid JSON only with this exact shape:",
    JSON.stringify(
      {
        disciplineScore: 7,
        headline: "One sentence",
        summary: "A concise paragraph",
        strengths: ["..."],
        mistakes: ["..."],
        riskFlags: ["..."],
        tomorrowFocus: ["..."],
      },
      null,
      2
    ),
    "Requirements:",
    "- Keep disciplineScore between 1 and 10.",
    "- Prioritize capital protection.",
    "- Mention when 'no trade' or denied trades were healthy decisions.",
    "- Never encourage revenge trading or impulsive recovery behavior.",
    "- Use the provided stats and notes. Do not invent price action details.",
    "",
    "Review context:",
    serializeContext(context),
  ].join("\n");

  try {
    const response = await anthropic.messages.create({
      model: REVIEW_MODEL,
      max_tokens: 1600,
      system:
        "You are a disciplined trading performance reviewer. Be direct, calm, and practical. Output JSON only.",
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("");
    const cleaned = text.replace(/```json?|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return coerceReviewShape(parsed, fallback);
  } catch (error) {
    console.error("End-of-day AI review failed, using fallback review:", error);
    return fallback;
  }
}

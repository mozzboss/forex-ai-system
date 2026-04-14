import type { Currency, CurrencyPair, NewsEvent } from "@/types";

export type MarketLean = "bullish" | "bearish" | "neutral";
export type CautionLevel = "low" | "medium" | "high";

interface MarketSnapshotLike {
  pair: CurrencyPair;
  price: number;
  open: number;
  high: number;
  low: number;
  change?: number;
  percentChange?: number;
}

export function getPairContext(pair: CurrencyPair) {
  if (pair === "XAUUSD") {
    return {
      baseCode: "XAU",
      baseLabel: "gold",
      quoteCode: "USD" as Currency,
      quoteLabel: "the US dollar",
      relevantCurrencies: ["USD"] as Currency[],
    };
  }

  return {
    baseCode: pair.slice(0, 3) as Currency,
    baseLabel: pair.slice(0, 3),
    quoteCode: pair.slice(3, 6) as Currency,
    quoteLabel: pair.slice(3, 6),
    relevantCurrencies: [pair.slice(0, 3) as Currency, pair.slice(3, 6) as Currency],
  };
}

export function toTimeLabel(date: Date) {
  const diffMin = Math.round((date.getTime() - Date.now()) / 60000);
  if (diffMin <= 0) return "Now";
  if (diffMin < 60) return `${diffMin}m`;
  return `${Math.floor(diffMin / 60)}h ${diffMin % 60}m`;
}

export function buildDriverSummary(pair: CurrencyPair, events: NewsEvent[]) {
  const context = getPairContext(pair);
  const relevantEvents = events
    .filter((event) => context.relevantCurrencies.includes(event.currency))
    .sort((left, right) => left.time.getTime() - right.time.getTime())
    .slice(0, 3);

  const up: string[] = [];
  const down: string[] = [];

  if (pair === "XAUUSD") {
    up.push("Gold usually catches a bid when the US dollar softens or Fed pricing turns less hawkish.");
    up.push("Lower yields and defensive risk sentiment can support upside if traders move into safety.");
    down.push("Gold often slides when USD strength builds or higher yields increase the cost of holding non-yielding assets.");
    down.push("A hawkish Fed tone or stronger US data can pressure gold lower quickly.");
  } else {
    up.push(`${pair} tends to move higher when ${context.baseLabel} is outperforming ${context.quoteLabel}.`);
    up.push(`Stronger ${context.baseLabel} data or a more hawkish ${context.baseLabel} central-bank tone can support upside.`);
    down.push(`${pair} tends to move lower when ${context.quoteLabel} gains relative strength over ${context.baseLabel}.`);
    down.push(`Stronger ${context.quoteLabel} data or softer ${context.baseLabel} releases can pressure the pair lower.`);
  }

  for (const event of relevantEvents) {
    const eventLabel = `${event.currency} ${event.event}`;

    if (pair === "XAUUSD") {
      up.push(`If ${eventLabel} comes in soft and weakens USD, gold can move higher.`);
      down.push(`If ${eventLabel} reinforces USD strength or higher yields, gold can move lower.`);
      continue;
    }

    if (event.currency === context.baseCode) {
      up.push(`A strong surprise in ${eventLabel} can add fuel to upside in ${pair}.`);
      down.push(`A disappointing ${eventLabel} release can drag ${pair} lower.`);
    }

    if (event.currency === context.quoteCode) {
      up.push(`A soft ${eventLabel} outcome can help ${pair} rise by weakening the quote currency.`);
      down.push(`A strong ${eventLabel} result can pressure ${pair} lower by strengthening the quote currency.`);
    }
  }

  return {
    up: Array.from(new Set(up)).slice(0, 3),
    down: Array.from(new Set(down)).slice(0, 3),
    relevantEvents,
  };
}

function describeCaution(level: CautionLevel) {
  switch (level) {
    case "high":
      return "A high-impact release is close enough to disrupt any clean setup. Slow down immediately.";
    case "medium":
      return "News risk is building. Treat direction with less confidence and wait for cleaner confirmation.";
    default:
      return "No immediate event shock is dominating this instrument right now, but the normal news buffer still applies.";
  }
}

export function deriveMarketRead(snapshot: MarketSnapshotLike, events: NewsEvent[]) {
  const context = getPairContext(snapshot.pair);
  const relevantEvents = events
    .filter((event) => context.relevantCurrencies.includes(event.currency))
    .sort((left, right) => left.time.getTime() - right.time.getTime());
  const nextEvent = relevantEvents[0];
  const nextEventMinutes = nextEvent
    ? Math.round((nextEvent.time.getTime() - Date.now()) / 60000)
    : null;

  const range = Math.max(snapshot.high - snapshot.low, Number.EPSILON);
  const rangePosition = (snapshot.price - snapshot.low) / range;
  const change = snapshot.change ?? snapshot.price - snapshot.open;
  const percentChange = snapshot.percentChange ?? 0;

  let directionalScore = 0;
  if (change > 0) directionalScore += 1;
  if (change < 0) directionalScore -= 1;
  if (percentChange >= 0.12) directionalScore += 1;
  if (percentChange <= -0.12) directionalScore -= 1;
  if (rangePosition >= 0.62) directionalScore += 1;
  if (rangePosition <= 0.38) directionalScore -= 1;

  const lean: MarketLean =
    directionalScore >= 2 ? "bullish" : directionalScore <= -2 ? "bearish" : "neutral";

  const caution: CautionLevel =
    nextEvent && nextEvent.impact === "high" && nextEventMinutes !== null && nextEventMinutes <= 45
      ? "high"
      : nextEvent && nextEventMinutes !== null && nextEventMinutes <= 180
        ? "medium"
        : relevantEvents.length > 0
          ? "medium"
          : "low";

  const summary =
    lean === "bullish"
      ? `${snapshot.pair} is trading above the session open and holding the stronger half of its intraday range, so buyers have the short-term edge for now.`
      : lean === "bearish"
        ? `${snapshot.pair} is trading below the session open and leaning toward the weaker half of its intraday range, so sellers have the short-term edge for now.`
        : `${snapshot.pair} is sitting in a mixed intraday posture. Price is not showing enough one-sided control to justify directional confidence yet.`;

  return {
    lean,
    caution,
    summary,
    nextEvent,
    cautionReason: describeCaution(caution),
  };
}

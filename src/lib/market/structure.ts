export interface StructureBar {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface SwingPoint {
  kind: "high" | "low";
  index: number;
  time: string;
  price: number;
}

export interface StructureEvent {
  kind: "BOS" | "CHOCH";
  direction: "bullish" | "bearish";
  index: number;
  time: string;
  price: number;
  brokenLevel: number;
}

export interface StructureBand {
  low: number;
  high: number;
}

export interface StructureSummary {
  bias: "bullish" | "bearish" | "neutral";
  summary: string;
  swings: SwingPoint[];
  events: StructureEvent[];
  htfSupport?: StructureBand;
  htfResistance?: StructureBand;
}

function sortByIndex<T extends { index: number }>(items: T[]) {
  return [...items].sort((left, right) => left.index - right.index);
}

function buildBand(price: number, range: number) {
  const padding = Math.max(range * 0.04, Number.EPSILON);

  return {
    low: price - padding,
    high: price + padding,
  };
}

function inferBias(swings: SwingPoint[]): StructureSummary["bias"] {
  const highs = swings.filter((swing) => swing.kind === "high").slice(-2);
  const lows = swings.filter((swing) => swing.kind === "low").slice(-2);

  if (highs.length < 2 || lows.length < 2) {
    return "neutral";
  }

  const higherHighs = highs[1].price > highs[0].price;
  const higherLows = lows[1].price > lows[0].price;
  const lowerHighs = highs[1].price < highs[0].price;
  const lowerLows = lows[1].price < lows[0].price;

  if (higherHighs && higherLows) {
    return "bullish";
  }

  if (lowerHighs && lowerLows) {
    return "bearish";
  }

  return "neutral";
}

function describeBias(bias: StructureSummary["bias"], events: StructureEvent[]) {
  const latestEvent = events[events.length - 1];

  if (bias === "bullish") {
    return latestEvent?.direction === "bullish"
      ? "Higher-timeframe structure is still leaning bullish and the latest break keeps buyers in control."
      : "Higher-timeframe structure is leaning bullish, but recent action needs follow-through before trusting continuation.";
  }

  if (bias === "bearish") {
    return latestEvent?.direction === "bearish"
      ? "Higher-timeframe structure is still leaning bearish and the latest break keeps sellers in control."
      : "Higher-timeframe structure is leaning bearish, but recent action needs follow-through before trusting continuation.";
  }

  if (latestEvent) {
    return `${latestEvent.kind} printed recently, but the broader swing sequence is still mixed. Treat this as transition, not clean trend structure.`;
  }

  return "Structure is mixed. Recent swings are not clean enough to claim trend control yet.";
}

export function analyzeMarketStructure(bars: StructureBar[]): StructureSummary {
  if (bars.length < 3) {
    return {
      bias: "neutral",
      summary: "Not enough candle history to read swing structure yet.",
      swings: [],
      events: [],
    };
  }

  const swings: SwingPoint[] = [];

  for (let index = 1; index < bars.length - 1; index += 1) {
    const previous = bars[index - 1];
    const current = bars[index];
    const next = bars[index + 1];

    if (current.high > previous.high && current.high >= next.high) {
      swings.push({
        kind: "high",
        index,
        time: current.time,
        price: current.high,
      });
    }

    if (current.low < previous.low && current.low <= next.low) {
      swings.push({
        kind: "low",
        index,
        time: current.time,
        price: current.low,
      });
    }
  }

  const orderedSwings = sortByIndex(swings);
  const rangeHigh = Math.max(...bars.map((bar) => bar.high));
  const rangeLow = Math.min(...bars.map((bar) => bar.low));
  const range = Math.max(rangeHigh - rangeLow, Number.EPSILON);

  const events: StructureEvent[] = [];
  let activeBias: StructureSummary["bias"] = inferBias(orderedSwings);
  let lastBrokenHigh = -1;
  let lastBrokenLow = -1;

  for (let index = 0; index < bars.length; index += 1) {
    const bar = bars[index];

    const eligibleHigh = [...orderedSwings]
      .filter((swing) => swing.kind === "high" && swing.index < index && swing.index > lastBrokenHigh)
      .at(-1);

    if (eligibleHigh && bar.close > eligibleHigh.price) {
      const eventDirection: StructureEvent["direction"] = "bullish";
      events.push({
        kind: activeBias === "bearish" ? "CHOCH" : "BOS",
        direction: eventDirection,
        index,
        time: bar.time,
        price: bar.close,
        brokenLevel: eligibleHigh.price,
      });
      activeBias = "bullish";
      lastBrokenHigh = eligibleHigh.index;
    }

    const eligibleLow = [...orderedSwings]
      .filter((swing) => swing.kind === "low" && swing.index < index && swing.index > lastBrokenLow)
      .at(-1);

    if (eligibleLow && bar.close < eligibleLow.price) {
      const eventDirection: StructureEvent["direction"] = "bearish";
      events.push({
        kind: activeBias === "bullish" ? "CHOCH" : "BOS",
        direction: eventDirection,
        index,
        time: bar.time,
        price: bar.close,
        brokenLevel: eligibleLow.price,
      });
      activeBias = "bearish";
      lastBrokenLow = eligibleLow.index;
    }
  }

  const latestHigh = orderedSwings.filter((swing) => swing.kind === "high").at(-1);
  const latestLow = orderedSwings.filter((swing) => swing.kind === "low").at(-1);
  const bias = inferBias(orderedSwings);

  return {
    bias,
    summary: describeBias(bias, events),
    swings: orderedSwings,
    events: events.slice(-3),
    htfSupport: latestLow ? buildBand(latestLow.price, range) : undefined,
    htfResistance: latestHigh ? buildBand(latestHigh.price, range) : undefined,
  };
}

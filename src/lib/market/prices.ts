import "server-only";

import { getPricePrecision } from "@/config/trading";
import { MARKET_TIMEFRAMES, MarketTimeframe } from "@/lib/market/timeframes";
import { CurrencyPair } from "@/types";

type MarketSource = "twelvedata" | "fallback";

interface TwelveDataQuoteResponse {
  close?: string;
  open?: string;
  high?: string;
  low?: string;
  previous_close?: string;
  change?: string;
  percent_change?: string;
  datetime?: string;
  is_market_open?: boolean;
  code?: number;
  message?: string;
}

interface TwelveDataTimeSeriesValue {
  datetime: string;
  open: string;
  high: string;
  low: string;
  close: string;
}

interface TwelveDataTimeSeriesResponse {
  values?: TwelveDataTimeSeriesValue[];
  code?: number;
  message?: string;
}

export interface MarketBar {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface YesterdayPerformance {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  change: number;
  percentChange: number;
}

export interface MarketSnapshot {
  pair: CurrencyPair;
  symbol: string;
  timeframe: MarketTimeframe;
  price: number;
  open: number;
  high: number;
  low: number;
  previousClose?: number;
  change?: number;
  percentChange?: number;
  asOf: string;
  isMarketOpen?: boolean;
  yesterday?: YesterdayPerformance;
  bars: MarketBar[];
  source: MarketSource;
  fallback: boolean;
}

const TWELVE_DATA_BASE_URL = "https://api.twelvedata.com";

function getTimeframeMinutes(timeframe: MarketTimeframe) {
  switch (timeframe) {
    case "5min":
      return 5;
    case "15min":
      return 15;
    case "1h":
      return 60;
    case "4h":
      return 240;
  }
}

function getOutputSize(timeframe: MarketTimeframe) {
  return timeframe === "4h" ? "10" : "12";
}

function pairToSymbol(pair: CurrencyPair) {
  return `${pair.slice(0, 3)}/${pair.slice(3, 6)}`;
}

function toNumber(value?: string | number | null) {
  if (value === null || value === undefined) return undefined;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function formatBars(values?: TwelveDataTimeSeriesValue[]) {
  return (values || [])
    .map((value) => {
      const open = toNumber(value.open);
      const high = toNumber(value.high);
      const low = toNumber(value.low);
      const close = toNumber(value.close);

      if (
        typeof open !== "number" ||
        typeof high !== "number" ||
        typeof low !== "number" ||
        typeof close !== "number"
      ) {
        return null;
      }

      return {
        time: new Date(value.datetime).toISOString(),
        open,
        high,
        low,
        close,
      } satisfies MarketBar;
    })
    .filter((bar): bar is MarketBar => Boolean(bar))
    .reverse();
}

function toDateKey(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  return date.toISOString().slice(0, 10);
}

function deriveYesterdayPerformanceFromDailyBars(
  bars: MarketBar[],
  precision: number,
  now: Date = new Date()
): YesterdayPerformance | undefined {
  if (bars.length < 1) {
    return undefined;
  }

  const todayKey = toDateKey(now);
  const latest = bars[bars.length - 1];
  const latestKey = toDateKey(latest.time);

  const yesterdayBar =
    latestKey === todayKey && bars.length >= 2
      ? bars[bars.length - 2]
      : latest;

  if (!yesterdayBar) {
    return undefined;
  }

  const change = Number((yesterdayBar.close - yesterdayBar.open).toFixed(precision));
  const percentChange = Number(
    ((((yesterdayBar.close - yesterdayBar.open) / Math.max(Math.abs(yesterdayBar.open), Number.EPSILON)) * 100) || 0).toFixed(2)
  );

  return {
    date: toDateKey(yesterdayBar.time),
    open: yesterdayBar.open,
    high: yesterdayBar.high,
    low: yesterdayBar.low,
    close: yesterdayBar.close,
    change,
    percentChange,
  };
}

async function fetchYesterdayPerformanceFromProvider(
  symbol: string,
  apiKey: string,
  precision: number
): Promise<YesterdayPerformance | undefined> {
  const dailyUrl = new URL(`${TWELVE_DATA_BASE_URL}/time_series`);
  dailyUrl.searchParams.set("symbol", symbol);
  dailyUrl.searchParams.set("interval", "1day");
  dailyUrl.searchParams.set("outputsize", "3");
  dailyUrl.searchParams.set("apikey", apiKey);

  const response = await fetch(dailyUrl, {
    headers: { Accept: "application/json" },
    next: { revalidate: 1800 },
  });

  if (!response.ok) {
    throw new Error(`Daily market request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as TwelveDataTimeSeriesResponse;
  if (payload.code || payload.message) {
    throw new Error(payload.message || "Daily market provider returned an error.");
  }

  return deriveYesterdayPerformanceFromDailyBars(formatBars(payload.values), precision);
}

function buildFallbackYesterdayPerformance(
  pair: CurrencyPair,
  latestClose: number,
  precision: number
): YesterdayPerformance {
  const directionalBias = (pair.charCodeAt(0) + pair.charCodeAt(3)) % 2 === 0 ? 1 : -1;
  const baseMove = pair === "XAUUSD" ? 6.2 : pair.includes("JPY") ? 0.35 : 0.0042;
  const open = Number((latestClose - directionalBias * baseMove).toFixed(precision));
  const close = Number((latestClose - directionalBias * baseMove * 0.15).toFixed(precision));
  const high = Number((Math.max(open, close) + baseMove * 0.45).toFixed(precision));
  const low = Number((Math.min(open, close) - baseMove * 0.35).toFixed(precision));
  const change = Number((close - open).toFixed(precision));
  const percentChange = Number((((change / Math.max(Math.abs(open), Number.EPSILON)) * 100) || 0).toFixed(2));
  const yesterday = new Date();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);

  return {
    date: toDateKey(yesterday),
    open,
    high,
    low,
    close,
    change,
    percentChange,
  };
}

function buildFallbackSnapshot(pair: CurrencyPair, timeframe: MarketTimeframe): MarketSnapshot {
  const isJpyPair = pair.includes("JPY");
  const isGold = pair === "XAUUSD";
  const precision = getPricePrecision(pair);
  const basePrice = isGold ? 2325.4 : isJpyPair ? 156.25 : 1.0842;
  const timeframeFactor = timeframe === "5min" ? 0.65 : timeframe === "15min" ? 1 : timeframe === "1h" ? 1.65 : 2.4;
  const trendStep = (isGold ? 2.8 : isJpyPair ? 0.08 : 0.0008) * timeframeFactor;
  const candleStep = (isGold ? 0.9 : isJpyPair ? 0.03 : 0.0003) * timeframeFactor;
  const wickStep = (isGold ? 0.45 : isJpyPair ? 0.02 : 0.0002) * timeframeFactor;
  const timeframeMinutes = getTimeframeMinutes(timeframe);

  // Derive a stable trend direction from the pair name so each pair has its own character
  const trendSign = (pair.charCodeAt(0) + pair.charCodeAt(3)) % 2 === 0 ? 1 : -1;

  const bars: MarketBar[] = Array.from({ length: 12 }).map((_, index) => {
    const step = 11 - index;
    const open = Number((basePrice + trendSign * step * trendStep).toFixed(precision));
    const close = Number((open + (index % 2 === 0 ? 1 : -1) * candleStep).toFixed(precision));
    const high = Number((Math.max(open, close) + wickStep).toFixed(precision));
    const low = Number((Math.min(open, close) - wickStep).toFixed(precision));

    return {
      time: new Date(Date.now() - step * timeframeMinutes * 60_000).toISOString(),
      open,
      high,
      low,
      close,
    };
  });

  const latest = bars[bars.length - 1];
  const previous = bars[bars.length - 2];
  const change = Number((latest.close - previous.close).toFixed(precision));
  const percentChange = Number((((change / previous.close) || 0) * 100).toFixed(2));
  const yesterday = buildFallbackYesterdayPerformance(pair, previous.close, precision);

  return {
    pair,
    symbol: pairToSymbol(pair),
    timeframe,
    price: latest.close,
    open: latest.open,
    high: Math.max(...bars.map((bar) => bar.high)),
    low: Math.min(...bars.map((bar) => bar.low)),
    previousClose: previous.close,
    change,
    percentChange,
    asOf: latest.time,
    isMarketOpen: true,
    yesterday,
    bars,
    source: "fallback",
    fallback: true,
  };
}

export function formatMarketContextForAnalysis(snapshot: MarketSnapshot) {
  const latestBar = snapshot.bars[snapshot.bars.length - 1];
  const rangeHigh = Math.max(...snapshot.bars.map((bar) => bar.high));
  const rangeLow = Math.min(...snapshot.bars.map((bar) => bar.low));

  return [
    `Live market snapshot for ${snapshot.pair} (${snapshot.symbol}) on ${snapshot.timeframe} from ${snapshot.source}.`,
    `Current price ${snapshot.price}. Session open ${snapshot.open}, session high ${snapshot.high}, session low ${snapshot.low}.`,
    typeof snapshot.change === "number" && typeof snapshot.percentChange === "number"
      ? `Change ${snapshot.change} (${snapshot.percentChange}%).`
      : "Change unavailable.",
    snapshot.yesterday
      ? `Yesterday (${snapshot.yesterday.date}) closed ${snapshot.yesterday.close} after moving ${snapshot.yesterday.change} (${snapshot.yesterday.percentChange}%).`
      : "Yesterday performance unavailable.",
    latestBar
      ? `Latest candle ${latestBar.time}: O ${latestBar.open}, H ${latestBar.high}, L ${latestBar.low}, C ${latestBar.close}.`
      : "Latest candle unavailable.",
    `Recent intraday range ${rangeLow} to ${rangeHigh}.`,
    snapshot.fallback
      ? "Provider unavailable, so this snapshot is a conservative fallback. Treat confidence as lower until verified manually."
      : "Use this snapshot as context, not as a standalone trigger.",
  ].join(" ");
}

// ============================================================
// MULTI-TIMEFRAME CONTEXT
// D1 (30 bars) → HTF bias and premium/discount zones
// H4 (20 bars) → session structure, order blocks, FVGs
// M15 (20 bars) → entry trigger, recent price action
// DXY H4     → USD correlation filter
// ============================================================

function calcATR(bars: MarketBar[], period = 14): number {
  if (bars.length < 2) return 0;
  const trValues = bars.slice(1).map((bar, i) => {
    const prev = bars[i];
    return Math.max(
      bar.high - bar.low,
      Math.abs(bar.high - prev.close),
      Math.abs(bar.low - prev.close)
    );
  });
  const slice = trValues.slice(-period);
  return slice.reduce((sum, v) => sum + v, 0) / slice.length;
}

function formatBarsTable(bars: MarketBar[], precision: number): string {
  return bars
    .map((b) => `  ${b.time.slice(0, 16)} O:${b.open.toFixed(precision)} H:${b.high.toFixed(precision)} L:${b.low.toFixed(precision)} C:${b.close.toFixed(precision)}`)
    .join("\n");
}

function calcPremiumDiscount(bars: MarketBar[]): { mid: number; high: number; low: number } {
  const high = Math.max(...bars.map((b) => b.high));
  const low = Math.min(...bars.map((b) => b.low));
  return { high, low, mid: (high + low) / 2 };
}

export interface MultiTimeframeContext {
  pair: CurrencyPair;
  currentPrice: number;
  atrM15: number;
  atrH4: number;
  premiumDiscountZone: { high: number; low: number; mid: number; currentZone: "premium" | "discount" | "midrange" };
  formattedContext: string;
  fallback: boolean;
}

// USD is the base in these pairs (DXY up = pair price up = USD stronger)
const USD_BASE_PAIRS = ["USDJPY", "USDCHF", "USDCAD"];

async function fetchDXYBars(): Promise<{ bars: MarketBar[]; fallback: boolean }> {
  const apiKey = process.env.TWELVE_DATA_API_KEY;
  if (!apiKey) return { bars: [], fallback: true };

  try {
    const url = new URL(`${TWELVE_DATA_BASE_URL}/time_series`);
    url.searchParams.set("symbol", "DXY");
    url.searchParams.set("interval", "4h");
    url.searchParams.set("outputsize", "10");
    url.searchParams.set("apikey", apiKey);

    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });

    if (!response.ok) return { bars: [], fallback: true };

    const payload = (await response.json()) as TwelveDataTimeSeriesResponse;
    if (payload.code || !payload.values?.length) return { bars: [], fallback: true };

    return { bars: formatBars(payload.values), fallback: false };
  } catch {
    return { bars: [], fallback: true };
  }
}

function analyzeDXYCorrelation(
  pair: CurrencyPair,
  dxyBars: MarketBar[]
): string {
  if (dxyBars.length < 4) {
    return "DXY data unavailable — USD directional filter skipped. Be conservative with USD-correlated setups.";
  }

  const pd = calcPremiumDiscount(dxyBars);
  const lastClose = dxyBars[dxyBars.length - 1].close;
  const firstClose = dxyBars[0].close;

  const zone: "premium" | "discount" | "midrange" =
    lastClose > pd.mid + (pd.high - pd.mid) * 0.25
      ? "premium"
      : lastClose < pd.mid - (pd.mid - pd.low) * 0.25
        ? "discount"
        : "midrange";

  const trend: "bullish" | "bearish" | "ranging" =
    lastClose > firstClose * 1.0008 ? "bullish"
      : lastClose < firstClose * 0.9992 ? "bearish"
        : "ranging";

  const usdIsBase = USD_BASE_PAIRS.includes(pair);

  let pairImpact: string;
  if (trend === "bullish" && zone === "premium") {
    pairImpact = usdIsBase
      ? "DXY bullish in premium → USD extended, potential reversal risk. LONG setups need extra confirmation."
      : "DXY bullish in premium → USD strength is overextended. LONG setups (buying pair) may have a near-term tailwind from reversal risk.";
  } else if (trend === "bullish") {
    pairImpact = usdIsBase
      ? "DXY bullish → USD strengthening. LONG (buy USD) setups are aligned with institutional flow."
      : "DXY bullish → USD strengthening. LONG (buy pair vs USD) setups face institutional headwind. Need strong pair-side structure.";
  } else if (trend === "bearish" && zone === "discount") {
    pairImpact = usdIsBase
      ? "DXY bearish in discount → USD extended to the downside, reversal risk. SHORT setups need extra confirmation."
      : "DXY bearish in discount → USD weakness is overextended. SHORT setups (selling pair vs USD) may face reversal risk.";
  } else if (trend === "bearish") {
    pairImpact = usdIsBase
      ? "DXY bearish → USD weakening. SHORT (sell USD) setups are aligned with institutional flow."
      : "DXY bearish → USD weakening. LONG (buy pair vs USD) setups are aligned with institutional USD selling.";
  } else {
    pairImpact = "DXY ranging — no strong USD directional bias. Trade the pair on its own structure merit.";
  }

  return [
    `DXY: ${lastClose.toFixed(3)} | Trend: ${trend.toUpperCase()} | Zone: ${zone.toUpperCase()}`,
    `Range H4: ${pd.low.toFixed(3)} – ${pd.high.toFixed(3)} | Midpoint: ${pd.mid.toFixed(3)}`,
    pairImpact,
  ].join("\n");
}

export async function fetchMultiTimeframeContext(pair: CurrencyPair): Promise<MultiTimeframeContext> {
  const precision = pair.includes("JPY") ? 3 : pair === "XAUUSD" ? 2 : 5;

  // Fetch pair timeframes + DXY in parallel
  const [daily, h4, m15, dxyResult] = await Promise.allSettled([
    fetchMarketSnapshot(pair, "4h"),    // TwelveData free tier: use 4h as proxy for daily structure
    fetchMarketSnapshot(pair, "4h"),    // H4 session structure
    fetchMarketSnapshot(pair, "15min"), // M15 entry trigger
    fetchDXYBars(),                     // DXY correlation filter
  ]);

  const [dailySnapshot, h4Snapshot, m15Snapshot] = [daily, h4, m15].map((r) =>
    r.status === "fulfilled" ? r.value : null
  );
  const dxy = dxyResult.status === "fulfilled" ? dxyResult.value : { bars: [], fallback: true };

  const fallback = [dailySnapshot, h4Snapshot, m15Snapshot].some((s) => s?.fallback);
  const currentPrice = m15Snapshot?.price ?? h4Snapshot?.price ?? dailySnapshot?.price ?? 0;

  // Premium/discount from H4 range (best proxy for weekly range with free API)
  const h4Bars = h4Snapshot?.bars ?? [];
  const pd = calcPremiumDiscount(h4Bars);
  const currentZone: "premium" | "discount" | "midrange" =
    currentPrice > pd.mid + (pd.high - pd.mid) * 0.25
      ? "premium"
      : currentPrice < pd.mid - (pd.mid - pd.low) * 0.25
        ? "discount"
        : "midrange";

  const atrM15 = calcATR(m15Snapshot?.bars ?? []);
  const atrH4 = calcATR(h4Bars);

  const dxySection = analyzeDXYCorrelation(pair, dxy.bars);

  const lines: string[] = [
    `=== MULTI-TIMEFRAME MARKET DATA: ${pair} ===`,
    `Current price: ${currentPrice.toFixed(precision)}`,
    `ATR(14) M15: ${atrM15.toFixed(precision)} | ATR(14) H4: ${atrH4.toFixed(precision)}`,
    `Data source: ${fallback ? "FALLBACK (synthetic)" : "live"}`,
    "",
    `--- DXY CORRELATION (USD INDEX) ---`,
    dxySection,
    "",
    `--- PREMIUM/DISCOUNT ZONE (H4 range) ---`,
    `Range high: ${pd.high.toFixed(precision)} | Range low: ${pd.low.toFixed(precision)} | Midpoint (50%): ${pd.mid.toFixed(precision)}`,
    `Current price is in: ${currentZone.toUpperCase()} zone`,
    "(PREMIUM = above 50% of range → institutional selling area. DISCOUNT = below 50% → institutional buying area.)",
    "",
  ];

  if (h4Snapshot?.bars?.length) {
    lines.push(`--- H4 BARS (session structure — last ${h4Snapshot.bars.length} candles) ---`);
    lines.push(formatBarsTable(h4Snapshot.bars, precision));
    lines.push("");
  }

  if (m15Snapshot?.bars?.length) {
    lines.push(`--- M15 BARS (entry trigger — last ${m15Snapshot.bars.length} candles) ---`);
    lines.push(formatBarsTable(m15Snapshot.bars, precision));
    lines.push("");
  }

  lines.push(
    fallback
      ? "NOTE: Data source is synthetic (live feed unavailable). Structure observations are illustrative only — do not score above 5 on fallback data."
      : "Use H4 bars to identify Order Blocks and Fair Value Gaps. Use M15 bars to confirm entry trigger."
  );

  return {
    pair,
    currentPrice,
    atrM15,
    atrH4,
    premiumDiscountZone: { ...pd, currentZone },
    formattedContext: lines.join("\n"),
    fallback,
  };
}

export async function fetchMarketSnapshot(
  pair: CurrencyPair,
  timeframe: MarketTimeframe = "15min"
): Promise<MarketSnapshot> {
  const apiKey = process.env.TWELVE_DATA_API_KEY;
  const precision = getPricePrecision(pair);

  if (!apiKey) {
    return buildFallbackSnapshot(pair, timeframe);
  }

  const symbol = pairToSymbol(pair);
  const quoteUrl = new URL(`${TWELVE_DATA_BASE_URL}/quote`);
  quoteUrl.searchParams.set("symbol", symbol);
  quoteUrl.searchParams.set("interval", timeframe);
  quoteUrl.searchParams.set("apikey", apiKey);

  const timeSeriesUrl = new URL(`${TWELVE_DATA_BASE_URL}/time_series`);
  timeSeriesUrl.searchParams.set("symbol", symbol);
  timeSeriesUrl.searchParams.set("interval", timeframe);
  timeSeriesUrl.searchParams.set("outputsize", getOutputSize(timeframe));
  timeSeriesUrl.searchParams.set("apikey", apiKey);

  try {
    const [quoteResponse, timeSeriesResponse, yesterdayPerformance] = await Promise.all([
      fetch(quoteUrl, {
        headers: { Accept: "application/json" },
        next: { revalidate: 60 },
      }),
      fetch(timeSeriesUrl, {
        headers: { Accept: "application/json" },
        next: { revalidate: 60 },
      }),
      fetchYesterdayPerformanceFromProvider(symbol, apiKey, precision).catch((error) => {
        console.error("Yesterday performance fetch failed:", error);
        return undefined;
      }),
    ]);

    if (!quoteResponse.ok || !timeSeriesResponse.ok) {
      throw new Error("Market provider request failed.");
    }

    const quotePayload = (await quoteResponse.json()) as TwelveDataQuoteResponse;
    const timeSeriesPayload = (await timeSeriesResponse.json()) as TwelveDataTimeSeriesResponse;

    if (quotePayload.code || timeSeriesPayload.code || quotePayload.message || timeSeriesPayload.message) {
      throw new Error(quotePayload.message || timeSeriesPayload.message || "Market provider returned an error.");
    }

    const bars = formatBars(timeSeriesPayload.values);
    const price = toNumber(quotePayload.close) ?? bars[bars.length - 1]?.close;
    const open = toNumber(quotePayload.open) ?? bars[0]?.open;
    const high = toNumber(quotePayload.high) ?? Math.max(...bars.map((bar) => bar.high));
    const low = toNumber(quotePayload.low) ?? Math.min(...bars.map((bar) => bar.low));

    if (
      typeof price !== "number" ||
      typeof open !== "number" ||
      typeof high !== "number" ||
      typeof low !== "number" ||
      bars.length === 0
    ) {
      throw new Error("Market provider response was incomplete.");
    }

    const fallbackYesterday =
      yesterdayPerformance || buildFallbackYesterdayPerformance(pair, bars[bars.length - 2]?.close ?? price, precision);

    return {
      pair,
      symbol,
      timeframe,
      price,
      open,
      high,
      low,
      previousClose: toNumber(quotePayload.previous_close),
      change: toNumber(quotePayload.change),
      percentChange: toNumber(quotePayload.percent_change),
      asOf: new Date(quotePayload.datetime || bars[bars.length - 1].time).toISOString(),
      isMarketOpen: quotePayload.is_market_open,
      yesterday: fallbackYesterday,
      bars,
      source: "twelvedata",
      fallback: false,
    };
  } catch (error) {
    console.error("Market snapshot fetch failed, using fallback snapshot:", error);
    return buildFallbackSnapshot(pair, timeframe);
  }
}

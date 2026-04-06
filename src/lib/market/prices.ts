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
  return timeframe === "4h" ? "15" : "30";
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

  const bars: MarketBar[] = Array.from({ length: 30 }).map((_, index) => {
    const step = 29 - index;
    const open = Number((basePrice - step * trendStep).toFixed(precision));
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
    latestBar
      ? `Latest candle ${latestBar.time}: O ${latestBar.open}, H ${latestBar.high}, L ${latestBar.low}, C ${latestBar.close}.`
      : "Latest candle unavailable.",
    `Recent intraday range ${rangeLow} to ${rangeHigh}.`,
    snapshot.fallback
      ? "Provider unavailable, so this snapshot is a conservative fallback. Treat confidence as lower until verified manually."
      : "Use this snapshot as context, not as a standalone trigger.",
  ].join(" ");
}

export async function fetchMarketSnapshot(
  pair: CurrencyPair,
  timeframe: MarketTimeframe = "15min"
): Promise<MarketSnapshot> {
  const apiKey = process.env.TWELVE_DATA_API_KEY;

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
    const [quoteResponse, timeSeriesResponse] = await Promise.all([
      fetch(quoteUrl, {
        headers: { Accept: "application/json" },
        next: { revalidate: 60 },
      }),
      fetch(timeSeriesUrl, {
        headers: { Accept: "application/json" },
        next: { revalidate: 60 },
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
      bars,
      source: "twelvedata",
      fallback: false,
    };
  } catch (error) {
    console.error("Market snapshot fetch failed, using fallback snapshot:", error);
    return buildFallbackSnapshot(pair, timeframe);
  }
}

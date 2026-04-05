import { CURRENCIES } from "@/config/trading";
import { Currency, CurrencyPair, NewsEvent } from "@/types";

interface TradingEconomicsCalendarEntry {
  Date?: string;
  Currency?: string;
  Event?: string;
  Importance?: number | string;
  Forecast?: string;
  Previous?: string;
}

interface FetchEconomicCalendarOptions {
  currencies?: Currency[];
  from?: Date;
  to?: Date;
  limit?: number;
  minimumImpact?: "medium" | "high";
}

const TRADING_ECONOMICS_BASE_URL = "https://api.tradingeconomics.com";
const TRACKED_CURRENCIES = new Set<Currency>(CURRENCIES);

function toDateParam(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function normalizeCurrency(value?: string): Currency | null {
  const normalized = value?.trim().toUpperCase();
  if (!normalized) return null;
  return TRACKED_CURRENCIES.has(normalized as Currency) ? (normalized as Currency) : null;
}

function normalizeImpact(value?: number | string): NewsEvent["impact"] | null {
  const importance = typeof value === "string" ? Number(value) : value;
  if (importance === 3) return "high";
  if (importance === 2) return "medium";
  if (importance === 1) return "low";
  return null;
}

function mapCalendarEntry(entry: TradingEconomicsCalendarEntry): NewsEvent | null {
  const time = entry.Date ? new Date(entry.Date) : null;
  const currency = normalizeCurrency(entry.Currency);
  const impact = normalizeImpact(entry.Importance);
  const event = entry.Event?.trim();

  if (!time || Number.isNaN(time.getTime()) || !currency || !impact || !event) {
    return null;
  }

  return {
    time,
    currency,
    event,
    impact,
    forecast: entry.Forecast?.trim() || undefined,
    previous: entry.Previous?.trim() || undefined,
  };
}

export function getFallbackNewsEvents(now: Date = new Date()): NewsEvent[] {
  const start = now.getTime();

  return [
    {
      time: new Date(start + 25 * 60_000),
      currency: "USD",
      event: "Non-Farm Payrolls",
      impact: "high",
      forecast: "180K",
      previous: "175K",
    },
    {
      time: new Date(start + 90 * 60_000),
      currency: "EUR",
      event: "ECB Rate Decision",
      impact: "high",
      forecast: "4.25%",
      previous: "4.50%",
    },
    {
      time: new Date(start + 180 * 60_000),
      currency: "GBP",
      event: "CPI y/y",
      impact: "medium",
      forecast: "2.1%",
      previous: "2.3%",
    },
    {
      time: new Date(start + 360 * 60_000),
      currency: "USD",
      event: "FOMC Meeting Minutes",
      impact: "high",
    },
    {
      time: new Date(start + 480 * 60_000),
      currency: "AUD",
      event: "Employment Change",
      impact: "medium",
      forecast: "25.0K",
      previous: "22.2K",
    },
  ];
}

export function getPairCurrencies(pair: CurrencyPair): Currency[] {
  if (pair === "XAUUSD") {
    return ["USD"];
  }

  return [pair.slice(0, 3) as Currency, pair.slice(3, 6) as Currency];
}

export function formatNewsContextForAnalysis(events: NewsEvent[], pair: CurrencyPair) {
  if (events.length === 0) {
    return `Economic calendar for ${pair}: no medium or high impact events scheduled in the next few days.`;
  }

  const summary = events
    .map((event) => {
      const forecast = event.forecast ? `forecast ${event.forecast}` : "forecast unavailable";
      const previous = event.previous ? `previous ${event.previous}` : "previous unavailable";
      return `${event.currency} ${event.event} at ${event.time.toISOString()} (${event.impact}, ${forecast}, ${previous})`;
    })
    .join("; ");

  return `Economic calendar for ${pair}: ${summary}`;
}

export async function fetchEconomicCalendar({
  currencies,
  from = new Date(),
  to = addDays(from, 3),
  limit = 20,
  minimumImpact = "medium",
}: FetchEconomicCalendarOptions = {}): Promise<NewsEvent[]> {
  const apiKey = process.env.TRADING_ECONOMICS_API_KEY || "guest:guest";
  const url = new URL(
    `${TRADING_ECONOMICS_BASE_URL}/calendar/country/All/${toDateParam(from)}/${toDateParam(to)}`
  );

  url.searchParams.set("c", apiKey);
  url.searchParams.set("f", "json");
  url.searchParams.set("importance", minimumImpact === "high" ? "3" : "2");

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    next: {
      revalidate: 300,
    },
  });

  if (!response.ok) {
    throw new Error(`Trading Economics calendar request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as TradingEconomicsCalendarEntry[];
  const now = Date.now();

  const events = payload
    .map(mapCalendarEntry)
    .filter((event): event is NewsEvent => Boolean(event))
    .filter((event) => event.time.getTime() >= now)
    .filter((event) => (minimumImpact === "high" ? event.impact === "high" : event.impact !== "low"))
    .filter((event) => !currencies?.length || currencies.includes(event.currency))
    .sort((left, right) => left.time.getTime() - right.time.getTime())
    .slice(0, limit);

  return events;
}

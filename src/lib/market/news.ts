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

interface FmpEconomicCalendarEntry {
  date?: string;
  event?: string;
  country?: string;
  currency?: string;
  impact?: number | string;
  estimate?: string | number;
  forecast?: string | number;
  previous?: string | number;
}

interface FetchEconomicCalendarOptions {
  currencies?: Currency[];
  from?: Date;
  to?: Date;
  limit?: number;
  minimumImpact?: "low" | "medium" | "high";
}

const TRADING_ECONOMICS_BASE_URL = "https://api.tradingeconomics.com";
const FMP_BASE_URL = "https://financialmodelingprep.com";
const TRACKED_CURRENCIES = new Set<Currency>(CURRENCIES);
const COUNTRY_TO_CURRENCY: Record<string, Currency> = {
  "united states": "USD",
  usa: "USD",
  "euro zone": "EUR",
  eurozone: "EUR",
  germany: "EUR",
  france: "EUR",
  italy: "EUR",
  spain: "EUR",
  "united kingdom": "GBP",
  uk: "GBP",
  japan: "JPY",
  switzerland: "CHF",
  australia: "AUD",
  "new zealand": "NZD",
  canada: "CAD",
};

function toDateParam(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function addDays(date: Date, days: number) {
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
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value === "number") {
    if (value >= 3) return "high";
    if (value === 2) return "medium";
    if (value === 1) return "low";
    return null;
  }

  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;
  if (normalized === "high" || normalized === "3") return "high";
  if (normalized === "medium" || normalized === "med" || normalized === "2") return "medium";
  if (normalized === "low" || normalized === "1") return "low";

  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) return null;
  if (parsed >= 3) return "high";
  if (parsed === 2) return "medium";
  if (parsed === 1) return "low";

  return null;
}

function normalizeCountryCurrency(country?: string): Currency | null {
  if (!country) {
    return null;
  }

  return COUNTRY_TO_CURRENCY[country.trim().toLowerCase()] ?? null;
}

function toOptionalString(value?: string | number) {
  if (value === undefined || value === null) {
    return undefined;
  }

  const text = String(value).trim();
  return text.length > 0 ? text : undefined;
}

function meetsMinimumImpact(
  impact: NewsEvent["impact"],
  minimumImpact: NonNullable<FetchEconomicCalendarOptions["minimumImpact"]>
) {
  if (minimumImpact === "low") return true;
  if (minimumImpact === "medium") return impact !== "low";
  return impact === "high";
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

function mapFmpCalendarEntry(entry: FmpEconomicCalendarEntry): NewsEvent | null {
  const time = entry.date ? new Date(entry.date) : null;
  const event = entry.event?.trim();
  const currency = normalizeCurrency(entry.currency) ?? normalizeCountryCurrency(entry.country);
  const impact = normalizeImpact(entry.impact) ?? "medium";

  if (!time || Number.isNaN(time.getTime()) || !currency || !event) {
    return null;
  }

  return {
    time,
    currency,
    event,
    impact,
    forecast: toOptionalString(entry.forecast ?? entry.estimate),
    previous: toOptionalString(entry.previous),
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
  if (minimumImpact === "high") {
    url.searchParams.set("importance", "3");
  } else if (minimumImpact === "medium") {
    url.searchParams.set("importance", "2");
  }

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
    .filter((event) => meetsMinimumImpact(event.impact, minimumImpact))
    .filter((event) => !currencies?.length || currencies.includes(event.currency))
    .sort((left, right) => left.time.getTime() - right.time.getTime())
    .slice(0, limit);

  return events;
}

export async function fetchFmpEconomicCalendar({
  currencies,
  from = new Date(),
  to = addDays(from, 3),
  limit = 20,
  minimumImpact = "medium",
}: FetchEconomicCalendarOptions = {}): Promise<NewsEvent[]> {
  const apiKey =
    process.env.FMP_API_KEY?.trim() ||
    process.env.FINANCIAL_MODELING_PREP_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("FMP_API_KEY is not configured.");
  }

  const endpoints = [
    `${FMP_BASE_URL}/stable/economic-calendar`,
    `${FMP_BASE_URL}/api/v3/economic_calendar`,
  ];

  let lastError: Error | null = null;

  for (const endpoint of endpoints) {
    try {
      const url = new URL(endpoint);
      url.searchParams.set("apikey", apiKey);
      url.searchParams.set("from", toDateParam(from));
      url.searchParams.set("to", toDateParam(to));

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
        },
        next: {
          revalidate: 300,
        },
      });

      if (!response.ok) {
        throw new Error(`FMP calendar request failed with status ${response.status}.`);
      }

      const payload = (await response.json()) as FmpEconomicCalendarEntry[] | { economicCalendar?: FmpEconomicCalendarEntry[] };
      const rows = Array.isArray(payload)
        ? payload
        : Array.isArray(payload.economicCalendar)
          ? payload.economicCalendar
          : [];

      const now = Date.now();

      const events = rows
        .map(mapFmpCalendarEntry)
        .filter((event): event is NewsEvent => Boolean(event))
        .filter((event) => event.time.getTime() >= now)
        .filter((event) => meetsMinimumImpact(event.impact, minimumImpact))
        .filter((event) => !currencies?.length || currencies.includes(event.currency))
        .sort((left, right) => left.time.getTime() - right.time.getTime())
        .slice(0, limit);

      if (events.length > 0) {
        return events;
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown FMP calendar error.");
    }
  }

  if (lastError) {
    throw lastError;
  }

  return [];
}

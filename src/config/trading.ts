import { AccountRules, FUNDED_RULES, PERSONAL_RULES, CurrencyPair, Currency } from "@/types";

// ============================================================
// TRADING SYSTEM CONFIGURATION
// ============================================================

export const TRADING_CONFIG = {
  // Session times (UTC)
  sessions: {
    asia:    { start: "00:00", end: "09:00" },
    london:  { start: "07:00", end: "16:00" },
    newYork: { start: "12:00", end: "21:00" },
    overlapLonNy: { start: "12:00", end: "16:00" },
  },

  // Kill zones — highest-probability entry windows (ICT/SMC)
  // Outside these windows entries carry more noise risk.
  killZones: {
    londonOpen:  { start: "07:00", end: "09:30", label: "London Open" },
    newYorkOpen: { start: "12:00", end: "14:00", label: "New York Open" },
    londonClose: { start: "15:00", end: "16:00", label: "London Close" },
  },

  // Preferred session
  preferredSession: "london" as const,

  // News buffer: avoid trading X minutes before/after high-impact news
  newsBufferMinutes: 30,

  // Break-even trigger: move SL to entry after +1R
  breakEvenTriggerR: 1,

  // Min score to take a trade (1-10)
  minTradeScore: 7,

  // Max pairs to watch per day
  maxWatchlistPairs: 3,
} as const;

// --- Account Rules Lookup ---
export function getAccountRules(mode: "funded" | "personal"): AccountRules {
  return mode === "funded" ? FUNDED_RULES : PERSONAL_RULES;
}

// --- Pip Values (per standard lot, approximate, vs USD) ---
export const PIP_VALUES: Partial<Record<CurrencyPair, number>> = {
  EURUSD: 10,
  GBPUSD: 10,
  AUDUSD: 10,
  NZDUSD: 10,
  USDCAD: 10,  // approximate, depends on rate
  USDCHF: 10,
  USDJPY: 6.5, // approximate
  XAUUSD: 10,
};

// Default pip value if pair not listed
export const DEFAULT_PIP_VALUE = 10;

// --- Pip Decimal Places ---
export function getPipMultiplier(pair: CurrencyPair): number {
  if (pair === "XAUUSD") {
    return 10;
  }

  // JPY pairs = 0.01 per pip, others = 0.0001
  return pair.includes("JPY") ? 100 : 10000;
}

export function getPricePrecision(pair: CurrencyPair): number {
  if (pair === "XAUUSD") {
    return 2;
  }

  return pair.includes("JPY") ? 3 : 5;
}

// --- All Tracked Currencies ---
export const CURRENCIES: Currency[] = [
  "USD", "EUR", "GBP", "JPY", "CHF", "AUD", "NZD", "CAD",
];

// --- Major Pairs ---
export const MAJOR_PAIRS: CurrencyPair[] = [
  "EURUSD", "GBPUSD", "USDJPY", "USDCHF", "AUDUSD", "NZDUSD", "USDCAD", "XAUUSD",
];

// --- Cross Pairs ---
export const CROSS_PAIRS: CurrencyPair[] = [];

export const ALL_PAIRS: CurrencyPair[] = [...MAJOR_PAIRS, ...CROSS_PAIRS];

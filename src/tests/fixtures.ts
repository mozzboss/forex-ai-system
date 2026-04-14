import type {
  FullAnalysis,
  JournalEntry,
  NewsEvent,
  TradingAccount,
  Trade,
  TradeStatus,
} from "@/types";

const BASE_DATE = new Date("2026-04-04T12:00:00.000Z");

export function createNewsEvent(overrides: Partial<NewsEvent> = {}): NewsEvent {
  return {
    time: BASE_DATE,
    currency: "USD",
    event: "US NFP",
    impact: "medium",
    forecast: "180K",
    previous: "165K",
    ...overrides,
  };
}

export function createAccount(overrides: Partial<TradingAccount> = {}): TradingAccount {
  return {
    id: "22222222-2222-2222-2222-222222222222",
    userId: "11111111-1111-1111-1111-111111111111",
    name: "FTMO Challenge",
    mode: "funded",
    balance: 10000,
    equity: 10000,
    riskPercent: 0.5,
    maxDailyLoss: 500,
    maxDrawdown: 1000,
    maxTradesPerDay: 3,
    currentDailyLoss: 0,
    currentDailyTrades: 0,
    lossesInARow: 0,
    openTrades: [],
    isActive: true,
    createdAt: BASE_DATE,
    updatedAt: BASE_DATE,
    ...overrides,
  };
}

export function createAnalysis(overrides: Partial<FullAnalysis> = {}): FullAnalysis {
  return {
    timestamp: BASE_DATE,
    marketOverview: {
      pair: "EURUSD",
      bias: "bullish",
      structure: "Higher highs and higher lows on H4.",
      volatility: "medium",
      marketCondition: "trending",
      ...(overrides.marketOverview ?? {}),
    },
    macro: {
      interestRates: "USD steady, EUR soft.",
      centralBank: "ECB remains cautious.",
      inflation: "Inflation easing in the eurozone.",
      currencyStrength: {
        USD: -2,
        EUR: 3,
        GBP: 1,
        JPY: -1,
        CHF: 0,
        AUD: 1,
        NZD: 0,
        CAD: -1,
      },
      summary: "Macro leans bullish on EURUSD.",
      ...(overrides.macro ?? {}),
    },
    sentiment: {
      retailPositioning: "Retail is net short.",
      bias: "bullish",
      crowdDirection: "SHORT",
      summary: "Retail crowd remains faded against the move.",
      ...(overrides.sentiment ?? {}),
    },
    tradeSetup: {
      pair: "EURUSD",
      direction: "LONG",
      setupType: "pullback",
      entryZone: { low: 1.1, high: 1.101 },
      stopLoss: 1.095,
      takeProfit: 1.11,
      confirmation: "Bullish engulfing close at support.",
      invalidation: "Break below 1.0950 support.",
      higherTimeframe: "H4",
      lowerTimeframe: "M15",
      ...(overrides.tradeSetup ?? {}),
    },
    entryStatus: {
      status: "CONFIRMED",
      userAction: "EXECUTE",
      reason: "Confirmation candle closed in the zone.",
      whatMustHappenNext: "Execute with stop loss already defined.",
      updatedAt: BASE_DATE,
      ...(overrides.entryStatus ?? {}),
    },
    exitLogic: {
      stopLoss: 1.095,
      takeProfit: 1.11,
      breakEvenRule: "Move to break even after +1R.",
      trailingStop: "Trail below each M15 swing low.",
      ...(overrides.exitLogic ?? {}),
    },
    riskPerAccount: overrides.riskPerAccount ?? {},
    sessionAndNews: {
      currentSession: "london",
      bestTiming: "London continuation",
      newsRisk: "low",
      upcomingEvents: [],
      ...(overrides.sessionAndNews ?? {}),
    },
    finalDecision: {
      score: 8,
      decision: "TAKE_TRADE",
      reasoning: "Trend, structure, and confirmation align.",
      ...(overrides.finalDecision ?? {}),
    },
    ...overrides,
  };
}

export function createTrade(overrides: Partial<Trade> = {}): Trade {
  const status = (overrides.status ?? "open") as TradeStatus;

  return {
    id: "44444444-4444-4444-4444-444444444444",
    accountId: "22222222-2222-2222-2222-222222222222",
    pair: "EURUSD",
    direction: "LONG",
    setupType: "pullback",
    entryPrice: 1.1,
    stopLoss: 1.095,
    takeProfit: 1.11,
    lotSize: 0.2,
    riskAmount: 100,
    riskRewardRatio: 2,
    status,
    entryStatus: status === "denied" ? "INVALID" : "CONFIRMED",
    pnl: status === "closed" ? 150 : undefined,
    pipsPnl: status === "closed" ? 100 : undefined,
    openedAt: status === "open" || status === "closed" ? BASE_DATE : undefined,
    closedAt: status === "closed" ? BASE_DATE : undefined,
    createdAt: BASE_DATE,
    notes: "Test trade",
    aiScore: 8,
    aiDecision: status === "denied" ? "DENY" : "TAKE_TRADE",
    aiReasoning: "Risk and structure align.",
    denialReason: status === "denied" ? "weak_setup" : undefined,
    ...overrides,
  };
}

export function createJournalEntry(overrides: Partial<JournalEntry> = {}): JournalEntry {
  return {
    id: "55555555-5555-5555-5555-555555555555",
    userId: "11111111-1111-1111-1111-111111111111",
    date: BASE_DATE,
    type: "review",
    content: "Stayed patient and followed the plan.",
    mistakes: [],
    disciplineScore: 8,
    aiFeedback: "Solid process overall.",
    tags: ["discipline"],
    ...overrides,
  };
}

export { BASE_DATE };

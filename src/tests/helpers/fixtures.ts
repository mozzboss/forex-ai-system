import type {
  CurrencyPair,
  FullAnalysis,
  NewsEvent,
  TradingAccount,
  Trade,
} from "@/types";

export function makeAccount(overrides: Partial<TradingAccount> = {}): TradingAccount {
  const now = new Date("2026-04-04T12:00:00.000Z");

  return {
    id: "account-1",
    userId: "user-1",
    name: "Primary Account",
    mode: "personal",
    balance: 10000,
    equity: 10000,
    riskPercent: 1,
    maxDailyLoss: 300,
    maxDrawdown: 1000,
    maxTradesPerDay: 5,
    currentDailyLoss: 0,
    currentDailyTrades: 0,
    lossesInARow: 0,
    openTrades: [],
    isActive: true,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function makeNewsEvent(overrides: Partial<NewsEvent> = {}): NewsEvent {
  return {
    time: new Date("2026-04-04T13:00:00.000Z"),
    currency: "USD",
    event: "Non-Farm Payrolls",
    impact: "high",
    forecast: "200k",
    previous: "175k",
    ...overrides,
  };
}

export function makeAnalysis(overrides: Partial<FullAnalysis> = {}): FullAnalysis {
  const basePair: CurrencyPair = "EURUSD";
  const now = new Date("2026-04-04T12:00:00.000Z");

  return {
    timestamp: now,
    marketOverview: {
      pair: basePair,
      bias: "bullish",
      structure: "Higher highs and higher lows on H4.",
      volatility: "medium",
      marketCondition: "trending",
    },
    macro: {
      interestRates: "ECB stable, Fed easing bias.",
      centralBank: "ECB neutral, Fed slightly dovish.",
      inflation: "Moderating in the US.",
      currencyStrength: {
        USD: -3,
        EUR: 4,
        GBP: 1,
        JPY: -1,
        CHF: 0,
        AUD: 1,
        NZD: 0,
        CAD: -2,
      },
      summary: "Macro leans bullish for EURUSD.",
    },
    sentiment: {
      retailPositioning: "Retail short EURUSD.",
      bias: "bullish",
      crowdDirection: "SHORT",
      summary: "Crowd is leaning against upside.",
    },
    tradeSetup: {
      pair: basePair,
      direction: "LONG",
      setupType: "pullback",
      entryZone: { low: 1.084, high: 1.085 },
      stopLoss: 1.082,
      takeProfit: 1.09,
      confirmation: "Bullish candle close in the zone.",
      invalidation: "Break below London low.",
      higherTimeframe: "H4",
      lowerTimeframe: "M15",
    },
    entryStatus: {
      status: "CONFIRMED",
      userAction: "EXECUTE",
      reason: "All conditions are aligned.",
      whatMustHappenNext: "Execute only if spread and news conditions remain acceptable.",
      updatedAt: now,
    },
    exitLogic: {
      stopLoss: 1.082,
      takeProfit: 1.09,
      breakEvenRule: "Move to break-even at 1R.",
      trailingStop: "Trail below M15 swing lows after 1.5R.",
    },
    riskPerAccount: {
      "account-1": {
        riskAmount: 100,
        pipDistance: 20,
        lotSize: 0.5,
        maxLoss: 100,
        maxProfit: 300,
        riskRewardRatio: 3,
        isValid: true,
      },
    },
    sessionAndNews: {
      currentSession: "london",
      bestTiming: "London continuation.",
      newsRisk: "low",
      upcomingEvents: [],
    },
    finalDecision: {
      score: 8,
      decision: "TAKE_TRADE",
      reasoning: "Clean trend alignment with confirmation and acceptable risk.",
    },
    ...overrides,
  };
}

export function makeTrade(overrides: Partial<Trade> = {}): Trade {
  const now = new Date("2026-04-04T12:00:00.000Z");

  return {
    id: "trade-1",
    accountId: "account-1",
    pair: "EURUSD",
    direction: "LONG",
    setupType: "pullback",
    entryPrice: 1.0845,
    stopLoss: 1.0825,
    takeProfit: 1.09,
    lotSize: 0.5,
    riskAmount: 100,
    riskRewardRatio: 3,
    status: "open",
    entryStatus: "CONFIRMED",
    createdAt: now,
    aiScore: 8,
    aiDecision: "TAKE_TRADE",
    aiReasoning: "Clean setup.",
    ...overrides,
  };
}

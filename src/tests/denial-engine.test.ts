import test from "node:test";
import assert from "node:assert/strict";

import { runDenialChecks, shouldAllowTrade } from "@/lib/market/denial";
import { createAccount, createAnalysis, createNewsEvent } from "./fixtures";

test("runDenialChecks flags weak, unconfirmed, risky, and choppy setups", () => {
  const analysis = createAnalysis({
    entryStatus: {
      status: "WAIT",
      userAction: "WAIT",
      reason: "Still forming.",
      whatMustHappenNext: "Wait for confirmation.",
      updatedAt: new Date("2026-04-04T12:00:00.000Z"),
    },
    sessionAndNews: {
      currentSession: "london",
      bestTiming: "Wait until after data",
      newsRisk: "high",
      upcomingEvents: [createNewsEvent({ impact: "high" })],
    },
    marketOverview: {
      pair: "EURUSD",
      bias: "bullish",
      structure: "Messy range",
      volatility: "high",
      marketCondition: "choppy",
    },
    finalDecision: {
      score: 6,
      decision: "WAIT",
      reasoning: "Too many mixed factors.",
    },
  });

  const account = createAccount({
    mode: "funded",
    currentDailyTrades: 3,
    currentDailyLoss: 490,
    lossesInARow: 2,
    equity: 9150,
  });

  const denials = runDenialChecks(analysis, account).map((item) => item.reason);

  assert.ok(denials.includes("weak_setup"));
  assert.ok(denials.includes("no_confirmation"));
  assert.ok(denials.includes("news_too_close"));
  assert.ok(denials.includes("overtrading"));
  assert.ok(denials.includes("funded_rules_at_risk"));
  assert.ok(denials.includes("choppy_market"));
  assert.ok(denials.includes("daily_loss_reached"));
  assert.ok(denials.includes("max_drawdown_reached"));
  assert.ok(denials.includes("consecutive_losses"));
});

test("shouldAllowTrade returns false when macro and sentiment conflict with setup", () => {
  const analysis = createAnalysis({
    marketOverview: {
      pair: "EURUSD",
      bias: "neutral",
      structure: "Price is fighting key levels.",
      volatility: "medium",
      marketCondition: "trending",
    },
    macro: {
      interestRates: "USD strong.",
      centralBank: "Fed remains firm.",
      inflation: "US inflation sticky.",
      currencyStrength: {
        USD: 5,
        EUR: -4,
        GBP: 0,
        JPY: -1,
        CHF: 0,
        AUD: 0,
        NZD: 0,
        CAD: 0,
      },
      summary: "Macro leans bearish on EURUSD.",
    },
    sentiment: {
      retailPositioning: "Retail is net long.",
      bias: "bearish",
      crowdDirection: "LONG",
      summary: "Crowd leans the wrong way.",
    },
  });

  const result = shouldAllowTrade(analysis, createAccount({ mode: "personal" }));

  assert.equal(result.allowed, false);
  assert.ok(result.denials.some((item) => item.reason === "conflicting_signals"));
});

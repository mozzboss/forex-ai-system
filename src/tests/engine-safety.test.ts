import assert from "node:assert/strict";
import { afterEach, describe, test } from "node:test";

import { runDenialChecks, shouldAllowTrade } from "@/lib/market/denial";
import { calculateRisk, validateTradeAgainstAccount } from "@/lib/risk/engine";
import { makeAccount, makeAnalysis, makeNewsEvent } from "@/tests/helpers/fixtures";

const realDate = Date;

function mockDate(iso: string) {
  const fixedTime = new realDate(iso).getTime();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  global.Date = class extends realDate {
    constructor(value?: string | number | Date) {
      if (value !== undefined) {
        super(value);
        return;
      }

      super(fixedTime);
    }

    static now() {
      return fixedTime;
    }
  } as DateConstructor;
}

afterEach(() => {
  global.Date = realDate;
});

describe("risk engine", () => {
  test("calculates valid risk metrics for a clean long setup", () => {
    const risk = calculateRisk({
      accountBalance: 10000,
      riskPercent: 1,
      entryPrice: 1.084,
      stopLossPrice: 1.082,
      takeProfitPrice: 1.09,
      pair: "EURUSD",
      direction: "LONG",
    });

    assert.equal(risk.isValid, true);
    assert.equal(risk.riskAmount, 100);
    assert.equal(risk.pipDistance, 20);
    assert.ok(risk.lotSize > 0);
    assert.ok(risk.riskRewardRatio >= 1);
  });

  test("rejects invalid stop and target placement", () => {
    const risk = calculateRisk({
      accountBalance: 10000,
      riskPercent: 1,
      entryPrice: 1.084,
      stopLossPrice: 1.086,
      takeProfitPrice: 1.09,
      pair: "EURUSD",
      direction: "LONG",
    });

    assert.equal(risk.isValid, false);
    assert.equal(risk.denial, "SL/TP placement does not match trade direction.");
  });

  test("denies trades that breach account guardrails", () => {
    const account = makeAccount({
      currentDailyTrades: 5,
      currentDailyLoss: 250,
      lossesInARow: 3,
      maxDailyLoss: 300,
      maxDrawdown: 200,
      equity: 9850,
    });

    const denials = validateTradeAgainstAccount(account, {
      riskAmount: 100,
      pipDistance: 20,
      lotSize: 0.5,
      maxLoss: 100,
      maxProfit: 250,
      riskRewardRatio: 1.2,
      isValid: true,
    });

    assert.deepEqual(
      denials.sort(),
      [
        "consecutive_losses",
        "daily_loss_reached",
        "max_drawdown_reached",
        "overtrading",
        "poor_risk_reward",
      ].sort()
    );
  });
});

describe("denial engine", () => {
  test("flags missing confirmation and weak setup", () => {
    mockDate("2026-04-04T13:00:00.000Z");

    const analysis = makeAnalysis({
      finalDecision: {
        score: 6,
        decision: "DENY",
        reasoning: "Too many missing conditions.",
      },
      entryStatus: {
        status: "READY",
        userAction: "PREPARE",
        reason: "Price is in zone but the trigger candle is missing.",
        whatMustHappenNext: "Wait for confirmation.",
        updatedAt: new Date("2026-04-04T13:00:00.000Z"),
      },
    });

    const denials = runDenialChecks(analysis, makeAccount());
    const reasons = denials.map((denial) => denial.reason);

    assert.ok(reasons.includes("weak_setup"));
    assert.ok(reasons.includes("no_confirmation"));
  });

  test("tightens standards for funded accounts", () => {
    mockDate("2026-04-04T13:00:00.000Z");

    const analysis = makeAnalysis({
      finalDecision: {
        score: 7,
        decision: "TAKE_TRADE",
        reasoning: "Acceptable but not elite.",
      },
    });
    const account = makeAccount({
      mode: "funded",
      riskPercent: 0.5,
      maxTradesPerDay: 3,
    });

    const denials = runDenialChecks(analysis, account);

    assert.ok(denials.some((denial) => denial.reason === "funded_rules_at_risk"));
  });

  test("blocks high-impact news inside the buffer", () => {
    mockDate("2026-04-04T13:00:00.000Z");

    const analysis = makeAnalysis({
      sessionAndNews: {
        currentSession: "london",
        bestTiming: "Stand aside around the release.",
        newsRisk: "high",
        upcomingEvents: [makeNewsEvent({ time: new Date("2026-04-04T13:20:00.000Z") })],
      },
    });

    const result = shouldAllowTrade(analysis, makeAccount());
    assert.equal(result.allowed, false);
    assert.ok(result.denials.some((denial) => denial.reason === "news_too_close"));
  });
});

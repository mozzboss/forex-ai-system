import test from "node:test";
import assert from "node:assert/strict";

import { calculateRisk, validateTradeAgainstAccount } from "@/lib/risk/engine";
import { createAccount } from "./fixtures";

test("calculateRisk returns rounded lot size and reward metrics for a valid long setup", () => {
  const result = calculateRisk({
    accountBalance: 10000,
    riskPercent: 1,
    entryPrice: 1.084,
    stopLossPrice: 1.082,
    takeProfitPrice: 1.09,
    pair: "EURUSD",
    direction: "LONG",
  });

  assert.equal(result.riskAmount, 100);
  assert.equal(result.pipDistance, 20);
  assert.ok(result.lotSize >= 0.49 && result.lotSize <= 0.5);
  assert.ok(result.maxLoss >= 98 && result.maxLoss <= 100);
  assert.ok(result.maxProfit >= 294 && result.maxProfit <= 300);
  assert.equal(result.riskRewardRatio, 3);
  assert.equal(result.isValid, true);
  assert.equal(result.denial, undefined);
});

test("calculateRisk denies invalid direction placement", () => {
  const result = calculateRisk({
    accountBalance: 10000,
    riskPercent: 1,
    entryPrice: 1.1,
    stopLossPrice: 1.095,
    takeProfitPrice: 1.09,
    pair: "EURUSD",
    direction: "LONG",
  });

  assert.equal(result.isValid, false);
  assert.match(result.denial ?? "", /SL\/TP placement/i);
});

test("validateTradeAgainstAccount accumulates core account-rule denials", () => {
  const account = createAccount({
    mode: "funded",
    balance: 10000,
    equity: 9200,
    currentDailyTrades: 3,
    currentDailyLoss: 480,
    lossesInARow: 2,
    maxDailyLoss: 500,
    maxDrawdown: 840,
  });

  const denials = validateTradeAgainstAccount(account, {
    riskAmount: 80,
    pipDistance: 40,
    lotSize: 0.2,
    maxLoss: 50,
    maxProfit: 50,
    riskRewardRatio: 1,
    isValid: false,
    denial: "Risk invalid.",
  });

  assert.deepEqual(denials, [
    "overtrading",
    "consecutive_losses",
    "daily_loss_reached",
    "max_drawdown_reached",
    "poor_risk_reward",
    "funded_rules_at_risk",
  ]);
});

import {
  RiskInput,
  RiskOutput,
  TradingAccount,
  AccountRules,
  DenialReason,
} from "@/types";
import {
  getAccountRules,
  getPipMultiplier,
  PIP_VALUES,
  DEFAULT_PIP_VALUE,
} from "@/config/trading";

// ============================================================
// RISK ENGINE
// Capital protection is priority #1.
// ============================================================

/**
 * Calculate position size and risk metrics for a trade.
 */
export function calculateRisk(input: RiskInput): RiskOutput {
  const { accountBalance, riskPercent, entryPrice, stopLossPrice, takeProfitPrice, pair, direction } = input;

  // --- Risk amount in $ ---
  const riskAmount = accountBalance * (riskPercent / 100);

  // --- Pip distance to SL ---
  const pipMultiplier = getPipMultiplier(pair);
  const slDistance = Math.abs(entryPrice - stopLossPrice);
  const pipDistance = slDistance * pipMultiplier;

  // --- Pip distance to TP ---
  const tpDistance = Math.abs(takeProfitPrice - entryPrice) * pipMultiplier;

  // --- Pip value per standard lot ---
  const pipValue = PIP_VALUES[pair] ?? DEFAULT_PIP_VALUE;

  // --- Lot size ---
  const lotSize = pipDistance > 0 ? riskAmount / (pipDistance * pipValue) : 0;
  const roundedLotSize = Math.floor(lotSize * 100) / 100; // round down to 0.01

  // --- Max loss / profit ---
  const maxLoss = roundedLotSize * pipDistance * pipValue;
  const maxProfit = roundedLotSize * tpDistance * pipValue;

  // --- Risk-to-reward ---
  const riskRewardRatio = pipDistance > 0 ? tpDistance / pipDistance : 0;

  // --- Validate direction vs SL/TP placement ---
  const isDirectionValid =
    direction === "LONG"
      ? stopLossPrice < entryPrice && takeProfitPrice > entryPrice
      : stopLossPrice > entryPrice && takeProfitPrice < entryPrice;

  const isValid = roundedLotSize > 0 && isDirectionValid && riskRewardRatio >= 1;

  let denial: string | undefined;
  if (!isDirectionValid) {
    denial = "SL/TP placement does not match trade direction.";
  } else if (roundedLotSize <= 0) {
    denial = "Calculated lot size is zero. Pip distance may be too large for this risk.";
  } else if (riskRewardRatio < 1) {
    denial = `Risk-to-reward ratio (${riskRewardRatio.toFixed(2)}) is below minimum.`;
  }

  return {
    riskAmount: Math.round(riskAmount * 100) / 100,
    pipDistance: Math.round(pipDistance * 10) / 10,
    lotSize: roundedLotSize,
    maxLoss: Math.round(maxLoss * 100) / 100,
    maxProfit: Math.round(maxProfit * 100) / 100,
    riskRewardRatio: Math.round(riskRewardRatio * 100) / 100,
    isValid,
    denial,
  };
}

/**
 * Validate a trade against account rules.
 * Returns denial reasons or empty array if trade is allowed.
 */
export function validateTradeAgainstAccount(
  account: TradingAccount,
  riskOutput: RiskOutput
): DenialReason[] {
  const rules = getAccountRules(account.mode);
  const denials: DenialReason[] = [];

  // --- Overtrading ---
  if (account.currentDailyTrades >= rules.maxTradesPerDay) {
    denials.push("overtrading");
  }

  // --- Consecutive losses ---
  if (account.lossesInARow >= rules.stopAfterConsecutiveLosses) {
    denials.push("consecutive_losses");
  }

  // --- Daily loss limit ---
  if (account.currentDailyLoss + riskOutput.maxLoss > account.maxDailyLoss) {
    denials.push("daily_loss_reached");
  }

  // --- Max drawdown ---
  const totalDrawdown = account.balance - account.equity + riskOutput.maxLoss;
  if (totalDrawdown > account.maxDrawdown) {
    denials.push("max_drawdown_reached");
  }

  // --- Risk-to-reward ---
  if (riskOutput.riskRewardRatio < rules.minRiskReward) {
    denials.push("poor_risk_reward");
  }

  // --- Funded-specific: strict filtering ---
  if (account.mode === "funded" && !riskOutput.isValid) {
    denials.push("funded_rules_at_risk");
  }

  return denials;
}

/**
 * Get human-readable denial explanation.
 */
export function getDenialExplanation(reason: DenialReason): string {
  const explanations: Record<DenialReason, string> = {
    weak_setup: "The setup does not meet minimum quality standards. Missing key confirmations.",
    no_confirmation: "Entry requires confirmation (e.g., candle close, pattern completion). Not yet confirmed.",
    conflicting_signals: "Multiple analysis layers are conflicting. Macro vs. technicals disagree.",
    poor_risk_reward: "Risk-to-reward ratio is below the minimum requirement for this account type.",
    news_too_close: "A high-impact news event is too close. Trading around news increases risk of slippage.",
    overtrading: "Maximum daily trade count has been reached. No more trades today. Protect your capital.",
    funded_rules_at_risk: "This trade would put your funded account evaluation at risk. Not worth it.",
    daily_loss_reached: "Taking this trade could exceed your daily loss limit. Stop trading for today.",
    max_drawdown_reached: "This trade could breach your maximum drawdown. Capital protection is priority #1.",
    consecutive_losses: "You've hit the consecutive loss limit. Step away, review, and come back tomorrow.",
    outside_session: "Current session is not ideal for this pair. Wait for the preferred session.",
    choppy_market: "Market conditions are choppy. No clear direction. \"No trade\" is a valid outcome.",
  };
  return explanations[reason];
}

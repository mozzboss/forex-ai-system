import {
  TradingAccount,
  TradeSetup,
  FullAnalysis,
  DenialReason,
  TradeDenial,
  NewsEvent,
} from "@/types";
import { validateTradeAgainstAccount, calculateRisk, getDenialExplanation } from "@/lib/risk/engine";
import { TRADING_CONFIG, getAccountRules } from "@/config/trading";
import { isWithinSession } from "@/lib/utils";

// ============================================================
// TRADE DENIAL SYSTEM
// The gatekeeper. No trade passes without meeting ALL criteria.
// ============================================================

export interface DenialCheck {
  passed: boolean;
  reason?: DenialReason;
  explanation?: string;
}

/**
 * Run ALL denial checks for a trade. Returns all failed checks.
 */
export function runDenialChecks(
  analysis: FullAnalysis,
  account: TradingAccount
): TradeDenial[] {
  const denials: TradeDenial[] = [];
  const checks = [
    checkSetupQuality(analysis),
    checkConfirmation(analysis),
    checkConflictingSignals(analysis),
    checkRiskReward(analysis, account),
    checkNewsProximity(analysis),
    checkOvertrading(account),
    checkFundedRules(analysis, account),
    checkSessionTiming(),
    checkMarketCondition(analysis),
    checkDailyLoss(analysis, account),
    checkDrawdown(analysis, account),
    checkConsecutiveLosses(account),
  ];

  for (const check of checks) {
    if (!check.passed && check.reason) {
      denials.push({
        tradeId: "", // set by caller
        reason: check.reason,
        explanation: check.explanation || getDenialExplanation(check.reason),
        timestamp: new Date(),
      });
    }
  }

  return denials;
}

/**
 * Single verdict: should this trade be allowed?
 */
export function shouldAllowTrade(
  analysis: FullAnalysis,
  account: TradingAccount
): { allowed: boolean; denials: TradeDenial[] } {
  const denials = runDenialChecks(analysis, account);
  return {
    allowed: denials.length === 0,
    denials,
  };
}

// ============================================================
// INDIVIDUAL CHECKS
// ============================================================

function checkSetupQuality(analysis: FullAnalysis): DenialCheck {
  if (!analysis.tradeSetup) {
    return { passed: false, reason: "weak_setup", explanation: "No valid trade setup identified." };
  }
  if (analysis.finalDecision.score < TRADING_CONFIG.minTradeScore) {
    return {
      passed: false,
      reason: "weak_setup",
      explanation: `Setup score ${analysis.finalDecision.score}/10 is below minimum ${TRADING_CONFIG.minTradeScore}. ${analysis.finalDecision.reasoning}`,
    };
  }
  return { passed: true };
}

function checkConfirmation(analysis: FullAnalysis): DenialCheck {
  const { status } = analysis.entryStatus;
  if (status === "WAIT" || status === "READY") {
    return {
      passed: false,
      reason: "no_confirmation",
      explanation: `Entry status is ${status}. ${analysis.entryStatus.reason}. Must wait for CONFIRMED.`,
    };
  }
  if (status === "INVALID") {
    return {
      passed: false,
      reason: "no_confirmation",
      explanation: `Setup is INVALID. ${analysis.entryStatus.reason}`,
    };
  }
  return { passed: true };
}

function checkConflictingSignals(analysis: FullAnalysis): DenialCheck {
  if (!analysis.tradeSetup) return { passed: true };

  const setupBias = analysis.tradeSetup.direction === "LONG" ? "bullish" : "bearish";
  const macroBias = analysis.macro.summary.toLowerCase();
  const sentimentBias = analysis.sentiment.bias;

  // If sentiment is opposite to setup direction, flag conflict
  if (
    (setupBias === "bullish" && sentimentBias === "bearish") ||
    (setupBias === "bearish" && sentimentBias === "bullish")
  ) {
    // Allow if macro aligns with setup (2 of 3 agree)
    const macroAligns =
      macroBias.includes(setupBias) ||
      analysis.marketOverview.bias === (setupBias === "bullish" ? "bullish" : "bearish");

    if (!macroAligns) {
      return {
        passed: false,
        reason: "conflicting_signals",
        explanation: `Setup is ${setupBias} but both sentiment and macro lean opposite. Multiple layers disagree.`,
      };
    }
  }
  return { passed: true };
}

function checkRiskReward(analysis: FullAnalysis, account: TradingAccount): DenialCheck {
  if (!analysis.tradeSetup) return { passed: true };

  const risk = calculateRisk({
    accountBalance: account.balance,
    riskPercent: account.riskPercent,
    entryPrice: analysis.tradeSetup.entryZone.low,
    stopLossPrice: analysis.tradeSetup.stopLoss,
    takeProfitPrice: analysis.tradeSetup.takeProfit,
    pair: analysis.marketOverview.pair,
    direction: analysis.tradeSetup.direction,
  });

  const rules = getAccountRules(account.mode);
  if (risk.riskRewardRatio < rules.minRiskReward) {
    return {
      passed: false,
      reason: "poor_risk_reward",
      explanation: `R:R is ${risk.riskRewardRatio.toFixed(2)} but ${account.mode} account requires minimum ${rules.minRiskReward}:1.`,
    };
  }
  return { passed: true };
}

function checkNewsProximity(analysis: FullAnalysis): DenialCheck {
  if (analysis.sessionAndNews.newsRisk === "high") {
    const upcomingHigh = analysis.sessionAndNews.upcomingEvents.filter(
      (e) => e.impact === "high"
    );
    if (upcomingHigh.length > 0) {
      return {
        passed: false,
        reason: "news_too_close",
        explanation: `High-impact news event within ${TRADING_CONFIG.newsBufferMinutes} minutes. Wait until after the release.`,
      };
    }
  }
  return { passed: true };
}

function checkOvertrading(account: TradingAccount): DenialCheck {
  const rules = getAccountRules(account.mode);
  if (account.currentDailyTrades >= rules.maxTradesPerDay) {
    return {
      passed: false,
      reason: "overtrading",
      explanation: `${account.currentDailyTrades}/${rules.maxTradesPerDay} trades taken today. Daily limit reached for ${account.mode} account.`,
    };
  }
  return { passed: true };
}

function checkFundedRules(analysis: FullAnalysis, account: TradingAccount): DenialCheck {
  if (account.mode !== "funded") return { passed: true };

  // Extra strict: deny anything below score 8 on funded
  if (analysis.finalDecision.score < 8) {
    return {
      passed: false,
      reason: "funded_rules_at_risk",
      explanation: `Funded account requires higher confidence. Score ${analysis.finalDecision.score}/10 is below funded threshold of 8.`,
    };
  }
  return { passed: true };
}

function checkSessionTiming(): DenialCheck {
  const { sessions } = TRADING_CONFIG;

  // Allow trading during London, New York, or the overlap — deny only during the Asia dead zone
  const inLondon = isWithinSession(sessions.london);
  const inNewYork = isWithinSession(sessions.newYork);

  if (!inLondon && !inNewYork) {
    return {
      passed: false,
      reason: "outside_session",
      explanation: "Current session is outside London and New York hours. Wait for an active session with institutional liquidity.",
    };
  }

  return { passed: true };
}

function checkMarketCondition(analysis: FullAnalysis): DenialCheck {
  if (analysis.marketOverview.marketCondition === "choppy") {
    return {
      passed: false,
      reason: "choppy_market",
      explanation: `Market is choppy with no clear direction. "No trade" is a valid outcome. Wait for clarity.`,
    };
  }
  return { passed: true };
}

function checkDailyLoss(analysis: FullAnalysis, account: TradingAccount): DenialCheck {
  if (!analysis.tradeSetup) return { passed: true };

  const risk = calculateRisk({
    accountBalance: account.balance,
    riskPercent: account.riskPercent,
    entryPrice: analysis.tradeSetup.entryZone.low,
    stopLossPrice: analysis.tradeSetup.stopLoss,
    takeProfitPrice: analysis.tradeSetup.takeProfit,
    pair: analysis.marketOverview.pair,
    direction: analysis.tradeSetup.direction,
  });

  if (account.currentDailyLoss + risk.maxLoss > account.maxDailyLoss) {
    return {
      passed: false,
      reason: "daily_loss_reached",
      explanation: `Current daily loss: $${account.currentDailyLoss.toFixed(2)}. This trade risks $${risk.maxLoss.toFixed(2)} more, exceeding daily limit of $${account.maxDailyLoss.toFixed(2)}.`,
    };
  }
  return { passed: true };
}

function checkDrawdown(analysis: FullAnalysis, account: TradingAccount): DenialCheck {
  const currentDrawdown = account.balance - account.equity;
  if (currentDrawdown >= account.maxDrawdown * 0.8) {
    return {
      passed: false,
      reason: "max_drawdown_reached",
      explanation: `Drawdown is at ${((currentDrawdown / account.maxDrawdown) * 100).toFixed(1)}% of limit. Too close to max. Protect your account.`,
    };
  }
  return { passed: true };
}

function checkConsecutiveLosses(account: TradingAccount): DenialCheck {
  const rules = getAccountRules(account.mode);
  if (account.lossesInARow >= rules.stopAfterConsecutiveLosses) {
    return {
      passed: false,
      reason: "consecutive_losses",
      explanation: `${account.lossesInARow} consecutive losses. ${account.mode === "funded" ? "Funded rules require stopping." : "Step away, review, and come back tomorrow."}`,
    };
  }
  return { passed: true };
}

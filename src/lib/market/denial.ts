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
    checkSessionTiming(analysis),
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
  const opposite = setupBias === "bullish" ? "bearish" : "bullish";

  const sentimentOpposes = analysis.sentiment.bias === opposite;
  const overviewOpposes = analysis.marketOverview.bias === opposite;

  // Deny only if both sentiment AND market overview oppose the setup direction
  if (sentimentOpposes && overviewOpposes) {
    return {
      passed: false,
      reason: "conflicting_signals",
      explanation: `Setup is ${setupBias} but market overview and sentiment both read ${opposite}. All three layers must not point in opposite directions.`,
    };
  }
  return { passed: true };
}

function checkRiskReward(analysis: FullAnalysis, account: TradingAccount): DenialCheck {
  if (!analysis.tradeSetup) return { passed: true };

  // Use worst-case entry: high of zone for LONG (paying more), low for SHORT (paying less)
  const worstCaseEntry =
    analysis.tradeSetup.direction === "LONG"
      ? analysis.tradeSetup.entryZone.high
      : analysis.tradeSetup.entryZone.low;

  const risk = calculateRisk({
    accountBalance: account.balance,
    riskPercent: account.riskPercent,
    entryPrice: worstCaseEntry,
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
      explanation: `R:R is ${risk.riskRewardRatio.toFixed(2)} at worst-case entry. ${account.mode} account requires minimum ${rules.minRiskReward}:1.`,
    };
  }
  return { passed: true };
}

function checkNewsProximity(analysis: FullAnalysis): DenialCheck {
  const bufferMs = TRADING_CONFIG.newsBufferMinutes * 60_000;
  const nowMs = Date.now();

  // Check actual event times — do not rely solely on AI's newsRisk flag
  const urgentEvent = analysis.sessionAndNews.upcomingEvents.find((e) => {
    if (e.impact !== "high") return false;
    const eventMs = new Date(e.time).getTime();
    const minutesAway = (eventMs - nowMs) / 60_000;
    return minutesAway >= 0 && minutesAway <= TRADING_CONFIG.newsBufferMinutes;
  });

  if (urgentEvent) {
    const minutesAway = Math.round((new Date(urgentEvent.time).getTime() - nowMs) / 60_000);
    return {
      passed: false,
      reason: "news_too_close",
      explanation: `${urgentEvent.event} (${urgentEvent.currency}) is ${minutesAway}m away. Wait until after the release — ${TRADING_CONFIG.newsBufferMinutes}-minute buffer required.`,
    };
  }

  // Also respect AI's high-risk flag when no structured events are available
  if (analysis.sessionAndNews.newsRisk === "high" && analysis.sessionAndNews.upcomingEvents.length === 0) {
    return {
      passed: false,
      reason: "news_too_close",
      explanation: `High news risk flagged with no detailed schedule. Do not trade until the risk window clears.`,
    };
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

  if (analysis.finalDecision.score < TRADING_CONFIG.minTradeScore) {
    return {
      passed: false,
      reason: "funded_rules_at_risk",
      explanation: `Funded account requires minimum score ${TRADING_CONFIG.minTradeScore}. Current score is ${analysis.finalDecision.score}/10.`,
    };
  }
  return { passed: true };
}

function checkSessionTiming(analysis: FullAnalysis): DenialCheck {
  const now = new Date();
  const { sessions } = TRADING_CONFIG;

  // Block weekend: Saturday all day, Friday after 18:00 UTC, Sunday before 21:00 UTC
  const dayUtc = now.getUTCDay(); // 0=Sun, 5=Fri, 6=Sat
  const hourUtc = now.getUTCHours();
  const isWeekendRisk =
    dayUtc === 6 ||
    (dayUtc === 5 && hourUtc >= 18) ||
    (dayUtc === 0 && hourUtc < 21);

  if (isWeekendRisk) {
    return {
      passed: false,
      reason: "outside_session",
      explanation: "Market is at or near weekend close. Weekend gap risk is too high to enter new positions.",
    };
  }

  // Primary: real-time clock check
  const inLondon = isWithinSession(sessions.london, now);
  const inNewYork = isWithinSession(sessions.newYork, now);

  // Secondary: AI's own session assessment (handles cached analyses and edge cases)
  const aiSession = analysis.sessionAndNews.currentSession;
  const aiInActiveSession =
    aiSession === "london" || aiSession === "new_york" || aiSession === "overlap_lon_ny";

  if (!inLondon && !inNewYork && !aiInActiveSession) {
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

  const worstCaseEntry =
    analysis.tradeSetup.direction === "LONG"
      ? analysis.tradeSetup.entryZone.high
      : analysis.tradeSetup.entryZone.low;

  const risk = calculateRisk({
    accountBalance: account.balance,
    riskPercent: account.riskPercent,
    entryPrice: worstCaseEntry,
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
  if (account.equity <= 0 || account.maxDrawdown <= 0) return { passed: true };

  const currentDrawdown = Math.max(0, account.balance - account.equity);
  if (currentDrawdown >= account.maxDrawdown * 0.8) {
    return {
      passed: false,
      reason: "max_drawdown_reached",
      explanation: `Drawdown is at ${((currentDrawdown / account.maxDrawdown) * 100).toFixed(1)}% of the ${account.maxDrawdown.toFixed(0)} limit. Too close to max. Protect your account.`,
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

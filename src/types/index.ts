// ============================================================
// FOREX AI SYSTEM — CORE TYPE DEFINITIONS
// ============================================================

// --- Currency & Pairs ---

export type Currency = "USD" | "EUR" | "GBP" | "JPY" | "CHF" | "AUD" | "NZD" | "CAD";

export type CurrencyPair =
  | "EURUSD" | "GBPUSD" | "USDJPY" | "USDCHF"
  | "AUDUSD" | "NZDUSD" | "USDCAD"
  | "XAUUSD";

// --- Account System ---

export type AccountMode = "funded" | "personal";

export interface TradingAccount {
  id: string;
  userId: string;
  name: string;
  mode: AccountMode;
  balance: number;
  equity: number;
  riskPercent: number;        // funded: 0.25-0.5%, personal: 1-2%
  maxDailyLoss: number;       // $ amount
  maxDrawdown: number;        // $ amount
  maxTradesPerDay: number;    // funded: 2-3, personal: flexible
  currentDailyLoss: number;
  currentDailyTrades: number;
  lossesInARow: number;
  openTrades: Trade[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountRules {
  mode: AccountMode;
  minRiskPercent: number;
  maxRiskPercent: number;
  maxTradesPerDay: number;
  stopAfterConsecutiveLosses: number;
  minRiskReward: number;
  requireStrictFiltering: boolean;
}

export const FUNDED_RULES: AccountRules = {
  mode: "funded",
  minRiskPercent: 0.25,
  maxRiskPercent: 0.5,
  maxTradesPerDay: 3,
  stopAfterConsecutiveLosses: 2,
  minRiskReward: 2,
  requireStrictFiltering: true,
};

export const PERSONAL_RULES: AccountRules = {
  mode: "personal",
  minRiskPercent: 0.5,
  maxRiskPercent: 2,
  maxTradesPerDay: 5,
  stopAfterConsecutiveLosses: 3,
  minRiskReward: 1.5,
  requireStrictFiltering: false,
};

// --- Entry Status System (MANDATORY) ---

export type EntryStatus = "WAIT" | "READY" | "CONFIRMED" | "INVALID";

export type UserAction = "WAIT" | "PREPARE" | "EXECUTE" | "CANCEL";

export interface EntryStatusEvaluation {
  status: EntryStatus;
  userAction: UserAction;
  reason: string;
  whatMustHappenNext: string;
  updatedAt: Date;
}

export const STATUS_ACTION_MAP: Record<EntryStatus, UserAction> = {
  WAIT: "WAIT",
  READY: "PREPARE",
  CONFIRMED: "EXECUTE",
  INVALID: "CANCEL",
};

// --- Trade Direction & Setup ---

export type TradeDirection = "LONG" | "SHORT";
export type SetupType = "pullback" | "breakout" | "reversal" | "liquidity_sweep";
export type MarketCondition = "trending" | "ranging" | "choppy";
export type TradingSession = "london" | "new_york" | "asia" | "overlap_lon_ny";
export type Timeframe = "M1" | "M5" | "M15" | "M30" | "H1" | "H4" | "D1" | "W1";

export type Bias = "bullish" | "bearish" | "neutral";

// --- Trade ---

export type TradeStatus = "pending" | "open" | "closed" | "cancelled" | "denied";

export interface Trade {
  id: string;
  accountId: string;
  externalRef?: string;
  pair: CurrencyPair;
  direction: TradeDirection;
  setupType: SetupType;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  lotSize: number;
  riskAmount: number;
  riskRewardRatio: number;
  status: TradeStatus;
  entryStatus: EntryStatus;
  pnl?: number;
  pipsPnl?: number;
  openedAt?: Date;
  closedAt?: Date;
  createdAt: Date;
  notes?: string;
  aiScore: number;          // 1-10
  aiDecision: string;
  aiReasoning: string;
  denialReason?: string;
}

// --- Risk Calculation ---

export interface RiskInput {
  accountBalance: number;
  riskPercent: number;
  entryPrice: number;
  stopLossPrice: number;
  takeProfitPrice: number;
  pair: CurrencyPair;
  direction: TradeDirection;
}

export interface RiskOutput {
  riskAmount: number;       // $ at risk
  pipDistance: number;       // pips to SL
  lotSize: number;
  maxLoss: number;
  maxProfit: number;
  riskRewardRatio: number;
  isValid: boolean;
  denial?: string;
}

// --- AI Analysis Output ---

export interface MarketOverview {
  pair: CurrencyPair;
  bias: Bias;
  structure: string;
  volatility: "low" | "medium" | "high";
  marketCondition: MarketCondition;
}

export interface MacroAnalysis {
  interestRates: string;
  centralBank: string;
  inflation: string;
  currencyStrength: Partial<Record<Currency, number>>; // -10 to +10
  summary: string;
}

export interface SentimentAnalysis {
  retailPositioning: string;
  bias: Bias;
  crowdDirection: TradeDirection | "mixed";
  summary: string;
}

export interface TradeSetup {
  pair: CurrencyPair;
  direction: TradeDirection;
  setupType: SetupType;
  entryZone: { low: number; high: number };
  stopLoss: number;
  takeProfit: number;
  confirmation: string;
  invalidation: string;
  higherTimeframe: Timeframe;
  lowerTimeframe: Timeframe;
}

export interface SessionAndNews {
  currentSession: TradingSession;
  bestTiming: string;
  newsRisk: "none" | "low" | "medium" | "high";
  upcomingEvents: NewsEvent[];
}

export interface NewsEvent {
  time: Date;
  currency: Currency;
  event: string;
  impact: "low" | "medium" | "high";
  forecast?: string;
  previous?: string;
}

export interface FinalDecision {
  score: number;            // 1-10
  decision: "TAKE_TRADE" | "WAIT" | "DENY";
  reasoning: string;
}

// --- Full AI Analysis (Complete Output) ---

export interface FullAnalysis {
  timestamp: Date;
  marketOverview: MarketOverview;
  macro: MacroAnalysis;
  sentiment: SentimentAnalysis;
  tradeSetup: TradeSetup | null;
  entryStatus: EntryStatusEvaluation;
  exitLogic: {
    stopLoss: number;
    takeProfit: number;
    breakEvenRule: string;
    trailingStop: string;
  };
  riskPerAccount: Record<string, RiskOutput>;
  sessionAndNews: SessionAndNews;
  finalDecision: FinalDecision;
}

// --- Trade Denial ---

export type DenialReason =
  | "weak_setup"
  | "no_confirmation"
  | "conflicting_signals"
  | "poor_risk_reward"
  | "news_too_close"
  | "overtrading"
  | "funded_rules_at_risk"
  | "daily_loss_reached"
  | "max_drawdown_reached"
  | "consecutive_losses"
  | "outside_session"
  | "choppy_market";

export interface TradeDenial {
  tradeId: string;
  reason: DenialReason;
  explanation: string;
  timestamp: Date;
}

// --- Journal ---

export interface JournalEntry {
  id: string;
  tradeId?: string;
  userId: string;
  date: Date;
  type: "trade" | "review" | "lesson" | "plan";
  content: string;
  mistakes?: string[];
  disciplineScore?: number;  // 1-10
  aiFeedback?: string;
  tags?: string[];
}

export interface EndOfDayReviewStats {
  totalTrades: number;
  executedTrades: number;
  closedTrades: number;
  wins: number;
  losses: number;
  deniedTrades: number;
  pnl: number;
  winRate: number;
  journalEntries: number;
}

export interface EndOfDayReview {
  date: Date;
  generatedAt: Date;
  disciplineScore: number;
  headline: string;
  summary: string;
  strengths: string[];
  mistakes: string[];
  riskFlags: string[];
  tomorrowFocus: string[];
  stats: EndOfDayReviewStats;
}

export interface EndOfDayReviewContext {
  date: Date;
  trades: Trade[];
  journalEntries: JournalEntry[];
  stats: EndOfDayReviewStats;
}

export interface DailyPlan {
  id: string;
  userId: string;
  date: Date;
  pairs: CurrencyPair[];
  macroBias: string;
  keyLevels: string;
  newsEvents: string;
  sessionFocus: string;
  maxTrades: number;
  planNotes?: string;
  reviewNotes?: string;
  disciplineScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyPlanContext {
  date: Date;
  accounts: TradingAccount[];
  openTrades: Trade[];
  upcomingEvents: NewsEvent[];
  trackedPairs: CurrencyPair[];
  priorReview?: EndOfDayReview | null;
}

export interface GeneratedDailyPlan {
  date: Date;
  pairs: CurrencyPair[];
  macroBias: string;
  keyLevels: string;
  newsEvents: string;
  sessionFocus: string;
  maxTrades: number;
  planNotes: string;
}

// --- Telegram ---

export interface TelegramAlert {
  type:
    | "setup_detected"
    | "entry_status_update"
    | "trade_denied"
    | "news_warning"
    | "move_sl_tp"
    | "daily_briefing"
    | "end_of_day_summary";
  pair?: CurrencyPair;
  message: string;
  data?: Record<string, unknown>;
  timestamp: Date;
}

export interface TelegramConnectionStatus {
  isConnected: boolean;
  chatId?: string;
  linkCode?: string;
  linkCodeExpiresAt?: Date;
  alertsEnabled: boolean;
}

export interface TrackedPairsPreference {
  trackedPairs: CurrencyPair[];
}

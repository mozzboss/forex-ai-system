
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  name: 'name',
  telegramChatId: 'telegramChatId',
  telegramLinkCode: 'telegramLinkCode',
  telegramLinkCodeExpiresAt: 'telegramLinkCodeExpiresAt',
  telegramAlertsEnabled: 'telegramAlertsEnabled',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TradingAccountScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  name: 'name',
  mode: 'mode',
  balance: 'balance',
  equity: 'equity',
  riskPercent: 'riskPercent',
  maxDailyLoss: 'maxDailyLoss',
  maxDrawdown: 'maxDrawdown',
  maxTradesPerDay: 'maxTradesPerDay',
  currentDailyLoss: 'currentDailyLoss',
  currentDailyTrades: 'currentDailyTrades',
  lossesInARow: 'lossesInARow',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TradeScalarFieldEnum = {
  id: 'id',
  accountId: 'accountId',
  userId: 'userId',
  externalRef: 'externalRef',
  alertLogId: 'alertLogId',
  pair: 'pair',
  direction: 'direction',
  setupType: 'setupType',
  entryPrice: 'entryPrice',
  stopLoss: 'stopLoss',
  takeProfit: 'takeProfit',
  lotSize: 'lotSize',
  riskAmount: 'riskAmount',
  riskRewardRatio: 'riskRewardRatio',
  status: 'status',
  entryStatus: 'entryStatus',
  pnl: 'pnl',
  pipsPnl: 'pipsPnl',
  aiScore: 'aiScore',
  aiDecision: 'aiDecision',
  aiReasoning: 'aiReasoning',
  denialReason: 'denialReason',
  notes: 'notes',
  openedAt: 'openedAt',
  closedAt: 'closedAt',
  createdAt: 'createdAt'
};

exports.Prisma.JournalEntryScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  tradeId: 'tradeId',
  date: 'date',
  type: 'type',
  content: 'content',
  mistakes: 'mistakes',
  disciplineScore: 'disciplineScore',
  aiFeedback: 'aiFeedback',
  tags: 'tags',
  createdAt: 'createdAt'
};

exports.Prisma.DailyPlanScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  date: 'date',
  pairs: 'pairs',
  macroBias: 'macroBias',
  keyLevels: 'keyLevels',
  newsEvents: 'newsEvents',
  sessionFocus: 'sessionFocus',
  maxTrades: 'maxTrades',
  planNotes: 'planNotes',
  reviewNotes: 'reviewNotes',
  disciplineScore: 'disciplineScore',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.NewsEventScalarFieldEnum = {
  id: 'id',
  time: 'time',
  currency: 'currency',
  event: 'event',
  impact: 'impact',
  forecast: 'forecast',
  previous: 'previous',
  actual: 'actual',
  fetchedAt: 'fetchedAt'
};

exports.Prisma.AlertLogScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  pair: 'pair',
  alertType: 'alertType',
  score: 'score',
  session: 'session',
  direction: 'direction',
  channel: 'channel',
  sentAt: 'sentAt'
};

exports.Prisma.AnalysisCacheScalarFieldEnum = {
  id: 'id',
  pair: 'pair',
  analysis: 'analysis',
  createdAt: 'createdAt',
  expiresAt: 'expiresAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.AccountMode = exports.$Enums.AccountMode = {
  funded: 'funded',
  personal: 'personal'
};

exports.TradeDirection = exports.$Enums.TradeDirection = {
  LONG: 'LONG',
  SHORT: 'SHORT'
};

exports.SetupType = exports.$Enums.SetupType = {
  pullback: 'pullback',
  breakout: 'breakout',
  reversal: 'reversal',
  liquidity_sweep: 'liquidity_sweep'
};

exports.TradeStatus = exports.$Enums.TradeStatus = {
  pending: 'pending',
  open: 'open',
  closed: 'closed',
  cancelled: 'cancelled',
  denied: 'denied'
};

exports.EntryStatus = exports.$Enums.EntryStatus = {
  WAIT: 'WAIT',
  READY: 'READY',
  CONFIRMED: 'CONFIRMED',
  INVALID: 'INVALID'
};

exports.JournalEntryType = exports.$Enums.JournalEntryType = {
  trade: 'trade',
  review: 'review',
  lesson: 'lesson',
  plan: 'plan'
};

exports.NewsImpact = exports.$Enums.NewsImpact = {
  low: 'low',
  medium: 'medium',
  high: 'high'
};

exports.Prisma.ModelName = {
  User: 'User',
  TradingAccount: 'TradingAccount',
  Trade: 'Trade',
  JournalEntry: 'JournalEntry',
  DailyPlan: 'DailyPlan',
  NewsEvent: 'NewsEvent',
  AlertLog: 'AlertLog',
  AnalysisCache: 'AnalysisCache'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)

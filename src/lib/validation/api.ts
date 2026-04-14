import { z } from "zod";

const currencyPairValues = [
  "EURUSD", "GBPUSD", "USDJPY", "USDCHF",
  "AUDUSD", "NZDUSD", "USDCAD",
  "XAUUSD",
] as const;

const accountModeValues = ["funded", "personal"] as const;
const tradeDirectionValues = ["LONG", "SHORT"] as const;
const setupTypeValues = ["pullback", "breakout", "reversal", "liquidity_sweep"] as const;
const tradeStatusValues = ["pending", "open", "closed", "cancelled", "denied"] as const;
const entryStatusValues = ["WAIT", "READY", "CONFIRMED", "INVALID"] as const;
const journalEntryTypeValues = ["trade", "review", "lesson", "plan"] as const;
const mtStatusValues = ["open", "closed", "cancelled", "denied", "pending"] as const;

const currencyPairSchema = z.enum(currencyPairValues);
const accountModeSchema = z.enum(accountModeValues);
const tradeDirectionSchema = z.enum(tradeDirectionValues);
const setupTypeSchema = z.enum(setupTypeValues);
const tradeStatusSchema = z.enum(tradeStatusValues);
const entryStatusSchema = z.enum(entryStatusValues);
const journalEntryTypeSchema = z.enum(journalEntryTypeValues);
const mtStatusSchema = z.enum(mtStatusValues);

const openTradeSchema = z.object({
  id: z.string().uuid(),
  accountId: z.string().uuid(),
  pair: currencyPairSchema,
  direction: tradeDirectionSchema,
  setupType: setupTypeSchema,
  entryPrice: z.number(),
  stopLoss: z.number(),
  takeProfit: z.number(),
  lotSize: z.number(),
  riskAmount: z.number(),
  riskRewardRatio: z.number(),
  status: tradeStatusSchema,
  entryStatus: entryStatusSchema,
  pnl: z.number().optional(),
  pipsPnl: z.number().optional(),
  openedAt: z.union([z.string(), z.date()]).optional(),
  closedAt: z.union([z.string(), z.date()]).optional(),
  createdAt: z.union([z.string(), z.date()]),
  notes: z.string().optional(),
  aiScore: z.number().int(),
  aiDecision: z.string(),
  aiReasoning: z.string(),
  denialReason: z.string().optional(),
});

export const accountPayloadSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  name: z.string().min(1).max(120).optional(),
  mode: accountModeSchema.optional(),
  balance: z.number().nonnegative().optional(),
  equity: z.number().nonnegative().optional(),
  riskPercent: z.number().nonnegative().optional(),
  maxDailyLoss: z.number().nonnegative().optional(),
  maxDrawdown: z.number().nonnegative().optional(),
  maxTradesPerDay: z.number().int().nonnegative().optional(),
  currentDailyLoss: z.number().nonnegative().optional(),
  currentDailyTrades: z.number().int().nonnegative().optional(),
  lossesInARow: z.number().int().nonnegative().optional(),
  openTrades: z.array(openTradeSchema).optional(),
  isActive: z.boolean().optional(),
  createdAt: z.union([z.string(), z.date()]).optional(),
  updatedAt: z.union([z.string(), z.date()]).optional(),
});

export const accountActionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("reset_daily"),
  }),
  z.object({
    action: z.literal("create"),
    account: accountPayloadSchema,
  }),
  z.object({
    action: z.literal("update"),
    account: accountPayloadSchema.extend({
      id: z.string().uuid(),
    }),
  }),
]);

export const tradeUpdateSchema = z.object({
  pair: currencyPairSchema.optional(),
  direction: tradeDirectionSchema.optional(),
  setupType: setupTypeSchema.optional(),
  entryPrice: z.number().optional(),
  stopLoss: z.number().optional(),
  takeProfit: z.number().optional(),
  lotSize: z.number().optional(),
  riskAmount: z.number().optional(),
  riskRewardRatio: z.number().optional(),
  status: tradeStatusSchema.optional(),
  entryStatus: entryStatusSchema.optional(),
  pnl: z.number().optional(),
  pipsPnl: z.number().optional(),
  aiScore: z.number().int().optional(),
  aiDecision: z.string().optional(),
  aiReasoning: z.string().optional(),
  denialReason: z.string().optional(),
  notes: z.string().optional(),
});

export const tradeActionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("create"),
    accountId: z.string().uuid().optional(),
    pair: currencyPairSchema,
    direction: tradeDirectionSchema,
    setupType: setupTypeSchema.optional(),
    entryPrice: z.number(),
    stopLoss: z.number(),
    takeProfit: z.number(),
    lotSize: z.number().nonnegative(),
    riskAmount: z.number().optional(),
    riskRewardRatio: z.number().optional(),
    status: tradeStatusSchema.optional(),
    entryStatus: entryStatusSchema.optional(),
    pnl: z.number().optional(),
    pipsPnl: z.number().optional(),
    aiScore: z.number().int().optional(),
    aiDecision: z.string().optional(),
    aiReasoning: z.string().optional(),
    notes: z.string().optional(),
  }),
  z.object({
    action: z.literal("update"),
    tradeId: z.string().uuid(),
    updates: tradeUpdateSchema,
  }),
  z.object({
    action: z.literal("deny"),
    accountId: z.string().uuid().optional(),
    pair: currencyPairSchema,
    direction: tradeDirectionSchema.optional(),
    setupType: setupTypeSchema.optional(),
    entryPrice: z.number().optional(),
    stopLoss: z.number().optional(),
    takeProfit: z.number().optional(),
    lotSize: z.number().optional(),
    riskAmount: z.number().optional(),
    riskRewardRatio: z.number().optional(),
    pnl: z.number().optional(),
    pipsPnl: z.number().optional(),
    aiScore: z.number().int().optional(),
    aiReasoning: z.string().optional(),
    denialReason: z.string().optional(),
    notes: z.string().optional(),
  }),
]);

export const journalEntryCreateSchema = z.object({
  type: journalEntryTypeSchema.optional(),
  content: z.string().trim().min(1).max(5000),
  tradeId: z.string().uuid().optional(),
  mistakes: z.array(z.string().trim().min(1).max(200)).max(20).optional(),
  disciplineScore: z.number().int().min(1).max(10).optional(),
  aiFeedback: z.string().trim().max(5000).optional(),
  tags: z.array(z.string().trim().min(1).max(50)).max(20).optional(),
  date: z.union([z.string(), z.date()]).optional(),
});

export const analysisRequestSchema = z.object({
  pair: currencyPairSchema,
  marketData: z.string().max(20000).optional(),
});

export const mtImportPositionSchema = z.object({
  externalRef: z.string().min(1),
  accountId: z.string().uuid().optional(),
  accountName: z.string().min(1).optional(),
  pair: currencyPairSchema,
  direction: tradeDirectionSchema,
  status: mtStatusSchema,
  entryPrice: z.number().positive(),
  stopLoss: z.number().positive().optional(),
  takeProfit: z.number().positive().optional(),
  lotSize: z.number().positive(),
  openedAt: z.union([z.string(), z.date()]).optional(),
  closedAt: z.union([z.string(), z.date()]).optional(),
  pnl: z.number().optional(),
  pipsPnl: z.number().optional(),
  notes: z.string().max(2000).optional(),
});

export const mtImportRequestSchema = z.object({
  positions: z.array(mtImportPositionSchema).min(1),
});

export const riskRequestSchema = z.object({
  accountBalance: z.number().positive(),
  riskPercent: z.number().positive(),
  entryPrice: z.number().positive(),
  stopLossPrice: z.number().positive(),
  takeProfitPrice: z.number().positive(),
  pair: currencyPairSchema,
  direction: tradeDirectionSchema,
});

export const telegramConnectionActionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("generate_code"),
  }),
  z.object({
    action: z.literal("unlink"),
  }),
  z.object({
    action: z.literal("set_alerts"),
    enabled: z.boolean(),
  }),
]);

export const endOfDayReviewActionSchema = z.object({
  action: z.literal("generate"),
  sendTelegram: z.boolean().optional(),
});

export const dailyPlanActionSchema = z.object({
  action: z.literal("generate"),
  sendTelegram: z.boolean().optional(),
});

export const queryTradeStatusSchema = tradeStatusSchema;
export const queryJournalEntryTypeSchema = journalEntryTypeSchema;

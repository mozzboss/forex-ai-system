import { randomInt } from "crypto";

import type {
  DailyPlan as AppDailyPlan,
  DailyPlanContext,
  EndOfDayReview,
  EndOfDayReviewContext,
  JournalEntry as AppJournalEntry,
  TelegramConnectionStatus,
  TradingAccount as AppTradingAccount,
  Trade as AppTrade,
  AccountMode,
  CurrencyPair,
  DenialReason,
  EntryStatus,
  SetupType,
  TradeDirection,
  TradeStatus,
} from "@/types";
import {
  DailyPlan as PrismaDailyPlan,
  JournalEntry as PrismaJournalEntry,
  Prisma,
  Trade as PrismaTrade,
  TradingAccount as PrismaTradingAccount,
} from "@prisma/client";

import { getAccountRules } from "@/config/trading";
import { fetchEconomicCalendar } from "@/lib/market/news";
import { prisma } from "@/lib/prisma";
import { calculateRisk, getDenialExplanation, validateTradeAgainstAccount } from "@/lib/risk/engine";

type AccountWithOpenTrades = PrismaTradingAccount & {
  trades: PrismaTrade[];
};

interface TradeFilters {
  status?: TradeStatus | null;
  accountId?: string | null;
  limit?: number;
  offset?: number;
}

interface CreateTradeInput {
  accountId?: string;
  alertLogId?: string;
  pair: CurrencyPair;
  direction: TradeDirection;
  setupType?: SetupType;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  lotSize: number;
  riskAmount?: number;
  riskRewardRatio?: number;
  status?: TradeStatus;
  entryStatus?: EntryStatus;
  pnl?: number;
  pipsPnl?: number;
  aiScore?: number;
  aiDecision?: string;
  aiReasoning?: string;
  notes?: string;
}

interface UpdateTradeInput {
  pair?: CurrencyPair;
  direction?: TradeDirection;
  setupType?: SetupType;
  entryPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  lotSize?: number;
  riskAmount?: number;
  riskRewardRatio?: number;
  status?: TradeStatus;
  entryStatus?: EntryStatus;
  pnl?: number;
  pipsPnl?: number;
  aiScore?: number;
  aiDecision?: string;
  aiReasoning?: string;
  denialReason?: string;
  notes?: string;
}

interface CreateJournalEntryInput {
  userId: string;
  type?: AppJournalEntry["type"];
  content?: string;
  tradeId?: string;
  mistakes?: string[];
  disciplineScore?: number;
  aiFeedback?: string;
  tags?: string[];
  date?: string | Date;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfDay(date: Date) {
  const nextDay = startOfDay(date);
  nextDay.setDate(nextDay.getDate() + 1);
  return nextDay;
}

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

function toNumber(value: Prisma.Decimal | number): number {
  return typeof value === "number" ? value : value.toNumber();
}

function toOptionalNumber(value: Prisma.Decimal | number | null | undefined): number | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  return toNumber(value);
}

function shouldCountTrade(status: string): boolean {
  return status !== "cancelled" && status !== "denied";
}

function formatDenialMessage(denials: DenialReason[]) {
  return denials.map((reason) => getDenialExplanation(reason)).join(" ");
}

function mapTradeRecord(record: PrismaTrade): AppTrade {
  return {
    id: record.id,
    accountId: record.accountId,
    alertLogId: record.alertLogId ?? undefined,
    pair: record.pair as CurrencyPair,
    direction: record.direction as TradeDirection,
    setupType: record.setupType as SetupType,
    entryPrice: toNumber(record.entryPrice),
    stopLoss: toNumber(record.stopLoss),
    takeProfit: toNumber(record.takeProfit),
    lotSize: toNumber(record.lotSize),
    riskAmount: toNumber(record.riskAmount),
    riskRewardRatio: toNumber(record.riskRewardRatio),
    status: record.status as TradeStatus,
    entryStatus: record.entryStatus as EntryStatus,
    pnl: toOptionalNumber(record.pnl),
    pipsPnl: toOptionalNumber(record.pipsPnl),
    openedAt: record.openedAt ?? undefined,
    closedAt: record.closedAt ?? undefined,
    createdAt: record.createdAt,
    notes: record.notes ?? undefined,
    aiScore: record.aiScore,
    aiDecision: record.aiDecision,
    aiReasoning: record.aiReasoning,
    denialReason: record.denialReason ?? undefined,
  };
}

function mapAccountRecord(record: AccountWithOpenTrades): AppTradingAccount {
  return {
    id: record.id,
    userId: record.userId,
    name: record.name,
    mode: record.mode as AccountMode,
    balance: toNumber(record.balance),
    equity: toNumber(record.equity),
    riskPercent: toNumber(record.riskPercent),
    maxDailyLoss: toNumber(record.maxDailyLoss),
    maxDrawdown: toNumber(record.maxDrawdown),
    maxTradesPerDay: record.maxTradesPerDay,
    currentDailyLoss: toNumber(record.currentDailyLoss),
    currentDailyTrades: record.currentDailyTrades,
    lossesInARow: record.lossesInARow,
    openTrades: record.trades.map(mapTradeRecord),
    isActive: record.isActive,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

function mapJournalEntryRecord(record: PrismaJournalEntry): AppJournalEntry {
  return {
    id: record.id,
    userId: record.userId,
    tradeId: record.tradeId ?? undefined,
    date: record.date,
    type: record.type as AppJournalEntry["type"],
    content: record.content,
    mistakes: record.mistakes,
    disciplineScore: record.disciplineScore ?? undefined,
    aiFeedback: record.aiFeedback ?? undefined,
    tags: record.tags,
  };
}

function mapDailyPlanRecord(record: PrismaDailyPlan): AppDailyPlan {
  return {
    id: record.id,
    userId: record.userId,
    date: record.date,
    pairs: record.pairs as CurrencyPair[],
    macroBias: record.macroBias,
    keyLevels: record.keyLevels,
    newsEvents: record.newsEvents,
    sessionFocus: record.sessionFocus,
    maxTrades: record.maxTrades,
    planNotes: record.planNotes ?? undefined,
    reviewNotes: record.reviewNotes ?? undefined,
    disciplineScore: record.disciplineScore ?? undefined,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

function buildAccountDefaults(mode: AccountMode, balance: number) {
  const rules = getAccountRules(mode);

  return {
    riskPercent: mode === "funded" ? 0.25 : 1,
    maxDailyLoss: roundCurrency(balance * 0.05),
    maxDrawdown: roundCurrency(balance * 0.1),
    maxTradesPerDay: rules.maxTradesPerDay,
  };
}

function parseStoredEndOfDayReview(
  record: PrismaDailyPlan | null
): EndOfDayReview | null {
  if (!record?.reviewNotes) {
    return null;
  }

  try {
    const parsed = JSON.parse(record.reviewNotes) as Partial<EndOfDayReview>;

    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    return {
      date: parsed.date ? new Date(parsed.date) : record.date,
      generatedAt: parsed.generatedAt ? new Date(parsed.generatedAt) : record.updatedAt,
      disciplineScore: parsed.disciplineScore ?? record.disciplineScore ?? 0,
      headline: parsed.headline ?? "End-of-day review",
      summary: parsed.summary ?? record.reviewNotes,
      strengths: parsed.strengths ?? [],
      mistakes: parsed.mistakes ?? [],
      riskFlags: parsed.riskFlags ?? [],
      tomorrowFocus: parsed.tomorrowFocus ?? [],
      stats: parsed.stats ?? {
        totalTrades: 0,
        executedTrades: 0,
        closedTrades: 0,
        wins: 0,
        losses: 0,
        deniedTrades: 0,
        pnl: 0,
        winRate: 0,
        journalEntries: 0,
      },
    };
  } catch {
    return {
      date: record.date,
      generatedAt: record.updatedAt,
      disciplineScore: record.disciplineScore ?? 0,
      headline: "End-of-day review",
      summary: record.reviewNotes,
      strengths: [],
      mistakes: [],
      riskFlags: [],
      tomorrowFocus: [],
      stats: {
        totalTrades: 0,
        executedTrades: 0,
        closedTrades: 0,
        wins: 0,
        losses: 0,
        deniedTrades: 0,
        pnl: 0,
        winRate: 0,
        journalEntries: 0,
      },
    };
  }
}

async function findAccountForUser(tx: Prisma.TransactionClient, userId: string, accountId?: string) {
  if (accountId) {
    return tx.tradingAccount.findFirst({
      where: { id: accountId, userId },
    });
  }

  return tx.tradingAccount.findFirst({
    where: { userId, isActive: true },
    orderBy: { createdAt: "asc" },
  });
}

function buildTradeUpdateData(updates: UpdateTradeInput): Prisma.TradeUpdateInput {
  const data: Prisma.TradeUpdateInput = {};

  if (updates.pair) data.pair = updates.pair;
  if (updates.direction) data.direction = updates.direction;
  if (updates.setupType) data.setupType = updates.setupType;
  if (typeof updates.entryPrice === "number") data.entryPrice = updates.entryPrice;
  if (typeof updates.stopLoss === "number") data.stopLoss = updates.stopLoss;
  if (typeof updates.takeProfit === "number") data.takeProfit = updates.takeProfit;
  if (typeof updates.lotSize === "number") data.lotSize = updates.lotSize;
  if (typeof updates.riskAmount === "number") data.riskAmount = updates.riskAmount;
  if (typeof updates.riskRewardRatio === "number") data.riskRewardRatio = updates.riskRewardRatio;
  if (updates.status) data.status = updates.status;
  if (updates.entryStatus) data.entryStatus = updates.entryStatus;
  if (typeof updates.pnl === "number") data.pnl = updates.pnl;
  if (typeof updates.pipsPnl === "number") data.pipsPnl = updates.pipsPnl;
  if (typeof updates.aiScore === "number") data.aiScore = updates.aiScore;
  if (typeof updates.aiDecision === "string") data.aiDecision = updates.aiDecision;
  if (typeof updates.aiReasoning === "string") data.aiReasoning = updates.aiReasoning;
  if (typeof updates.denialReason === "string") data.denialReason = updates.denialReason;
  if (typeof updates.notes === "string") data.notes = updates.notes;

  return data;
}

function generateLinkCodeValue() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => alphabet[randomInt(0, alphabet.length)]).join("");
}

export function maskTelegramChatId(chatId?: string | null) {
  if (!chatId) {
    return undefined;
  }

  if (chatId.length <= 4) {
    return chatId;
  }

  return `${"*".repeat(Math.max(chatId.length - 4, 1))}${chatId.slice(-4)}`;
}

/**
 * Auto-reset daily counters for accounts whose counters are from a previous trading day.
 * Checks today's trade count — if none exist for the account, counters are stale and reset.
 */
/**
 * Auto-reset daily counters for accounts whose counters are stale (from a previous trading day).
 * Returns true if any account was reset and a re-fetch is needed.
 */
async function autoResetStaleCounters(userId: string, accounts: PrismaTradingAccount[]): Promise<boolean> {
  const accountsWithCounters = accounts.filter(
    (a) => a.currentDailyTrades > 0 || a.currentDailyLoss.toNumber() > 0
  );

  if (accountsWithCounters.length === 0) return false;

  const today = startOfDay(new Date());

  const todayTradeCounts = await prisma.trade.groupBy({
    by: ["accountId"],
    where: {
      userId,
      accountId: { in: accountsWithCounters.map((a) => a.id) },
      status: { notIn: ["cancelled", "denied"] },
      createdAt: { gte: today },
    },
    _count: { id: true },
  });

  const countByAccount = new Map(todayTradeCounts.map((r) => [r.accountId, r._count.id]));
  const toReset = accountsWithCounters.filter((a) => (countByAccount.get(a.id) ?? 0) === 0);

  if (toReset.length === 0) return false;

  await prisma.tradingAccount.updateMany({
    where: { id: { in: toReset.map((a) => a.id) } },
    data: { currentDailyTrades: 0, currentDailyLoss: 0, lossesInARow: 0 },
  });

  return true;
}

const ACCOUNT_INCLUDE = Prisma.validator<Prisma.TradingAccountInclude>()({
  trades: {
    where: { status: { in: ["pending", "open"] } },
    orderBy: { createdAt: "desc" },
  },
});

export async function listAccounts(userId: string): Promise<AppTradingAccount[]> {
  const accounts = await prisma.tradingAccount.findMany({
    where: { userId },
    include: ACCOUNT_INCLUDE,
    orderBy: { createdAt: "asc" },
  });

  // Auto-reset daily counters that are stale (no trades today = previous day's data)
  const didReset = await autoResetStaleCounters(userId, accounts);

  if (didReset) {
    const refreshed = await prisma.tradingAccount.findMany({
      where: { userId },
      include: ACCOUNT_INCLUDE,
      orderBy: { createdAt: "asc" },
    });
    return refreshed.map(mapAccountRecord);
  }

  return accounts.map(mapAccountRecord);
}

export async function createAccount(
  userId: string,
  account: Partial<AppTradingAccount>
): Promise<AppTradingAccount> {
  const mode = account.mode ?? "personal";
  const balance = account.balance ?? 0;
  const defaults = buildAccountDefaults(mode, balance);

  const created = await prisma.tradingAccount.create({
    data: {
      userId,
      name: account.name?.trim() || "New Account",
      mode,
      balance,
      equity: account.equity ?? balance,
      riskPercent: account.riskPercent ?? defaults.riskPercent,
      maxDailyLoss: account.maxDailyLoss ?? defaults.maxDailyLoss,
      maxDrawdown: account.maxDrawdown ?? defaults.maxDrawdown,
      maxTradesPerDay: account.maxTradesPerDay ?? defaults.maxTradesPerDay,
      currentDailyLoss: 0,
      currentDailyTrades: 0,
      lossesInARow: 0,
      isActive: account.isActive ?? true,
    },
    include: ACCOUNT_INCLUDE,
  });

  return mapAccountRecord(created);
}

export async function updateAccount(
  userId: string,
  accountId: string,
  account: Partial<AppTradingAccount>
): Promise<AppTradingAccount | null> {
  const existing = await prisma.tradingAccount.findFirst({
    where: { id: accountId, userId },
  });

  if (!existing) {
    return null;
  }

  const data: Prisma.TradingAccountUpdateInput = {};

  if (typeof account.name === "string") data.name = account.name.trim() || existing.name;
  if (account.mode) data.mode = account.mode;
  if (typeof account.balance === "number") data.balance = account.balance;
  if (typeof account.equity === "number") data.equity = account.equity;
  if (typeof account.riskPercent === "number") data.riskPercent = account.riskPercent;
  if (typeof account.maxDailyLoss === "number") data.maxDailyLoss = account.maxDailyLoss;
  if (typeof account.maxDrawdown === "number") data.maxDrawdown = account.maxDrawdown;
  if (typeof account.maxTradesPerDay === "number") data.maxTradesPerDay = account.maxTradesPerDay;
  if (typeof account.currentDailyLoss === "number") data.currentDailyLoss = account.currentDailyLoss;
  if (typeof account.currentDailyTrades === "number") data.currentDailyTrades = account.currentDailyTrades;
  if (typeof account.lossesInARow === "number") data.lossesInARow = account.lossesInARow;
  if (typeof account.isActive === "boolean") data.isActive = account.isActive;

  const updated = await prisma.tradingAccount.update({
    where: { id: accountId },
    data,
    include: ACCOUNT_INCLUDE,
  });

  return mapAccountRecord(updated);
}

export async function resetDailyAccountCounters(userId: string): Promise<AppTradingAccount[]> {
  await prisma.$transaction(async (tx) => {
    await tx.tradingAccount.updateMany({
      where: { userId },
      data: {
        currentDailyLoss: 0,
        currentDailyTrades: 0,
        lossesInARow: 0,
      },
    });
  });

  return listAccounts(userId);
}

export async function listTrades(
  userId: string,
  filters: TradeFilters
): Promise<{ trades: AppTrade[]; total: number }> {
  const where: Prisma.TradeWhereInput = { userId };

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.accountId) {
    where.accountId = filters.accountId;
  }

  const limit = Math.min(filters.limit ?? 50, 200);
  const offset = filters.offset ?? 0;

  const [records, total] = await prisma.$transaction([
    prisma.trade.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.trade.count({ where }),
  ]);

  return { trades: records.map(mapTradeRecord), total };
}

export async function createTrade(userId: string, input: CreateTradeInput): Promise<AppTrade> {
  return prisma.$transaction(async (tx) => {
    const account = await findAccountForUser(tx, userId, input.accountId);

    if (!account) {
      throw new Error("Trading account not found.");
    }

    const status = input.status ?? "pending";
    const rules = getAccountRules(account.mode as AccountMode);

    if (status === "denied") {
      throw new Error("Denied setups must be logged with the deny trade action.");
    }

    if (status === "closed" || status === "cancelled") {
      throw new Error("Trades must be created as pending or open before they can be closed or cancelled.");
    }

    const existingPairExposure = await tx.trade.findFirst({
      where: {
        userId,
        accountId: account.id,
        pair: input.pair,
        status: { in: ["pending", "open"] },
      },
    });

    if (existingPairExposure) {
      throw new Error("This account already has an open or pending trade on the selected pair.");
    }

    if (input.stopLoss <= 0 || input.takeProfit <= 0 || input.entryPrice <= 0) {
      throw new Error("A valid entry, stop loss, and take profit are required before recording a trade.");
    }

    if ((input.entryStatus ?? "WAIT") !== "CONFIRMED") {
      throw new Error("Trades can only be recorded when the entry status is CONFIRMED.");
    }

    if ((input.aiDecision ?? "WAIT") !== "TAKE_TRADE") {
      throw new Error("Only TAKE_TRADE analyses can be recorded as live trades.");
    }

    const minScore = account.mode === "funded" ? 8 : 7;
    if ((input.aiScore ?? 0) < minScore) {
      throw new Error(
        `${account.mode === "funded" ? "Funded" : "Personal"} account trade score is too low to record.`
      );
    }

    const calculatedRisk = calculateRisk({
      accountBalance: toNumber(account.balance),
      riskPercent: toNumber(account.riskPercent),
      entryPrice: input.entryPrice,
      stopLossPrice: input.stopLoss,
      takeProfitPrice: input.takeProfit,
      pair: input.pair,
      direction: input.direction,
    });

    if (!calculatedRisk.isValid) {
      throw new Error(calculatedRisk.denial || "Risk calculation failed. Trade not recorded.");
    }

    if (calculatedRisk.riskRewardRatio < rules.minRiskReward) {
      throw new Error(
        `${account.mode === "funded" ? "Funded" : "Personal"} account requires at least ${rules.minRiskReward}:1 risk-to-reward.`
      );
    }

    const accountSnapshot = {
      ...mapAccountRecord({
        ...account,
        trades: [],
      }),
      openTrades: [],
    };
    const accountDenials = validateTradeAgainstAccount(accountSnapshot, calculatedRisk);
    if (accountDenials.length > 0) {
      throw new Error(formatDenialMessage(accountDenials));
    }

    let alertLogId: string | undefined;
    if (input.alertLogId) {
      const requestedSignal = await tx.alertLog.findFirst({
        where: {
          id: input.alertLogId,
          userId,
          pair: input.pair,
          alertType: "trade_now",
        },
        select: { id: true },
      });
      if (!requestedSignal) {
        throw new Error("Signal link is invalid for this pair or user.");
      }
      alertLogId = requestedSignal.id;
    } else {
      const recentSignal = await tx.alertLog.findFirst({
        where: {
          userId,
          pair: input.pair,
          alertType: "trade_now",
          trades: { none: {} },
        },
        orderBy: { sentAt: "desc" },
        select: { id: true },
      });
      alertLogId = recentSignal?.id;
    }

    const trade = await tx.trade.create({
      data: {
        userId,
        accountId: account.id,
        alertLogId,
        pair: input.pair,
        direction: input.direction,
        setupType: input.setupType ?? "pullback",
        entryPrice: input.entryPrice,
        stopLoss: input.stopLoss,
        takeProfit: input.takeProfit,
        lotSize: calculatedRisk.lotSize,
        riskAmount: calculatedRisk.riskAmount,
        riskRewardRatio: calculatedRisk.riskRewardRatio,
        status,
        entryStatus: input.entryStatus ?? "WAIT",
        pnl: input.pnl,
        pipsPnl: input.pipsPnl,
        aiScore: input.aiScore ?? 0,
        aiDecision: input.aiDecision ?? "",
        aiReasoning: input.aiReasoning ?? "",
        notes: input.notes,
        openedAt: status === "open" ? new Date() : undefined,
      },
    });

    if (shouldCountTrade(status)) {
      await tx.tradingAccount.update({
        where: { id: account.id },
        data: {
          currentDailyTrades: {
            increment: 1,
          },
        },
      });
    }

    return mapTradeRecord(trade);
  });
}

export async function updateTrade(
  userId: string,
  tradeId: string,
  updates: UpdateTradeInput
): Promise<AppTrade | null> {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.trade.findFirst({
      where: { id: tradeId, userId },
    });

    if (!existing) {
      return null;
    }

    const account = await tx.tradingAccount.findUnique({
      where: { id: existing.accountId },
    });

    if (!account) {
      throw new Error("Trading account not found.");
    }

    const nextStatus = updates.status ?? (existing.status as TradeStatus);
    const data = buildTradeUpdateData(updates);
    const movingToOpen = nextStatus === "open" && existing.status !== "open";
    const movingToClosed = nextStatus === "closed" && existing.status !== "closed";
    const movingToCancelled = nextStatus === "cancelled" && existing.status !== "cancelled";

    if (existing.status === "denied") {
      throw new Error("Denied trade records are audit-only and cannot be updated.");
    }

    if (movingToOpen && existing.status !== "pending") {
      throw new Error("Only pending trades can be activated as open trades.");
    }

    if (movingToClosed && existing.status !== "open") {
      throw new Error("Only open trades can be closed.");
    }

    if (movingToCancelled && existing.status !== "pending") {
      throw new Error("Only pending trades can be cancelled.");
    }

    if (movingToClosed && typeof updates.pnl !== "number") {
      throw new Error("Closing a trade requires a realized P&L value.");
    }

    if (movingToOpen && !existing.openedAt) {
      data.openedAt = new Date();
    }

    if (movingToClosed) {
      data.closedAt = new Date();
    }

    const updated = await tx.trade.update({
      where: { id: tradeId },
      data,
    });

    const accountUpdate: Prisma.TradingAccountUpdateInput = {};

    if (movingToCancelled && shouldCountTrade(existing.status)) {
      accountUpdate.currentDailyTrades = Math.max(account.currentDailyTrades - 1, 0);
    }

    if (movingToClosed && shouldCountTrade(existing.status)) {
      const pnl = toOptionalNumber(updated.pnl) ?? 0;

      if (pnl < 0) {
        accountUpdate.currentDailyLoss = {
          increment: Math.abs(pnl),
        };
        accountUpdate.lossesInARow = {
          increment: 1,
        };
      } else if (pnl > 0) {
        accountUpdate.lossesInARow = 0;
      }
    }

    if (Object.keys(accountUpdate).length > 0) {
      await tx.tradingAccount.update({
        where: { id: existing.accountId },
        data: accountUpdate,
      });
    }

    return mapTradeRecord(updated);
  });
}

export async function denyTrade(
  userId: string,
  input: CreateTradeInput & { denialReason?: string }
): Promise<AppTrade> {
  return prisma.$transaction(async (tx) => {
    const account = await findAccountForUser(tx, userId, input.accountId);

    if (!account) {
      throw new Error("Trading account not found.");
    }

    const trade = await tx.trade.create({
      data: {
        userId,
        accountId: account.id,
        pair: input.pair,
        direction: input.direction ?? "LONG",
        setupType: input.setupType ?? "pullback",
        entryPrice: input.entryPrice ?? 0,
        stopLoss: input.stopLoss ?? 0,
        takeProfit: input.takeProfit ?? 0,
        lotSize: input.lotSize ?? 0,
        riskAmount: input.riskAmount ?? 0,
        riskRewardRatio: input.riskRewardRatio ?? 0,
        status: "denied",
        entryStatus: "INVALID",
        pnl: input.pnl,
        pipsPnl: input.pipsPnl,
        aiScore: input.aiScore ?? 0,
        aiDecision: "DENY",
        aiReasoning: input.aiReasoning ?? "",
        denialReason: input.denialReason,
        notes: input.notes,
      },
    });

    return mapTradeRecord(trade);
  });
}

export async function listJournalEntries(filters: {
  userId: string;
  type?: AppJournalEntry["type"] | null;
  limit?: number;
}): Promise<{ entries: AppJournalEntry[]; total: number }> {
  const where: Prisma.JournalEntryWhereInput = { userId: filters.userId };

  if (filters.type) {
    where.type = filters.type;
  }

  const limit = filters.limit ?? 50;
  const [entries, total] = await prisma.$transaction([
    prisma.journalEntry.findMany({
      where,
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      take: limit,
    }),
    prisma.journalEntry.count({ where }),
  ]);

  return {
    entries: entries.map(mapJournalEntryRecord),
    total,
  };
}

export async function createJournalEntry(input: CreateJournalEntryInput): Promise<AppJournalEntry> {
  const entry = await prisma.journalEntry.create({
    data: {
      userId: input.userId,
      tradeId: input.tradeId,
      date: input.date ? new Date(input.date) : new Date(),
      type: input.type ?? "review",
      content: input.content?.trim() || "",
      mistakes: input.mistakes ?? [],
      disciplineScore: input.disciplineScore,
      aiFeedback: input.aiFeedback,
      tags: input.tags ?? [],
    },
  });

  return mapJournalEntryRecord(entry);
}

export async function getEndOfDayReviewContext(
  userId: string,
  date: Date = new Date()
): Promise<EndOfDayReviewContext> {
  const from = startOfDay(date);
  const to = endOfDay(date);

  const [trades, journalEntries] = await Promise.all([
    prisma.trade.findMany({
      where: {
        userId,
        OR: [
          {
            createdAt: {
              gte: from,
              lt: to,
            },
          },
          {
            openedAt: {
              gte: from,
              lt: to,
            },
          },
          {
            closedAt: {
              gte: from,
              lt: to,
            },
          },
        ],
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.journalEntry.findMany({
      where: {
        userId,
        date: {
          gte: from,
          lt: to,
        },
      },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    }),
  ]);

  const mappedTrades = trades.map(mapTradeRecord);
  const mappedJournalEntries = journalEntries.map(mapJournalEntryRecord);
  const closedTrades = mappedTrades.filter(
    (trade) => trade.status === "closed" && typeof trade.pnl === "number"
  );
  const wins = closedTrades.filter((trade) => (trade.pnl || 0) > 0).length;
  const losses = closedTrades.filter((trade) => (trade.pnl || 0) < 0).length;
  const pnl = roundCurrency(closedTrades.reduce((total, trade) => total + (trade.pnl || 0), 0));

  return {
    date: from,
    trades: mappedTrades,
    journalEntries: mappedJournalEntries,
    stats: {
      totalTrades: mappedTrades.length,
      executedTrades: mappedTrades.filter(
        (trade) => trade.status !== "denied" && trade.status !== "cancelled"
      ).length,
      closedTrades: closedTrades.length,
      wins,
      losses,
      deniedTrades: mappedTrades.filter((trade) => trade.status === "denied").length,
      pnl,
      winRate: closedTrades.length > 0 ? Math.round((wins / closedTrades.length) * 100) : 0,
      journalEntries: mappedJournalEntries.length,
    },
  };
}

export async function getDailyPlanContext(
  userId: string,
  date: Date = new Date()
): Promise<DailyPlanContext> {
  const normalizedDate = startOfDay(date);
  const [accounts, trades, events, priorReview] = await Promise.all([
    listAccounts(userId),
    prisma.trade.findMany({
      where: {
        userId,
        status: {
          in: ["pending", "open"],
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    fetchEconomicCalendar({
      from: normalizedDate,
      to: endOfDay(normalizedDate),
      limit: 8,
      minimumImpact: "medium",
    }).catch(() => []),
    getSavedEndOfDayReview(userId, new Date(normalizedDate.getTime() - 24 * 60 * 60 * 1000)),
  ]);

  return {
    date: normalizedDate,
    accounts: accounts.filter((account) => account.isActive),
    openTrades: trades.map(mapTradeRecord),
    upcomingEvents: events,
    priorReview,
  };
}

export async function getSavedDailyPlan(
  userId: string,
  date: Date = new Date()
): Promise<AppDailyPlan | null> {
  const normalizedDate = startOfDay(date);
  const record = await prisma.dailyPlan.findUnique({
    where: {
      userId_date: {
        userId,
        date: normalizedDate,
      },
    },
  });

  return record ? mapDailyPlanRecord(record) : null;
}

export async function saveDailyPlan(
  userId: string,
  plan: {
    date: Date;
    pairs: CurrencyPair[];
    macroBias: string;
    keyLevels: string;
    newsEvents: string;
    sessionFocus: string;
    maxTrades: number;
    planNotes: string;
  }
): Promise<AppDailyPlan> {
  const normalizedDate = startOfDay(plan.date);
  const saved = await prisma.dailyPlan.upsert({
    where: {
      userId_date: {
        userId,
        date: normalizedDate,
      },
    },
    update: {
      pairs: plan.pairs,
      macroBias: plan.macroBias,
      keyLevels: plan.keyLevels,
      newsEvents: plan.newsEvents,
      sessionFocus: plan.sessionFocus,
      maxTrades: plan.maxTrades,
      planNotes: plan.planNotes,
    },
    create: {
      userId,
      date: normalizedDate,
      pairs: plan.pairs,
      macroBias: plan.macroBias,
      keyLevels: plan.keyLevels,
      newsEvents: plan.newsEvents,
      sessionFocus: plan.sessionFocus,
      maxTrades: plan.maxTrades,
      planNotes: plan.planNotes,
    },
  });

  return mapDailyPlanRecord(saved);
}

export async function getSavedEndOfDayReview(
  userId: string,
  date: Date = new Date()
): Promise<EndOfDayReview | null> {
  const normalizedDate = startOfDay(date);
  const record = await prisma.dailyPlan.findUnique({
    where: {
      userId_date: {
        userId,
        date: normalizedDate,
      },
    },
  });

  return parseStoredEndOfDayReview(record);
}

export async function saveEndOfDayReview(
  userId: string,
  review: EndOfDayReview,
  context: EndOfDayReviewContext
): Promise<EndOfDayReview> {
  const normalizedDate = startOfDay(review.date);
  const pairs = Array.from(new Set(context.trades.map((trade) => trade.pair)));

  const saved = await prisma.dailyPlan.upsert({
    where: {
      userId_date: {
        userId,
        date: normalizedDate,
      },
    },
    update: {
      pairs,
      maxTrades: context.stats.executedTrades,
      reviewNotes: JSON.stringify(review),
      disciplineScore: review.disciplineScore,
    },
    create: {
      userId,
      date: normalizedDate,
      pairs,
      macroBias: "End-of-day review",
      keyLevels: "Review generated from recorded trades and journal entries.",
      newsEvents: "Refer to the live calendar for session-specific catalysts.",
      sessionFocus: "Capital protection and disciplined execution.",
      maxTrades: context.stats.executedTrades,
      reviewNotes: JSON.stringify(review),
      disciplineScore: review.disciplineScore,
    },
  });

  return parseStoredEndOfDayReview(saved) ?? review;
}

export async function getTelegramConnectionStatus(userId: string): Promise<TelegramConnectionStatus> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      telegramChatId: true,
      telegramLinkCode: true,
      telegramLinkCodeExpiresAt: true,
      telegramAlertsEnabled: true,
    },
  });

  return {
    isConnected: Boolean(user?.telegramChatId),
    chatId: maskTelegramChatId(user?.telegramChatId),
    linkCode: user?.telegramLinkCode ?? undefined,
    linkCodeExpiresAt: user?.telegramLinkCodeExpiresAt ?? undefined,
    alertsEnabled: user?.telegramAlertsEnabled ?? true,
  };
}

export async function generateTelegramLinkCode(userId: string): Promise<TelegramConnectionStatus> {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = generateLinkCodeValue();

    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          telegramLinkCode: code,
          telegramLinkCodeExpiresAt: expiresAt,
        },
      });

      return getTelegramConnectionStatus(userId);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        continue;
      }

      throw error;
    }
  }

  throw new Error("Failed to generate a unique Telegram link code. Please try again.");
}

export async function unlinkTelegramConnection(userId: string): Promise<TelegramConnectionStatus> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      telegramChatId: null,
      telegramLinkCode: null,
      telegramLinkCodeExpiresAt: null,
    },
  });

  return getTelegramConnectionStatus(userId);
}

export async function setTelegramAlertsEnabled(
  userId: string,
  enabled: boolean
): Promise<TelegramConnectionStatus> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      telegramAlertsEnabled: enabled,
    },
  });

  return getTelegramConnectionStatus(userId);
}

export async function linkTelegramChatByCode(input: {
  code: string;
  chatId: string;
}): Promise<{ userId: string; email: string; alertsEnabled: boolean } | null> {
  const code = input.code.trim().toUpperCase();
  const now = new Date();

  const user = await prisma.user.findFirst({
    where: {
      telegramLinkCode: code,
      telegramLinkCodeExpiresAt: {
        gt: now,
      },
    },
    select: {
      id: true,
      email: true,
      telegramAlertsEnabled: true,
    },
  });

  if (!user) {
    return null;
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.updateMany({
      where: {
        telegramChatId: input.chatId,
        id: {
          not: user.id,
        },
      },
      data: {
        telegramChatId: null,
      },
    });

    await tx.user.update({
      where: { id: user.id },
      data: {
        telegramChatId: input.chatId,
        telegramLinkCode: null,
        telegramLinkCodeExpiresAt: null,
      },
    });
  });

  return {
    userId: user.id,
    email: user.email,
    alertsEnabled: user.telegramAlertsEnabled,
  };
}

export async function findUserByTelegramChatId(chatId: string): Promise<{
  id: string;
  email: string;
  name?: string | null;
  alertsEnabled: boolean;
} | null> {
  const user = await prisma.user.findUnique({
    where: { telegramChatId: chatId },
    select: {
      id: true,
      email: true,
      name: true,
      telegramAlertsEnabled: true,
    },
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    alertsEnabled: user.telegramAlertsEnabled,
  };
}

export async function getTelegramAlertTarget(userId: string): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      telegramChatId: true,
      telegramAlertsEnabled: true,
    },
  });

  if (!user?.telegramChatId || !user.telegramAlertsEnabled) {
    return null;
  }

  return user.telegramChatId;
}

export async function listUsersWithTelegramAlertsEnabled(): Promise<
  Array<{
    id: string;
    chatId: string;
  }>
> {
  const users = await prisma.user.findMany({
    where: {
      telegramAlertsEnabled: true,
      telegramChatId: {
        not: null,
      },
    },
    select: {
      id: true,
      telegramChatId: true,
    },
  });

  return users
    .filter((user): user is { id: string; telegramChatId: string } => Boolean(user.telegramChatId))
    .map((user) => ({
      id: user.id,
      chatId: user.telegramChatId,
    }));
}

export async function listUsersWithAlertDestinations(): Promise<
  Array<{
    id: string;
    chatId: string | null;
    email: string;
  }>
> {
  const users = await prisma.user.findMany({
    where: {
      telegramAlertsEnabled: true,
    },
    select: {
      id: true,
      email: true,
      telegramChatId: true,
    },
  });

  return users.map((user) => ({
    id: user.id,
    email: user.email,
    chatId: user.telegramChatId,
  }));
}

export async function getAccountName(userId: string, accountId: string): Promise<string | null> {
  const account = await prisma.tradingAccount.findFirst({
    where: {
      id: accountId,
      userId,
    },
    select: {
      name: true,
    },
  });

  return account?.name ?? null;
}

export async function getAccountSnapshot(
  userId: string,
  accountId: string
): Promise<AppTradingAccount | null> {
  const account = await prisma.tradingAccount.findFirst({
    where: { id: accountId, userId },
    include: ACCOUNT_INCLUDE,
  });

  return account ? mapAccountRecord(account) : null;
}

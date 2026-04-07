import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { CurrencyPair, TradeDirection, TradeStatus } from "@/types";

// MT5 TimeToString outputs "2026.04.06 14:30:00" — not valid ISO 8601.
// Replace dots in the date part with dashes so new Date() parses correctly.
function parseMtDate(value: string | Date | undefined): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return isNaN(value.getTime()) ? undefined : value;
  const iso = value.replace(/^(\d{4})\.(\d{2})\.(\d{2})/, "$1-$2-$3");
  const d = new Date(iso);
  return isNaN(d.getTime()) ? undefined : d;
}

export interface MtImportDeps {
  findAccount: (
    userId: string,
    position: { accountId?: string; accountName?: string },
    cache: Map<string, { id: string; mode: string; balance: number; equity: number; riskPercent: number }>
  ) => Promise<{ id: string; mode: string; balance: number; equity: number; riskPercent: number } | null>;
  findExistingTrade: (externalRef: string) => Promise<{ id: string; status: string } | null>;
  createTrade: (data: Prisma.TradeCreateInput) => Promise<void>;
  updateTrade: (externalRef: string, data: Prisma.TradeUncheckedUpdateInput) => Promise<void>;
  updateAccountBalance: (accountId: string, pnl: number) => Promise<void>;
}

const defaultDeps: MtImportDeps = {
  findAccount: defaultFindAccount,
  findExistingTrade: async (externalRef) => {
    const trade = await prisma.trade.findUnique({
      where: { externalRef },
      select: { id: true, status: true },
    });
    return trade ? { id: trade.id, status: trade.status } : null;
  },
  createTrade: async (data) => {
    await prisma.trade.create({ data });
  },
  updateTrade: async (externalRef, data) => {
    await prisma.trade.update({ where: { externalRef }, data });
  },
  updateAccountBalance: async (accountId, pnl) => {
    const rounded = Math.round(pnl * 100) / 100;
    await prisma.tradingAccount.update({
      where: { id: accountId },
      data: {
        balance: { increment: rounded },
        equity: { increment: rounded },
      },
    });
  },
};

interface MtPosition {
  externalRef: string;
  accountId?: string;
  accountName?: string;
  pair: CurrencyPair;
  direction: TradeDirection;
  status: TradeStatus;
  entryPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  lotSize: number;
  openedAt?: string | Date;
  closedAt?: string | Date;
  pnl?: number;
  pipsPnl?: number;
  notes?: string;
}

export async function importMtPositions(
  userId: string,
  positions: MtPosition[],
  deps: MtImportDeps = defaultDeps
) {
  const results = {
    imported: 0,
    updated: 0,
    skipped: 0,
    errors: [] as string[],
  };

  const accountCache = new Map<string, { id: string; mode: string; balance: number; equity: number; riskPercent: number }>();

  for (const position of positions) {
    try {
      const account = await deps.findAccount(userId, position, accountCache);
      if (!account) {
        results.skipped += 1;
        results.errors.push(`Account not found for MT position ${position.externalRef}`);
        continue;
      }

      const entryStatus =
        position.status === "denied"
          ? "INVALID"
          : position.status === "pending"
            ? "READY"
            : "CONFIRMED";

      const tradeData: Prisma.TradeCreateInput = {
        user: { connect: { id: userId } },
        account: { connect: { id: account.id } },
        externalRef: position.externalRef,
        pair: position.pair,
        direction: position.direction,
        setupType: "pullback",
        entryPrice: position.entryPrice,
        stopLoss: position.stopLoss ?? position.entryPrice,
        takeProfit: position.takeProfit ?? position.entryPrice,
        lotSize: position.lotSize,
        riskAmount: 0,
        riskRewardRatio: 0,
        status: position.status,
        entryStatus,
        pnl: position.pnl ?? null,
        pipsPnl: position.pipsPnl ?? null,
        aiScore: 0,
        aiDecision: "IMPORTED",
        aiReasoning: "Imported from MetaTrader for audit.",
        denialReason: position.status === "denied" ? "weak_setup" : null,
        notes: position.notes ?? `Imported from MetaTrader ticket ${position.externalRef}.`,
        openedAt: parseMtDate(position.openedAt),
        closedAt: parseMtDate(position.closedAt),
      };

      const existing = await deps.findExistingTrade(position.externalRef);
      const wasAlreadyClosed = existing?.status === "closed";

      if (existing) {
        await deps.updateTrade(position.externalRef, tradeData as Prisma.TradeUncheckedUpdateInput);
        results.updated += 1;
      } else {
        await deps.createTrade(tradeData);
        results.imported += 1;
      }

      // Sync account balance when a closed trade with P&L is first imported or just became closed
      const isNowClosed = position.status === "closed" && typeof position.pnl === "number";
      if (isNowClosed && !wasAlreadyClosed) {
        await deps.updateAccountBalance(account.id, position.pnl!);
      }
    } catch (error) {
      results.skipped += 1;
      results.errors.push(
        `Ticket ${position.externalRef}: ${(error as Error).message || "Import failed"}`
      );
    }
  }

  return results;
}

async function defaultFindAccount(
  userId: string,
  position: { accountId?: string; accountName?: string },
  cache: Map<string, { id: string; mode: string; balance: number; equity: number; riskPercent: number }>
) {
  const cacheKey = position.accountId || position.accountName || "";
  if (cacheKey && cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  const account = await prisma.tradingAccount.findFirst({
    where: {
      userId,
      OR: [
        position.accountId ? { id: position.accountId } : undefined,
        position.accountName ? { name: { equals: position.accountName, mode: "insensitive" } } : undefined,
      ].filter(Boolean) as Prisma.TradingAccountWhereInput[],
    },
    select: {
      id: true,
      mode: true,
      balance: true,
      equity: true,
      riskPercent: true,
    },
  });

  if (!account) return null;

  const normalized = {
    id: account.id,
    mode: account.mode,
    balance: Number(account.balance),
    equity: Number(account.equity),
    riskPercent: Number(account.riskPercent),
  };

  cache.set(cacheKey, normalized);
  return normalized;
}

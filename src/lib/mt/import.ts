import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { calculateRisk } from "@/lib/risk/engine";
import { getAccountRules } from "@/config/trading";
import type { CurrencyPair, TradeDirection, TradeStatus } from "@/types";

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

export async function importMtPositions(userId: string, positions: MtPosition[]) {
  const results = {
    imported: 0,
    updated: 0,
    skipped: 0,
    errors: [] as string[],
  };

  const accountCache = new Map<string, { id: string; mode: string; balance: number; equity: number; riskPercent: number }>();

  for (const position of positions) {
    try {
      const account = await findAccount(userId, position, accountCache);
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
        openedAt: position.openedAt ? new Date(position.openedAt) : undefined,
        closedAt: position.closedAt ? new Date(position.closedAt) : undefined,
      };

      const existing = await prisma.trade.findUnique({
        where: { externalRef: position.externalRef },
        select: { id: true },
      });

      if (existing) {
        await prisma.trade.update({
          where: { externalRef: position.externalRef },
          data: tradeData,
        });
        results.updated += 1;
      } else {
        await prisma.trade.create({ data: tradeData });
        results.imported += 1;
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

async function findAccount(
  userId: string,
  position: MtPosition,
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
        position.accountName ? { name: position.accountName } : undefined,
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

  if (!account) {
    return null;
  }

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

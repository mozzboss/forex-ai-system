import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { importMtPositions, MtImportDeps } from "@/lib/mt/import";
import type { CurrencyPair, TradeDirection, TradeStatus } from "@/types";
import { Prisma } from "@prisma/client";

// ── helpers ───────────────────────────────────────────────────────────────────

const ACCOUNT = {
  id: "acc-1",
  mode: "live",
  balance: 10000,
  equity: 10000,
  riskPercent: 1,
};

function makePosition(overrides: Partial<{
  externalRef: string;
  accountId: string;
  pair: CurrencyPair;
  direction: TradeDirection;
  status: TradeStatus;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  lotSize: number;
  pnl: number;
  openedAt: string;
  closedAt: string;
}> = {}) {
  return {
    externalRef: "12345",
    accountId: "acc-1",
    pair: "EURUSD" as CurrencyPair,
    direction: "long" as TradeDirection,
    status: "open" as TradeStatus,
    entryPrice: 1.1000,
    stopLoss: 1.0950,
    takeProfit: 1.1100,
    lotSize: 0.1,
    openedAt: "2024-01-15T10:00:00Z",
    ...overrides,
  };
}

function makeDeps(overrides: Partial<MtImportDeps> = {}): MtImportDeps & {
  created: Prisma.TradeCreateInput[];
  updated: Array<{ externalRef: string; data: Prisma.TradeUncheckedUpdateInput }>;
  balanceUpdates: Array<{ accountId: string; pnl: number }>;
} {
  const created: Prisma.TradeCreateInput[] = [];
  const updated: Array<{ externalRef: string; data: Prisma.TradeUncheckedUpdateInput }> = [];
  const balanceUpdates: Array<{ accountId: string; pnl: number }> = [];

  return {
    created,
    updated,
    balanceUpdates,
    findAccount: async (_userId, _position, _cache) => ACCOUNT,
    findExistingTrade: async (_externalRef) => null,
    createTrade: async (data) => { created.push(data); },
    updateTrade: async (externalRef, data) => { updated.push({ externalRef, data }); },
    updateAccountBalance: async (accountId, pnl) => { balanceUpdates.push({ accountId, pnl }); },
    ...overrides,
  };
}

// ── tests ─────────────────────────────────────────────────────────────────────

describe("importMtPositions", () => {
  it("imports a new trade", async () => {
    const deps = makeDeps();
    const result = await importMtPositions("user-1", [makePosition()], deps);

    assert.equal(result.imported, 1);
    assert.equal(result.updated, 0);
    assert.equal(result.skipped, 0);
    assert.equal(result.errors.length, 0);
    assert.equal(deps.created.length, 1);
    assert.equal(deps.created[0].externalRef, "12345");
  });

  it("updates an existing trade", async () => {
    const deps = makeDeps({
      findExistingTrade: async () => ({ id: "trade-99", status: "open" }),
    });
    const result = await importMtPositions("user-1", [makePosition()], deps);

    assert.equal(result.imported, 0);
    assert.equal(result.updated, 1);
    assert.equal(deps.updated.length, 1);
    assert.equal(deps.updated[0].externalRef, "12345");
  });

  it("syncs account balance when a new closed trade is imported with P&L", async () => {
    const deps = makeDeps();
    const position = makePosition({
      status: "closed",
      pnl: 150.50,
      closedAt: "2024-01-15T18:00:00Z",
    });
    const result = await importMtPositions("user-1", [position], deps);

    assert.equal(result.imported, 1);
    assert.equal(deps.balanceUpdates.length, 1);
    assert.equal(deps.balanceUpdates[0].accountId, "acc-1");
    assert.equal(deps.balanceUpdates[0].pnl, 150.50);
  });

  it("syncs account balance when an open trade is updated to closed", async () => {
    const deps = makeDeps({
      findExistingTrade: async () => ({ id: "trade-99", status: "open" }),
    });
    const position = makePosition({
      status: "closed",
      pnl: -75.00,
      closedAt: "2024-01-15T18:00:00Z",
    });
    const result = await importMtPositions("user-1", [position], deps);

    assert.equal(result.updated, 1);
    assert.equal(deps.balanceUpdates.length, 1);
    assert.equal(deps.balanceUpdates[0].pnl, -75.00);
  });

  it("does NOT sync balance again if trade was already closed", async () => {
    const deps = makeDeps({
      findExistingTrade: async () => ({ id: "trade-99", status: "closed" }),
    });
    const position = makePosition({
      status: "closed",
      pnl: 200,
      closedAt: "2024-01-15T18:00:00Z",
    });
    const result = await importMtPositions("user-1", [position], deps);

    assert.equal(result.updated, 1);
    assert.equal(deps.balanceUpdates.length, 0, "should not double-count balance for already-closed trade");
  });

  it("skips and records error when account not found", async () => {
    const deps = makeDeps({
      findAccount: async () => null,
    });
    const result = await importMtPositions("user-1", [makePosition()], deps);

    assert.equal(result.skipped, 1);
    assert.equal(result.imported, 0);
    assert.equal(result.errors.length, 1);
    assert.match(result.errors[0], /Account not found/);
    assert.equal(deps.created.length, 0);
  });

  it("skips and records error on createTrade failure", async () => {
    const deps = makeDeps({
      createTrade: async () => { throw new Error("DB write failed"); },
    });
    const result = await importMtPositions("user-1", [makePosition()], deps);

    assert.equal(result.skipped, 1);
    assert.equal(result.errors.length, 1);
    assert.match(result.errors[0], /DB write failed/);
  });

  it("processes multiple positions, continuing past errors", async () => {
    let callCount = 0;
    const deps = makeDeps({
      createTrade: async () => {
        callCount++;
        if (callCount === 2) throw new Error("row 2 failed");
      },
    });

    const positions = [
      makePosition({ externalRef: "1001" }),
      makePosition({ externalRef: "1002" }),
      makePosition({ externalRef: "1003" }),
    ];
    const result = await importMtPositions("user-1", positions, deps);

    assert.equal(result.imported, 2);
    assert.equal(result.skipped, 1);
    assert.equal(result.errors.length, 1);
    assert.match(result.errors[0], /1002/);
  });

  it("sets entryStatus INVALID for denied trades", async () => {
    const deps = makeDeps();
    await importMtPositions("user-1", [makePosition({ status: "denied" })], deps);

    assert.equal(deps.created[0].entryStatus, "INVALID");
  });

  it("sets entryStatus READY for pending trades", async () => {
    const deps = makeDeps();
    await importMtPositions("user-1", [makePosition({ status: "pending" })], deps);

    assert.equal(deps.created[0].entryStatus, "READY");
  });

  it("sets entryStatus CONFIRMED for open/closed trades", async () => {
    const deps = makeDeps();
    await importMtPositions("user-1", [makePosition({ status: "open" })], deps);

    assert.equal(deps.created[0].entryStatus, "CONFIRMED");
  });
});

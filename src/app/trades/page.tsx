"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { TradeHistoryCharts, TradeManager } from "@/components/trade";
import { Button, Card, CardHeader } from "@/components/ui";
import { getPricePrecision } from "@/config/trading";
import { useAccounts, useTrades } from "@/hooks";
import { cn, formatCurrency } from "@/lib/utils";
import { Trade, TradeStatus } from "@/types";

const STATUS_FILTERS: Array<{ label: string; value: TradeStatus | "all" }> = [
  { label: "All", value: "all" },
  { label: "Open", value: "open" },
  { label: "Pending", value: "pending" },
  { label: "Closed", value: "closed" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Denied", value: "denied" },
];

function downloadCsv(filename: string, rows: Array<Array<string | number>>) {
  const csv = rows
    .map((row) =>
      row
        .map((value) => `"${String(value ?? "").replaceAll("\"", "\"\"")}"`)
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function buildTradeExportRows(trades: Trade[], accountNames: Map<string, string>) {
  return [
    ["Created At", "Pair", "Direction", "Status", "Account", "Entry", "Stop", "Target", "Lot", "Risk", "P&L", "AI Score", "Notes"],
    ...trades.map((trade) => [
      trade.createdAt.toISOString(),
      trade.pair,
      trade.direction,
      trade.status,
      accountNames.get(trade.accountId) || "Unknown account",
      trade.entryPrice,
      trade.stopLoss,
      trade.takeProfit,
      trade.lotSize,
      trade.riskAmount,
      trade.pnl ?? "",
      trade.aiScore,
      trade.notes || trade.aiReasoning || "",
    ]),
  ];
}

export default function TradesPage() {
  const { accounts, loading: accountsLoading, error: accountsError } = useAccounts();
  const { trades, loading, error, fetchTrades, refetch } = useTrades();
  const [statusFilter, setStatusFilter] = useState<TradeStatus | "all">("all");
  const [accountFilter, setAccountFilter] = useState("all");
  const [pairFilter, setPairFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const pairOptions = useMemo(
    () => Array.from(new Set(trades.map((trade) => trade.pair))).sort(),
    [trades]
  );

  const accountNameMap = useMemo(
    () => new Map(accounts.map((account) => [account.id, account.name])),
    [accounts]
  );

  const displayedTrades = useMemo(() => {
    return trades.filter((trade) => {
      if (pairFilter !== "all" && trade.pair !== pairFilter) return false;
      if (accountFilter !== "all" && trade.accountId !== accountFilter) return false;
      if (statusFilter !== "all" && trade.status !== statusFilter) return false;
      if (fromDate) {
        const from = new Date(fromDate);
        if (trade.createdAt < from) return false;
      }
      if (toDate) {
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999);
        if (trade.createdAt > to) return false;
      }
      return true;
    });
  }, [accountFilter, fromDate, pairFilter, statusFilter, toDate, trades]);

  const activeTrades = useMemo(
    () => displayedTrades.filter((trade) => trade.status === "open" || trade.status === "pending"),
    [displayedTrades]
  );

  const summary = useMemo(() => {
    const closedTrades = displayedTrades.filter(
      (trade) => trade.status === "closed" && typeof trade.pnl === "number"
    );
    const wins = closedTrades.filter((trade) => (trade.pnl || 0) > 0).length;
    const losses = closedTrades.filter((trade) => (trade.pnl || 0) < 0).length;
    const pnl = closedTrades.reduce((total, trade) => total + (trade.pnl || 0), 0);

    return {
      total: displayedTrades.length,
      active: activeTrades.length,
      wins,
      losses,
      pnl,
    };
  }, [activeTrades.length, displayedTrades]);

  const pairDrilldown = useMemo(() => {
    const buckets = new Map<string, { trades: number; closed: number; pnl: number }>();

    for (const trade of displayedTrades) {
      const bucket = buckets.get(trade.pair) || { trades: 0, closed: 0, pnl: 0 };
      bucket.trades += 1;
      if (trade.status === "closed" && typeof trade.pnl === "number") {
        bucket.closed += 1;
        bucket.pnl += trade.pnl;
      }
      buckets.set(trade.pair, bucket);
    }

    return Array.from(buckets.entries())
      .map(([pair, value]) => ({ pair, ...value }))
      .sort((left, right) => right.pnl - left.pnl)
      .slice(0, 4);
  }, [displayedTrades]);

  const accountDrilldown = useMemo(() => {
    const buckets = new Map<string, { trades: number; closed: number; pnl: number }>();

    for (const trade of displayedTrades) {
      const key = accountNameMap.get(trade.accountId) || "Unknown account";
      const bucket = buckets.get(key) || { trades: 0, closed: 0, pnl: 0 };
      bucket.trades += 1;
      if (trade.status === "closed" && typeof trade.pnl === "number") {
        bucket.closed += 1;
        bucket.pnl += trade.pnl;
      }
      buckets.set(key, bucket);
    }

    return Array.from(buckets.entries())
      .map(([account, value]) => ({ account, ...value }))
      .sort((left, right) => right.pnl - left.pnl)
      .slice(0, 4);
  }, [accountNameMap, displayedTrades]);

  const applyRemoteFilters = async (nextStatus: TradeStatus | "all", nextAccount: string) => {
    setStatusFilter(nextStatus);
    setAccountFilter(nextAccount);
    await fetchTrades({
      status: nextStatus === "all" ? undefined : nextStatus,
      accountId: nextAccount === "all" ? undefined : nextAccount,
    });
  };

  const exportDisplayedTrades = () => {
    downloadCsv(
      "trade-ledger-export.csv",
      buildTradeExportRows(displayedTrades, accountNameMap)
    );
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <section className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.15),_transparent_35%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.96))] p-5 sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-green-300/80">
              Trade Ledger
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Manage active exposure and review every recorded decision in one place.
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              This view gives us a clean trade lifecycle: active positions, closed outcomes, denied setups,
              and the account context around each decision.
            </p>
            <Link href="/performance" className="mt-4 inline-flex text-sm text-brand-400 hover:text-brand-300">
              Open full performance review
            </Link>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="secondary" onClick={refetch} disabled={loading || accountsLoading} className="w-full sm:w-auto">
              {loading ? "Refreshing..." : "Refresh Ledger"}
            </Button>
            <Button variant="secondary" onClick={exportDisplayedTrades} disabled={displayedTrades.length === 0} className="w-full sm:w-auto">
              Export CSV
            </Button>
            <Link
              href="/mt-import"
              className="inline-flex w-full items-center justify-center rounded-lg bg-white/5 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-white/10 hover:text-white sm:w-auto"
            >
              MT Import
            </Link>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-5">
          <SummaryCard label="Total Trades" value={`${summary.total}`} />
          <SummaryCard label="Active" value={`${summary.active}`} />
          <SummaryCard label="Wins" value={`${summary.wins}`} tone="text-green-400" />
          <SummaryCard label="Losses" value={`${summary.losses}`} tone="text-red-400" />
          <SummaryCard
            label="Closed P&L"
            value={summary.pnl === 0 ? "-" : formatCurrency(summary.pnl)}
            tone={summary.pnl > 0 ? "text-green-400" : summary.pnl < 0 ? "text-red-400" : "text-white"}
          />
        </div>
      </section>

      {accountsError || error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {accountsError || error}
        </div>
      ) : null}

      <Card>
        <div className="mb-4 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <CardHeader className="mb-1">Filters</CardHeader>
            <p className="text-sm text-gray-400">
              Narrow the ledger by trade state, account, and pair without losing the active management tools below.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <label className="block">
              <span className="text-sm text-gray-400">Status</span>
              <select
                value={statusFilter}
                onChange={(event) => applyRemoteFilters(event.target.value as TradeStatus | "all", accountFilter)}
                className="mt-1 w-full rounded-lg border border-white/10 bg-surface-light px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              >
                {STATUS_FILTERS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm text-gray-400">Account</span>
              <select
                value={accountFilter}
                onChange={(event) => applyRemoteFilters(statusFilter, event.target.value)}
                className="mt-1 w-full rounded-lg border border-white/10 bg-surface-light px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              >
                <option value="all">All Accounts</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm text-gray-400">Pair</span>
              <select
                value={pairFilter}
                onChange={(event) => setPairFilter(event.target.value)}
                className="mt-1 w-full rounded-lg border border-white/10 bg-surface-light px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              >
                <option value="all">All Pairs</option>
                {pairOptions.map((pair) => (
                  <option key={pair} value={pair}>
                    {pair}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm text-gray-400">From</span>
              <input
                type="date"
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
                className="mt-1 w-full rounded-lg border border-white/10 bg-surface-light px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-400">To</span>
              <input
                type="date"
                value={toDate}
                onChange={(event) => setToDate(event.target.value)}
                className="mt-1 w-full rounded-lg border border-white/10 bg-surface-light px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />
            </label>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>Pair Drilldown</CardHeader>
          <p className="mb-4 text-sm text-gray-400">
            Quick review of where performance and trade frequency are concentrating by instrument.
          </p>
          <div className="space-y-3">
            {pairDrilldown.length === 0 ? (
              <EmptyState text="No pair data available for the current filters." />
            ) : (
              pairDrilldown.map((row) => (
                <DrilldownRow
                  key={row.pair}
                  label={row.pair}
                  sublabel={`${row.trades} logged | ${row.closed} closed`}
                  value={formatCurrency(row.pnl)}
                  positive={row.pnl >= 0}
                />
              ))
            )}
          </div>
        </Card>

        <Card>
          <CardHeader>Account Drilldown</CardHeader>
          <p className="mb-4 text-sm text-gray-400">
            Keep funded and personal execution quality separated so one does not hide the other.
          </p>
          <div className="space-y-3">
            {accountDrilldown.length === 0 ? (
              <EmptyState text="No account data available for the current filters." />
            ) : (
              accountDrilldown.map((row) => (
                <DrilldownRow
                  key={row.account}
                  label={row.account}
                  sublabel={`${row.trades} logged | ${row.closed} closed`}
                  value={formatCurrency(row.pnl)}
                  positive={row.pnl >= 0}
                />
              ))
            )}
          </div>
        </Card>
      </div>

      <TradeManager
        trades={displayedTrades}
        accounts={accounts}
        refreshing={loading || accountsLoading}
        onRefresh={async () => {
          await refetch();
        }}
      />

      <TradeHistoryCharts trades={displayedTrades} accounts={accounts} />

      <Card>
        <CardHeader>Full Trade History</CardHeader>
        <div className="mb-4 text-sm text-gray-400">
          Reviewing <span className="font-semibold text-white">{displayedTrades.length}</span> trade
          {displayedTrades.length === 1 ? "" : "s"} after pair filtering.
        </div>
        <div className="space-y-3">
          {loading && displayedTrades.length === 0 ? (
            <div className="text-sm text-gray-500">Loading trades...</div>
          ) : null}

          {!loading && displayedTrades.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 bg-surface px-4 py-8 text-center text-sm text-gray-500">
              No trades match the current filters yet.
            </div>
          ) : null}

          {displayedTrades.map((trade) => {
            const account = accounts.find((item) => item.id === trade.accountId);
            return (
              <div key={trade.id} className="rounded-xl border border-white/5 bg-surface p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-lg font-semibold text-white">
                        {trade.pair} {trade.direction}
                      </span>
                      {trade.externalRef ? (
                        <span className="rounded bg-slate-700/60 px-1.5 py-0.5 text-xs font-mono text-slate-400">
                          #{trade.externalRef}
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <span>{account?.name || "Unknown account"}</span>
                      <span>•</span>
                      <span>{trade.setupType.replace("_", " ")}</span>
                      <span>•</span>
                      <span>{new Date(trade.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-2 md:items-end">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
                        trade.status === "open"
                          ? "bg-green-500/10 text-green-300"
                          : trade.status === "pending"
                            ? "bg-blue-500/10 text-blue-300"
                            : trade.status === "closed"
                              ? "bg-slate-700 text-slate-200"
                              : trade.status === "cancelled"
                                ? "bg-yellow-500/10 text-yellow-300"
                                : "bg-red-500/10 text-red-300"
                      )}
                    >
                      {trade.status}
                    </span>
                    <div
                      className={cn(
                        "text-sm font-semibold",
                        typeof trade.pnl === "number"
                          ? trade.pnl > 0
                            ? "text-green-400"
                            : trade.pnl < 0
                              ? "text-red-400"
                              : "text-gray-400"
                          : "text-gray-400"
                      )}
                    >
                      {typeof trade.pnl === "number" ? formatCurrency(trade.pnl) : "No realized P&L"}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-5">
                  <TradeMetric label="Entry" value={trade.entryPrice.toFixed(getPricePrecision(trade.pair))} />
                  <TradeMetric label="Stop Loss" value={trade.stopLoss.toFixed(getPricePrecision(trade.pair))} />
                  <TradeMetric label="Take Profit" value={trade.takeProfit.toFixed(getPricePrecision(trade.pair))} />
                  <TradeMetric label="Lot Size" value={trade.lotSize.toFixed(2)} />
                  <TradeMetric label="AI Score" value={`${trade.aiScore}/10`} />
                </div>

                <p className="mt-4 text-sm leading-6 text-gray-400">
                  {trade.notes || trade.aiReasoning || "No additional reasoning saved for this trade."}
                </p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone = "text-white",
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/25 px-4 py-3">
      <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</div>
      <div className={cn("mt-2 text-lg font-semibold", tone)}>{value}</div>
    </div>
  );
}

function TradeMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

function DrilldownRow({
  label,
  sublabel,
  value,
  positive,
}: {
  label: string;
  sublabel: string;
  value: string;
  positive: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-white">{label}</div>
          <div className="mt-1 text-xs text-gray-500">{sublabel}</div>
        </div>
        <div className={positive ? "text-sm font-semibold text-green-400" : "text-sm font-semibold text-red-400"}>
          {value}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-white/10 bg-surface px-4 py-6 text-sm text-gray-500">
      {text}
    </div>
  );
}

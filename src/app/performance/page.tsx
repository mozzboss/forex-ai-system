"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { EndOfDayReviewCard, PerformanceDrilldown } from "@/components/trade";
import { Button, Card, CardHeader } from "@/components/ui";
import { useAccounts, useTrades } from "@/hooks";
import { formatCurrency } from "@/lib/utils";
import { Trade } from "@/types";

type WindowFilter = "30d" | "90d" | "all";

function getFilteredTrades(trades: Trade[], windowFilter: WindowFilter) {
  if (windowFilter === "all") {
    return trades;
  }

  const days = windowFilter === "30d" ? 30 : 90;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  return trades.filter((trade) => {
    const tradeDate = trade.closedAt || trade.createdAt;
    return tradeDate >= cutoff;
  });
}

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

export default function PerformancePage() {
  const { accounts, loading: accountsLoading, error: accountsError } = useAccounts();
  const { trades, loading, error, refetch } = useTrades();
  const [accountFilter, setAccountFilter] = useState("all");
  const [pairFilter, setPairFilter] = useState("all");
  const [windowFilter, setWindowFilter] = useState<WindowFilter>("90d");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const pairOptions = useMemo(
    () => Array.from(new Set(trades.map((trade) => trade.pair))).sort(),
    [trades]
  );

  const filteredTrades = useMemo(() => {
    const byAccount =
      accountFilter === "all"
        ? trades
        : trades.filter((trade) => trade.accountId === accountFilter);

    const byPair =
      pairFilter === "all"
        ? byAccount
        : byAccount.filter((trade) => trade.pair === pairFilter);

    const byPairDate = byPair.filter((trade) => {
      if (fromDate) {
        const from = new Date(fromDate);
        if ((trade.closedAt || trade.createdAt) < from) return false;
      }
      if (toDate) {
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999);
        if ((trade.closedAt || trade.createdAt) > to) return false;
      }
      return true;
    });

    return getFilteredTrades(byPairDate, windowFilter);
  }, [accountFilter, fromDate, pairFilter, toDate, trades, windowFilter]);

  const headline = useMemo(() => {
    const closedTrades = filteredTrades.filter((trade) => trade.status === "closed" && typeof trade.pnl === "number");
    const pnl = closedTrades.reduce((total, trade) => total + (trade.pnl || 0), 0);
    const winTrades = closedTrades.filter((trade) => (trade.pnl || 0) > 0);
    const lossTrades = closedTrades.filter((trade) => (trade.pnl || 0) < 0);
    const wins = winTrades.length;
    const losses = lossTrades.length;
    const avgClosed = closedTrades.length > 0 ? pnl / closedTrades.length : 0;
    const winRate = closedTrades.length > 0 ? (wins / closedTrades.length) * 100 : null;
    const avgWin = wins > 0 ? winTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) / wins : null;
    const avgLoss = losses > 0 ? lossTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) / losses : null;
    const expectancy =
      winRate !== null && avgWin !== null && avgLoss !== null
        ? (winRate / 100) * avgWin + (1 - winRate / 100) * avgLoss
        : null;

    return {
      closedTrades: closedTrades.length,
      pnl,
      wins,
      losses,
      avgClosed,
      winRate,
      avgWin,
      avgLoss,
      expectancy,
    };
  }, [filteredTrades]);

  const pairBreakdown = useMemo(() => {
    const buckets = new Map<string, { pnl: number; trades: number }>();

    for (const trade of filteredTrades) {
      if (trade.status !== "closed" || typeof trade.pnl !== "number") {
        continue;
      }

      const bucket = buckets.get(trade.pair) || { pnl: 0, trades: 0 };
      bucket.pnl += trade.pnl;
      bucket.trades += 1;
      buckets.set(trade.pair, bucket);
    }

    return Array.from(buckets.entries())
      .map(([pair, value]) => ({ pair, ...value }))
      .sort((left, right) => right.pnl - left.pnl)
      .slice(0, 5);
  }, [filteredTrades]);

  const accountBreakdown = useMemo(() => {
    const buckets = new Map<string, { pnl: number; trades: number }>();

    for (const trade of filteredTrades) {
      if (trade.status !== "closed" || typeof trade.pnl !== "number") {
        continue;
      }

      const accountName = accounts.find((account) => account.id === trade.accountId)?.name || "Unknown account";
      const bucket = buckets.get(accountName) || { pnl: 0, trades: 0 };
      bucket.pnl += trade.pnl;
      bucket.trades += 1;
      buckets.set(accountName, bucket);
    }

    return Array.from(buckets.entries())
      .map(([account, value]) => ({ account, ...value }))
      .sort((left, right) => right.pnl - left.pnl)
      .slice(0, 5);
  }, [accounts, filteredTrades]);

  const exportFilteredTrades = () => {
    downloadCsv("performance-slice.csv", [
      ["Closed At", "Pair", "Account", "Status", "P&L", "AI Score", "Reasoning"],
      ...filteredTrades.map((trade) => [
        (trade.closedAt || trade.createdAt).toISOString(),
        trade.pair,
        accounts.find((account) => account.id === trade.accountId)?.name || "Unknown account",
        trade.status,
        trade.pnl ?? "",
        trade.aiScore,
        trade.notes || trade.aiReasoning || "",
      ]),
    ]);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <section className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.12),_transparent_28%),linear-gradient(140deg,_rgba(15,23,42,1),_rgba(30,41,59,0.96))] p-5 sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-300/80">
              Performance Review
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Drill into equity, realized P&amp;L, and whether the process is actually improving.
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              This page is for review mode, not trade excitement. Use it to slow down, audit behavior, and
              decide what deserves more trust tomorrow.
            </p>
          </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="secondary" onClick={refetch} disabled={loading || accountsLoading} className="w-full sm:w-auto">
            {loading ? "Refreshing..." : "Refresh Performance"}
          </Button>
          <Button variant="secondary" onClick={exportFilteredTrades} disabled={filteredTrades.length === 0} className="w-full sm:w-auto">
            Export CSV
          </Button>
            <Link
              href="/trades"
              className="inline-flex w-full items-center justify-center rounded-lg bg-white/5 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-white/10 hover:text-white sm:w-auto"
            >
              Back to Trades
            </Link>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
          <HeadlinePill label="Closed" value={`${headline.closedTrades}`} />
          <HeadlinePill
            label="P&L"
            value={headline.closedTrades > 0 ? formatCurrency(headline.pnl) : "-"}
            tone={headline.pnl >= 0 ? "text-green-400" : "text-red-400"}
          />
          <HeadlinePill
            label="Win Rate"
            value={headline.winRate !== null ? `${headline.winRate.toFixed(1)}%` : "-"}
            tone={headline.winRate !== null && headline.winRate >= 50 ? "text-green-400" : "text-slate-300"}
          />
          <HeadlinePill label="Wins" value={`${headline.wins}`} tone="text-green-400" />
          <HeadlinePill label="Losses" value={`${headline.losses}`} tone="text-red-400" />
          <HeadlinePill
            label="Avg Win"
            value={headline.avgWin !== null ? formatCurrency(headline.avgWin) : "-"}
            tone="text-green-400"
          />
          <HeadlinePill
            label="Avg Loss"
            value={headline.avgLoss !== null ? formatCurrency(headline.avgLoss) : "-"}
            tone="text-red-400"
          />
          <HeadlinePill
            label="Expectancy"
            value={headline.expectancy !== null ? formatCurrency(headline.expectancy) : "-"}
            tone={
              headline.expectancy === null
                ? "text-slate-400"
                : headline.expectancy > 0
                  ? "text-green-400"
                  : "text-red-400"
            }
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
            <CardHeader className="mb-1">Review Scope</CardHeader>
            <p className="text-sm text-gray-400">
              Narrow performance by account, pair, and review window without changing the underlying ledger.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <label className="block">
              <span className="text-sm text-gray-400">Account</span>
              <select
                value={accountFilter}
                onChange={(event) => setAccountFilter(event.target.value)}
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
              <span className="text-sm text-gray-400">Window</span>
              <select
                value={windowFilter}
                onChange={(event) => setWindowFilter(event.target.value as WindowFilter)}
                className="mt-1 w-full rounded-lg border border-white/10 bg-surface-light px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              >
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="all">All Time</option>
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
          <CardHeader>Selected Slice</CardHeader>
          <div className="grid gap-3 sm:grid-cols-3">
            <HeadlinePill
              label="Average Closed"
              value={headline.closedTrades > 0 ? formatCurrency(headline.avgClosed) : "-"}
              tone={headline.avgClosed >= 0 ? "text-green-400" : "text-red-400"}
            />
            <HeadlinePill label="Pair Filter" value={pairFilter === "all" ? "All pairs" : pairFilter} />
            <HeadlinePill
              label="Account Filter"
              value={accountFilter === "all" ? "All accounts" : accounts.find((account) => account.id === accountFilter)?.name || "Unknown"}
            />
          </div>
        </Card>

        <Card>
          <CardHeader>Drilldowns</CardHeader>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-3">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Pairs</div>
              {pairBreakdown.length === 0 ? (
                <EmptyState text="No closed-pair breakdown yet for this slice." />
              ) : (
                pairBreakdown.map((row) => (
                  <DrilldownRow
                    key={row.pair}
                    label={row.pair}
                    sublabel={`${row.trades} closed trades`}
                    value={formatCurrency(row.pnl)}
                    positive={row.pnl >= 0}
                  />
                ))
              )}
            </div>

            <div className="space-y-3">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Accounts</div>
              {accountBreakdown.length === 0 ? (
                <EmptyState text="No closed-account breakdown yet for this slice." />
              ) : (
                accountBreakdown.map((row) => (
                  <DrilldownRow
                    key={row.account}
                    label={row.account}
                    sublabel={`${row.trades} closed trades`}
                    value={formatCurrency(row.pnl)}
                    positive={row.pnl >= 0}
                  />
                ))
              )}
            </div>
          </div>
        </Card>
      </div>

      <PerformanceDrilldown trades={filteredTrades} accounts={accounts} />

      <EndOfDayReviewCard />
    </div>
  );
}

function HeadlinePill({
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
      <div className={`mt-2 text-lg font-semibold ${tone}`}>{value}</div>
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

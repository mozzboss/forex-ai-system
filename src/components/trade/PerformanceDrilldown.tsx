"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardHeader } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import type { Trade, TradingAccount } from "@/types";

interface PerformanceDrilldownProps {
  trades: Trade[];
  accounts: TradingAccount[];
}

interface EquityPoint {
  label: string;
  cumulativePnl: number;
  realizedPnl: number;
  pair: string;
}

interface BucketPoint {
  label: string;
  pnl: number;
}

interface BreakdownPoint {
  label: string;
  pnl: number;
  trades: number;
  winRate: number;
}

function roundToCents(value: number) {
  return Math.round(value * 100) / 100;
}

function toDisplayDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function toDisplayMonth(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "2-digit",
  }).format(date);
}

function formatAxisCurrency(value: number) {
  if (Math.abs(value) >= 1000) {
    return `${value >= 0 ? "" : "-"}$${Math.round(Math.abs(value) / 1000)}k`;
  }

  return `${value >= 0 ? "" : "-"}$${Math.round(Math.abs(value))}`;
}

function getClosedDate(trade: Trade) {
  return trade.closedAt || trade.createdAt;
}

export function PerformanceDrilldown({ trades, accounts }: PerformanceDrilldownProps) {
  const closedTrades = useMemo(
    () =>
      [...trades]
        .filter((trade) => trade.status === "closed" && typeof trade.pnl === "number")
        .sort((left, right) => getClosedDate(left).getTime() - getClosedDate(right).getTime()),
    [trades]
  );

  const analytics = useMemo(() => {
    const equityCurve: EquityPoint[] = [];
    const dailyBuckets = new Map<string, BucketPoint>();
    const monthlyBuckets = new Map<string, BucketPoint>();
    const pairBuckets = new Map<string, { pnl: number; trades: number; wins: number }>();
    const accountBuckets = new Map<string, { pnl: number; trades: number; wins: number }>();

    let cumulativePnl = 0;
    let grossProfit = 0;
    let grossLoss = 0;
    let bestDay = Number.NEGATIVE_INFINITY;
    let worstDay = Number.POSITIVE_INFINITY;
    let currentWinStreak = 0;
    let currentLossStreak = 0;
    let maxWinStreak = 0;
    let maxLossStreak = 0;

    for (const trade of closedTrades) {
      const realizedPnl = roundToCents(trade.pnl || 0);
      const closedDate = getClosedDate(trade);
      const dayKey = closedDate.toISOString().slice(0, 10);
      const monthKey = `${closedDate.getFullYear()}-${closedDate.getMonth()}`;

      cumulativePnl = roundToCents(cumulativePnl + realizedPnl);

      equityCurve.push({
        label: toDisplayDate(closedDate),
        cumulativePnl,
        realizedPnl,
        pair: trade.pair,
      });

      const existingDay = dailyBuckets.get(dayKey);
      if (existingDay) {
        existingDay.pnl = roundToCents(existingDay.pnl + realizedPnl);
      } else {
        dailyBuckets.set(dayKey, {
          label: toDisplayDate(closedDate),
          pnl: realizedPnl,
        });
      }

      const existingMonth = monthlyBuckets.get(monthKey);
      if (existingMonth) {
        existingMonth.pnl = roundToCents(existingMonth.pnl + realizedPnl);
      } else {
        monthlyBuckets.set(monthKey, {
          label: toDisplayMonth(closedDate),
          pnl: realizedPnl,
        });
      }

      const pairBucket = pairBuckets.get(trade.pair);
      if (pairBucket) {
        pairBucket.pnl = roundToCents(pairBucket.pnl + realizedPnl);
        pairBucket.trades += 1;
        pairBucket.wins += realizedPnl > 0 ? 1 : 0;
      } else {
        pairBuckets.set(trade.pair, {
          pnl: realizedPnl,
          trades: 1,
          wins: realizedPnl > 0 ? 1 : 0,
        });
      }

      const accountName =
        accounts.find((account) => account.id === trade.accountId)?.name || "Unknown account";
      const accountBucket = accountBuckets.get(accountName);
      if (accountBucket) {
        accountBucket.pnl = roundToCents(accountBucket.pnl + realizedPnl);
        accountBucket.trades += 1;
        accountBucket.wins += realizedPnl > 0 ? 1 : 0;
      } else {
        accountBuckets.set(accountName, {
          pnl: realizedPnl,
          trades: 1,
          wins: realizedPnl > 0 ? 1 : 0,
        });
      }

      if (realizedPnl > 0) {
        grossProfit = roundToCents(grossProfit + realizedPnl);
        currentWinStreak += 1;
        currentLossStreak = 0;
        maxWinStreak = Math.max(maxWinStreak, currentWinStreak);
      } else if (realizedPnl < 0) {
        grossLoss = roundToCents(grossLoss + Math.abs(realizedPnl));
        currentLossStreak += 1;
        currentWinStreak = 0;
        maxLossStreak = Math.max(maxLossStreak, currentLossStreak);
      } else {
        currentWinStreak = 0;
        currentLossStreak = 0;
      }
    }

    const dailyPnl = Array.from(dailyBuckets.values());
    for (const entry of dailyPnl) {
      bestDay = Math.max(bestDay, entry.pnl);
      worstDay = Math.min(worstDay, entry.pnl);
    }

    return {
      equityCurve,
      dailyPnl,
      monthlyPnl: Array.from(monthlyBuckets.values()),
      pairBreakdown: Array.from(pairBuckets.entries())
        .map(([label, value]) => ({
          label,
          pnl: value.pnl,
          trades: value.trades,
          winRate: value.trades > 0 ? Math.round((value.wins / value.trades) * 100) : 0,
        }))
        .sort((left, right) => right.pnl - left.pnl),
      accountBreakdown: Array.from(accountBuckets.entries())
        .map(([label, value]) => ({
          label,
          pnl: value.pnl,
          trades: value.trades,
          winRate: value.trades > 0 ? Math.round((value.wins / value.trades) * 100) : 0,
        }))
        .sort((left, right) => right.pnl - left.pnl),
      netPnl: cumulativePnl,
      averageClosedPnl: closedTrades.length > 0 ? roundToCents(cumulativePnl / closedTrades.length) : 0,
      profitFactor: grossLoss > 0 ? roundToCents(grossProfit / grossLoss) : grossProfit > 0 ? grossProfit : 0,
      bestDay: Number.isFinite(bestDay) ? bestDay : 0,
      worstDay: Number.isFinite(worstDay) ? worstDay : 0,
      maxWinStreak,
      maxLossStreak,
    };
  }, [accounts, closedTrades]);

  if (closedTrades.length === 0) {
    return (
      <Card>
        <CardHeader>Performance Drill-Down</CardHeader>
        <div className="rounded-xl border border-dashed border-white/10 bg-surface px-4 py-8 text-center text-sm text-gray-500">
          Close a few trades first and this page will expand into equity, P&amp;L, and behavior diagnostics.
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>Cumulative Equity Curve</CardHeader>
          <p className="mb-4 text-sm text-gray-400">
            Closed-trade equity only. This strips out noise and shows whether the process is actually compounding.
          </p>

          <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <AnalyticsMetric
              label="Net P&L"
              value={formatCurrency(analytics.netPnl)}
              tone={analytics.netPnl >= 0 ? "text-green-400" : "text-red-400"}
            />
            <AnalyticsMetric
              label="Average Closed"
              value={formatCurrency(analytics.averageClosedPnl)}
              tone={analytics.averageClosedPnl >= 0 ? "text-green-400" : "text-red-400"}
            />
            <AnalyticsMetric label="Best Day" value={formatCurrency(analytics.bestDay)} tone="text-green-400" />
            <AnalyticsMetric label="Worst Day" value={formatCurrency(analytics.worstDay)} tone="text-red-400" />
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.equityCurve} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="performanceEquity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis
                  tickFormatter={formatAxisCurrency}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  width={56}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "0.9rem",
                  }}
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    name === "cumulativePnl" ? "Cumulative P&L" : "Realized P&L",
                  ]}
                  labelFormatter={(label, payload) => {
                    const pair = payload?.[0]?.payload?.pair;
                    return pair ? `${label} | ${pair}` : String(label);
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="cumulativePnl"
                  stroke="#22c55e"
                  strokeWidth={2.5}
                  fill="url(#performanceEquity)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader>Discipline Diagnostics</CardHeader>
          <div className="space-y-3">
            <AnalyticsMetric
              label="Profit Factor"
              value={analytics.profitFactor === 0 ? "0.00" : analytics.profitFactor.toFixed(2)}
            />
            <AnalyticsMetric label="Max Win Streak" value={`${analytics.maxWinStreak}`} tone="text-green-400" />
            <AnalyticsMetric label="Max Loss Streak" value={`${analytics.maxLossStreak}`} tone="text-red-400" />
            <AnalyticsMetric label="Closed Trades" value={`${closedTrades.length}`} />
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>Daily Realized P&amp;L</CardHeader>
          <p className="mb-4 text-sm text-gray-400">
            Use this to spot revenge trading, oversized days, and whether gains are being protected after good sessions.
          </p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.dailyPnl} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis
                  tickFormatter={formatAxisCurrency}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  width={56}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "0.9rem",
                  }}
                  formatter={(value: number) => [formatCurrency(value), "Daily P&L"]}
                />
                <Bar dataKey="pnl" radius={[8, 8, 0, 0]}>
                  {analytics.dailyPnl.map((entry) => (
                    <Cell key={entry.label} fill={entry.pnl >= 0 ? "#22c55e" : "#ef4444"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader>Monthly Realized P&amp;L</CardHeader>
          <p className="mb-4 text-sm text-gray-400">
            The larger zoom-out. This should improve because discipline improves, not because trade frequency explodes.
          </p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.monthlyPnl} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis
                  tickFormatter={formatAxisCurrency}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  width={56}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "0.9rem",
                  }}
                  formatter={(value: number) => [formatCurrency(value), "Monthly P&L"]}
                />
                <Bar dataKey="pnl" radius={[8, 8, 0, 0]}>
                  {analytics.monthlyPnl.map((entry) => (
                    <Cell key={entry.label} fill={entry.pnl >= 0 ? "#3b82f6" : "#f59e0b"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <BreakdownCard
          title="Pair Breakdown"
          description="Identifies which pairs are earning trust and which ones are draining performance."
          rows={analytics.pairBreakdown}
        />
        <BreakdownCard
          title="Account Breakdown"
          description="Shows whether funded and personal execution quality are staying aligned."
          rows={analytics.accountBreakdown}
        />
      </div>
    </div>
  );
}

function AnalyticsMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/25 px-4 py-3">
      <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</div>
      <div className={`mt-2 text-lg font-semibold ${tone || "text-white"}`}>{value}</div>
    </div>
  );
}

function BreakdownCard({
  title,
  description,
  rows,
}: {
  title: string;
  description: string;
  rows: BreakdownPoint[];
}) {
  return (
    <Card>
      <CardHeader>{title}</CardHeader>
      <p className="mb-4 text-sm text-gray-400">{description}</p>
      <div className="space-y-3">
        {rows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 bg-surface px-4 py-6 text-sm text-gray-500">
            Not enough closed trades yet.
          </div>
        ) : (
          rows.map((row) => (
            <div key={row.label} className="rounded-xl border border-white/5 bg-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-white">{row.label}</div>
                  <div className="mt-1 text-xs text-gray-500">
                    {row.trades} closed trades | {row.winRate}% win rate
                  </div>
                </div>
                <div className={row.pnl >= 0 ? "text-sm font-semibold text-green-400" : "text-sm font-semibold text-red-400"}>
                  {formatCurrency(row.pnl)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

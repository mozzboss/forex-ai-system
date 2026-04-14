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

interface TradeHistoryChartsProps {
  trades: Trade[];
  accounts: TradingAccount[];
}

interface EquityPoint {
  label: string;
  cumulativePnl: number;
  realizedPnl: number;
  pair: string;
}

interface DailyPoint {
  label: string;
  pnl: number;
}

interface AccountPoint {
  label: string;
  pnl: number;
  trades: number;
}

function toDisplayDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function roundToCents(value: number) {
  return Math.round(value * 100) / 100;
}

function formatAxisCurrency(value: number) {
  if (Math.abs(value) >= 1000) {
    return `${value >= 0 ? "" : "-"}$${Math.round(Math.abs(value) / 1000)}k`;
  }

  return `${value >= 0 ? "" : "-"}$${Math.round(Math.abs(value))}`;
}

export function TradeHistoryCharts({ trades, accounts }: TradeHistoryChartsProps) {
  const closedTrades = useMemo(
    () =>
      [...trades]
        .filter((trade) => trade.status === "closed" && typeof trade.pnl === "number")
        .sort(
          (left, right) =>
            (left.closedAt?.getTime() || left.createdAt.getTime()) -
            (right.closedAt?.getTime() || right.createdAt.getTime())
        ),
    [trades]
  );

  const analytics = useMemo(() => {
    const equityCurve: EquityPoint[] = [];
    const dailyBuckets = new Map<string, DailyPoint>();
    const accountBuckets = new Map<string, AccountPoint>();
    let cumulativePnl = 0;
    let grossProfit = 0;
    let grossLoss = 0;
    let largestWin = 0;
    let largestLoss = 0;

    for (const trade of closedTrades) {
      const realizedPnl = roundToCents(trade.pnl || 0);
      cumulativePnl = roundToCents(cumulativePnl + realizedPnl);
      const tradeDate = trade.closedAt || trade.createdAt;
      const dateKey = tradeDate.toISOString().slice(0, 10);
      const dateLabel = toDisplayDate(tradeDate);

      equityCurve.push({
        label: dateLabel,
        cumulativePnl,
        realizedPnl,
        pair: trade.pair,
      });

      const existingDay = dailyBuckets.get(dateKey);
      if (existingDay) {
        existingDay.pnl = roundToCents(existingDay.pnl + realizedPnl);
      } else {
        dailyBuckets.set(dateKey, {
          label: dateLabel,
          pnl: realizedPnl,
        });
      }

      const accountName =
        accounts.find((account) => account.id === trade.accountId)?.name || "Unknown account";
      const existingAccount = accountBuckets.get(trade.accountId);
      if (existingAccount) {
        existingAccount.pnl = roundToCents(existingAccount.pnl + realizedPnl);
        existingAccount.trades += 1;
      } else {
        accountBuckets.set(trade.accountId, {
          label: accountName,
          pnl: realizedPnl,
          trades: 1,
        });
      }

      if (realizedPnl > 0) {
        grossProfit = roundToCents(grossProfit + realizedPnl);
        largestWin = Math.max(largestWin, realizedPnl);
      }

      if (realizedPnl < 0) {
        grossLoss = roundToCents(grossLoss + Math.abs(realizedPnl));
        largestLoss = Math.min(largestLoss, realizedPnl);
      }
    }

    return {
      equityCurve,
      dailyPnl: Array.from(dailyBuckets.values()).slice(-10),
      accountPerformance: Array.from(accountBuckets.values()).sort((left, right) => right.pnl - left.pnl),
      netPnl: cumulativePnl,
      profitFactor: grossLoss > 0 ? roundToCents(grossProfit / grossLoss) : grossProfit > 0 ? grossProfit : 0,
      largestWin,
      largestLoss,
      avgClosedPnl: closedTrades.length > 0 ? roundToCents(cumulativePnl / closedTrades.length) : 0,
    };
  }, [accounts, closedTrades]);

  if (closedTrades.length === 0) {
    return (
      <Card>
        <CardHeader>Trade Analytics</CardHeader>
        <div className="rounded-xl border border-dashed border-white/10 bg-surface px-4 py-8 text-center text-sm text-gray-500">
          Close a few trades first and this page will start plotting your realized P&amp;L curve and review trends.
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <Card>
        <CardHeader>Equity Curve</CardHeader>
        <p className="mb-4 text-sm text-gray-400">
          Realized P&amp;L only. This is the cleanest view of whether execution and exits are compounding or leaking.
        </p>

        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <AnalyticsMetric
            label="Net Closed P&L"
            value={formatCurrency(analytics.netPnl)}
            tone={analytics.netPnl >= 0 ? "text-green-400" : "text-red-400"}
          />
          <AnalyticsMetric
            label="Average Closed"
            value={formatCurrency(analytics.avgClosedPnl)}
            tone={analytics.avgClosedPnl >= 0 ? "text-green-400" : "text-red-400"}
          />
          <AnalyticsMetric label="Largest Win" value={formatCurrency(analytics.largestWin)} tone="text-green-400" />
          <AnalyticsMetric label="Largest Loss" value={formatCurrency(analytics.largestLoss)} tone="text-red-400" />
        </div>

        <div className="h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics.equityCurve} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis tickFormatter={formatAxisCurrency} tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} axisLine={false} width={56} />
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
              <Area type="monotone" dataKey="cumulativePnl" stroke="#22c55e" strokeWidth={2.5} fill="url(#equityFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader>Daily Realized P&amp;L</CardHeader>
          <p className="mb-4 text-sm text-gray-400">
            A clean daily check for overtrading, revenge behavior, and whether good days are being protected.
          </p>

          <div className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.dailyPnl} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tickFormatter={formatAxisCurrency} tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} axisLine={false} width={56} />
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
          <CardHeader>Account Performance</CardHeader>
          <div className="space-y-3">
            <div className="rounded-xl border border-white/5 bg-surface px-4 py-3">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Profit Factor</div>
              <div className="mt-2 text-lg font-semibold text-white">
                {analytics.profitFactor === 0 ? "0.00" : analytics.profitFactor.toFixed(2)}
              </div>
            </div>

            {analytics.accountPerformance.map((account) => (
              <div key={account.label} className="rounded-xl border border-white/5 bg-surface p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white">{account.label}</div>
                    <div className="mt-1 text-xs text-gray-500">{account.trades} closed trades</div>
                  </div>
                  <div className={account.pnl >= 0 ? "text-sm font-semibold text-green-400" : "text-sm font-semibold text-red-400"}>
                    {formatCurrency(account.pnl)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
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

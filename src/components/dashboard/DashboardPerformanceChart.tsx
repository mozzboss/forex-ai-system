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
import type { Trade } from "@/types";

interface DashboardPerformanceChartProps {
  trades: Trade[];
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

export function DashboardPerformanceChart({ trades }: DashboardPerformanceChartProps) {
  const analytics = useMemo(() => {
    const closedTrades = [...trades]
      .filter((trade) => trade.status === "closed" && typeof trade.pnl === "number")
      .sort(
        (left, right) =>
          (left.closedAt?.getTime() || left.createdAt.getTime()) -
          (right.closedAt?.getTime() || right.createdAt.getTime())
      );

    const equityCurve: EquityPoint[] = [];
    const dailyBuckets = new Map<string, DailyPoint>();
    let cumulativePnl = 0;

    for (const trade of closedTrades) {
      const realizedPnl = roundToCents(trade.pnl || 0);
      const tradeDate = trade.closedAt || trade.createdAt;
      const bucketKey = tradeDate.toISOString().slice(0, 10);
      const label = toDisplayDate(tradeDate);

      cumulativePnl = roundToCents(cumulativePnl + realizedPnl);
      equityCurve.push({
        label,
        cumulativePnl,
        realizedPnl,
        pair: trade.pair,
      });

      const existing = dailyBuckets.get(bucketKey);
      if (existing) {
        existing.pnl = roundToCents(existing.pnl + realizedPnl);
      } else {
        dailyBuckets.set(bucketKey, {
          label,
          pnl: realizedPnl,
        });
      }
    }

    return {
      netPnl: cumulativePnl,
      equityCurve: equityCurve.slice(-12),
      dailyPnl: Array.from(dailyBuckets.values()).slice(-7),
      closedTrades: closedTrades.length,
    };
  }, [trades]);

  if (analytics.closedTrades === 0) {
    return (
      <Card>
        <CardHeader>Performance Snapshot</CardHeader>
        <div className="rounded-xl border border-dashed border-white/10 bg-surface px-4 py-8 text-center text-sm text-gray-500">
          Close a few trades and the dashboard will start plotting realized P&amp;L here.
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <Card>
        <CardHeader>Equity Snapshot</CardHeader>
        <p className="mb-4 text-sm text-gray-400">
          Realized P&amp;L only. This is the cleanest dashboard view of whether execution quality is improving.
        </p>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <Metric
            label="Net Closed P&L"
            value={formatCurrency(analytics.netPnl)}
            tone={analytics.netPnl >= 0 ? "text-green-400" : "text-red-400"}
          />
          <Metric label="Closed Trades" value={`${analytics.closedTrades}`} />
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics.equityCurve} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="dashboardEquityFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.32} />
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
                fill="url(#dashboardEquityFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <CardHeader>Daily P&amp;L</CardHeader>
        <p className="mb-4 text-sm text-gray-400">
          Quick daily pressure check for revenge trading, oversized sessions, and whether gains are being protected.
        </p>

        <div className="h-64">
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
    </div>
  );
}

function Metric({
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

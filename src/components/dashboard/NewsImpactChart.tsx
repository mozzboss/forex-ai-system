"use client";

import { useMemo } from "react";
import {
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
import type { Currency, NewsEvent } from "@/types";
import { cn } from "@/lib/utils";

interface NewsImpactChartProps {
  events: NewsEvent[];
}

interface CurrencyPressurePoint {
  currency: Currency;
  pressure: number;
  events: number;
}

function impactWeight(impact: NewsEvent["impact"]) {
  switch (impact) {
    case "high":
      return 3;
    case "medium":
      return 2;
    default:
      return 1;
  }
}

export function NewsImpactChart({ events }: NewsImpactChartProps) {
  const analytics = useMemo(() => {
    const byCurrency = new Map<Currency, CurrencyPressurePoint>();

    for (const event of events) {
      const existing = byCurrency.get(event.currency);
      if (existing) {
        existing.pressure += impactWeight(event.impact);
        existing.events += 1;
      } else {
        byCurrency.set(event.currency, {
          currency: event.currency,
          pressure: impactWeight(event.impact),
          events: 1,
        });
      }
    }

    return {
      pressure: Array.from(byCurrency.values()).sort((left, right) => right.pressure - left.pressure).slice(0, 6),
      topEvents: [...events]
        .sort((left, right) => left.time.getTime() - right.time.getTime())
        .slice(0, 5),
    };
  }, [events]);

  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>News Pressure</CardHeader>
        <div className="rounded-xl border border-dashed border-white/10 bg-surface px-4 py-8 text-center text-sm text-gray-500">
          No medium or high-impact events are currently queued for the dashboard watch window.
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
      <Card>
        <CardHeader>News Pressure Map</CardHeader>
        <p className="mb-4 text-sm text-gray-400">
          Weighted by impact and grouped by currency so we can see where the session is most likely to become unstable.
        </p>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.pressure} layout="vertical" margin={{ top: 8, right: 12, left: 8, bottom: 0 }}>
              <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis
                type="category"
                dataKey="currency"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "0.9rem",
                }}
                formatter={(value: number, _name, payload) => [
                  `${value} pressure points`,
                  `${payload?.payload?.events || 0} event(s)`,
                ]}
              />
              <Bar dataKey="pressure" radius={[0, 8, 8, 0]}>
                {analytics.pressure.map((entry) => (
                  <Cell
                    key={entry.currency}
                    fill={entry.pressure >= 5 ? "#ef4444" : entry.pressure >= 3 ? "#f59e0b" : "#3b82f6"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <CardHeader>Upcoming News</CardHeader>
        <p className="mb-4 text-sm text-gray-400">
          The next events most likely to interrupt a setup. The 30-minute high-impact buffer still applies.
        </p>
        <div className="space-y-3">
          {analytics.topEvents.map((event) => {
            const diffMin = Math.round((event.time.getTime() - Date.now()) / 60000);
            const timeLabel =
              diffMin <= 0
                ? "Now"
                : diffMin < 60
                  ? `${diffMin}m`
                  : `${Math.floor(diffMin / 60)}h ${diffMin % 60}m`;

            return (
              <div key={`${event.currency}-${event.event}-${event.time.toISOString()}`} className="rounded-xl border border-white/5 bg-surface p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white">{event.event}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <span>{event.currency}</span>
                      <span>•</span>
                      <span>{event.time.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide",
                        event.impact === "high"
                          ? "bg-red-500/10 text-red-300"
                          : event.impact === "medium"
                            ? "bg-yellow-500/10 text-yellow-300"
                            : "bg-slate-700 text-slate-300"
                      )}
                    >
                      {event.impact}
                    </div>
                    <div
                      className={cn(
                        "mt-2 text-xs font-semibold",
                        diffMin <= 30 ? "text-red-400" : diffMin <= 90 ? "text-yellow-400" : "text-slate-400"
                      )}
                    >
                      {timeLabel}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

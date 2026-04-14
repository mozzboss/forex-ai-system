"use client";

import { useEffect, useMemo, useState } from "react";

import { CandlestickChart } from "@/components/trade";
import { Card, CardHeader } from "@/components/ui";
import { getPricePrecision } from "@/config/trading";
import { buildDriverSummary, deriveMarketRead, toTimeLabel } from "@/lib/market/read";
import { MARKET_TIMEFRAMES, MarketTimeframe } from "@/lib/market/timeframes";
import { cn } from "@/lib/utils";
import type { CurrencyPair, NewsEvent } from "@/types";

export interface DashboardMarketSnapshot {
  pair: CurrencyPair;
  symbol: string;
  timeframe: MarketTimeframe;
  price: number;
  open: number;
  high: number;
  low: number;
  previousClose?: number;
  change?: number;
  percentChange?: number;
  asOf: string;
  isMarketOpen?: boolean;
  bars: Array<{
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
  }>;
  source: "twelvedata" | "fallback";
  fallback: boolean;
}

interface DashboardMarketBoardProps {
  snapshots: DashboardMarketSnapshot[];
  events: NewsEvent[];
  loading?: boolean;
  error?: string | null;
  highlightedPair?: CurrencyPair | null;
  timeframe: MarketTimeframe;
  onTimeframeChange: (timeframe: MarketTimeframe) => void;
}

export function DashboardMarketBoard({
  snapshots,
  events,
  loading = false,
  error = null,
  highlightedPair,
  timeframe,
  onTimeframeChange,
}: DashboardMarketBoardProps) {
  const [activePair, setActivePair] = useState<CurrencyPair | null>(null);

  useEffect(() => {
    if (highlightedPair && snapshots.some((snapshot) => snapshot.pair === highlightedPair)) {
      setActivePair(highlightedPair);
      return;
    }

    // Seed the first pair on initial load (use functional updater to avoid stale read)
    setActivePair((current) => (current ? current : (snapshots[0]?.pair ?? null)));
  }, [highlightedPair, snapshots]);

  const activeSnapshot = useMemo(() => {
    return snapshots.find((snapshot) => snapshot.pair === activePair) || snapshots[0] || null;
  }, [activePair, snapshots]);

  const narrative = useMemo(() => {
    if (!activeSnapshot) {
      return null;
    }

    return buildDriverSummary(activeSnapshot.pair, events);
  }, [activeSnapshot, events]);

  const marketRead = useMemo(() => {
    if (!activeSnapshot) {
      return null;
    }

    return deriveMarketRead(activeSnapshot, events);
  }, [activeSnapshot, events]);

  if (loading && snapshots.length === 0) {
    return (
      <Card>
        <CardHeader>Market Pulse</CardHeader>
        <div className="rounded-xl border border-dashed border-white/10 bg-surface px-4 py-10 text-center text-sm text-gray-500">
          Loading live snapshots and headline drivers...
        </div>
      </Card>
    );
  }

  if (!activeSnapshot) {
    return (
      <Card>
        <CardHeader>Market Pulse</CardHeader>
        <div className="rounded-xl border border-dashed border-white/10 bg-surface px-4 py-10 text-center text-sm text-gray-500">
          No market snapshots are available yet.
        </div>
      </Card>
    );
  }

  const precision = getPricePrecision(activeSnapshot.pair);

  return (
    <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <Card>
        <CardHeader>Market Pulse</CardHeader>
        <p className="mb-4 text-sm text-gray-400">
          Quick intraday structure for the dashboard watchlist. Use it for context, never as a standalone trigger.
        </p>

        <div className="mb-4 flex flex-wrap gap-2">
          {MARKET_TIMEFRAMES.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onTimeframeChange(option)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors",
                option === timeframe
                  ? "border-cyan-400/40 bg-cyan-500/15 text-cyan-200"
                  : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white"
              )}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {snapshots.map((snapshot) => (
            <button
              key={snapshot.pair}
              type="button"
              onClick={() => setActivePair(snapshot.pair)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] transition-colors",
                snapshot.pair === activeSnapshot.pair
                  ? "border-brand-400/40 bg-brand-500/15 text-brand-200"
                  : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white"
              )}
            >
              {snapshot.pair}
              {snapshot.fallback && (
                <span className="size-1.5 rounded-full bg-yellow-400 opacity-80" title="Synthetic data" />
              )}
            </button>
          ))}
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <SnapshotMetric label="Price" value={activeSnapshot.price.toFixed(precision)} />
          <SnapshotMetric label="Open" value={activeSnapshot.open.toFixed(precision)} />
          <SnapshotMetric label="High" value={activeSnapshot.high.toFixed(precision)} />
          <SnapshotMetric label="Low" value={activeSnapshot.low.toFixed(precision)} />
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-gray-500">
          <span
            className={cn(
              "font-semibold",
              (activeSnapshot.change || 0) >= 0 ? "text-green-400" : "text-red-400"
            )}
          >
            {typeof activeSnapshot.change === "number"
              ? `${activeSnapshot.change.toFixed(precision)} (${activeSnapshot.percentChange || 0}%)`
              : "Change unavailable"}
          </span>
          <span>As of {new Date(activeSnapshot.asOf).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          {activeSnapshot.fallback ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-yellow-400">
              Synthetic data — live feed unavailable
            </span>
          ) : (
            <span>Live provider feed</span>
          )}
        </div>

        <CandlestickChart
          pair={activeSnapshot.pair}
          bars={activeSnapshot.bars}
          timeframe={activeSnapshot.timeframe}
          showSessions
          showLiquiditySweeps
        />
      </Card>

      <Card>
        <CardHeader>What Could Move {activeSnapshot.pair}</CardHeader>
        <p className="mb-4 text-sm text-gray-400">
          This keeps the calendar actionable: what can support the instrument, what can pressure it, and which releases matter next.
        </p>

        {error ? (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        <div className="space-y-4">
          {marketRead ? (
            <div className="grid gap-3 sm:grid-cols-3">
              <SummaryPill
                label="Current Lean"
                value={marketRead.lean}
                tone={
                  marketRead.lean === "bullish"
                    ? "text-green-300"
                    : marketRead.lean === "bearish"
                      ? "text-red-300"
                      : "text-slate-200"
                }
              />
              <SummaryPill
                label="Caution Level"
                value={marketRead.caution}
                tone={
                  marketRead.caution === "high"
                    ? "text-red-300"
                    : marketRead.caution === "medium"
                      ? "text-yellow-300"
                      : "text-green-300"
                }
              />
              <SummaryPill
                label="Next Risk"
                value={marketRead.nextEvent ? toTimeLabel(marketRead.nextEvent.time) : "Clear"}
                tone="text-slate-200"
              />
            </div>
          ) : null}

          {marketRead ? (
            <div className="rounded-2xl border border-white/10 bg-slate-950/25 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Live Read
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-300">{marketRead.summary}</p>
              <p className="mt-3 text-sm leading-6 text-slate-400">{marketRead.cautionReason}</p>
            </div>
          ) : null}

          <DriverBlock
            title="Could Push It Up"
            tone="green"
            items={narrative?.up || []}
          />
          <DriverBlock
            title="Could Push It Down"
            tone="red"
            items={narrative?.down || []}
          />

          <div className="rounded-2xl border border-white/10 bg-slate-950/25 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              News To Respect
            </div>
            <div className="mt-3 space-y-3">
              {(narrative?.relevantEvents.length || 0) > 0 ? (
                narrative?.relevantEvents.map((event) => (
                  <div key={`${event.currency}-${event.event}-${event.time.toISOString()}`} className="rounded-xl border border-white/5 bg-surface px-3 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-white">{event.event}</div>
                        <div className="mt-1 text-xs text-gray-500">
                          {event.currency} • {event.time.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={cn(
                            "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide",
                            event.impact === "high"
                              ? "bg-red-500/10 text-red-300"
                              : "bg-yellow-500/10 text-yellow-300"
                          )}
                        >
                          {event.impact}
                        </div>
                        <div className="mt-2 text-xs font-semibold text-slate-400">{toTimeLabel(event.time)}</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-white/10 bg-surface px-4 py-6 text-sm text-gray-500">
                  No direct medium or high-impact releases are queued for this instrument right now. Stay patient and keep the normal news buffer anyway.
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function SnapshotMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/25 px-4 py-3">
      <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</div>
      <div className="mt-2 text-lg font-semibold text-white">{value}</div>
    </div>
  );
}

function DriverBlock({
  title,
  tone,
  items,
}: {
  title: string;
  tone: "green" | "red";
  items: string[];
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/25 p-4">
      <div
        className={cn(
          "text-xs font-semibold uppercase tracking-[0.2em]",
          tone === "green" ? "text-green-300" : "text-red-300"
        )}
      >
        {title}
      </div>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div key={item} className="rounded-xl border border-white/5 bg-surface px-3 py-3 text-sm leading-6 text-gray-300">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/25 px-4 py-3">
      <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</div>
      <div className={cn("mt-2 text-lg font-semibold capitalize", tone)}>{value}</div>
    </div>
  );
}

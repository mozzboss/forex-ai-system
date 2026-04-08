"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  ActiveSetups,
  CurrencyStrength,
  DashboardMarketBoard,
  DashboardPerformanceChart,
  DailyPlanCard,
  DailyStats,
  NewsImpactChart,
  NewsCountdown,
  SetupHeatmap,
  SessionClock,
} from "@/components/dashboard";
import { MissedZonesPanel, TradeManager } from "@/components/trade";
import { Button, Card, CardHeader, DecisionPanel, StatusBadge } from "@/components/ui";
import { TRADING_CONFIG, getAccountRules } from "@/config/trading";
import { useAccounts, useAuth, useTrackedPairs } from "@/hooks";
import { MarketTimeframe } from "@/lib/market/timeframes";
import { cn, formatCurrency, formatPercent, getBiasColor, isWithinSession } from "@/lib/utils";
import type {
  Bias,
  Currency,
  CurrencyPair,
  EntryStatus,
  NewsEvent,
  Trade,
  TradingAccount,
} from "@/types";
import type { DashboardMarketSnapshot } from "@/components/dashboard/DashboardMarketBoard";

interface HeatmapEntry {
  pair: CurrencyPair;
  score: number;
  bias: Bias;
}

interface ActiveSetupCard {
  pair: CurrencyPair;
  direction: "LONG" | "SHORT";
  setupType: Trade["setupType"];
  entryZone: { low: number; high: number };
  stopLoss: number;
  takeProfit: number;
  confirmation: string;
  invalidation: string;
  higherTimeframe: "H4";
  lowerTimeframe: "M15";
  entryStatus: EntryStatus;
  score: number;
}

interface DashboardDecisionState {
  mode: "trade_now" | "wait" | "exit_now";
  reason: string;
  action: string;
  details: string[];
}

function deserializeTrade(trade: Trade): Trade {
  return {
    ...trade,
    createdAt: new Date(trade.createdAt),
    openedAt: trade.openedAt ? new Date(trade.openedAt) : undefined,
    closedAt: trade.closedAt ? new Date(trade.closedAt) : undefined,
  };
}

function deserializeNewsEvent(event: NewsEvent): NewsEvent {
  return {
    ...event,
    time: new Date(event.time),
  };
}

function startOfToday(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function uniquePairs(pairs: CurrencyPair[]) {
  return Array.from(new Set(pairs));
}

function getSessionSnapshot(now: Date) {
  if (isWithinSession(TRADING_CONFIG.sessions.overlapLonNy, now)) {
    return {
      label: "London / New York Overlap",
      detail: "Highest liquidity window. Best for disciplined execution.",
      tone: "text-green-400",
    };
  }

  if (isWithinSession(TRADING_CONFIG.sessions.london, now)) {
    return {
      label: "London Session",
      detail: "Primary session. Cleanest structure for planned entries.",
      tone: "text-blue-400",
    };
  }

  if (isWithinSession(TRADING_CONFIG.sessions.newYork, now)) {
    return {
      label: "New York Session",
      detail: "Focus on continuation or news-driven momentum only.",
      tone: "text-cyan-400",
    };
  }

  return {
    label: "Asia Session",
    detail: "Lower conviction environment. Stay selective.",
    tone: "text-yellow-400",
  };
}

function getCurrenciesFromPair(pair: CurrencyPair) {
  if (pair === "XAUUSD") {
    return {
      base: null,
      quote: "USD" as Currency,
    };
  }

  return {
    base: pair.slice(0, 3) as Currency,
    quote: pair.slice(3, 6) as Currency,
  };
}

function deriveCurrencyStrength(trades: Trade[]) {
  const totals = {
    USD: 0,
    EUR: 0,
    GBP: 0,
    JPY: 0,
    CHF: 0,
    AUD: 0,
    NZD: 0,
    CAD: 0,
  } satisfies Record<Currency, number>;

  const activeTrades = trades.filter((trade) => trade.status === "pending" || trade.status === "open");
  for (const trade of activeTrades) {
    const weight = clamp(trade.aiScore || 5, 1, 10);
    const { base, quote } = getCurrenciesFromPair(trade.pair);

    if (!base) {
      continue;
    }

    if (trade.direction === "LONG") {
      totals[base] += weight;
      totals[quote] -= weight;
    } else {
      totals[base] -= weight;
      totals[quote] += weight;
    }
  }

  const maxMagnitude = Math.max(...Object.values(totals).map((value) => Math.abs(value)), 1);

  return Object.fromEntries(
    Object.entries(totals).map(([currency, value]) => [
      currency,
      Math.round((value / maxMagnitude) * 10),
    ])
  ) as Record<Currency, number>;
}

function buildHeatmap(trades: Trade[], newsEvents: NewsEvent[], trackedPairs: CurrencyPair[]) {
  const activeTradeByPair = new Map<CurrencyPair, Trade>();
  for (const trade of trades) {
    const existing = activeTradeByPair.get(trade.pair);
    if (!existing || trade.aiScore > existing.aiScore) {
      activeTradeByPair.set(trade.pair, trade);
    }
  }

  return uniquePairs([...trackedPairs, ...Array.from(activeTradeByPair.keys())]).map((pair) => {
    const trade = activeTradeByPair.get(pair);
    if (trade) {
      return {
        pair,
        score: clamp(trade.aiScore || 5, 1, 10),
        bias: trade.direction === "LONG" ? "bullish" : "bearish",
      } satisfies HeatmapEntry;
    }

    const pairCurrencies = [pair.slice(0, 3), pair.slice(3, 6)];
    const nearbyHighImpact = newsEvents.some((event) => {
      const minutesAway = Math.round((event.time.getTime() - Date.now()) / 60000);
      return event.impact === "high" && minutesAway >= 0 && minutesAway <= 90 && pairCurrencies.includes(event.currency);
    });

    return {
      pair,
      score: nearbyHighImpact ? 4 : 5,
      bias: "neutral",
    } satisfies HeatmapEntry;
  });
}

function buildActiveSetups(trades: Trade[]): ActiveSetupCard[] {
  return trades
    .filter((trade) => trade.status === "pending" || trade.status === "open")
    .slice(0, 6)
    .map((trade) => ({
      pair: trade.pair,
      direction: trade.direction,
      setupType: trade.setupType,
      entryZone: {
        low: trade.entryPrice,
        high: trade.entryPrice, // single recorded price — zone display uses this as the level
      },
      stopLoss: trade.stopLoss,
      takeProfit: trade.takeProfit,
      confirmation: trade.entryStatus === "CONFIRMED" ? "All required conditions met." : "Wait for full confirmation.",
      invalidation: "Cancel if structure breaks or risk rules change.",
      higherTimeframe: "H4",
      lowerTimeframe: "M15",
      entryStatus: trade.entryStatus,
      score: clamp(trade.aiScore || 5, 1, 10),
    }));
}

function deriveDisciplineScore(accounts: TradingAccount[], trades: Trade[], newsEvents: NewsEvent[]) {
  let score = 10;

  for (const account of accounts) {
    const rules = getAccountRules(account.mode);
    const tradeUsage = account.maxTradesPerDay > 0
      ? account.currentDailyTrades / account.maxTradesPerDay
      : 0;
    const lossUsage = account.maxDailyLoss > 0
      ? account.currentDailyLoss / account.maxDailyLoss
      : 0;

    if (tradeUsage >= 1) score -= 3;
    else if (tradeUsage >= 0.75) score -= 1.5;

    if (lossUsage >= 0.8) score -= 3;
    else if (lossUsage >= 0.5) score -= 1.5;

    if (account.lossesInARow >= rules.stopAfterConsecutiveLosses) {
      score -= 2.5;
    }
  }

  const deniedToday = trades.filter(
    (trade) =>
      trade.status === "denied" &&
      trade.createdAt >= startOfToday(new Date())
  ).length;
  score -= Math.min(deniedToday * 0.25, 1);

  const newsTooCloseWithExposure = newsEvents.some((event) => {
    const minutesAway = Math.round((event.time.getTime() - Date.now()) / 60000);
    return event.impact === "high" && minutesAway >= 0 && minutesAway <= 30;
  }) && trades.some((trade) => trade.status === "pending" || trade.status === "open");

  if (newsTooCloseWithExposure) {
    score -= 1;
  }

  return Math.round(clamp(score, 1, 10));
}

function deriveDashboardDecisionState({
  trades,
  newsEvents,
  bestTrade,
  disciplineScore,
}: {
  trades: Trade[];
  newsEvents: NewsEvent[];
  bestTrade?: Trade;
  disciplineScore: number;
}): DashboardDecisionState {
  const activeExposure = trades.filter((trade) => trade.status === "pending" || trade.status === "open");
  const invalidExposure = activeExposure.find((trade) => trade.entryStatus === "INVALID");
  const highImpactSoon = newsEvents.find((event) => {
    const minutesAway = Math.round((event.time.getTime() - Date.now()) / 60000);
    return event.impact === "high" && minutesAway >= 0 && minutesAway <= 30;
  });

  if (invalidExposure) {
    return {
      mode: "exit_now",
      reason: `${invalidExposure.pair} is still in active exposure but the recorded setup status is INVALID. Protect capital before looking for anything new.`,
      action: "Close or cancel the invalid setup immediately and review why it stayed live.",
      details: [
        `${invalidExposure.pair} ${invalidExposure.direction} is no longer valid.`,
        "Do not replace a broken trade with a new impulsive one.",
      ],
    };
  }

  if (activeExposure.length > 0 && highImpactSoon) {
    return {
      mode: "exit_now",
      reason: `You have live exposure with high-impact ${highImpactSoon.currency} news coming inside the 30-minute buffer.`,
      action: "Reduce, close, or protect open risk before the release.",
      details: [
        `${highImpactSoon.event} is due at ${highImpactSoon.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.`,
        `${activeExposure.length} open or pending trade${activeExposure.length === 1 ? "" : "s"} currently exposed.`,
      ],
    };
  }

  if (
    bestTrade &&
    bestTrade.entryStatus === "CONFIRMED" &&
    bestTrade.aiScore >= 8 &&
    !highImpactSoon &&
    disciplineScore >= 6
  ) {
    return {
      mode: "trade_now",
      reason: `${bestTrade.pair} is the clearest live candidate on the board and it is already marked CONFIRMED.`,
      action: `Focus only on ${bestTrade.pair} and execute only if the price still matches plan.`,
      details: [
        `AI score ${bestTrade.aiScore}/10 with ${bestTrade.direction.toLowerCase()} bias.`,
        "No high-impact event is inside the immediate buffer window.",
      ],
    };
  }

  return {
    mode: "wait",
    reason: "Nothing on the board currently deserves immediate execution more than patience.",
    action: "Wait for a CONFIRMED setup or protect existing exposure instead of forcing a trade.",
    details: [
      highImpactSoon
        ? `${highImpactSoon.event} is close enough to keep us defensive.`
        : "Stay selective until the next setup becomes CONFIRMED.",
      `Current discipline score: ${disciplineScore}/10.`,
    ],
  };
}

export default function DashboardPage() {
  const { authFetch, user } = useAuth();
  const { accounts, loading: accountsLoading, error: accountError, refetch } = useAccounts();
  const {
    trackedPairs,
    loading: trackedPairsLoading,
    error: trackedPairsError,
    refetch: refetchTrackedPairs,
    saving: trackedPairsSaving,
    saveTrackedPairs,
  } = useTrackedPairs();
  const [density, setDensity] = useState<"cozy" | "compact">("cozy");
  const [trades, setTrades] = useState<Trade[]>([]);
  const [newsEvents, setNewsEvents] = useState<NewsEvent[]>([]);
  const [marketSnapshots, setMarketSnapshots] = useState<DashboardMarketSnapshot[]>([]);
  const [marketTimeframe, setMarketTimeframe] = useState<MarketTimeframe>("15min");
  const [pageError, setPageError] = useState<string | null>(null);
  const [marketError, setMarketError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch trades + news — reruns only when user changes (not on timeframe toggle)
  const refreshTradesAndNews = useCallback(async () => {
    if (!user) {
      setTrades([]);
      setNewsEvents([]);
      setPageError(null);
      return;
    }

    setRefreshing(true);
    try {
      const [tradeRes, newsRes] = await Promise.all([
        authFetch("/api/trade"),
        authFetch("/api/news"),
      ]);

      if (!tradeRes.ok || !newsRes.ok) {
        throw new Error("Failed to load dashboard data");
      }

      const [tradeData, newsData] = await Promise.all([tradeRes.json(), newsRes.json()]);
      setTrades((tradeData.trades || []).map(deserializeTrade));
      setNewsEvents((newsData.events || []).map(deserializeNewsEvent));
      setPageError(null);
    } catch (error) {
      console.error(error);
      setPageError("Failed to load dashboard context. Keep protecting capital until the system refreshes.");
    } finally {
      setRefreshing(false);
    }
  }, [authFetch, user]);

  // Fetch market snapshots — reruns when timeframe changes (no trade/news reload)
  const dashboardPairs = useMemo(
    () =>
      uniquePairs([
        ...trackedPairs,
        ...trades
          .filter((trade) => trade.status === "pending" || trade.status === "open")
          .map((trade) => trade.pair),
      ]),
    [trackedPairs, trades]
  );

  const refreshMarketSnapshots = useCallback(async () => {
    if (!user) {
      setMarketSnapshots([]);
      setMarketError(null);
      return;
    }

    if (dashboardPairs.length === 0) {
      setMarketSnapshots([]);
      setMarketError(null);
      return;
    }

    const marketResults = await Promise.allSettled(
      dashboardPairs.map(async (pair) => {
        const snapshotUrl = `/api/market?pair=${pair}&timeframe=${marketTimeframe}`;
        const response = await authFetch(snapshotUrl);
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || `Failed to load ${pair} snapshot.`);
        return payload.snapshot as DashboardMarketSnapshot;
      })
    );

    const successfulSnapshots = marketResults
      .filter((result): result is PromiseFulfilledResult<DashboardMarketSnapshot> => result.status === "fulfilled")
      .map((result) => result.value);

    setMarketSnapshots(successfulSnapshots);
    setMarketError(
      successfulSnapshots.length === 0
        ? "Market snapshots are unavailable right now. News context is still live."
        : null
    );
  }, [authFetch, dashboardPairs, marketTimeframe, user]);

  const refreshDashboard = useCallback(async () => {
    await Promise.all([refreshTradesAndNews(), refreshMarketSnapshots()]);
  }, [refreshMarketSnapshots, refreshTradesAndNews]);

  useEffect(() => {
    refreshTradesAndNews();
  }, [refreshTradesAndNews]);

  useEffect(() => {
    refreshMarketSnapshots();
  }, [refreshMarketSnapshots]);

  const refreshAll = async () => {
    await Promise.all([refetch(), refetchTrackedPairs(), refreshDashboard()]);
  };

  const activeAccounts = useMemo(
    () => accounts.filter((account) => account.isActive),
    [accounts]
  );

  const accountCapacity = useMemo(
    () => activeAccounts.reduce((total, account) => total + account.maxTradesPerDay, 0),
    [activeAccounts]
  );

  const stats = useMemo(() => {
    const todayStart = startOfToday(new Date());
    const todayTrades = trades.filter((trade) => trade.createdAt >= todayStart);
    const executedTrades = todayTrades.filter(
      (trade) => trade.status !== "denied" && trade.status !== "cancelled"
    );
    const closedTrades = todayTrades.filter(
      (trade) => trade.status === "closed" && typeof trade.pnl === "number"
    );
    const wins = closedTrades.filter((trade) => (trade.pnl || 0) > 0).length;
    const winRate = closedTrades.length > 0
      ? Math.round((wins / closedTrades.length) * 100)
      : 0;
    const pnl = closedTrades.reduce((total, trade) => total + (trade.pnl || 0), 0);

    return {
      tradesCount: executedTrades.length,
      winRate,
      pnl,
      disciplineScore: deriveDisciplineScore(activeAccounts, trades, newsEvents),
    };
  }, [activeAccounts, newsEvents, trades]);

  const currencyStrength = useMemo(() => deriveCurrencyStrength(trades), [trades]);
  const heatmap = useMemo(
    () => buildHeatmap(trades, newsEvents, trackedPairs),
    [newsEvents, trackedPairs, trades]
  );
  const activeSetups = useMemo(() => buildActiveSetups(trades), [trades]);
  const confirmedPairs = useMemo(
    () => new Set(activeSetups.filter((s) => s.entryStatus === "CONFIRMED").map((s) => s.pair)),
    [activeSetups]
  );

  const bestTrade = useMemo(() => {
    return [...trades]
      .filter((trade) => trade.status === "open" || trade.status === "pending")
      .sort((a, b) => b.aiScore - a.aiScore)[0];
  }, [trades]);

  const session = getSessionSnapshot(new Date());
  const upcomingHighImpact = newsEvents.filter((event) => {
    const minutesAway = (event.time.getTime() - Date.now()) / 60_000;
    return event.impact === "high" && minutesAway >= 0 && minutesAway <= 1440;
  });
  const dashboardDecision = useMemo(
    () =>
      deriveDashboardDecisionState({
        trades,
        newsEvents,
        bestTrade,
        disciplineScore: stats.disciplineScore,
      }),
    [bestTrade, newsEvents, stats.disciplineScore, trades]
  );

  return (
    <div className={cn("min-h-screen p-4 sm:p-6", density === "compact" ? "space-y-3" : "space-y-5")}>

      {/* ── ROW 1: Header bar ── */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">Forex AI System</div>
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">Trading Dashboard</h1>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
            <span className={cn("h-2 w-2 rounded-full", session.tone.replace("text-", "bg-"))} />
            <span className="font-semibold tracking-wide">{session.label}</span>
            <span className="text-[11px] text-slate-500">{session.detail}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex rounded-lg border border-white/10 bg-white/5 p-1 text-xs text-gray-400">
            <button
              className={cn(
                "rounded-md px-2 py-1 transition",
                density === "cozy" ? "bg-white/10 text-white" : "hover:bg-white/10"
              )}
              onClick={() => setDensity("cozy")}
            >
              Cozy
            </button>
            <button
              className={cn(
                "rounded-md px-2 py-1 transition",
                density === "compact" ? "bg-white/10 text-white" : "hover:bg-white/10"
              )}
              onClick={() => setDensity("compact")}
            >
              Compact
            </button>
          </div>
          <Button variant="secondary" onClick={refreshAll} disabled={accountsLoading || refreshing} className="text-sm">
            {refreshing ? "Refreshing…" : "Refresh"}
          </Button>
          <Link
            href="/pairs"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500/15 px-4 py-2 text-sm font-medium text-brand-300 transition-colors hover:bg-brand-500/25"
          >
            Pair Workspace →
          </Link>
        </div>
      </header>

      {accountError || trackedPairsError || pageError ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {accountError || trackedPairsError || pageError}
        </div>
      ) : null}
      <StatusRail
        items={[
          {
            label: "Accounts",
            state: accountsLoading ? "syncing" : accountError ? "alert" : accounts.length > 0 ? "ok" : "muted",
            detail: accountError || `${accounts.length} loaded`,
          },
          {
            label: "Pairs",
            state: trackedPairsLoading ? "syncing" : trackedPairsError ? "alert" : trackedPairs.length > 0 ? "ok" : "muted",
            detail: trackedPairsError || `${trackedPairs.length} tracked`,
          },
          {
            label: "Market",
            state: refreshing ? "syncing" : marketError ? "alert" : marketSnapshots.length > 0 ? "ok" : "muted",
            detail: marketError || `${marketSnapshots.length} snapshots`,
          },
          {
            label: "News",
            state: refreshing ? "syncing" : newsEvents.length > 0 ? "ok" : "muted",
            detail: `${newsEvents.length} events`,
          },
        ]}
      />

      {/* ── ROW 2: Decision + Session Clock + KPIs ── */}
      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <DecisionPanel
            title="Right Now"
            mode={dashboardDecision.mode}
            reason={dashboardDecision.reason}
            action={dashboardDecision.action}
            details={dashboardDecision.details}
            stickyMobile
          />

          {/* KPI strip */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <KpiCard
              label="Active Accounts"
              value={activeAccounts.length.toString()}
              sub={`${accountCapacity} trade slots`}
              color="text-blue-400"
            />
            <KpiCard
              label="Today's P&L"
              value={formatCurrency(stats.pnl)}
              sub={`${stats.tradesCount} trades`}
              color={stats.pnl >= 0 ? "text-green-400" : "text-red-400"}
            />
            <KpiCard
              label="News Events"
              value={upcomingHighImpact.length.toString()}
              sub="high-impact next 24h"
              color={upcomingHighImpact.length > 0 ? "text-yellow-400" : "text-slate-400"}
            />
            <KpiCard
              label="Discipline"
              value={`${stats.disciplineScore}/10`}
              sub="today's score"
              color={stats.disciplineScore >= 7 ? "text-green-400" : stats.disciplineScore >= 5 ? "text-yellow-400" : "text-red-400"}
            />
          </div>
        </div>

        <SessionClock />
      </div>

      <MissedZonesPanel />

      {/* ── ROW 3: Market board (full width) ── */}
      <div className="relative">
        {refreshing ? (
          <div className="pointer-events-none absolute inset-0 z-10 rounded-2xl border border-white/5 bg-surface/60 backdrop-blur-sm" />
        ) : null}
        <DashboardMarketBoard
          snapshots={marketSnapshots}
          events={newsEvents}
          loading={refreshing}
          error={marketError}
          highlightedPair={bestTrade?.pair || null}
          timeframe={marketTimeframe}
          onTimeframeChange={setMarketTimeframe}
        />
      </div>

      {/* ── ROW 4: Heatmap + News countdown ── */}
      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>Setup Heatmap</CardHeader>
          <p className="mb-4 text-xs text-gray-500">
            Active pairs surface first. News-heavy pairs stay muted until conditions improve.
          </p>
          <SetupHeatmap data={heatmap} confirmedPairs={confirmedPairs} />
        </Card>

        <div className="space-y-4">
          <PairsChipCard
            pairs={trackedPairs}
            loading={trackedPairsLoading}
            saving={trackedPairsSaving}
            onAdd={async (pair) => {
              const next = uniquePairs([...trackedPairs, pair]);
              await saveTrackedPairs(next);
            }}
            onRemove={async (pair) => {
              const next = trackedPairs.filter((p) => p !== pair);
              await saveTrackedPairs(next);
            }}
          />
          <Card>
            <CardHeader>News Countdown</CardHeader>
            <NewsCountdown events={newsEvents.slice(0, 5)} />
          </Card>
          <Card>
            <CardHeader>Currency Tilt</CardHeader>
            <p className="mb-3 text-xs text-gray-500">
              Derived from open exposure. Use as posture check, not a trigger.
            </p>
            <CurrencyStrength data={currencyStrength} />
          </Card>
        </div>
      </div>

      {/* ── ROW 5: Accounts + Best trade ── */}
      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span>Account Guardrails</span>
              <RiskStrip accounts={activeAccounts} />
            </div>
          </CardHeader>
          <div className="space-y-3">
            {activeAccounts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-sm text-gray-500">
                No active accounts. Add one in Settings.
              </div>
            ) : (
              activeAccounts.map((account) => {
                const rules = getAccountRules(account.mode);
                const dailyLossUsage = account.maxDailyLoss > 0
                  ? (account.currentDailyLoss / account.maxDailyLoss) * 100
                  : 0;
                return (
                  <div key={account.id} className="rounded-xl border border-white/5 bg-slate-950/30 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-semibold text-white">{account.name}</div>
                        <div className="mt-0.5 text-[11px] uppercase tracking-wide text-gray-500">{account.mode}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] text-gray-500">Balance</div>
                        <div className="text-sm font-bold text-white">{formatCurrency(account.balance)}</div>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <GuardrailPill
                        label="Trades"
                        value={`${account.currentDailyTrades}/${rules.maxTradesPerDay}`}
                        danger={account.currentDailyTrades >= rules.maxTradesPerDay}
                      />
                      <GuardrailPill
                        label="Loss"
                        value={`${formatCurrency(account.currentDailyLoss)}`}
                        danger={dailyLossUsage >= 80}
                      />
                      <GuardrailPill
                        label="Streak"
                        value={`${account.lossesInARow}/${rules.stopAfterConsecutiveLosses}`}
                        danger={account.lossesInARow >= rules.stopAfterConsecutiveLosses}
                      />
                    </div>
                    <div className="mt-3">
                      <div className="mb-1 flex justify-between text-[10px] text-gray-600">
                        <span>Daily loss {Math.round(dailyLossUsage)}%</span>
                        <span>{formatCurrency(account.maxDailyLoss)} limit</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                        <div
                          className={cn("h-full rounded-full transition-all duration-500",
                            dailyLossUsage >= 80 ? "bg-red-500" : dailyLossUsage >= 50 ? "bg-yellow-500" : "bg-green-500"
                          )}
                          style={{ width: `${clamp(dailyLossUsage, 0, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        <div className="space-y-4">
        <Card>
          <CardHeader>Best Trade on the Board</CardHeader>
          {bestTrade ? (
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-lg font-bold text-white">{bestTrade.pair}</div>
                  <div className={cn("text-sm font-medium", getBiasColor(bestTrade.direction === "LONG" ? "bullish" : "bearish"))}>
                    {bestTrade.direction} · {bestTrade.setupType.replace("_", " ")}
                  </div>
                </div>
                <div className="rounded-xl bg-white/5 px-3 py-2 text-center">
                  <div className="text-[10px] text-gray-500">Score</div>
                  <div className="text-lg font-bold text-white">{bestTrade.aiScore}/10</div>
                </div>
              </div>
              <StatusBadge status={bestTrade.entryStatus} size="sm" showAction />
              <p className="text-sm leading-6 text-gray-400">
                {bestTrade.aiReasoning || "Re-run analysis for updated reasoning."}
              </p>
              <div className="flex flex-wrap gap-2 text-sm">
                <Link href={`/pairs/${bestTrade.pair}`} className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-brand-300 hover:text-brand-200">
                  Open workspace →
                </Link>
                <Button variant="secondary" size="sm" onClick={refreshAll}>
                  Refresh AI
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-sm text-gray-500">
              No trades on the board yet. Run pair analysis to surface setups.
            </div>
          )}
        </Card>

        <Card>
          <CardHeader>Active Setups</CardHeader>
          {activeSetups.length > 0 ? (
            <ActiveSetups setups={activeSetups} />
          ) : (
            <div className="rounded-xl border border-dashed border-white/10 bg-surface/60 px-4 py-5 text-sm text-slate-500">
              No active setups. Run analysis on your tracked pairs to populate this panel.
            </div>
          )}
        </Card>
        </div>
      </div>

      {/* ── ROW 6: Daily plan + Performance ── */}
      <div className="grid gap-4 xl:grid-cols-2">
        <DailyPlanCard />
        <DashboardPerformanceChart trades={trades} />
      </div>

      {/* ── ROW 7: News impact + Trade manager ── */}
      <NewsImpactChart events={newsEvents} />

      <TradeManager
        trades={trades}
        accounts={accounts}
        refreshing={refreshing}
        onRefresh={refreshAll}
      />
    </div>
  );
}

function KpiCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-slate-950/30 px-4 py-3">
      <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500">{label}</div>
      <div className={cn("mt-1.5 text-xl font-bold", color)}>{value}</div>
      <div className="mt-0.5 text-[11px] text-slate-500">{sub}</div>
    </div>
  );
}

function GuardrailPill({ label, value, danger }: { label: string; value: string; danger: boolean }) {
  return (
    <div className={cn("rounded-lg px-2 py-1.5 text-center", danger ? "bg-red-500/10 border border-red-500/20" : "bg-white/5")}>
      <div className="text-[10px] uppercase tracking-wide text-gray-500">{label}</div>
      <div className={cn("mt-0.5 text-xs font-semibold", danger ? "text-red-400" : "text-white")}>{value}</div>
    </div>
  );
}

function StatusRail({
  items,
}: {
  items: { label: string; state: "ok" | "syncing" | "alert" | "muted"; detail: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium",
            item.state === "ok" && "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
            item.state === "syncing" && "border-sky-500/30 bg-sky-500/10 text-sky-200",
            item.state === "alert" && "border-red-500/30 bg-red-500/10 text-red-200",
            item.state === "muted" && "border-white/10 bg-white/5 text-gray-400"
          )}
        >
          <div className="h-2.5 w-2.5 rounded-full bg-current" />
          <div>
            <div className="uppercase tracking-wide">{item.label}</div>
            <div className="text-[11px] text-white/70">{item.detail}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function RiskStrip({ accounts }: { accounts: TradingAccount[] }) {
  const snapshot = useMemo(() => {
    if (accounts.length === 0) return null;
    const totalEquity = accounts.reduce((sum, account) => sum + account.equity, 0);
    const openRisk = accounts.reduce(
      (sum, account) =>
        sum + (account.openTrades || []).reduce((inner, trade) => inner + (trade.riskAmount || 0), 0),
      0
    );
    const dailyLoss = accounts.reduce((sum, account) => sum + account.currentDailyLoss, 0);
    const maxDailyLoss = accounts.reduce((sum, account) => sum + account.maxDailyLoss, 0);
    return {
      openRiskPct: totalEquity ? Math.round((openRisk / totalEquity) * 1000) / 10 : 0,
      dailyLossUsage: maxDailyLoss ? Math.round((dailyLoss / maxDailyLoss) * 100) : 0,
    };
  }, [accounts]);

  if (!snapshot) return null;

  return (
    <div className="flex items-center gap-2 text-xs text-gray-400">
      <span>Open risk</span>
      <div className="h-2 w-28 overflow-hidden rounded-full bg-white/10">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            snapshot.openRiskPct >= 1 ? "bg-amber-400" : "bg-emerald-400"
          )}
          style={{ width: `${clamp(snapshot.openRiskPct, 0, 100)}%` }}
        />
      </div>
      <span className={snapshot.openRiskPct >= 1 ? "text-amber-200" : "text-emerald-200"}>
        {snapshot.openRiskPct}% risk · {snapshot.dailyLossUsage}% daily loss
      </span>
    </div>
  );
}

const ALL_PAIRS: CurrencyPair[] = ["EURUSD", "GBPUSD", "USDJPY", "USDCHF", "AUDUSD", "NZDUSD", "USDCAD", "XAUUSD"];

function PairsChipCard({
  pairs,
  loading,
  saving,
  onAdd,
  onRemove,
}: {
  pairs: CurrencyPair[];
  loading: boolean;
  saving: boolean;
  onAdd: (pair: CurrencyPair) => void | Promise<void>;
  onRemove: (pair: CurrencyPair) => void | Promise<void>;
}) {
  const [candidate, setCandidate] = useState<CurrencyPair>("EURUSD");
  const addDisabled = pairs.includes(candidate) || saving;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <span>Tracked Pairs</span>
          <span className="text-xs text-gray-500">{loading ? "Loading…" : `${pairs.length}/8`}</span>
        </div>
      </CardHeader>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {pairs.length === 0 ? (
            <div className="text-xs text-gray-500">No pairs yet. Add one below.</div>
          ) : (
            pairs.map((pair) => (
              <button
                key={pair}
                className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white hover:border-white/30"
                onClick={() => onRemove(pair)}
                disabled={saving}
              >
                {pair}
                <span className="text-xs text-gray-400 group-hover:text-red-300">×</span>
              </button>
            ))
          )}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select
            className="flex-1 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white"
            value={candidate}
            onChange={(e) => setCandidate(e.target.value as CurrencyPair)}
            disabled={saving}
          >
            {ALL_PAIRS.map((pair) => (
              <option key={pair} value={pair}>
                {pair}
              </option>
            ))}
          </select>
          <Button onClick={() => onAdd(candidate)} disabled={addDisabled}>
            {saving ? "Saving…" : addDisabled ? "Added" : "Add pair"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

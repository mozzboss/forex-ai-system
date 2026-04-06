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
} from "@/components/dashboard";
import { TradeManager } from "@/components/trade";
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
  } = useTrackedPairs();
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

  const bestTrade = useMemo(() => {
    return [...trades]
      .filter((trade) => trade.status === "open" || trade.status === "pending")
      .sort((a, b) => b.aiScore - a.aiScore)[0];
  }, [trades]);

  const session = getSessionSnapshot(new Date());
  const upcomingHighImpact = newsEvents.filter((event) => event.impact === "high");
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
    <div className="space-y-6 p-4 sm:p-6">
      <section className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.2),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(34,197,94,0.12),_transparent_30%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.95))] p-5 sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-300/80">
              Discipline Dashboard
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Stay selective, protect capital, and only act when the setup earns it.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
              This dashboard reflects current account pressure, open trade exposure, and nearby news
              so we can slow down bad decisions before they become expensive ones.
            </p>
          </div>

          <div className="flex flex-col gap-3 xl:min-w-[320px]">
            <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Current Session</div>
              <div className={cn("mt-2 text-lg font-semibold", session.tone)}>{session.label}</div>
              <p className="mt-2 text-sm text-slate-300">{session.detail}</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="secondary" onClick={refreshAll} disabled={accountsLoading || refreshing} className="w-full sm:w-auto">
                {refreshing ? "Refreshing..." : "Refresh Dashboard"}
              </Button>
              <Link
                href="/pairs"
                className="inline-flex w-full items-center justify-center rounded-lg bg-white/5 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-white/10 hover:text-white sm:w-auto"
              >
                Open Pair Workspace
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricPill
            label="Active Accounts"
            value={activeAccounts.length.toString()}
            detail={`${accountCapacity} total trade slots available today`}
          />
          <MetricPill
            label="High-Impact Events"
            value={upcomingHighImpact.length.toString()}
            detail="30-minute buffer still applies before every planned trade"
          />
          <MetricPill
            label="Tracked Pairs"
            value={trackedPairsLoading ? "..." : dashboardPairs.length.toString()}
            detail="personal universe feeding the dashboard and planning flow"
          />
          <MetricPill
            label="Execution Rule"
            value="CONFIRMED Only"
            detail="WAIT and READY are preparation states, never entry signals"
          />
        </div>
      </section>

      {accountError || trackedPairsError || pageError ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {accountError || trackedPairsError || pageError}
        </div>
      ) : null}

      <DecisionPanel
        title="Right Now"
        mode={dashboardDecision.mode}
        reason={dashboardDecision.reason}
        action={dashboardDecision.action}
        details={dashboardDecision.details}
        stickyMobile
      />

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>Currency Tilt</CardHeader>
          <p className="mb-4 text-sm text-gray-400">
            Derived from current open and pending exposure, not a live market feed. Use it as a
            posture check, not a trade trigger.
          </p>
          <CurrencyStrength data={currencyStrength} />
        </Card>

        <Card>
          <CardHeader>News Countdown</CardHeader>
          <p className="mb-4 text-sm text-gray-400">
            High-impact events close to the entry window should slow us down immediately.
          </p>
          <NewsCountdown events={newsEvents.slice(0, 5)} />
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>Setup Heatmap</CardHeader>
          <p className="mb-4 text-sm text-gray-400">
            Scores reflect current system posture. Active trade pairs surface first, while news-heavy
            pairs stay muted until conditions improve.
          </p>
          <SetupHeatmap data={heatmap} />
        </Card>

        <Card>
          <CardHeader>Daily Stats</CardHeader>
          <p className="mb-4 text-sm text-gray-400">
            Performance matters, but discipline score tracks whether we stayed inside the rules.
          </p>
          <DailyStats
            tradesCount={stats.tradesCount}
            winRate={stats.winRate}
            pnl={stats.pnl}
            disciplineScore={stats.disciplineScore}
          />
        </Card>
      </div>

      <DashboardMarketBoard
        snapshots={marketSnapshots}
        events={newsEvents}
        loading={refreshing}
        error={marketError}
        highlightedPair={bestTrade?.pair || null}
        timeframe={marketTimeframe}
        onTimeframeChange={setMarketTimeframe}
      />

      <DailyPlanCard />

      <NewsImpactChart events={newsEvents} />

      <DashboardPerformanceChart trades={trades} />

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>Active Setups</CardHeader>
          <p className="mb-4 text-sm text-gray-400">
            Only open and pending trades appear here. Anything not fully confirmed stays in observation mode.
          </p>
          <ActiveSetups setups={activeSetups} />
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>Account Guardrails</CardHeader>
            <div className="space-y-3">
              {activeAccounts.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 bg-surface px-4 py-6 text-sm text-gray-500">
                  No active accounts yet. Add or activate an account in settings before planning trades.
                </div>
              ) : (
                activeAccounts.map((account) => {
                  const rules = getAccountRules(account.mode);
                  const dailyLossUsage = account.maxDailyLoss > 0
                    ? (account.currentDailyLoss / account.maxDailyLoss) * 100
                    : 0;

                  return (
                    <div key={account.id} className="rounded-xl border border-white/5 bg-surface p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="text-sm font-semibold text-white">{account.name}</div>
                          <div className="mt-1 text-xs uppercase tracking-wide text-gray-500">
                            {account.mode} account
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">Risk / trade</div>
                          <div className="text-sm font-semibold text-white">
                            {formatPercent(account.riskPercent)}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <AccountMetric label="Balance" value={formatCurrency(account.balance)} />
                        <AccountMetric
                          label="Trades Today"
                          value={`${account.currentDailyTrades}/${rules.maxTradesPerDay}`}
                        />
                        <AccountMetric
                          label="Daily Loss"
                          value={`${formatCurrency(account.currentDailyLoss)} / ${formatCurrency(account.maxDailyLoss)}`}
                        />
                        <AccountMetric
                          label="Loss Streak"
                          value={`${account.lossesInARow}/${rules.stopAfterConsecutiveLosses}`}
                        />
                      </div>

                      <div className="mt-4">
                        <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
                          <span>Daily loss usage</span>
                          <span>{Math.round(dailyLossUsage)}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-surface-light">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all",
                              dailyLossUsage >= 80
                                ? "bg-red-500"
                                : dailyLossUsage >= 50
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
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

          <Card>
            <CardHeader>Best Trade on the Board</CardHeader>
            {bestTrade ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-bold text-white">{bestTrade.pair}</div>
                    <div className={cn("text-sm font-medium", getBiasColor(bestTrade.direction === "LONG" ? "bullish" : "bearish"))}>
                      {bestTrade.direction} {bestTrade.setupType.replace("_", " ")}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">AI Score</div>
                    <div className="text-lg font-bold text-white">{bestTrade.aiScore}/10</div>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <StatusBadge status={bestTrade.entryStatus} size="sm" showAction />
                  <Link href={`/pairs/${bestTrade.pair}`} className="text-sm text-brand-400 hover:text-brand-300">
                    Open workspace
                  </Link>
                </div>

                <p className="text-sm leading-6 text-gray-300">
                  {bestTrade.aiReasoning || "No detailed reasoning captured yet. Re-run the pair analysis before acting."}
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-white/10 bg-surface px-4 py-6 text-sm text-gray-500">
                No trade deserves top billing yet. That is fine. "No trade" is still disciplined behavior.
              </div>
            )}
          </Card>
        </div>
      </div>

      <TradeManager
        trades={trades}
        accounts={accounts}
        refreshing={refreshing}
        onRefresh={refreshAll}
      />
    </div>
  );
}

function MetricPill({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/25 px-4 py-3">
      <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</div>
      <div className="mt-2 text-lg font-semibold text-white">{value}</div>
      <div className="mt-1 text-sm text-slate-400">{detail}</div>
    </div>
  );
}

function AccountMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

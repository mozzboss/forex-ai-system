"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button, Card, CardHeader, EntryStatusCard, StatusBadge } from "@/components/ui";
import { ALL_PAIRS } from "@/config/trading";
import { useAuth } from "@/hooks";
import { cn, getBiasColor, formatTime } from "@/lib/utils";
import { useTimezone } from "@/components/shared/TimezoneProvider";
import type { Currency, CurrencyPair, NewsAnalysisResult, NewsEvent } from "@/types";

function formatPrice(value: number) {
  return value.toFixed(value >= 10 ? 3 : 5);
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 7 ? "bg-green-500" : score >= 5 ? "bg-yellow-500" : "bg-red-500";
  const textColor = score >= 7 ? "text-green-400" : score >= 5 ? "text-yellow-400" : "text-red-400";
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 rounded-full bg-white/5">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${score * 10}%` }} />
      </div>
      <span className={cn("text-sm font-bold tabular-nums", textColor)}>{score}/10</span>
    </div>
  );
}

function DecisionBadge({ decision }: { decision: string }) {
  const styles: Record<string, string> = {
    TAKE_TRADE: "border-green-500/30 bg-green-500/10 text-green-400",
    WAIT: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
    DENY: "border-red-500/30 bg-red-500/10 text-red-400",
  };
  return (
    <span className={cn("rounded-lg border px-3 py-1 text-sm font-bold tracking-wide", styles[decision] ?? styles.WAIT)}>
      {decision.replace("_", " ")}
    </span>
  );
}

function ConfidenceBadge({ confidence }: { confidence: string }) {
  const styles: Record<string, string> = { high: "text-green-400", medium: "text-yellow-400", low: "text-slate-400" };
  return (
    <span className={cn("text-xs font-semibold uppercase tracking-wider", styles[confidence] ?? styles.low)}>
      {confidence}
    </span>
  );
}

function ImpactChip({ impact }: { impact: NewsEvent["impact"] }) {
  const map: Record<NewsEvent["impact"], { bg: string; text: string; label: string }> = {
    high: { bg: "bg-red-500/15", text: "text-red-300", label: "HIGH" },
    medium: { bg: "bg-amber-500/15", text: "text-amber-200", label: "MED" },
    low: { bg: "bg-slate-500/15", text: "text-slate-300", label: "LOW" },
  };
  const tone = map[impact];
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide", tone.bg, tone.text)}>
      {tone.label}
    </span>
  );
}

function RiskRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</span>
      <span className="text-sm leading-5 text-slate-300">{value}</span>
    </div>
  );
}

function InsightBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-slate-950/30 px-4 py-3">
      <div className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <p className="text-sm leading-5 text-slate-300">{value}</p>
    </div>
  );
}

function formatEventTime(date: Date, timezone: string) {
  return formatTime(date, timezone);
}

function timeUntil(date: Date) {
  const diffMs = date.getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / 60000);
  if (diffMinutes <= 0) return "now";
  if (diffMinutes < 60) return `${diffMinutes}m`;
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}

const ANALYSIS_STEPS = [
  "Reading headline...",
  "Identifying impact currencies...",
  "Assessing entry status...",
  "Building trade signal...",
];

interface AutoMarketBrief {
  tone: "high" | "medium" | "low";
  headline: string;
  bullets: string[];
  watchPairs: CurrencyPair[];
}

function impactWeight(impact: NewsEvent["impact"]) {
  if (impact === "high") return 3;
  if (impact === "medium") return 2;
  return 1;
}

function pairIncludesCurrency(pair: CurrencyPair, currency: Currency) {
  if (pair === "XAUUSD") {
    return currency === "USD";
  }

  return pair.slice(0, 3) === currency || pair.slice(3, 6) === currency;
}

function buildAutoMarketBrief(events: NewsEvent[]): AutoMarketBrief {
  const now = Date.now();
  const upcoming = events
    .filter((event) => event.time.getTime() >= now)
    .sort((left, right) => left.time.getTime() - right.time.getTime());

  if (upcoming.length === 0) {
    return {
      tone: "low",
      headline: "No major calendar shock in the current window",
      bullets: [
        "No upcoming medium/high events are currently returned by the connected providers.",
        "Use this quiet window to prep levels, tighten watchlists, and avoid forcing entries.",
        "Keep headline risk in mind even when the economic calendar is light.",
      ],
      watchPairs: [],
    };
  }

  const highEvents = upcoming.filter((event) => event.impact === "high");
  const mediumEvents = upcoming.filter((event) => event.impact === "medium");
  const nextEvent = upcoming[0];
  const nextHigh = highEvents[0];

  const currencyScores = new Map<Currency, { score: number; high: number; medium: number }>();
  for (const event of upcoming.slice(0, 12)) {
    const entry = currencyScores.get(event.currency) || { score: 0, high: 0, medium: 0 };
    entry.score += impactWeight(event.impact);
    if (event.impact === "high") entry.high += 1;
    if (event.impact === "medium") entry.medium += 1;
    currencyScores.set(event.currency, entry);
  }

  const rankedCurrencies = [...currencyScores.entries()]
    .sort((left, right) => right[1].score - left[1].score)
    .map(([currency]) => currency);

  const primaryCurrency = rankedCurrencies[0];
  const watchPairs = ALL_PAIRS
    .filter((pair) => rankedCurrencies.slice(0, 2).some((currency) => pairIncludesCurrency(pair, currency)))
    .slice(0, 4);

  const nextHighMinutes = nextHigh
    ? Math.max(0, Math.round((nextHigh.time.getTime() - now) / 60000))
    : null;
  const tone: AutoMarketBrief["tone"] =
    highEvents.length >= 3 || (nextHighMinutes !== null && nextHighMinutes <= 90)
      ? "high"
      : highEvents.length > 0 || mediumEvents.length >= 3
        ? "medium"
        : "low";

  const headline =
    tone === "high"
      ? "Event-driven tape: protect entries around release windows"
      : tone === "medium"
        ? "Moderate calendar pressure: clean setups still possible"
        : "Lighter calendar: structure can lead if discipline stays high";

  const bullets = [
    primaryCurrency
      ? `${primaryCurrency} currently carries the heaviest scheduled event load in the next window.`
      : "No single currency dominates the current event map.",
    nextHigh
      ? `${nextHigh.currency} ${nextHigh.event} is the next high-impact release (${timeUntil(nextHigh.time)}).`
      : `${nextEvent.currency} ${nextEvent.event} is next (${timeUntil(nextEvent.time)}), but no high-impact release is queued yet.`,
    watchPairs.length > 0
      ? `Focus watchlist: ${watchPairs.join(", ")}.`
      : "Keep watchlist tight and prioritize pairs with clean structure.",
    tone === "high"
      ? "Execution plan: wait for the spike, then trade only confirmed follow-through."
      : "Execution plan: no chasing candles, only take entries that remain confirmed after news checks.",
  ];

  return { tone, headline, bullets, watchPairs };
}

export default function NewsAnalysisPage() {
  const { authFetch } = useAuth();
  const { timezone } = useTimezone();
  const [headline, setHeadline] = useState("");
  const [summary, setSummary] = useState("");
  const [pair, setPair] = useState<CurrencyPair | "">("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [sendTelegram, setSendTelegram] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<NewsAnalysisResult | null>(null);
  const [newsEvents, setNewsEvents] = useState<NewsEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [eventsLastUpdated, setEventsLastUpdated] = useState<Date | null>(null);
  const [eventsSource, setEventsSource] = useState<string | null>(null);
  const [refreshingEvents, setRefreshingEvents] = useState(false);
  const stepInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const loadEvents = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshingEvents(true);
    else setEventsLoading(true);
    setEventsError(null);
    try {
      const res = await authFetch("/api/news?limit=8");
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load news calendar.");
      const parsed = (data.events || []).map((event: NewsEvent) => ({
        ...event,
        time: new Date(event.time),
      }));
      setNewsEvents(parsed);
      setEventsLastUpdated(new Date());
      setEventsSource(data.source || null);
    } catch (err) {
      setNewsEvents([]);
      setEventsError(err instanceof Error ? err.message : "Could not load calendar.");
      setEventsSource(null);
    } finally {
      setEventsLoading(false);
      setRefreshingEvents(false);
    }
  }, [authFetch]);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") loadEvents(true);
    }, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadEvents]);

  const autoBrief = useMemo(() => buildAutoMarketBrief(newsEvents), [newsEvents]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline.trim()) return;
    setLoading(true);
    setLoadingStep(0);
    setError(null);
    setResult(null);

    stepInterval.current = setInterval(() => {
      setLoadingStep((s) => Math.min(s + 1, ANALYSIS_STEPS.length - 1));
    }, 900);

    try {
      const res = await authFetch("/api/news-analysis", {
        method: "POST",
        body: JSON.stringify({
          headline: headline.trim(),
          summary: summary.trim(),
          pair: pair || undefined,
          currentPrice: currentPrice ? parseFloat(currentPrice) : undefined,
          sendTelegram,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data?.error || "Analysis failed."); return; }
      setResult(data.result);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch {
      setError("Request failed. Check your connection.");
    } finally {
      if (stepInterval.current) clearInterval(stepInterval.current);
      setLoading(false);
    }
  };

  const handleReset = () => {
    setHeadline("");
    setSummary("");
    setPair("");
    setCurrentPrice("");
    setResult(null);
    setError(null);
  };

  const prefillFromEvent = (event: NewsEvent, enableTelegram = false) => {
    const headlineText = `${event.currency} ${event.event} (${event.impact.toUpperCase()}) – ${formatEventTime(event.time, timezone)}`;
    const summaryText = [
      `Impact: ${event.impact.toUpperCase()}`,
      event.forecast ? `Forecast: ${event.forecast}` : null,
      event.previous ? `Previous: ${event.previous}` : null,
      `Arrives in ${timeUntil(event.time)}.`,
    ].filter(Boolean).join(" Â· ");
    setHeadline(headlineText);
    setSummary(summaryText);
    setSendTelegram(enableTelegram || sendTelegram);
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Hero */}
      <section className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.15),_transparent_35%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.96))] p-5 sm:p-6">
        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-300/80">
          News Signal
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Paste a headline. Get a structured trading signal.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
          Converts breaking news into bias, entry status, and trade idea â€” using the same
          WAIT / READY / CONFIRMED / INVALID framework as the pair analysis engine.
          The auto brief below refreshes from live calendar events, so you can check conditions without typing first.
          A news headline alone is never CONFIRMED. Always verify on the chart.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.6fr]">
        {/* Left: form + upcoming events */}
        <div className="space-y-4">
          <Card className={cn(
            autoBrief.tone === "high"
              ? "border-red-500/25 bg-red-500/[0.05]"
              : autoBrief.tone === "medium"
                ? "border-amber-500/25 bg-amber-500/[0.04]"
                : "border-emerald-500/25 bg-emerald-500/[0.04]"
          )}>
            <div className="flex items-start justify-between gap-3">
              <CardHeader className="mb-0">Today&apos;s Market Brief (auto)</CardHeader>
              <div className="text-right text-[11px] text-slate-500">
                <div>{eventsSource ? `Source: ${eventsSource}` : "Source: unavailable"}</div>
                <div>{eventsLastUpdated ? `Updated ${formatTime(eventsLastUpdated, timezone)} ${timezone}` : "Waiting for feed"}</div>
              </div>
            </div>

            <div className="mt-3 space-y-3">
              <div className="rounded-xl border border-white/10 bg-slate-950/35 px-4 py-3">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Regime</div>
                <div className={cn(
                  "mt-1.5 text-sm font-semibold",
                  autoBrief.tone === "high"
                    ? "text-red-300"
                    : autoBrief.tone === "medium"
                      ? "text-amber-200"
                      : "text-emerald-300"
                )}>
                  {autoBrief.headline}
                </div>
              </div>

              <div className="space-y-2">
                {autoBrief.bullets.map((bullet) => (
                  <div key={bullet} className="rounded-xl border border-white/5 bg-slate-950/25 px-3 py-2.5 text-sm text-slate-300">
                    {bullet}
                  </div>
                ))}
              </div>

              {autoBrief.watchPairs.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {autoBrief.watchPairs.map((pairItem) => (
                    <span key={pairItem} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-300">
                      {pairItem}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-1">
              <CardHeader className="mb-0">News Input</CardHeader>
              {(headline || result) && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-slate-500 transition-colors hover:text-slate-300"
                >
                  Clear
                </button>
              )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 mt-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 mb-1.5">
                  Headline <span className="text-red-400">*</span>
                </label>
                <input
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. US CPI comes in hotter than expected at 3.5%"
                  className="w-full rounded-xl border border-white/10 bg-surface px-3 py-2.5 text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 mb-1.5">
                  Summary <span className="text-slate-600">(optional â€” improves accuracy)</span>
                </label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Paste the article body or any additional context..."
                  className="h-24 w-full rounded-xl border border-white/10 bg-surface px-3 py-2.5 text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 mb-1.5">
                    Pair <span className="text-slate-600">(optional)</span>
                  </label>
                  <select
                    value={pair}
                    onChange={(e) => setPair(e.target.value as CurrencyPair | "")}
                    className="w-full rounded-xl border border-white/10 bg-surface px-3 py-2.5 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  >
                    <option value="">Auto-detect</option>
                    {ALL_PAIRS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 mb-1.5">
                    Price <span className="text-slate-600">(unlocks levels)</span>
                  </label>
                  <input
                    value={currentPrice}
                    onChange={(e) => setCurrentPrice(e.target.value)}
                    placeholder="e.g. 1.0850"
                    type="number"
                    step="any"
                    min="0"
                    className="w-full rounded-xl border border-white/10 bg-surface px-3 py-2.5 text-sm font-mono text-gray-300 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-slate-950/30 px-4 py-3">
                <input
                  id="send-telegram"
                  type="checkbox"
                  checked={sendTelegram}
                  onChange={(e) => setSendTelegram(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-surface text-brand-500"
                />
                <label htmlFor="send-telegram" className="text-sm text-slate-300 cursor-pointer">
                  Send signal to Telegram
                </label>
              </div>

              <Button type="submit" disabled={loading || !headline.trim()} className="w-full">
                {loading ? "Analyzing..." : "Analyze News"}
              </Button>
            </form>
          </Card>

          {/* Upcoming events */}
          <Card>
            <div className="flex items-center justify-between">
              <CardHeader className="mb-0">Upcoming Events</CardHeader>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => loadEvents(true)}
                disabled={eventsLoading || refreshingEvents}
              >
                {refreshingEvents ? "Refreshing..." : "Refresh"}
              </Button>
            </div>

            <div className="mt-3">
              {eventsLoading ? (
                <div className="space-y-2 py-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-14 animate-pulse rounded-xl border border-white/5 bg-white/[0.02]" />
                  ))}
                </div>
              ) : eventsError ? (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {eventsError}
                </div>
              ) : newsEvents.length === 0 ? (
                <p className="text-sm text-slate-500">No upcoming events found.</p>
              ) : (
                <div className="space-y-2">
                  {newsEvents.map((event) => (
                    <div
                      key={`${event.time.toISOString()}-${event.event}`}
                      className="rounded-xl border border-white/5 bg-slate-950/30 px-4 py-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold text-white truncate">
                              {event.currency} Â· {event.event}
                            </span>
                            <ImpactChip impact={event.impact} />
                          </div>
                          <div className="mt-0.5 text-xs text-slate-500">
                            {formatEventTime(event.time, timezone)} {timezone} · in {timeUntil(event.time)}
                            {(event.forecast || event.previous) && (
                              <span className="text-slate-600">
                                {" "}Â· {event.forecast ? `F: ${event.forecast}` : "F: n/a"} Â· {event.previous ? `P: ${event.previous}` : "P: n/a"}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex shrink-0 flex-col gap-1.5">
                          <Button size="sm" variant="secondary" onClick={() => prefillFromEvent(event, false)}>
                            Analyze
                          </Button>
                          <Button size="sm" onClick={() => prefillFromEvent(event, true)}>
                            + Telegram
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {eventsLastUpdated && (
                    <p className="text-[11px] text-slate-600">
                      {eventsSource ? `${eventsSource} · ` : ""}Updated {formatTime(eventsLastUpdated, timezone)} {timezone}
                    </p>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right: results */}
        <div ref={resultsRef} className="space-y-4">
          {error ? (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          ) : null}

          {loading ? (
            <Card>
              <CardHeader>Analyzing</CardHeader>
              <div className="space-y-3 py-2">
                {ANALYSIS_STEPS.map((step, i) => (
                  <div key={i} className={cn("flex items-center gap-3 text-sm transition-colors duration-300", i <= loadingStep ? "text-slate-300" : "text-slate-600")}>
                    {i < loadingStep ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" className="text-green-400 shrink-0">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    ) : i === loadingStep ? (
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400 shrink-0" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-white/10 shrink-0" />
                    )}
                    {step}
                  </div>
                ))}
              </div>
            </Card>
          ) : null}

          {result && !loading ? (
            <>
              {/* Final Decision â€” first so you see the verdict immediately */}
              <Card className={cn(
                "border",
                result.finalDecision.decision === "TAKE_TRADE"
                  ? "border-green-500/25 bg-green-500/5"
                  : result.finalDecision.decision === "DENY"
                    ? "border-red-500/20 bg-red-500/5"
                    : "border-yellow-500/20 bg-yellow-500/5"
              )}>
                <div className="flex items-start justify-between gap-3">
                  <CardHeader className="mb-0">Decision</CardHeader>
                  <div className="text-[11px] text-slate-500">
                    {formatTime(new Date(result.analyzedAt), timezone)} {timezone}
                    {result.pair ? ` · ${result.pair}` : ""}
                  </div>
                </div>
                <div className="mt-3 space-y-3">
                  <ScoreBar score={result.finalDecision.score} />
                  <div className="flex items-center gap-3">
                    <DecisionBadge decision={result.finalDecision.decision} />
                    <StatusBadge status={result.entryStatus} size="sm" />
                  </div>
                  <p className="text-sm leading-6 text-slate-300">{result.finalDecision.reasoning}</p>
                </div>
              </Card>

              {/* News Summary */}
              <Card>
                <CardHeader>News Summary</CardHeader>
                <p className="text-sm leading-6 text-slate-300">{result.newsSummary}</p>
              </Card>

              {/* Market Impact */}
              <Card>
                <CardHeader>Market Impact</CardHeader>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3">
                    <div className="text-xs uppercase tracking-[0.2em] text-green-500/70">Stronger</div>
                    <div className="mt-1.5 text-lg font-bold text-green-400">{result.marketImpact.strongerCurrency}</div>
                  </div>
                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
                    <div className="text-xs uppercase tracking-[0.2em] text-red-500/70">Weaker</div>
                    <div className="mt-1.5 text-lg font-bold text-red-400">{result.marketImpact.weakerCurrency}</div>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-400">{result.marketImpact.reasoning}</p>
              </Card>

              {/* Trading Bias */}
              <Card>
                <CardHeader>Trading Bias</CardHeader>
                <div className="flex flex-wrap items-center gap-4">
                  {result.tradingBias.pair ? (
                    <span className="text-sm font-bold text-white">{result.tradingBias.pair}</span>
                  ) : (
                    <span className="text-sm text-slate-500">Pair not pinpointed</span>
                  )}
                  <span className={cn("text-sm font-semibold uppercase", getBiasColor(result.tradingBias.bias))}>
                    {result.tradingBias.bias}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    Confidence: <ConfidenceBadge confidence={result.tradingBias.confidence} />
                  </div>
                </div>
              </Card>

              {/* Entry Status */}
              <EntryStatusCard
                status={result.entryStatus}
                reason={result.entryStatusReason}
                whatMustHappenNext={result.proInsight.waitForConfirmation}
              />

              {/* Trade Idea */}
              {result.tradeIdea ? (
                <Card>
                  <CardHeader>Trade Idea</CardHeader>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "rounded px-2 py-0.5 text-sm font-bold uppercase",
                        result.tradeIdea.direction === "LONG" ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"
                      )}>
                        {result.tradeIdea.direction === "LONG" ? "BUY" : "SELL"}
                      </span>
                      {result.tradingBias.pair && (
                        <span className="text-sm text-slate-400">{result.tradingBias.pair}</span>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div className="rounded-lg border border-white/5 bg-slate-950/30 px-3 py-2.5">
                        <div className="text-slate-500">Entry Zone</div>
                        <div className="mt-1 font-mono font-medium text-white">
                          {formatPrice(result.tradeIdea.entryZoneLow)} â€“ {formatPrice(result.tradeIdea.entryZoneHigh)}
                        </div>
                      </div>
                      <div className="rounded-lg border border-white/5 bg-slate-950/30 px-3 py-2.5">
                        <div className="text-slate-500">Stop Loss</div>
                        <div className="mt-1 font-mono font-medium text-red-400">{formatPrice(result.tradeIdea.stopLoss)}</div>
                      </div>
                      <div className="rounded-lg border border-white/5 bg-slate-950/30 px-3 py-2.5">
                        <div className="text-slate-500">Take Profit</div>
                        <div className="mt-1 font-mono font-medium text-green-400">{formatPrice(result.tradeIdea.takeProfit)}</div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600">
                      Based on current price context. Verify on chart before executing.
                    </p>
                  </div>
                </Card>
              ) : result.entryStatus !== "INVALID" ? (
                <div className="rounded-xl border border-dashed border-white/10 bg-surface px-4 py-5 text-center text-sm text-slate-500">
                  No trade levels â€” add a current price to unlock entry zone, SL, and TP.
                </div>
              ) : null}

              {/* Risk Notes */}
              <Card>
                <CardHeader>Risk Notes</CardHeader>
                <div className="space-y-3">
                  <RiskRow label="Upcoming news" value={result.riskNotes.upcomingNews} />
                  <RiskRow label="Fakeout risk" value={result.riskNotes.fakeoutRisk} />
                  <RiskRow label="Volatility" value={result.riskNotes.volatilityWarning} />
                </div>
              </Card>

              {/* Pro Insight */}
              <Card>
                <CardHeader>Pro Insight</CardHeader>
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <InsightBlock label="Short-term view" value={result.proInsight.shortTermView} />
                    <InsightBlock label="Long-term view" value={result.proInsight.longTermView} />
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-slate-950/30 px-4 py-3">
                    <span className="text-xs text-slate-500">Already priced in?</span>
                    <span className={cn("text-xs font-semibold", result.proInsight.pricedIn ? "text-yellow-400" : "text-green-400")}>
                      {result.proInsight.pricedIn ? "Likely yes â€” expect fades" : "Probably not â€” momentum possible"}
                    </span>
                  </div>
                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Wait for</div>
                    <p className="text-sm leading-6 text-slate-300">{result.proInsight.waitForConfirmation}</p>
                  </div>
                </div>
              </Card>
            </>
          ) : null}

          {!result && !loading && !error ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-surface/50 px-6 py-16 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="text-slate-500">
                  <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-400">Signal will appear here</p>
              <p className="mt-1 text-xs text-slate-600">
                Paste a headline on the left, or pick an upcoming event to pre-fill the form.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

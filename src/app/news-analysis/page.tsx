"use client";

import { useCallback, useEffect, useState } from "react";

import { Button, Card, CardHeader, EntryStatusCard, StatusBadge } from "@/components/ui";
import { ALL_PAIRS } from "@/config/trading";
import { useAuth } from "@/hooks";
import { cn, getBiasColor } from "@/lib/utils";
import type { CurrencyPair, NewsAnalysisResult, NewsEvent } from "@/types";

function formatPrice(value: number) {
  return value.toFixed(value >= 10 ? 3 : 5);
}

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 7 ? "bg-green-500" : score >= 5 ? "bg-yellow-500" : "bg-red-500";
  const textColor =
    score >= 7 ? "text-green-400" : score >= 5 ? "text-yellow-400" : "text-red-400";
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 rounded-full bg-white/5">
        <div
          className={cn("h-full rounded-full transition-all", color)}
          style={{ width: `${score * 10}%` }}
        />
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
  const styles: Record<string, string> = {
    high: "text-green-400",
    medium: "text-yellow-400",
    low: "text-slate-400",
  };
  return (
    <span className={cn("text-xs font-semibold uppercase tracking-wider", styles[confidence] ?? styles.low)}>
      {confidence}
    </span>
  );
}

export default function NewsAnalysisPage() {
  const { authFetch } = useAuth();
  const [headline, setHeadline] = useState("");
  const [summary, setSummary] = useState("");
  const [pair, setPair] = useState<CurrencyPair | "">("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [sendTelegram, setSendTelegram] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<NewsAnalysisResult | null>(null);
  const [newsEvents, setNewsEvents] = useState<NewsEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [eventsLastUpdated, setEventsLastUpdated] = useState<Date | null>(null);
  const [eventsSource, setEventsSource] = useState<string | null>(null);
  const [refreshingEvents, setRefreshingEvents] = useState(false);

  const templates = [
    {
      label: "US–Iran ceasefire risk-on flip",
      headline: "Oil dumps under $100 after US–Iran agree two-week ceasefire; Strait of Hormuz reopening watched",
      summary:
        "Brent -12% on ceasefire headlines; path depends on compliance and shipping resuming. Inflation shock eases but risk premium still elevated. Watch USD safe-haven unwind vs JPY and gold if calm holds.",
    },
    {
      label: "USD/JPY intervention watch",
      headline: "USD/JPY grinds toward 160; MoF jawboning raises intervention odds",
      summary:
        "Yield spread still favors USD, but Japan likely to defend 160/161. Expect whipsaws around Tokyo fix; headline risk high on any MoF/BoJ wires.",
      pair: "USDJPY",
      currentPrice: "159.80",
    },
    {
      label: "EUR/USD breakout map",
      headline: "EUR/USD coiling between 1.1460 support and 1.1630 resistance ahead of US CPI",
      summary:
        "Bias slightly bearish; upside needs clean risk-on + soft CPI. Downside resumes if oil re-flare or CPI beats. Beware stop runs in range.",
      pair: "EURUSD",
      currentPrice: "1.1545",
    },
    {
      label: "GBP softness",
      headline: "GBP weak near 4‑month lows vs USD; energy shock and soft growth weigh",
      summary:
        "UK inflation still sticky; higher energy keeps real incomes tight. Cable vulnerable on USD strength and risk-off; watch 1.2300/1.2380 supports.",
      pair: "GBPUSD",
      currentPrice: "1.2430",
    },
    {
      label: "Event stack: CPI + FOMC minutes",
      headline: "US CPI Friday 8:30 ET expected hot on oil; FOMC minutes today 14:00 ET",
      summary:
        "Energy-led CPI pop risks re-pricing cuts. Minutes could show split on inflation path. Fade size into releases; expect USD and yields to lead.",
    },
  ];

  // Pull the live economic calendar so the tab is ready with one-click signals
  const loadEvents = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshingEvents(true);
    } else {
      setEventsLoading(true);
    }
    setEventsError(null);
    try {
      const res = await authFetch("/api/news?limit=8");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to load news calendar.");
      }
      const parsed = (data.events || []).map((event: NewsEvent) => ({
        ...event,
        time: new Date(event.time),
      }));
      setNewsEvents(parsed);
      setEventsLastUpdated(new Date());
      setEventsSource(data.source || null);
    } catch (err) {
      setEventsError(err instanceof Error ? err.message : "Could not load calendar.");
    } finally {
      setEventsLoading(false);
      setRefreshingEvents(false);
    }
  }, [authFetch]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Auto-refresh every 15 minutes when tab is visible
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        loadEvents(true);
      }
    }, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

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
      if (!res.ok) {
        setError(data?.error || "Analysis failed.");
        return;
      }
      setResult(data.result);
    } catch {
      setError("Request failed. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const prefillFromEvent = (event: NewsEvent, enableTelegram = false) => {
    const localTime = formatEventTime(event.time);
    const headlineText = `${event.currency} ${event.event} (${event.impact.toUpperCase()}) — ${localTime}`;
    const summaryText = [
      `Impact: ${event.impact.toUpperCase()}`,
      event.forecast ? `Forecast: ${event.forecast}` : null,
      event.previous ? `Previous: ${event.previous}` : null,
      `Arrives in ${timeUntil(event.time)}.`,
    ]
      .filter(Boolean)
      .join(" · ");

    setHeadline(headlineText);
    setSummary(summaryText);
    setSendTelegram(enableTelegram || sendTelegram);
    setResult(null);
  };

  const applyTemplate = (template: (typeof templates)[number]) => {
    setHeadline(template.headline);
    setSummary(template.summary);
    setPair((template.pair || "") as CurrencyPair | "");
    setCurrentPrice(template.currentPrice || "");
    setResult(null);
  };

  const pinnedBrief = {
    title: "Market Context & Execution Tips",
    bullets: [
      "Middle East tension (US–Iran) keeps oil elevated → feeds inflation and risk-off moves.",
      "USD bias: strengthens on fear, softens when risk steadies; momentum is choppy intraday.",
      "USD/JPY parked near 160 — high intervention risk from Japan; expect headline whipsaws.",
      "EUR/USD coiling 1.1460 support / 1.1630 resistance; direction likely follows oil + US CPI tone.",
      "GBP weak vs USD on energy + inflation drag; slight bearish bias near 4‑month lows.",
      "EM FX (MXN, BRL, etc.) benefited from brief USD softness, but April outlook is shaky if oil re-flares.",
      "High-impact this week: US CPI (Fri 8:30 ET), FOMC Minutes (today 14:00 ET), weekly oil inventories.",
      "Execution tip: wait for news spike → let spread/vol crush → enter on structure; avoid chasing.",
      "Best liquidity windows: London 3–6 AM ET; New York open 8:30–10 AM ET for news-driven moves.",
    ],
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
          Converts breaking news into bias, entry status, and trade idea — using the same
          WAIT / READY / CONFIRMED / INVALID framework as the pair analysis engine.
          A news headline alone is never CONFIRMED. Always verify on the chart.
        </p>
      </section>

      {/* Pinned daily brief */}
      <Card className="sticky top-3 z-20 border-brand-500/20 bg-surface-light/90 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <CardHeader className="mb-0">{pinnedBrief.title}</CardHeader>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">
            <span className="rounded-full bg-slate-500/15 px-2 py-1 text-slate-400">static</span>
            {eventsLastUpdated ? (
              <span className="text-slate-400">
                Updated {eventsLastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            ) : null}
          </div>
        </div>
        <ul className="space-y-2 text-sm leading-6 text-slate-300">
          {pinnedBrief.bullets.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-brand-400" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.6fr]">
        {/* Form */}
        <div className="space-y-4">
          <Card>
            <CardHeader>News Input</CardHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  Summary <span className="text-slate-600">(optional)</span>
                </label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Paste the article summary or any additional context..."
                  className="h-28 w-full rounded-xl border border-white/10 bg-surface px-3 py-2.5 text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
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
                    Current Price <span className="text-slate-600">(optional)</span>
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

              <p className="text-xs text-slate-600">
                Add current price to unlock trade levels. Without it, no entry zone will be suggested.
              </p>

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

              <Button
                type="submit"
                disabled={loading || !headline.trim()}
                className="w-full"
              >
                {loading ? "Analyzing..." : "Analyze News"}
              </Button>
            </form>
          </Card>

          <Card>
            <CardHeader>Signal Shortcuts</CardHeader>
            <div className="grid gap-3">
              {templates.map((template) => (
                <div
                  key={template.label}
                  className="rounded-xl border border-white/5 bg-slate-950/30 px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-white">{template.label}</div>
                      <p className="text-xs text-slate-500">
                        {template.pair ? `${template.pair} · ` : ""}{template.summary.slice(0, 96)}{template.summary.length > 96 ? "…" : ""}
                      </p>
                    </div>
                    <Button size="sm" variant="secondary" onClick={() => applyTemplate(template)}>
                      Use
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <CardHeader className="mb-0">Upcoming High-Impact (auto)</CardHeader>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <Button size="sm" variant="secondary" onClick={() => loadEvents(true)} disabled={eventsLoading || refreshingEvents}>
                  {refreshingEvents ? "Refreshing..." : "Refresh"}
                </Button>
              </div>
            </div>
            {eventsLoading ? (
              <div className="space-y-3 py-3 text-sm text-slate-500">
                Loading calendar...
              </div>
            ) : eventsError ? (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {eventsError}
              </div>
            ) : newsEvents.length === 0 ? (
              <div className="text-sm text-slate-500">No upcoming events loaded.</div>
            ) : (
              <div className="space-y-3">
                {newsEvents.map((event) => (
                  <div
                    key={`${event.time.toISOString()}-${event.event}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-slate-950/30 px-4 py-3"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <div className="text-sm font-semibold text-white truncate">
                        {event.currency} · {event.event}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span>{formatEventTime(event.time)}</span>
                        <span>· {timeUntil(event.time)}</span>
                        <ImpactChip impact={event.impact} />
                      </div>
                      {(event.forecast || event.previous) && (
                        <div className="text-[11px] text-slate-600">
                          {event.forecast ? `Forecast ${event.forecast}` : "Forecast n/a"} ·{" "}
                          {event.previous ? `Prev ${event.previous}` : "Prev n/a"}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <Button size="sm" variant="secondary" onClick={() => prefillFromEvent(event, false)}>
                        Analyze
                      </Button>
                      <Button size="sm" onClick={() => prefillFromEvent(event, true)}>
                        Analyze + Telegram
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="text-[11px] text-slate-500">
                  Source: {eventsSource || "unknown"} · {eventsLastUpdated ? eventsLastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "just now"}
                </div>
              </div>
            )}
          </Card>

          {result ? (
            <Card>
              <CardHeader>Final Decision</CardHeader>
              <div className="space-y-4">
                <ScoreBar score={result.finalDecision.score} />
                <div className="flex items-center gap-3">
                  <DecisionBadge decision={result.finalDecision.decision} />
                  <StatusBadge status={result.entryStatus} size="sm" />
                </div>
                <p className="text-sm leading-6 text-slate-300">{result.finalDecision.reasoning}</p>
                <div className="rounded-xl border border-white/5 bg-slate-950/30 px-4 py-3 text-xs text-slate-500">
                  Analyzed {new Date(result.analyzedAt).toLocaleTimeString()}
                  {result.pair ? ` · ${result.pair}` : " · Pair auto-detected"}
                </div>
              </div>
            </Card>
          ) : null}
        </div>

        {/* Results */}
        <div className="space-y-4">
          {error ? (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          ) : null}

          {loading ? (
            <Card>
              <div className="space-y-3 py-4">
                {["Reading headline...", "Identifying impact currencies...", "Assessing entry status...", "Building trade signal..."].map((step, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400" />
                    {step}
                  </div>
                ))}
              </div>
            </Card>
          ) : null}

          {result && !loading ? (
            <>
              {/* Section 1: News Summary */}
              <Card>
                <CardHeader>News Summary</CardHeader>
                <p className="text-sm leading-6 text-slate-300">{result.newsSummary}</p>
              </Card>

              {/* Section 2: Market Impact */}
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

              {/* Section 3: Trading Bias */}
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

              {/* Section 4: Entry Status */}
              <EntryStatusCard
                status={result.entryStatus}
                reason={result.entryStatusReason}
                whatMustHappenNext={result.proInsight.waitForConfirmation}
              />

              {/* Section 5: Trade Idea */}
              {result.tradeIdea ? (
                <Card>
                  <CardHeader>Trade Idea</CardHeader>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "rounded px-2 py-0.5 text-sm font-bold uppercase",
                        result.tradeIdea.direction === "LONG"
                          ? "bg-green-500/15 text-green-400"
                          : "bg-red-500/15 text-red-400"
                      )}>
                        {result.tradeIdea.direction === "LONG" ? "BUY" : "SELL"}
                      </span>
                      {result.tradingBias.pair ? (
                        <span className="text-sm text-slate-400">{result.tradingBias.pair}</span>
                      ) : null}
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div className="rounded-lg border border-white/5 bg-slate-950/30 px-3 py-2.5">
                        <div className="text-slate-500">Entry Zone</div>
                        <div className="mt-1 font-mono font-medium text-white">
                          {formatPrice(result.tradeIdea.entryZoneLow)} – {formatPrice(result.tradeIdea.entryZoneHigh)}
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
                      These levels are based on live price context. Verify on chart before executing.
                    </p>
                  </div>
                </Card>
              ) : result.entryStatus !== "INVALID" ? (
                <div className="rounded-xl border border-dashed border-white/10 bg-surface px-4 py-5 text-center text-sm text-slate-500">
                  No trade levels — add a current price to unlock entry zone, SL, and TP.
                </div>
              ) : null}

              {/* Section 6: Risk Notes */}
              <Card>
                <CardHeader>Risk Notes</CardHeader>
                <div className="space-y-3">
                  <RiskRow label="Upcoming news" value={result.riskNotes.upcomingNews} />
                  <RiskRow label="Fakeout risk" value={result.riskNotes.fakeoutRisk} />
                  <RiskRow label="Volatility" value={result.riskNotes.volatilityWarning} />
                </div>
              </Card>

              {/* Section 7: Pro Insight */}
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
                      {result.proInsight.pricedIn ? "Likely yes — expect fades" : "Probably not — momentum possible"}
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
            <div className="rounded-2xl border border-dashed border-white/10 bg-surface px-6 py-12 text-center">
              <div className="text-sm text-slate-500">
                Results will appear here after you analyze a headline.
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
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

function formatEventTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function timeUntil(date: Date) {
  const diffMs = date.getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / 60000);
  if (diffMinutes <= 0) return "now";
  if (diffMinutes < 60) return `${diffMinutes}m`;
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  return `${hours}h ${minutes}m`;
}

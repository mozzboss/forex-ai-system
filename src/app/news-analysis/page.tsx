"use client";

import { useState } from "react";

import { Button, Card, CardHeader, EntryStatusCard, StatusBadge } from "@/components/ui";
import { ALL_PAIRS } from "@/config/trading";
import { useAuth } from "@/hooks";
import { cn, getBiasColor, formatCurrency } from "@/lib/utils";
import type { CurrencyPair, NewsAnalysisResult } from "@/types";

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

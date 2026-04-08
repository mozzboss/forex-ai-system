"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/hooks";
import type { EndOfDayReview, EndOfDayReviewContext } from "@/types";
import { Button, Card, CardHeader } from "@/components/ui";
import { cn, formatCurrency, formatTime, formatDate } from "@/lib/utils";
import { useTimezone } from "@/components/shared/TimezoneProvider";

function deserializeReview(review: EndOfDayReview | null | undefined) {
  if (!review) {
    return null;
  }

  return {
    ...review,
    date: new Date(review.date),
    generatedAt: new Date(review.generatedAt),
  };
}

function deserializeContext(context: EndOfDayReviewContext | null | undefined) {
  if (!context) {
    return null;
  }

  return {
    ...context,
    date: new Date(context.date),
    trades: (context.trades || []).map((trade) => ({
      ...trade,
      createdAt: new Date(trade.createdAt),
      openedAt: trade.openedAt ? new Date(trade.openedAt) : undefined,
      closedAt: trade.closedAt ? new Date(trade.closedAt) : undefined,
    })),
    journalEntries: (context.journalEntries || []).map((entry) => ({
      ...entry,
      date: new Date(entry.date),
    })),
  };
}

export function EndOfDayReviewCard() {
  const { authFetch, user } = useAuth();
  const { timezone } = useTimezone();
  const [review, setReview] = useState<EndOfDayReview | null>(null);
  const [context, setContext] = useState<EndOfDayReviewContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [sendTelegram, setSendTelegram] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReview = useCallback(async () => {
    if (!user) {
      setReview(null);
      setContext(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await authFetch("/api/review/eod");

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to load end-of-day review");
      }

      const data = await res.json();
      setReview(deserializeReview(data.review));
      setContext(deserializeContext(data.context));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load end-of-day review");
    } finally {
      setLoading(false);
    }
  }, [authFetch, user]);

  useEffect(() => {
    fetchReview();
  }, [fetchReview]);

  const generateReview = async () => {
    try {
      setGenerating(true);
      const res = await authFetch("/api/review/eod", {
        method: "POST",
        body: JSON.stringify({
          action: "generate",
          sendTelegram,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to generate review");
      }

      const data = await res.json();
      setReview(deserializeReview(data.review));
      setContext(deserializeContext(data.context));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate review");
    } finally {
      setGenerating(false);
    }
  };

  const reviewDateLabel = useMemo(() => {
    const date = review?.date || context?.date;
    return date ? formatDate(date, timezone) : "today";
  }, [context?.date, review?.date, timezone]);

  const reviewInsights = useMemo(() => {
    if (!context) {
      return {
        journalCoverage: 0,
        averageClosedPnl: 0,
        executionRate: 0,
      };
    }

    return {
      journalCoverage:
        context.stats.totalTrades > 0
          ? Math.round((context.stats.journalEntries / context.stats.totalTrades) * 100)
          : 0,
      averageClosedPnl:
        context.stats.closedTrades > 0 ? context.stats.pnl / context.stats.closedTrades : 0,
      executionRate:
        context.stats.totalTrades > 0
          ? Math.round((context.stats.executedTrades / context.stats.totalTrades) * 100)
          : 0,
    };
  }, [context]);

  return (
    <Card>
      <div className="mb-4 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <CardHeader className="mb-1">End-of-Day Review</CardHeader>
          <p className="text-sm text-gray-400">
            Generate a calm post-session review from today&apos;s trades and journal notes, then carry only the useful lessons into tomorrow.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex items-center gap-2 text-xs text-gray-400">
            <input
              type="checkbox"
              checked={sendTelegram}
              onChange={(event) => setSendTelegram(event.target.checked)}
              className="h-4 w-4 rounded border-white/10 bg-surface"
            />
            Send summary to Telegram
          </label>
          <Button variant="secondary" onClick={fetchReview} disabled={loading || generating}>
            Refresh
          </Button>
          <Button onClick={generateReview} disabled={generating}>
            {generating ? "Generating..." : "Generate Review"}
          </Button>
        </div>
      </div>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      {loading && !review && !context ? (
        <div className="rounded-xl border border-dashed border-white/10 bg-surface px-4 py-8 text-center text-sm text-gray-500">
          Loading today&apos;s review context...
        </div>
      ) : null}

      {context ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <ReviewMetric label="Trades Logged" value={`${context.stats.totalTrades}`} />
          <ReviewMetric label="Closed Trades" value={`${context.stats.closedTrades}`} />
          <ReviewMetric label="Denied Setups" value={`${context.stats.deniedTrades}`} />
          <ReviewMetric
            label="Realized P&L"
            value={formatCurrency(context.stats.pnl)}
            tone={context.stats.pnl >= 0 ? "text-green-400" : "text-red-400"}
          />
          <ReviewMetric label="Journal Notes" value={`${context.stats.journalEntries}`} />
        </div>
      ) : null}

      {review ? (
        <div className="mt-5 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_38%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.95))] p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-brand-300/80">
                  Review for {reviewDateLabel}
                </div>
                <h3 className="mt-2 text-xl font-semibold text-white">{review.headline}</h3>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">{review.summary}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-right">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Discipline score</div>
                <div
                  className={cn(
                    "mt-2 text-2xl font-bold",
                    review.disciplineScore >= 8
                      ? "text-green-400"
                      : review.disciplineScore >= 5
                        ? "text-yellow-400"
                        : "text-red-400"
                  )}
                >
                  {review.disciplineScore}/10
                </div>
                <div className="mt-2 text-xs text-slate-400">
                  Generated {formatTime(review.generatedAt, timezone)} {timezone}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <ReviewMetric
              label="Journal Coverage"
              value={`${reviewInsights.journalCoverage}%`}
              tone={reviewInsights.journalCoverage >= 75 ? "text-green-400" : "text-yellow-400"}
            />
            <ReviewMetric
              label="Execution Rate"
              value={`${reviewInsights.executionRate}%`}
              tone={reviewInsights.executionRate >= 50 ? "text-brand-300" : "text-slate-200"}
            />
            <ReviewMetric
              label="Average Closed"
              value={formatCurrency(reviewInsights.averageClosedPnl)}
              tone={reviewInsights.averageClosedPnl >= 0 ? "text-green-400" : "text-red-400"}
            />
            <ReviewMetric
              label="First Rule Tomorrow"
              value={review.tomorrowFocus[0] || "Stay selective"}
              tone="text-slate-100"
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <ReviewListCard
              title="Tonight Keep"
              description="Behaviors that should carry straight into the next session."
              items={review.strengths.slice(0, 3)}
              accent="text-green-300"
            />
            <ReviewListCard
              title="Tonight Cut"
              description="Leaks to deliberately remove before market open."
              items={[...review.mistakes, ...review.riskFlags].slice(0, 3)}
              accent="text-red-300"
            />
            <ReviewListCard
              title="Tomorrow Focus"
              description="A short list of concrete instructions for the next session."
              items={review.tomorrowFocus.slice(0, 3)}
              accent="text-brand-300"
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <ReviewListCard
              title="What Worked"
              description="Behaviors worth repeating because they protected or improved the process."
              items={review.strengths}
              accent="text-green-300"
            />
            <ReviewListCard
              title="What Needs Work"
              description="Honest mistakes or leaks in discipline that deserve attention before the next session."
              items={review.mistakes}
              accent="text-yellow-300"
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <ReviewListCard
              title="Risk Flags"
              description="Any pressure points that could become expensive if ignored tomorrow."
              items={review.riskFlags}
              accent="text-red-300"
            />
            <ReviewListCard
              title="Tomorrow Focus"
              description="The full carry-forward list generated from today&apos;s behavior."
              items={review.tomorrowFocus}
              accent="text-brand-300"
            />
          </div>
        </div>
      ) : !loading ? (
        <div className="mt-5 rounded-xl border border-dashed border-white/10 bg-surface px-4 py-8 text-center text-sm text-gray-500">
          No saved review for today yet. Generate one after your session to lock in the lesson before tomorrow starts.
        </div>
      ) : null}
    </Card>
  );
}

function ReviewMetric({
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
      <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className={cn("mt-2 text-lg font-semibold", tone)}>{value}</div>
    </div>
  );
}

function ReviewListCard({
  title,
  description,
  items,
  accent,
}: {
  title: string;
  description: string;
  items: string[];
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-surface p-4">
      <div className={cn("text-sm font-semibold", accent)}>{title}</div>
      <p className="mt-1 text-sm text-gray-400">{description}</p>
      <div className="mt-4 space-y-2">
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 bg-surface-light px-4 py-4 text-sm text-gray-500">
            No notes captured here yet.
          </div>
        ) : (
          items.map((item, index) => (
            <div key={`${title}-${index}`} className="rounded-xl border border-white/5 bg-surface-light px-4 py-3 text-sm text-gray-300">
              {item}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

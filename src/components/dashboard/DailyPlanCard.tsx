"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { getAccountRules } from "@/config/trading";
import { useAuth } from "@/hooks";
import { Button, Card, CardHeader } from "@/components/ui";
import type { DailyPlan, DailyPlanContext } from "@/types";
import { cn, formatPercent, formatTime, formatDate } from "@/lib/utils";
import { useTimezone } from "@/components/shared/TimezoneProvider";

function deserializePlan(plan: DailyPlan | null | undefined) {
  if (!plan) {
    return null;
  }

  return {
    ...plan,
    date: new Date(plan.date),
    createdAt: new Date(plan.createdAt),
    updatedAt: new Date(plan.updatedAt),
  };
}

function deserializeContext(context: DailyPlanContext | null | undefined) {
  if (!context) {
    return null;
  }

  return {
    ...context,
    date: new Date(context.date),
    accounts: (context.accounts || []).map((account) => ({
      ...account,
      createdAt: new Date(account.createdAt),
      updatedAt: new Date(account.updatedAt),
      openTrades: (account.openTrades || []).map((trade) => ({
        ...trade,
        createdAt: new Date(trade.createdAt),
        openedAt: trade.openedAt ? new Date(trade.openedAt) : undefined,
        closedAt: trade.closedAt ? new Date(trade.closedAt) : undefined,
      })),
    })),
    openTrades: (context.openTrades || []).map((trade) => ({
      ...trade,
      createdAt: new Date(trade.createdAt),
      openedAt: trade.openedAt ? new Date(trade.openedAt) : undefined,
      closedAt: trade.closedAt ? new Date(trade.closedAt) : undefined,
    })),
    upcomingEvents: (context.upcomingEvents || []).map((event) => ({
      ...event,
      time: new Date(event.time),
    })),
    priorReview: context.priorReview
      ? {
          ...context.priorReview,
          date: new Date(context.priorReview.date),
          generatedAt: new Date(context.priorReview.generatedAt),
        }
      : null,
  };
}

export function DailyPlanCard() {
  const { authFetch, user } = useAuth();
  const { timezone } = useTimezone();
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [context, setContext] = useState<DailyPlanContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [sendTelegram, setSendTelegram] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlan = useCallback(async () => {
    if (!user) {
      setPlan(null);
      setContext(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await authFetch("/api/plan");

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to load daily plan");
      }

      const data = await res.json();
      setPlan(deserializePlan(data.plan));
      setContext(deserializeContext(data.context));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load daily plan");
    } finally {
      setLoading(false);
    }
  }, [authFetch, user]);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  const generatePlan = async () => {
    try {
      setGenerating(true);
      const res = await authFetch("/api/plan", {
        method: "POST",
        body: JSON.stringify({
          action: "generate",
          sendTelegram,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to generate daily plan");
      }

      const data = await res.json();
      setPlan(deserializePlan(data.plan));
      setContext(deserializeContext(data.context));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate daily plan");
    } finally {
      setGenerating(false);
    }
  };

  const planInsights = useMemo(() => {
    if (!context) {
      return {
        strictestRisk: null as number | null,
        strictestTradeCap: null as number | null,
        nextHighImpactEvent: null as DailyPlanContext["upcomingEvents"][number] | null,
        carryForward:
          "No prior review saved yet. Keep the session simple and wait for CONFIRMED status only.",
        openExposureLabel: "No open exposure",
      };
    }

    return {
      strictestRisk:
        context.accounts.length > 0
          ? Math.min(...context.accounts.map((account) => account.riskPercent))
          : null,
      strictestTradeCap:
        context.accounts.length > 0
          ? Math.min(...context.accounts.map((account) => getAccountRules(account.mode).maxTradesPerDay))
          : null,
      nextHighImpactEvent: context.upcomingEvents.find((event) => event.impact === "high") ?? null,
      carryForward:
        context.priorReview?.tomorrowFocus?.[0]
        || context.priorReview?.riskFlags?.[0]
        || "No carry-forward warning recorded. Stay selective and keep the watchlist tight.",
      openExposureLabel:
        context.openTrades.length > 0
          ? `${context.openTrades.length} trade${context.openTrades.length === 1 ? "" : "s"} already live`
          : "No open exposure",
    };
  }, [context]);

  const checklistItems = useMemo(() => {
    if (!plan) {
      return [];
    }

    return [
      `Trade only ${plan.pairs.join(", ") || "the planned focus instruments"} until something is clearly CONFIRMED.`,
      `Respect the session focus: ${plan.sessionFocus}`,
      `Keep execution count capped at ${plan.maxTrades} even if multiple ideas appear.`,
      `Run the final news check before every entry: ${plan.newsEvents}`,
    ];
  }, [plan]);

  return (
    <Card>
      <div className="mb-4 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <CardHeader className="mb-1">Morning Plan</CardHeader>
          <p className="text-sm text-gray-400">
            Start with a tight watchlist, clear news awareness, and a trade cap that respects the strictest account.
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
            Send to Telegram
          </label>
          <Button variant="secondary" onClick={fetchPlan} disabled={loading || generating}>
            Refresh
          </Button>
          <Button onClick={generatePlan} disabled={generating}>
            {generating ? "Generating..." : "Generate Plan"}
          </Button>
        </div>
      </div>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      {context ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <PlanMetric label="Active Accounts" value={`${context.accounts.length}`} />
          <PlanMetric label="Open Exposure" value={`${context.openTrades.length}`} />
          <PlanMetric label="Upcoming Events" value={`${context.upcomingEvents.length}`} />
          <PlanMetric
            label="Prior Review"
            value={context.priorReview ? `${context.priorReview.disciplineScore}/10` : "None"}
            tone={context.priorReview && context.priorReview.disciplineScore >= 8 ? "text-green-400" : "text-white"}
          />
        </div>
      ) : null}

      {plan ? (
        <div className="mt-5 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.14),_transparent_40%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.95))] p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-green-300/80">
                  Plan for {formatDate(plan.date, timezone)}
                </div>
                <div className="mt-2 text-2xl font-semibold text-white">
                  {plan.pairs.length > 0 ? plan.pairs.join(" • ") : "No primary watchlist pairs"}
                </div>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">{plan.planNotes}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {plan.pairs.map((pair) => (
                    <span
                      key={pair}
                      className="rounded-full border border-white/10 bg-slate-950/35 px-3 py-1 text-xs font-medium tracking-wide text-slate-200"
                    >
                      {pair}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-right">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Max trades</div>
                <div className="mt-2 text-2xl font-bold text-white">{plan.maxTrades}</div>
                <div className="mt-2 text-xs text-slate-400">
                  Updated {formatTime(plan.updatedAt, timezone)} {timezone}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <PlanSection
              title="Execution Posture"
              body={
                planInsights.strictestRisk !== null && planInsights.strictestTradeCap !== null
                  ? `Respect the strictest account first: ${formatPercent(planInsights.strictestRisk)} risk per idea, ${planInsights.strictestTradeCap} total trades max, and ${planInsights.openExposureLabel.toLowerCase()}.`
                  : "No active account guardrails loaded yet."
              }
              accent="text-emerald-300"
            />
            <PlanSection
              title="Primary Risk"
              body={
                planInsights.nextHighImpactEvent
                  ? `${planInsights.nextHighImpactEvent.currency} ${planInsights.nextHighImpactEvent.event} is the next high-impact catalyst at ${formatTime(planInsights.nextHighImpactEvent.time, timezone)} ${timezone}. Keep the 30-minute news buffer intact.`
                  : "No immediate high-impact event is scheduled, but every planned trade still needs a final calendar check."
              }
              accent="text-red-300"
            />
            <PlanSection
              title="Carry Forward"
              body={planInsights.carryForward}
              accent="text-brand-300"
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <PlanSection title="Macro Bias" body={plan.macroBias} accent="text-brand-300" />
            <PlanSection title="Session Focus" body={plan.sessionFocus} accent="text-green-300" />
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <PlanSection title="Key Levels Checklist" body={plan.keyLevels} accent="text-yellow-300" />
            <PlanSection title="News Risk" body={plan.newsEvents} accent="text-red-300" />
          </div>

          <div className="rounded-2xl border border-white/10 bg-surface p-4">
            <div className="text-sm font-semibold text-white">Opening Checklist</div>
            <div className="mt-3 grid gap-3 lg:grid-cols-2">
              {checklistItems.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-white/5 bg-surface-light px-4 py-3 text-sm leading-6 text-slate-300"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : !loading ? (
        <div className="mt-5 rounded-xl border border-dashed border-white/10 bg-surface px-4 py-8 text-center text-sm text-gray-500">
          No plan has been generated for today yet. Generate it before the session starts so the watchlist stays small and intentional.
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-white/10 bg-surface px-4 py-8 text-center text-sm text-gray-500">
          Loading daily plan context...
        </div>
      )}
    </Card>
  );
}

function PlanMetric({
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

function PlanSection({
  title,
  body,
  accent,
}: {
  title: string;
  body: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-surface p-4">
      <div className={cn("text-sm font-semibold", accent)}>{title}</div>
      <p className="mt-3 text-sm leading-6 text-gray-300">{body}</p>
    </div>
  );
}

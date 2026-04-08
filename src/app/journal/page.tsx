"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

import { JournalEntryCard } from "@/components/journal";
import { MissedZonesPanel } from "@/components/trade";
import { Button, Card, CardHeader } from "@/components/ui";
import { useJournal, useTrades } from "@/hooks";
import { formatCurrency } from "@/lib/utils";

const ENTRY_TYPES = ["trade", "review", "lesson", "plan"] as const;

export default function JournalPage() {
  const { entries, loading, error, fetchEntries, addEntry } = useJournal();
  const { trades } = useTrades();
  const [selectedType, setSelectedType] = useState<(typeof ENTRY_TYPES)[number]>("review");
  const [content, setContent] = useState("");
  const [mistakes, setMistakes] = useState("");
  const [tags, setTags] = useState("");
  const [disciplineScore, setDisciplineScore] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState<"all" | (typeof ENTRY_TYPES)[number]>("all");

  const todaySession = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const todayTrades = trades.filter((t) => new Date(t.createdAt) >= start);
    const closed = todayTrades.filter((t) => t.status === "closed" && typeof t.pnl === "number");
    const open = todayTrades.filter((t) => t.status === "open");
    const denied = todayTrades.filter((t) => t.status === "denied");
    const pnl = closed.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const avgScore = todayTrades.length > 0
      ? (todayTrades.reduce((sum, t) => sum + t.aiScore, 0) / todayTrades.length).toFixed(1)
      : null;
    return { total: todayTrades.length, closed: closed.length, open: open.length, denied: denied.length, pnl, avgScore };
  }, [trades]);

  const stats = useMemo(() => {
    const scoredEntries = entries.filter((entry) => typeof entry.disciplineScore === "number");
    const taggedEntries = entries.filter((entry) => (entry.tags || []).length > 0);
    const recentMistakes = entries.flatMap((entry) => entry.mistakes || []).slice(0, 6);
    const averageDiscipline =
      scoredEntries.length > 0
        ? (
            scoredEntries.reduce((total, entry) => total + (entry.disciplineScore || 0), 0) /
            scoredEntries.length
          ).toFixed(1)
        : "-";

    return {
      total: entries.length.toString(),
      reviews: entries.filter((entry) => entry.type === "review").length.toString(),
      lessons: entries.filter((entry) => entry.type === "lesson").length.toString(),
      discipline: averageDiscipline,
      tagged: taggedEntries.length.toString(),
      recentMistakes,
    };
  }, [entries]);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setSubmitting(true);
    const saved = await addEntry({
      type: selectedType,
      content: content.trim(),
      mistakes: mistakes
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      disciplineScore: disciplineScore ? Number(disciplineScore) : undefined,
      tags: tags
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    });

    if (saved) {
      setContent("");
      setMistakes("");
      setTags("");
      setDisciplineScore("");
    }

    setSubmitting(false);
  };

  const applyFilter = async (nextFilter: "all" | (typeof ENTRY_TYPES)[number]) => {
    setFilter(nextFilter);
    await fetchEntries(nextFilter === "all" ? undefined : nextFilter);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <section className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_35%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.96))] p-5 sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-300/80">
              Journal & Discipline
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Turn every session into useful feedback instead of vague emotion.
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Capture what happened, what slipped, and what needs to change tomorrow. The goal is not
              volume. It is cleaner self-awareness and fewer repeated mistakes.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[360px]">
            <HeroPill label="Entries Logged" value={stats.total} detail="review, lesson, trade, and plan notes" />
            <HeroPill label="Avg Discipline" value={stats.discipline} detail="average of scored journal entries" />
            <HeroPill label="Reviews" value={stats.reviews} detail="explicit self-review entries captured" />
            <HeroPill label="Tagged Entries" value={stats.tagged} detail="entries organized for later pattern review" />
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      {todaySession.total > 0 ? (
        <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Today&apos;s Session</div>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-300">
                <span><span className="font-semibold text-white">{todaySession.total}</span> trades logged</span>
                <span><span className="font-semibold text-white">{todaySession.open}</span> open</span>
                <span><span className="font-semibold text-white">{todaySession.denied}</span> denied</span>
                {todaySession.closed > 0 ? (
                  <span className={todaySession.pnl >= 0 ? "font-semibold text-green-400" : "font-semibold text-red-400"}>
                    {formatCurrency(todaySession.pnl)} realized
                  </span>
                ) : null}
                {todaySession.avgScore ? (
                  <span><span className="font-semibold text-white">{todaySession.avgScore}</span> avg AI score</span>
                ) : null}
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSelectedType("review");
                const parts = [
                  `Session: ${todaySession.total} trades (${todaySession.open} open, ${todaySession.denied} denied).`,
                  todaySession.closed > 0 ? `Realized P&L: ${formatCurrency(todaySession.pnl)}.` : "",
                  todaySession.avgScore ? `Avg AI score: ${todaySession.avgScore}/10.` : "",
                  "",
                  "What happened? What did I do well? Where did discipline slip?",
                ].filter(Boolean).join(" ");
                setContent(parts);
              }}
            >
              Pre-fill from session
            </Button>
          </div>
        </div>
      ) : null}

      <MissedZonesPanel />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>New Entry</CardHeader>
          <p className="mb-4 text-sm leading-6 text-gray-400">
            Keep entries specific. What was the context, what decision did you make, and what behavior would you repeat or avoid tomorrow?
          </p>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {ENTRY_TYPES.map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </Button>
              ))}
            </div>

            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="What happened today? What did you do well, where did discipline slip, and what would better execution have looked like?"
              className="h-40 w-full rounded-xl border border-white/10 bg-surface px-3 py-3 text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <InputField
                label="Mistakes"
                value={mistakes}
                onChange={setMistakes}
                placeholder="revenge entry, ignored news"
              />
              <InputField
                label="Tags"
                value={tags}
                onChange={setTags}
                placeholder="eurusd, london, patience"
              />
              <InputField
                label="Discipline Score"
                value={disciplineScore}
                onChange={setDisciplineScore}
                placeholder="1-10"
              />
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/25 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Writing Prompts
              </div>
              <div className="mt-3 grid gap-2 text-sm text-slate-300">
                <div className="rounded-xl border border-white/5 bg-surface px-3 py-3">What did I see clearly before the trade or review?</div>
                <div className="rounded-xl border border-white/5 bg-surface px-3 py-3">Where did emotion, urgency, or bias distort my decision?</div>
                <div className="rounded-xl border border-white/5 bg-surface px-3 py-3">What single behavior should improve next session?</div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSubmit} disabled={submitting || !content.trim()}>
                {submitting ? "Saving..." : "Save Entry"}
              </Button>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>Behavior Snapshot</CardHeader>
            <div className="grid gap-3 sm:grid-cols-2">
              <InsightCard
                label="Recent Mistakes"
                value={stats.recentMistakes.length > 0 ? stats.recentMistakes.slice(0, 3).join(", ") : "No recurring mistakes logged yet"}
              />
              <InsightCard
                label="Journal Goal"
                value="Use this page to catch repeated behavior before it becomes a larger drawdown problem."
              />
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <CardHeader className="mb-1">Recent Entries</CardHeader>
                <p className="text-sm text-gray-400">
                  Filter the feed by entry type to review decisions, lessons, and planning notes in context.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filter === "all" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => applyFilter("all")}
                >
                  All
                </Button>
                {ENTRY_TYPES.map((type) => (
                  <Button
                    key={type}
                    variant={filter === type ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => applyFilter(type)}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {loading && entries.length === 0 ? (
                <div className="text-sm text-gray-500">Loading entries...</div>
              ) : null}

              {!loading && entries.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 bg-surface px-4 py-8 text-center text-sm text-gray-500">
                  No journal entries yet. Start logging your trades and reviews.
                </div>
              ) : null}

              {entries.map((entry) => (
                <JournalEntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function HeroPill({
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

function InsightCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/25 px-4 py-3">
      <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</div>
      <div className="mt-2 text-sm leading-6 text-slate-300">{value}</div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="text-sm text-gray-400">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-white/10 bg-surface px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
      />
    </label>
  );
}

"use client";

import { JournalEntry } from "@/types";
import { cn, formatDate, formatTime } from "@/lib/utils";
import { useTimezone } from "@/components/shared/TimezoneProvider";

interface JournalEntryCardProps {
  entry: JournalEntry;
}

export function JournalEntryCard({ entry }: JournalEntryCardProps) {
  const { timezone } = useTimezone();
  const typeColors: Record<string, string> = {
    trade: "text-blue-300 bg-blue-400/10 border-blue-400/20",
    review: "text-violet-300 bg-violet-400/10 border-violet-400/20",
    lesson: "text-green-300 bg-green-400/10 border-green-400/20",
    plan: "text-yellow-300 bg-yellow-400/10 border-yellow-400/20",
  };

  const date = new Date(entry.date);

  return (
    <div className="rounded-2xl border border-white/10 bg-[linear-gradient(135deg,_rgba(30,41,59,0.95),_rgba(15,23,42,0.92))] p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em]",
              typeColors[entry.type]
            )}
          >
            {entry.type}
          </span>
          {typeof entry.disciplineScore === "number" ? (
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-slate-300">
              Discipline: {entry.disciplineScore}/10
            </span>
          ) : null}
        </div>
        <span className="text-[11px] text-slate-500">
          {formatDate(date, timezone)} {formatTime(date, timezone)} {timezone}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-300">{entry.content}</p>

      {entry.mistakes && entry.mistakes.length > 0 ? (
        <div className="mt-4 rounded-xl border border-red-500/15 bg-red-500/5 p-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-300">Mistakes</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {entry.mistakes.map((mistake, index) => (
              <span key={index} className="rounded-full border border-red-500/15 bg-slate-950/35 px-2.5 py-1 text-[11px] text-red-100">
                {mistake}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {entry.aiFeedback ? (
        <div className="mt-4 rounded-xl border border-brand-500/15 bg-brand-500/5 p-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-300">AI Feedback</div>
          <p className="mt-2 text-sm leading-6 text-slate-300">{entry.aiFeedback}</p>
        </div>
      ) : null}

      {entry.tags && entry.tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {entry.tags.map((tag, index) => (
            <span key={index} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-400">
              #{tag}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

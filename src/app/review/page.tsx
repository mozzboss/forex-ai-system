"use client";

import Link from "next/link";

import { EndOfDayReviewCard } from "@/components/trade";
import { Button } from "@/components/ui";
import { useAccounts, useTrades } from "@/hooks";
import { formatCurrency } from "@/lib/utils";

export default function ReviewPage() {
  const { accounts } = useAccounts();
  const { trades } = useTrades();

  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const todayTrades = trades.filter((t) => new Date(t.createdAt) >= startOfToday);
  const todayClosed = todayTrades.filter((t) => t.status === "closed" && typeof t.pnl === "number");
  const todayOpen = todayTrades.filter((t) => t.status === "open");
  const todayDenied = todayTrades.filter((t) => t.status === "denied");
  const todayPnl = todayClosed.reduce((sum, t) => sum + (t.pnl || 0), 0);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <section className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.14),_transparent_35%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.96))] p-5 sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-purple-300/80">
              End-of-Day Review
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Lock in today&apos;s lessons before tomorrow&apos;s market opens.
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              The review is not about how much you made. It is about whether your process held.
              Generate the AI review after your session to carry only the useful lessons forward.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/performance" className="text-sm text-brand-400 hover:text-brand-300">
                Full performance review
              </Link>
              <span className="text-slate-600">·</span>
              <Link href="/journal" className="text-sm text-brand-400 hover:text-brand-300">
                Journal entries
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 xl:min-w-[360px]">
            <SessionPill
              label="Today's Trades"
              value={`${todayTrades.length}`}
              detail={`${todayOpen.length} open · ${todayDenied.length} denied`}
            />
            <SessionPill
              label="Closed P&L"
              value={todayClosed.length > 0 ? formatCurrency(todayPnl) : "-"}
              detail={`${todayClosed.length} closed trade${todayClosed.length === 1 ? "" : "s"}`}
              tone={todayPnl > 0 ? "text-green-400" : todayPnl < 0 ? "text-red-400" : "text-white"}
            />
            <SessionPill
              label="Accounts"
              value={`${accounts.length}`}
              detail="linked trading accounts"
            />
            <SessionPill
              label="Win Rate Today"
              value={
                todayClosed.length > 0
                  ? `${Math.round((todayClosed.filter((t) => (t.pnl || 0) > 0).length / todayClosed.length) * 100)}%`
                  : "-"
              }
              detail="from closed trades only"
            />
          </div>
        </div>
      </section>

      <EndOfDayReviewCard />
    </div>
  );
}

function SessionPill({
  label,
  value,
  detail,
  tone = "text-white",
}: {
  label: string;
  value: string;
  detail: string;
  tone?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/25 px-4 py-3">
      <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</div>
      <div className={`mt-2 text-lg font-semibold ${tone}`}>{value}</div>
      <div className="mt-1 text-xs text-slate-500">{detail}</div>
    </div>
  );
}

"use client";

import Link from "next/link";

import { ALL_PAIRS } from "@/config/trading";
import { useTrackedPairs } from "@/hooks";
import { cn } from "@/lib/utils";

const PAIR_META: Record<string, { base: string; quote: string; description: string; category: string }> = {
  EURUSD: { base: "EUR", quote: "USD", description: "Euro vs US Dollar", category: "Major" },
  GBPUSD: { base: "GBP", quote: "USD", description: "British Pound vs US Dollar", category: "Major" },
  USDJPY: { base: "USD", quote: "JPY", description: "US Dollar vs Japanese Yen", category: "Major" },
  USDCHF: { base: "USD", quote: "CHF", description: "US Dollar vs Swiss Franc", category: "Major" },
  AUDUSD: { base: "AUD", quote: "USD", description: "Australian Dollar vs US Dollar", category: "Major" },
  NZDUSD: { base: "NZD", quote: "USD", description: "New Zealand Dollar vs US Dollar", category: "Minor" },
  USDCAD: { base: "USD", quote: "CAD", description: "US Dollar vs Canadian Dollar", category: "Major" },
  XAUUSD: { base: "XAU", quote: "USD", description: "Gold vs US Dollar", category: "Commodity" },
};

function PairCard({ pair, tracked }: { pair: string; tracked: boolean }) {
  const meta = PAIR_META[pair];
  return (
    <Link
      href={`/pairs/${pair}`}
      className={cn(
        "group relative flex flex-col gap-3 rounded-2xl border p-4 transition-all duration-150",
        tracked
          ? "border-brand-500/25 bg-brand-500/5 hover:border-brand-500/40 hover:bg-brand-500/10"
          : "border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/5"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-white">{pair}</span>
            <span className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em]",
              meta?.category === "Commodity"
                ? "bg-yellow-500/15 text-yellow-300"
                : meta?.category === "Minor"
                  ? "bg-slate-500/20 text-slate-400"
                  : "bg-brand-500/15 text-brand-300"
            )}>
              {meta?.category ?? "Pair"}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">{meta?.description ?? pair}</p>
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-slate-600 transition-colors group-hover:text-slate-400"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex -space-x-1">
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-slate-800 text-[10px] font-bold text-slate-300">
            {meta?.base?.slice(0, 2) ?? pair.slice(0, 2)}
          </span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-slate-800 text-[10px] font-bold text-slate-300">
            {meta?.quote?.slice(0, 2) ?? pair.slice(3, 5)}
          </span>
        </div>
        <span className={cn(
          "text-xs font-medium",
          tracked ? "text-brand-400" : "text-slate-600"
        )}>
          {tracked ? "Tracked · Open workspace →" : "Open workspace →"}
        </span>
      </div>
    </Link>
  );
}

export default function PairsPage() {
  const { trackedPairs, loading, error } = useTrackedPairs();
  const untrackedPairs = ALL_PAIRS.filter((p) => !trackedPairs.includes(p));

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Hero */}
      <section className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.1),_transparent_35%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.96))] p-5 sm:p-6">
        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-300/80">
          Currency Pairs
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Pick a pair. Run the analysis.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
          Every pair opens a full workspace — live chart, market structure, AI analysis, and trade recording.
          Track the ones you trade regularly in{" "}
          <Link href="/settings#tracked-pairs" className="text-brand-400 underline-offset-2 hover:underline">
            Settings
          </Link>{" "}
          so they appear at the top.
        </p>
      </section>

      {error ? (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      {/* Tracked pairs */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">Tracked Pairs</h2>
            <p className="text-xs text-slate-500">Your watchlist — shown first, always at hand.</p>
          </div>
          <Link
            href="/settings#tracked-pairs"
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            Manage
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl border border-white/8 bg-white/[0.02]" />
            ))}
          </div>
        ) : trackedPairs.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {trackedPairs.map((pair) => (
              <PairCard key={pair} pair={pair} tracked />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/10 bg-surface px-6 py-10 text-center">
            <p className="text-sm text-slate-400">No pairs tracked yet.</p>
            <Link
              href="/settings#tracked-pairs"
              className="rounded-lg border border-brand-500/30 bg-brand-500/10 px-4 py-2 text-sm font-medium text-brand-300 transition-colors hover:bg-brand-500/15"
            >
              Add pairs in Settings
            </Link>
          </div>
        )}
      </div>

      {/* All available pairs */}
      {untrackedPairs.length > 0 && (
        <div>
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-white">All Available Pairs</h2>
            <p className="text-xs text-slate-500">Not tracked — still fully available for analysis.</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {untrackedPairs.map((pair) => (
              <PairCard key={pair} pair={pair} tracked={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

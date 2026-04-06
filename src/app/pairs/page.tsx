"use client";

import Link from "next/link";

import { ALL_PAIRS } from "@/config/trading";
import { useTrackedPairs } from "@/hooks";
import { Card, CardHeader } from "@/components/ui";

export default function PairsPage() {
  const { trackedPairs, loading, error } = useTrackedPairs();

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Currency Pairs</h1>
          <p className="mt-1 text-sm text-gray-500">
            Your tracked list lives here. Add or remove symbols in Settings, then open any tracked pair for full analysis.
          </p>
        </div>

        <Link
          href="/settings#tracked-pairs"
          className="inline-flex items-center justify-center rounded-lg bg-surface-lighter px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-white"
        >
          Manage Pairs
        </Link>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      <Card>
        <CardHeader>Tracked Pairs</CardHeader>
        {loading ? (
          <div className="text-sm text-gray-500">Loading tracked pairs...</div>
        ) : trackedPairs.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {trackedPairs.map((pair) => (
              <Link
                key={pair}
                href={`/pairs/${pair}`}
                className="card cursor-pointer transition-colors hover:border-brand-500/30"
              >
                <div className="text-sm font-semibold">{pair}</div>
                <div className="mt-1 text-xs text-gray-500">Open workspace</div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-white/10 bg-surface px-4 py-6 text-sm text-gray-500">
            No tracked pairs yet. Open Settings and add at least one symbol to rebuild the workspace.
          </div>
        )}
      </Card>

      <Card>
        <CardHeader>Available Universe</CardHeader>
        <p className="mb-4 text-sm text-gray-400">
          These are the currently supported symbols. You can turn any of them on or off from Settings.
        </p>
        <div className="flex flex-wrap gap-2">
          {ALL_PAIRS.map((pair) => {
            const active = trackedPairs.includes(pair);

            return (
              <span
                key={pair}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] ${
                  active
                    ? "border-green-400/40 bg-green-500/15 text-green-200"
                    : "border-white/10 bg-white/5 text-slate-400"
                }`}
              >
                {pair}
              </span>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

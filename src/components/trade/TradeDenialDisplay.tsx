"use client";

import { TradeDenial } from "@/types";

interface TradeDenialDisplayProps {
  denials: TradeDenial[];
}

export function TradeDenialDisplay({ denials }: TradeDenialDisplayProps) {
  if (denials.length === 0) return null;

  return (
    <div className="rounded-xl border-2 border-red-500/30 bg-red-500/5 p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-lg">!</span>
        <span className="text-sm font-bold text-red-400">
          TRADE DENIED - {denials.length} reason{denials.length > 1 ? "s" : ""}
        </span>
      </div>
      <div className="space-y-2">
        {denials.map((denial, index) => (
          <div
            key={index}
            className="flex gap-2 rounded-lg border border-red-500/10 bg-surface p-2.5"
          >
            <span className="mt-0.5 text-xs text-red-400">•</span>
            <div>
              <div className="text-xs font-semibold uppercase text-red-300">
                {denial.reason.replace(/_/g, " ")}
              </div>
              <p className="mt-0.5 text-xs text-gray-400">{denial.explanation}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-gray-600">
        Capital protection is priority #1. &quot;No trade&quot; is a valid outcome.
      </p>
    </div>
  );
}

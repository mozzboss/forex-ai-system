"use client";

import Link from "next/link";

import { ALL_PAIRS } from "@/config/trading";
import { cn, getBiasColor } from "@/lib/utils";
import { Bias, CurrencyPair } from "@/types";

interface HeatmapEntry {
  pair: CurrencyPair;
  score: number;
  bias: Bias;
}

interface SetupHeatmapProps {
  data: HeatmapEntry[];
  confirmedPairs?: Set<string>;
}

export function SetupHeatmap({ data, confirmedPairs }: SetupHeatmapProps) {
  const sorted = [...data].sort((a, b) => b.score - a.score);

  if (sorted.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 bg-surface px-4 py-6 text-sm text-gray-500">
        No tracked pairs yet. Add symbols in Settings to bring the heatmap back.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1.5">
      {sorted.map(({ pair, score, bias }) => {
        const intensity = score / 10;
        const isConfirmed = confirmedPairs?.has(pair) ?? false;
        const bgColor =
          bias === "bullish"
            ? `rgba(34, 197, 94, ${intensity * 0.3})`
            : bias === "bearish"
              ? `rgba(239, 68, 68, ${intensity * 0.3})`
              : `rgba(107, 114, 128, ${intensity * 0.2})`;

        return (
          <Link
            key={pair}
            href={`/pairs/${pair}`}
            className={cn(
              "relative cursor-pointer rounded-lg border p-2 text-center transition-all hover:border-white/15",
              isConfirmed ? "border-green-500/40" : "border-white/5"
            )}
            style={{ backgroundColor: bgColor }}
          >
            {isConfirmed ? (
              <span className="absolute right-1.5 top-1.5 flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
              </span>
            ) : null}
            <div className="text-[10px] font-mono text-gray-400">{pair}</div>
            <div className={cn("mt-0.5 text-xs font-bold", getBiasColor(bias))}>
              {score}/10
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export function SetupHeatmapPlaceholder() {
  const mock: HeatmapEntry[] = ALL_PAIRS.slice(0, 12).map((pair) => ({
    pair,
    score: Math.floor(Math.random() * 6) + 3,
    bias: ["bullish", "bearish", "neutral"][Math.floor(Math.random() * 3)] as Bias,
  }));
  return <SetupHeatmap data={mock} />;
}

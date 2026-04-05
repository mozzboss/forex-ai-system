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
}

export function SetupHeatmap({ data }: SetupHeatmapProps) {
  const sorted = [...data].sort((a, b) => b.score - a.score);

  return (
    <div className="grid grid-cols-3 gap-1.5">
      {sorted.map(({ pair, score, bias }) => {
        const intensity = score / 10;
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
            className="cursor-pointer rounded-lg border border-white/5 p-2 text-center transition-all hover:border-white/15"
            style={{ backgroundColor: bgColor }}
          >
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

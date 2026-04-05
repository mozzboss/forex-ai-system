"use client";

import Link from "next/link";

import { getPricePrecision } from "@/config/trading";
import { EntryStatus, TradeSetup } from "@/types";
import { cn, getBiasColor, getStatusBg, getStatusColor } from "@/lib/utils";

interface ActiveSetup extends TradeSetup {
  entryStatus: EntryStatus;
  score: number;
}

interface ActiveSetupsProps {
  setups: ActiveSetup[];
}

export function ActiveSetups({ setups }: ActiveSetupsProps) {
  if (setups.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-gray-600">
        No active setups right now. Patience is discipline.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {setups.map((setup, index) => {
        const bias = setup.direction === "LONG" ? "bullish" : "bearish";
        return (
          <Link
            key={`${setup.pair}-${index}`}
            href={`/pairs/${setup.pair}`}
            className="block rounded-lg border border-white/5 bg-surface p-4 transition-all hover:border-white/15"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">{setup.pair}</span>
                <span className={cn("text-xs font-semibold uppercase", getBiasColor(bias))}>
                  {setup.direction}
                </span>
                <span className="text-[10px] capitalize text-gray-500">
                  {setup.setupType.replace("_", " ")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "rounded border px-1.5 py-0.5 text-[10px] font-bold",
                    getStatusBg(setup.entryStatus),
                    getStatusColor(setup.entryStatus)
                  )}
                >
                  {setup.entryStatus}
                </span>
                <span className="text-xs font-mono text-gray-400">{setup.score}/10</span>
              </div>
            </div>
            <div className="grid gap-4 text-xs sm:grid-cols-3">
              <div>
                <span className="text-gray-500">Entry Zone</span>
                <div className="mt-0.5 font-mono">
                  {setup.entryZone.low.toFixed(getPricePrecision(setup.pair))}-{setup.entryZone.high.toFixed(getPricePrecision(setup.pair))}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Stop Loss</span>
                <div className="mt-0.5 font-mono text-red-400">{setup.stopLoss.toFixed(getPricePrecision(setup.pair))}</div>
              </div>
              <div>
                <span className="text-gray-500">Take Profit</span>
                <div className="mt-0.5 font-mono text-green-400">{setup.takeProfit.toFixed(getPricePrecision(setup.pair))}</div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export function ActiveSetupsPlaceholder() {
  return <ActiveSetups setups={[]} />;
}

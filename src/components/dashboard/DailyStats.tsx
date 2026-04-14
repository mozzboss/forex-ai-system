"use client";

import { cn } from "@/lib/utils";

interface DailyStatsProps {
  tradesCount: number;
  winRate: number;
  pnl: number;
  disciplineScore: number;
}

export function DailyStats({ tradesCount, winRate, pnl, disciplineScore }: DailyStatsProps) {
  return (
    <div className="space-y-4">
      <StatRow label="Trades Today" value={`${tradesCount}`} />
      <StatRow
        label="Win Rate"
        value={winRate > 0 ? `${winRate}%` : "-"}
        color={winRate >= 60 ? "text-green-400" : winRate >= 40 ? "text-yellow-400" : "text-red-400"}
      />
      <StatRow
        label="P&L"
        value={pnl !== 0 ? `${pnl >= 0 ? "+" : ""}$${pnl.toFixed(2)}` : "-"}
        color={pnl > 0 ? "text-green-400" : pnl < 0 ? "text-red-400" : "text-gray-400"}
      />
      <div className="border-t border-white/5 pt-3">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-xs text-gray-500">Discipline Score</span>
          <span
            className={cn(
              "text-sm font-bold",
              disciplineScore >= 8 ? "text-green-400" : disciplineScore >= 5 ? "text-yellow-400" : "text-red-400"
            )}
          >
            {disciplineScore > 0 ? `${disciplineScore}/10` : "-"}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              disciplineScore >= 8 ? "bg-green-500" : disciplineScore >= 5 ? "bg-yellow-500" : "bg-red-500"
            )}
            style={{ width: `${(disciplineScore / 10) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function StatRow({
  label,
  value,
  color = "text-white",
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-500">{label}</span>
      <span className={cn("text-sm font-semibold", color)}>{value}</span>
    </div>
  );
}

export function DailyStatsPlaceholder() {
  return <DailyStats tradesCount={0} winRate={0} pnl={0} disciplineScore={0} />;
}

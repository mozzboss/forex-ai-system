import { cn } from "@/lib/utils";
import type { DecisionMode } from "@/lib/market/decision";

interface DecisionPanelProps {
  mode: DecisionMode;
  title?: string;
  reason: string;
  action: string;
  details?: string[];
  compact?: boolean;
  stickyMobile?: boolean;
  className?: string;
}

const MODE_COPY: Record<DecisionMode, { label: string; badge: string; tone: string; bg: string }> = {
  trade_now: {
    label: "TRADE NOW",
    badge: "Conditions aligned",
    tone: "text-green-300",
    bg: "border-green-500/25 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.18),_transparent_40%),rgba(15,23,42,0.92)]",
  },
  wait: {
    label: "WAIT",
    badge: "No entry yet",
    tone: "text-yellow-300",
    bg: "border-yellow-500/25 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.16),_transparent_40%),rgba(15,23,42,0.92)]",
  },
  exit_now: {
    label: "EXIT NOW",
    badge: "Protect capital",
    tone: "text-red-300",
    bg: "border-red-500/25 bg-[radial-gradient(circle_at_top_left,_rgba(239,68,68,0.16),_transparent_40%),rgba(15,23,42,0.92)]",
  },
};

export function DecisionPanel({
  mode,
  title = "Decision",
  reason,
  action,
  details = [],
  compact = false,
  stickyMobile = false,
  className,
}: DecisionPanelProps) {
  const copy = MODE_COPY[mode];

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 sm:p-5",
        copy.bg,
        stickyMobile && "sticky top-3 z-30 lg:static",
        className
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{title}</div>
          <div className={cn("mt-2 text-2xl font-bold tracking-tight", copy.tone)}>{copy.label}</div>
          <div className="mt-2 inline-flex rounded-full border border-white/10 bg-slate-950/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
            {copy.badge}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-950/30 px-4 py-3 sm:max-w-[240px]">
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">What to do</div>
          <div className="mt-2 text-sm font-semibold text-white">{action}</div>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-300">{reason}</p>

      {!compact && details.length > 0 ? (
        <div className="mt-4 grid gap-2 lg:grid-cols-2">
          {details.map((detail, index) => (
            <div
              key={index}
              className="rounded-xl border border-white/5 bg-slate-950/25 px-4 py-3 text-sm leading-6 text-slate-300"
            >
              {detail}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

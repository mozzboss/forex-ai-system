"use client";

import { NewsEvent } from "@/types";
import { cn } from "@/lib/utils";

interface NewsCountdownProps {
  events: NewsEvent[];
}

export function NewsCountdown({ events }: NewsCountdownProps) {
  if (events.length === 0) {
    return (
      <div className="text-sm text-gray-600 text-center py-4">
        No upcoming high-impact events
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {events.map((event, i) => {
        const impactColor = {
          high: "text-red-400 bg-red-400/10",
          medium: "text-yellow-400 bg-yellow-400/10",
          low: "text-gray-400 bg-gray-400/10",
        }[event.impact];

        const time = new Date(event.time);
        const now = new Date();
        const diffMs = time.getTime() - now.getTime();
        const diffMin = Math.round(diffMs / 60000);

        const timeLabel =
          diffMin <= 0
            ? "NOW"
            : diffMin < 60
            ? `${diffMin}m`
            : `${Math.floor(diffMin / 60)}h ${diffMin % 60}m`;

        return (
          <div
            key={i}
            className="flex items-center gap-3 p-2.5 rounded-lg bg-surface border border-white/5"
          >
            <span
              className={cn(
                "text-[10px] font-bold uppercase px-1.5 py-0.5 rounded",
                impactColor
              )}
            >
              {event.impact}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate">{event.event}</div>
              <div className="text-[10px] text-gray-500">{event.currency}</div>
            </div>
            <div
              className={cn(
                "text-xs font-mono font-bold",
                diffMin <= 30 ? "text-red-400" : diffMin <= 60 ? "text-yellow-400" : "text-gray-400"
              )}
            >
              {timeLabel}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Placeholder
export function NewsCountdownPlaceholder() {
  const now = Date.now();
  const mock: NewsEvent[] = [
    { time: new Date(now + 25 * 60000), currency: "USD", event: "Non-Farm Payrolls", impact: "high" },
    { time: new Date(now + 90 * 60000), currency: "EUR", event: "ECB Rate Decision", impact: "high" },
    { time: new Date(now + 180 * 60000), currency: "GBP", event: "CPI y/y", impact: "medium" },
  ];
  return <NewsCountdown events={mock} />;
}

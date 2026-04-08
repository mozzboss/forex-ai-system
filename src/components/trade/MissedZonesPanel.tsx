"use client";

import Link from "next/link";

import { Card, CardHeader } from "@/components/ui";
import { useMissedZones } from "@/hooks/useMissedZones";

function formatPrice(value: number) {
  return value.toFixed(value >= 10 ? 3 : 5);
}

function formatRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

interface MissedZonesPanelProps {
  pair?: string;
  limit?: number;
}

export function MissedZonesPanel({ pair, limit = 10 }: MissedZonesPanelProps) {
  const { zones, loading, error } = useMissedZones(pair, limit);

  if (loading) return null;

  if (error) {
    return (
      <Card className="border-red-500/20 bg-red-500/5">
        <CardHeader>Missed Confirmed Zones</CardHeader>
        <p className="text-sm text-red-400">{error}</p>
      </Card>
    );
  }

  if (zones.length === 0) return null;

  return (
    <Card className="border-amber-500/25 bg-amber-500/10">
      <CardHeader>Missed Confirmed Zones</CardHeader>
      <p className="mb-4 text-sm text-slate-400">
        CONFIRMED setups with no trade logged within 2 hours. Review conditions before acting.
      </p>

      <div className="space-y-3">
        {zones.map((zone) => (
          <div
            key={zone.analysisId}
            className="rounded-xl border border-amber-500/20 bg-surface p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/pairs/${zone.pair}`}
                  className="text-sm font-bold text-white hover:text-amber-300"
                >
                  {zone.pair}
                </Link>
                {zone.direction ? (
                  <span
                    className={`rounded px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
                      zone.direction === "LONG"
                        ? "bg-green-500/15 text-green-400"
                        : "bg-red-500/15 text-red-400"
                    }`}
                  >
                    {zone.direction}
                  </span>
                ) : null}
                {zone.setupType ? (
                  <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[11px] uppercase tracking-wide text-slate-400">
                    {zone.setupType.replace(/_/g, " ")}
                  </span>
                ) : null}
              </div>

              <div className="flex items-center gap-3">
                {zone.aiScore != null ? (
                  <span className="text-xs text-slate-500">{zone.aiScore}/10</span>
                ) : null}
                <span className="text-xs text-amber-500/70">{formatRelativeTime(zone.missedAt)}</span>
              </div>
            </div>

            {zone.entryZone ? (
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
                <span>
                  Zone{" "}
                  <span className="font-medium text-white">
                    {formatPrice(zone.entryZone.low)} – {formatPrice(zone.entryZone.high)}
                  </span>
                </span>
                {zone.stopLoss != null ? (
                  <span>
                    SL <span className="font-medium text-red-400">{formatPrice(zone.stopLoss)}</span>
                  </span>
                ) : null}
                {zone.takeProfit != null ? (
                  <span>
                    TP <span className="font-medium text-green-400">{formatPrice(zone.takeProfit)}</span>
                  </span>
                ) : null}
              </div>
            ) : null}

            <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400">
              {zone.confirmationReason}
            </p>
            {zone.confirmationReason.length > 120 ? (
              <Link
                href={`/pairs/${zone.pair}`}
                className="mt-0.5 text-[11px] text-slate-600 hover:text-slate-400"
              >
                more
              </Link>
            ) : null}

            <div className="mt-3">
              <Link
                href={`/pairs/${zone.pair}`}
                className="text-xs font-medium text-amber-400 hover:text-amber-300"
              >
                Re-run analysis
              </Link>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-slate-600">
        Only shows setups confirmed more than 30 min ago with no trade logged within 2 hours.
      </p>
    </Card>
  );
}

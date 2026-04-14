import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { EntryStatus, Bias, DenialReason } from "@/types";
import { getDenialExplanation } from "@/lib/risk/engine";

// --- Tailwind class merge utility ---
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Formatters ---

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatPips(pips: number): string {
  return `${pips.toFixed(1)} pips`;
}

export function formatRR(rr: number): string {
  return `1:${rr.toFixed(1)}`;
}

export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function formatLotSize(lots: number): string {
  return lots.toFixed(2);
}

// --- Status Colors ---

export function getStatusColor(status: EntryStatus): string {
  switch (status) {
    case "WAIT":      return "text-yellow-400";
    case "READY":     return "text-blue-400";
    case "CONFIRMED": return "text-green-400";
    case "INVALID":   return "text-red-400";
  }
}

export function getStatusBg(status: EntryStatus): string {
  switch (status) {
    case "WAIT":      return "bg-yellow-400/10 border-yellow-400/30";
    case "READY":     return "bg-blue-400/10 border-blue-400/30";
    case "CONFIRMED": return "bg-green-400/10 border-green-400/30";
    case "INVALID":   return "bg-red-400/10 border-red-400/30";
  }
}

export function getBiasColor(bias: Bias): string {
  switch (bias) {
    case "bullish": return "text-green-400";
    case "bearish": return "text-red-400";
    case "neutral": return "text-gray-400";
  }
}

// --- Denial formatter ---

export function formatDenials(reasons: DenialReason[]): string[] {
  return reasons.map((r) => getDenialExplanation(r));
}

// --- Time helpers ---

export function isWithinSession(
  session: { start: string; end: string },
  now: Date = new Date()
): boolean {
  const [startH, startM] = session.start.split(":").map(Number);
  const [endH, endM] = session.end.split(":").map(Number);

  const utcH = now.getUTCHours();
  const utcM = now.getUTCMinutes();
  const nowMinutes = utcH * 60 + utcM;
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  return nowMinutes >= startMinutes && nowMinutes <= endMinutes;
}

export type KillZoneStatus =
  | { active: true; label: string; endsAt: string }
  | { active: false; nextLabel: string | null; nextStartsAt: string | null };

/**
 * Returns whether the current UTC time is inside an ICT kill zone.
 * Requires the killZones config to be passed in to avoid circular imports.
 */
export function getKillZoneStatus(
  killZones: Record<string, { start: string; end: string; label: string }>,
  now: Date = new Date()
): KillZoneStatus {
  const utcH = now.getUTCHours();
  const utcM = now.getUTCMinutes();
  const nowMinutes = utcH * 60 + utcM;

  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  // Check if currently inside any kill zone
  for (const zone of Object.values(killZones)) {
    const start = toMinutes(zone.start);
    const end = toMinutes(zone.end);
    if (nowMinutes >= start && nowMinutes <= end) {
      return { active: true, label: zone.label, endsAt: zone.end };
    }
  }

  // Find next upcoming kill zone today (by UTC start time)
  const upcoming = Object.values(killZones)
    .map((zone) => ({ ...zone, startMinutes: toMinutes(zone.start) }))
    .filter((zone) => zone.startMinutes > nowMinutes)
    .sort((a, b) => a.startMinutes - b.startMinutes);

  if (upcoming.length > 0) {
    return { active: false, nextLabel: upcoming[0].label, nextStartsAt: upcoming[0].start };
  }

  return { active: false, nextLabel: null, nextStartsAt: null };
}

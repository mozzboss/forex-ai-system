"use client";

import { useEffect, useState } from "react";
import { TRADING_CONFIG } from "@/config/trading";
import { cn } from "@/lib/utils";

interface Session {
  name: string;
  start: string; // "HH:MM" UTC
  end: string;   // "HH:MM" UTC
  color: string;
  pairs: string;
  description: string;
}

const SESSIONS: Session[] = [
  {
    name: "Asia",
    start: "00:00",
    end: "09:00",
    color: "text-yellow-400",
    pairs: "USDJPY, AUDUSD, NZDUSD",
    description: "Active for JPY, AUD, NZD pairs. Avoid EUR/GBP.",
  },
  {
    name: "London",
    start: "07:00",
    end: "16:00",
    color: "text-blue-400",
    pairs: "EURUSD, GBPUSD, EURGBP",
    description: "Highest volume session. Best setups form here.",
  },
  {
    name: "New York",
    start: "12:00",
    end: "21:00",
    color: "text-green-400",
    pairs: "EURUSD, GBPUSD, USDCAD, XAUUSD",
    description: "Strong moves, especially during London/NY overlap.",
  },
];

function parseUTCTime(hhmm: string): { h: number; m: number } {
  const [h, m] = hhmm.split(":").map(Number);
  return { h, m };
}

function utcMinutes(date: Date): number {
  return date.getUTCHours() * 60 + date.getUTCMinutes();
}

function sessionMinutes(hhmm: string): number {
  const { h, m } = parseUTCTime(hhmm);
  return h * 60 + m;
}

function isInSession(session: Session, now: Date): boolean {
  const current = utcMinutes(now);
  const start = sessionMinutes(session.start);
  const end = sessionMinutes(session.end);
  return current >= start && current < end;
}

function minutesUntilSession(session: Session, now: Date): number {
  const current = utcMinutes(now);
  let start = sessionMinutes(session.start);
  if (start <= current) start += 24 * 60; // next day
  return start - current;
}

function formatCountdown(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function formatUTCTime(date: Date): string {
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC",
  });
}

function formatNYTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "America/New_York",
  });
}

export function SessionClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const activeSessions = SESSIONS.filter((s) => isInSession(s, now));
  const isLondon = activeSessions.some((s) => s.name === "London");
  const isNewYork = activeSessions.some((s) => s.name === "New York");
  const isAsia = activeSessions.some((s) => s.name === "Asia");
  const isOverlap = isLondon && isNewYork;
  const isActive = isLondon || isNewYork || isAsia;

  // Find next session to open
  const inactiveSessions = SESSIONS.filter((s) => !isInSession(s, now));
  const nextSession = inactiveSessions
    .map((s) => ({ session: s, minutesAway: minutesUntilSession(s, now) }))
    .sort((a, b) => a.minutesAway - b.minutesAway)[0];

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Session Clock</div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="font-mono text-sm font-semibold text-slate-300">
              {formatNYTime(now)}
            </div>
            <div className="text-[10px] uppercase tracking-[0.15em] text-slate-600">New York</div>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="text-right">
            <div className="font-mono text-sm font-semibold text-slate-300">
              {formatUTCTime(now)}
            </div>
            <div className="text-[10px] uppercase tracking-[0.15em] text-slate-600">UTC</div>
          </div>
        </div>
      </div>

      {/* Trading status */}
      <div className={cn(
        "rounded-xl px-4 py-3 border",
        isOverlap
          ? "border-green-500/30 bg-green-500/10"
          : isLondon || isNewYork
          ? "border-blue-500/30 bg-blue-500/10"
          : isAsia
          ? "border-yellow-500/30 bg-yellow-500/10"
          : "border-slate-500/20 bg-slate-500/5"
      )}>
        <div className="flex items-center gap-2">
          <span className={cn(
            "h-2.5 w-2.5 rounded-full animate-pulse",
            isOverlap ? "bg-green-400" : isLondon || isNewYork ? "bg-blue-400" : isAsia ? "bg-yellow-400" : "bg-slate-600"
          )} />
          <span className={cn(
            "text-sm font-semibold",
            isOverlap ? "text-green-300" : isLondon || isNewYork ? "text-blue-300" : isAsia ? "text-yellow-300" : "text-slate-500"
          )}>
            {isOverlap
              ? "London / New York Overlap — Best time to trade"
              : isLondon
              ? "London Session Active — Good conditions"
              : isNewYork
              ? "New York Session Active — Good conditions"
              : isAsia
              ? "Asia Session Active — JPY, AUD, NZD pairs"
              : "No Active Session — Wait"}
          </span>
        </div>
        {!isActive && nextSession && (
          <p className="mt-1.5 text-xs text-slate-400">
            Next: <span className="text-white font-medium">{nextSession.session.name}</span> opens in{" "}
            <span className="text-yellow-300 font-semibold">{formatCountdown(nextSession.minutesAway)}</span>
          </p>
        )}
        {isActive && (
          <p className="mt-1.5 text-xs text-slate-400">
            {isOverlap
              ? "Highest institutional volume of the day. Best R:R setups occur here."
              : isLondon
              ? "Strong EUR, GBP pairs. Watch for London open breakouts."
              : isNewYork
              ? "USD pairs most active. High-impact US news drives moves."
              : "Focus on USDJPY, AUDUSD, NZDUSD, AUDJPY. Avoid EUR/GBP pairs."}
          </p>
        )}
      </div>

      {/* Session bars */}
      <div className="space-y-2">
        {SESSIONS.map((session) => {
          const active = isInSession(session, now);
          const current = utcMinutes(now);
          const start = sessionMinutes(session.start);
          const end = sessionMinutes(session.end);
          const progress = active ? ((current - start) / (end - start)) * 100 : 0;

          return (
            <div key={session.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 rounded-full", active ? "bg-current animate-pulse" : "bg-slate-600", session.color)} />
                  <span className={cn("font-semibold", active ? session.color : "text-slate-500")}>
                    {session.name}
                  </span>
                  {active && (
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-slate-300">LIVE</span>
                  )}
                </div>
                <span className="text-slate-500 font-mono">
                  {session.start} – {session.end} UTC
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/5">
                <div
                  className={cn("h-full rounded-full transition-all duration-1000",
                    active
                      ? session.name === "London" ? "bg-blue-400" : session.name === "New York" ? "bg-green-400" : "bg-yellow-400"
                      : "bg-transparent"
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
              {active && (
                <p className="text-[10px] text-slate-500">{session.pairs}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

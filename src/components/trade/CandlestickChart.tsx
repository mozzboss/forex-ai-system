"use client";

import { MarketTimeframe } from "@/lib/market/timeframes";
import { getPricePrecision } from "@/config/trading";
import { TRADING_CONFIG } from "@/config/trading";
import { cn } from "@/lib/utils";
import type { CurrencyPair } from "@/types";

interface CandlestickBar {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface CandlestickChartProps {
  pair: CurrencyPair;
  bars: CandlestickBar[];
  timeframe?: MarketTimeframe;
  overlays?: ChartOverlay[];
  zones?: ChartZone[];
  markers?: ChartMarker[];
  showSessions?: boolean;
  showLiquiditySweeps?: boolean;
  className?: string;
}

export interface ChartOverlay {
  label: string;
  price: number;
  tone?: "support" | "resistance" | "entry" | "stop" | "target" | "neutral";
  dashed?: boolean;
}

export interface ChartZone {
  label: string;
  low: number;
  high: number;
  tone?: "support" | "resistance" | "entry" | "neutral";
}

export interface ChartMarker {
  label: string;
  price: number;
  time: string;
  tone?: "bullish" | "bearish" | "neutral";
  kind?: "swing-high" | "swing-low" | "bos" | "choch";
}

interface SessionRange {
  label: string;
  start: string;
  end: string;
  tone: string;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getOverlayStyle(tone: NonNullable<ChartOverlay["tone"]>) {
  switch (tone) {
    case "support":
      return { stroke: "#22c55e", fill: "rgba(34,197,94,0.14)" };
    case "resistance":
      return { stroke: "#ef4444", fill: "rgba(239,68,68,0.14)" };
    case "entry":
      return { stroke: "#3b82f6", fill: "rgba(59,130,246,0.14)" };
    case "stop":
      return { stroke: "#f97316", fill: "rgba(249,115,22,0.14)" };
    case "target":
      return { stroke: "#a855f7", fill: "rgba(168,85,247,0.14)" };
    default:
      return { stroke: "#94a3b8", fill: "rgba(148,163,184,0.14)" };
  }
}

function getZoneStyle(tone: NonNullable<ChartZone["tone"]>) {
  switch (tone) {
    case "support":
      return { stroke: "rgba(34,197,94,0.32)", fill: "rgba(34,197,94,0.08)", text: "#86efac" };
    case "resistance":
      return { stroke: "rgba(239,68,68,0.32)", fill: "rgba(239,68,68,0.08)", text: "#fca5a5" };
    case "entry":
      return { stroke: "rgba(59,130,246,0.36)", fill: "rgba(59,130,246,0.1)", text: "#93c5fd" };
    default:
      return { stroke: "rgba(148,163,184,0.28)", fill: "rgba(148,163,184,0.08)", text: "#cbd5e1" };
  }
}

function getMarkerStyle(marker: ChartMarker) {
  if (marker.kind === "bos") {
    return {
      fill: marker.tone === "bearish" ? "#f97316" : "#38bdf8",
      text: marker.tone === "bearish" ? "#fdba74" : "#7dd3fc",
    };
  }

  if (marker.kind === "choch") {
    return {
      fill: marker.tone === "bearish" ? "#ef4444" : "#a855f7",
      text: marker.tone === "bearish" ? "#fca5a5" : "#d8b4fe",
    };
  }

  if (marker.kind === "swing-high") {
    return { fill: "#f59e0b", text: "#fcd34d" };
  }

  if (marker.kind === "swing-low") {
    return { fill: "#22c55e", text: "#86efac" };
  }

  return { fill: "#94a3b8", text: "#cbd5e1" };
}

export function CandlestickChart({
  pair,
  bars,
  timeframe,
  overlays = [],
  zones = [],
  markers = [],
  showSessions = false,
  showLiquiditySweeps = false,
  className,
}: CandlestickChartProps) {
  if (bars.length === 0) {
    return (
      <div className={cn("rounded-xl border border-dashed border-white/10 bg-surface px-4 py-10 text-center text-sm text-gray-500", className)}>
        No candles available yet.
      </div>
    );
  }

  const precision = getPricePrecision(pair);
  const chartBars = bars.slice(-12);
  const highs = chartBars.map((bar) => bar.high);
  const lows = chartBars.map((bar) => bar.low);
  const overlayPrices = overlays.map((overlay) => overlay.price);
  const zoneHighs = zones.map((zone) => zone.high);
  const zoneLows = zones.map((zone) => zone.low);
  const maxPrice = Math.max(...highs, ...overlayPrices, ...zoneHighs);
  const minPrice = Math.min(...lows, ...overlayPrices, ...zoneLows);
  const priceRange = Math.max(maxPrice - minPrice, Number.EPSILON);
  const paddedRange = priceRange * 0.12;
  const topPrice = maxPrice + paddedRange;
  const bottomPrice = minPrice - paddedRange;
  const drawableRange = Math.max(topPrice - bottomPrice, Number.EPSILON);

  const width = 720;
  const height = 260;
  const padding = { top: 18, right: 16, bottom: 42, left: 16 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  const candleSlot = innerWidth / chartBars.length;
  const candleWidth = clamp(candleSlot * 0.42, 10, 26);

  const toY = (price: number) =>
    padding.top + ((topPrice - price) / drawableRange) * innerHeight;
  const markerLookup = new Map(chartBars.map((bar, index) => [bar.time, index]));
  const sessionRanges = showSessions ? buildSessionRanges(chartBars) : [];
  const sweepMarkers = showLiquiditySweeps ? detectLiquiditySweeps(chartBars) : [];
  const mergedMarkers = [...markers, ...sweepMarkers];

  const priceTicks = [topPrice, topPrice - drawableRange / 2, bottomPrice];

  return (
    <div className={cn("rounded-2xl border border-white/10 bg-slate-950/35 p-3", className)}>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-64 w-full overflow-visible">
        <defs>
          <linearGradient id="candleBackdrop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(59,130,246,0.12)" />
            <stop offset="100%" stopColor="rgba(15,23,42,0)" />
          </linearGradient>
        </defs>

        <rect
          x={padding.left}
          y={padding.top}
          width={innerWidth}
          height={innerHeight}
          rx="18"
          fill="url(#candleBackdrop)"
        />

        {priceTicks.map((tick) => {
          const y = toY(tick);
          return (
            <g key={tick}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="rgba(148,163,184,0.16)"
                strokeDasharray="4 6"
              />
              <text
                x={width - padding.right}
                y={y - 6}
                textAnchor="end"
                fontSize="11"
                fill="rgba(148,163,184,0.92)"
              >
                {tick.toFixed(precision)}
              </text>
            </g>
          );
        })}

        {zones.map((zone) => {
          const topY = toY(zone.high);
          const bottomY = toY(zone.low);
          const heightPx = Math.max(bottomY - topY, 10);
          const y = Math.min(topY, bottomY);
          const { stroke, fill, text } = getZoneStyle(zone.tone || "neutral");

          return (
            <g key={`${zone.label}-${zone.low}-${zone.high}`}>
              <rect
                x={padding.left}
                y={y}
                width={innerWidth}
                height={heightPx}
                fill={fill}
                stroke={stroke}
                strokeDasharray="5 5"
                rx="10"
              />
              <rect
                x={padding.left + 8}
                y={y + 6}
                width={144}
                height={20}
                rx="10"
                fill="rgba(15,23,42,0.86)"
                stroke={stroke}
              />
              <text x={padding.left + 18} y={y + 19} fontSize="10.5" fill={text}>
                {zone.label}: {zone.low.toFixed(precision)} - {zone.high.toFixed(precision)}
              </text>
            </g>
          );
        })}

        {overlays.map((overlay) => {
          const y = toY(overlay.price);
          const { stroke, fill } = getOverlayStyle(overlay.tone || "neutral");

          return (
            <g key={`${overlay.label}-${overlay.price}`}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke={stroke}
                strokeWidth="1.5"
                strokeDasharray={overlay.dashed ? "6 5" : "0"}
              />
              <rect
                x={padding.left + 8}
                y={y - 13}
                width={108}
                height={20}
                rx="10"
                fill={fill}
                stroke={stroke}
                strokeOpacity="0.25"
              />
              <text x={padding.left + 18} y={y} dominantBaseline="middle" fontSize="10.5" fill={stroke}>
                {overlay.label}: {overlay.price.toFixed(precision)}
              </text>
            </g>
          );
        })}

        {sessionRanges.map((session) => {
          const startIndex = markerLookup.get(session.start);
          const endIndex = markerLookup.get(session.end) ?? chartBars.length - 1;
          if (startIndex === undefined || endIndex === undefined) return null;

          const startX = padding.left + candleSlot * startIndex;
          const endX = padding.left + candleSlot * (endIndex + 1);

          return (
            <g key={`${session.label}-${session.start}`}>
              <rect
                x={startX}
                y={padding.top}
                width={Math.max(endX - startX, 8)}
                height={innerHeight}
                fill={session.tone}
                opacity="0.08"
              />
              <text
                x={startX + 8}
                y={padding.top + 16}
                fontSize="10"
                fill="rgba(226,232,240,0.8)"
              >
                {session.label}
              </text>
            </g>
          );
        })}

        {chartBars.map((bar, index) => {
          const centerX = padding.left + candleSlot * index + candleSlot / 2;
          const openY = toY(bar.open);
          const closeY = toY(bar.close);
          const highY = toY(bar.high);
          const lowY = toY(bar.low);
          const bodyTop = Math.min(openY, closeY);
          const bodyHeight = Math.max(Math.abs(closeY - openY), 2);
          const bullish = bar.close >= bar.open;
          const fill = bullish ? "#22c55e" : "#ef4444";
          const shadow = bullish ? "rgba(34,197,94,0.32)" : "rgba(239,68,68,0.32)";

          return (
            <g key={bar.time}>
              <line
                x1={centerX}
                y1={highY}
                x2={centerX}
                y2={lowY}
                stroke={shadow}
                strokeWidth="2"
                strokeLinecap="round"
              />
              <rect
                x={centerX - candleWidth / 2}
                y={bodyTop}
                width={candleWidth}
                height={bodyHeight}
                rx="4"
                fill={fill}
                opacity="0.94"
              />
              <text
                x={centerX}
                y={height - 12}
                textAnchor="middle"
                fontSize="10"
                fill="rgba(148,163,184,0.92)"
              >
                {new Date(bar.time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </text>
            </g>
          );
        })}

        {mergedMarkers.map((marker) => {
          const markerIndex = markerLookup.get(marker.time);
          if (markerIndex === undefined) {
            return null;
          }

          const centerX = padding.left + candleSlot * markerIndex + candleSlot / 2;
          const y = toY(marker.price);
          const style = getMarkerStyle(marker);
          const textY = marker.kind === "swing-low" ? y + 22 : y - 12;

          return (
            <g key={`${marker.kind}-${marker.time}-${marker.label}`}>
              <circle cx={centerX} cy={y} r="4.5" fill={style.fill} stroke="rgba(15,23,42,0.9)" strokeWidth="2" />
              <text
                x={centerX}
                y={textY}
                textAnchor="middle"
                fontSize="10.5"
                fontWeight="700"
                fill={style.text}
              >
                {marker.label}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-400 sm:grid-cols-6">
        <LegendItem label="Bullish candle" value="Close above open" tone="bg-green-500" />
        <LegendItem label="Bearish candle" value="Close below open" tone="bg-red-500" />
        <LegendItem label="Structure" value="SH / SL / BOS / CHOCH" tone="bg-cyan-400" />
        <LegendItem label="High" value={maxPrice.toFixed(precision)} />
        <LegendItem label="Low" value={minPrice.toFixed(precision)} />
        <LegendItem label="Timeframe" value={timeframe || "15min"} />
      </div>
    </div>
  );
}

function LegendItem({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-surface px-3 py-2">
      <div className="flex items-center gap-2">
        {tone ? <span className={cn("h-2.5 w-2.5 rounded-full", tone)} /> : null}
        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{label}</div>
      </div>
      <div className="mt-1 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

function buildSessionRanges(bars: CandlestickBar[]): SessionRange[] {
  if (bars.length === 0) return [];
  const day = new Date(bars[bars.length - 1].time);
  const toIso = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    const d = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), h, m, 0));
    return d.toISOString();
  };

  return [
    { label: "London", start: toIso(TRADING_CONFIG.sessions.london.start), end: toIso(TRADING_CONFIG.sessions.london.end), tone: "#3b82f6" },
    { label: "New York", start: toIso(TRADING_CONFIG.sessions.newYork.start), end: toIso(TRADING_CONFIG.sessions.newYork.end), tone: "#22c55e" },
    { label: "Overlap", start: toIso(TRADING_CONFIG.sessions.overlapLonNy.start), end: toIso(TRADING_CONFIG.sessions.overlapLonNy.end), tone: "#22d3ee" },
  ];
}

function detectLiquiditySweeps(bars: CandlestickBar[]): ChartMarker[] {
  const markers: ChartMarker[] = [];
  for (let i = 1; i < bars.length; i++) {
    const prev = bars[i - 1];
    const curr = bars[i];

    const sweptHigh = curr.high > prev.high && curr.close < prev.high;
    if (sweptHigh) {
      markers.push({
        label: "SW",
        price: curr.high,
        time: curr.time,
        tone: "bearish",
        kind: "swing-high",
      });
    }

    const sweptLow = curr.low < prev.low && curr.close > prev.low;
    if (sweptLow) {
      markers.push({
        label: "SW",
        price: curr.low,
        time: curr.time,
        tone: "bullish",
        kind: "swing-low",
      });
    }
  }
  return markers.slice(-4);
}

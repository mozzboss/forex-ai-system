import { NextRequest, NextResponse } from "next/server";

import { AuthenticationError, requireAppUserId } from "@/lib/server/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/signals?days=30
// Returns signal accuracy stats: how many TAKE_TRADE alerts fired,
// how many became linked trades, and the win rate of those trades.
export async function GET(req: NextRequest) {
  try {
    const userId = await requireAppUserId(req);
    const { searchParams } = new URL(req.url);
    const days = Math.min(Math.max(parseInt(searchParams.get("days") ?? "30", 10), 1), 365);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // All TAKE_TRADE alerts in window
    const signals = await prisma.alertLog.findMany({
      where: {
        userId,
        alertType: "trade_now",
        sentAt: { gte: since },
      },
      include: {
        trades: {
          where: { status: { in: ["closed", "open", "pending"] } },
          select: { id: true, status: true, pnl: true, pair: true },
        },
      },
      orderBy: { sentAt: "desc" },
    });

    const totalSignals = signals.length;
    const signalsWithTrade = signals.filter((s) => s.trades.length > 0).length;

    const closedLinked = signals.flatMap((s) =>
      s.trades.filter((t) => t.status === "closed" && t.pnl !== null)
    );
    const wins = closedLinked.filter((t) => Number(t.pnl) > 0).length;
    const losses = closedLinked.filter((t) => Number(t.pnl) < 0).length;
    const winRate = closedLinked.length > 0 ? Math.round((wins / closedLinked.length) * 100) : null;
    const totalPnl = closedLinked.reduce((sum, t) => sum + Number(t.pnl), 0);

    // Per-pair breakdown
    const pairMap = new Map<string, { signals: number; trades: number; wins: number; losses: number; pnl: number }>();
    for (const s of signals) {
      const bucket = pairMap.get(s.pair) ?? { signals: 0, trades: 0, wins: 0, losses: 0, pnl: 0 };
      bucket.signals += 1;
      for (const t of s.trades) {
        if (t.status === "closed" && t.pnl !== null) {
          bucket.trades += 1;
          const p = Number(t.pnl);
          if (p > 0) bucket.wins += 1;
          else if (p < 0) bucket.losses += 1;
          bucket.pnl += p;
        }
      }
      pairMap.set(s.pair, bucket);
    }

    const byPair = Array.from(pairMap.entries())
      .map(([pair, v]) => ({
        pair,
        signals: v.signals,
        trades: v.trades,
        wins: v.wins,
        losses: v.losses,
        winRate: v.trades > 0 ? Math.round((v.wins / v.trades) * 100) : null,
        pnl: Math.round(v.pnl * 100) / 100,
      }))
      .sort((a, b) => b.signals - a.signals);

    const rankedByAccuracy = byPair.filter((row) => row.trades > 0);
    const bestSignalPair =
      rankedByAccuracy.length > 0
        ? [...rankedByAccuracy].sort(
            (a, b) => (b.winRate ?? -1) - (a.winRate ?? -1) || b.pnl - a.pnl
          )[0]
        : null;
    const worstSignalPair =
      rankedByAccuracy.length > 0
        ? [...rankedByAccuracy].sort(
            (a, b) => (a.winRate ?? 101) - (b.winRate ?? 101) || a.pnl - b.pnl
          )[0]
        : null;

    // READY alerts in the same window
    const readySignals = await prisma.alertLog.count({
      where: { userId, alertType: "ready", sentAt: { gte: since } },
    });

    return NextResponse.json({
      days,
      since: since.toISOString(),
      takeTradeSignals: totalSignals,
      signalsWithLinkedTrade: signalsWithTrade,
      signalsWithoutLinkedTrade: Math.max(totalSignals - signalsWithTrade, 0),
      conversionRate: totalSignals > 0 ? Math.round((signalsWithTrade / totalSignals) * 100) : null,
      closedLinkedTrades: closedLinked.length,
      wins,
      losses,
      winRate,
      totalPnl: Math.round(totalPnl * 100) / 100,
      readySignals,
      byPair,
      bestSignalPair,
      worstSignalPair,
    });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("Signals stats failed:", error);
    return NextResponse.json({ error: "Failed to load signal stats" }, { status: 500 });
  }
}

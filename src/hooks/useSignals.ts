"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";

export interface SignalStats {
  days: number;
  since: string;
  takeTradeSignals: number;
  signalsWithLinkedTrade: number;
  signalsWithoutLinkedTrade: number;
  conversionRate: number | null;
  closedLinkedTrades: number;
  wins: number;
  losses: number;
  winRate: number | null;
  totalPnl: number;
  readySignals: number;
  byPair: Array<{
    pair: string;
    signals: number;
    trades: number;
    wins: number;
    losses: number;
    winRate: number | null;
    pnl: number;
  }>;
  bestSignalPair: {
    pair: string;
    signals: number;
    trades: number;
    wins: number;
    losses: number;
    winRate: number | null;
    pnl: number;
  } | null;
  worstSignalPair: {
    pair: string;
    signals: number;
    trades: number;
    wins: number;
    losses: number;
    winRate: number | null;
    pnl: number;
  } | null;
}

export function useSignals(days = 30) {
  const { authFetch } = useAuth();
  const [stats, setStats] = useState<SignalStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch(`/api/signals?days=${days}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load signal stats");
      setStats(data as SignalStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load signal stats");
    } finally {
      setLoading(false);
    }
  }, [authFetch, days]);

  useEffect(() => { void fetch(); }, [fetch]);

  return { stats, loading, error, refetch: fetch };
}

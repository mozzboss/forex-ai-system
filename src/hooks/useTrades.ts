"use client";

import { useCallback, useEffect, useState } from "react";

import { useAuth } from "./useAuth";
import { Trade, TradeStatus } from "@/types";

function deserializeTrade(trade: Trade): Trade {
  return {
    ...trade,
    createdAt: new Date(trade.createdAt),
    openedAt: trade.openedAt ? new Date(trade.openedAt) : undefined,
    closedAt: trade.closedAt ? new Date(trade.closedAt) : undefined,
  };
}

interface FetchTradeOptions {
  status?: TradeStatus;
  accountId?: string;
  limit?: number;
  offset?: number;
}

export function useTrades(initialFilters: FetchTradeOptions = {}) {
  const { authFetch, user } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FetchTradeOptions>(initialFilters);

  const fetchTrades = useCallback(async (nextFilters?: FetchTradeOptions) => {
    if (!user) {
      setTrades([]);
      setTotal(0);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      const appliedFilters = nextFilters ?? filters;
      const params = new URLSearchParams();

      if (appliedFilters.status) params.set("status", appliedFilters.status);
      if (appliedFilters.accountId) params.set("accountId", appliedFilters.accountId);
      if (appliedFilters.limit) params.set("limit", String(appliedFilters.limit));
      if (appliedFilters.offset) params.set("offset", String(appliedFilters.offset));

      const query = params.toString();
      const res = await authFetch(`/api/trade${query ? `?${query}` : ""}`);

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to fetch trades");
      }

      const data = await res.json();
      setTrades((data.trades || []).map(deserializeTrade));
      setTotal(typeof data.total === "number" ? data.total : (data.trades || []).length);
      setFilters(appliedFilters);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load trades");
      console.error("Failed to load trades:", err);
    } finally {
      setLoading(false);
    }
  }, [authFetch, filters, user]);

  useEffect(() => {
    fetchTrades(initialFilters);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    trades,
    total,
    loading,
    error,
    filters,
    refetch: () => fetchTrades(filters),
    fetchTrades,
    setFilters,
  };
}

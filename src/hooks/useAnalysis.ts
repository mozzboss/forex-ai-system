"use client";

import { useCallback, useRef, useState } from "react";

import { useAuth } from "./useAuth";
import type { PairDecisionSignal } from "@/lib/market/decision";
import { CurrencyPair, FullAnalysis, TradeDenial, TradingAccount } from "@/types";

const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

interface AnalysisResult {
  analysis: FullAnalysis;
  denialResults: Record<string, { allowed: boolean; denials: TradeDenial[] }>;
  decisionSignal?: PairDecisionSignal;
}

interface CacheEntry {
  pair: CurrencyPair;
  result: AnalysisResult;
  fetchedAt: number;
}

function deserializeAnalysis(analysis: FullAnalysis): FullAnalysis {
  return {
    ...analysis,
    timestamp: new Date(analysis.timestamp),
    entryStatus: {
      ...analysis.entryStatus,
      updatedAt: new Date(analysis.entryStatus.updatedAt),
    },
    sessionAndNews: {
      ...analysis.sessionAndNews,
      upcomingEvents: (analysis.sessionAndNews.upcomingEvents || []).map((event) => ({
        ...event,
        time: new Date(event.time),
      })),
    },
  };
}

export function useAnalysis() {
  const { authFetch } = useAuth();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cachedAt, setCachedAt] = useState<number | null>(null);
  const cache = useRef<CacheEntry | null>(null);

  const analyze = useCallback(
    async (pair: CurrencyPair, accounts: TradingAccount[], marketData?: string) => {
      // Return cached result if same pair and within TTL
      const now = Date.now();
      if (
        cache.current &&
        cache.current.pair === pair &&
        now - cache.current.fetchedAt < CACHE_TTL_MS
      ) {
        setResult(cache.current.result);
        setCachedAt(cache.current.fetchedAt);
        setError(null);
        return cache.current.result;
      }

      try {
        setLoading(true);
        setError(null);
        setCachedAt(null);

        const res = await authFetch("/api/analysis", {
          method: "POST",
          body: JSON.stringify({ pair, accounts, marketData }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error || "Analysis failed");
        }

        const raw: AnalysisResult = await res.json();
        const data: AnalysisResult = {
          ...raw,
          analysis: deserializeAnalysis(raw.analysis),
        };

        cache.current = { pair, result: data, fetchedAt: now };
        setResult(data);
        setCachedAt(now);
        return data;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Analysis failed.";
        setError(msg);
        console.error(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [authFetch]
  );

  const restore = useCallback(
    (restoredPair: CurrencyPair, restoredResult: AnalysisResult, fetchedAt: number) => {
      const deserialized: AnalysisResult = {
        ...restoredResult,
        analysis: deserializeAnalysis(restoredResult.analysis),
      };
      cache.current = { pair: restoredPair, result: deserialized, fetchedAt };
      setResult(deserialized);
      setCachedAt(fetchedAt);
    },
    []
  );

  const clear = useCallback(() => {
    cache.current = null;
    setResult(null);
    setCachedAt(null);
    setError(null);
  }, []);

  return { result, loading, error, cachedAt, analyze, restore, clear };
}

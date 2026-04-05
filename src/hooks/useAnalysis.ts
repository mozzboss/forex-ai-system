"use client";

import { useCallback, useState } from "react";

import { useAuth } from "./useAuth";
import type { PairDecisionSignal } from "@/lib/market/decision";
import { CurrencyPair, FullAnalysis, TradeDenial, TradingAccount } from "@/types";

interface AnalysisResult {
  analysis: FullAnalysis;
  denialResults: Record<string, { allowed: boolean; denials: TradeDenial[] }>;
  decisionSignal?: PairDecisionSignal;
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

  const analyze = useCallback(
    async (pair: CurrencyPair, accounts: TradingAccount[], marketData?: string) => {
      try {
        setLoading(true);
        setError(null);

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
        setResult(data);
        return data;
      } catch (err) {
        const msg = "Analysis failed. Do not trade without analysis.";
        setError(msg);
        console.error(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [authFetch]
  );

  const clear = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, loading, error, analyze, clear };
}

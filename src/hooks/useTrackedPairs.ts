"use client";

import { useCallback, useEffect, useState } from "react";

import { CurrencyPair } from "@/types";
import { useAuth } from "./useAuth";

function deserializeTrackedPairs(value: unknown): CurrencyPair[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((pair): pair is CurrencyPair => typeof pair === "string") as CurrencyPair[];
}

export function useTrackedPairs() {
  const { authFetch, user } = useAuth();
  const [trackedPairs, setTrackedPairs] = useState<CurrencyPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrackedPairs = useCallback(async () => {
    if (!user) {
      setTrackedPairs([]);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      const res = await authFetch("/api/settings/pairs");

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to load tracked pairs");
      }

      const data = await res.json();
      setTrackedPairs(deserializeTrackedPairs(data.trackedPairs));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tracked pairs");
    } finally {
      setLoading(false);
    }
  }, [authFetch, user]);

  useEffect(() => {
    fetchTrackedPairs();
  }, [fetchTrackedPairs]);

  const saveTrackedPairs = useCallback(
    async (pairs: CurrencyPair[]) => {
      try {
        setSaving(true);
        const res = await authFetch("/api/settings/pairs", {
          method: "POST",
          body: JSON.stringify({ pairs }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error || "Failed to save tracked pairs");
        }

        const data = await res.json();
        const nextPairs = deserializeTrackedPairs(data.trackedPairs);
        setTrackedPairs(nextPairs);
        setError(null);
        return nextPairs;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save tracked pairs");
        return null;
      } finally {
        setSaving(false);
      }
    },
    [authFetch]
  );

  return {
    trackedPairs,
    loading,
    saving,
    error,
    refetch: fetchTrackedPairs,
    saveTrackedPairs,
  };
}

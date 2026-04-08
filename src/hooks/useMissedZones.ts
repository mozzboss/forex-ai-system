"use client";

import { useCallback, useEffect, useState } from "react";

import { useAuth } from "./useAuth";
import type { MissedConfirmedZone } from "@/types";

export type { MissedConfirmedZone };

export function useMissedZones(pair?: string, limit = 10) {
  const { authFetch, user } = useAuth();
  const [zones, setZones] = useState<MissedConfirmedZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchZones = useCallback(async () => {
    if (!user) {
      setZones([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const params = new URLSearchParams({ limit: String(limit) });
      if (pair) params.set("pair", pair);
      const res = await authFetch(`/api/analysis/missed-zones?${params}`);
      if (!res.ok) throw new Error("Failed to fetch missed zones");
      const data = await res.json();
      const raw: MissedConfirmedZone[] = data.missedZones ?? [];
      setZones(
        raw.map((z) => ({ ...z, missedAt: new Date(z.missedAt) }))
      );
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load missed zones");
    } finally {
      setLoading(false);
    }
  }, [authFetch, pair, limit, user]);

  useEffect(() => {
    fetchZones();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { zones, loading, error, refetch: fetchZones };
}

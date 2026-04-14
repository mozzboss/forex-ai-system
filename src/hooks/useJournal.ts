"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { JournalEntry } from "@/types";

function deserializeEntry(entry: JournalEntry): JournalEntry {
  return {
    ...entry,
    date: new Date(entry.date),
  };
}

export function useJournal() {
  const { authFetch, user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(async (type?: string) => {
    if (!user) {
      setEntries([]);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      const params = type ? `?type=${type}` : "";
      const res = await authFetch(`/api/journal${params}`);
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to fetch journal entries");
      }
      const data = await res.json();
      setEntries((data.entries || []).map(deserializeEntry));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load journal");
      console.error("Failed to load journal:", err);
    } finally {
      setLoading(false);
    }
  }, [authFetch, user]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const addEntry = async (entry: {
    type: string;
    content: string;
    tradeId?: string;
    mistakes?: string[];
    disciplineScore?: number;
    tags?: string[];
  }) => {
    try {
      const res = await authFetch("/api/journal", {
        method: "POST",
        body: JSON.stringify(entry),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to save journal entry");
      }

      const data = await res.json();
      const savedEntry = deserializeEntry(data.entry);
      setEntries((prev) => [savedEntry, ...prev]);
      setError(null);
      return savedEntry;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save journal entry");
      console.error("Failed to save journal entry:", err);
      return null;
    }
  };

  return { entries, loading, error, fetchEntries, addEntry };
}

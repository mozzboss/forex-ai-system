"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { Trade, TradingAccount } from "@/types";

function deserializeTrade(trade: Trade): Trade {
  return {
    ...trade,
    createdAt: new Date(trade.createdAt),
    openedAt: trade.openedAt ? new Date(trade.openedAt) : undefined,
    closedAt: trade.closedAt ? new Date(trade.closedAt) : undefined,
  };
}

function deserializeAccount(account: TradingAccount): TradingAccount {
  return {
    ...account,
    createdAt: new Date(account.createdAt),
    updatedAt: new Date(account.updatedAt),
    openTrades: (account.openTrades || []).map(deserializeTrade),
  };
}

export function useAccounts() {
  const { authFetch, user } = useAuth();
  const [accounts, setAccounts] = useState<TradingAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    if (!user) {
      setAccounts([]);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      const res = await authFetch("/api/accounts");
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to fetch accounts");
      }
      const data = await res.json();
      setAccounts((data.accounts || []).map(deserializeAccount));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load accounts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [authFetch, user]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const resetDaily = async () => {
    try {
      const res = await authFetch("/api/accounts", {
        method: "POST",
        body: JSON.stringify({ action: "reset_daily" }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to reset daily counters");
      }

      await fetchAccounts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset daily counters");
      console.error("Failed to reset daily counters:", err);
    }
  };

  const create = async (account: Partial<TradingAccount>) => {
    try {
      const res = await authFetch("/api/accounts", {
        method: "POST",
        body: JSON.stringify({ action: "create", account }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to create account");
      }

      const data = await res.json();
      await fetchAccounts();
      return deserializeAccount(data.account);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account");
      console.error("Failed to create account:", err);
      return null;
    }
  };

  const update = async (account: Partial<TradingAccount> & { id: string }) => {
    try {
      const res = await authFetch("/api/accounts", {
        method: "POST",
        body: JSON.stringify({ action: "update", account }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to update account");
      }

      const data = await res.json();
      await fetchAccounts();
      return deserializeAccount(data.account);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update account");
      console.error("Failed to update account:", err);
      return null;
    }
  };

  return {
    accounts,
    loading,
    error,
    refetch: fetchAccounts,
    resetDaily,
    createAccount: create,
    updateAccount: update,
  };
}

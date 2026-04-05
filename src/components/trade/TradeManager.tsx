"use client";

import { useMemo, useState } from "react";

import { useAuth } from "@/hooks";
import { formatCurrency } from "@/lib/utils";
import { getPipMultiplier, getPricePrecision } from "@/config/trading";
import type { Trade, TradingAccount } from "@/types";
import { Button, Card, CardHeader, StatusBadge } from "@/components/ui";

interface TradeManagerProps {
  trades: Trade[];
  accounts: TradingAccount[];
  refreshing?: boolean;
  onRefresh: () => Promise<void> | void;
}

interface TradeDraft {
  pnl: string;
  pipsPnl: string;
  closePrice: string;
  notes: string;
  review: string;
  disciplineScore: string;
}

interface TradeFeedback {
  tone: "success" | "error";
  message: string;
}

function getDefaultDraft(trade: Trade): TradeDraft {
  return {
    pnl: typeof trade.pnl === "number" ? trade.pnl.toString() : "",
    pipsPnl: typeof trade.pipsPnl === "number" ? trade.pipsPnl.toString() : "",
    closePrice: "",
    notes: trade.notes || "",
    review: "",
    disciplineScore: "",
  };
}

function calcPipsFromClose(trade: Trade, closePrice: number): number {
  const multiplier = getPipMultiplier(trade.pair);
  const rawPips = (closePrice - trade.entryPrice) * multiplier;
  return Math.round((trade.direction === "LONG" ? rawPips : -rawPips) * 10) / 10;
}

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function TradeManager({ trades, accounts, refreshing = false, onRefresh }: TradeManagerProps) {
  const { authFetch } = useAuth();
  const [drafts, setDrafts] = useState<Record<string, TradeDraft>>({});
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [feedbackByTrade, setFeedbackByTrade] = useState<Record<string, TradeFeedback>>({});

  const accountNameById = useMemo(
    () => Object.fromEntries(accounts.map((account) => [account.id, account.name])),
    [accounts]
  );

  const activeTrades = useMemo(
    () => trades.filter((trade) => trade.status === "open" || trade.status === "pending"),
    [trades]
  );

  const recentTrades = useMemo(
    () => trades.filter((trade) => trade.status !== "open" && trade.status !== "pending").slice(0, 6),
    [trades]
  );

  const getDraft = (trade: Trade) => drafts[trade.id] || getDefaultDraft(trade);

  const setDraftValue = (trade: Trade, field: keyof TradeDraft, value: string) => {
    setDrafts((current) => ({
      ...current,
      [trade.id]: {
        ...getDefaultDraft(trade),
        ...current[trade.id],
        [field]: value,
      },
    }));
  };

  const setFeedback = (tradeId: string, tone: "success" | "error", message: string) => {
    setFeedbackByTrade((current) => ({
      ...current,
      [tradeId]: { tone, message },
    }));
  };

  const appendJournalReview = async (trade: Trade, draft: TradeDraft) => {
    const disciplineScore = toNumber(draft.disciplineScore);
    const content = draft.review.trim();

    if (!content && !disciplineScore) {
      return;
    }

    const res = await authFetch("/api/journal", {
      method: "POST",
      body: JSON.stringify({
        type: "trade",
        tradeId: trade.id,
        content:
          content ||
          `Closed ${trade.pair} ${trade.direction} with realized P&L ${draft.pnl || "0"}.`,
        disciplineScore,
        tags: [trade.pair.toLowerCase(), trade.direction.toLowerCase(), "review"],
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.error || "Trade updated, but the journal review could not be saved.");
    }
  };

  const closeTrade = async (trade: Trade) => {
    const draft = getDraft(trade);
    const pnl = toNumber(draft.pnl);
    const pipsPnl = draft.pipsPnl.trim() ? toNumber(draft.pipsPnl) : undefined;

    if (typeof pnl !== "number") {
      setFeedback(trade.id, "error", "Enter the realized P&L before closing the trade.");
      return;
    }

    setActiveActionId(`${trade.id}:close`);

    try {
      const res = await authFetch("/api/trade", {
        method: "POST",
        body: JSON.stringify({
          action: "update",
          tradeId: trade.id,
          updates: {
            status: "closed",
            pnl,
            pipsPnl,
            notes: draft.notes.trim() || undefined,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to close trade.");
      }

      await appendJournalReview(trade, draft);
      await onRefresh();
      setFeedback(trade.id, "success", "Trade closed successfully.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to close trade.";
      setFeedback(trade.id, "error", message);
    } finally {
      setActiveActionId(null);
    }
  };

  const cancelTrade = async (trade: Trade) => {
    const draft = getDraft(trade);
    setActiveActionId(`${trade.id}:cancel`);

    try {
      const res = await authFetch("/api/trade", {
        method: "POST",
        body: JSON.stringify({
          action: "update",
          tradeId: trade.id,
          updates: {
            status: "cancelled",
            notes: draft.notes.trim() || undefined,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to cancel trade.");
      }

      if (draft.review.trim()) {
        await authFetch("/api/journal", {
          method: "POST",
          body: JSON.stringify({
            type: "review",
            tradeId: trade.id,
            content: draft.review.trim(),
            tags: [trade.pair.toLowerCase(), "cancelled"],
          }),
        });
      }

      await onRefresh();
      setFeedback(trade.id, "success", "Pending trade cancelled.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to cancel trade.";
      setFeedback(trade.id, "error", message);
    } finally {
      setActiveActionId(null);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardHeader className="mb-1">Trade Manager</CardHeader>
            <p className="text-sm text-gray-400">
              Close live trades, cancel pending ones, and save a linked review without leaving the dashboard.
            </p>
          </div>
          <Button variant="secondary" onClick={onRefresh} disabled={refreshing || activeActionId !== null} className="w-full sm:w-auto">
            {refreshing ? "Refreshing..." : "Refresh Trades"}
          </Button>
        </div>

        <div className="space-y-4">
          {activeTrades.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 bg-surface px-4 py-8 text-center text-sm text-gray-500">
              No open or pending trades right now. That is a healthy place to be when nothing is confirmed.
            </div>
          ) : (
            activeTrades.map((trade) => {
              const draft = getDraft(trade);
              const feedback = feedbackByTrade[trade.id];
              return (
                <div key={trade.id} className="rounded-xl border border-white/5 bg-surface p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="text-lg font-semibold text-white">{trade.pair}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                        <span className={trade.direction === "LONG" ? "text-green-400" : "text-red-400"}>
                          {trade.direction}
                        </span>
                        <span className="text-gray-500">{trade.setupType.replace("_", " ")}</span>
                        <span className="text-gray-500">{accountNameById[trade.accountId] || "Unknown account"}</span>
                      </div>
                    </div>
                    <StatusBadge status={trade.entryStatus} size="sm" />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
                    <Metric label="Entry" value={trade.entryPrice.toFixed(getPricePrecision(trade.pair))} />
                    <Metric label="Stop Loss" value={trade.stopLoss.toFixed(getPricePrecision(trade.pair))} />
                    <Metric label="Take Profit" value={trade.takeProfit.toFixed(getPricePrecision(trade.pair))} />
                    <Metric label="Risk" value={formatCurrency(trade.riskAmount)} />
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {trade.status === "open" ? (
                      <>
                        <InputField
                          label="Realized P&L ($)"
                          value={draft.pnl}
                          onChange={(value) => setDraftValue(trade, "pnl", value)}
                          placeholder="125.50"
                        />
                        <InputField
                          label={`Close Price (auto-fills pips)`}
                          value={draft.closePrice}
                          onChange={(value) => {
                            setDraftValue(trade, "closePrice", value);
                            const cp = Number(value);
                            if (Number.isFinite(cp) && cp > 0) {
                              setDraftValue(trade, "pipsPnl", calcPipsFromClose(trade, cp).toString());
                            }
                          }}
                          placeholder={trade.entryPrice.toFixed(getPricePrecision(trade.pair))}
                        />
                        <InputField
                          label="Pips"
                          value={draft.pipsPnl}
                          onChange={(value) => setDraftValue(trade, "pipsPnl", value)}
                          placeholder="18.4"
                        />
                      </>
                    ) : null}

                    <InputField
                      label="Trade Notes"
                      value={draft.notes}
                      onChange={(value) => setDraftValue(trade, "notes", value)}
                      placeholder="Execution notes, SL move, or reason for cancel."
                    />
                    <InputField
                      label={trade.status === "open" ? "Discipline Score" : "Review Note"}
                      value={trade.status === "open" ? draft.disciplineScore : draft.review}
                      onChange={(value) =>
                        setDraftValue(trade, trade.status === "open" ? "disciplineScore" : "review", value)
                      }
                      placeholder={trade.status === "open" ? "1-10" : "Why the pending trade was cancelled."}
                    />
                  </div>

                  {trade.status === "open" ? (
                    <label className="mt-3 block">
                      <span className="text-sm text-gray-400">Trade Review</span>
                      <textarea
                        value={draft.review}
                        onChange={(event) => setDraftValue(trade, "review", event.target.value)}
                        placeholder="What happened, what did you do well, and what needs to improve next time?"
                        className="mt-1 h-24 w-full rounded-lg border border-white/10 bg-surface-light px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                      />
                    </label>
                  ) : null}

                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    {trade.status === "open" ? (
                      <Button
                        onClick={() => closeTrade(trade)}
                        disabled={activeActionId !== null}
                        className="w-full sm:w-auto"
                      >
                        {activeActionId === `${trade.id}:close` ? "Closing..." : "Close Trade"}
                      </Button>
                    ) : null}

                    {trade.status === "pending" ? (
                      <Button
                        variant="secondary"
                        onClick={() => cancelTrade(trade)}
                        disabled={activeActionId !== null}
                        className="w-full sm:w-auto"
                      >
                        {activeActionId === `${trade.id}:cancel` ? "Cancelling..." : "Cancel Pending"}
                      </Button>
                    ) : null}
                  </div>

                  {feedback ? (
                    <div
                      className={`mt-3 rounded-lg px-3 py-2 text-sm ${
                        feedback.tone === "success"
                          ? "border border-green-500/20 bg-green-500/10 text-green-200"
                          : "border border-red-500/20 bg-red-500/10 text-red-200"
                      }`}
                    >
                      {feedback.message}
                    </div>
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      </Card>

      <Card>
        <CardHeader>Recent Trade Outcomes</CardHeader>
        <div className="space-y-3">
          {recentTrades.length === 0 ? (
            <div className="text-sm text-gray-500">No closed, cancelled, or denied trades recorded yet.</div>
          ) : (
            recentTrades.map((trade) => (
              <div key={trade.id} className="rounded-xl border border-white/5 bg-surface p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {trade.pair} {trade.direction}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {accountNameById[trade.accountId] || "Unknown account"} • {trade.status}
                    </div>
                  </div>
                  <div
                    className={`text-sm font-semibold ${
                      typeof trade.pnl === "number"
                        ? trade.pnl > 0
                          ? "text-green-400"
                          : trade.pnl < 0
                            ? "text-red-400"
                            : "text-gray-400"
                        : "text-gray-400"
                    }`}
                  >
                    {typeof trade.pnl === "number" ? formatCurrency(trade.pnl) : trade.status.toUpperCase()}
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  {trade.notes || trade.aiReasoning || "No additional notes saved."}
                </p>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="text-sm text-gray-400">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-white/10 bg-surface-light px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
      />
    </label>
  );
}

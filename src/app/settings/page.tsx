"use client";

import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";

import { useAccounts, useAuth } from "@/hooks";
import { AccountMode, TelegramConnectionStatus, TradingAccount } from "@/types";
import { Button, Card, CardHeader } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";

interface AccountDraft {
  id?: string;
  name: string;
  mode: AccountMode;
  balance: string;
  equity: string;
  riskPercent: string;
  maxDailyLoss: string;
  maxDrawdown: string;
  maxTradesPerDay: string;
  isActive: boolean;
  currentDailyLoss: number;
  currentDailyTrades: number;
  lossesInARow: number;
}

type EditableAccountField =
  | "name"
  | "mode"
  | "balance"
  | "equity"
  | "riskPercent"
  | "maxDailyLoss"
  | "maxDrawdown"
  | "maxTradesPerDay"
  | "isActive";

function createDraft(account?: TradingAccount): AccountDraft {
  if (!account) {
    return {
      name: "",
      mode: "personal",
      balance: "0",
      equity: "0",
      riskPercent: "1",
      maxDailyLoss: "0",
      maxDrawdown: "0",
      maxTradesPerDay: "5",
      isActive: true,
      currentDailyLoss: 0,
      currentDailyTrades: 0,
      lossesInARow: 0,
    };
  }

  return {
    id: account.id,
    name: account.name,
    mode: account.mode,
    balance: account.balance.toString(),
    equity: account.equity.toString(),
    riskPercent: account.riskPercent.toString(),
    maxDailyLoss: account.maxDailyLoss.toString(),
    maxDrawdown: account.maxDrawdown.toString(),
    maxTradesPerDay: account.maxTradesPerDay.toString(),
    isActive: account.isActive,
    currentDailyLoss: account.currentDailyLoss,
    currentDailyTrades: account.currentDailyTrades,
    lossesInARow: account.lossesInARow,
  };
}

function parseNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function deserializeTelegramConnection(
  connection?: TelegramConnectionStatus | null
): TelegramConnectionStatus {
  return {
    isConnected: Boolean(connection?.isConnected),
    chatId: connection?.chatId,
    linkCode: connection?.linkCode,
    linkCodeExpiresAt: connection?.linkCodeExpiresAt
      ? new Date(connection.linkCodeExpiresAt)
      : undefined,
    alertsEnabled: connection?.alertsEnabled ?? true,
  };
}

export default function SettingsPage() {
  const { authFetch, user } = useAuth();
  const {
    accounts,
    loading,
    error,
    refetch,
    resetDaily,
    createAccount,
    updateAccount,
  } = useAccounts();
  const [drafts, setDrafts] = useState<Record<string, AccountDraft>>({});
  const [newDraft, setNewDraft] = useState<AccountDraft | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [telegramConnection, setTelegramConnection] = useState<TelegramConnectionStatus>({
    isConnected: false,
    alertsEnabled: true,
  });
  const [telegramLoading, setTelegramLoading] = useState(true);
  const [telegramError, setTelegramError] = useState<string | null>(null);
  const [telegramSavingAction, setTelegramSavingAction] = useState<string | null>(null);
  const [mtPayload, setMtPayload] = useState("");
  const [mtResult, setMtResult] = useState<string | null>(null);
  const [mtError, setMtError] = useState<string | null>(null);
  const [mtLoading, setMtLoading] = useState(false);

  useEffect(() => {
    setDrafts(
      Object.fromEntries(accounts.map((account) => [account.id, createDraft(account)]))
    );
  }, [accounts]);

  const fetchTelegramConnection = useCallback(async () => {
    if (!user) {
      setTelegramConnection({
        isConnected: false,
        alertsEnabled: true,
      });
      setTelegramLoading(false);
      setTelegramError(null);
      return;
    }

    try {
      setTelegramLoading(true);
      const res = await authFetch("/api/telegram/connection");

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to load Telegram connection");
      }

      const data = await res.json();
      setTelegramConnection(deserializeTelegramConnection(data.connection));
      setTelegramError(null);
    } catch (err) {
      setTelegramError(
        err instanceof Error ? err.message : "Failed to load Telegram connection"
      );
    } finally {
      setTelegramLoading(false);
    }
  }, [authFetch, user]);

  useEffect(() => {
    fetchTelegramConnection();
  }, [fetchTelegramConnection]);

  const settingsSummary = useMemo(() => {
    const activeAccounts = accounts.filter((account) => account.isActive);
    const fundedAccounts = accounts.filter((account) => account.mode === "funded");
    const personalAccounts = accounts.filter((account) => account.mode === "personal");
    const alertStatus =
      telegramConnection.isConnected && telegramConnection.alertsEnabled
        ? "Alerts live"
        : telegramConnection.isConnected
          ? "Linked / muted"
          : "Waiting";
    const totalBalance = accounts.reduce((total, account) => total + account.balance, 0);

    return {
      activeAccounts: activeAccounts.length.toString(),
      fundedAccounts: fundedAccounts.length.toString(),
      personalAccounts: personalAccounts.length.toString(),
      totalBalance: formatCurrency(totalBalance),
      telegramStatus: alertStatus,
    };
  }, [accounts, telegramConnection.isConnected, telegramConnection.alertsEnabled]);

  const setDraftValue = (
    id: string,
    field: EditableAccountField,
    value: string | boolean
  ) => {
    setDrafts((current) => ({
      ...current,
      [id]: {
        ...current[id],
        [field]: value,
      },
    }));
  };

  const buildPayload = (draft: AccountDraft): Partial<TradingAccount> => ({
    name: draft.name.trim(),
    mode: draft.mode,
    balance: parseNumber(draft.balance),
    equity: parseNumber(draft.equity),
    riskPercent: parseNumber(draft.riskPercent),
    maxDailyLoss: parseNumber(draft.maxDailyLoss),
    maxDrawdown: parseNumber(draft.maxDrawdown),
    maxTradesPerDay: parseNumber(draft.maxTradesPerDay),
    isActive: draft.isActive,
    currentDailyLoss: draft.currentDailyLoss,
    currentDailyTrades: draft.currentDailyTrades,
    lossesInARow: draft.lossesInARow,
  });

  const handleSaveExisting = async (accountId: string) => {
    const draft = drafts[accountId];
    if (!draft) return;

    setSavingId(accountId);
    await updateAccount({
      id: accountId,
      ...buildPayload(draft),
    });
    setSavingId(null);
  };

  const handleCreate = async () => {
    if (!newDraft) return;

    setSavingId("new");
    const created = await createAccount(buildPayload(newDraft));
    if (created) {
      setNewDraft(null);
    }
    setSavingId(null);
  };

  const runTelegramAction = useCallback(
    async (body: Record<string, unknown>, actionLabel: string) => {
      try {
        setTelegramSavingAction(actionLabel);
        const res = await authFetch("/api/telegram/connection", {
          method: "POST",
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error || "Failed to update Telegram connection");
        }

        const data = await res.json();
        setTelegramConnection(deserializeTelegramConnection(data.connection));
        setTelegramError(null);
      } catch (err) {
        setTelegramError(
          err instanceof Error ? err.message : "Failed to update Telegram connection"
        );
      } finally {
        setTelegramSavingAction(null);
      }
    },
    [authFetch]
  );

  const telegramInstructions = useMemo(() => {
    if (telegramConnection.isConnected) {
      return "This chat is linked. Trade lifecycle alerts will follow your enabled toggle below.";
    }

    if (telegramConnection.linkCode) {
      const expires = telegramConnection.linkCodeExpiresAt
        ? telegramConnection.linkCodeExpiresAt.toLocaleString()
        : "soon";
      return `Open your Telegram bot and send /start ${telegramConnection.linkCode}. This code expires at ${expires}.`;
    }

    return "Generate a one-time code, then open your Telegram bot and send /start CODE to connect this account.";
  }, [telegramConnection]);

  const importMt = useCallback(async () => {
    setMtResult(null);
    setMtError(null);
    if (!mtPayload.trim()) {
      setMtError("Paste a MetaTrader export payload first.");
      return;
    }

    try {
      setMtLoading(true);
      const parsed = JSON.parse(mtPayload);
      const res = await authFetch("/api/mt/import", {
        method: "POST",
        body: JSON.stringify(parsed),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || "Import failed");
      }

      setMtResult(
        `Imported ${data?.result?.imported ?? 0}, updated ${data?.result?.updated ?? 0}, skipped ${data?.result?.skipped ?? 0}`
      );
      setMtError(
        data?.result?.errors?.length
          ? data.result.errors.slice(0, 3).join(" | ")
          : null
      );
      await refetch();
    } catch (error) {
      setMtError(error instanceof Error ? error.message : "Import failed");
    } finally {
      setMtLoading(false);
    }
  }, [authFetch, mtPayload, refetch]);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <section className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.16),_transparent_35%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.96))] p-5 sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-green-300/80">
              Settings & Controls
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Manage accounts, guardrails, and alerts without loosening discipline.
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              This page controls risk posture, account availability, and Telegram delivery. Every change
              should make the system clearer and safer, not more impulsive.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="secondary" onClick={refetch} disabled={loading}>
              Refresh
            </Button>
            <Button variant="danger" onClick={resetDaily} disabled={loading}>
              Reset Daily Counters
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryPill label="Active Accounts" value={settingsSummary.activeAccounts} detail="currently enabled for planning and trade checks" />
          <SummaryPill label="Funded Accounts" value={settingsSummary.fundedAccounts} detail="subject to the stricter rule set" />
          <SummaryPill label="Total Balance" value={settingsSummary.totalBalance} detail="combined across configured accounts" />
          <SummaryPill label="Telegram" value={settingsSummary.telegramStatus} detail="current delivery status for alerts and bot commands" />
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          <ControlNote
            title="Funded posture"
            detail="Keep funded accounts tight: 0.25% to 0.5% risk, 3 trades max, and only 8+/10 quality."
          />
          <ControlNote
            title="Personal posture"
            detail="Personal accounts can breathe more, but the same discipline still applies. Never loosen stop loss rules."
          />
          <ControlNote
            title="Alert flow"
            detail="Telegram should help you slow down and review, not turn the system into a notification treadmill."
          />
        </div>
      </section>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardHeader>Trading Accounts</CardHeader>
          <p className="mb-4 text-sm leading-6 text-gray-400">
            Keep balances, drawdown limits, and trade caps accurate. These numbers shape every downstream risk and denial decision.
          </p>
          <div className="space-y-4">
            {loading && accounts.length === 0 ? (
              <div className="text-sm text-gray-500">Loading accounts...</div>
            ) : null}

            {accounts.map((account) => {
              const draft = drafts[account.id];
              if (!draft) return null;

              return (
                <AccountEditor
                  key={account.id}
                  draft={draft}
                  summary={account}
                  saving={savingId === account.id}
                  onChange={(field, value) => setDraftValue(account.id, field, value)}
                  onSave={() => handleSaveExisting(account.id)}
                />
              );
            })}

            {newDraft ? (
              <AccountEditor
                draft={newDraft}
                saving={savingId === "new"}
                onChange={(field, value) =>
                  setNewDraft((current) =>
                    current
                      ? {
                          ...current,
                          [field]: value,
                        }
                      : current
                  )
                }
                onSave={handleCreate}
                onCancel={() => setNewDraft(null)}
              />
            ) : (
              <Button variant="secondary" className="w-full" onClick={() => setNewDraft(createDraft())}>
                Add Account
              </Button>
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>Alert Preferences</CardHeader>
            <div className="space-y-3">
              <AlertRow
                label="Trade lifecycle alerts"
                status={telegramConnection.isConnected && telegramConnection.alertsEnabled ? "Live" : "Off"}
                detail="Create, close, cancel, and denial events are delivered through Telegram."
              />
              <AlertRow
                label="Setup and status reminders"
                status={telegramConnection.isConnected ? "Ready" : "Needs connection"}
                detail="The bot is linked and ready for pair checks, rules, and account snapshots."
              />
              <AlertRow
                label="News awareness"
                status="Available"
                detail="Telegram can already serve live calendar context through the /news command."
              />
              <AlertRow
                label="Daily planning"
                status="Next"
                detail="Morning briefings and end-of-day summaries are the next Telegram layer."
              />
            </div>
          </Card>

          <Card>
            <CardHeader>Risk Rule Snapshot</CardHeader>
            <div className="grid gap-3 sm:grid-cols-2">
              <RuleCard
                title="Funded rules"
                items={["0.25% to 0.5% risk", "3 trades per day", "Stop after 2 losses", "Need 8+/10 quality"]}
                tone="blue"
              />
              <RuleCard
                title="Personal rules"
                items={["1% to 2% risk", "5 trades per day", "Stop after 3 losses", "Need 7+/10 quality"]}
                tone="green"
              />
            </div>
            <p className="mt-4 text-sm leading-6 text-gray-400">
              These rules are not decoration. They shape the denial engine, risk engine, and what gets recorded as acceptable behavior.
            </p>
          </Card>

          <Card>
            <CardHeader>Telegram Connection</CardHeader>
            <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[linear-gradient(135deg,_rgba(30,41,59,0.95),_rgba(15,23,42,0.92))] p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${
                      telegramConnection.isConnected ? "bg-green-400" : "bg-yellow-400"
                    }`}
                  />
                  <div>
                    <div className="text-sm font-medium text-white">
                      {telegramConnection.isConnected ? "Connected" : "Waiting for connection"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {telegramConnection.chatId
                        ? `Chat ${telegramConnection.chatId}`
                        : "No Telegram chat linked yet"}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {!telegramConnection.isConnected ? (
                    <Button
                      variant="secondary"
                      onClick={() => runTelegramAction({ action: "generate_code" }, "generate_code")}
                      disabled={telegramLoading || telegramSavingAction === "generate_code"}
                    >
                      {telegramSavingAction === "generate_code" ? "Generating..." : "Generate Code"}
                    </Button>
                  ) : (
                    <Button
                      variant="danger"
                      onClick={() => runTelegramAction({ action: "unlink" }, "unlink")}
                      disabled={telegramSavingAction === "unlink"}
                    >
                      {telegramSavingAction === "unlink" ? "Disconnecting..." : "Unlink Telegram"}
                    </Button>
                  )}
                </div>
              </div>

              {telegramConnection.linkCode ? (
                <div className="rounded-xl border border-brand-500/20 bg-brand-500/10 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-brand-300">One-time code</div>
                  <div className="mt-2 font-mono text-2xl font-semibold tracking-[0.35em] text-white">
                    {telegramConnection.linkCode}
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    Expires{" "}
                    {telegramConnection.linkCodeExpiresAt
                      ? telegramConnection.linkCodeExpiresAt.toLocaleString()
                      : "soon"}
                  </div>
                </div>
              ) : null}

              <div className="flex flex-col gap-3 rounded-xl border border-white/5 bg-surface-light p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-medium text-white">Telegram alerts</div>
                  <div className="text-xs text-gray-500">
                    Trade create, deny, close, and cancel messages follow this toggle.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    runTelegramAction(
                      {
                        action: "set_alerts",
                        enabled: !telegramConnection.alertsEnabled,
                      },
                      "set_alerts"
                    )
                  }
                  disabled={telegramSavingAction === "set_alerts" || telegramLoading}
                  className={`inline-flex h-9 w-20 items-center rounded-full border px-1 transition ${
                    telegramConnection.alertsEnabled
                      ? "border-green-400/40 bg-green-400/15"
                      : "border-white/10 bg-surface"
                  }`}
                >
                  <span
                    className={`h-7 w-7 rounded-full bg-white transition ${
                      telegramConnection.alertsEnabled ? "translate-x-11" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-400">
              {telegramLoading ? "Loading Telegram connection..." : telegramInstructions}
            </p>
            {telegramError ? (
              <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {telegramError}
              </div>
            ) : null}
          </Card>

          <Card>
            <CardHeader>MetaTrader Read-Only Import</CardHeader>
            <p className="mb-3 text-sm text-gray-400">
              Paste a JSON export of MT positions/history. This only records data; it never sends orders.
            </p>
            <textarea
              className="h-40 w-full rounded-lg border border-white/10 bg-surface-light px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              placeholder='{"positions":[{"externalRef":"123456","pair":"EURUSD","direction":"LONG","status":"open","entryPrice":1.085,"lotSize":0.5,"openedAt":"2026-04-04T12:00:00Z"}]}'
              value={mtPayload}
              onChange={(event) => setMtPayload(event.target.value)}
            />
            <div className="mt-3 flex gap-3">
              <Button onClick={importMt} disabled={mtLoading}>
                {mtLoading ? "Importing..." : "Import Positions"}
              </Button>
              <Button variant="secondary" onClick={() => { setMtPayload(""); setMtResult(null); setMtError(null); }}>
                Clear
              </Button>
            </div>
            {mtResult ? (
              <div className="mt-3 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-200">
                {mtResult}
              </div>
            ) : null}
            {mtError ? (
              <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {mtError}
              </div>
            ) : null}
          </Card>
        </div>
      </div>
    </div>
  );
}

function AccountEditor({
  draft,
  summary,
  saving,
  onChange,
  onSave,
  onCancel,
}: {
  draft: AccountDraft;
  summary?: TradingAccount;
  saving: boolean;
  onChange: (field: EditableAccountField, value: string | boolean) => void;
  onSave: () => void;
  onCancel?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[linear-gradient(135deg,_rgba(30,41,59,0.96),_rgba(15,23,42,0.92))] p-4 sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-base font-semibold text-white">{draft.name || "New Account"}</div>
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] ${
                draft.mode === "funded"
                  ? "bg-blue-500/10 text-blue-300"
                  : "bg-green-500/10 text-green-300"
              }`}
            >
              {draft.mode}
            </span>
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] ${
                draft.isActive
                  ? "bg-green-500/10 text-green-300"
                  : "bg-slate-500/10 text-slate-300"
              }`}
            >
              {draft.isActive ? "active" : "paused"}
            </span>
          </div>
          <div className="mt-2 text-sm text-slate-400">
            {draft.mode === "funded"
              ? "Stricter filtering with tighter risk and lower tolerance for mediocre setups."
              : "More flexible than funded rules, but still bounded by hard risk limits and no-impulse execution."}
          </div>
        </div>
        {summary ? (
          <div className="grid min-w-[180px] grid-cols-2 gap-2 text-right text-xs text-gray-500">
            <MetricPill label="Open" value={summary.openTrades.length.toString()} />
            <MetricPill label="Today" value={summary.currentDailyTrades.toString()} />
            <MetricPill label="Daily Loss" value={formatCurrency(summary.currentDailyLoss)} />
            <MetricPill label="Loss Streak" value={summary.lossesInARow.toString()} />
          </div>
        ) : null}
      </div>

      <div className="mb-4 grid gap-3 rounded-2xl border border-white/10 bg-slate-950/30 p-4 md:grid-cols-4">
        <MetricPill label="Balance" value={formatCurrency(parseNumber(draft.balance))} />
        <MetricPill label="Equity" value={formatCurrency(parseNumber(draft.equity))} />
        <MetricPill label="Risk %" value={`${parseNumber(draft.riskPercent).toFixed(2)}%`} />
        <MetricPill label="Trades / Day" value={draft.maxTradesPerDay || "0"} />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        <InputField label="Name" value={draft.name} onChange={(value) => onChange("name", value)} />
        <SelectField label="Mode" value={draft.mode} onChange={(value) => onChange("mode", value)}>
          <option value="funded">Funded</option>
          <option value="personal">Personal</option>
        </SelectField>
        <InputField label="Balance" value={draft.balance} onChange={(value) => onChange("balance", value)} />
        <InputField label="Equity" value={draft.equity} onChange={(value) => onChange("equity", value)} />
        <InputField
          label="Risk %"
          value={draft.riskPercent}
          onChange={(value) => onChange("riskPercent", value)}
        />
        <InputField
          label="Max Daily Loss"
          value={draft.maxDailyLoss}
          onChange={(value) => onChange("maxDailyLoss", value)}
        />
        <InputField
          label="Max Drawdown"
          value={draft.maxDrawdown}
          onChange={(value) => onChange("maxDrawdown", value)}
        />
        <InputField
          label="Max Trades/Day"
          value={draft.maxTradesPerDay}
          onChange={(value) => onChange("maxTradesPerDay", value)}
        />
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm text-gray-400">
        <input
          type="checkbox"
          checked={draft.isActive}
          onChange={(event) => onChange("isActive", event.target.checked)}
          className="h-4 w-4 rounded border-white/10 bg-surface"
        />
        Account active
      </label>

      <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/20 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-slate-400">
          {draft.mode === "funded"
            ? "Keep this account conservative. If the numbers drift from the prop firm rules, fix them before the next analysis."
            : "Personal accounts still need clean max loss and drawdown values so the denial engine stays honest."}
        </div>
        <div className="flex gap-2">
        <Button onClick={onSave} disabled={saving}>
          {saving ? "Saving..." : draft.id ? "Save Account" : "Create Account"}
        </Button>
        {onCancel ? (
          <Button variant="ghost" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
        ) : null}
        </div>
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm text-gray-400">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-lg border border-white/10 bg-surface-light px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: AccountMode) => void;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm text-gray-400">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as AccountMode)}
        className="mt-1 w-full rounded-lg border border-white/10 bg-surface-light px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
      >
        {children}
      </select>
    </label>
  );
}

function AlertRow({
  label,
  status,
  detail,
}: {
  label: string;
  status: string;
  detail: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/5 bg-surface px-3 py-2">
      <div>
        <div className="text-sm text-gray-300">{label}</div>
        <div className="text-xs text-gray-500">{detail}</div>
      </div>
      <span className="text-xs text-gray-500">{status}</span>
    </div>
  );
}

function SummaryPill({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/25 px-4 py-3">
      <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</div>
      <div className="mt-2 text-lg font-semibold text-white">{value}</div>
      <div className="mt-1 text-sm text-slate-400">{detail}</div>
    </div>
  );
}

function ControlNote({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/20 px-4 py-3">
      <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{title}</div>
      <p className="mt-2 text-sm leading-6 text-slate-300">{detail}</p>
    </div>
  );
}

function RuleCard({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "blue" | "green";
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/25 p-4">
      <div className={tone === "blue" ? "text-xs font-semibold uppercase tracking-[0.2em] text-blue-300" : "text-xs font-semibold uppercase tracking-[0.2em] text-green-300"}>
        {title}
      </div>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div key={item} className="rounded-xl border border-white/5 bg-surface px-3 py-2 text-sm text-gray-300">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/25 px-3 py-2">
      <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

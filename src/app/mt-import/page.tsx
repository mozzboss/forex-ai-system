"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

import { Button, Card, CardHeader } from "@/components/ui";
import { ALL_PAIRS } from "@/config/trading";
import { useAccounts, useAuth } from "@/hooks";
import { cn } from "@/lib/utils";
import type { CurrencyPair, TradeDirection } from "@/types";

// ── Types ──────────────────────────────────────────────────────────────────

interface MtRow {
  externalRef: string;
  accountName: string;
  pair: string;
  direction: string;
  status: string;
  entryPrice: string;
  stopLoss: string;
  takeProfit: string;
  lotSize: string;
  openedAt: string;
  closedAt: string;
  pnl: string;
  pipsPnl: string;
  notes: string;
}

interface ParsedRow {
  raw: MtRow;
  valid: boolean;
  errors: string[];
  accountId?: string;
}

interface ImportResult {
  imported: number;
  updated: number;
  skipped: number;
  errors: string[];
}

// ── CSV parsing ─────────────────────────────────────────────────────────────

const EXPECTED_HEADERS = [
  "externalRef",
  "accountName",
  "pair",
  "direction",
  "status",
  "entryPrice",
  "stopLoss",
  "takeProfit",
  "lotSize",
  "openedAt",
  "closedAt",
  "pnl",
  "pipsPnl",
  "notes",
] as const;

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }

  result.push(current.trim());
  return result;
}

function parseCsv(raw: string): MtRow[] {
  const lines = raw.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]).map((h) => h.replace(/^"|"$/g, ""));
  const headerMap = new Map(headers.map((h, i) => [h, i]));

  const get = (row: string[], key: string) => {
    const idx = headerMap.get(key);
    return idx !== undefined ? (row[idx] ?? "").trim() : "";
  };

  return lines.slice(1).map((line) => {
    const cols = parseCsvLine(line);
    return {
      externalRef: get(cols, "externalRef") || get(cols, "Ticket") || get(cols, "ticket"),
      accountName: get(cols, "accountName") || get(cols, "Account") || get(cols, "account"),
      pair: get(cols, "pair") || get(cols, "Symbol") || get(cols, "symbol"),
      direction: get(cols, "direction") || get(cols, "Type") || get(cols, "type"),
      status: get(cols, "status") || get(cols, "Status") || "closed",
      entryPrice: get(cols, "entryPrice") || get(cols, "Open Price") || get(cols, "open_price"),
      stopLoss: get(cols, "stopLoss") || get(cols, "S/L") || get(cols, "sl"),
      takeProfit: get(cols, "takeProfit") || get(cols, "T/P") || get(cols, "tp"),
      lotSize: get(cols, "lotSize") || get(cols, "Volume") || get(cols, "volume") || get(cols, "Lots"),
      openedAt: get(cols, "openedAt") || get(cols, "Open Time") || get(cols, "open_time"),
      closedAt: get(cols, "closedAt") || get(cols, "Close Time") || get(cols, "close_time"),
      pnl: get(cols, "pnl") || get(cols, "Profit") || get(cols, "profit"),
      pipsPnl: get(cols, "pipsPnl") || get(cols, "Pips") || get(cols, "pips"),
      notes: get(cols, "notes") || get(cols, "Comment") || get(cols, "comment"),
    };
  });
}

// ── Validation ──────────────────────────────────────────────────────────────

const VALID_DIRECTIONS = new Set(["LONG", "SHORT", "buy", "sell", "BUY", "SELL"]);
const VALID_STATUSES = new Set(["open", "pending", "closed", "cancelled"]);

function normalizeDirection(raw: string): TradeDirection | null {
  const lower = raw.toLowerCase();
  if (lower === "buy" || lower === "long") return "LONG";
  if (lower === "sell" || lower === "short") return "SHORT";
  return null;
}

function normalizeStatus(raw: string): string {
  const lower = raw.toLowerCase();
  if (lower === "closed" || lower === "close") return "closed";
  if (lower === "open") return "open";
  if (lower === "pending") return "pending";
  if (lower === "cancelled" || lower === "canceled") return "cancelled";
  return "closed";
}

function normalizePair(raw: string): CurrencyPair | null {
  const upper = raw.toUpperCase().replace(/[^A-Z]/g, "");
  return ALL_PAIRS.includes(upper as CurrencyPair) ? (upper as CurrencyPair) : null;
}

function validateRow(
  row: MtRow,
  accountMap: Map<string, string>
): ParsedRow {
  const errors: string[] = [];

  if (!row.externalRef) errors.push("Missing ticket/externalRef");
  if (!normalizePair(row.pair)) errors.push(`Unknown pair: "${row.pair}"`);
  if (!normalizeDirection(row.direction)) errors.push(`Unknown direction: "${row.direction}"`);
  if (!Number.isFinite(Number(row.entryPrice)) || Number(row.entryPrice) <= 0)
    errors.push("Invalid entry price");
  if (!Number.isFinite(Number(row.lotSize)) || Number(row.lotSize) <= 0)
    errors.push("Invalid lot size");

  const accountId = accountMap.get(row.accountName.trim().toLowerCase());
  if (!row.accountName) errors.push("Missing account name");
  else if (!accountId) errors.push(`No account named "${row.accountName}" in your workspace`);

  return {
    raw: row,
    valid: errors.length === 0,
    errors,
    accountId,
  };
}

// ── Template download ────────────────────────────────────────────────────────

function downloadTemplate() {
  const headers = EXPECTED_HEADERS.join(",");
  const example = [
    "12345678",
    "FTMO Challenge",
    "EURUSD",
    "LONG",
    "closed",
    "1.08500",
    "1.08000",
    "1.09200",
    "0.10",
    "2026-04-05 09:00:00",
    "2026-04-05 14:30:00",
    "63.50",
    "14.2",
    "Clean breakout above Asian high",
  ].join(",");
  const csv = `${headers}\n${example}\n`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "mt-import-template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function MtImportPage() {
  const { authFetch } = useAuth();
  const { accounts, loading: accountsLoading } = useAccounts();
  const [csvText, setCsvText] = useState("");
  const [parsed, setParsed] = useState<ParsedRow[] | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const accountMap = useMemo(
    () => new Map(accounts.map((a) => [a.name.trim().toLowerCase(), a.id])),
    [accounts]
  );

  const handleParse = useCallback(() => {
    setResult(null);
    setParseError(null);

    if (!csvText.trim()) {
      setParseError("Paste CSV data or upload a file first.");
      return;
    }

    try {
      const rows = parseCsv(csvText);
      if (rows.length === 0) {
        setParseError("No data rows found. Check the format — the first row must be headers.");
        return;
      }
      setParsed(rows.map((row) => validateRow(row, accountMap)));
    } catch {
      setParseError("Could not parse the CSV. Check for malformed rows.");
    }
  }, [csvText, accountMap]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setCsvText((e.target?.result as string) || "");
      setParsed(null);
      setResult(null);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!parsed) return;
    const validRows = parsed.filter((r) => r.valid);
    if (validRows.length === 0) return;

    setImporting(true);
    setResult(null);

    try {
      const positions = validRows.map((r) => ({
        externalRef: r.raw.externalRef,
        accountId: r.accountId,
        accountName: r.raw.accountName || undefined,
        pair: normalizePair(r.raw.pair) as CurrencyPair,
        direction: normalizeDirection(r.raw.direction) as TradeDirection,
        status: normalizeStatus(r.raw.status),
        entryPrice: Number(r.raw.entryPrice),
        stopLoss: r.raw.stopLoss ? Number(r.raw.stopLoss) : undefined,
        takeProfit: r.raw.takeProfit ? Number(r.raw.takeProfit) : undefined,
        lotSize: Number(r.raw.lotSize),
        openedAt: r.raw.openedAt || undefined,
        closedAt: r.raw.closedAt || undefined,
        pnl: r.raw.pnl ? Number(r.raw.pnl) : undefined,
        pipsPnl: r.raw.pipsPnl ? Number(r.raw.pipsPnl) : undefined,
        notes: r.raw.notes || undefined,
      }));

      const res = await authFetch("/api/mt/import", {
        method: "POST",
        body: JSON.stringify({ positions }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Import failed.");
      }

      setResult(data.result as ImportResult);
    } catch (err) {
      setResult({
        imported: 0,
        updated: 0,
        skipped: validRows.length,
        errors: [err instanceof Error ? err.message : "Import failed."],
      });
    } finally {
      setImporting(false);
    }
  };

  const validCount = parsed?.filter((r) => r.valid).length ?? 0;
  const invalidCount = parsed ? parsed.length - validCount : 0;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <section className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_35%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.96))] p-5 sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-300/80">
              MetaTrader Import
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Import MT4 / MT5 trade history into your journal.
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Paste CSV data or upload a file. Each row maps to a ticket from MetaTrader.
              The system matches by account name — your account names here must match what you enter in the CSV.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row xl:flex-col">
            <Button variant="secondary" onClick={downloadTemplate} className="w-full sm:w-auto">
              Download Template
            </Button>
            <Link
              href="/trades"
              className="inline-flex w-full items-center justify-center rounded-lg bg-white/5 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-white/10 hover:text-white sm:w-auto"
            >
              Back to Trades
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <Card>
            <CardHeader>CSV Data</CardHeader>
            <p className="mb-4 text-sm text-gray-400">
              Upload a file or paste CSV directly. The first row must be a header row.
              Download the template above to see the expected columns.
            </p>

            <label className="block">
              <span className="text-sm text-gray-400">Upload file</span>
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="mt-1 block w-full text-sm text-slate-400 file:mr-4 file:rounded-lg file:border file:border-white/10 file:bg-surface file:px-3 file:py-2 file:text-sm file:text-white hover:file:bg-white/10"
              />
            </label>

            <div className="mt-4">
              <span className="text-sm text-gray-400">Or paste CSV</span>
              <textarea
                value={csvText}
                onChange={(e) => { setCsvText(e.target.value); setParsed(null); setResult(null); }}
                placeholder={`externalRef,accountName,pair,direction,status,entryPrice,stopLoss,takeProfit,lotSize,openedAt,closedAt,pnl,pipsPnl,notes\n12345678,FTMO Challenge,EURUSD,LONG,closed,1.08500,1.08000,1.09200,0.10,...`}
                className="mt-1 h-44 w-full rounded-xl border border-white/10 bg-surface px-3 py-3 font-mono text-xs text-gray-300 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />
            </div>

            {parseError ? (
              <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {parseError}
              </div>
            ) : null}

            <div className="mt-4 flex gap-2">
              <Button onClick={handleParse} disabled={!csvText.trim() || accountsLoading}>
                Preview Rows
              </Button>
              {parsed && validCount > 0 ? (
                <Button onClick={handleImport} disabled={importing}>
                  {importing ? "Importing..." : `Import ${validCount} valid row${validCount === 1 ? "" : "s"}`}
                </Button>
              ) : null}
            </div>
          </Card>

          {result ? (
            <Card>
              <CardHeader>Import Result</CardHeader>
              <div className="grid gap-3 sm:grid-cols-3">
                <ResultPill label="Imported" value={result.imported} tone="text-green-400" />
                <ResultPill label="Updated" value={result.updated} tone="text-blue-400" />
                <ResultPill label="Skipped" value={result.skipped} tone="text-yellow-400" />
              </div>
              {result.errors.length > 0 ? (
                <div className="mt-4 space-y-2">
                  <div className="text-xs uppercase tracking-wide text-slate-500">Errors</div>
                  {result.errors.map((err, i) => (
                    <div key={i} className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                      {err}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-green-300">
                  All rows processed successfully.{" "}
                  <Link href="/trades" className="underline underline-offset-2 hover:text-white">
                    View in Trades
                  </Link>
                </p>
              )}
            </Card>
          ) : null}

          {parsed && parsed.length > 0 ? (
            <Card>
              <div className="mb-4 flex items-center justify-between">
                <CardHeader>
                  Preview — {parsed.length} row{parsed.length === 1 ? "" : "s"}
                </CardHeader>
                <div className="flex gap-3 text-xs">
                  <span className="text-green-400">{validCount} valid</span>
                  {invalidCount > 0 ? <span className="text-red-400">{invalidCount} invalid</span> : null}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/5 text-left text-gray-500">
                      <th className="py-2 pr-3 font-medium">Ticket</th>
                      <th className="py-2 pr-3 font-medium">Account</th>
                      <th className="py-2 pr-3 font-medium">Pair</th>
                      <th className="py-2 pr-3 font-medium">Dir</th>
                      <th className="py-2 pr-3 font-medium">Status</th>
                      <th className="py-2 pr-3 font-medium">Entry</th>
                      <th className="py-2 pr-3 font-medium">Lots</th>
                      <th className="py-2 pr-3 font-medium">P&L</th>
                      <th className="py-2 font-medium">Issues</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsed.map((row, i) => (
                      <tr
                        key={i}
                        className={cn(
                          "border-b border-white/5",
                          row.valid ? "text-gray-200" : "text-red-300/70"
                        )}
                      >
                        <td className="py-2 pr-3 font-mono">{row.raw.externalRef || "—"}</td>
                        <td className="py-2 pr-3">{row.raw.accountName || "—"}</td>
                        <td className="py-2 pr-3 font-mono">{row.raw.pair || "—"}</td>
                        <td className="py-2 pr-3">{row.raw.direction || "—"}</td>
                        <td className="py-2 pr-3">{row.raw.status || "—"}</td>
                        <td className="py-2 pr-3 font-mono">{row.raw.entryPrice || "—"}</td>
                        <td className="py-2 pr-3 font-mono">{row.raw.lotSize || "—"}</td>
                        <td className={cn("py-2 pr-3 font-mono", Number(row.raw.pnl) >= 0 ? "text-green-400" : "text-red-400")}>
                          {row.raw.pnl ? (Number(row.raw.pnl) >= 0 ? "+" : "") + row.raw.pnl : "—"}
                        </td>
                        <td className="py-2 text-xs text-red-400">
                          {row.errors.length > 0 ? row.errors.join("; ") : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : null}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>Your Accounts</CardHeader>
            <p className="mb-4 text-sm text-gray-400">
              The account name in your CSV must exactly match one of these names.
            </p>
            {accountsLoading ? (
              <p className="text-sm text-gray-500">Loading accounts...</p>
            ) : accounts.length === 0 ? (
              <p className="text-sm text-gray-500">
                No accounts yet.{" "}
                <Link href="/settings" className="text-brand-400 hover:text-brand-300">
                  Add one in Settings
                </Link>{" "}
                before importing.
              </p>
            ) : (
              <div className="space-y-2">
                {accounts.map((account) => (
                  <div key={account.id} className="rounded-xl border border-white/5 bg-surface px-4 py-3">
                    <div className="text-sm font-semibold text-white">{account.name}</div>
                    <div className="mt-1 text-xs text-gray-500 capitalize">
                      {account.mode} · {account.isActive ? "active" : "inactive"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <CardHeader>Column Reference</CardHeader>
            <div className="space-y-2 text-xs">
              {[
                { col: "externalRef", note: "MT ticket number — used to detect duplicates" },
                { col: "accountName", note: "Must match an account name exactly" },
                { col: "pair", note: "EURUSD, GBPUSD, XAUUSD, etc." },
                { col: "direction", note: "LONG / SHORT or BUY / SELL" },
                { col: "status", note: "open, closed, pending, cancelled" },
                { col: "entryPrice", note: "Required — decimal number" },
                { col: "lotSize", note: "Required — e.g. 0.10" },
                { col: "stopLoss", note: "Optional" },
                { col: "takeProfit", note: "Optional" },
                { col: "openedAt", note: "Optional — ISO date or MT format" },
                { col: "closedAt", note: "Optional" },
                { col: "pnl", note: "Optional — realized profit/loss in $" },
                { col: "pipsPnl", note: "Optional — pips gained/lost" },
                { col: "notes", note: "Optional — any comment" },
              ].map(({ col, note }) => (
                <div key={col} className="rounded-lg border border-white/5 bg-surface px-3 py-2">
                  <span className="font-mono text-cyan-300">{col}</span>
                  <span className="ml-2 text-gray-500">{note}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ResultPill({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/25 px-4 py-3">
      <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</div>
      <div className={cn("mt-2 text-2xl font-bold", tone)}>{value}</div>
    </div>
  );
}

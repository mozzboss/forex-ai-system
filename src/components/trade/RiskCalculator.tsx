"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/hooks";
import { cn } from "@/lib/utils";
import { CurrencyPair, RiskOutput, TradeDirection } from "@/types";

type RiskPreset = {
  label: string;
  entry: number;
  stopLoss: number;
  takeProfit: number;
  note?: string;
};

interface RiskCalculatorProps {
  pair?: CurrencyPair;
  direction?: TradeDirection;
  initialBalance?: number;
  initialRiskPercent?: number;
  initialEntryPrice?: number;
  initialStopLoss?: number;
  initialTakeProfit?: number;
  presets?: RiskPreset[];
  autoCalculateFlag?: number;
  note?: string | null;
  onNote?: (note: string | null) => void;
  onCalculate?: (result: RiskOutput) => void;
}

export function RiskCalculator({
  pair,
  direction,
  initialBalance,
  initialRiskPercent,
  initialEntryPrice,
  initialStopLoss,
  initialTakeProfit,
  presets = [],
  autoCalculateFlag,
  note,
  onNote,
  onCalculate,
}: RiskCalculatorProps) {
  const { authFetch } = useAuth();
  const [balance, setBalance] = useState("100000");
  const [riskPct, setRiskPct] = useState("0.5");
  const [entry, setEntry] = useState("");
  const [sl, setSl] = useState("");
  const [tp, setTp] = useState("");
  const [result, setResult] = useState<RiskOutput | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof initialBalance === "number") {
      setBalance(initialBalance.toString());
    }
  }, [initialBalance]);

  useEffect(() => {
    if (typeof initialRiskPercent === "number") {
      setRiskPct(initialRiskPercent.toString());
    }
  }, [initialRiskPercent]);

  useEffect(() => {
    if (typeof initialEntryPrice === "number") {
      setEntry(initialEntryPrice.toString());
    }
  }, [initialEntryPrice]);

  useEffect(() => {
    if (typeof initialStopLoss === "number") {
      setSl(initialStopLoss.toString());
    }
  }, [initialStopLoss]);

  useEffect(() => {
    if (typeof initialTakeProfit === "number") {
      setTp(initialTakeProfit.toString());
    }
  }, [initialTakeProfit]);

  useEffect(() => {
    if (typeof note === "string") {
      onNote?.(note);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note]);

  useEffect(() => {
    if (typeof autoCalculateFlag === "number" && autoCalculateFlag > 0) {
      if (entry && sl && tp) {
        void calculate();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoCalculateFlag]);

  const calculate = async () => {
    setLoading(true);
    try {
      const res = await authFetch("/api/risk", {
        method: "POST",
        body: JSON.stringify({
          accountBalance: parseFloat(balance),
          riskPercent: parseFloat(riskPct),
          entryPrice: parseFloat(entry),
          stopLossPrice: parseFloat(sl),
          takeProfitPrice: parseFloat(tp),
          pair: pair || "EURUSD",
          direction: direction || "LONG",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Risk calculation failed.");
      }
      setResult(data.risk);
      onCalculate?.(data.risk);
    } catch (err) {
      console.error("Risk calc failed:", err);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      {presets.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className="rounded-lg border border-white/10 bg-surface px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200 hover:border-brand-500/50 hover:text-white"
              onClick={() => {
                setEntry(preset.entry.toString());
                setSl(preset.stopLoss.toString());
                setTp(preset.takeProfit.toString());
                if (preset.note) {
                  onNote?.(preset.note);
                }
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        <Field label="Balance ($)" value={balance} onChange={setBalance} />
        <Field label="Risk (%)" value={riskPct} onChange={setRiskPct} />
        <Field label="Entry Price" value={entry} onChange={setEntry} placeholder="1.0850" />
        <Field label="Stop Loss" value={sl} onChange={setSl} placeholder="1.0800" />
        <Field label="Take Profit" value={tp} onChange={setTp} placeholder="1.0950" />
      </div>

      <button
        onClick={calculate}
        disabled={loading || !entry || !sl || !tp}
        className="w-full rounded-lg bg-brand-600 py-2 text-sm text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Calculating..." : "Calculate Risk"}
      </button>

      {result ? (
        <div
          className={cn(
            "rounded-lg border p-4",
            result.isValid ? "border-green-500/20 bg-green-500/5" : "border-red-500/20 bg-red-500/5"
          )}
        >
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <span className="text-gray-400">Risk Amount</span>
            <span className="text-right font-mono">${result.riskAmount}</span>
            <span className="text-gray-400">Pip Distance</span>
            <span className="text-right font-mono">{result.pipDistance} pips</span>
            <span className="text-gray-400">Lot Size</span>
            <span className="text-right font-mono font-bold">{result.lotSize}</span>
            <span className="text-gray-400">Max Loss</span>
            <span className="text-right font-mono text-red-400">-${result.maxLoss}</span>
            <span className="text-gray-400">Max Profit</span>
            <span className="text-right font-mono text-green-400">+${result.maxProfit}</span>
            <span className="text-gray-400">Risk:Reward</span>
            <span className="text-right font-mono font-bold">1:{result.riskRewardRatio}</span>
          </div>
          {result.denial ? (
            <div className="mt-3 border-t border-white/5 pt-3 text-xs text-red-400">
              Blocked: {result.denial}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-[11px] text-gray-500">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-0.5 w-full rounded-lg border border-white/10 bg-surface px-3 py-1.5 text-sm font-mono text-white focus:border-brand-500/50 focus:outline-none"
      />
    </div>
  );
}

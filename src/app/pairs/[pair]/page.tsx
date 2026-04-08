"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AnalysisDisplay, CandlestickChart, MissedZonesPanel, RiskCalculator } from "@/components/trade";
import { Button, Card, CardHeader, DecisionPanel, StatusBadge } from "@/components/ui";
import { ALL_PAIRS, getAccountRules, getPricePrecision } from "@/config/trading";
import { useAccounts, useAnalysis, useAuth } from "@/hooks";
import { derivePairDecisionSignal } from "@/lib/market/decision";
import { buildDriverSummary, deriveMarketRead, getPairContext, toTimeLabel } from "@/lib/market/read";
import { analyzeMarketStructure, type StructureEvent } from "@/lib/market/structure";
import { MARKET_TIMEFRAMES, MarketTimeframe } from "@/lib/market/timeframes";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";
import type {
  CurrencyPair,
  FullAnalysis,
  NewsEvent,
  TradeDenial,
  TradeDirection,
  TradingAccount,
} from "@/types";

interface MarketBar {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface MarketSnapshot {
  pair: CurrencyPair;
  symbol: string;
  timeframe: MarketTimeframe;
  price: number;
  open: number;
  high: number;
  low: number;
  previousClose?: number;
  change?: number;
  percentChange?: number;
  asOf: string;
  isMarketOpen?: boolean;
  bars: MarketBar[];
  source: "twelvedata" | "fallback";
  fallback: boolean;
}

type FeedbackTone = "success" | "error";
type PairWorkspaceTab = "market" | "drivers" | "accounts" | "analysis";

interface ActionFeedback {
  tone: FeedbackTone;
  message: string;
}

const WORKSPACE_TABS: Array<{
  id: PairWorkspaceTab;
  label: string;
  detail: string;
}> = [
  { id: "market", label: "Market", detail: "Snapshot, notes, and the analysis trigger." },
  { id: "drivers", label: "Drivers", detail: "Why the pair can move up or down, and what matters next." },
  { id: "accounts", label: "Accounts", detail: "Risk posture, guardrails, and trade recording." },
  { id: "analysis", label: "Analysis", detail: "Decision snapshot and the full AI breakdown." },
];

function getPairFromParam(value: string): CurrencyPair | null {
  const normalized = value.toUpperCase();
  return ALL_PAIRS.includes(normalized as CurrencyPair) ? (normalized as CurrencyPair) : null;
}

function getSuggestedEntryPrice(analysis: FullAnalysis, pair: CurrencyPair) {
  if (!analysis.tradeSetup) return "";
  const midpoint = (analysis.tradeSetup.entryZone.low + analysis.tradeSetup.entryZone.high) / 2;
  return midpoint.toFixed(getPricePrecision(pair));
}

function getFallbackDirection(analysis: FullAnalysis): TradeDirection {
  if (analysis.tradeSetup) {
    return analysis.tradeSetup.direction;
  }

  return analysis.marketOverview.bias === "bearish" ? "SHORT" : "LONG";
}

function getExecutionBlockers({
  account,
  analysis,
  denialResult,
  executionPrice,
  pair,
}: {
  account: TradingAccount;
  analysis: FullAnalysis;
  denialResult?: { allowed: boolean; denials: TradeDenial[] };
  executionPrice: string;
  pair: CurrencyPair;
}) {
  const blockers: string[] = [];
  const price = Number(executionPrice);
  const hasActivePairTrade = account.openTrades.some(
    (trade) => trade.pair === pair && (trade.status === "pending" || trade.status === "open")
  );
  const accountRisk = analysis.riskPerAccount[account.id];

  if (!analysis.tradeSetup) blockers.push("No valid trade setup is available for this pair.");
  if (analysis.finalDecision.decision !== "TAKE_TRADE") {
    blockers.push(`Analysis decision is ${analysis.finalDecision.decision.replace("_", " ")}.`);
  }
  if (analysis.entryStatus.status !== "CONFIRMED") {
    blockers.push(`Entry status is ${analysis.entryStatus.status}. Only CONFIRMED setups can be recorded.`);
  }
  if (!Number.isFinite(price) || price <= 0) {
    blockers.push("Execution price must be a valid positive number.");
  }
  if (!accountRisk) {
    blockers.push("Risk could not be calculated for this account.");
  } else if (!accountRisk.isValid) {
    blockers.push(accountRisk.denial || "Risk rules rejected this trade for the selected account.");
  }
  if (denialResult && !denialResult.allowed) {
    denialResult.denials.forEach((denial) => blockers.push(denial.explanation));
  }
  if (hasActivePairTrade) {
    blockers.push("This account already has an open or pending trade on the same pair.");
  }

  return blockers;
}

function buildTradeNotes(marketNotes: string, entryPrice: number) {
  const notes = [`Recorded from pair analysis workspace at ${entryPrice}.`];
  if (marketNotes.trim()) {
    notes.push(`Context: ${marketNotes.trim()}`);
  }
  return notes.join(" ");
}

export default function PairPage({ params }: { params: { pair: string } }) {
  const { authFetch } = useAuth();
  const pair = useMemo(() => getPairFromParam(params.pair), [params.pair]);
  const { accounts, loading: accountsLoading, error: accountsError, refetch } = useAccounts();
  const { result, loading, error, cachedAt, analyze, clear } = useAnalysis();
  const [marketNotes, setMarketNotes] = useState("");
  const [executionPrice, setExecutionPrice] = useState("");
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [feedbackByAccount, setFeedbackByAccount] = useState<Record<string, ActionFeedback>>({});
  const [marketSnapshot, setMarketSnapshot] = useState<MarketSnapshot | null>(null);
  const [marketEvents, setMarketEvents] = useState<NewsEvent[]>([]);
  const [marketTimeframe, setMarketTimeframe] = useState<MarketTimeframe>("15min");
  const [activeTab, setActiveTab] = useState<PairWorkspaceTab>("market");
  const [marketLoading, setMarketLoading] = useState(false);
  const [marketError, setMarketError] = useState<string | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>(undefined);
  const [liveSync, setLiveSync] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState<Array<{
    id: string;
    pair: string;
    createdAt: Date;
    result: FullAnalysis;
  }>>([]);
  const [riskDefaults, setRiskDefaults] = useState<{
    balance?: number;
    riskPercent?: number;
    entry?: number;
    stopLoss?: number;
    takeProfit?: number;
    direction?: TradeDirection;
  }>({});
  const [riskNote, setRiskNote] = useState<string | null>(null);
  const [autoCalcTick, setAutoCalcTick] = useState(0);

  const activeAccounts = useMemo(() => accounts.filter((account) => account.isActive), [accounts]);
  const analysis = result?.analysis;
  const pairRisk = useMemo(() => {
    if (!analysis?.tradeSetup) return null;
    return {
      entry: Number(executionPrice) || analysis.tradeSetup.entryZone.low,
      stopLoss: analysis.tradeSetup.stopLoss,
      takeProfit: analysis.tradeSetup.takeProfit,
      direction: analysis.tradeSetup.direction,
    };
  }, [analysis, executionPrice]);

  useEffect(() => {
    clear();
    setMarketNotes("");
    setExecutionPrice("");
    setFeedbackByAccount({});
    setMarketSnapshot(null);
    setMarketEvents([]);
    setMarketError(null);
    setActiveTab("market");
  }, [clear, params.pair]);

  useEffect(() => {
    if (pair && result?.analysis?.tradeSetup) {
      setExecutionPrice(getSuggestedEntryPrice(result.analysis, pair));
    }
  }, [pair, result?.analysis]);

  useEffect(() => {
    if (!pair) return;

    let cancelled = false;
    const relevantCurrencies = getPairContext(pair).relevantCurrencies;

    const loadMarketSnapshot = async () => {
      setMarketLoading(true);
      try {
        const newsQuery = relevantCurrencies.map((currency) => `currency=${currency}`).join("&");
        const [snapshotRes, newsRes] = await Promise.all([
          authFetch(`/api/market?pair=${pair}&timeframe=${marketTimeframe}`),
          authFetch(`/api/news?limit=6&impact=medium${newsQuery ? `&${newsQuery}` : ""}`),
        ]);
        const [snapshotData, newsData] = await Promise.all([snapshotRes.json(), newsRes.json()]);

        if (!snapshotRes.ok) {
          throw new Error(snapshotData.error || "Failed to load market snapshot.");
        }
        if (!newsRes.ok) {
          throw new Error(newsData.error || "Failed to load pair news context.");
        }

        if (!cancelled) {
          setMarketSnapshot(snapshotData.snapshot);
          setMarketEvents(
            (newsData.events || []).map((event: NewsEvent) => ({
              ...event,
              time: new Date(event.time),
            }))
          );
          setMarketError(null);
        }
      } catch (snapshotError) {
        if (!cancelled) {
          setMarketError(
            snapshotError instanceof Error ? snapshotError.message : "Failed to load market snapshot."
          );
        }
      } finally {
        if (!cancelled) {
          setMarketLoading(false);
        }
      }
    };

    loadMarketSnapshot();

    return () => {
      cancelled = true;
    };
  }, [authFetch, marketTimeframe, pair]);

  useEffect(() => {
    if (activeAccounts.length > 0 && !selectedAccountId) {
      setSelectedAccountId(activeAccounts[0].id);
    }
  }, [activeAccounts, selectedAccountId]);

  useEffect(() => {
    const primary = activeAccounts.find((a) => a.id === selectedAccountId) || activeAccounts[0];
    setRiskDefaults((prev) => ({
      ...prev,
      balance: primary?.balance,
      riskPercent: primary?.riskPercent,
    }));
  }, [activeAccounts, selectedAccountId]);

  useEffect(() => {
    if (pairRisk) {
      setRiskDefaults((prev) => ({
        ...prev,
        entry: pairRisk.entry,
        stopLoss: pairRisk.stopLoss,
        takeProfit: pairRisk.takeProfit,
        direction: pairRisk.direction,
      }));
      setRiskNote(null);
    }
  }, [pairRisk]);

  const marketNarrative = useMemo(() => {
    if (!marketSnapshot) {
      return null;
    }

    return buildDriverSummary(marketSnapshot.pair, marketEvents);
  }, [marketEvents, marketSnapshot]);

  const marketRead = useMemo(() => {
    if (!marketSnapshot) {
      return null;
    }

    return deriveMarketRead(marketSnapshot, marketEvents);
  }, [marketEvents, marketSnapshot]);

  const marketStructure = useMemo(() => {
    if (!marketSnapshot) {
      return null;
    }

    return analyzeMarketStructure(marketSnapshot.bars);
  }, [marketSnapshot]);

  const autoLevels = useMemo(() => {
    if (!marketSnapshot) return null;

    const entry = marketSnapshot.price;
    const direction =
      pairRisk?.direction ||
      (marketStructure?.bias === "bearish" ? ("SHORT" as TradeDirection) : ("LONG" as TradeDirection));

    const lastSwing = marketStructure?.swings.at(-1);
    const support = marketStructure?.htfSupport;
    const resistance = marketStructure?.htfResistance;

    let stopLoss: number;
    let reasoning: string;

    if (direction === "LONG") {
      stopLoss = support?.low ?? lastSwing?.price ?? entry * 0.995;
      reasoning = support
        ? "SL anchored at HTF support band."
        : lastSwing
          ? "SL anchored at most recent swing low."
          : "SL set 0.5% below entry as a guardrail.";
    } else {
      stopLoss = resistance?.high ?? lastSwing?.price ?? entry * 1.005;
      reasoning = resistance
        ? "SL anchored at HTF resistance band."
        : lastSwing
          ? "SL anchored at most recent swing high."
          : "SL set 0.5% above entry as a guardrail.";
    }

    const riskDistance = Math.max(Math.abs(entry - stopLoss), entry * 0.001);
    const takeProfit = direction === "LONG" ? entry + riskDistance * 2 : entry - riskDistance * 2;

    return {
      entry,
      stopLoss,
      takeProfit,
      direction,
      note: `${reasoning} TP set at 2R for quick sizing; refine before execution.`,
    };
  }, [marketSnapshot, marketStructure, pairRisk]);

  useEffect(() => {
    if (!liveSync || !autoLevels) return;
    setRiskDefaults((prev) => ({
      ...prev,
      entry: autoLevels.entry,
      stopLoss: autoLevels.stopLoss,
      takeProfit: autoLevels.takeProfit,
      direction: autoLevels.direction,
    }));
    setRiskNote(autoLevels.note || null);
    setAutoCalcTick((tick) => tick + 1);
  }, [autoLevels, liveSync]);

  useEffect(() => {
    if (!pair) return;
    authFetch(`/api/analysis?pair=${pair}&limit=5`)
      .then((res) => res.ok ? res.json() : { history: [] })
      .then((data) => {
        const entries = (data.history || []) as Array<{ id: string; pair: string; result: object; createdAt: string }>;
        const parsed = entries.map((e) => ({
          id: e.id,
          pair: e.pair,
          createdAt: new Date(e.createdAt),
          result: e.result as FullAnalysis,
        }));
        setAnalysisHistory(parsed);
      })
      .catch(() => {});
  }, [pair, cachedAt, authFetch]);

  const primaryAccount = activeAccounts[0];
  const pairDecision = useMemo(
    () =>
      result?.decisionSignal
      || derivePairDecisionSignal(
        analysis,
        marketRead ? marketRead.cautionReason : undefined
      ),
    [analysis, marketRead, result?.decisionSignal]
  );
  const latestStructureEvent = marketStructure?.events.at(-1);

  const chartOverlays: Array<{
    label: string;
    price: number;
    tone: "support" | "resistance" | "entry" | "stop" | "target";
    dashed?: boolean;
  }> = marketSnapshot
    ? [
        {
          label: "Resistance",
          price: marketSnapshot.high,
          tone: "resistance",
          dashed: true,
        },
        {
          label: "Support",
          price: marketSnapshot.low,
          tone: "support",
          dashed: true,
        },
      ]
    : [];

  if (analysis?.tradeSetup) {
    const entryPrice =
      Number(executionPrice) ||
      (analysis.tradeSetup.entryZone.low + analysis.tradeSetup.entryZone.high) / 2;

    chartOverlays.push(
      { label: "Entry", price: entryPrice, tone: "entry" },
      { label: "Stop", price: analysis.tradeSetup.stopLoss, tone: "stop" },
      { label: "Target", price: analysis.tradeSetup.takeProfit, tone: "target" }
    );
  }

  const chartZones: Array<{
    label: string;
    low: number;
    high: number;
    tone: "support" | "resistance" | "entry";
  }> = [];

  if (marketStructure?.htfResistance) {
    chartZones.push({
      label: "HTF resistance band",
      low: marketStructure.htfResistance.low,
      high: marketStructure.htfResistance.high,
      tone: "resistance",
    });
  }

  if (marketStructure?.htfSupport) {
    chartZones.push({
      label: "HTF support band",
      low: marketStructure.htfSupport.low,
      high: marketStructure.htfSupport.high,
      tone: "support",
    });
  }

  const directionHint: TradeDirection =
    riskDefaults.direction ||
    pairRisk?.direction ||
    (marketStructure?.bias === "bearish" ? "SHORT" : "LONG");

  const baseEntry =
    riskDefaults.entry ??
    pairRisk?.entry ??
    marketSnapshot?.price;

  const riskPresets = useMemo(() => {
    if (!baseEntry || !marketStructure) return [];

    const presets: Array<{
      label: string;
      entry: number;
      stopLoss: number;
      takeProfit: number;
      note?: string;
    }> = [];

    const lastSwing = marketStructure.swings.at(-1);
    const distanceFromSwing =
      lastSwing && Math.abs(baseEntry - lastSwing.price) > 0
        ? Math.abs(baseEntry - lastSwing.price)
        : baseEntry * 0.001;

    const swingStop =
      directionHint === "LONG"
        ? (lastSwing?.price ?? baseEntry * 0.995)
        : (lastSwing?.price ?? baseEntry * 1.005);
    presets.push({
      label: "SL at last swing",
      entry: baseEntry,
      stopLoss: swingStop,
      takeProfit:
        directionHint === "LONG"
          ? baseEntry + 2 * Math.abs(baseEntry - swingStop)
          : baseEntry - 2 * Math.abs(baseEntry - swingStop),
      note: "Stop anchored at the most recent swing point.",
    });

    if (marketStructure.htfSupport || marketStructure.htfResistance) {
      const band = directionHint === "LONG" ? marketStructure.htfSupport : marketStructure.htfResistance;
      if (band) {
        const stop = directionHint === "LONG" ? band.low : band.high;
        presets.push({
          label: "SL at HTF band",
          entry: baseEntry,
          stopLoss: stop,
          takeProfit:
            directionHint === "LONG"
              ? baseEntry + 2 * Math.abs(baseEntry - stop)
              : baseEntry - 2 * Math.abs(baseEntry - stop),
          note: "Stop parked at the nearest HTF band.",
        });
      }
    }

    const bufferPips = baseEntry * 0.001; // ~10 pips around 1.0
    const bufferedStop =
      directionHint === "LONG" ? baseEntry - bufferPips : baseEntry + bufferPips;
    presets.push({
      label: "Fixed buffer",
      entry: baseEntry,
      stopLoss: bufferedStop,
      takeProfit:
        directionHint === "LONG"
          ? baseEntry + bufferPips * 2
          : baseEntry - bufferPips * 2,
      note: "1x buffer for SL, 2x buffer for TP.",
    });

    return presets;
  }, [baseEntry, directionHint, marketStructure]);

  if (analysis?.tradeSetup) {
    chartZones.push({
      label: "Entry zone",
      low: Math.min(analysis.tradeSetup.entryZone.low, analysis.tradeSetup.entryZone.high),
      high: Math.max(analysis.tradeSetup.entryZone.low, analysis.tradeSetup.entryZone.high),
      tone: "entry",
    });
  }

  if (analysis?.tradeSetup && marketStructure?.htfSupport) {
    const overlapLow = Math.max(
      Math.min(analysis.tradeSetup.entryZone.low, analysis.tradeSetup.entryZone.high),
      marketStructure.htfSupport.low
    );
    const overlapHigh = Math.min(
      Math.max(analysis.tradeSetup.entryZone.low, analysis.tradeSetup.entryZone.high),
      marketStructure.htfSupport.high
    );
    if (overlapHigh > overlapLow) {
      chartZones.push({
        label: "Confluence (HTF support)",
        low: overlapLow,
        high: overlapHigh,
        tone: "support",
      });
    }
  }

  if (analysis?.tradeSetup && marketStructure?.htfResistance) {
    const overlapLow = Math.max(
      Math.min(analysis.tradeSetup.entryZone.low, analysis.tradeSetup.entryZone.high),
      marketStructure.htfResistance.low
    );
    const overlapHigh = Math.min(
      Math.max(analysis.tradeSetup.entryZone.low, analysis.tradeSetup.entryZone.high),
      marketStructure.htfResistance.high
    );
    if (overlapHigh > overlapLow) {
      chartZones.push({
        label: "Confluence (HTF resistance)",
        low: overlapLow,
        high: overlapHigh,
        tone: "resistance",
      });
    }
  }

  const swingMarkers: Array<{
    label: string;
    price: number;
    time: string;
    tone: "bullish" | "bearish" | "neutral";
    kind: "swing-high" | "swing-low" | "bos" | "choch";
  }> = marketStructure
    ? marketStructure.swings.slice(-4).map((swing) => ({
      label: swing.kind === "high" ? "SH" : "SL",
      price: swing.price,
      time: swing.time,
      tone: swing.kind === "high" ? "bearish" : "bullish",
      kind: swing.kind === "high" ? "swing-high" : "swing-low",
    }))
    : [];

  const eventMarkers: Array<{
    label: string;
    price: number;
    time: string;
    tone: "bullish" | "bearish" | "neutral";
    kind: "swing-high" | "swing-low" | "bos" | "choch";
  }> = marketStructure
    ? marketStructure.events.map((event) => ({
      label: event.kind,
      price: event.price,
      time: event.time,
      tone: event.direction,
      kind: event.kind === "CHOCH" ? "choch" : "bos",
    }))
    : [];

  const chartMarkers = [...swingMarkers, ...eventMarkers];

  const runAnalysis = async () => {
    if (!pair || activeAccounts.length === 0) return;
    setFeedbackByAccount({});
    const analysisResult = await analyze(pair, activeAccounts, marketNotes.trim() || undefined);
    if (analysisResult) {
      setActiveTab("analysis");
    }
  };

  const saveFeedback = (accountId: string, tone: FeedbackTone, message: string) => {
    setFeedbackByAccount((current) => ({
      ...current,
      [accountId]: { tone, message },
    }));
  };

  const recordTrade = async (account: TradingAccount) => {
    if (!pair || !analysis || !analysis.tradeSetup) return;

    const denialResult = result?.denialResults[account.id];
    const blockers = getExecutionBlockers({
      account,
      analysis,
      denialResult,
      executionPrice,
      pair,
    });

    if (blockers.length > 0) {
      saveFeedback(account.id, "error", blockers[0]);
      return;
    }

    const entryPrice = Number(executionPrice);
    const accountRiskCalc = analysis.riskPerAccount[account.id];
    const actionId = `${account.id}:create`;
    setActiveActionId(actionId);

    try {
      const res = await authFetch("/api/trade", {
        method: "POST",
        body: JSON.stringify({
          action: "create",
          accountId: account.id,
          pair,
          direction: analysis.tradeSetup.direction,
          setupType: analysis.tradeSetup.setupType,
          entryPrice,
          stopLoss: analysis.tradeSetup.stopLoss,
          takeProfit: analysis.tradeSetup.takeProfit,
          lotSize: accountRiskCalc?.lotSize ?? 0,
          riskAmount: accountRiskCalc?.riskAmount ?? 0,
          riskRewardRatio: accountRiskCalc?.riskRewardRatio ?? 0,
          status: "open",
          entryStatus: analysis.entryStatus.status,
          aiScore: analysis.finalDecision.score,
          aiDecision: analysis.finalDecision.decision,
          aiReasoning: analysis.finalDecision.reasoning,
          notes: buildTradeNotes(marketNotes, entryPrice),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to record trade.");
      }

      await refetch();
      saveFeedback(account.id, "success", "Trade recorded as open. Manage execution manually in MetaTrader.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to record trade.";
      saveFeedback(account.id, "error", message);
    } finally {
      setActiveActionId(null);
    }
  };

  const logDenial = async (account: TradingAccount) => {
    if (!analysis) return;

    const denialResult = result?.denialResults[account.id];
    const primaryDenial = denialResult?.denials[0];
    const accountRisk = analysis.riskPerAccount[account.id];
    const actionId = `${account.id}:deny`;
    setActiveActionId(actionId);

    try {
      const res = await authFetch("/api/trade", {
        method: "POST",
        body: JSON.stringify({
          action: "deny",
          accountId: account.id,
          pair,
          direction: getFallbackDirection(analysis),
          setupType: analysis.tradeSetup?.setupType || "pullback",
          entryPrice: Number(executionPrice) || analysis.tradeSetup?.entryZone.low || 0,
          stopLoss: analysis.tradeSetup?.stopLoss || 0,
          takeProfit: analysis.tradeSetup?.takeProfit || 0,
          lotSize: accountRisk?.lotSize || 0,
          riskAmount: accountRisk?.riskAmount || 0,
          riskRewardRatio: accountRisk?.riskRewardRatio || 0,
          aiScore: analysis.finalDecision.score,
          aiReasoning: analysis.finalDecision.reasoning,
          denialReason: primaryDenial?.reason,
          notes: [
            `Denied from pair analysis workspace for ${account.name}.`,
            primaryDenial?.explanation,
            marketNotes.trim() ? `Context: ${marketNotes.trim()}` : "",
          ]
            .filter(Boolean)
            .join(" "),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to log denial.");
      }

      saveFeedback(account.id, "success", "Denial logged for audit. No trade was added to your active exposure.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to log denial.";
      saveFeedback(account.id, "error", message);
    } finally {
      setActiveActionId(null);
    }
  };

  if (!pair) {
    return (
      <div className="p-6">
        <Card className="max-w-2xl">
          <CardHeader>Invalid Pair</CardHeader>
          <p className="text-sm text-gray-400">
            This symbol is not in the supported pair universe. Return to the pairs page and choose a valid pair.
          </p>
          <Link href="/pairs" className="mt-4 inline-flex text-sm text-brand-400 hover:text-brand-300">
            Back to all pairs
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <section className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.22),_transparent_35%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.96))] p-5 sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <Link href="/pairs" className="text-sm text-gray-400 transition-colors hover:text-white">
              Back to pairs
            </Link>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{pair}</h1>
              <div className="rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
                Analysis Workspace
              </div>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Run the full macro-to-entry workflow, then only execute if the final result reaches
              <span className="font-semibold text-white"> CONFIRMED</span>. WAIT and READY are still no-entry states.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[520px]">
            <HeroMetric
              label="Active Accounts"
              value={activeAccounts.length.toString()}
              detail={activeAccounts.length > 0 ? "included in this analysis" : "activate an account first"}
            />
            <HeroMetric label="Funded Rule" value="8+/10" detail="funded accounts need a higher score threshold" />
            <HeroMetric label="Execution Rule" value="CONFIRMED" detail="never enter on WAIT or READY" />
          </div>
        </div>
      </section>

      {accountsError || error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {accountsError || error}
        </div>
      ) : null}

      <DecisionPanel
        title={`${pair} Decision`}
        mode={pairDecision.mode}
        reason={pairDecision.reason}
        action={pairDecision.action}
        details={pairDecision.details}
        stickyMobile
      />

      {analysis ? (
        <div className="grid gap-3 lg:grid-cols-4">
          <HeroMetric label="AI Score" value={`${analysis.finalDecision.score}/10`} detail="quality before execution" />
          <HeroMetric
            label="Decision"
            value={analysis.finalDecision.decision.replace("_", " ")}
            detail={analysis.entryStatus.reason}
          />
          <HeroMetric
            label="Structure"
            value={marketStructure?.bias || "neutral"}
            detail={marketStructure ? marketStructure.summary : "awaiting market structure"}
          />
          <div className="rounded-2xl border border-white/10 bg-slate-950/25 px-4 py-3">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Entry Status</div>
            <div className="mt-3">
              <StatusBadge status={analysis.entryStatus.status} size="md" showAction />
            </div>
            <div className="mt-3 text-sm text-slate-400">{analysis.entryStatus.whatMustHappenNext}</div>
          </div>
        </div>
      ) : null}

      <div className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,_rgba(15,23,42,0.96),_rgba(15,23,42,0.84))] p-3 sm:p-4">
        <div className="grid gap-2 lg:grid-cols-4">
          {WORKSPACE_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "rounded-2xl border px-4 py-3 text-left transition-colors",
                activeTab === tab.id
                  ? "border-cyan-400/40 bg-cyan-500/10"
                  : "border-white/10 bg-slate-950/20 hover:border-white/20 hover:bg-white/5"
              )}
            >
              <div className="text-sm font-semibold text-white">{tab.label}</div>
              <div className="mt-1 text-xs leading-5 text-slate-400">{tab.detail}</div>
            </button>
          ))}
        </div>
      </div>

      {activeTab === "market" ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">

          {/* ── Left: chart + structure ── */}
          <div className="space-y-4">
            <Card>
              {/* Price header + timeframe */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Live Chart</div>
                  {marketSnapshot && (
                    <div className="mt-1 flex flex-wrap items-baseline gap-2">
                      <span className="text-2xl font-bold font-mono text-white">
                        {marketSnapshot.price.toFixed(getPricePrecision(pair))}
                      </span>
                      {typeof marketSnapshot.change === "number" && (
                        <span className={cn("text-sm font-semibold", marketSnapshot.change >= 0 ? "text-green-400" : "text-red-400")}>
                          {marketSnapshot.change >= 0 ? "+" : ""}{marketSnapshot.change.toFixed(getPricePrecision(pair))} ({marketSnapshot.percentChange || 0}%)
                        </span>
                      )}
                      <span className="text-xs text-slate-500">
                        {marketSnapshot.fallback ? "fallback" : "live"} · {new Date(marketSnapshot.asOf).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {MARKET_TIMEFRAMES.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setMarketTimeframe(option)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors",
                        option === marketTimeframe
                          ? "border-cyan-400/40 bg-cyan-500/15 text-cyan-200"
                          : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {marketError ? (
                <p className="mt-4 text-sm text-red-300">{marketError}</p>
              ) : marketSnapshot ? (
                <>
                  {marketSnapshot.bars.length > 0 ? (
                    <CandlestickChart
                      pair={pair}
                      bars={marketSnapshot.bars}
                      timeframe={marketSnapshot.timeframe}
                      overlays={chartOverlays}
                      zones={chartZones}
                      markers={chartMarkers}
                      showSessions
                      showLiquiditySweeps
                      className="mt-3"
                    />
                  ) : null}
                  <div className="mt-3 grid grid-cols-4 gap-2 border-t border-white/5 pt-3">
                    <AccountLine label="Open" value={marketSnapshot.open.toFixed(getPricePrecision(pair))} />
                    <AccountLine label="High" value={marketSnapshot.high.toFixed(getPricePrecision(pair))} />
                    <AccountLine label="Low" value={marketSnapshot.low.toFixed(getPricePrecision(pair))} />
                    <AccountLine label="Prev" value={(marketSnapshot.previousClose ?? marketSnapshot.open).toFixed(getPricePrecision(pair))} />
                  </div>
                  {marketStructure && (
                    <div className="mt-3 grid grid-cols-3 gap-2 border-t border-white/5 pt-3">
                      <SummaryPill label="Structure" value={marketStructure.bias || "neutral"} tone={marketStructure.bias === "bullish" ? "text-green-300" : marketStructure.bias === "bearish" ? "text-red-300" : "text-slate-200"} />
                      <SummaryPill label="Latest Break" value={latestStructureEvent?.kind || "None"} tone={latestStructureEvent?.kind === "CHOCH" ? "text-purple-300" : "text-cyan-300"} />
                      <SummaryPill label="HTF Bands" value={marketStructure.htfSupport && marketStructure.htfResistance ? "Mapped" : "Developing"} tone="text-slate-200" />
                    </div>
                  )}
                </>
              ) : marketLoading ? (
                <p className="mt-4 text-sm text-gray-500">Loading chart...</p>
              ) : (
                <p className="mt-4 text-sm text-gray-500">No market snapshot loaded yet.</p>
              )}
            </Card>

            {marketStructure && marketStructure.events.length > 0 && (
              <Card>
                <CardHeader>Structure Events</CardHeader>
                <p className="mb-3 text-sm leading-6 text-gray-300">{marketStructure.summary}</p>
                <div className="grid gap-3 md:grid-cols-3">
                  {marketStructure.events.map((event) => (
                    <StructureEventCard key={`${event.kind}-${event.time}`} event={event} />
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* ── Right: sticky run analysis + alerts ── */}
          <div className="space-y-4 xl:sticky xl:top-4 xl:self-start">
          <div className="space-y-4">
            <Card>
              <CardHeader>Run Analysis</CardHeader>
              <textarea
                value={marketNotes}
                onChange={(event) => setMarketNotes(event.target.value)}
                placeholder="Example: H4 is bullish, price is testing yesterday's high, and London has not opened yet."
                className="mt-1 h-40 w-full rounded-xl border border-white/10 bg-surface px-3 py-3 text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />

              <div className="mt-4 space-y-2 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-yellow-300">
                  Mandatory Guardrails
                </div>
                <p className="text-sm text-gray-300">No stop loss means no trade.</p>
                <p className="text-sm text-gray-300">Score below 7 means deny. Funded accounts need 8+.</p>
                <p className="text-sm text-gray-300">High-impact news inside 30 minutes should stop execution.</p>
              </div>

              {analysis?.tradeSetup ? (
                <label className="mt-4 block">
                  <span className="text-sm text-gray-400">Execution Price</span>
                  <input
                    value={executionPrice}
                    onChange={(event) => setExecutionPrice(event.target.value)}
                    placeholder={getSuggestedEntryPrice(analysis, pair)}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-surface px-3 py-2 text-sm font-mono text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Use the exact manual execution price. Trade recording recalculates risk from this number.
                  </p>
                </label>
              ) : null}

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Button
                  onClick={runAnalysis}
                  disabled={loading || accountsLoading || activeAccounts.length === 0}
                  className="w-full sm:w-auto"
                >
                  {loading ? "Running Analysis..." : "Run Full Analysis"}
                </Button>
                <Button variant="ghost" onClick={clear} disabled={loading || !result} className="w-full sm:w-auto">
                  Clear
                </Button>
              </div>

              {loading ? (
                <div className="mt-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-4">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Analysis in progress</span>
                  </div>
                  <div className="grid gap-1.5 text-xs text-slate-400">
                    {[
                      "Fetching live market snapshot and economic calendar",
                      "Running macro, sentiment, and session analysis",
                      "Evaluating trade setup and entry conditions",
                      "Calculating risk per account and running denial checks",
                      "Generating final decision and reasoning",
                    ].map((step, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-cyan-500/60">→</span>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {cachedAt && !loading ? (
                <div className="mt-4 flex items-center justify-between rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-3">
                  <span className="text-xs text-yellow-300">
                    Cached result from {new Date(cachedAt).toLocaleTimeString()} — re-run to refresh
                  </span>
                  <button
                    type="button"
                    onClick={() => { clear(); runAnalysis(); }}
                    className="ml-4 text-xs font-semibold text-yellow-200 underline underline-offset-2 hover:text-white"
                  >
                    Refresh
                  </button>
                </div>
              ) : null}

              {activeAccounts.length === 0 ? (
                <p className="mt-3 text-sm text-red-300">
                  No active accounts are available. Activate one in settings before evaluating risk.
                </p>
              ) : null}
            </Card>

            <Card>
              <CardHeader>Workflow Reminder</CardHeader>
              <div className="grid gap-3">
                <InfoPanel title="Macro first" detail="Bias, strength, and sentiment still come before entry precision." />
                <InfoPanel title="Structure second" detail="Use swings and BOS or CHOCH to decide whether the chart agrees with the narrative." />
                <InfoPanel title="Execution last" detail="Only record the trade after the setup is CONFIRMED and every denial check stays clear." />
              </div>
            </Card>

            <MissedZonesPanel pair={pair} limit={3} />

            <PriceAlertCard pair={pair} currentPrice={marketSnapshot?.price} authFetch={authFetch} />
          </div>
          </div>
        </div>
      ) : null}

      {activeTab === "drivers" ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <Card>
            <CardHeader>Market Drivers</CardHeader>
            <div className="space-y-4">
              {marketRead ? (
                <>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <SummaryPill
                      label="Current Lean"
                      value={marketRead.lean}
                      tone={
                        marketRead.lean === "bullish"
                          ? "text-green-300"
                          : marketRead.lean === "bearish"
                            ? "text-red-300"
                            : "text-slate-200"
                      }
                    />
                    <SummaryPill
                      label="Caution Level"
                      value={marketRead.caution}
                      tone={
                        marketRead.caution === "high"
                          ? "text-red-300"
                          : marketRead.caution === "medium"
                            ? "text-yellow-300"
                            : "text-green-300"
                      }
                    />
                    <SummaryPill
                      label="Next Risk"
                      value={marketRead.nextEvent ? toTimeLabel(marketRead.nextEvent.time) : "Clear"}
                      tone="text-slate-200"
                    />
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950/25 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Live Read
                    </div>
                    <p className="mt-3 text-sm leading-6 text-gray-300">{marketRead.summary}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{marketRead.cautionReason}</p>
                  </div>
                </>
              ) : (
                <div className="rounded-xl border border-dashed border-white/10 bg-surface px-4 py-6 text-sm text-gray-500">
                  Waiting for market data to describe the live read.
                </div>
              )}

              <DriverBlock title="Could Push It Up" tone="green" items={marketNarrative?.up || []} />
              <DriverBlock title="Could Push It Down" tone="red" items={marketNarrative?.down || []} />
            </div>
          </Card>
          <Card>
            <CardHeader>News To Respect</CardHeader>
            <div className="space-y-3">
              {(marketNarrative?.relevantEvents.length || 0) > 0 ? (
                marketNarrative?.relevantEvents.map((event) => (
                  <div
                    key={`${event.currency}-${event.event}-${event.time.toISOString()}`}
                    className="rounded-xl border border-white/5 bg-surface px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-white">{event.event}</div>
                        <div className="mt-1 text-xs text-gray-500">
                          {event.currency} / {event.time.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={cn(
                            "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide",
                            event.impact === "high"
                              ? "bg-red-500/10 text-red-300"
                              : "bg-yellow-500/10 text-yellow-300"
                          )}
                        >
                          {event.impact}
                        </div>
                        <div className="mt-2 text-xs font-semibold text-slate-400">
                          {toTimeLabel(event.time)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-white/10 bg-surface px-4 py-6 text-sm text-gray-500">
                  No direct medium or high-impact releases are queued for this instrument right now. Keep the normal news buffer anyway.
                </div>
              )}

              {marketStructure ? (
                <div className="rounded-2xl border border-white/10 bg-slate-950/25 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Higher-Timeframe Cue
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-300">{marketStructure.summary}</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <CueCard
                      label="Support band"
                      value={
                        marketStructure.htfSupport
                          ? `${marketStructure.htfSupport.low.toFixed(getPricePrecision(pair))} - ${marketStructure.htfSupport.high.toFixed(getPricePrecision(pair))}`
                          : "Developing"
                      }
                    />
                    <CueCard
                      label="Resistance band"
                      value={
                        marketStructure.htfResistance
                          ? `${marketStructure.htfResistance.low.toFixed(getPricePrecision(pair))} - ${marketStructure.htfResistance.high.toFixed(getPricePrecision(pair))}`
                          : "Developing"
                      }
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </Card>
        </div>
      ) : null}

      {activeTab === "accounts" ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <Card>
            <CardHeader>Accounts in Scope</CardHeader>
            <div className="space-y-3">
              {accountsLoading && activeAccounts.length === 0 ? (
                <div className="text-sm text-gray-500">Loading accounts...</div>
              ) : null}

              {activeAccounts.map((account) => {
                const rules = getAccountRules(account.mode);
                const analysisRisk = analysis?.riskPerAccount[account.id];
                const denialResult = analysis ? result?.denialResults[account.id] : undefined;
                const blockers = analysis
                  ? getExecutionBlockers({
                      account,
                      analysis,
                      denialResult,
                      executionPrice,
                      pair,
                    })
                  : [];
                const canRecordTrade = analysis ? blockers.length === 0 : false;
                const hasBlockers = analysis ? blockers.length > 0 : false;
                const feedback = feedbackByAccount[account.id];

                return (
                  <div key={account.id} className="rounded-2xl border border-white/10 bg-slate-950/25 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="text-sm font-semibold text-white">{account.name}</div>
                        <div className="mt-1 text-xs uppercase tracking-wide text-gray-500">
                          {account.mode} account
                        </div>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-slate-950/25 px-3 py-2 text-right">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Risk</div>
                        <div className="mt-1 text-sm font-semibold text-white">
                          {formatPercent(account.riskPercent)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      <AccountLine label="Balance" value={formatCurrency(account.balance)} />
                      <AccountLine label="Trades Today" value={`${account.currentDailyTrades}/${rules.maxTradesPerDay}`} />
                      <AccountLine label="Daily Loss" value={formatCurrency(account.currentDailyLoss)} />
                      <AccountLine label="Loss Streak" value={`${account.lossesInARow}/${rules.stopAfterConsecutiveLosses}`} />
                    </div>

                    {analysisRisk && analysis?.tradeSetup ? (
                      <div className="mt-4 space-y-3">
                        {/* Trade levels */}
                        <div className={cn(
                          "rounded-xl border-2 p-3",
                          analysis.tradeSetup.direction === "LONG"
                            ? "border-green-500/30 bg-green-500/5"
                            : "border-red-500/30 bg-red-500/5"
                        )}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-xs uppercase tracking-wide text-gray-400">Trade Levels</div>
                            <span className={cn(
                              "text-xs font-bold uppercase px-2 py-0.5 rounded-full",
                              analysis.tradeSetup.direction === "LONG"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                            )}>
                              {analysis.tradeSetup.direction === "LONG" ? "BUY" : "SELL"}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="rounded-lg bg-white/5 p-2">
                              <div className="text-[10px] uppercase tracking-wide text-gray-500">Entry</div>
                              <div className="mt-1 font-mono text-sm font-semibold text-white">
                                {analysis.tradeSetup.entryZone.low.toFixed(getPricePrecision(pair))}
                              </div>
                              <div className="text-[9px] text-gray-600">–{analysis.tradeSetup.entryZone.high.toFixed(getPricePrecision(pair))}</div>
                            </div>
                            <div className="rounded-lg bg-red-500/10 p-2">
                              <div className="text-[10px] uppercase tracking-wide text-red-500">Stop Loss</div>
                              <div className="mt-1 font-mono text-sm font-semibold text-red-400">
                                {analysis.tradeSetup.stopLoss.toFixed(getPricePrecision(pair))}
                              </div>
                              <div className="text-[9px] text-gray-600">{formatCurrency(analysisRisk.maxLoss)} risk</div>
                            </div>
                            <div className="rounded-lg bg-green-500/10 p-2">
                              <div className="text-[10px] uppercase tracking-wide text-green-500">Take Profit</div>
                              <div className="mt-1 font-mono text-sm font-semibold text-green-400">
                                {analysis.tradeSetup.takeProfit.toFixed(getPricePrecision(pair))}
                              </div>
                              <div className="text-[9px] text-gray-600">{formatCurrency(analysisRisk.maxProfit)} profit</div>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                            <span>Lot size: <span className="text-white font-semibold font-mono">{analysisRisk.lotSize.toFixed(2)}</span></span>
                            <span>R:R <span className="text-white font-semibold">1:{analysisRisk.riskRewardRatio.toFixed(1)}</span></span>
                          </div>
                        </div>
                        {analysisRisk.denial ? (
                          <p className="text-xs text-red-300 px-1">{analysisRisk.denial}</p>
                        ) : null}
                      </div>
                    ) : analysisRisk ? (
                      <div className="mt-4 rounded-xl border border-white/10 bg-surface-light p-3">
                        <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">Risk Snapshot</div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <AccountLine label="Lot Size" value={analysisRisk.lotSize.toFixed(2)} />
                          <AccountLine label="R:R" value={`1:${analysisRisk.riskRewardRatio.toFixed(1)}`} />
                          <AccountLine label="Max Loss" value={formatCurrency(analysisRisk.maxLoss)} />
                          <AccountLine label="Max Profit" value={formatCurrency(analysisRisk.maxProfit)} />
                        </div>
                        {analysisRisk.denial ? (
                          <p className="mt-3 text-xs text-red-300">{analysisRisk.denial}</p>
                        ) : null}
                      </div>
                    ) : null}

                    {analysis ? (
                      <div className="mt-4 border-t border-white/5 pt-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Trade Recording
                          </div>
                          <div
                            className={cn(
                              "text-xs font-semibold",
                              canRecordTrade ? "text-green-400" : "text-red-300"
                            )}
                          >
                            {canRecordTrade ? "Ready to Record" : "Blocked"}
                          </div>
                        </div>

                        {canRecordTrade ? (
                          <p className="mt-3 text-sm text-gray-300">
                            This account passed the denial checks and can be recorded as an open trade.
                          </p>
                        ) : (
                          <ul className="mt-3 space-y-2 text-sm text-red-200">
                            {blockers.slice(0, 4).map((blocker, index) => (
                              <li key={`${account.id}-blocker-${index}`} className="rounded-lg bg-red-500/5 px-3 py-2">
                                {blocker}
                              </li>
                            ))}
                          </ul>
                        )}

                        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                          <Button
                            onClick={() => recordTrade(account)}
                            disabled={!canRecordTrade || activeActionId !== null}
                            className="w-full sm:w-auto"
                          >
                            {activeActionId === `${account.id}:create` ? "Recording..." : "Record Open Trade"}
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => logDenial(account)}
                            disabled={!hasBlockers || activeActionId !== null}
                            className="w-full sm:w-auto"
                          >
                            {activeActionId === `${account.id}:deny` ? "Logging..." : "Log Denial"}
                          </Button>
                        </div>

                        {feedback ? (
                          <div
                            className={cn(
                              "mt-3 rounded-lg px-3 py-2 text-sm",
                              feedback.tone === "success"
                                ? "border border-green-500/20 bg-green-500/10 text-green-200"
                                : "border border-red-500/20 bg-red-500/10 text-red-200"
                            )}
                          >
                            {feedback.message}
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <CardHeader>Manual Risk Calculator</CardHeader>
            <p className="mb-4 text-sm text-gray-400">
              Use this to sanity-check account sizing manually. The AI analysis remains the source of truth for entry status and denial logic.
            </p>
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <label className="text-xs uppercase tracking-[0.18em] text-slate-500">Account</label>
                <select
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  className="w-full min-w-[220px] rounded-lg border border-white/10 bg-surface px-3 py-2 text-sm text-white focus:border-brand-500/50 focus:outline-none"
                >
                  {activeAccounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} • {account.mode} • ${Number(account.balance).toFixed(0)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <button
                  type="button"
                  onClick={() => setLiveSync((v) => !v)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em]",
                    liveSync
                      ? "border-green-500/40 bg-green-500/10 text-green-200"
                      : "border-white/10 bg-surface text-slate-200"
                  )}
                >
                  {liveSync ? "Live sync ON" : "Live sync OFF"}
                </button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    if (!autoLevels) return;
                    setRiskDefaults((prev) => ({
                      ...prev,
                      entry: autoLevels.entry,
                      stopLoss: autoLevels.stopLoss,
                      takeProfit: autoLevels.takeProfit,
                      direction: autoLevels.direction,
                    }));
                    setRiskNote(autoLevels.note || null);
                  }}
                  disabled={!autoLevels}
                  className="w-full sm:w-auto"
                >
                  Auto-fill from live snapshot
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (!pairRisk) return;
                    setRiskDefaults((prev) => ({
                      ...prev,
                      entry: pairRisk.entry,
                      stopLoss: pairRisk.stopLoss,
                      takeProfit: pairRisk.takeProfit,
                      direction: pairRisk.direction,
                    }));
                    setRiskNote("Restored AI plan levels from the current analysis.");
                  }}
                  disabled={!pairRisk}
                  className="w-full sm:w-auto"
                >
                  Use AI plan levels
                </Button>
              </div>
            </div>

            <RiskCalculator
              pair={pair}
              direction={riskDefaults.direction || pairRisk?.direction}
              initialBalance={riskDefaults.balance ?? primaryAccount?.balance}
              initialRiskPercent={riskDefaults.riskPercent ?? primaryAccount?.riskPercent}
              initialEntryPrice={riskDefaults.entry ?? pairRisk?.entry}
              initialStopLoss={riskDefaults.stopLoss ?? pairRisk?.stopLoss}
              initialTakeProfit={riskDefaults.takeProfit ?? pairRisk?.takeProfit}
              presets={riskPresets}
              autoCalculateFlag={autoCalcTick}
              note={riskNote}
              onNote={setRiskNote}
            />
            {riskNote ? <p className="mt-3 text-sm text-slate-400">{riskNote}</p> : null}
          </Card>
        </div>
      ) : null}

      {activeTab === "analysis" ? (
        <div className="space-y-4">
          {!analysis && !loading ? (
            <Card className="overflow-hidden">
              <div className="rounded-2xl border border-dashed border-white/10 bg-[linear-gradient(135deg,_rgba(30,41,59,0.95),_rgba(15,23,42,0.9))] p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Awaiting Review
                </div>
                <h2 className="mt-3 text-2xl font-bold text-white">No analysis loaded yet</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  Run the pair workflow when you are calm, the session makes sense, and you are ready to accept &quot;no trade&quot; as a valid answer.
                </p>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  <InfoPanel title="Step 1" detail="Review macro, strength, and sentiment before caring about entry precision." />
                  <InfoPanel title="Step 2" detail="Check whether the setup is WAIT, READY, CONFIRMED, or INVALID." />
                  <InfoPanel title="Step 3" detail="Only size the trade if the setup survives every denial check." />
                </div>
              </div>
            </Card>
          ) : null}

          {loading ? (
            <Card>
              <CardHeader>Analysis Running</CardHeader>
              <div className="space-y-3">
                <LoadingRow />
                <LoadingRow />
                <LoadingRow />
              </div>
            </Card>
          ) : null}

          {analysis ? (
            <>
              <Card>
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <CardHeader className="mb-2">Decision Snapshot</CardHeader>
                    <div className="text-2xl font-bold text-white">{analysis.finalDecision.score}/10</div>
                    <p className="mt-2 text-sm leading-6 text-gray-400">{analysis.finalDecision.reasoning}</p>
                  </div>

                  <div className="space-y-2 md:text-right">
                    <StatusBadge status={analysis.entryStatus.status} size="md" showAction />
                    <div
                      className={cn(
                        "text-sm font-semibold",
                        analysis.finalDecision.decision === "TAKE_TRADE"
                          ? "text-green-400"
                          : analysis.finalDecision.decision === "DENY"
                            ? "text-red-400"
                            : "text-yellow-400"
                      )}
                    >
                      {analysis.finalDecision.decision.replace("_", " ")}
                    </div>
                  </div>
                </div>
              </Card>

              <AnalysisDisplay
                analysis={analysis}
                denials={result?.denialResults}
                accountNames={Object.fromEntries(activeAccounts.map((a) => [a.id, a.name]))}
              />
            </>
          ) : null}

          {analysisHistory.length > 0 ? (
            <Card>
              <CardHeader className="mb-3">Analysis History</CardHeader>
              <p className="mb-4 text-sm text-gray-400">Last {analysisHistory.length} analyses run for {pair}.</p>
              <div className="space-y-2">
                {analysisHistory.map((entry) => {
                  const decision = entry.result?.finalDecision?.decision;
                  const score = entry.result?.finalDecision?.score;
                  const bias = entry.result?.marketOverview?.bias;
                  return (
                    <div key={entry.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-surface px-4 py-3">
                      <div className="text-xs text-slate-400">
                        {entry.createdAt.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </div>
                      <div className="flex items-center gap-3">
                        {bias ? <span className="text-xs capitalize text-slate-300">{bias}</span> : null}
                        {score != null ? <span className="text-xs text-slate-400">{score}/10</span> : null}
                        {decision ? (
                          <span className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide",
                            decision === "TAKE_TRADE" ? "bg-green-500/15 text-green-300"
                              : decision === "DENY" ? "bg-red-500/15 text-red-300"
                              : "bg-yellow-500/15 text-yellow-300"
                          )}>
                            {decision.replace("_", " ")}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function HeroMetric({
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
      <div className="mt-2 text-lg font-semibold capitalize text-white">{value}</div>
      <div className="mt-1 text-sm text-slate-400">{detail}</div>
    </div>
  );
}

function AccountLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

function InfoPanel({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/30 p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-brand-300">{title}</div>
      <p className="mt-2 text-sm leading-6 text-slate-300">{detail}</p>
    </div>
  );
}

function LoadingRow() {
  return <div className="h-16 animate-pulse rounded-xl bg-surface-light" />;
}

function DriverBlock({
  title,
  tone,
  items,
}: {
  title: string;
  tone: "green" | "red";
  items: string[];
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/25 p-4">
      <div
        className={cn(
          "text-xs font-semibold uppercase tracking-[0.2em]",
          tone === "green" ? "text-green-300" : "text-red-300"
        )}
      >
        {title}
      </div>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div key={item} className="rounded-xl border border-white/5 bg-surface px-3 py-3 text-sm leading-6 text-gray-300">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/25 px-4 py-3">
      <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</div>
      <div className={cn("mt-2 text-lg font-semibold capitalize", tone)}>{value}</div>
    </div>
  );
}

function CueCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-surface px-3 py-3">
      <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className="mt-2 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

function StructureEventCard({ event }: { event: StructureEvent }) {
  return (
    <div className="rounded-xl border border-white/10 bg-surface px-3 py-3">
      <div
        className={cn(
          "text-[11px] font-semibold uppercase tracking-[0.18em]",
          event.kind === "CHOCH" ? "text-purple-300" : "text-cyan-300"
        )}
      >
        {event.kind} / {event.direction}
      </div>
      <div className="mt-2 text-sm font-semibold text-white">{event.price.toFixed(4)}</div>
      <div className="mt-1 text-xs text-slate-400">
        Broke {event.brokenLevel.toFixed(4)} at{" "}
        {new Date(event.time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
}

// ── Price Alert Card ─────────────────────────────────────────────────────────

interface PriceAlertRow {
  id: string;
  pair: string;
  targetPrice: string;
  condition: string;
  note: string | null;
  triggered: boolean;
  createdAt: string;
}

function PriceAlertCard({
  pair,
  currentPrice,
  authFetch,
}: {
  pair: CurrencyPair;
  currentPrice?: number;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
}) {
  const precision = getPricePrecision(pair);
  const [alerts, setAlerts] = useState<PriceAlertRow[]>([]);
  const [price, setPrice] = useState(currentPrice ? currentPrice.toFixed(precision) : "");
  const [condition, setCondition] = useState<"above" | "below">("above");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPrice(currentPrice ? currentPrice.toFixed(precision) : "");
  }, [currentPrice, precision]);

  useEffect(() => {
    authFetch(`/api/alerts?pair=${pair}`)
      .then((r) => r.ok ? r.json() : { alerts: [] })
      .then((d) => setAlerts(d.alerts || []))
      .catch(() => {});
  }, [pair, authFetch]);

  const create = async () => {
    const target = Number(price);
    if (!isFinite(target) || target <= 0) { setError("Enter a valid price."); return; }
    setSaving(true);
    setError(null);
    try {
      const res = await authFetch("/api/alerts", {
        method: "POST",
        body: JSON.stringify({ pair, targetPrice: target, condition, note: note.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setAlerts((prev) => [data.alert, ...prev]);
      setNote("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create alert");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    await authFetch(`/api/alerts?id=${id}`, { method: "DELETE" });
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <Card>
      <CardHeader>Price Alerts</CardHeader>
      <p className="mb-4 text-xs text-gray-500">
        Get a Telegram notification when price crosses your level. Checked every 5 minutes.
      </p>

      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value as "above" | "below")}
            className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white"
          >
            <option value="above">Price goes above</option>
            <option value="below">Price drops below</option>
          </select>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder={currentPrice ? currentPrice.toFixed(precision) : "0.00000"}
            className="flex-1 rounded-lg border border-white/10 bg-surface px-3 py-2 font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
          />
        </div>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional note (e.g. breakout level)"
          className="rounded-lg border border-white/10 bg-surface px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        <Button onClick={create} disabled={saving}>
          {saving ? "Saving…" : "Set Alert"}
        </Button>
      </div>

      {alerts.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="text-xs uppercase tracking-wide text-slate-500">Active Alerts</div>
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between rounded-lg border border-white/5 bg-surface px-3 py-2 text-sm">
              <div>
                <span className={cn("font-mono font-semibold", alert.condition === "above" ? "text-green-400" : "text-red-400")}>
                  {alert.condition === "above" ? "↑" : "↓"} {Number(alert.targetPrice).toFixed(precision)}
                </span>
                {alert.note && <span className="ml-2 text-xs text-slate-400">{alert.note}</span>}
              </div>
              <button
                onClick={() => remove(alert.id)}
                className="ml-3 text-xs text-slate-500 hover:text-red-400"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

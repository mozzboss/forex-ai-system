"use client";

import { FullAnalysis, TradeDenial } from "@/types";
import { cn, formatCurrency, formatRR, getBiasColor } from "@/lib/utils";
import { EntryStatusCard } from "@/components/ui/StatusBadge";
import { TradeDenialDisplay } from "./TradeDenialDisplay";

interface AnalysisDisplayProps {
  analysis: FullAnalysis;
  denials?: Record<string, { allowed: boolean; denials: TradeDenial[] }>;
  accountNames?: Record<string, string>;
}

export function AnalysisDisplay({ analysis, denials, accountNames }: AnalysisDisplayProps) {
  const {
    marketOverview,
    macro,
    sentiment,
    tradeSetup,
    entryStatus,
    exitLogic,
    sessionAndNews,
    finalDecision,
    riskPerAccount,
  } = analysis;

  return (
    <div className="space-y-4">
      <Section title="Market Overview">
        <Row label="Bias" value={marketOverview.bias.toUpperCase()} className={getBiasColor(marketOverview.bias)} />
        <Row label="Structure" value={marketOverview.structure} />
        <Row label="Volatility" value={marketOverview.volatility} />
        <Row label="Condition" value={marketOverview.marketCondition} />
      </Section>

      <Section title="Macro Analysis">
        <Row label="Rates" value={macro.interestRates} />
        <Row label="Central Bank" value={macro.centralBank} />
        <Row label="Inflation" value={macro.inflation} />
        <p className="mt-2 text-xs text-gray-500">{macro.summary}</p>
      </Section>

      <Section title="Sentiment">
        <Row label="Positioning" value={sentiment.retailPositioning} />
        <Row label="Bias" value={sentiment.bias.toUpperCase()} className={getBiasColor(sentiment.bias)} />
        <p className="mt-2 text-xs text-gray-500">{sentiment.summary}</p>
      </Section>

      {tradeSetup ? (
        <Section title="Trade Setup">
          <Row
            label="Direction"
            value={tradeSetup.direction}
            className={tradeSetup.direction === "LONG" ? "text-green-400" : "text-red-400"}
          />
          <Row label="Type" value={tradeSetup.setupType.replace("_", " ")} />
          <Row label="Entry Zone" value={`${tradeSetup.entryZone.low} - ${tradeSetup.entryZone.high}`} />
          <Row label="Confirmation" value={tradeSetup.confirmation} />
          <Row label="Invalidation" value={tradeSetup.invalidation} />
        </Section>
      ) : (
        <Section title="Trade Setup">
          <p className="text-sm text-gray-500">No valid setup identified. Wait for clarity.</p>
        </Section>
      )}

      <EntryStatusCard
        status={entryStatus.status}
        reason={entryStatus.reason}
        whatMustHappenNext={entryStatus.whatMustHappenNext}
      />

      {tradeSetup ? (
        <Section title="Exit Logic">
          <Row label="Stop Loss" value={exitLogic.stopLoss.toString()} className="font-mono text-red-400" />
          <Row label="Take Profit" value={exitLogic.takeProfit.toString()} className="font-mono text-green-400" />
          <Row label="Break-even" value={exitLogic.breakEvenRule} />
          <Row label="Trailing" value={exitLogic.trailingStop} />
        </Section>
      ) : null}

      {Object.keys(riskPerAccount).length > 0 ? (
        <Section title="Risk Per Account">
          {Object.entries(riskPerAccount).map(([accountId, risk]) => (
            <div key={accountId} className="mb-2 rounded-lg border border-white/5 bg-surface p-3">
              <div className="mb-2 text-xs font-semibold text-gray-400">
                {accountNames?.[accountId] ?? accountId}
              </div>
              <div className="grid grid-cols-2 gap-y-1 text-xs">
                <span className="text-gray-500">Lot Size</span>
                <span className="text-right font-mono">{risk.lotSize}</span>
                <span className="text-gray-500">Max Loss</span>
                <span className="text-right font-mono text-red-400">{formatCurrency(risk.maxLoss)}</span>
                <span className="text-gray-500">Max Profit</span>
                <span className="text-right font-mono text-green-400">{formatCurrency(risk.maxProfit)}</span>
                <span className="text-gray-500">R:R</span>
                <span className="text-right font-mono">{formatRR(risk.riskRewardRatio)}</span>
              </div>
              {risk.denial ? (
                <div className="mt-2 text-[10px] text-red-400">Blocked: {risk.denial}</div>
              ) : null}
            </div>
          ))}
        </Section>
      ) : null}

      {denials
        ? Object.entries(denials).map(([accountId, result]) =>
            !result.allowed ? <TradeDenialDisplay key={accountId} denials={result.denials} /> : null
          )
        : null}

      <Section title="Session & News">
        <Row label="Session" value={sessionAndNews.currentSession.replace("_", " ")} />
        <Row label="Best Timing" value={sessionAndNews.bestTiming} />
        <Row
          label="News Risk"
          value={sessionAndNews.newsRisk.toUpperCase()}
          className={
            sessionAndNews.newsRisk === "high"
              ? "text-red-400"
              : sessionAndNews.newsRisk === "medium"
                ? "text-yellow-400"
                : "text-green-400"
          }
        />
      </Section>

      <div
        className={cn(
          "rounded-xl border-2 p-5",
          finalDecision.decision === "TAKE_TRADE"
            ? "border-green-500/30 bg-green-500/5"
            : finalDecision.decision === "DENY"
              ? "border-red-500/30 bg-red-500/5"
              : "border-yellow-500/30 bg-yellow-500/5"
        )}
      >
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Final Decision</div>
        <div className="mb-2 flex items-center gap-3">
          <span
            className={cn(
              "text-2xl font-bold",
              finalDecision.decision === "TAKE_TRADE"
                ? "text-green-400"
                : finalDecision.decision === "DENY"
                  ? "text-red-400"
                  : "text-yellow-400"
            )}
          >
            {finalDecision.decision.replace("_", " ")}
          </span>
          <span className="text-sm font-mono text-gray-400">{finalDecision.score}/10</span>
        </div>
        <p className="text-sm text-gray-300">{finalDecision.reasoning}</p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/5 bg-surface-light p-5">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">{title}</div>
      {children}
    </div>
  );
}

function Row({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className="flex items-start justify-between py-1 text-sm">
      <span className="shrink-0 text-gray-400">{label}</span>
      <span className={cn("ml-4 text-right", className || "text-gray-200")}>{value}</span>
    </div>
  );
}

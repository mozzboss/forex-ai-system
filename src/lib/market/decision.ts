import type { FullAnalysis } from "@/types";

export type DecisionMode = "trade_now" | "wait" | "exit_now";

export interface PairDecisionSignal {
  mode: DecisionMode;
  reason: string;
  action: string;
  details: string[];
}

export function derivePairDecisionSignal(
  analysis: FullAnalysis | undefined,
  cautionDetail?: string
): PairDecisionSignal {
  if (!analysis) {
    return {
      mode: "wait",
      reason: "No fresh analysis is loaded yet, so there is nothing to execute or manage from this page.",
      action: "Run the full analysis first and wait for the system to classify the setup.",
      details: [
        "The entry status must be visible before any decision is allowed.",
        "No trade is valid until the setup becomes CONFIRMED.",
      ],
    };
  }

  if (analysis.entryStatus.status === "INVALID" || analysis.finalDecision.decision === "DENY") {
    return {
      mode: "exit_now",
      reason: analysis.entryStatus.reason,
      action: "Cancel the idea or close the trade if you are already in it.",
      details: [
        analysis.entryStatus.whatMustHappenNext,
        analysis.finalDecision.reasoning,
      ],
    };
  }

  if (analysis.entryStatus.status === "CONFIRMED" && analysis.finalDecision.decision === "TAKE_TRADE") {
    return {
      mode: "trade_now",
      reason: analysis.entryStatus.reason,
      action: "You may execute now, but only at planned price and with stop loss already set.",
      details: [
        analysis.finalDecision.reasoning,
        cautionDetail || "Keep respecting the news buffer and session logic.",
      ],
    };
  }

  return {
    mode: "wait",
    reason: analysis.entryStatus.reason,
    action: "Do not enter yet. Stay in observation mode until the setup is fully confirmed or invalidated.",
    details: [
      analysis.entryStatus.whatMustHappenNext,
      cautionDetail || "Wait for clearer market context before acting.",
    ],
  };
}

export function shouldSendDecisionAlert(mode: DecisionMode) {
  return mode === "trade_now";
}

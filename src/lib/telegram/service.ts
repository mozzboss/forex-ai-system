import type { Currency, CurrencyPair, DailyPlan, EndOfDayReview, Trade } from "@/types";
import type { PairDecisionSignal } from "@/lib/market/decision";

const TELEGRAM_API_BASE = "https://api.telegram.org";

interface TelegramSendMessageResponse {
  ok: boolean;
  description?: string;
}

function getBotToken() {
  return process.env.TELEGRAM_BOT_TOKEN?.trim();
}

export function isTelegramConfigured() {
  return Boolean(getBotToken());
}

async function sendOnce(token: string, chatId: string, message: string): Promise<void> {
  const response = await fetch(`${TELEGRAM_API_BASE}/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as TelegramSendMessageResponse | null;
    const description = payload?.description || `Telegram send failed with status ${response.status}.`;
    const err = new Error(description) as Error & { status?: number };
    err.status = response.status;
    throw err;
  }
}

export async function sendTelegramMessage(chatId: string, message: string): Promise<void> {
  const token = getBotToken();

  if (!token || !chatId.trim()) {
    return;
  }

  try {
    await sendOnce(token, chatId, message);
  } catch (firstError) {
    // Retry once on 5xx (server-side transient failures); never retry 4xx (bad token/chat_id)
    const status = (firstError as Error & { status?: number }).status;
    if (typeof status === "number" && status >= 500) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await sendOnce(token, chatId, message);
    } else {
      throw firstError;
    }
  }
}

function formatPrice(value: number) {
  return value.toFixed(value >= 10 ? 3 : 5);
}

function formatSignedCurrency(value: number) {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}$${Math.abs(value).toFixed(2)}`;
}

function formatTradeHeader(status: string) {
  switch (status) {
    case "open":
      return "Trade Active";
    case "pending":
      return "Trade Logged";
    case "closed":
      return "Trade Closed";
    case "cancelled":
      return "Trade Cancelled";
    case "denied":
      return "Trade Denied";
    default:
      return "Trade Update";
  }
}

export function formatTradeCreatedAlert(trade: Trade, accountName: string) {
  return [
    formatTradeHeader(trade.status),
    `${trade.pair} ${trade.direction} on ${accountName}`,
    `Entry status: ${trade.entryStatus}`,
    `Entry ${formatPrice(trade.entryPrice)} | SL ${formatPrice(trade.stopLoss)} | TP ${formatPrice(trade.takeProfit)}`,
    `Risk ${trade.riskAmount.toFixed(2)} | Lot ${trade.lotSize.toFixed(2)} | R:R 1:${trade.riskRewardRatio.toFixed(2)}`,
    `AI score ${trade.aiScore}/10`,
    trade.notes ? `Notes: ${trade.notes}` : "Stay disciplined. No entry unless conditions remain confirmed.",
  ].join("\n");
}

export function formatTradeClosedAlert(trade: Trade, accountName: string) {
  return [
    formatTradeHeader(trade.status),
    `${trade.pair} ${trade.direction} on ${accountName}`,
    `Realized P&L: ${formatSignedCurrency(trade.pnl ?? 0)}`,
    `Pips: ${(trade.pipsPnl ?? 0).toFixed(1)}`,
    `Closed at ${trade.closedAt ? new Date(trade.closedAt).toLocaleString() : "now"}`,
    trade.notes ? `Review: ${trade.notes}` : "Journal the lesson while the trade is fresh.",
  ].join("\n");
}

export function formatTradeCancelledAlert(trade: Trade, accountName: string) {
  return [
    formatTradeHeader(trade.status),
    `${trade.pair} ${trade.direction} on ${accountName}`,
    "The setup was cancelled before execution conditions were met.",
    trade.notes ? `Reason: ${trade.notes}` : "Walking away from a broken setup protects capital.",
  ].join("\n");
}

export function formatTradeDeniedAlert(trade: Trade, accountName: string) {
  return [
    formatTradeHeader(trade.status),
    `${trade.pair} ${trade.direction} on ${accountName}`,
    `Reason: ${trade.denialReason || "Trade failed system checks."}`,
    trade.aiReasoning || "No trade is a valid outcome when risk is unclear.",
  ].join("\n");
}

export function formatTelegramNewsDigest(events: Array<{
  currency: Currency;
  event: string;
  impact: "low" | "medium" | "high";
  time: Date;
}>) {
  if (events.length === 0) {
    return "No medium or high impact events are scheduled in the next 24 hours.";
  }

  return [
    "Upcoming economic events",
    ...events.map((event) => {
      return `${event.currency} ${event.event} | ${event.impact.toUpperCase()} | ${event.time.toLocaleString()}`;
    }),
  ].join("\n");
}

export function formatEndOfDaySummaryAlert(review: EndOfDayReview) {
  return [
    "End-of-day review",
    review.headline,
    `Discipline score: ${review.disciplineScore}/10`,
    `Closed trades: ${review.stats.closedTrades} | Win rate: ${review.stats.winRate}% | Realized P&L: ${formatSignedCurrency(review.stats.pnl)}`,
    review.strengths.length > 0
      ? `Keep: ${review.strengths.slice(0, 2).join(" | ")}`
      : "Keep: Stay patient with CONFIRMED-only entries.",
    review.mistakes.length > 0
      ? `Cut: ${review.mistakes.slice(0, 2).join(" | ")}`
      : "Cut: Remove anything impulsive or under-confirmed.",
    review.tomorrowFocus.length > 0
      ? `Tomorrow focus: ${review.tomorrowFocus.slice(0, 2).join(" | ")}`
      : "Tomorrow focus: Keep risk tight and wait for CONFIRMED status.",
  ].join("\n");
}

export function formatDailyPlanAlert(plan: DailyPlan) {
  return [
    "Daily plan",
    `Watchlist: ${plan.pairs.join(", ") || "No primary pairs selected"}`,
    `Macro bias: ${plan.macroBias}`,
    `Session focus: ${plan.sessionFocus}`,
    `News: ${plan.newsEvents}`,
    `Max planned trades: ${plan.maxTrades}`,
    `Levels: ${plan.keyLevels}`,
    plan.planNotes || "Keep the session simple and only act on CONFIRMED conditions.",
  ].join("\n");
}

export function formatSetupAlert(pair: CurrencyPair, bias: string, score: number): string {
  return [
    `Setup Watch: ${pair}`,
    `Bias: ${bias.toUpperCase()}`,
    `Score: ${score}/10`,
    `Run /pair ${pair} before doing anything. Entry still needs CONFIRMED status.`,
  ].join("\n");
}

export function formatDenialAlert(pair: CurrencyPair, reason: string): string {
  return [
    `Trade Denied: ${pair}`,
    `Reason: ${reason}`,
    "Capital protection stays first.",
  ].join("\n");
}

export function formatStatusUpdate(pair: CurrencyPair, status: string, reason: string): string {
  return [
    `${pair} status: ${status}`,
    reason,
  ].join("\n");
}

export function formatDecisionSignalAlert(pair: CurrencyPair, signal: PairDecisionSignal): string {
  const header =
    signal.mode === "trade_now"
      ? "TRADE NOW"
      : signal.mode === "exit_now"
        ? "EXIT NOW"
        : "WAIT";

  return [
    `${header}: ${pair}`,
    signal.reason,
    `Action: ${signal.action}`,
    ...(signal.details.slice(0, 2).map((detail) => `- ${detail}`)),
  ].join("\n");
}

export function formatRiskAlert(accountName: string, reason: string) {
  return [
    "Risk Alert",
    accountName,
    reason,
    "Pause and review before any new trades.",
  ].join("\n");
}

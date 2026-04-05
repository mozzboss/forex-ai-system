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

function buildTelegramHeader(...parts: string[]) {
  return parts.map((part) => normalizeTelegramText(part)).filter(Boolean).join(" | ");
}

function normalizeTelegramText(value: string) {
  return value.replace(/\r/g, "").replace(/\s+/g, " ").trim();
}

function truncateTelegramText(value: string, maxLength: number) {
  const normalized = normalizeTelegramText(value);
  if (normalized.length <= maxLength) {
    return normalized;
  }

  const clipped = normalized.slice(0, maxLength - 3);
  const boundaries = [". ", "; ", ", ", " "]
    .map((boundary) => clipped.lastIndexOf(boundary))
    .filter((index) => index > maxLength * 0.55);
  const boundary = boundaries.length > 0 ? Math.max(...boundaries) : -1;
  const safe = boundary >= 0 ? clipped.slice(0, boundary) : clipped;

  return `${safe.trim()}...`;
}

function humanizeTelegramValue(value: string) {
  return normalizeTelegramText(value).replace(/_/g, " ");
}

function extractTelegramPoints(value: string, maxPoints = 2, maxLength = 180) {
  const rawParts = value
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .flatMap((part) => part.split(/(?<=[.!?])\s+(?=[A-Z0-9])/));

  const points: string[] = [];

  for (const rawPart of rawParts) {
    const cleaned = rawPart.replace(/^(?:[-*]|\d+\.)\s*/, "").trim();
    if (!cleaned) {
      continue;
    }

    const point = truncateTelegramText(cleaned, maxLength);
    if (point && !points.includes(point)) {
      points.push(point);
    }

    if (points.length >= maxPoints) {
      break;
    }
  }

  return points;
}

function buildTelegramSection(title: string, lines: string[]) {
  if (lines.length === 0) {
    return "";
  }

  return [`[${title.toUpperCase()}]`, ...lines.map((line) => `- ${line}`)].join("\n");
}

function buildMetricRow(labelValues: Array<[string, string]>) {
  return labelValues
    .map(([label, value]) => `${label}: ${normalizeTelegramText(value)}`)
    .join(" | ");
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
    buildTelegramHeader(accountName, formatTradeHeader(trade.status)),
    buildTelegramHeader(trade.pair, trade.direction, trade.entryStatus),
    "",
    buildMetricRow([
      ["Entry", formatPrice(trade.entryPrice)],
      ["SL", formatPrice(trade.stopLoss)],
      ["TP", formatPrice(trade.takeProfit)],
    ]),
    buildMetricRow([
      ["Risk", trade.riskAmount.toFixed(2)],
      ["Lot", trade.lotSize.toFixed(2)],
      ["RR", `1:${trade.riskRewardRatio.toFixed(2)}`],
      ["Score", `${trade.aiScore}/10`],
    ]),
    trade.notes
      ? buildTelegramSection("Notes", [truncateTelegramText(trade.notes, 140)])
      : buildTelegramSection("Notes", ["Stay disciplined. No entry unless conditions remain confirmed."]),
  ].join("\n");
}

export function formatTradeClosedAlert(trade: Trade, accountName: string) {
  return [
    buildTelegramHeader(accountName, formatTradeHeader(trade.status)),
    buildTelegramHeader(trade.pair, trade.direction),
    "",
    buildMetricRow([
      ["P&L", formatSignedCurrency(trade.pnl ?? 0)],
      ["Pips", (trade.pipsPnl ?? 0).toFixed(1)],
      ["Closed", trade.closedAt ? new Date(trade.closedAt).toLocaleString() : "now"],
    ]),
    trade.notes
      ? buildTelegramSection("Review", [truncateTelegramText(trade.notes, 140)])
      : buildTelegramSection("Review", ["Journal the lesson while the trade is fresh."]),
  ].join("\n");
}

export function formatTradeCancelledAlert(trade: Trade, accountName: string) {
  return [
    buildTelegramHeader(accountName, formatTradeHeader(trade.status)),
    buildTelegramHeader(trade.pair, trade.direction),
    "",
    buildTelegramSection("Why", ["The setup was cancelled before execution conditions were met."]),
    buildTelegramSection(
      "Do now",
      [trade.notes ? truncateTelegramText(trade.notes, 140) : "Walking away from a broken setup protects capital."]
    ),
  ].join("\n");
}

export function formatTradeDeniedAlert(trade: Trade, accountName: string) {
  return [
    buildTelegramHeader(accountName, formatTradeHeader(trade.status)),
    buildTelegramHeader(trade.pair, trade.direction),
    "",
    buildTelegramSection("Why", [
      trade.denialReason ? humanizeTelegramValue(trade.denialReason) : "Trade failed system checks.",
    ]),
    buildTelegramSection(
      "Checks",
      extractTelegramPoints(
        trade.aiReasoning || "No trade is a valid outcome when risk is unclear.",
        2,
        130
      )
    ),
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
    buildTelegramHeader("NEWS", "Upcoming economic events"),
    "",
    ...events.map((event) => {
      return `- ${buildTelegramHeader(event.currency, event.event, event.impact.toUpperCase())} @ ${event.time.toLocaleString()}`;
    }),
  ].join("\n");
}

export function formatEndOfDaySummaryAlert(review: EndOfDayReview) {
  const sections = [
    buildTelegramHeader("REVIEW", review.date.toLocaleDateString()),
    truncateTelegramText(review.headline, 160),
    "",
    buildMetricRow([
      ["Discipline", `${review.disciplineScore}/10`],
      ["Closed", `${review.stats.closedTrades}`],
      ["Win rate", `${review.stats.winRate}%`],
      ["P&L", formatSignedCurrency(review.stats.pnl)],
    ]),
    buildTelegramSection(
      "Keep",
      review.strengths.length > 0
        ? review.strengths.slice(0, 2).map((value) => truncateTelegramText(value, 120))
        : ["Stay patient with CONFIRMED-only entries."]
    ),
    buildTelegramSection(
      "Cut",
      review.mistakes.length > 0
        ? review.mistakes.slice(0, 2).map((value) => truncateTelegramText(value, 120))
        : ["Remove anything impulsive or under-confirmed."]
    ),
    buildTelegramSection(
      "Tomorrow",
      review.tomorrowFocus.length > 0
        ? review.tomorrowFocus.slice(0, 2).map((value) => truncateTelegramText(value, 120))
        : ["Keep risk tight and wait for CONFIRMED status."]
    ),
  ];

  return sections.filter(Boolean).join("\n\n");
}

export function formatDailyPlanAlert(plan: DailyPlan) {
  const sections = [
    buildTelegramHeader("PLAN", plan.date.toLocaleDateString()),
    `WATCHLIST: ${plan.pairs.join(" | ") || "No primary pairs selected"}`,
    `TRADES: max ${plan.maxTrades}`,
    buildTelegramSection("Macro", extractTelegramPoints(plan.macroBias, 2, 130)),
    buildTelegramSection("Session", extractTelegramPoints(plan.sessionFocus, 2, 130)),
    buildTelegramSection("News", extractTelegramPoints(plan.newsEvents, 2, 130)),
    buildTelegramSection("Levels", extractTelegramPoints(plan.keyLevels, 2, 130)),
    buildTelegramSection(
      "Focus",
      extractTelegramPoints(
        plan.planNotes || "Keep the session simple and only act on CONFIRMED conditions.",
        3,
        120
      )
    ),
    buildTelegramSection("Execution rule", ["CONFIRMED only. WAIT and READY are still no-entry states."]),
  ];

  return sections.filter(Boolean).join("\n\n");
}

export function formatSetupAlert(pair: CurrencyPair, bias: string, score: number): string {
  return [
    buildTelegramHeader(pair, "SETUP WATCH"),
    buildMetricRow([
      ["Bias", bias.toUpperCase()],
      ["Score", `${score}/10`],
    ]),
    buildTelegramSection("Do now", [`Run /pair ${pair} before doing anything. Entry still needs CONFIRMED status.`]),
  ].join("\n");
}

export function formatDenialAlert(pair: CurrencyPair, reason: string): string {
  return [
    buildTelegramHeader(pair, "TRADE DENIED"),
    buildTelegramSection("Why", [truncateTelegramText(reason, 120)]),
    buildTelegramSection("Do now", ["Capital protection stays first."]),
  ].join("\n");
}

export function formatStatusUpdate(pair: CurrencyPair, status: string, reason: string): string {
  return [
    buildTelegramHeader(pair, status),
    buildTelegramSection("Why", extractTelegramPoints(reason, 2, 120)),
  ].join("\n");
}

export function formatDecisionSignalAlert(pair: CurrencyPair, signal: PairDecisionSignal): string {
  const header =
    signal.mode === "trade_now"
      ? "TRADE NOW"
      : signal.mode === "exit_now"
        ? "EXIT NOW"
        : "WAIT";

  const sections = [
    buildTelegramHeader(pair, header),
    buildTelegramSection("Why", extractTelegramPoints(signal.reason, 2, 120)),
    buildTelegramSection("Do now", [truncateTelegramText(signal.action, 120)]),
    buildTelegramSection(
      "Checks",
      signal.details.slice(0, 3).map((detail) => truncateTelegramText(detail, 110))
    ),
  ];

  return sections.filter(Boolean).join("\n\n");
}

export function formatRiskAlert(accountName: string, reason: string) {
  const sections = [
    buildTelegramHeader(accountName, "RISK ALERT"),
    buildTelegramSection("Why", extractTelegramPoints(reason, 2, 120)),
    buildTelegramSection("Do now", ["Pause and review before any new trades."]),
  ];

  return sections.filter(Boolean).join("\n\n");
}

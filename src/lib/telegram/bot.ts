import { Telegraf, type Context } from "telegraf";
import type { Update } from "telegraf/types";

import { ALL_PAIRS } from "@/config/trading";
import { generateDailyPlan } from "@/lib/ai/daily-plan";
import { quickPairCheck } from "@/lib/ai/engine";
import { fetchEconomicCalendar, formatNewsContextForAnalysis, getPairCurrencies } from "@/lib/market/news";
import { calculateRisk } from "@/lib/risk/engine";
import {
  createJournalEntry,
  findUserByTelegramChatId,
  getDailyPlanContext,
  getSavedDailyPlan,
  getTelegramConnectionStatus,
  linkTelegramChatByCode,
  listAccounts,
  listTrades,
  saveDailyPlan,
} from "@/lib/server/persistence";
import { formatDailyPlanAlert } from "@/lib/telegram/service";
import { formatCurrency, formatLotSize, formatPips, formatRR } from "@/lib/utils";
import type { CurrencyPair, RiskInput, TradingAccount } from "@/types";

const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
const bot = token ? new Telegraf(token) : null;

function normalizePair(value?: string) {
  const pair = value?.trim().toUpperCase();
  if (!pair) {
    return null;
  }

  return ALL_PAIRS.includes(pair as CurrencyPair) ? (pair as CurrencyPair) : null;
}

function getMessageText(ctx: Context) {
  const message = ctx.message;

  if (message && "text" in message) {
    return message.text;
  }

  return "";
}

function getChatId(ctx: Context) {
  const chatId = ctx.chat?.id;
  return typeof chatId === "number" || typeof chatId === "string" ? String(chatId) : null;
}

function normalizeBotText(value: string) {
  return value.replace(/\r/g, "").replace(/\s+/g, " ").trim();
}

function truncateBotText(value: string, maxLength: number) {
  const normalized = normalizeBotText(value);
  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 3).trim()}...`;
}

function buildBotHeader(...parts: string[]) {
  return parts.map((part) => normalizeBotText(part)).filter(Boolean).join(" | ");
}

function buildBotSection(title: string, lines: string[]) {
  if (lines.length === 0) {
    return "";
  }

  return [`[${title.toUpperCase()}]`, ...lines.map((line) => `- ${normalizeBotText(line)}`)].join("\n");
}

function buildBotMetricRow(labelValues: Array<[string, string]>) {
  return labelValues
    .map(([label, value]) => `${label}: ${normalizeBotText(value)}`)
    .join(" | ");
}

async function getLinkedUser(ctx: Context) {
  const chatId = getChatId(ctx);

  if (!chatId) {
    await ctx.reply("This chat is not supported for account access.");
    return null;
  }

  const user = await findUserByTelegramChatId(chatId);

  if (!user) {
    await ctx.reply(
      "This chat is not linked yet. Open Settings in the web app, generate a Telegram code, then send /start CODE here."
    );
    return null;
  }

  return user;
}

function formatAccountsMessage(accounts: TradingAccount[]) {
  if (accounts.length === 0) {
    return "No trading accounts found yet. Create one in Settings first.";
  }

  return [
    buildBotHeader("ACCOUNTS", `${accounts.length} LINKED`),
    ...accounts.map((account) => {
      return [
        buildBotHeader(account.name, account.mode.toUpperCase()),
        buildBotMetricRow([
          ["Bal", formatCurrency(account.balance)],
          ["Eq", formatCurrency(account.equity)],
        ]),
        buildBotMetricRow([
          ["Risk", `${account.riskPercent.toFixed(2)}%`],
          ["Trades", `${account.currentDailyTrades}/${account.maxTradesPerDay}`],
          ["Open", `${account.openTrades.length}`],
        ]),
        buildBotMetricRow([
          ["Loss", `${formatCurrency(account.currentDailyLoss)}/${formatCurrency(account.maxDailyLoss)}`],
          ["Streak", `${account.lossesInARow}`],
        ]),
      ].join("\n");
    }),
  ].join("\n\n");
}

function formatRulesMessage() {
  return [
    buildBotHeader("RULES", "EXECUTION"),
    buildBotSection("Funded", ["0.25%-0.5% risk | Max 3 trades | Stop after 2 losses | Min 1:2 RR | Score 8+"]),
    buildBotSection("Personal", ["1%-2% risk | Max 5 trades | Stop after 3 losses | Min 1:1.5 RR | Score 7+"]),
    buildBotSection("Non-negotiables", [
      "WAIT and READY are still no-entry states.",
      "Only CONFIRMED qualifies for execution.",
      "No stop loss means no trade.",
    ]),
  ].join("\n\n");
}

function formatHelpMessage() {
  return [
    "Forex AI — available commands",
    "",
    "/pair EURUSD — quick bias check and score for a pair",
    "/risk BALANCE RISK% ENTRY SL TP PAIR DIR — position size calculator",
    "/accounts — your account balances, daily limits, and loss streaks",
    "/trades — open and pending positions with entry, SL, TP, and risk",
    "/status — today's risk usage across all accounts",
    "/news [PAIR] — upcoming economic events (optionally filtered by pair)",
    "/plan — today's daily plan (generates one if none exists yet)",
    "/journal your note — log a quick journal entry from Telegram",
    "/rules — funded and personal account rule summary",
    "/help — show this message",
    "",
    "Entry status: WAIT → READY → CONFIRMED → INVALID",
    "Only CONFIRMED qualifies for execution. No exceptions.",
  ].join("\n");
}

function formatStatusMessage(accounts: TradingAccount[]) {
  if (accounts.length === 0) {
    return "No accounts found. Create one in Settings first.";
  }

  const lines: string[] = ["Today's risk status"];

  for (const account of accounts) {
    const tradesLeft = Math.max(account.maxTradesPerDay - account.currentDailyTrades, 0);
    const dailyLossRemaining = Math.max(account.maxDailyLoss - account.currentDailyLoss, 0);
    const drawdownUsed = account.balance - account.equity;
    const drawdownPct = account.maxDrawdown > 0
      ? ((drawdownUsed / account.maxDrawdown) * 100).toFixed(1)
      : "0.0";

    const flags: string[] = [];
    if (tradesLeft === 0) flags.push("daily trade limit reached");
    if (account.currentDailyLoss >= account.maxDailyLoss) flags.push("daily loss limit reached");
    if (account.lossesInARow >= 2) flags.push(`${account.lossesInARow} losses in a row`);
    if (drawdownUsed >= account.maxDrawdown * 0.8) flags.push("drawdown near limit");

    lines.push(
      "",
      `${account.name} (${account.mode})`,
      `Trades today: ${account.currentDailyTrades}/${account.maxTradesPerDay} — ${tradesLeft} left`,
      `Daily loss: ${formatCurrency(account.currentDailyLoss)} / ${formatCurrency(account.maxDailyLoss)} — ${formatCurrency(dailyLossRemaining)} remaining`,
      `Drawdown: ${formatCurrency(drawdownUsed)} / ${formatCurrency(account.maxDrawdown)} (${drawdownPct}%)`,
      `Loss streak: ${account.lossesInARow}`,
      flags.length > 0 ? `Flags: ${flags.join(", ")}` : "No active flags"
    );
  }

  return lines.join("\n");
}

function formatCompactHelpMessage() {
  return [
    buildBotHeader("FOREX AI", "COMMANDS"),
    buildBotSection("Checks", [
      "/pair EURUSD - quick bias + score",
      "/risk BALANCE RISK% ENTRY SL TP PAIR DIR - position size",
      "/news [PAIR] - upcoming events",
      "/plan - today's daily plan",
    ]),
    buildBotSection("Accounts", [
      "/accounts - balances, limits, streaks",
      "/trades - open and pending positions",
      "/status - today's risk usage",
      "/rules - funded and personal rules",
    ]),
    buildBotSection("Journal", [
      "/journal your note - save a quick note",
      "/help - show commands",
    ]),
    buildBotSection("Execution flow", [
      "WAIT -> READY -> CONFIRMED -> INVALID",
      "Only CONFIRMED qualifies for execution.",
    ]),
  ].join("\n\n");
}

function formatCompactStatusMessage(accounts: TradingAccount[]) {
  if (accounts.length === 0) {
    return "No accounts found. Create one in Settings first.";
  }

  const blocks: string[] = [buildBotHeader("STATUS", "TODAY")];

  for (const account of accounts) {
    const tradesLeft = Math.max(account.maxTradesPerDay - account.currentDailyTrades, 0);
    const dailyLossRemaining = Math.max(account.maxDailyLoss - account.currentDailyLoss, 0);
    const drawdownUsed = account.balance - account.equity;
    const drawdownPct = account.maxDrawdown > 0
      ? ((drawdownUsed / account.maxDrawdown) * 100).toFixed(1)
      : "0.0";

    const flags: string[] = [];
    if (tradesLeft === 0) flags.push("Daily trade limit reached");
    if (account.currentDailyLoss >= account.maxDailyLoss) flags.push("Daily loss limit reached");
    if (account.lossesInARow >= 2) flags.push(`${account.lossesInARow} losses in a row`);
    if (drawdownUsed >= account.maxDrawdown * 0.8) flags.push("Drawdown near limit");

    blocks.push(
      [
        buildBotHeader(account.name, account.mode.toUpperCase()),
        buildBotMetricRow([
          ["Trades", `${account.currentDailyTrades}/${account.maxTradesPerDay}`],
          ["Left", `${tradesLeft}`],
          ["Streak", `${account.lossesInARow}`],
        ]),
        buildBotMetricRow([
          ["Loss", `${formatCurrency(account.currentDailyLoss)}/${formatCurrency(account.maxDailyLoss)}`],
          ["Left", formatCurrency(dailyLossRemaining)],
        ]),
        buildBotMetricRow([
          ["DD", `${formatCurrency(drawdownUsed)}/${formatCurrency(account.maxDrawdown)}`],
          ["Used", `${drawdownPct}%`],
        ]),
        flags.length > 0
          ? buildBotSection("Flags", flags.map((flag) => truncateBotText(flag, 60)))
          : buildBotSection("Flags", ["Clear"]),
      ].join("\n")
    );
  }

  return blocks.join("\n\n");
}

function formatTradesMessage(trades: ReturnType<typeof mapTradeForBot>[]) {
  if (trades.length === 0) {
    return "No open or pending trades right now. Good time to plan the next session.";
  }

  const header = buildBotHeader("OPEN TRADES", `${trades.length}`);

  const rows = trades.map((trade) => {
    const pnlLine = typeof trade.pnl === "number"
      ? buildBotMetricRow([["Unrealized", formatCurrency(trade.pnl)]])
      : null;

    return [
      buildBotHeader(trade.pair, trade.direction.toUpperCase(), trade.status.toUpperCase()),
      buildBotMetricRow([
        ["Entry", trade.entryPrice.toFixed(5)],
        ["SL", trade.stopLoss.toFixed(5)],
        ["TP", trade.takeProfit.toFixed(5)],
      ]),
      buildBotMetricRow([
        ["Lot", trade.lotSize.toFixed(2)],
        ["Risk", formatCurrency(trade.riskAmount)],
        ["Score", `${trade.aiScore}/10`],
      ]),
      pnlLine,
    ].filter(Boolean).join("\n");
  });

  return [header, ...rows].join("\n\n");
}

function mapTradeForBot(trade: {
  pair: string;
  direction: string;
  status: string;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  lotSize: number;
  riskAmount: number;
  aiScore: number;
  pnl?: number;
}) {
  return trade;
}

async function replyWithStartMessage(ctx: Context, linked = false) {
  await ctx.reply(
    linked
      ? "Telegram is linked. Send /help to see all available commands."
      : [
          "Forex AI Trading Assistant",
          "This is a discipline companion, not a signal bot.",
          "To connect this chat, generate a Telegram code in Settings and send /start CODE here.",
          "Once linked, send /help to see all available commands.",
        ].join("\n")
  );
}

if (bot) {
  bot.catch((error) => {
    console.error("Telegram bot error:", error);
  });

  bot.start(async (ctx) => {
    const code = getMessageText(ctx).split(/\s+/).slice(1).join("").trim().toUpperCase();
    const chatId = getChatId(ctx);

    if (!code) {
      const linkedUser = chatId ? await findUserByTelegramChatId(chatId) : null;
      await replyWithStartMessage(ctx, Boolean(linkedUser));
      return;
    }

    if (!chatId) {
      await ctx.reply("Unable to read this Telegram chat. Please try again from a private chat.");
      return;
    }

    const linked = await linkTelegramChatByCode({ code, chatId });

    if (!linked) {
      await ctx.reply("That connection code is invalid or expired. Generate a new code in Settings and try again.");
      return;
    }

    await ctx.reply(
      `Connected successfully. Alerts are ${linked.alertsEnabled ? "enabled" : "disabled"} for ${linked.email}.`
    );
  });

  bot.command("connect", async (ctx) => {
    const code = getMessageText(ctx).split(/\s+/)[1]?.trim().toUpperCase();
    const chatId = getChatId(ctx);

    if (!code) {
      await ctx.reply("Use /connect CODE after generating a Telegram code in Settings.");
      return;
    }

    if (!chatId) {
      await ctx.reply("Unable to read this Telegram chat. Please try again from a private chat.");
      return;
    }

    const linked = await linkTelegramChatByCode({ code, chatId });

    if (!linked) {
      await ctx.reply("That connection code is invalid or expired. Generate a new code in Settings and try again.");
      return;
    }

    await ctx.reply(`Connected successfully for ${linked.email}.`);
  });

  bot.command("pair", async (ctx) => {
    const pair = normalizePair(getMessageText(ctx).split(/\s+/)[1]);

    if (!pair) {
      await ctx.reply(`Invalid pair. Use /pair EURUSD. Supported pairs include ${ALL_PAIRS.slice(0, 8).join(", ")}.`);
      return;
    }

    await ctx.reply(`Checking ${pair}.`);

    try {
      const result = await quickPairCheck(pair);
      await ctx.reply(
        [
          buildBotHeader(pair, "QUICK CHECK"),
          buildBotMetricRow([
            ["Bias", result.bias],
            ["Score", `${result.score}/10`],
          ]),
          buildBotSection("Read", [truncateBotText(result.summary, 140)]),
          buildBotSection("Do now", [
            result.score >= 7
              ? "Worth watching, but still wait for CONFIRMED status."
              : "Not ready. No trade is fine.",
          ]),
        ].join("\n\n")
      );
    } catch (error) {
      console.error("Telegram pair command failed:", error);
      await ctx.reply("Analysis failed. Verify the pair manually and do not trade without confirmation.");
    }
  });

  bot.command("risk", async (ctx) => {
    const parts = getMessageText(ctx).split(/\s+/).slice(1) ?? [];

    if (parts.length < 7) {
      await ctx.reply(
        "Use /risk BALANCE RISK% ENTRY SL TP PAIR DIRECTION\nExample: /risk 100000 0.5 1.0850 1.0800 1.0950 EURUSD LONG"
      );
      return;
    }

    const [balance, riskPct, entry, sl, tp, rawPair, direction] = parts;
    const pair = normalizePair(rawPair);

    if (!pair || !["LONG", "SHORT"].includes(direction?.toUpperCase())) {
      await ctx.reply("Use a valid pair and direction. Example: /risk 5000 1 1.0850 1.0800 1.0950 EURUSD LONG");
      return;
    }

    const input: RiskInput = {
      accountBalance: Number(balance),
      riskPercent: Number(riskPct),
      entryPrice: Number(entry),
      stopLossPrice: Number(sl),
      takeProfitPrice: Number(tp),
      pair,
      direction: direction.toUpperCase() as RiskInput["direction"],
    };

    const result = calculateRisk(input);

    await ctx.reply(
      [
        buildBotHeader(pair, "RISK CHECK", input.direction),
        buildBotMetricRow([
          ["Risk", formatCurrency(result.riskAmount)],
          ["Pips", formatPips(result.pipDistance)],
          ["Lot", formatLotSize(result.lotSize)],
        ]),
        buildBotMetricRow([
          ["Max loss", formatCurrency(result.maxLoss)],
          ["Max profit", formatCurrency(result.maxProfit)],
          ["RR", formatRR(result.riskRewardRatio)],
        ]),
        buildBotSection(
          "Status",
          [result.denial ? `Denied: ${result.denial}` : "Valid on position sizing only. Strategy still needs confirmation."]
        ),
      ].join("\n\n")
    );
  });

  bot.command("accounts", async (ctx) => {
    const user = await getLinkedUser(ctx);
    if (!user) {
      return;
    }

    const accounts = await listAccounts(user.id);
    await ctx.reply(formatAccountsMessage(accounts));
  });

  bot.command("rules", async (ctx) => {
    await ctx.reply(formatRulesMessage());
  });

  bot.command("help", async (ctx) => {
    await ctx.reply(formatCompactHelpMessage());
  });

  bot.command("status", async (ctx) => {
    const user = await getLinkedUser(ctx);
    if (!user) {
      return;
    }

    const accounts = await listAccounts(user.id);
    await ctx.reply(formatCompactStatusMessage(accounts));
  });

  bot.command("trades", async (ctx) => {
    const user = await getLinkedUser(ctx);
    if (!user) {
      return;
    }

    try {
      const { trades } = await listTrades(user.id, { status: "open" });
      const pending = await listTrades(user.id, { status: "pending" });
      const all = [...trades, ...pending.trades];
      await ctx.reply(formatTradesMessage(all.map(mapTradeForBot)));
    } catch (error) {
      console.error("Telegram trades command failed:", error);
      await ctx.reply("Could not load open trades. Check the web dashboard.");
    }
  });

  bot.command("news", async (ctx) => {
    const rawValue = getMessageText(ctx).split(/\s+/)[1];
    const pair = normalizePair(rawValue);

    try {
      const events = await fetchEconomicCalendar({
        currencies: pair ? getPairCurrencies(pair) : undefined,
        limit: 6,
      });

      if (pair) {
        await ctx.reply(formatNewsContextForAnalysis(events, pair));
        return;
      }

      await ctx.reply(
        events.length === 0
          ? "No medium or high impact events are scheduled in the next few days."
          : [
              "Upcoming economic events",
              ...events.map((event) => {
                return `${event.currency} ${event.event} | ${event.impact.toUpperCase()} | ${event.time.toLocaleString()}`;
              }),
            ].join("\n")
      );
    } catch (error) {
      console.error("Telegram news command failed:", error);
      await ctx.reply("News feed is unavailable right now. Check the web dashboard before trading around news.");
    }
  });

  bot.command("journal", async (ctx) => {
    const user = await getLinkedUser(ctx);
    if (!user) {
      return;
    }

    const note = getMessageText(ctx).replace(/^\/journal(@\w+)?\s*/i, "").trim();

    if (!note) {
      await ctx.reply("Use /journal your note here");
      return;
    }

    await createJournalEntry({
      userId: user.id,
      type: "review",
      content: note,
      tags: ["telegram"],
    });

    await ctx.reply("Journal note saved. Keep logging the process, not just the outcome.");
  });

  bot.command("plan", async (ctx) => {
    const user = await getLinkedUser(ctx);
    if (!user) {
      return;
    }

    const existingPlan = await getSavedDailyPlan(user.id);

    if (existingPlan) {
      await ctx.reply(formatDailyPlanAlert(existingPlan));
      return;
    }

    const context = await getDailyPlanContext(user.id);
    const generatedPlan = await generateDailyPlan(context);
    const savedPlan = await saveDailyPlan(user.id, generatedPlan);
    const status = await getTelegramConnectionStatus(user.id);

    await ctx.reply(
      [
        formatDailyPlanAlert(savedPlan),
        `Telegram alerts are currently ${status.alertsEnabled ? "enabled" : "disabled"} for this linked account.`,
      ].join("\n\n")
    );
  });
}

export async function handleTelegramUpdate(update: Update) {
  if (!bot) {
    throw new Error("Telegram bot token is not configured.");
  }

  await bot.handleUpdate(update);
}

export async function sendTelegramAlert(chatId: string, message: string): Promise<void> {
  const { sendTelegramMessage } = await import("./service");
  await sendTelegramMessage(chatId, message);
}

export function startBot() {
  if (!bot) {
    throw new Error("TELEGRAM_BOT_TOKEN is required to start the Telegram bot.");
  }

  bot.launch();
  console.log("Telegram bot started in polling mode.");

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
}

if (require.main === module) {
  startBot();
}

export default bot;

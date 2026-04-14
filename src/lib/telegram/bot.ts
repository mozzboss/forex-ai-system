import { Telegraf, type Context } from "telegraf";
import type { Update } from "telegraf/types";

import { ALL_PAIRS } from "@/config/trading";
import { generateDailyPlan } from "@/lib/ai/daily-plan";
import { quickPairCheck } from "@/lib/ai/engine";
import { fetchEconomicCalendar, formatNewsContextForAnalysis, getPairCurrencies } from "@/lib/market/news";
import { fetchMultiTimeframeContext } from "@/lib/market/prices";
import { calculateRisk } from "@/lib/risk/engine";
import {
  createJournalEntry,
  findUserByTelegramChatId,
  getDailyPlanContext,
  getSavedDailyPlan,
  getTelegramConnectionStatus,
  linkTelegramChatByCode,
  listAccounts,
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
    "Your accounts",
    ...accounts.map((account, index) => {
      return [
        `${index + 1}. ${account.name} (${account.mode})`,
        `Balance ${formatCurrency(account.balance)} | Equity ${formatCurrency(account.equity)}`,
        `Risk ${account.riskPercent.toFixed(2)}% | Trades today ${account.currentDailyTrades}/${account.maxTradesPerDay}`,
        `Daily loss ${formatCurrency(account.currentDailyLoss)} / ${formatCurrency(account.maxDailyLoss)}`,
        `Open trades ${account.openTrades.length} | Loss streak ${account.lossesInARow}`,
      ].join("\n");
    }),
  ].join("\n\n");
}

function formatRulesMessage() {
  return [
    "Trading rules",
    "Funded: 0.25% to 0.5% risk, max 3 trades per day, stop after 2 losses, min 1:2 R:R, score 8+.",
    "Personal: 1% to 2% risk, max 5 trades per day, stop after 3 losses, min 1:1.5 R:R, score 7+.",
    "Never enter on WAIT or READY. Only CONFIRMED qualifies for execution.",
    "No stop loss means no trade.",
  ].join("\n");
}

function formatHelpMessage() {
  return [
    "Forex AI — available commands",
    "",
    "/pair EURUSD — quick bias check and score for a pair",
    "/risk BALANCE RISK% ENTRY SL TP PAIR DIR — position size calculator",
    "/accounts — your account balances, daily limits, and loss streaks",
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

    await ctx.reply(`Checking ${pair} — fetching live bars...`);

    try {
      const mtf = await fetchMultiTimeframeContext(pair).catch(() => null);
      const result = await quickPairCheck(pair, mtf?.formattedContext);
      await ctx.reply(
        [
          `${pair} quick check`,
          `Bias: ${result.bias}`,
          `Score: ${result.score}/10`,
          result.summary,
          result.score >= 7 ? "Worth watching, but still wait for CONFIRMED status." : "Not ready. No trade is fine.",
        ].join("\n")
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
        `Risk calculation for ${pair}`,
        `Direction: ${input.direction}`,
        `Risk: ${formatCurrency(result.riskAmount)}`,
        `Pips to SL: ${formatPips(result.pipDistance)}`,
        `Lot size: ${formatLotSize(result.lotSize)}`,
        `Max loss: ${formatCurrency(result.maxLoss)}`,
        `Max profit: ${formatCurrency(result.maxProfit)}`,
        `R:R: ${formatRR(result.riskRewardRatio)}`,
        result.denial ? `Denied: ${result.denial}` : "Valid on position sizing only. Strategy still needs confirmation.",
      ].join("\n")
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
    await ctx.reply(formatHelpMessage());
  });

  bot.command("status", async (ctx) => {
    const user = await getLinkedUser(ctx);
    if (!user) {
      return;
    }

    const accounts = await listAccounts(user.id);
    await ctx.reply(formatStatusMessage(accounts));
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

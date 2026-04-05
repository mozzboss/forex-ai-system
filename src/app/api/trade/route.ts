import { NextRequest, NextResponse } from "next/server";

import { AuthenticationError } from "@/lib/server/auth";
import { tradeRouteDeps } from "@/lib/server/route-deps";
import {
  formatTradeCancelledAlert,
  formatTradeClosedAlert,
  formatTradeCreatedAlert,
  formatTradeDeniedAlert,
  formatRiskAlert,
} from "@/lib/telegram/service";
import { queryTradeStatusSchema, tradeActionSchema } from "@/lib/validation/api";

export const dynamic = "force-dynamic";

async function notifyTradeAlert(
  userId: string,
  trade: {
    accountId: string;
    status: string;
  } & Parameters<typeof formatTradeCreatedAlert>[0]
) {
  try {
    const chatId = await tradeRouteDeps.getTelegramAlertTarget(userId);

    if (!chatId) {
      return;
    }

    const accountName = (await tradeRouteDeps.getAccountName(userId, trade.accountId)) || "Trading account";
    const message =
      trade.status === "closed"
        ? formatTradeClosedAlert(trade, accountName)
        : trade.status === "cancelled"
          ? formatTradeCancelledAlert(trade, accountName)
          : trade.status === "denied"
            ? formatTradeDeniedAlert(trade, accountName)
            : formatTradeCreatedAlert(trade, accountName);

    await tradeRouteDeps.sendTelegramMessage(chatId, message);
  } catch (error) {
    console.error("Telegram trade alert failed:", error);
  }
}

async function notifyRiskAlert(userId: string, accountId: string) {
  try {
    const chatId = await tradeRouteDeps.getTelegramAlertTarget(userId);
    if (!chatId) return;

    const account = await tradeRouteDeps.getAccountSnapshot(userId, accountId);
    if (!account) return;

    const streakLimit = account.mode === "funded" ? 2 : 3;
    const maxTradesReached = account.currentDailyTrades >= account.maxTradesPerDay;
    const dailyLossBreach = account.maxDailyLoss > 0 && account.currentDailyLoss >= account.maxDailyLoss;
    const dailyLossWarning = account.maxDailyLoss > 0 && account.currentDailyLoss >= account.maxDailyLoss * 0.8 && !dailyLossBreach;
    const streakBreach = account.lossesInARow >= streakLimit;
    const drawdownUsed = account.balance - account.equity;
    const drawdownBreach = account.maxDrawdown > 0 && drawdownUsed >= account.maxDrawdown;
    const drawdownWarning = account.maxDrawdown > 0 && drawdownUsed >= account.maxDrawdown * 0.7 && !drawdownBreach;

    const reasons: string[] = [];
    if (maxTradesReached) {
      reasons.push(`Daily trade cap reached (${account.currentDailyTrades}/${account.maxTradesPerDay}). No more trades today.`);
    }
    if (dailyLossBreach) {
      reasons.push(`Daily loss limit hit ($${account.currentDailyLoss.toFixed(2)} / $${account.maxDailyLoss.toFixed(2)}). Stop trading now.`);
    } else if (dailyLossWarning) {
      reasons.push(`Daily loss at $${account.currentDailyLoss.toFixed(2)} — approaching cap of $${account.maxDailyLoss.toFixed(2)}.`);
    }
    if (streakBreach) {
      reasons.push(`${account.lossesInARow} losses in a row on ${account.mode} account. Rules require stopping.`);
    }
    if (drawdownBreach) {
      reasons.push(`Max drawdown hit ($${drawdownUsed.toFixed(2)} / $${account.maxDrawdown.toFixed(2)}). Close positions and stop.`);
    } else if (drawdownWarning) {
      reasons.push(`Drawdown at $${drawdownUsed.toFixed(2)} — approaching limit of $${account.maxDrawdown.toFixed(2)}.`);
    }

    if (reasons.length === 0) return;

    const message = formatRiskAlert(account.name, reasons.join(" "));
    await tradeRouteDeps.sendTelegramMessage(chatId, message);
  } catch (error) {
    console.error("Risk alert failed:", error);
  }
}

// GET /api/trade
export async function GET(req: NextRequest) {
  try {
    const userId = await tradeRouteDeps.requireAppUserId(req);
    const { searchParams } = new URL(req.url);
    const rawStatus = searchParams.get("status");
    const statusResult = rawStatus ? queryTradeStatusSchema.safeParse(rawStatus) : null;
    const status = statusResult?.success ? statusResult.data : undefined;
    const accountId = searchParams.get("accountId");
    const limit = parseInt(searchParams.get("limit") ?? "50", 10);
    const offset = parseInt(searchParams.get("offset") ?? "0", 10);

    const result = await tradeRouteDeps.listTrades(userId, {
      status,
      accountId,
      limit: Number.isFinite(limit) ? limit : 50,
      offset: Number.isFinite(offset) && offset >= 0 ? offset : 0,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    console.error("Trade fetch failed:", error);
    return NextResponse.json({ error: "Failed to load trades" }, { status: 500 });
  }
}

// POST /api/trade
export async function POST(req: NextRequest) {
  try {
    const userId = await tradeRouteDeps.requireAppUserId(req);
    const body = await req.json();
    const parsed = tradeActionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid trade payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { action } = parsed.data;

    if (action === "create") {
      const trade = await tradeRouteDeps.createTrade(userId, {
        accountId: parsed.data.accountId,
        pair: parsed.data.pair,
        direction: parsed.data.direction,
        setupType: parsed.data.setupType,
        entryPrice: parsed.data.entryPrice,
        stopLoss: parsed.data.stopLoss,
        takeProfit: parsed.data.takeProfit,
        lotSize: parsed.data.lotSize,
        riskAmount: parsed.data.riskAmount,
        riskRewardRatio: parsed.data.riskRewardRatio,
        status: parsed.data.status,
        entryStatus: parsed.data.entryStatus,
        pnl: parsed.data.pnl,
        pipsPnl: parsed.data.pipsPnl,
        aiScore: parsed.data.aiScore,
        aiDecision: parsed.data.aiDecision,
        aiReasoning: parsed.data.aiReasoning,
        notes: parsed.data.notes,
      });

      await notifyTradeAlert(userId, trade);
      await notifyRiskAlert(userId, trade.accountId);

      return NextResponse.json({ trade });
    }

    if (action === "update") {
      const trade = await tradeRouteDeps.updateTrade(userId, parsed.data.tradeId, parsed.data.updates || {});

      if (!trade) {
        return NextResponse.json({ error: "Trade not found" }, { status: 404 });
      }

      await notifyTradeAlert(userId, trade);
      await notifyRiskAlert(userId, trade.accountId);

      return NextResponse.json({ trade });
    }

    if (action === "deny") {
      const trade = await tradeRouteDeps.denyTrade(userId, {
        accountId: parsed.data.accountId,
        pair: parsed.data.pair,
        direction: parsed.data.direction || "LONG",
        setupType: parsed.data.setupType,
        entryPrice: parsed.data.entryPrice ?? 0,
        stopLoss: parsed.data.stopLoss ?? 0,
        takeProfit: parsed.data.takeProfit ?? 0,
        lotSize: parsed.data.lotSize ?? 0,
        riskAmount: parsed.data.riskAmount,
        riskRewardRatio: parsed.data.riskRewardRatio,
        pnl: parsed.data.pnl,
        pipsPnl: parsed.data.pipsPnl,
        aiScore: parsed.data.aiScore,
        aiReasoning: parsed.data.aiReasoning,
        denialReason: parsed.data.denialReason,
        notes: parsed.data.notes,
      });

      await notifyTradeAlert(userId, trade);

      return NextResponse.json({ trade });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    console.error("Trade operation failed:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Trade operation failed" }, { status: 500 });
  }
}

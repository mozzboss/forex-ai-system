import { NextRequest, NextResponse } from "next/server";

import { ALL_PAIRS, MAJOR_PAIRS, TRADING_CONFIG } from "@/config/trading";
import { analyzeMarket } from "@/lib/ai/engine";
import { deliverAlert, isEmailFallbackConfigured, sendFallbackEmail } from "@/lib/alerts/delivery";
import { derivePairDecisionSignal } from "@/lib/market/decision";
import { shouldAllowTrade } from "@/lib/market/denial";
import { fetchEconomicCalendar, formatNewsContextForAnalysis, getPairCurrencies } from "@/lib/market/news";
import { fetchMultiTimeframeContext } from "@/lib/market/prices";
import { prisma } from "@/lib/prisma";
import {
  getSavedDailyPlan,
  listAccounts,
  listUsersWithAlertDestinations,
} from "@/lib/server/persistence";
import { formatDecisionSignalAlert, isTelegramConfigured } from "@/lib/telegram/service";
import type { CurrencyPair, TradingSession } from "@/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ALERT_MODE = "trade_now";
const DEFAULT_ALLOWED_SESSIONS: TradingSession[] = [
  "london",
  "new_york",
  "overlap_lon_ny",
];

function getCronSecret() {
  return process.env.CRON_SECRET?.trim();
}

function getOperationsEmail() {
  return process.env.TRADE_ALERT_OPERATIONS_EMAIL?.trim();
}

function isAuthorizedRequest(req: NextRequest) {
  const secret = getCronSecret();
  if (!secret) {
    return false;
  }

  return req.headers.get("authorization") === `Bearer ${secret}`;
}

function parsePositiveInt(raw: string | undefined, fallback: number) {
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) {
    return fallback;
  }

  return Math.floor(value);
}

function getConfiguredScanPairs(): CurrencyPair[] {
  const raw = process.env.TRADE_ALERT_SCAN_PAIRS?.trim();
  if (!raw) {
    return MAJOR_PAIRS;
  }

  const configured = raw
    .split(",")
    .map((value) => value.trim().toUpperCase())
    .filter((value): value is CurrencyPair => ALL_PAIRS.includes(value as CurrencyPair));

  return configured.length > 0 ? Array.from(new Set(configured)) : MAJOR_PAIRS;
}

function parseAllowedSessions(): Set<TradingSession> {
  const raw = process.env.TRADE_ALERT_ALLOWED_SESSIONS?.trim();
  if (!raw) {
    return new Set(DEFAULT_ALLOWED_SESSIONS);
  }

  const parsed = raw
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(
      (value): value is TradingSession =>
        value === "london" ||
        value === "new_york" ||
        value === "asia" ||
        value === "overlap_lon_ny"
    );

  return new Set(parsed.length > 0 ? parsed : DEFAULT_ALLOWED_SESSIONS);
}

async function getUserScanPairs(userId: string, maxPairs: number): Promise<CurrencyPair[]> {
  const configured = getConfiguredScanPairs();
  const savedPlan = await getSavedDailyPlan(userId);
  const planPairs = (savedPlan?.pairs || []).filter((pair): pair is CurrencyPair =>
    ALL_PAIRS.includes(pair as CurrencyPair)
  );

  return Array.from(new Set([...planPairs, ...configured])).slice(0, maxPairs);
}

async function buildEnrichedMarketData(pair: CurrencyPair) {
  try {
    const [mtfContext, events] = await Promise.all([
      fetchMultiTimeframeContext(pair),
      fetchEconomicCalendar({
        currencies: getPairCurrencies(pair),
        limit: 6,
        minimumImpact: "medium",
      }),
    ]);

    return [
      mtfContext.formattedContext,
      formatNewsContextForAnalysis(events, pair),
    ].join("\n\n");
  } catch (error) {
    console.error(`Cron enrichment failed for ${pair}:`, error);
    return `Live market or economic calendar feed for ${pair} is unavailable. Treat confidence as lower until manually verified.`;
  }
}

function getCooldownCacheKey(parts: string[]) {
  return `cron_alert:${parts.join(":")}`;
}

async function hasActiveCooldown(cacheKey: string) {
  const record = await prisma.analysisCache.findFirst({
    where: {
      pair: cacheKey,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
    },
  });

  return Boolean(record);
}

async function markCooldown(
  cacheKey: string,
  payload: Record<string, unknown>,
  cooldownMinutes: number
) {
  const expiresAt = new Date(Date.now() + cooldownMinutes * 60_000);

  await prisma.$transaction([
    prisma.analysisCache.deleteMany({
      where: { pair: cacheKey },
    }),
    prisma.analysisCache.create({
      data: {
        pair: cacheKey,
        analysis: JSON.stringify(payload),
        expiresAt,
      },
    }),
  ]);
}

function buildHeartbeatMessage(input: {
  pairsScanned: number;
  alertsSent: number;
  cooldownSkips: number;
}) {
  return [
    "Scanner heartbeat",
    "Status: healthy",
    `Pairs scanned this run: ${input.pairsScanned}`,
    `Trade-now alerts sent: ${input.alertsSent}`,
    `Cooldown skips: ${input.cooldownSkips}`,
    "Scan cadence: every 15 minutes.",
  ].join("\n");
}

function buildFailureMessage(errors: string[]) {
  return [
    "Scanner failure alert",
    `${errors.length} error(s) detected in the latest run.`,
    ...errors.slice(0, 5).map((error, index) => `${index + 1}. ${error}`),
    errors.length > 5 ? `...and ${errors.length - 5} more.` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function GET(req: NextRequest) {
  const secret = getCronSecret();
  if (!secret) {
    return NextResponse.json(
      { error: "CRON_SECRET is not configured." },
      { status: 503 }
    );
  }

  if (!isAuthorizedRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const telegramReady = isTelegramConfigured();
  const emailReady = isEmailFallbackConfigured();
  if (!telegramReady && !emailReady) {
    return NextResponse.json(
      { error: "No delivery channel is configured. Set Telegram or email fallback." },
      { status: 503 }
    );
  }

  const maxPairsPerUser = parsePositiveInt(
    process.env.TRADE_ALERT_MAX_PAIRS_PER_USER,
    TRADING_CONFIG.maxWatchlistPairs
  );
  const cooldownMinutes = parsePositiveInt(
    process.env.TRADE_ALERT_COOLDOWN_MINUTES,
    120
  );
  const heartbeatHours = parsePositiveInt(
    process.env.TRADE_ALERT_HEARTBEAT_HOURS,
    24
  );
  const failureCooldownMinutes = parsePositiveInt(
    process.env.TRADE_ALERT_FAILURE_COOLDOWN_MINUTES,
    30
  );
  const minScore = parsePositiveInt(
    process.env.TRADE_ALERT_MIN_SCORE,
    8
  );
  const allowedSessions = parseAllowedSessions();

  const summary = {
    usersScanned: 0,
    usersSkippedNoAccounts: 0,
    pairsScanned: 0,
    alertsSent: 0,
    telegramAlertsSent: 0,
    emailAlertsSent: 0,
    heartbeatSent: 0,
    failureAlertsSent: 0,
    cooldownSkips: 0,
    blockedByDenials: 0,
    blockedBySession: 0,
    blockedByScore: 0,
    noSignal: 0,
    warnings: [] as string[],
    errors: [] as string[],
  };

  if (!process.env.TELEGRAM_WEBHOOK_SECRET?.trim()) {
    summary.warnings.push("TELEGRAM_WEBHOOK_SECRET is not set.");
  }
  if (!telegramReady) {
    summary.warnings.push("Telegram channel unavailable; using email fallback only.");
  }
  if (!emailReady) {
    summary.warnings.push("Email fallback is not configured.");
  }

  const targets = await listUsersWithAlertDestinations();
  if (targets.length === 0) {
    summary.warnings.push("No users with alerts enabled were found.");
  }

  for (const user of targets) {
    let userPairsScanned = 0;
    let userAlertsSent = 0;
    let userCooldownSkips = 0;

    try {
      const accounts = (await listAccounts(user.id)).filter((account) => account.isActive);
      if (accounts.length === 0) {
        summary.usersSkippedNoAccounts += 1;
        continue;
      }

      summary.usersScanned += 1;
      const pairs = await getUserScanPairs(user.id, maxPairsPerUser);

      for (const pair of pairs) {
        summary.pairsScanned += 1;
        userPairsScanned += 1;

        try {
          const enrichedMarketData = await buildEnrichedMarketData(pair);
          const analysis = await analyzeMarket(pair, accounts, enrichedMarketData);
          const decisionSignal = derivePairDecisionSignal(analysis);

          if (decisionSignal.mode !== ALERT_MODE) {
            summary.noSignal += 1;
            continue;
          }

          if (analysis.finalDecision.score < minScore) {
            summary.blockedByScore += 1;
            continue;
          }

          if (!allowedSessions.has(analysis.sessionAndNews.currentSession)) {
            summary.blockedBySession += 1;
            continue;
          }

          const hasTradableAccount = accounts.some(
            (account) => shouldAllowTrade(analysis, account).allowed
          );
          if (!hasTradableAccount) {
            summary.blockedByDenials += 1;
            continue;
          }

          const cacheKey = getCooldownCacheKey([
            "decision",
            ALERT_MODE,
            user.id,
            pair,
          ]);
          if (await hasActiveCooldown(cacheKey)) {
            summary.cooldownSkips += 1;
            userCooldownSkips += 1;
            continue;
          }

          const message = formatDecisionSignalAlert(pair, decisionSignal);
          const delivery = await deliverAlert({
            chatId: user.chatId,
            email: user.email,
            subject: `TRADE NOW: ${pair}`,
            message,
          });

          await markCooldown(
            cacheKey,
            {
              userId: user.id,
              pair,
              mode: decisionSignal.mode,
              score: analysis.finalDecision.score,
              session: analysis.sessionAndNews.currentSession,
              sentAt: new Date().toISOString(),
            },
            cooldownMinutes
          );

          summary.alertsSent += 1;
          userAlertsSent += 1;
          if (delivery.channel === "telegram") {
            summary.telegramAlertsSent += 1;
          } else {
            summary.emailAlertsSent += 1;
          }
        } catch (error) {
          summary.errors.push(
            `User ${user.id}, pair ${pair}: ${error instanceof Error ? error.message : "Unknown error"}`
          );
        }
      }

      if (heartbeatHours > 0) {
        const heartbeatKey = getCooldownCacheKey(["heartbeat", user.id]);
        if (!(await hasActiveCooldown(heartbeatKey))) {
          try {
            await deliverAlert({
              chatId: user.chatId,
              email: user.email,
              subject: "Forex AI scanner heartbeat",
              message: buildHeartbeatMessage({
                pairsScanned: userPairsScanned,
                alertsSent: userAlertsSent,
                cooldownSkips: userCooldownSkips,
              }),
            });

            await markCooldown(
              heartbeatKey,
              { sentAt: new Date().toISOString() },
              heartbeatHours * 60
            );
            summary.heartbeatSent += 1;
          } catch (error) {
            summary.errors.push(
              `User ${user.id} heartbeat: ${error instanceof Error ? error.message : "Unknown error"}`
            );
          }
        }
      }
    } catch (error) {
      summary.errors.push(
        `User ${user.id}: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  if (summary.errors.length > 0 && emailReady) {
    const operationsEmail = getOperationsEmail();
    if (operationsEmail) {
      const failureKey = getCooldownCacheKey(["ops", "failure"]);
      if (!(await hasActiveCooldown(failureKey))) {
        try {
          await sendFallbackEmail(
            operationsEmail,
            "Forex AI scanner failure alert",
            buildFailureMessage(summary.errors)
          );
          await markCooldown(
            failureKey,
            { sentAt: new Date().toISOString(), errors: summary.errors.length },
            failureCooldownMinutes
          );
          summary.failureAlertsSent += 1;
        } catch (error) {
          summary.errors.push(
            `Ops failure alert: ${error instanceof Error ? error.message : "Unknown error"}`
          );
        }
      }
    } else {
      summary.warnings.push("TRADE_ALERT_OPERATIONS_EMAIL is not set; failure alerts are disabled.");
    }
  }

  return NextResponse.json({
    ok: true,
    mode: ALERT_MODE,
    ranAt: new Date().toISOString(),
    config: {
      maxPairsPerUser,
      cooldownMinutes,
      minScore,
      allowedSessions: Array.from(allowedSessions),
      heartbeatHours,
      failureCooldownMinutes,
      configuredPairs: getConfiguredScanPairs(),
      usersWithAlertsEnabled: targets.length,
      deliveryChannels: {
        telegram: telegramReady,
        emailFallback: emailReady,
      },
    },
    summary,
  });
}

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "name" TEXT,
    "telegramChatId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TradingAccount" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "equity" DOUBLE PRECISION NOT NULL,
    "riskPercent" DOUBLE PRECISION NOT NULL,
    "maxDailyLoss" DOUBLE PRECISION NOT NULL,
    "maxDrawdown" DOUBLE PRECISION NOT NULL,
    "maxTradesPerDay" INTEGER NOT NULL,
    "currentDailyLoss" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currentDailyTrades" INTEGER NOT NULL DEFAULT 0,
    "lossesInARow" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TradingAccount_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Trade" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "accountId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "pair" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "setupType" TEXT NOT NULL,
    "entryPrice" DOUBLE PRECISION NOT NULL,
    "stopLoss" DOUBLE PRECISION NOT NULL,
    "takeProfit" DOUBLE PRECISION NOT NULL,
    "lotSize" DOUBLE PRECISION NOT NULL,
    "riskAmount" DOUBLE PRECISION NOT NULL,
    "riskRewardRatio" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "entryStatus" TEXT NOT NULL,
    "pnl" DOUBLE PRECISION,
    "pipsPnl" DOUBLE PRECISION,
    "aiScore" INTEGER NOT NULL,
    "aiDecision" TEXT NOT NULL,
    "aiReasoning" TEXT NOT NULL,
    "denialReason" TEXT,
    "notes" TEXT,
    "openedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "JournalEntry" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "tradeId" UUID,
    "date" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "mistakes" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "disciplineScore" INTEGER,
    "aiFeedback" TEXT,
    "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JournalEntry_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DailyPlan" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "pairs" TEXT[] NOT NULL,
    "macroBias" TEXT NOT NULL,
    "keyLevels" TEXT NOT NULL,
    "newsEvents" TEXT NOT NULL,
    "sessionFocus" TEXT NOT NULL,
    "maxTrades" INTEGER NOT NULL,
    "planNotes" TEXT,
    "reviewNotes" TEXT,
    "disciplineScore" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyPlan_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "NewsEvent" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "time" TIMESTAMP(3) NOT NULL,
    "currency" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "impact" TEXT NOT NULL,
    "forecast" TEXT,
    "previous" TEXT,
    "actual" TEXT,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AnalysisCache" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "pair" TEXT NOT NULL,
    "analysis" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnalysisCache_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_telegramChatId_key" ON "User"("telegramChatId");
CREATE UNIQUE INDEX "DailyPlan_userId_date_key" ON "DailyPlan"("userId", "date");

CREATE INDEX "TradingAccount_userId_idx" ON "TradingAccount"("userId");
CREATE INDEX "TradingAccount_userId_isActive_idx" ON "TradingAccount"("userId", "isActive");
CREATE INDEX "Trade_accountId_idx" ON "Trade"("accountId");
CREATE INDEX "Trade_userId_idx" ON "Trade"("userId");
CREATE INDEX "Trade_pair_idx" ON "Trade"("pair");
CREATE INDEX "Trade_status_idx" ON "Trade"("status");
CREATE INDEX "Trade_accountId_status_idx" ON "Trade"("accountId", "status");
CREATE INDEX "Trade_userId_createdAt_idx" ON "Trade"("userId", "createdAt");
CREATE INDEX "Trade_user_open_or_pending_idx" ON "Trade"("accountId", "createdAt")
WHERE "status" IN ('pending', 'open');
CREATE INDEX "JournalEntry_userId_idx" ON "JournalEntry"("userId");
CREATE INDEX "JournalEntry_date_idx" ON "JournalEntry"("date");
CREATE INDEX "JournalEntry_userId_date_idx" ON "JournalEntry"("userId", "date");
CREATE INDEX "DailyPlan_userId_idx" ON "DailyPlan"("userId");
CREATE INDEX "NewsEvent_time_idx" ON "NewsEvent"("time");
CREATE INDEX "NewsEvent_currency_idx" ON "NewsEvent"("currency");
CREATE INDEX "NewsEvent_impact_idx" ON "NewsEvent"("impact");
CREATE INDEX "AnalysisCache_pair_idx" ON "AnalysisCache"("pair");
CREATE INDEX "AnalysisCache_expiresAt_idx" ON "AnalysisCache"("expiresAt");

ALTER TABLE "TradingAccount"
ADD CONSTRAINT "TradingAccount_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Trade"
ADD CONSTRAINT "Trade_accountId_fkey"
FOREIGN KEY ("accountId") REFERENCES "TradingAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Trade"
ADD CONSTRAINT "Trade_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "JournalEntry"
ADD CONSTRAINT "JournalEntry_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DailyPlan"
ADD CONSTRAINT "DailyPlan_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

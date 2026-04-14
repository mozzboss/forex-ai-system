CREATE TYPE "AccountMode" AS ENUM ('funded', 'personal');
CREATE TYPE "TradeDirection" AS ENUM ('LONG', 'SHORT');
CREATE TYPE "SetupType" AS ENUM ('pullback', 'breakout', 'reversal', 'liquidity_sweep');
CREATE TYPE "TradeStatus" AS ENUM ('pending', 'open', 'closed', 'cancelled', 'denied');
CREATE TYPE "EntryStatus" AS ENUM ('WAIT', 'READY', 'CONFIRMED', 'INVALID');
CREATE TYPE "JournalEntryType" AS ENUM ('trade', 'review', 'lesson', 'plan');
CREATE TYPE "NewsImpact" AS ENUM ('low', 'medium', 'high');

DROP INDEX IF EXISTS "Trade_user_open_or_pending_idx";

ALTER TABLE "TradingAccount"
ALTER COLUMN "mode" TYPE "AccountMode" USING ("mode"::"AccountMode"),
ALTER COLUMN "balance" TYPE DECIMAL(18,4) USING ("balance"::DECIMAL(18,4)),
ALTER COLUMN "equity" TYPE DECIMAL(18,4) USING ("equity"::DECIMAL(18,4)),
ALTER COLUMN "riskPercent" TYPE DECIMAL(6,4) USING ("riskPercent"::DECIMAL(6,4)),
ALTER COLUMN "maxDailyLoss" TYPE DECIMAL(18,4) USING ("maxDailyLoss"::DECIMAL(18,4)),
ALTER COLUMN "maxDrawdown" TYPE DECIMAL(18,4) USING ("maxDrawdown"::DECIMAL(18,4)),
ALTER COLUMN "currentDailyLoss" TYPE DECIMAL(18,4) USING ("currentDailyLoss"::DECIMAL(18,4));

ALTER TABLE "Trade"
ALTER COLUMN "direction" TYPE "TradeDirection" USING ("direction"::"TradeDirection"),
ALTER COLUMN "setupType" TYPE "SetupType" USING ("setupType"::"SetupType"),
ALTER COLUMN "entryPrice" TYPE DECIMAL(18,6) USING ("entryPrice"::DECIMAL(18,6)),
ALTER COLUMN "stopLoss" TYPE DECIMAL(18,6) USING ("stopLoss"::DECIMAL(18,6)),
ALTER COLUMN "takeProfit" TYPE DECIMAL(18,6) USING ("takeProfit"::DECIMAL(18,6)),
ALTER COLUMN "lotSize" TYPE DECIMAL(12,4) USING ("lotSize"::DECIMAL(12,4)),
ALTER COLUMN "riskAmount" TYPE DECIMAL(18,4) USING ("riskAmount"::DECIMAL(18,4)),
ALTER COLUMN "riskRewardRatio" TYPE DECIMAL(10,4) USING ("riskRewardRatio"::DECIMAL(10,4)),
ALTER COLUMN "status" TYPE "TradeStatus" USING ("status"::"TradeStatus"),
ALTER COLUMN "entryStatus" TYPE "EntryStatus" USING ("entryStatus"::"EntryStatus"),
ALTER COLUMN "pnl" TYPE DECIMAL(18,4) USING ("pnl"::DECIMAL(18,4)),
ALTER COLUMN "pipsPnl" TYPE DECIMAL(18,4) USING ("pipsPnl"::DECIMAL(18,4));

ALTER TABLE "JournalEntry"
ALTER COLUMN "type" TYPE "JournalEntryType" USING ("type"::"JournalEntryType");

ALTER TABLE "NewsEvent"
ALTER COLUMN "impact" TYPE "NewsImpact" USING ("impact"::"NewsImpact");

CREATE INDEX "JournalEntry_tradeId_idx" ON "JournalEntry"("tradeId");

CREATE INDEX "Trade_user_open_or_pending_idx"
ON "Trade"("accountId", "createdAt")
WHERE "status" = ANY (ARRAY['pending'::"TradeStatus", 'open'::"TradeStatus"]);

ALTER TABLE "JournalEntry"
ADD CONSTRAINT "JournalEntry_tradeId_fkey"
FOREIGN KEY ("tradeId") REFERENCES "Trade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable: AlertLog
-- Stores every TAKE_TRADE and READY alert fired by the cron scanner.
-- Linked to trades via Trade.alertLogId to measure signal → outcome accuracy.

CREATE TABLE "AlertLog" (
    "id"        UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId"    UUID NOT NULL,
    "pair"      TEXT NOT NULL,
    "alertType" TEXT NOT NULL,
    "score"     INTEGER NOT NULL,
    "session"   TEXT NOT NULL,
    "direction" TEXT,
    "channel"   TEXT NOT NULL,
    "sentAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlertLog_pkey" PRIMARY KEY ("id")
);

-- AddColumn: Trade.alertLogId (optional FK to AlertLog)
ALTER TABLE "Trade" ADD COLUMN "alertLogId" UUID;

-- Foreign keys
ALTER TABLE "AlertLog"
    ADD CONSTRAINT "AlertLog_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Trade"
    ADD CONSTRAINT "Trade_alertLogId_fkey"
    FOREIGN KEY ("alertLogId") REFERENCES "AlertLog"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Indexes
CREATE INDEX "AlertLog_userId_idx" ON "AlertLog"("userId");
CREATE INDEX "AlertLog_pair_idx" ON "AlertLog"("pair");
CREATE INDEX "AlertLog_sentAt_idx" ON "AlertLog"("sentAt");
CREATE INDEX "AlertLog_userId_sentAt_idx" ON "AlertLog"("userId", "sentAt");
CREATE INDEX "AlertLog_alertType_idx" ON "AlertLog"("alertType");
CREATE INDEX "Trade_alertLogId_idx" ON "Trade"("alertLogId");

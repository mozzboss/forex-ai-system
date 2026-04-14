ALTER TABLE "User"
ADD COLUMN "telegramLinkCode" TEXT,
ADD COLUMN "telegramLinkCodeExpiresAt" TIMESTAMP(3),
ADD COLUMN "telegramAlertsEnabled" BOOLEAN NOT NULL DEFAULT true;

CREATE UNIQUE INDEX "User_telegramLinkCode_key" ON "User"("telegramLinkCode");

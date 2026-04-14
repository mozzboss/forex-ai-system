-- Add externalRef to Trades for MetaTrader import deduplication
ALTER TABLE "Trade"
ADD COLUMN IF NOT EXISTS "externalRef" TEXT;

-- Ensure uniqueness while allowing multiple NULLs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = current_schema()
      AND indexname = 'Trade_externalRef_key'
  ) THEN
    CREATE UNIQUE INDEX "Trade_externalRef_key" ON "Trade" ("externalRef");
  END IF;
END $$;

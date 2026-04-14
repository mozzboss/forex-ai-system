import {
  createAccount,
  createJournalEntry,
  createTrade,
  denyTrade,
  getAccountName,
  getAccountSnapshot,
  getTelegramAlertTarget,
  listAccounts,
  listJournalEntries,
  listTrades,
  resetDailyAccountCounters,
  updateAccount,
  updateTrade,
} from "@/lib/server/persistence";
import { requireAppUserId } from "@/lib/server/auth";
import { sendTelegramMessage } from "@/lib/telegram/service";

export const accountRouteDeps = {
  requireAppUserId,
  listAccounts,
  createAccount,
  updateAccount,
  resetDailyAccountCounters,
};

export const journalRouteDeps = {
  requireAppUserId,
  listJournalEntries,
  createJournalEntry,
};

export const tradeRouteDeps = {
  requireAppUserId,
  listTrades,
  createTrade,
  updateTrade,
  denyTrade,
  getTelegramAlertTarget,
  getAccountName,
  getAccountSnapshot,
  sendTelegramMessage,
};

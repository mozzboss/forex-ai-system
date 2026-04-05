import test from "node:test";
import assert from "node:assert/strict";

import { AuthenticationError } from "@/lib/server/auth";
import { GET, POST } from "@/app/api/trade/route";
import { tradeRouteDeps } from "@/lib/server/route-deps";
import { createAccount, createTrade } from "./fixtures";
import { createJsonRequest, restoreDeps } from "./test-helpers";

test("trade GET applies auth scope and filters", async () => {
  const originalDeps = { ...tradeRouteDeps };

  try {
    let receivedArgs:
      | { userId: string; status?: string | null; accountId?: string | null; limit?: number; offset?: number }
      | null = null;

    tradeRouteDeps.requireAppUserId = async () => "user-trade";
    tradeRouteDeps.listTrades = async (userId, filters) => {
      receivedArgs = { userId, ...filters };
      return { trades: [createTrade()], total: 1 };
    };

    const response = await GET(
      createJsonRequest("http://localhost/api/trade?status=open&accountId=acc-1&limit=10&offset=5")
    );
    const json = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(receivedArgs, {
      userId: "user-trade",
      status: "open",
      accountId: "acc-1",
      limit: 10,
      offset: 5,
    });
    assert.equal(json.total, 1);
  } finally {
    restoreDeps(tradeRouteDeps, originalDeps);
  }
});

test("trade POST create records a trade and sends an alert when linked", async () => {
  const originalDeps = { ...tradeRouteDeps };

  try {
    const sentMessages: Array<{ chatId: string; message: string }> = [];
    let receivedUserId = "";

    tradeRouteDeps.requireAppUserId = async () => "user-create";
    tradeRouteDeps.createTrade = async (userId) => {
      receivedUserId = userId;
      return createTrade({ status: "open" });
    };
    tradeRouteDeps.getTelegramAlertTarget = async () => "chat-123";
    tradeRouteDeps.getAccountName = async () => "FTMO Challenge";
    tradeRouteDeps.getAccountSnapshot = async () => createAccount();
    tradeRouteDeps.sendTelegramMessage = async (chatId, message) => {
      sentMessages.push({ chatId, message });
    };

    const response = await POST(
      createJsonRequest("http://localhost/api/trade", {
        method: "POST",
        body: {
          action: "create",
          accountId: "22222222-2222-2222-2222-222222222222",
          pair: "EURUSD",
          direction: "LONG",
          setupType: "pullback",
          entryPrice: 1.1,
          stopLoss: 1.095,
          takeProfit: 1.11,
          lotSize: 0.2,
          entryStatus: "CONFIRMED",
          status: "open",
          aiScore: 8,
          aiDecision: "TAKE_TRADE",
          aiReasoning: "Aligned setup.",
        },
      })
    );
    const json = await response.json();

    assert.equal(response.status, 200);
    assert.equal(receivedUserId, "user-create");
    assert.equal(json.trade.status, "open");
    assert.equal(sentMessages.length, 1);
    assert.equal(sentMessages[0]?.chatId, "chat-123");
    assert.match(sentMessages[0]?.message ?? "", /EURUSD/i);
  } finally {
    restoreDeps(tradeRouteDeps, originalDeps);
  }
});

test("trade POST update returns not found when the scoped trade does not exist", async () => {
  const originalDeps = { ...tradeRouteDeps };

  try {
    tradeRouteDeps.requireAppUserId = async () => "user-update";
    tradeRouteDeps.updateTrade = async () => null;

    const response = await POST(
      createJsonRequest("http://localhost/api/trade", {
        method: "POST",
        body: {
          action: "update",
          tradeId: "44444444-4444-4444-4444-444444444444",
          updates: { status: "closed", pnl: 125 },
        },
      })
    );

    assert.equal(response.status, 404);
  } finally {
    restoreDeps(tradeRouteDeps, originalDeps);
  }
});

test("trade POST deny logs a denied trade without requiring a live alert target", async () => {
  const originalDeps = { ...tradeRouteDeps };

  try {
    let receivedUserId = "";
    let sentCount = 0;

    tradeRouteDeps.requireAppUserId = async () => "user-deny";
    tradeRouteDeps.denyTrade = async (userId) => {
      receivedUserId = userId;
      return createTrade({ status: "denied", entryStatus: "INVALID", aiDecision: "DENY" });
    };
    tradeRouteDeps.getTelegramAlertTarget = async () => null;
    tradeRouteDeps.sendTelegramMessage = async () => {
      sentCount += 1;
    };

    const response = await POST(
      createJsonRequest("http://localhost/api/trade", {
        method: "POST",
        body: {
          action: "deny",
          accountId: "22222222-2222-2222-2222-222222222222",
          pair: "EURUSD",
          denialReason: "weak_setup",
        },
      })
    );
    const json = await response.json();

    assert.equal(response.status, 200);
    assert.equal(receivedUserId, "user-deny");
    assert.equal(json.trade.status, "denied");
    assert.equal(sentCount, 0);
  } finally {
    restoreDeps(tradeRouteDeps, originalDeps);
  }
});

test("trade POST returns 400 for invalid payloads", async () => {
  const originalDeps = { ...tradeRouteDeps };

  try {
    tradeRouteDeps.requireAppUserId = async () => "user-invalid";

    const response = await POST(
      createJsonRequest("http://localhost/api/trade", {
        method: "POST",
        body: {
          action: "create",
          pair: "EURUSD",
          direction: "LONG",
        },
      })
    );

    assert.equal(response.status, 400);
  } finally {
    restoreDeps(tradeRouteDeps, originalDeps);
  }
});

test("trade GET returns 401 when auth fails", async () => {
  const originalDeps = { ...tradeRouteDeps };

  try {
    tradeRouteDeps.requireAppUserId = async () => {
      throw new AuthenticationError("No auth");
    };

    const response = await GET(createJsonRequest("http://localhost/api/trade"));
    const json = await response.json();

    assert.equal(response.status, 401);
    assert.equal(json.error, "No auth");
  } finally {
    restoreDeps(tradeRouteDeps, originalDeps);
  }
});

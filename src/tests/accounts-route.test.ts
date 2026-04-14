import test from "node:test";
import assert from "node:assert/strict";

import { AuthenticationError } from "@/lib/server/auth";
import { GET, POST } from "@/app/api/accounts/route";
import { accountRouteDeps } from "@/lib/server/route-deps";
import { createAccount } from "./fixtures";
import { createJsonRequest, restoreDeps } from "./test-helpers";

test("accounts GET returns auth-scoped accounts", async () => {
  const originalDeps = { ...accountRouteDeps };

  try {
    let receivedUserId = "";

    accountRouteDeps.requireAppUserId = async () => "user-1";
    accountRouteDeps.listAccounts = async (userId) => {
      receivedUserId = userId;
      return [createAccount({ userId, mode: "personal" })];
    };

    const response = await GET(createJsonRequest("http://localhost/api/accounts"));
    const json = await response.json();

    assert.equal(response.status, 200);
    assert.equal(receivedUserId, "user-1");
    assert.equal(json.accounts.length, 1);
    assert.equal(json.accounts[0].userId, "user-1");
  } finally {
    restoreDeps(accountRouteDeps, originalDeps);
  }
});

test("accounts POST reset_daily resets counters for the current user", async () => {
  const originalDeps = { ...accountRouteDeps };

  try {
    let receivedUserId = "";

    accountRouteDeps.requireAppUserId = async () => "user-2";
    accountRouteDeps.resetDailyAccountCounters = async (userId) => {
      receivedUserId = userId;
      return [createAccount({ userId, currentDailyTrades: 0, currentDailyLoss: 0, lossesInARow: 0 })];
    };

    const response = await POST(
      createJsonRequest("http://localhost/api/accounts", {
        method: "POST",
        body: { action: "reset_daily" },
      })
    );
    const json = await response.json();

    assert.equal(response.status, 200);
    assert.equal(receivedUserId, "user-2");
    assert.equal(json.message, "Daily counters reset");
    assert.equal(json.accounts[0].currentDailyTrades, 0);
  } finally {
    restoreDeps(accountRouteDeps, originalDeps);
  }
});

test("accounts POST rejects invalid payloads", async () => {
  const originalDeps = { ...accountRouteDeps };

  try {
    accountRouteDeps.requireAppUserId = async () => "user-3";

    const response = await POST(
      createJsonRequest("http://localhost/api/accounts", {
        method: "POST",
        body: { action: "update", account: { name: "Missing id" } },
      })
    );

    assert.equal(response.status, 400);
  } finally {
    restoreDeps(accountRouteDeps, originalDeps);
  }
});

test("accounts GET returns 401 when auth is missing", async () => {
  const originalDeps = { ...accountRouteDeps };

  try {
    accountRouteDeps.requireAppUserId = async () => {
      throw new AuthenticationError();
    };

    const response = await GET(createJsonRequest("http://localhost/api/accounts"));
    const json = await response.json();

    assert.equal(response.status, 401);
    assert.match(json.error, /authentication required/i);
  } finally {
    restoreDeps(accountRouteDeps, originalDeps);
  }
});

import test from "node:test";
import assert from "node:assert/strict";

import { GET, POST } from "@/app/api/settings/pairs/route";
import { AuthenticationError } from "@/lib/server/auth";
import { pairPreferencesRouteDeps } from "@/lib/server/route-deps";
import { createJsonRequest, restoreDeps } from "./test-helpers";

test("tracked pairs GET returns the saved user preference", async () => {
  const originalDeps = { ...pairPreferencesRouteDeps };

  try {
    let receivedUserId = "";

    pairPreferencesRouteDeps.requireAppUserId = async () => "user-1";
    pairPreferencesRouteDeps.getTrackedPairs = async (userId) => {
      receivedUserId = userId;
      return ["EURUSD", "XAUUSD"];
    };

    const response = await GET(createJsonRequest("http://localhost/api/settings/pairs"));
    const json = await response.json();

    assert.equal(response.status, 200);
    assert.equal(receivedUserId, "user-1");
    assert.deepEqual(json.trackedPairs, ["EURUSD", "XAUUSD"]);
  } finally {
    restoreDeps(pairPreferencesRouteDeps, originalDeps);
  }
});

test("tracked pairs POST saves the updated preference", async () => {
  const originalDeps = { ...pairPreferencesRouteDeps };

  try {
    let receivedUserId = "";
    let receivedPairs: string[] = [];

    pairPreferencesRouteDeps.requireAppUserId = async () => "user-2";
    pairPreferencesRouteDeps.updateTrackedPairs = async (userId, pairs) => {
      receivedUserId = userId;
      receivedPairs = pairs;
      return pairs;
    };

    const response = await POST(
      createJsonRequest("http://localhost/api/settings/pairs", {
        method: "POST",
        body: { pairs: ["GBPUSD", "USDJPY"] },
      })
    );
    const json = await response.json();

    assert.equal(response.status, 200);
    assert.equal(receivedUserId, "user-2");
    assert.deepEqual(receivedPairs, ["GBPUSD", "USDJPY"]);
    assert.deepEqual(json.trackedPairs, ["GBPUSD", "USDJPY"]);
  } finally {
    restoreDeps(pairPreferencesRouteDeps, originalDeps);
  }
});

test("tracked pairs POST rejects invalid payloads", async () => {
  const originalDeps = { ...pairPreferencesRouteDeps };

  try {
    pairPreferencesRouteDeps.requireAppUserId = async () => "user-3";

    const response = await POST(
      createJsonRequest("http://localhost/api/settings/pairs", {
        method: "POST",
        body: { pairs: ["NOTAPAIR"] },
      })
    );

    assert.equal(response.status, 400);
  } finally {
    restoreDeps(pairPreferencesRouteDeps, originalDeps);
  }
});

test("tracked pairs GET returns 401 when auth is missing", async () => {
  const originalDeps = { ...pairPreferencesRouteDeps };

  try {
    pairPreferencesRouteDeps.requireAppUserId = async () => {
      throw new AuthenticationError();
    };

    const response = await GET(createJsonRequest("http://localhost/api/settings/pairs"));
    const json = await response.json();

    assert.equal(response.status, 401);
    assert.match(json.error, /authentication required/i);
  } finally {
    restoreDeps(pairPreferencesRouteDeps, originalDeps);
  }
});

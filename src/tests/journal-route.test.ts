import test from "node:test";
import assert from "node:assert/strict";

import { AuthenticationError } from "@/lib/server/auth";
import { GET, POST } from "@/app/api/journal/route";
import { journalRouteDeps } from "@/lib/server/route-deps";
import { createJournalEntry } from "./fixtures";
import { createJsonRequest, restoreDeps } from "./test-helpers";

test("journal GET applies auth scope and query filters", async () => {
  const originalDeps = { ...journalRouteDeps };

  try {
    let receivedArgs: { userId: string; type?: string | null; limit?: number } | null = null;

    journalRouteDeps.requireAppUserId = async () => "user-10";
    journalRouteDeps.listJournalEntries = async (args) => {
      receivedArgs = args;
      return { entries: [createJournalEntry({ userId: args.userId, type: "plan" })], total: 1 };
    };

    const response = await GET(
      createJsonRequest("http://localhost/api/journal?type=plan&limit=5")
    );
    const json = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(receivedArgs, { userId: "user-10", type: "plan", limit: 5 });
    assert.equal(json.total, 1);
  } finally {
    restoreDeps(journalRouteDeps, originalDeps);
  }
});

test("journal POST creates an entry for the authenticated user", async () => {
  const originalDeps = { ...journalRouteDeps };

  try {
    let receivedPayload: { userId: string; [key: string]: unknown } | null = null;

    journalRouteDeps.requireAppUserId = async () => "user-11";
    journalRouteDeps.createJournalEntry = async (payload) => {
      receivedPayload = payload as unknown as { userId: string; [key: string]: unknown };
      return createJournalEntry({ userId: payload.userId, content: payload.content ?? "" });
    };

    const response = await POST(
      createJsonRequest("http://localhost/api/journal", {
        method: "POST",
        body: { type: "review", content: "Stayed patient." },
      })
    );
    const json = await response.json();

    assert.equal(response.status, 200);
    assert.equal((receivedPayload as { userId: string } | null)?.userId, "user-11");
    assert.equal(json.entry.userId, "user-11");
  } finally {
    restoreDeps(journalRouteDeps, originalDeps);
  }
});

test("journal POST rejects invalid payloads", async () => {
  const originalDeps = { ...journalRouteDeps };

  try {
    journalRouteDeps.requireAppUserId = async () => "user-12";

    const response = await POST(
      createJsonRequest("http://localhost/api/journal", {
        method: "POST",
        body: { type: "review", content: "" },
      })
    );

    assert.equal(response.status, 400);
  } finally {
    restoreDeps(journalRouteDeps, originalDeps);
  }
});

test("journal GET returns 401 when auth fails", async () => {
  const originalDeps = { ...journalRouteDeps };

  try {
    journalRouteDeps.requireAppUserId = async () => {
      throw new AuthenticationError("No session");
    };

    const response = await GET(createJsonRequest("http://localhost/api/journal"));
    const json = await response.json();

    assert.equal(response.status, 401);
    assert.equal(json.error, "No session");
  } finally {
    restoreDeps(journalRouteDeps, originalDeps);
  }
});

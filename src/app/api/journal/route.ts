import { NextRequest, NextResponse } from "next/server";

import { AuthenticationError } from "@/lib/server/auth";
import { journalRouteDeps } from "@/lib/server/route-deps";
import { journalEntryCreateSchema, queryJournalEntryTypeSchema } from "@/lib/validation/api";

export const dynamic = "force-dynamic";

// GET /api/journal
export async function GET(req: NextRequest) {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return NextResponse.json({ entries: [] });
  }
  try {
    const userId = await journalRouteDeps.requireAppUserId(req);
    const { searchParams } = new URL(req.url);
    const rawType = searchParams.get("type");
    const typeResult = rawType ? queryJournalEntryTypeSchema.safeParse(rawType) : null;
    const type = typeResult?.success ? typeResult.data : undefined;
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const result = await journalRouteDeps.listJournalEntries({ userId, type, limit });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    console.error("Journal fetch failed:", error);
    return NextResponse.json(
      { error: "Failed to load journal entries" },
      { status: 500 }
    );
  }
}

// POST /api/journal
export async function POST(req: NextRequest) {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return NextResponse.json({ error: "Unavailable during build" }, { status: 503 });
  }
  try {
    const userId = await journalRouteDeps.requireAppUserId(req);
    const body = await req.json();
    const parsed = journalEntryCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid journal payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const entry = await journalRouteDeps.createJournalEntry({
      ...parsed.data,
      userId,
    });
    return NextResponse.json({ entry });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    console.error("Journal create failed:", error);
    return NextResponse.json({ error: "Failed to save journal entry" }, { status: 500 });
  }
}

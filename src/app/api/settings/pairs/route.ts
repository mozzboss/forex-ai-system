import { NextRequest, NextResponse } from "next/server";

import { AuthenticationError } from "@/lib/server/auth";
import { pairPreferencesRouteDeps } from "@/lib/server/route-deps";
import { trackedPairsPreferenceSchema } from "@/lib/validation/api";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const userId = await pairPreferencesRouteDeps.requireAppUserId(req);
    const trackedPairs = await pairPreferencesRouteDeps.getTrackedPairs(userId);

    return NextResponse.json({ trackedPairs });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    console.error("Tracked pairs fetch failed:", error);
    return NextResponse.json({ error: "Failed to load tracked pairs." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await pairPreferencesRouteDeps.requireAppUserId(req);
    const body = await req.json();
    const parsed = trackedPairsPreferenceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid tracked pairs payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const trackedPairs = await pairPreferencesRouteDeps.updateTrackedPairs(userId, parsed.data.pairs);
    return NextResponse.json({ trackedPairs });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    console.error("Tracked pairs update failed:", error);
    return NextResponse.json({ error: "Failed to save tracked pairs." }, { status: 500 });
  }
}

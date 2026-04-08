import { NextRequest, NextResponse } from "next/server";

import { AuthenticationError, requireAppUserId } from "@/lib/server/auth";
import { getMissedConfirmedZones } from "@/lib/server/persistence";
import { CurrencyPair } from "@/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET /api/analysis/missed-zones?pair=EURUSD&limit=10
export async function GET(req: NextRequest) {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return NextResponse.json({ missedZones: [] });
  }
  try {
    const userId = await requireAppUserId(req);
    const { searchParams } = new URL(req.url);
    const pair = searchParams.get("pair") as CurrencyPair | null;
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "10", 10), 30);

    const missedZones = await getMissedConfirmedZones(userId, pair, limit);
    return NextResponse.json({ missedZones });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ missedZones: [] });
  }
}

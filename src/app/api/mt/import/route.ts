import { NextRequest, NextResponse } from "next/server";

import { AuthenticationError, requireAppUserId } from "@/lib/server/auth";
import { importMtPositions } from "@/lib/mt/import";
import { mtImportRequestSchema } from "@/lib/validation/api";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const userId = await requireAppUserId(req);
    const body = await req.json();
    const parsed = mtImportRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid MT import payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const result = await importMtPositions(userId, parsed.data.positions);
    return NextResponse.json({ result });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    console.error("MT import failed:", error);
    return NextResponse.json({ error: "Failed to import MetaTrader positions" }, { status: 500 });
  }
}

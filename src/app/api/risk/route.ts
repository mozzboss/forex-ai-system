import { NextRequest, NextResponse } from "next/server";
import { calculateRisk } from "@/lib/risk/engine";
import { AuthenticationError, requireAppUserId } from "@/lib/server/auth";
import { RiskInput } from "@/types";
import { riskRequestSchema } from "@/lib/validation/api";

export const dynamic = "force-dynamic";

// POST /api/risk
// Body: RiskInput
export async function POST(req: NextRequest) {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return NextResponse.json({ error: "Unavailable during build" }, { status: 503 });
  }
  try {
    await requireAppUserId(req);
    const body = await req.json();
    const parsed = riskRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid risk payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const input = parsed.data as RiskInput;

    const result = calculateRisk(input);

    return NextResponse.json({ risk: result });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    console.error("Risk calculation error:", error);
    return NextResponse.json(
      { error: "Risk calculation failed." },
      { status: 500 }
    );
  }
}

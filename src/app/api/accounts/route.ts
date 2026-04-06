import { NextRequest, NextResponse } from "next/server";

import { TradingAccount } from "@/types";
import { accountActionSchema } from "@/lib/validation/api";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET /api/accounts
export async function GET(req: NextRequest) {
  // During static build or pre-render steps, skip DB/auth work to keep the build green
  const isBuild =
    process.env.NEXT_PHASE === "phase-production-build" ||
    Boolean(process.env.BUILD_ID);
  if (isBuild) {
    return NextResponse.json({ accounts: [] });
  }

  try {
    const { accountRouteDeps } = await import("@/lib/server/route-deps");
    const { AuthenticationError } = await import("@/lib/server/auth");
    const userId = await accountRouteDeps.requireAppUserId(req);
    const accounts = await accountRouteDeps.listAccounts(userId);
    return NextResponse.json({ accounts });
  } catch (error) {
    const { AuthenticationError } = await import("@/lib/server/auth");
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    console.error("Accounts fetch failed:", error);
    return NextResponse.json(
      { error: "Failed to load accounts." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const isBuild =
    process.env.NEXT_PHASE === "phase-production-build" ||
    Boolean(process.env.BUILD_ID);
  if (isBuild) {
    return NextResponse.json({ error: "Unavailable during build." }, { status: 503 });
  }

  try {
    const { accountRouteDeps } = await import("@/lib/server/route-deps");
    const { AuthenticationError } = await import("@/lib/server/auth");
    const userId = await accountRouteDeps.requireAppUserId(req);
    const body = await req.json();
    const parsed = accountActionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid account payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { action } = parsed.data;

    if (action === "reset_daily") {
      const accounts = await accountRouteDeps.resetDailyAccountCounters(userId);
      return NextResponse.json({ message: "Daily counters reset", accounts });
    }

    if (action === "create") {
      const newAccount = await accountRouteDeps.createAccount(userId, parsed.data.account as Partial<TradingAccount>);
      return NextResponse.json({ account: newAccount });
    }

    if (action === "update") {
      const updatedAccount = await accountRouteDeps.updateAccount(
        userId,
        parsed.data.account.id,
        parsed.data.account as Partial<TradingAccount>
      );

      if (!updatedAccount) {
        return NextResponse.json({ error: "Account not found" }, { status: 404 });
      }

      return NextResponse.json({ account: updatedAccount });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    console.error("Account operation failed:", error);
    return NextResponse.json({ error: "Failed to process account" }, { status: 500 });
  }
}

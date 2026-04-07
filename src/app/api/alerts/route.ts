import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { AuthenticationError, requireAppUserId } from "@/lib/server/auth";
import { ALL_PAIRS } from "@/config/trading";
import type { CurrencyPair } from "@/types";

export const dynamic = "force-dynamic";

const createAlertSchema = z.object({
  pair: z.enum(ALL_PAIRS as [CurrencyPair, ...CurrencyPair[]]),
  targetPrice: z.number().positive(),
  condition: z.enum(["above", "below"]),
  note: z.string().max(200).optional(),
});

export async function GET(req: NextRequest) {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return NextResponse.json({ alerts: [] });
  }
  try {
    const userId = await requireAppUserId(req);
    const { searchParams } = new URL(req.url);
    const pair = searchParams.get("pair");
    const includeTriggered = searchParams.get("triggered") === "true";

    const alerts = await prisma.priceAlert.findMany({
      where: {
        userId,
        ...(pair ? { pair } : {}),
        ...(includeTriggered ? {} : { triggered: false }),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ alerts });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to load alerts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return NextResponse.json({ error: "Unavailable during build" }, { status: 503 });
  }
  try {
    const userId = await requireAppUserId(req);
    const body = await req.json();
    const parsed = createAlertSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid alert", details: parsed.error.flatten() }, { status: 400 });
    }

    const alert = await prisma.priceAlert.create({
      data: {
        userId,
        pair: parsed.data.pair,
        targetPrice: parsed.data.targetPrice,
        condition: parsed.data.condition,
        note: parsed.data.note ?? null,
      },
    });

    return NextResponse.json({ alert }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to create alert" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return NextResponse.json({ error: "Unavailable during build" }, { status: 503 });
  }
  try {
    const userId = await requireAppUserId(req);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing alert id" }, { status: 400 });
    }

    await prisma.priceAlert.deleteMany({ where: { id, userId } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to delete alert" }, { status: 500 });
  }
}

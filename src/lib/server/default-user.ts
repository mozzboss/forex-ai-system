import type { AuthUser } from "@supabase/supabase-js";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export const DEFAULT_USER_ID = "11111111-1111-1111-1111-111111111111";
export const DEFAULT_FUNDED_ACCOUNT_ID = "22222222-2222-2222-2222-222222222222";
export const DEFAULT_PERSONAL_ACCOUNT_ID = "33333333-3333-3333-3333-333333333333";

interface UserSetupOptions {
  id: string;
  email: string;
  name?: string | null;
  fundedAccountId?: string;
  personalAccountId?: string;
}

async function ensureStarterAccounts(
  tx: Prisma.TransactionClient,
  userId: string,
  ids?: {
    fundedAccountId?: string;
    personalAccountId?: string;
  }
) {
  const existingAccounts = await tx.tradingAccount.count({
    where: { userId },
  });

  if (existingAccounts > 0) {
    return;
  }

  await tx.tradingAccount.create({
    data: {
      id: ids?.fundedAccountId,
      userId,
      name: "FTMO Challenge",
      mode: "funded",
      balance: 100000,
      equity: 100000,
      riskPercent: 0.25,
      maxDailyLoss: 5000,
      maxDrawdown: 10000,
      maxTradesPerDay: 3,
      isActive: true,
    },
  });

  await tx.tradingAccount.create({
    data: {
      id: ids?.personalAccountId,
      userId,
      name: "Personal Account",
      mode: "personal",
      balance: 5000,
      equity: 5000,
      riskPercent: 1,
      maxDailyLoss: 250,
      maxDrawdown: 500,
      maxTradesPerDay: 5,
      isActive: true,
    },
  });
}

async function ensureUserSetup(options: UserSetupOptions): Promise<string> {
  await prisma.$transaction(async (tx) => {
    await tx.user.upsert({
      where: { id: options.id },
      update: {
        email: options.email,
        name: options.name ?? undefined,
      },
      create: {
        id: options.id,
        email: options.email,
        name: options.name ?? undefined,
      },
    });

    await ensureStarterAccounts(tx, options.id, {
      fundedAccountId: options.fundedAccountId,
      personalAccountId: options.personalAccountId,
    });
  });

  return options.id;
}

export async function ensureDefaultUserSetup(): Promise<string> {
  return ensureUserSetup({
    id: DEFAULT_USER_ID,
    email: "trader@forexai.local",
    name: "Default Trader",
    fundedAccountId: DEFAULT_FUNDED_ACCOUNT_ID,
    personalAccountId: DEFAULT_PERSONAL_ACCOUNT_ID,
  });
}

export async function ensureAuthenticatedUserSetup(user: AuthUser): Promise<string> {
  if (!user.email) {
    throw new Error("Authenticated user is missing an email address.");
  }

  const metadata = user.user_metadata as Record<string, unknown> | undefined;
  const name =
    typeof metadata?.full_name === "string"
      ? metadata.full_name
      : typeof metadata?.name === "string"
        ? metadata.name
        : null;

  return ensureUserSetup({
    id: user.id,
    email: user.email,
    name,
  });
}

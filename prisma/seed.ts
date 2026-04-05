import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_USER_ID = "11111111-1111-1111-1111-111111111111";
const DEFAULT_FUNDED_ACCOUNT_ID = "22222222-2222-2222-2222-222222222222";
const DEFAULT_PERSONAL_ACCOUNT_ID = "33333333-3333-3333-3333-333333333333";

async function main() {
  await prisma.user.upsert({
    where: { id: DEFAULT_USER_ID },
    update: {
      email: "trader@forexai.local",
      name: "Default Trader",
    },
    create: {
      id: DEFAULT_USER_ID,
      email: "trader@forexai.local",
      name: "Default Trader",
    },
  });

  await prisma.tradingAccount.upsert({
    where: { id: DEFAULT_FUNDED_ACCOUNT_ID },
    update: {
      name: "FTMO Challenge",
      mode: "funded",
      balance: 100000,
      equity: 100000,
      riskPercent: 0.5,
      maxDailyLoss: 5000,
      maxDrawdown: 10000,
      maxTradesPerDay: 3,
      isActive: true,
    },
    create: {
      id: DEFAULT_FUNDED_ACCOUNT_ID,
      userId: DEFAULT_USER_ID,
      name: "FTMO Challenge",
      mode: "funded",
      balance: 100000,
      equity: 100000,
      riskPercent: 0.5,
      maxDailyLoss: 5000,
      maxDrawdown: 10000,
      maxTradesPerDay: 3,
      isActive: true,
    },
  });

  await prisma.tradingAccount.upsert({
    where: { id: DEFAULT_PERSONAL_ACCOUNT_ID },
    update: {
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
    create: {
      id: DEFAULT_PERSONAL_ACCOUNT_ID,
      userId: DEFAULT_USER_ID,
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

main()
  .catch((error) => {
    console.error("Failed to seed database:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

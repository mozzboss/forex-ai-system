import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// Append pgbouncer=true to DATABASE_URL at runtime so Prisma disables
// prepared statements — required when using Supabase transaction pooler (port 6543).
function buildDatasourceUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}pgbouncer=true`;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: {
      db: {
        url: buildDatasourceUrl(),
      },
    },
  });

if (process.env.NODE_ENV === "production") {
  globalForPrisma.prisma = prisma;
}

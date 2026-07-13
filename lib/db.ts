import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/lib/generated/prisma/client";

function makeClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Paste your Supabase connection string into .env — see docs/deployment-hostinger.md."
    );
  }
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

// Singleton across dev hot-reloads.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = (globalForPrisma.prisma ??= makeClient());

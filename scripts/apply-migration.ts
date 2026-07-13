// Applies a migration's SQL over the normal connection.
//   pnpm tsx scripts/apply-migration.ts prisma/migrations/<name>/migration.sql
//
// ponytail: `prisma migrate deploy` can't run through Supabase's transaction
// pooler (P1017 — it needs session-level advisory locks). This runs the same SQL
// as plain statements. Drop this if a direct (port 5432) DATABASE_URL is ever set.
import "dotenv/config";
import fs from "node:fs";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../lib/generated/prisma/client";

const file = process.argv[2];
if (!file) {
  console.error("usage: tsx scripts/apply-migration.ts <path/to/migration.sql>");
  process.exit(1);
}

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  const statements = fs
    .readFileSync(file, "utf8")
    .split(/;\s*[\r\n]/)
    .map((s) => s.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await db.$executeRawUnsafe(statement);
  }
  console.log(`Applied ${statements.length} statements from ${file}`);
}

main()
  .catch((error) => {
    console.error("Migration failed:", error.message);
    process.exit(1);
  })
  .finally(() => db.$disconnect());

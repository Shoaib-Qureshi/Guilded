import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../lib/generated/prisma/client";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("❌ DATABASE_URL is not set in .env");
  process.exit(1);
}

// Print where we're pointing, never the password.
console.log(`→ Connecting to: ${url.replace(/:[^:@/]+@/, ":****@")}\n`);

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });

async function main() {
  const [users, applications, reviews, events] = await Promise.all([
    db.user.count(),
    db.application.count(),
    db.clientReview.count(),
    db.event.count(),
  ]);

  console.log("✅ Connected. Row counts:");
  console.table({ users, applications, reviews, events });

  const moderator = await db.user.findFirst({
    where: { role: "moderator" },
    select: { email: true, name: true, status: true },
  });
  console.log(
    moderator
      ? `✅ Moderator account: ${moderator.email} (${moderator.status})`
      : "⚠️  No moderator account found — did the seed part of supabase-setup.sql run?"
  );
}

main()
  .catch((error) => {
    console.error("\n❌ Could not query the database:\n");
    console.error(error.message);
    console.error(
      "\nCommon causes:\n" +
        "  • Tables don't exist yet → run supabase-setup.sql in the Supabase SQL Editor\n" +
        "  • Wrong password / not percent-encoded in DATABASE_URL\n" +
        "  • Using the direct connection string instead of the pooled one (port 6543)"
    );
    process.exit(1);
  })
  .finally(() => db.$disconnect());

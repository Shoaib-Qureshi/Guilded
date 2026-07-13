import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../lib/generated/prisma/client";

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

const MODERATOR_EMAIL = "moderator@guilded.app";
const MODERATOR_PASSWORD = "guilded-mod-2026"; // dev seed only — change in production

async function main() {
  const passwordHash = await bcrypt.hash(MODERATOR_PASSWORD, 10);

  const moderator = await db.user.upsert({
    where: { email: MODERATOR_EMAIL },
    create: {
      email: MODERATOR_EMAIL,
      name: "Ananya Bhat",
      passwordHash,
      role: "moderator",
      status: "active",
    },
    update: {},
  });

  const riya = await db.user.upsert({
    where: { email: "riya@ironcladmarketing.example" },
    create: {
      email: "riya@ironcladmarketing.example",
      name: "Riya Mehta",
      role: "member",
      status: "active",
    },
    update: {},
  });

  const marcus = await db.user.upsert({
    where: { email: "marcus@designhouse.example" },
    create: {
      email: "marcus@designhouse.example",
      name: "Marcus V",
      role: "member",
      status: "active",
    },
    update: {},
  });

  // Applicants awaiting review
  const arnold = await db.user.upsert({
    where: { email: "arnold@ironclad.example" },
    create: {
      email: "arnold@ironclad.example",
      name: "Arnold Dias",
      role: "applicant",
      status: "pending_application",
      linkedinUrl: "https://linkedin.com/in/arnold-dias",
    },
    update: {},
  });

  const elara = await db.user.upsert({
    where: { email: "elara@crescent.example" },
    create: {
      email: "elara@crescent.example",
      name: "Elara Thorne",
      role: "applicant",
      status: "pending_application",
      linkedinUrl: "https://linkedin.com/in/elara-thorne",
    },
    update: {},
  });

  if ((await db.application.count()) === 0) {
    await db.application.createMany({
      data: [
        {
          userId: arnold.id,
          agencyName: "Ironclad Marketing Agency",
          agencyWebsite: "https://ironcladmarketing.example",
          industry: "Branding",
          agencySize: "14 members",
          yearsInOperation: "6 years",
          monthlyRevenue: "$45k/mo",
          primaryServices: "Brand strategy, Identity design, Packaging",
          motivation:
            "Looking for a room of peers who actually run agencies, not another Slack group full of vendors pitching tools.",
          currentChallenge:
            "Scaling delivery without losing quality as we take on bigger retainers.",
          location: "Mumbai",
          fitScores: { profile: 88, niche: 92, activity: 76 },
        },
        {
          userId: elara.id,
          agencyName: "Crescent Design House",
          agencyWebsite: "https://crescentdesign.example",
          industry: "Performance Mktg",
          agencySize: "8 members",
          yearsInOperation: "4 years",
          monthlyRevenue: "$80k/mo",
          primaryServices: "Paid social, CRO, Lifecycle marketing",
          motivation:
            "Want honest conversations about pricing and client churn with people who've been through it.",
          currentChallenge: "Hiring senior strategists faster than we lose them.",
          location: "Bengaluru",
          fitScores: { profile: 81, niche: 74, activity: 88 },
        },
      ],
    });
  }

  if ((await db.clientReview.count()) === 0) {
    await db.clientReview.createMany({
      data: [
        {
          submittedById: riya.id,
          clientCompany: "TrueSpark Digital",
          industry: "SaaS",
          city: "Pune",
          service: "Brand refresh",
          rating: {
            payment_behaviour: 4.5,
            communication_quality: 4.3,
            scope_clarity: 3,
            scope_creep: 4,
            decision_making_speed: 4.5,
            ease_of_working: 4.2,
            professionalism: 4,
            would_work_again: true,
          },
          description: "Genuinely one of the better clients I've worked with....",
          isAnonymous: true,
        },
        {
          submittedById: marcus.id,
          clientCompany: "Meridian Retail Group",
          industry: "Retail",
          city: "Delhi",
          service: "Performance campaigns",
          rating: {
            payment_behaviour: 2.5,
            communication_quality: 2.8,
            scope_clarity: 1.5,
            scope_creep: 2,
            decision_making_speed: 2.5,
            ease_of_working: 2.6,
            professionalism: 1.5,
            would_work_again: false,
          },
          description:
            "Budget is real and they do pay, eventually. But scope creeps every month.",
          isAnonymous: true,
        },
      ],
    });
  }

  if ((await db.event.count()) === 0) {
    const day = 86_400_000;
    await db.event.createMany({
      data: [
        {
          title: "Guilded MeetUp – Bengaluru",
          description: "Strategy for owners at $1M+ ARR",
          hostName: "Marcus V.",
          category: "Open MeetUp",
          scheduledAt: new Date(Date.now() + 7 * day),
          durationMinutes: 90,
          seatLimit: 40,
          createdById: moderator.id,
        },
        {
          title: "Guild 03 Monthly Meeting",
          description: "Performance marketing deep-dive",
          hostName: "Elara T.",
          category: "Guild Meeting",
          scheduledAt: new Date(Date.now() + 14 * day),
          durationMinutes: 60,
          createdById: moderator.id,
        },
        {
          title: "Guild 07 Monthly Meeting",
          description: "Delegation & strategic scaling",
          hostName: "Marcus V.",
          category: "Guild Meeting",
          scheduledAt: new Date(Date.now() + 21 * day),
          durationMinutes: 60,
          createdById: moderator.id,
        },
      ],
    });
  }

  console.log(`Seeded. Moderator login: ${MODERATOR_EMAIL} / ${MODERATOR_PASSWORD}`);
}

main().finally(() => db.$disconnect());

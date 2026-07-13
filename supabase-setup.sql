-- =====================================================================
-- Guilded — Supabase setup (schema + demo seed data)
-- Run this ONCE in: Supabase dashboard -> SQL Editor -> New query -> Run
--
-- Safe to re-run: everything is IF NOT EXISTS / ON CONFLICT DO NOTHING.
-- Moderator login after this runs: moderator@guilded.app / guilded-mod-2026
-- =====================================================================

-- ── Enums ────────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE "Role" AS ENUM ('applicant', 'member', 'moderator', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "UserStatus" AS ENUM ('pending_application', 'interview_scheduled', 'accepted', 'rejected', 'active', 'deactivated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "ApplicationStatus" AS ENUM ('submitted', 'interview_scheduled', 'accepted', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "EventStatus" AS ENUM ('upcoming', 'cancelled', 'completed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "ReviewStatus" AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "NotificationFrequency" AS ENUM ('real_time', 'daily', 'weekly', 'monthly');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── Tables ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "passwordHash" TEXT,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "linkedinUrl" TEXT,
    "role" "Role" NOT NULL DEFAULT 'applicant',
    "status" "UserStatus" NOT NULL DEFAULT 'pending_application',
    "notificationFrequency" "NotificationFrequency" NOT NULL DEFAULT 'real_time',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS "Application" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "agencyName" TEXT NOT NULL,
    "agencyWebsite" TEXT,
    "industry" TEXT NOT NULL,
    "agencySize" TEXT NOT NULL,
    "yearsInOperation" TEXT NOT NULL,
    "monthlyRevenue" TEXT NOT NULL,
    "primaryServices" TEXT NOT NULL,
    "motivation" TEXT NOT NULL,
    "currentChallenge" TEXT NOT NULL,
    "location" TEXT,
    "fitScores" JSONB,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'submitted',
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "hostName" TEXT NOT NULL,
    "category" TEXT,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "seatLimit" INTEGER,
    "status" "EventStatus" NOT NULL DEFAULT 'upcoming',
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "EventRsvp" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EventRsvp_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ClientReview" (
    "id" TEXT NOT NULL,
    "submittedById" TEXT NOT NULL,
    "clientCompany" TEXT NOT NULL,
    "industry" TEXT,
    "city" TEXT,
    "service" TEXT,
    "rating" JSONB NOT NULL,
    "description" TEXT NOT NULL,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "status" "ReviewStatus" NOT NULL DEFAULT 'pending',
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ClientReview_pkey" PRIMARY KEY ("id")
);

-- ── Indexes ──────────────────────────────────────────────────────────
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE UNIQUE INDEX IF NOT EXISTS "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_token_key" ON "VerificationToken"("token");
CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
CREATE INDEX IF NOT EXISTS "Application_status_idx" ON "Application"("status");
CREATE INDEX IF NOT EXISTS "Event_status_scheduledAt_idx" ON "Event"("status", "scheduledAt");
CREATE UNIQUE INDEX IF NOT EXISTS "EventRsvp_eventId_userId_key" ON "EventRsvp"("eventId", "userId");
CREATE INDEX IF NOT EXISTS "ClientReview_status_idx" ON "ClientReview"("status");

-- ── Foreign keys ─────────────────────────────────────────────────────
DO $$ BEGIN
  ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "Application" ADD CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "Application" ADD CONSTRAINT "Application_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "Event" ADD CONSTRAINT "Event_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "EventRsvp" ADD CONSTRAINT "EventRsvp_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "EventRsvp" ADD CONSTRAINT "EventRsvp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "ClientReview" ADD CONSTRAINT "ClientReview_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "ClientReview" ADD CONSTRAINT "ClientReview_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- =====================================================================
-- Demo seed data
-- =====================================================================

-- Moderator (password: guilded-mod-2026 — change before production)
INSERT INTO "User" ("id", "email", "name", "passwordHash", "role", "status", "updatedAt") VALUES
  ('11111111-1111-1111-1111-111111111111', 'moderator@guilded.app', 'Ananya Bhat', '$2b$10$KTUQDNvu7zcoA01YOPJXS.mMmXPYaNaBVc/rQ5C1BqsZt9UBjJFA2', 'moderator', 'active', CURRENT_TIMESTAMP)
ON CONFLICT ("email") DO NOTHING;

-- Existing members (authors of the client reviews)
INSERT INTO "User" ("id", "email", "name", "role", "status", "updatedAt") VALUES
  ('22222222-2222-2222-2222-222222222222', 'riya@ironcladmarketing.example', 'Riya Mehta', 'member', 'active', CURRENT_TIMESTAMP),
  ('33333333-3333-3333-3333-333333333333', 'marcus@designhouse.example', 'Marcus V', 'member', 'active', CURRENT_TIMESTAMP)
ON CONFLICT ("email") DO NOTHING;

-- Applicants awaiting review
INSERT INTO "User" ("id", "email", "name", "role", "status", "linkedinUrl", "updatedAt") VALUES
  ('44444444-4444-4444-4444-444444444444', 'arnold@ironclad.example', 'Arnold Dias', 'applicant', 'pending_application', 'https://linkedin.com/in/arnold-dias', CURRENT_TIMESTAMP),
  ('55555555-5555-5555-5555-555555555555', 'elara@crescent.example', 'Elara Thorne', 'applicant', 'pending_application', 'https://linkedin.com/in/elara-thorne', CURRENT_TIMESTAMP)
ON CONFLICT ("email") DO NOTHING;

-- Their applications (New Member Requests on the dashboard)
INSERT INTO "Application" ("id", "userId", "agencyName", "agencyWebsite", "industry", "agencySize", "yearsInOperation", "monthlyRevenue", "primaryServices", "motivation", "currentChallenge", "location", "fitScores", "status") VALUES
  ('a1111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'Ironclad Marketing Agency', 'https://ironcladmarketing.example', 'Branding', '14 members', '6 years', '$45k/mo', 'Brand strategy, Identity design, Packaging', 'Looking for a room of peers who actually run agencies, not another Slack group full of vendors pitching tools.', 'Scaling delivery without losing quality as we take on bigger retainers.', 'Mumbai', '{"profile": 88, "niche": 92, "activity": 76}', 'submitted'),
  ('a2222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555', 'Crescent Design House', 'https://crescentdesign.example', 'Performance Mktg', '8 members', '4 years', '$80k/mo', 'Paid social, CRO, Lifecycle marketing', 'Want honest conversations about pricing and client churn with people who''ve been through it.', 'Hiring senior strategists faster than we lose them.', 'Bengaluru', '{"profile": 81, "niche": 74, "activity": 88}', 'submitted')
ON CONFLICT ("id") DO NOTHING;

-- Pending client-experience reviews (8-dimension rubric)
INSERT INTO "ClientReview" ("id", "submittedById", "clientCompany", "industry", "city", "service", "rating", "description", "isAnonymous", "status") VALUES
  ('c1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'TrueSpark Digital', 'SaaS', 'Pune', 'Brand refresh',
   '{"payment_behaviour": 4.5, "communication_quality": 4.3, "scope_clarity": 3, "scope_creep": 4, "decision_making_speed": 4.5, "ease_of_working": 4.2, "professionalism": 4, "would_work_again": true}',
   'Genuinely one of the better clients I''ve worked with....', true, 'pending'),
  ('c2222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'Meridian Retail Group', 'Retail', 'Delhi', 'Performance campaigns',
   '{"payment_behaviour": 2.5, "communication_quality": 2.8, "scope_clarity": 1.5, "scope_creep": 2, "decision_making_speed": 2.5, "ease_of_working": 2.6, "professionalism": 1.5, "would_work_again": false}',
   'Budget is real and they do pay, eventually. But scope creeps every month.', true, 'pending')
ON CONFLICT ("id") DO NOTHING;

-- Upcoming events (Event Schedule section)
INSERT INTO "Event" ("id", "title", "description", "hostName", "category", "scheduledAt", "durationMinutes", "seatLimit", "status", "createdById") VALUES
  ('e1111111-1111-1111-1111-111111111111', 'Guilded MeetUp – Bengaluru', 'Strategy for owners at $1M+ ARR', 'Marcus V.', 'Open MeetUp', CURRENT_TIMESTAMP + INTERVAL '7 days', 90, 40, 'upcoming', '11111111-1111-1111-1111-111111111111'),
  ('e2222222-2222-2222-2222-222222222222', 'Guild 03 Monthly Meeting', 'Performance marketing deep-dive', 'Elara T.', 'Guild Meeting', CURRENT_TIMESTAMP + INTERVAL '14 days', 60, NULL, 'upcoming', '11111111-1111-1111-1111-111111111111'),
  ('e3333333-3333-3333-3333-333333333333', 'Guild 07 Monthly Meeting', 'Delegation & strategic scaling', 'Marcus V.', 'Guild Meeting', CURRENT_TIMESTAMP + INTERVAL '21 days', 60, NULL, 'upcoming', '11111111-1111-1111-1111-111111111111')
ON CONFLICT ("id") DO NOTHING;

-- ── Done ─────────────────────────────────────────────────────────────
SELECT
  (SELECT COUNT(*) FROM "User")         AS users,
  (SELECT COUNT(*) FROM "Application")  AS applications,
  (SELECT COUNT(*) FROM "ClientReview") AS client_reviews,
  (SELECT COUNT(*) FROM "Event")        AS events;

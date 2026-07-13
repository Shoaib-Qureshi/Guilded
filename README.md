# Guilded

An application-gated community for agency founders. Applicants apply, get vetted
through a two-gate interview pipeline, and become Members. Moderators run that
pipeline, the events, and content moderation from their own dashboard.

Product and architecture docs live in [`docs/`](./docs) — start with
[`docs/README.md`](./docs/README.md).

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind v4 + shadcn/ui, dark-mode-first portal palette ([`docs/design-system.md`](./docs/design-system.md)) |
| Auth | NextAuth v5 — credentials provider + bcrypt |
| Database | **Supabase** (Postgres) via Prisma 7 |
| Package manager | **pnpm** — `npm install` fails on this repo |

> This is a modified build of Next.js: `middleware.ts` is renamed `proxy.ts`, and
> there's an experimental `unstable_instant` route export. Read
> `node_modules/next/dist/docs/` before touching routing or auth — see
> [`AGENTS.md`](./AGENTS.md).

## Setup

```bash
pnpm install
cp .env.example .env    # then fill it in
pnpm dev                # http://localhost:3000
```

| Env var | Notes |
|---|---|
| `DATABASE_URL` | Supabase **pooled** string (port 6543): dashboard → Connect → Transaction pooler. Percent-encode special characters in the password. |
| `AUTH_SECRET` | `openssl rand -base64 32` |

## Database

Schema + demo data: [`supabase-setup.sql`](./supabase-setup.sql). Run it once in
the Supabase dashboard → **SQL Editor**. It's idempotent.

```bash
pnpm db:check    # confirm the app reaches the DB; prints row counts
pnpm db:studio   # browse the data
```

**Migrations don't run through the Prisma CLI.** `prisma migrate deploy` fails
with `P1017` against Supabase's transaction pooler (it needs session-level
advisory locks). Apply them as plain SQL instead:

```bash
# 1. edit prisma/schema.prisma, then diff against the previous version:
pnpm prisma migrate diff --from-schema <old.prisma> --to-schema prisma/schema.prisma \
  --script -o prisma/migrations/<name>/migration.sql
# 2. apply:
pnpm tsx scripts/apply-migration.ts prisma/migrations/<name>/migration.sql
# 3. regenerate, then RESTART the dev server — it caches the old client:
pnpm prisma generate
```

## Test logins

Seeded by `supabase-setup.sql`. **Change these before production** — the moderator
password is committed in that file.

| Role | Email | Password | Lands on |
|---|---|---|---|
| Moderator | `moderator@guilded.app` | `guilded-mod-2026` | `/dashboard` |
| Member | `riya@ironcladmarketing.example` | `member-test-2026` | `/discussions` |

## Smoke tests

No unit-test suite. Each area has an end-to-end script that drives the real HTTP
surface — login, server actions, DB writes — against a running dev server.

```bash
pnpm dev                              # in one terminal, then:
pnpm tsx scripts/smoke-auth.ts        # route gating + password reset (no account enumeration)
pnpm tsx scripts/smoke-member.ts      # member shell + role separation
pnpm tsx scripts/smoke-moderator.ts   # moderator dashboard + create-event action
pnpm tsx scripts/smoke-discussions.ts # posts, categories, search, likes, comments
```

## What's built

- **Auth** — login, password reset, invite links. Routes gated by `proxy.ts` plus a
  DAL that re-reads account status per request, so deactivation takes effect at once.
- **Moderator** — dashboard (live stats, member requests, pending client reviews),
  applicant detail with the two-gate accept/reject flow, members (deactivate),
  events (create/cancel).
- **Member** — shell (sidebar, tabs, activity feed), Discussions (feed, category
  filters, search, create post, likes, comments).

## Not built yet

- **Sessions** (Phase 4) and **Client Experience** (Phase 5) — render placeholders.
- **Email** — no SMTP. Nothing sends: acceptance and password-reset links are
  printed to the dev-server log for a moderator to relay by hand.
- **Google SSO** — the login button renders but is disabled. Needs
  `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` and a provider in `lib/auth.ts`.
- **Messaging/Inbox, Guild** — no tables; disabled in the moderator nav.
- **Content reporting**, image/poll posts, member-requested session topics.

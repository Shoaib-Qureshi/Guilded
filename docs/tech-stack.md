# Tech Stack

## Already in place (do not change without reason)

- **Next.js 16.2.4**, App Router, React 19, TypeScript, Tailwind v4.
- **shadcn/ui + Radix + `@base-ui/react`** for components, `lucide-react` for icons.
- **`react-hook-form` + `zod` + `@hookform/resolvers`** for form state/validation — the onboarding flow already uses this pattern; new forms should match it.
- **`zustand`** for client-side multi-step form state (see `stores/onboarding.ts`).
- **`next-auth@5.0.0-beta.31`** already installed, currently stubbed (`lib/auth.ts` has `providers: []`).
- **`sonner`** for toasts, **`next-themes`** for theme switching.

## Decisions for this project

### Auth: NextAuth v5, Credentials provider, database sessions

- **Credentials provider** (email + bcrypt-hashed password) — this is an invite/vetting-only community, not open sign-up, so social login isn't the priority; a moderator-issued temporary password is emailed on acceptance (`moderator-flow.md` §3).
- **`@auth/prisma-adapter`** with **database session strategy** (not JWT) — chosen specifically so that when a Moderator deactivates a Member's account, the session is invalidated immediately rather than staying valid until a JWT expires.
- Role/status (`users.role`, `users.status`) live on the `User` model and are read into the session callback so server components/route handlers can check them without an extra query.

### Database: Supabase (Postgres) + Prisma

- Hostinger's Cloud Enterprise plan's Node.js app wizard only offers two connectable databases: **Supabase** and **MongoDB Atlas**. No plain MySQL/Postgres socket is exposed for Node apps on this plan.
- The schema (`database-schema.md`) is relational — users, applications, posts, comments, likes, reports, reviews, events, RSVPs, conversations/messages — all foreign-key-heavy with joins (e.g. "posts by author with like/comment counts," "reports with post + reporter + resolver"). **Supabase (Postgres)** keeps this natural; MongoDB Atlas would force denormalizing most of it into embedded documents for no real benefit here.
- **Prisma** as the ORM, `provider = "postgresql"`, `DATABASE_URL` pointing at the Supabase connection string. Supabase's own Auth/Storage/Realtime products are **not** used — auth is NextAuth, storage is local disk (below), and there's no realtime requirement in either flow.

### File storage: local disk

- Post images, application attachments, and any client-review evidence are written to a persistent directory on the Hostinger server (e.g. `UPLOADS_DIR`, outside `/public`) and served through an authenticated Next.js route handler rather than being publicly addressable — so a report's evidence or a private DM attachment isn't reachable by guessing a URL.
- Database rows store a relative path (`image_path`), not a full URL.
- Tradeoff accepted: uploads are tied to this one server's disk (backup strategy covered in `deployment-hostinger.md`); this is fine at the expected scale of a single-community app and avoids adding a third-party storage account.

### Email: Nodemailer + Hostinger SMTP

- Every transactional email in both flows (rejection, interview invite, acceptance + credentials, review approve/reject, new report notification, etc. — full list in `notifications-and-emails.md`) goes through **Nodemailer** configured against Hostinger's own SMTP credentials for the domain. No third-party transactional email API (Resend/Postmark) is needed at this scale, and it avoids another external account/cost.

## Next.js version notes (this build is not stock Next.js — see `AGENTS.md`)

- **`middleware.ts` → `proxy.ts`**: this version renames Middleware to Proxy (same purpose — edge-adjacent optimistic auth/redirect checks using only the session cookie, never a DB call). The route-protection logic described in `roles-and-permissions.md` ("Enforcement notes") goes in `proxy.ts`, not `middleware.ts`.
- **`unstable_instant` / Cache Components**: this build ships an experimental route export that validates whether a route can render an "instant" static shell on navigation. Every dashboard here (Moderator and Member) is inherently dynamic and per-user/per-role, so dashboard layouts should set `export const unstable_instant = false` to opt out of that validation rather than fighting it — this is a one-line note for whoever builds the dashboard layouts, not a design constraint on the schema or flows in this doc set.
- Read `node_modules/next/dist/docs/01-app/02-guides/authentication.md` and `.../instant-navigation.md` in full before implementing auth/routing — per `AGENTS.md`, this Next.js build has breaking changes from training-data assumptions.

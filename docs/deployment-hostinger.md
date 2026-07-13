# Deployment — Hostinger Cloud Enterprise

## Hosting model

Hostinger Cloud Enterprise runs the app as a **Node.js app** through hPanel (not a bare VPS — no arbitrary system daemons, no Docker; only what the managed Node.js app process can do at runtime). Practical implications:

- Build step (`next build`) and start command (`next start`, or a custom `server.js` if a long-running process is needed for anything beyond serving Next.js) are configured in hPanel's Node.js app screen, not a hand-rolled systemd unit.
- Background/cron-style work (e.g. marking `events.status = completed` after `scheduled_at` passes) should be done lazily on read rather than assuming a persistent cron worker is available, unless hPanel's Node.js app plan is confirmed to support scheduled tasks.
- Local disk storage (`tech-stack.md`) persists across deploys on this plan (it's not an ephemeral/serverless container), which is what makes the "local disk for uploads" decision viable here.

## Database: Supabase

1. Create a Supabase project (free/pro tier depending on expected load).
2. In hPanel's Node.js app → Databases integration, connect the Supabase project (this is the path Hostinger exposes for Node apps on this plan — see `tech-stack.md` for why Supabase was chosen over MongoDB Atlas).
3. Copy the Supabase connection string (pooled connection string, since serverless-style connection limits apply) into `DATABASE_URL`.
4. Run `prisma migrate deploy` against that URL as part of the deploy step (not `prisma migrate dev`, which is local-only).
5. Supabase's own Auth/Storage/Realtime dashboards are not used for anything — the project exists purely as a managed Postgres instance.

## File uploads

- Files are written to a directory outside `/public` (e.g. `UPLOADS_DIR=/home/<app>/storage/uploads`) so they're never directly web-addressable.
- A Next.js route handler (e.g. `app/api/files/[id]/route.ts`) streams a file back after checking the requesting user is authorized to see it (post author, report reviewer, conversation participant, etc. — per `roles-and-permissions.md`).
- **Backups**: since this is local disk (not Supabase Storage or S3), back up `UPLOADS_DIR` separately from the database — hPanel's file backup/snapshot feature for the Node.js app's persistent storage, on whatever schedule the Cloud Enterprise plan supports. Losing this directory without a backup means losing all post images and review attachments even though the database rows referencing them survive.

## Email: SMTP

- Use the domain's Hostinger-provided SMTP credentials (Hostinger Email or a connected domain mailbox) with Nodemailer.
- Recommended to send from a dedicated address (e.g. `no-reply@<domain>` or `moderators@<domain>` for the ones that should look like they're from a person) rather than a personal inbox.

## Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Supabase Postgres connection string (pooled) |
| `AUTH_SECRET` | already present in `.env`; NextAuth session/JWT signing secret |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Hostinger SMTP credentials |
| `SMTP_FROM` | default "from" address for transactional emails |
| `UPLOADS_DIR` | absolute path to the persistent local-disk upload directory |
| `NEXTAUTH_URL` / app base URL | needed for email links (interview scheduling, credential emails) to point at the right domain |

No `.env.example` exists yet in the repo — create one alongside the real Prisma schema/auth wiring in a later implementation pass, listing these keys without real values.

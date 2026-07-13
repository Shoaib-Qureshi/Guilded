# Guilded — Documentation

Guilded is a gated professional community app for agency owners. Applicants apply, get vetted through an interview step, and become Members; Moderators run the vetting pipeline, events, and content moderation through their own dashboard.

## Glossary

- **Applicant** — submitted an application, no dashboard access yet.
- **Member** — an accepted applicant with full access to Sessions, Discussions, Client Experience, DMs.
- **Moderator** — an operational-only role with its own dashboard (vetting, events, review-approval, content-moderation) — does not post/RSVP/DM as a peer Member.
- **Admin** — a Moderator with platform-level powers (managing other moderators, editing rules content).

## Docs index

| Doc | What's in it |
|---|---|
| [`product-brief.md`](./product-brief.md) | Why Guilded exists: problem statement, USP, who it's for and explicitly not for. |
| [`user-flow.md`](./user-flow.md) | The Member journey step-by-step, transcribed from `user.png`: onboarding, sessions, discussions/posts, client-experience reviews. |
| [`moderator-flow.md`](./moderator-flow.md) | The Moderator journey step-by-step, transcribed from `amoderator.png`: vetting pipeline, sessions management, review approvals, messages, content moderation. |
| [`roles-and-permissions.md`](./roles-and-permissions.md) | Role definitions, the pre-application eligibility gate, the account status state machine, and a full capability matrix. |
| [`rules-and-regulations.md`](./rules-and-regulations.md) | Community guidelines and moderation policy: vetting criteria, content rules, client-review rating rubric and gates, data retention. |
| [`tech-stack.md`](./tech-stack.md) | The chosen stack and why: Next.js 16 + NextAuth v5 + Supabase (Postgres) + Prisma + local-disk storage + Nodemailer/SMTP, plus this Next.js build's version-specific quirks (`proxy.ts`, `unstable_instant`). |
| [`database-schema.md`](./database-schema.md) | Full table-by-table schema (users, applications, events, posts, reports, messages, client reviews, notifications). |
| [`deployment-hostinger.md`](./deployment-hostinger.md) | How this runs on Hostinger Cloud Enterprise: Node.js app setup, Supabase connection, local upload storage + backups, SMTP, required env vars. |
| [`notifications-and-emails.md`](./notifications-and-emails.md) | Every email/notification trigger, split into real-time vs. frequency-controlled digest, per the tech doc's design. |
| [`design-system.md`](./design-system.md) | Real color/typography tokens pulled from the Figma design-system page — dark-mode-first, gold primary brand color. |
| [`figma-screen-map.md`](./figma-screen-map.md) | Maps flow steps to Figma frame node-ids; flags flow steps with no built screen yet. Living document — more screens are still being added. |
| `amoderator.png`, `user.png`, `Guilded - Tech doc.docx` | Original source material. Keep these — the `.md` docs above are transcriptions/reconciliations, not replacements. |

## Reading order for someone new

1. `product-brief.md` — understand why this exists.
2. `user-flow.md` and `moderator-flow.md` — understand the product.
3. `roles-and-permissions.md` and `rules-and-regulations.md` — understand who can do what and why.
4. `tech-stack.md`, `database-schema.md`, `deployment-hostinger.md` — understand how it's built and hosted.
5. `design-system.md` and `figma-screen-map.md` — understand the visual language and what's already designed.
6. `notifications-and-emails.md` — cross-cutting reference used while building any of the above.

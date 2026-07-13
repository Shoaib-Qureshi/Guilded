# Roles & Permissions

## Roles

- **Applicant** — has submitted (or is mid-submitting) an application, no dashboard access, not yet a `users.role`.
- **Member** — an accepted applicant. Full access to Sessions, Discussions, Client Experience, DMs, own profile/settings.
- **Moderator** — **operational-only**, per `Guilded - Tech doc.docx`: "Unlike the Agency Founder, the Moderator does not participate in peer conversations as a member." Moderators work through a dedicated Moderator Dashboard (`moderator-flow.md`) — vetting pipeline, sessions management, review approvals, messages inbox, content moderation — and do **not** post, RSVP, DM as a peer, or submit client reviews as themselves. This is a change from an earlier draft of this doc that had Moderators inheriting all Member powers; the tech doc is the source of truth.
- **Admin** — everything a Moderator can do, plus platform-level actions not shown in the two flowcharts but implied by running a real app: managing other moderators' accounts, editing community rules content, viewing platform-wide audit logs.

## Pre-application eligibility gate

Shown at the landing page before "Apply to Join" (self-attestation, not DB-enforced — there's no system check that stops an ineligible person from submitting; it's a clear expectation-setting statement before the form, and Moderators use it as a filter during application review):

- Agency has 2–50 employees.
- Applicant holds an operational role at the agency (not just an investor/figurehead).
- Not freelancer-only.
- Who it's **not** for, stated explicitly: regular employees, freelancers, interns (see `product-brief.md` — this is the exclusion the whole trust model depends on).

## Account status state machine

```
pending_application → interview_scheduled → accepted → active ⇄ deactivated
                    ↘ rejected           ↘ rejected
```

- `pending_application`: `users` row + `applications` row exist, no dashboard access, no auth session.
- `interview_scheduled`: application passed gate 1, awaiting interview outcome.
- `accepted`: application passed gate 2; credentials email is about to be (or has been) sent.
- `active`: `role = member` (or promoted to `moderator`/`admin` separately by an Admin), can log in.
- `rejected`: terminal, can re-apply later by creating a new `applications` row (not modeled as a retry loop here — a rejected user re-applying is treated as a fresh application tied to the same `users` row).
- `deactivated`: set by the user (self-service delete/deactivate in Settings) or by a Moderator/Admin (e.g. after a content violation); auth session is killed immediately (this is why session strategy is database-backed — see `tech-stack.md`).

## Capability matrix

| Action | Applicant | Member | Moderator | Admin |
|---|:---:|:---:|:---:|:---:|
| Submit application | ✅ | — | — | — |
| View own application status | ✅ | — | — | — |
| View/RSVP sessions (as a peer) | — | ✅ | — | — |
| Create/edit/cancel sessions | — | — | ✅ | ✅ |
| Create posts (text/image/poll) | — | ✅ | — | — |
| Comment / like posts | — | ✅ | — | — |
| Edit/delete **own** post or comment | — | ✅ | — | — |
| Edit/delete **any** post or comment | — | — | ✅ | ✅ |
| Report content | — | ✅ | — | — |
| Resolve a report (remove post / clear report) | — | — | ✅ | ✅ |
| Send/receive DMs (as a peer) | — | ✅ | — | — |
| Receive messages via the Moderator inbox | — | — | ✅ | ✅ |
| Submit a client-experience review | — | ✅ | — | — |
| View approved client reviews | — | ✅ (after submitting one) | — | — |
| Approve/reject a client review | — | — | ✅ | ✅ |
| Review new member applications | — | — | ✅ | ✅ |
| Accept/reject an application | — | — | ✅ | ✅ |
| Deactivate **own** account | — | ✅ | ✅ | ✅ |
| Deactivate **another** account | — | — | ✅ (members only) | ✅ (anyone) |
| Promote a Member to Moderator | — | — | — | ✅ |
| Edit community rules content | — | — | — | ✅ |

Moderators/Admins are not blocked at the database level from having their own posts/RSVPs/reviews (the foreign keys just point at `users`) — the restriction above is a product/UI rule (no Moderator-facing UI for these actions on their own dashboard), not a schema constraint. See `database-schema.md`.

## Enforcement notes for implementation (later, not now)

- Role/status checks belong in a Data Access Layer (`lib/dal.ts`-style), not just hidden UI — see the Next.js authentication guide's guidance in `tech-stack.md`.
- `proxy.ts` (this Next.js version's renamed `middleware.ts`) should do the *optimistic* redirect (logged-out → `/login`, wrong role → dashboard home) using the session cookie only; the actual authorization check still happens server-side per action.

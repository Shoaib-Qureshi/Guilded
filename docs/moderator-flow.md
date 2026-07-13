# Moderator Flow

Transcribed from `docs/amoderator.png`. Moderators run the vetting pipeline, events, and content moderation. Admins have every Moderator capability plus the items called out in `roles-and-permissions.md`.

## 1. Entry

Open Guilded → Log-in → Dashboard (default view: Stats).

## 2. Stats (dashboard home)

Aggregated counts, each backed by a query rather than its own table:

| Tile | Backing query |
|---|---|
| New member requests | `count(applications where status = 'submitted')` |
| Pending tasks | sum of: pending applications, pending client reviews, open reports |
| Messages | `count(messages where recipient = moderator and read_at is null)` |

## 3. New member requests (vetting pipeline)

| Step | Screen / Action | Reads | Writes |
|---|---|---|---|
| 1 | View full application | `applications`, `users` | — |
| 2 | Accept or reject (gate 1) | `applications` | if reject → `applications.status = rejected`; if accept → continue |
| 3a | Reject → send rejection email | `applications` | email sent, `applications.rejection_reason` optionally recorded |
| 3b | Accept → send email for interview | `applications` | `applications.status = interview_scheduled`, email sent |
| 4 | Accept or reject (gate 2, post-interview) | `applications` | — |
| 5a | Reject → send rejection email | `applications` | `applications.status = rejected`, email sent |
| 5b | Accept application | `applications` | `applications.status = accepted` |
| 6 | Send credentials + onboarding guide | `applications`, `users` | `users.status = active`, `users.role = member`, email sent (temp password or magic link) |

## 4. Sessions management

| Step | Screen / Action | Reads | Writes |
|---|---|---|---|
| 1 | View RSVP'd members, session details | `events`, `event_rsvps` | — |
| 2 | Add session to upcoming sessions wall | — | `events` row, status `upcoming` |
| 3 | Edit or cancel session | `events` | `events` updated, or `events.status = cancelled` |

## 5. Pending client-experience reviews

| Step | Screen / Action | Reads | Writes |
|---|---|---|---|
| 1 | View full review and verify client | `client_reviews` | — |
| 2a | Approve review | `client_reviews` | `client_reviews.status = approved`, `client_reviews.reviewed_by/reviewed_at` set |
| 2b | Reject review, if details are incorrect/unverifiable | `client_reviews` | `client_reviews.status = rejected`, `client_reviews.reviewed_by/reviewed_at` set |
| 3 | Outcome email sent to submitter (acceptance or rejection) | `client_reviews` | email sent |

Per `Guilded - Tech doc.docx`, rejection is an explicit path with its own stated ground ("if details are incorrect/unverifiable") — not just the absence of approval.

## 6. Messages

| Step | Screen / Action | Reads | Writes |
|---|---|---|---|
| 1 | View messages (moderator inbox) | `messages`, `conversations` | — |
| 2 | Reply via email | `messages` | new `messages` row, or an email sent if replying outside the app |

## 7. Reported content

| Step | Screen / Action | Reads | Writes |
|---|---|---|---|
| 1 | View reported content | `content_reports` | — |
| 2 | View member and post details | `content_reports`, `posts`, `users` | — |
| 3a | Remove post | `posts` | `posts.deleted_at` set, `content_reports.status = resolved` |
| 3b | Clear report (no action) | `content_reports` | `content_reports.status = dismissed` |

## Notes

- Every accept/reject/approve action in this flow is an audit-worthy event — `reviewed_by` / `resolved_by` columns exist on the relevant tables specifically so the dashboard can show "who actioned this."
- See `notifications-and-emails.md` for the full list of emails this flow triggers.

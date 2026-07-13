# Notifications & Emails

Every email/notification trigger across both flows, plus the concrete design from `Guilded - Tech doc.docx`'s "Email Notification Design" section. All emails are sent via Nodemailer + Hostinger SMTP (`tech-stack.md`); in-app "notifications" back the Moderator dashboard's Stats/pending-tasks tiles via the `notifications` table (`database-schema.md`).

## Frequency model

Per `users.notification_frequency` (`database-schema.md`), every Member chooses a cadence in Settings — this splits every trigger below into one of two buckets:

- **Real-time triggers**: sent immediately, always, regardless of the frequency setting — these directly involve the user and are short, single-action emails with one clear CTA button.
- **Digest triggers**: batched into a daily/weekly/monthly summary per the user's `notification_frequency` — for ambient activity they didn't directly participate in. One email per period summarizing active discussions and upcoming sessions.

## Real-time triggers

| Trigger event | Recipient | Related table(s) |
|---|---|---|
| Application accepted at gate 1 (interview) | Applicant | `applications` |
| Application rejected at gate 1 | Applicant | `applications` |
| Application accepted at gate 2 (credentials + onboarding guide) | Applicant | `applications`, `users` |
| Application rejected at gate 2 | Applicant | `applications` |
| Client review approved | Submitter | `client_reviews` |
| Client review rejected (details incorrect/unverifiable) | Submitter | `client_reviews` |
| Someone replies to a thread the user started or commented on | Member | `posts`, `post_comments` |
| A session they RSVP'd to is happening in 24 hours (reminder) | Member | `events`, `event_rsvps` |
| Session cancelled | Members who RSVP'd | `events`, `event_rsvps` |

## Digest triggers (daily/weekly/monthly per `users.notification_frequency`)

| Trigger event | Recipient | Related table(s) |
|---|---|---|
| A new session is posted to the wall | All Members | `events` |
| A thread gets high engagement (e.g. crosses 10 likes) | Members who engaged with it | `posts`, `post_likes` |
| A new Discussion post matches a topic the user previously engaged with | Interested Members | `posts` |
| A fellow member starts a new thread | All Members (digest format, not real-time) | `posts` |

## In-app / moderator-facing (not member emails)

| Trigger event | Recipient | Channel | Related table(s) |
|---|---|---|---|
| Application submitted | Moderators (aggregate, via Stats tile) | in-app notification | `applications`, `notifications` |
| Client review submitted | Moderators (aggregate) | in-app notification | `client_reviews`, `notifications` |
| Content reported | Moderators (aggregate) | in-app notification | `content_reports`, `notifications` |
| Member submits a message to a Moderator | Moderators (aggregate, via Messages tile) | in-app notification | `messages`, `notifications` |
| New direct message (member-to-member) | Recipient | in-app notification (badge); no email unless recipient is offline for an extended period | `messages`, `notifications` |

## Out of scope for now

- **"Circle invite"** — appears in the tech doc's own digest example ("summarising active discussions in their Circles") but Circles aren't an MVP feature (`product-brief.md`, `rules-and-regulations.md` §5). Noted here so it isn't forgotten if Circles gets built later, not implemented now.

## Design notes

- Rows in the "in-app / moderator-facing" table are intentionally **not** per-moderator emails — they're a shared dashboard count (`notifications` rows with `user_id` per moderator, or a single query over the source table filtered by status). Emailing every moderator on every application submission would be noisy at any real scale.
- Real-time emails: short, single-action, one clear CTA button — per the tech doc's explicit design guidance.
- Digest emails: one email per period summarizing active discussions in Discussions and upcoming Sessions for that window.

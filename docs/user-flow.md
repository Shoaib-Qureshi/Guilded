# User (Member) Flow

Transcribed from `docs/user.png`. This is the journey for an applicant who becomes a Member. See `roles-and-permissions.md` for the account status state machine and `database-schema.md` for the tables referenced below.

## 1. Onboarding (pre-membership)

| Step | Screen / Action | Reads | Writes |
|---|---|---|---|
| 1 | Landing page — states who it's for (agency owners, 2–50 employees, operational role) and who it's not for (employees, freelancers, interns); see `product-brief.md` | — | — |
| 2 | "Apply to be a member" CTA | — | — |
| 3 | Application form (multi-step: identity + LinkedIn + agency website → agency profile → motivation) | — | `users` (status `pending_application`), `applications` (status `submitted`) |
| 4 | Success screen | — | — |
| 5 | Email: interview schedule *if accepted* by a Moderator (see `moderator-flow.md` step "New member requests") | `applications` | `applications.status = interview_scheduled`, email sent |
| 6 | Email: login credentials + onboarding guide *if membership approved* | `applications` | `applications.status = accepted`, `users.status = active`, email sent |
| 7 | Log-in | `users` | auth session created |

The existing onboarding UI (`components/onboarding/*`, `lib/validations/onboarding.ts`) already implements most of step 3's fields — see `database-schema.md` for how those map to the `applications` table, including `agency_website`, which is new (not yet in the onboarding code) and validated for reachability at submission.

## 2. Sessions (events)

| Step | Screen / Action | Reads | Writes |
|---|---|---|---|
| 1 | View upcoming sessions | `events` (status `upcoming`), `event_rsvps` (has this user RSVP'd / upvoted before) | — |
| 2 | Expand a session | `events` (host, date, time, duration, seat count), `event_rsvps` (seats taken) | — |
| 3 | Add to calendar | `events` | — (client-side .ics generation, no write) |

## 3. Discussions / Posts

### Sidebar (account-scoped)

| Step | Screen / Action | Reads | Writes |
|---|---|---|---|
| View activity & engagement on posts | `posts`, `post_likes`, `post_comments` (scoped to author = current user) | — |
| Inbox → DMs chat interface → view profile of member | `conversations`, `conversation_participants`, `messages` | new `messages` row on send |
| Settings → email notification frequency, edit member profile, deactivate/delete account | `users` | `users` updated or `users.status = deactivated` |
| Help → FAQs, user guides, submit a message to the moderator | — | `messages` row addressed to a moderator conversation |
| User profile → edit profile details | `users` | `users` updated |

### Top section (feed)

| Step | Screen / Action | Reads | Writes |
|---|---|---|---|
| Search → recent searches → suggestions → results / no results | `posts` | — |
| Create post → choose Text / Image / Poll → category → title & details → Create or Discard | — | `posts` row (+ `poll_options` if poll), image saved to local disk (`image_path` stored) |
| Post submitted success screen | `posts` | — |
| Filter posts by category | `posts` | — |
| View post (lightbox) → view comments & likes → post comment / like the post → report content | `posts`, `post_comments`, `post_likes` | `post_comments` row, `post_likes` row, or `content_reports` row |
| View post → edit or delete post (own posts only) | `posts` | `posts` updated or `posts.deleted_at` set |
| View post → view poll results | `poll_options`, `poll_votes` | `poll_votes` row on first vote |

## 4. Client Experience

| Step | Screen / Action | Reads | Writes |
|---|---|---|---|
| 1 | Privacy & confidentiality statement (shown once) | — | — |
| 2 | Gate A: must submit a client review before viewing others' at all | `client_reviews` (has this user submitted ≥1 approved review) | — |
| 3 | View approved reviews (wall) → expand full review → other reviews for same company | `client_reviews` (status `approved`) | — |
| 4 | Share experience: client company, industry/city/service, criteria rating (8 dimensions — see `rules-and-regulations.md` §3), description, submitted by (identity or anonymous — **cannot be changed after posting**), time of post | — | `client_reviews` row, status `pending` |
| 5 | Submit for review → outcome email (acceptance, or rejection if details are incorrect/unverifiable) | `client_reviews` | `client_reviews.status = approved/rejected` (set by a moderator, see `moderator-flow.md`), email sent |
| 6 | Delete own review | `client_reviews` | row removed / soft-deleted |
| 7 | Search for previously reviewed clients → results/suggestions → no results | `client_reviews` | — |
| 8 | Gate B (separate, higher threshold than Gate A): submit X reviews to unlock the client-search feature in step 7 | `client_reviews` (count of approved reviews submitted) | — |

## 5. Cross-cutting

- **Network failure / generic error states** apply to every screen above — no dedicated table, this is a UI-layer concern.

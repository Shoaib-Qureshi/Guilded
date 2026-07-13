# Figma Screen Map

Maps each step in `user-flow.md`/`moderator-flow.md` to its Figma frame, where one exists. File `Guilded` (`0X6HKqvG6Ufd1E9lzqVyTq`), page **"V1 Screens"** (`0:1`).

**This is a living document.** The user has confirmed more screens are still being added to the Figma file — re-check node ids here whenever the file changes, don't treat this table as final.

## Discussions / Sessions / Client Experience — "Discussions section" (`1:2200`)

| Flow step | Figma node id | Notes |
|---|---|---|
| Discussions — default/feed view | `163:291` (label) | frame itself not separately captured in this pass |
| Discussions — search | `1:2451` | matches `user-flow.md` §3 "Search → recent searches → suggestions → results" |
| Discussions — create post | `1:2651` | matches §3 "Create post" |
| Discussions — empty state | `112:286` | |
| Sessions — request a session | under `1:2200`, labeled "Request a session" | **Phase 2, not MVP** — see note below |
| Sessions — request submitted | labeled "Request a Session: Submitted" | **Phase 2, not MVP** |
| Sessions — requested topics | labeled "Requested topics" | **Phase 2, not MVP** |
| Sessions — archive | labeled "Sessions archive" | |
| Client experience — wall | labeled "Client experience" | matches `user-flow.md` §4 step 3 |
| Client experience — share experience form | labeled "Share client experience" (`163:2103`) | matches §4 step 4 |

## Moderator — "Moderator" section (`1:3809`)

| Flow step | Figma node id | Notes |
|---|---|---|
| Moderator dashboard (stats, new member requests, client-experience pending reviews, session requests pending review, reported content) | `171:1425` ("Mod") | matches `moderator-flow.md` §2–§7 in one screen; visually confirms no changes needed to that doc beyond what's already written |
| Applicant detail view (full application + approve/reject) | `1:4145` ("Mod Applicant view") | matches `moderator-flow.md` §3 step 1 |

## Flow steps with no matching Figma frame found in this pass

Not necessarily missing from the file — just not found under the two node ids inspected (`1:2200`, `1:3809`). Re-check as new screens are added:

- Landing page / "Apply to be a member" CTA / Application form itself (the actual onboarding steps — only the post-login Discussions/Sessions/Client Experience screens were found)
- Success screen, interview-scheduled state
- Settings (notification frequency, edit profile, deactivate account)
- Help (FAQs, user guides, submit a message to moderator)
- DMs / inbox chat interface
- Reported-content detail view (member + post details) on the Moderator side

## Phase 2 (confirmed, not part of this MVP)

The Figma file has "Request a session" / "Request a Session: Submitted" / "Requested topics" screens under Sessions — Members requesting a session topic, not just RSVPing to ones Moderators create. **Confirmed out of scope for now**: this is Phase 2. `user-flow.md` §2 stays as the passive/browsing flow (view upcoming, expand, add to calendar) for this MVP; no `session_requests` table or `events.status = requested` state gets added to `database-schema.md` until Phase 2 is scoped.

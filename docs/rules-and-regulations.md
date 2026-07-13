# Community Rules & Moderation Policy

Baseline policy sourced from `Guilded - Tech doc.docx` plus what the two flowcharts imply — it needs sign-off from whoever owns community standards before launch, but implementation needs *something* written down now rather than moderators improvising.

## 1. Membership vetting

Guilded is an application-gated community for agency owners. The two-gate vetting pipeline (`moderator-flow.md` §3) exists to keep the community to genuine agency operators. Concrete eligibility criteria (from the tech doc — see `product-brief.md` and `roles-and-permissions.md`'s pre-application gate):

- Agency has **2–50 employees**.
- Applicant holds an **operational role** at the agency (not just an investor/figurehead).
- **Not freelancer-only.**
- Excluded entirely: regular employees, freelancers, interns — the confidentiality/trust model depends on every member being a true peer, not a potential competitor's employee.

Gate-by-gate:

- **Gate 1 (application review)**: check the eligibility criteria above, plus that the agency is real and active (agency name, industry, agency website, size, years in operation, monthly revenue, primary services all plausible and consistent) and motivation/current-challenge answers are genuine (not spam/copy-paste).
- **Interview**: verifies identity and agency ownership/role verbally; not automatable, exists specifically to catch applications that look fine on paper but aren't.
- **Gate 2 (post-interview review)**: final go/no-go after the interview; rejection at this stage should include an internal `rejection_reason` even though the applicant only receives a generic rejection email.

## 2. Content rules (posts, comments)

Baseline rules enforced via the report → review → resolve pipeline (`moderator-flow.md` §7):

- No solicitation/spam (agencies pitching services to other members outside the intended purpose of a post).
- No sharing of another member's private business data (revenue, client names) without consent.
- No harassment, discrimination, or personal attacks.
- Client-experience content (see §3) must stay in the Client Experience section, not be duplicated into general Discussions posts, since it carries different confidentiality expectations.

Moderators resolve a report by either **removing the post** (violation confirmed — soft delete via `posts.deleted_at`, author is not automatically notified per the flowchart, but should be for anything beyond a first minor infraction) or **clearing the report** (no violation).

## 3. Client-experience reviews

This section exists so agency owners can share experiences working with specific clients — it is the most legally/reputationally sensitive part of the app and needs the tightest policy:

- **Rating rubric**: "criteria rating" is not a single number — it's 8 named dimensions submitters score: payment behaviour, communication quality, scope/requirement clarity, scope creep, decision-making speed, ease of working, respect for agency boundaries/professionalism, and "would you work with them again?" See `database-schema.md` for how this is stored.
- **Two distinct gates**, not one: (a) a member must submit at least one review before viewing the approved-reviews wall at all (a participation incentive, not a moderation control); (b) a separate, higher threshold — submit **X reviews** — specifically unlocks the "search previously-reviewed clients" feature (`user-flow.md` §4). These are different unlocks with different thresholds.
- **Anonymity**: submitters choose identity-or-anonymous **at submission time and this cannot be changed after posting** — no edit path exists for this field once created (`client_reviews.is_anonymous`). Anonymous does not mean unmoderated — Moderators still see the submitter's identity internally; only other members see "Anonymous."
- **Verification**: "verify client" (`moderator-flow.md` §5) means confirming the named client company is real and that the submitter plausibly worked with them — not fact-checking the opinion/rating itself.
- **Rejection is explicit, not implicit**: a Moderator rejects a review specifically "if details are incorrect/unverifiable" — this is its own path in `moderator-flow.md` §5, not merely the absence of an approval. Other rejection grounds: personally identifying details about individuals (not the company) at the client, defamatory claims presented as fact rather than experience, or content that violates the general content rules in §2.
- Reviews are never publicly editable after approval — a member who wants to correct one deletes and resubmits (`user-flow.md` §4 step 6).

## 4. Data retention

- **Deactivated accounts**: `users.status = deactivated` keeps the row (for audit and to prevent email-reuse issues) but the user cannot log in; profile is hidden from other members. Self-deactivation and moderator-initiated deactivation both use the same status — the difference is only in who can trigger it (`roles-and-permissions.md`).
- **Deleted posts/reviews/comments**: soft-deleted (`deleted_at` timestamp), not hard-deleted, so a resolved report has a permanent record of what was removed and why.
- **Rejected applications**: kept indefinitely tied to the `users` row so a re-application doesn't lose history.

## 5. Out of scope for this MVP

- **"Circles"**: the tech doc's notification examples mention "Circle invite" and "discussions in their Circles" — a sub-community/topic-group concept. It doesn't appear in either flowchart or in the tech doc's own MVP Scope feature list, so it's treated as a future concept, not built now. Don't design moderation policy around it yet.

## 6. Open questions for the actual policy owner

- Should a member be notified when their post is removed, and can they appeal?
- Retention period before hard-deleting soft-deleted content / rejected applications (GDPR-style "right to be forgotten" requests aren't modeled yet).
- Escalation path when an Admin (not just a Moderator) needs to act on a report involving a Moderator's own content.

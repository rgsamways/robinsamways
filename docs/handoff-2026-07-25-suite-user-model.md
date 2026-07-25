# Handoff: settings/outline-nav wrap-up → suite abstract-class design

**What this file is:** a self-contained summary written at the end of a long (2026-07-25)
session, so a fresh session can pick up cold without re-reading the whole prior
conversation. Read this whole file before starting new work. Delete or archive it once
its content is absorbed into the new session's own context.

**Role for the next session:** Chat, per `CLAUDE.md` — this handoff is entirely design
work (a portable doc under `docs/`), no application code, no OpenSpec change in this
repo. If asked to write or edit code, confirm role explicitly first per `CLAUDE.md`'s own
instruction, same as always.

---

## 1. What shipped this session

Three OpenSpec changes implemented end-to-end and archived, all verified independently
(re-ran builds/tests myself, not just trusted CLI's reports — one round genuinely needed
this: see §2):

- **`services-payments`** (started end of the prior session, finished this one) —
  passwordless magic-link `account-auth`, Stripe `Subscription`/`FulfillmentFee` billing,
  a real Troubleshooting & Questions subscription section on `/services`. Plus a
  post-archive hardening fix (constant-time comparison on the one admin-only route).
- **`page-outline-nav`** — an "on this page" outline flyout deriving its anchor list from
  real `SectionHeader` headings (now slugified, collision-safe ids), plus a `RightRail.tsx`
  reorg bundled in (mobile top bar simplified to one cog, new Account icon + `/account`
  stub). Two real post-archive bugs found and fixed (see §2).
- **`site-settings-page`** — a real `/settings` page: theme (relocated out of the rail
  entirely), font size (CSS variable multiplier), reduced motion (tri-state, genuinely
  gates the rail's slide transition and the outline's scroll behavior, not just a stored
  flag). CLI self-caught two real drift issues during its own archive checkpoint (a stale
  `theme-toggle` spec, a wrong `page-outline-nav` metrics snapshot) — both corrected
  properly, not silently.

`docs/issues.md`'s Open section is otherwise empty. The only unchecked item is
`services-payments`' Stripe test-mode setup (Robin's own task — needs his real Stripe
account; explicitly deferred since there's no live traffic yet) plus a cosmetic
six-vs-seven spec-text mismatch, not urgent.

## 2. A real process note worth knowing about this codebase's current state

Twice this session, CLI reported a passing test suite that wasn't actually fully passing
once independently re-run (a `PageOutline.tsx` highlight bug survived one "fixed and
verified" report). Both are now genuinely fixed and independently re-verified — the
codebase is in a good, real state — but it's why every CLI report in this session got
re-run rather than taken at face value, and worth continuing for any implementation work
that follows this handoff.

## 3. The real reason a "suite" idea exists — read this before designing anything

Robin bought two new domains this session — **jernel.ca** (a journaling/goals/tasks/
fulfillment engine) and **babykitty.ca** (a calendar engine, solving multi-calendar
reconciliation without over-building for high-conflict custody cases) — meant to
eventually combine with **Vocare** into a suite. Real concept docs already exist:
`docs/baby-kitty-concept.md`, `docs/jernel-and-suite-integration.md`. Read both.

**The actual motivation, stated directly by Robin, is Farpost integration** — not three
standalone consumer apps. Alongside this, Vocare's own product framing shifted: from
"mock interview practice" to directed-conversation-skill practice generally, via two
configurable roles:

- **Anchor** — the persona the user embodies (job candidate, storyteller, salesperson,
  realtor, adjuster, contractor, homeowner...).
- **Audience** — the simulated counterpart (interviewer, listener, customer, stubborn
  home buyer, skeptical homeowner, the contractor/inspector an adjuster is vetting...).

Robin's concrete Farpost examples: realtors practicing selling to a stubborn buyer;
adjusters practicing claim requirements and vetting contractor/inspector competency
before dispatch; contractors practicing explaining cost breakdowns to skeptical
homeowners; **and the reverse direction too** — homeowners practicing how to talk to any
of those professionals for their services. Anchor/Audience is symmetric — either side of
any Farpost relationship can be the anchor, the other the audience. This is a real,
unprompted validation that the reframe generalizes correctly, not a fit-to-one-example
model.

This also directly collides with `docs/VOCARE_OVERVIEW.md`'s own flagged-unresolved M11
question ("does the no-score/not-judged promise survive a session the requesting company
might see") — Farpost being the requesting platform is a more tractable version of that
exact scenario (no agent-to-agent trust/fraud problem with an unknown third party), but
doesn't make the underlying question go away.

**Full detail, including the real naming collision already resolved** (Vocare's existing
"Anchor" was a private goal-tracking concept, M6 CRUD/archive/revisions — Robin chose to
rename *that*, freeing "Anchor" for the persona meaning; replacement name not yet
decided) is in `docs/lightbulbs/rsw-lb-vocare-anchor-audience-reframe.md`. Read it.

**Three-layer strategy, Robin's own words:** (1) each of Vocare/Jernel/Baby Kitty must
work well fully standalone — hard requirement, "some people may not care about calendars
and just want to work on their conversational skills"; (2) a suite combination tailored
to Farpost specifically is the near-term real motivation; (3) whether the suite (likely
just the anchor/audience engine) could be exposed via API for *other companies'*
applications to consume is floated as a longer-term test of portability — tentative, not
committed.

## 4. The real architectural fork this surfaces — not resolved, don't default into it

An API product consumable by outside companies is, by definition, a genuinely **shared
service** — a different relationship than the "same design shape, independently
implemented, no shared runtime" pattern `CLAUDE.md`'s Silo isolation convention already
established for auth/billing between Farpost and Vocare (see `docs/core-user-model.md`,
`docs/core-billing-model.md` — both **essentially closed** for that basic User/Membership
shape already; don't redesign that part). Whether the anchor/audience engine ends up
shared-service or independent-per-project is a real, undecided fork. Surface it
explicitly when it becomes relevant to the design doc below — don't pick one by inertia
from the existing convention.

## 5. Sequencing decision already made — don't relitigate, do respect it

Robin asked directly whether to keep building out the three suite apps until it "makes
sense" to get Farpost rolling on top. Recommendation given and agreed: **decouple them.**
Farpost's rebuild (new stack, real bugs like the "role modeled twice" issue, the Mongo→
Postgres migration) proceeds on its own timeline — it has real reasons to happen
independent of the suite. The suite apps build out on their own track, standalone-first.
Neither blocks the other. The one thing worth doing *now*, cheaply, without blocking
anything: shape Farpost's own eventual identity/account design (when that rebuild gets
there) so it *could* plug into an anchor/audience engine later — a design constraint, not
new code. That's exactly what this handoff's actual next task is.

A standing instruction from Robin this session, saved to memory
(`feedback_sequencing_discipline` in the auto-memory system): proactively name what's
open/unfinished elsewhere before starting new parallel-project work, every time, not just
when asked. Apply it if more scope gets proposed mid-task.

## 6. The actual next work

Draft a new portable design doc in `docs/` (this repo), companion to
`docs/core-user-model.md`/`docs/core-billing-model.md` — same convention: a shared design
reference other projects' own sessions read and implement independently, not an OpenSpec
change in this repo, and not a direct edit to Farpost's own repo (`c:\dev\farpost`) from
here. Once drafted, Robin relays it into Farpost's own Chat session for that session's
domain knowledge and sign-off — the same two-way relay that already resolved the original
User-model open questions on 2026-07-24 (see `docs/core-user-model.md`'s own history for
how that worked).

**Scope of the doc:** the abstract Anchor/Audience/PracticeSession shape (names TBD —
"Anchor" is claimed for the persona meaning per §3, don't reuse it for something else),
and specifically how it *could* relate to Farpost's existing `Membership` model later,
without requiring Farpost's rebuild to build toward it now. Address §4's shared-service-
vs-independent fork explicitly rather than silently picking one. Keep it a design
document — no implementation, in either repo, as part of this task.

## 7. Suggested first steps for the next session

1. Confirm role (Chat) before writing anything, per `CLAUDE.md` — this handoff doesn't
   override that.
2. Read, in full: `docs/core-user-model.md`, `docs/core-billing-model.md`,
   `docs/VOCARE_OVERVIEW.md`, `docs/jernel-and-suite-integration.md`,
   `docs/baby-kitty-concept.md`, `docs/lightbulbs/rsw-lb-vocare-anchor-audience-reframe.md`,
   `docs/lightbulbs/rsw-lb-account-hub-private-chat.md`.
3. Talk through the Anchor/Audience/PracticeSession shape with Robin before writing the
   doc — this session ended by asking whether to draft first or talk through the shape
   together first; that question was still open when this handoff was written.
4. Keep applying `feedback_sequencing_discipline` — this doc itself is the "cheap, doesn't
   block anything" move; don't let it expand into something that gates Farpost's rebuild.

# rsw-lb-vocare-anchor-audience-reframe

**Slug:** rsw-lb-vocare-anchor-audience-reframe
**Date logged:** 2026-07-25
**Status:** unscoped — design-only for now, per Robin's explicit call. Not touching Vocare's live repo (`c:\dev\vocare`); implementation waits until Vocare's own robinsamways.ca siloes port is actually scoped.
**Related:** `docs/VOCARE_OVERVIEW.md` (the open item this directly answers), `project_siloes_program` memory, the eventual Vocare silo homepage/port

## The gap

`docs/VOCARE_OVERVIEW.md` flags, as its own biggest unresolved question, "what should Vocare eventually *be*" — currently framed narrowly as mock interview practice, with a floated-but-unvalidated broader "career conversations" category (raises, pivots, promotions, return-to-work) as the only alternative on the table. Even that broader framing is still career-specific. It doesn't capture the more general shape underneath: a person practicing a directed conversation, *as* some role, *toward* some kind of audience — which interview prep is only one instance of.

## The idea

Generalize Vocare's conversation engine around two independently configurable roles:

- **Anchor** — the persona/skill-track the user is practicing, which the user themselves embodies during the conversation (a job candidate, someone sharing their life story, a salesperson pitching a product, someone having a hard personal conversation).
- **Audience** — the simulated counterpart Vocare's AI plays opposite them (an interviewer, a listener, a customer, a difficult family member, etc.).

Interview practice becomes the `anchor = candidate, audience = interviewer` special case — fully preserved, not lost — rather than the whole product. Sales pitch practice, storytelling practice, and other directed-conversation skills fall out of the same shape for free.

**Real naming collision, resolved:** Vocare already has a shipped, load-bearing concept called "Anchor" — a private, revisable *goal* with full CRUD/archive/revisions (M6, `docs/VOCARE_OVERVIEW.md`'s "vital components" list explicitly calls it out: "never leaks into public/sold tiers"). That's a different concept from the persona idea above. Robin's call: **rename the existing goal-tracking concept**, freeing "Anchor" for the new persona meaning. The replacement name for the old concept (candidates: "Goal," "Focus Area") is not yet decided — see Open Questions.

## Why it matters beyond convenience

- Answers Vocare's own spec's flagged open question with something stronger than the doc's own floated alternative — this generalizes past career contexts entirely, not just past "interview" into "career conversations."
- Widens the addressable audience beyond job-seekers — sales reps, people rehearsing hard personal conversations, public speakers — while keeping interview practice fully supported as one configuration, not diluted by the generalization.
- Every named competitor (SmallTalk2Me, Bossed, Huru, Himalayas, LockedIn AI, My Interview Practice, Applicado) is interview-practice-only — this is a real differentiation lever, not a cosmetic rename.
- Directly relevant to the jernel.ca/babykitty.ca suite conversation happening the same day: planning this concurrently with the robinsamways.ca Vocare-silo port avoids porting a product shape that's about to change anyway.

## Open questions

- What does "Audience" need as configuration — a fixed enum (interviewer/listener/customer/...) or free-text/custom description? Should probably mirror however Anchor (persona) itself ends up being defined/configured.
- Does the async mining pipeline (M4) and coaching feedback (M5) need audience-aware logic — a sales-pitch critique looks structurally different from interview feedback — or does the existing extraction (ownership language, tradeoff reasoning, quantified-impact quotes) generalize cleanly across every anchor/audience combination? Real design work, not yet started.
- The renamed replacement for the old goal-tracking concept ("Goal" vs. "Focus Area" vs. something else) — Robin confirmed the rename happens, not yet confirmed what it becomes.
- Whether M9 (opt-in public profiles) and M11 (employer-facing surface) — already flagged in `VOCARE_OVERVIEW.md` as open identity questions — need re-examination once "audience" is a first-class concept (an employer *is* a kind of audience; does M11 become a special case of this instead of its own bolt-on?).

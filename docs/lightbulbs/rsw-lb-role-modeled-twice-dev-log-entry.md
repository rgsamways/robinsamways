# rsw-lb-role-modeled-twice-dev-log-entry

**Slug:** rsw-lb-role-modeled-twice-dev-log-entry
**Date logged:** 2026-07-24
**Status:** scoped — became the `role-modeled-twice` Dev Log entry on 2026-07-26 (`dev-log-topics` change)
**Related:** Farpost's identity/roles schema (`app/models/user.py`, `professional.py`, and the 10 per-role child tables), the Farpost rebuild decision

## The gap

A real, generalizable software-design lesson surfaced today while diagnosing why Farpost's identity/roles model felt overcomplicated, and it isn't captured anywhere as a shareable story.

## The idea

A Dev Log entry walking through the actual discovery: Farpost's `Professional` model carries a `roles: list[str]` field *and* has 10 separate per-role child tables (`adjuster`, `contractor`, `agent`, etc.) joined back by a bare string with no real foreign key — "role" is modeled twice. Root cause wasn't a bad decision, it was a good one arriving late: `User`-as-root-identity was the right correction to an earlier role-first design, but the retrofit never removed the old skeleton it was built on top of. Frame this as a worked example of a common, generalizable failure mode — fixing part of a design without tearing out what it replaced — not a Farpost-specific confession.

## Why it matters beyond convenience

- Reads as senior-level self-awareness (catching and explaining your own design drift) rather than a highlight-reel of wins only.
- Generalizes past Farpost — any reader who's inherited or built an accreted codebase will recognize the pattern.
- Gives the in-progress Farpost rebuild a natural "before" state to reference, and sets up a strong follow-up entry once the new schema (`Membership`/`Stake` unification, still unconfirmed as of this logging) is actually built.

## Open questions

- Publish before or after the rebuild happens — does it read better as "here's what I found" alone, or paired with "and here's what I replaced it with"?
- How much real Farpost schema detail (field names, collection names) is fine to expose publicly vs. should be generalized/anonymized?

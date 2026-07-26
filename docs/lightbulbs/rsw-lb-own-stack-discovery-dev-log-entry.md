# rsw-lb-own-stack-discovery-dev-log-entry

**Slug:** rsw-lb-own-stack-discovery-dev-log-entry
**Date logged:** 2026-07-24
**Status:** scoped — became the `found-my-own-stack` Dev Log entry on 2026-07-26 (`dev-log-topics` change)
**Related:** Vocare (`c:\dev\vocare\backend`), Farpost, Sreditor, Smallburg — the multi-project stack audit

## The gap

There's no documented, evidence-based origin story for "this is Robin's tech stack" — without one, a stack/about page risks reading as an arbitrary list of preferences rather than something arrived at deliberately.

## The idea

A Dev Log entry (or the actual written content of a future "my stack" page) narrating the real discovery made tonight: auditing the actual dependency files across Vocare, Farpost, Sreditor, and Smallburg found that Vocare had *already* converged on Fastify + Drizzle ORM + Postgres + better-auth — before that combination was ever consciously named as "the stack." The insight wasn't "I decided on a stack," it was "I looked at what I'd already built across projects and recognized the decision I'd already made." Farpost and Smallburg are now being deliberately brought toward that same stack.

## Why it matters beyond convenience

- An evidence-based stack origin story ("I found this by auditing my own code") is more credible than a page that just asserts preferences.
- Ties directly into the multi-project portfolio narrative already being built on robinsamways.ca (see the project-silos/siloes lightbulbs) — gives that structure a concrete "why these projects, why this stack" backstory.

## Open questions

- Best framed as a Dev Log entry, or as the literal content of a dedicated "stack" page — may fit both, in different voices.
- Sequencing relative to the Farpost rebuild's completion: does the story read stronger once Farpost is actually rebuilt in that stack too, or is the "aha" moment worth capturing now before it's forgotten?

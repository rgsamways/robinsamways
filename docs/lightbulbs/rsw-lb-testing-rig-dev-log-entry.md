# rsw-lb-testing-rig-dev-log-entry

**Slug:** rsw-lb-testing-rig-dev-log-entry
**Date logged:** 2026-07-10
**Status:** unscoped — idea captured, not yet spec'd
**Related:** `docs/testing.md`, `web/src/app/dev-log/page.tsx` (currently a placeholder)

## The gap

`docs/testing.md` now consolidates how this project is actually verified — Playwright for browser-driven UI checks, FastAPI's `TestClient` for API-level testing, real external calls when testing an integration itself, no CI/persistent test suite yet, and why that's a deliberate trade-off rather than an oversight. That's valuable material Robin wants to be able to explain to someone, but right now it only lives as an internal reference doc — nothing on the live site tells this story to a visitor.

## The idea

Use `docs/testing.md`'s content as the basis for Dev Log's first real entry, once Dev Log gets real content instead of its current placeholder. Not a verbatim copy — the internal doc is written for future-Robin/future-Claude-sessions; a Dev Log entry would be written for a reader (an interviewer, a technical hiring manager) who wants to understand how this whole site actually gets verified before shipping, framed as an engineering-practice showcase rather than internal process notes.

## Why it matters beyond convenience

- Directly demonstrates a real, evaluated skill — thinking about testing/verification strategy, not just writing features — using this site's own actual practice as the worked example rather than a hypothetical.
- The honesty angle is itself the interesting part: being upfront that there's no CI or persistent test suite yet, and explaining *why* that's a deliberate choice for a solo project at this scale rather than a gap being hidden, reads as more credible than overclaiming automation that doesn't exist.
- Gives Dev Log an obvious, ready-made first entry instead of an empty page needing an idea from scratch.

## Open questions

- Does this become Dev Log's literal first entry, or does the layman's-terms glossary (`rsw-lb-layman-terms-glossary.md`) come first, with this as a second entry? Both are currently unscoped against the same still-placeholder page.
- How much of `docs/testing.md`'s content survives close to verbatim vs. needs a different, more narrative voice for a public-facing entry?
- Should this entry get updated over time as the testing approach evolves (e.g., once new portfolio pieces bring their own verification layers), or is it a point-in-time snapshot that stays as written?

# rsw-lb-ai-code-consistency-dev-log-entry

**Slug:** rsw-lb-ai-code-consistency-dev-log-entry
**Date logged:** 2026-07-26
**Status:** unscoped — idea captured, not yet spec'd. Robin wants to write this one up himself, when he has time — not delegated for full drafting yet, unlike most other dev-log-entry lightbulbs.
**Related:** `docs/handoff-2026-07-26-farpost-rebuild-methodology-briefing.md` (development-practices rule), the AI-Assisted Development / Process & Verification topic cluster already established in `dev-log-topics`

## The gap

Every Dev Log entry about AI-assisted development so far covers a specific event — a scope estimate that turned out wrong, the same source material producing different prose twice, a drift audit that didn't fully self-verify. None of them cover a quieter, cumulative observation: what it's actually like to read a codebase built entirely by AI across many files and many sessions.

## The idea

A Dev Log entry (Robin's own, written when he has time, not fully drafted here) on a real, noticed benefit of building 100% with AI: consistency in code formatting and, especially, commenting style holds across files in a way that's genuinely noticeable when reading the codebase — not just consistent indentation or brace style (a linter/formatter handles that regardless of who writes the code), but consistent *judgment* about what's worth a comment and how much context to give it. That's a harder thing to enforce via tooling in a typical multi-human-contributor codebase, where comment style tends to drift between authors even when formatting itself is enforced. Robin noticed this directly while reading through multiple robinsamways.ca files in the same session.

## Why it matters beyond convenience

- A concrete, specific example (not a vague "AI writes clean code" claim) of a real quality benefit from this way of building — fits directly alongside this session's other honest process/AI-collaboration entries rather than reading as a marketing line.
- Complements rather than duplicates the existing "AI writes the same story differently every time" entry (`same-source-different-story`) — that one is about narrative/prose non-determinism; this one is about structural/stylistic *consistency* holding even though the prose-level content varies. Worth being explicit about that contrast if both entries exist on the site together, since a careless reader could otherwise read them as contradicting each other.
- Ties into the development-practices rule now written down in `docs/standard-methodology.md` for Robin's other projects — cross-file consistency is part of why that discipline is worth carrying elsewhere, not just an incidental nice-to-have on robinsamways.ca.

## Open questions

- Robin wants to write this one himself, when he has time — leave unscoped rather than pre-drafting full copy, unlike most other entries this session.
- Worth a concrete before/after example (two files' comment style compared) to make the claim checkable rather than asserted, if a future draft wants that level of evidence.
- Which topic it lands under once drafted — likely `Process & Verification` alongside the other AI-collaboration entries, but `Architecture & Stack Decisions` could also fit if the eventual framing leans more toward "why this changes how you'd build a team/process," not just "here's what reading the code feels like."

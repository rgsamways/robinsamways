# rsw-lb-ai-interview-format-mismatch-dev-log-entry

**Slug:** rsw-lb-ai-interview-format-mismatch-dev-log-entry
**Date logged:** 2026-07-24
**Status:** unscoped — idea captured, not yet spec'd
**Related:** Farpost (used as counter-evidence), the micro1/Zara AI-interview process

## The gap

Dev Log entries so far are all narrowly technical (testing strategy, a Cosmos DB bug, tool-integration bugs). There's no entry that steps back to a meta-level, more human insight about how Robin actually works — and tonight produced a genuine one: two attempted micro1 AI-interview sessions (one cancelled ~10 minutes in, one completed) surfaced that cold, timed, verbal terminology recall (`const` vs `var`, the spread operator, `interface` vs `type`) is a real weak spot, even though the underlying reasoning ability (spotting an off-by-one loop bug, understanding why it produced the wrong answer) was intact throughout.

## The idea

A Dev Log entry recounting this honestly: the mismatch between "learn by building, reference-driven" work (the mode Farpost was built in) and what a timed AI-interviewer format actually measures. Use Farpost itself — 39 backend models, 75+ OpenSpec specs, real production incidents found and fixed by reasoning about spec-vs-code mismatches — as concrete counter-evidence that the interview format doesn't reflect actual capability.

## Why it matters beyond convenience

- Humanizes a portfolio that's otherwise all technical wins — honest reflection on a real limitation reads as more credible, not less, especially paired with hard evidence of the opposite skill.
- Implicitly makes an argument to anyone reading (including a hiring manager who might be evaluating candidates via a similar format) that portfolio/take-home evaluation surfaces real capability better than a cold timed quiz.
- Ties into the interview-driven decision to rebuild Farpost as a stack-narrowing, skill-building exercise — gives that decision a documented origin story.

## Open questions

- Does this read as too vulnerable/risky for a professional-facing Dev Log, or is the honesty exactly the point? Worth deciding tone before drafting.
- Should the technical insight (the actual JS bugs, the `const`/spread/comparator gaps) be split into a separate, more conventional bug-log entry, keeping this one purely about the format-mismatch reflection?
- Best posted now, or after landing a role through a different path — does it read better as an in-the-moment reflection or a resolved narrative with hindsight?

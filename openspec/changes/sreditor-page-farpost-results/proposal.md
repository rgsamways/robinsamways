## Why

`/method/sreditor`'s RESULTS section currently states Sreditor's T661 narrative register "has been checked against a real published CRA example, but only calibrated against a deliberately ineligible test set — Sreditor's own build — never yet against a genuinely eligible one," and its CONCLUSION leans entirely on Sreditor judging itself ineligible at every phase of its own build as the strongest evidence of skeptical calibration. Both claims are now stale: Robin ran Sreditor against Farpost's real, much larger OpenSpec history (48 archived changes, roughly four times Sreditor's own build) for the first time, and the result — exactly one defensible claim, itself only visible through rollup synthesizing three individually-ineligible changes, plus one borderline item that still fell short — is stronger calibration evidence than what the page currently claims doesn't exist yet. Beyond the content update itself, this page never had an explicit obligation to report external-calibration results specifically (only a general "reflects real state" requirement) — worth making explicit now that real external-calibration data exists for the first time.

## What Changes

- Rewrite RESULTS' calibration paragraph and "Still rough" caveat list to reflect the Farpost run: the 48-change denominator, the one defensible claim (a dispatch/ranking protocol generalization synthesized by rollup from three individually-ineligible changes), the one borderline item that stayed out, and the real scale-driven tool bugs the run exposed (rollup token-ceiling failures, a non-deterministic grouping boundary) as a newly-honest limitation.
- Update the file/test-count figures to their current state (26 TypeScript files, 1,222 non-blank lines, 52 tests across 12 files) and drop the "as of tonight" framing, which no longer anchors to a single date now that the page describes two build sessions.
- Rewrite CONCLUSION's calibration paragraph to present two independent skeptical-judgment data points (Sreditor against its own build, then against Farpost's) instead of one, removing the now-false "not yet calibrated against a real eligible project" line.
- No change to PROBLEM, EXISTING_APPROACHES, HYPOTHESIS, or METHOD — none of the underlying design reasoning changed, only the empirical results section reporting on it.
- No change to the `/method` index's Sreditor teaser or tags — still accurate.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `sreditor-page-content`: the "Content reflects Sreditor's real, verifiable state" requirement gains an explicit scenario covering calibration against an external project's real history — a genuine spec-level expectation this page didn't previously state (that RESULTS must report external calibration results, with their denominator and how any claim was actually found, once they exist), not just a formality attached to a content-only change.

## Impact

- `web/src/app/method/sreditor/page.tsx`: RESULTS and CONCLUSION section content only.
- New: `docs/lightbulbs/rsw-lb-sreditor-farpost-scale-bugs.md` (already captured, tracked separately — the scale-driven tool bugs get a brief honest mention in RESULTS but their full write-up is a future Dev Log bug-log entry, not part of this change).
- `openspec/specs/sreditor-page-content/spec.md`: delta as described above.

# rsw-lb-sreditor-farpost-scale-bugs

**Slug:** rsw-lb-sreditor-farpost-scale-bugs
**Date logged:** 2026-07-11
**Status:** unscoped — idea captured, not yet spec'd
**Related:** `docs/lightbulbs/rsw-lb-sreditor-tool-integration-bugs.md` (a different, earlier batch of Sreditor bugs — subprocess/`cross-spawn` issues from building the corroborating-signals feature, not these), `openspec/changes/dev-log-content/` (already shipped, bug-log section built to hold more entries)

## The gap

Running Sreditor against Farpost's real OpenSpec history (48 archived changes — roughly four times the size of Sreditor's own build) for the first time surfaced a genuinely different class of bug than anything dogfooding on Sreditor's own small build ever exercised: scale-driven failures, not logic errors. Rollup failed outright twice against the mostly-ineligible 48-change log (an opaque parse error, then a clean token-limit error once diagnosed) because the judgment prompt asked the model to enumerate every ineligible change into its own bucket — fine at Sreditor's own scale, not at Farpost's. Also found: `judge`'s terminal output only ever showed eligible/confidence/drift, never the actual CRA-test reasoning fields (caused a real mid-session misdiagnosis, mistaking drift's anchor-relative text for eligibility reasoning), the report's "excluded" section showed one generic bucket sentence instead of each change's own reasoning, and rollup's exact grouping showed real run-to-run non-determinism (an earlier run pulled in a 4th, unrelated change; the saved run kept it at 3 — same underlying story, different boundary).

## The idea

A fourth (or fifth, alongside `rsw-lb-sreditor-tool-integration-bugs`) Dev Log bug-log entry, or a small cluster of entries: the token-ceiling/rollup-failure story is the strongest single candidate — a clean "the model was asked to do something that doesn't scale, fixed by moving that work into code instead" narrative, a genuinely different lesson than the earlier `cross-spawn`/ANSI/`ENOBUFS` batch. The non-determinism finding (same story, different change-count across two runs) is also interesting on its own — a good pairing with the eventual write-up of the 1-defensible-claim/48-changes calibration result on the Sreditor Method page, since both come from the same Farpost test run but serve different purposes (the Method page's RESULTS section covers the calibration finding; this covers the tooling bugs the same run exposed).

## Why it matters beyond convenience

- None of these bugs were data-integrity or wrong-verdict bugs — all were output-formatting gaps or scale-driven failures. That's itself worth stating: testing only against Sreditor's own small, self-referential build never exercised these paths at all.
- Directly demonstrates why testing a tool against someone else's real, larger, messier project matters more than dogfooding alone — a concrete, defensible claim for a developer-audience reader, distinct from the SR&ED-eligibility angle already covered elsewhere.
- One theory tested and disproved during this same debugging pass (that rollup's grouping was anchor-biased) is a good small example of a real, falsifiable hypothesis check — worth keeping even if it doesn't become its own bug-log entry.

## Open questions

- Timing: build now, or batch with whatever else comes out of updating the Sreditor Method page with the Farpost calibration results, since both draw from the same 2026-07-11 test run.
- Whether this becomes one entry (the token-ceiling story, the strongest single narrative) or a small cluster covering the non-determinism finding too — first-pass judgment call when it's actually built.

# rsw-lb-public-dev-metrics-dashboard

**Slug:** rsw-lb-public-dev-metrics-dashboard
**Date logged:** 2026-07-10
**Status:** unscoped — idea captured, not yet spec'd
**Related:** `docs/metrics.md`, `docs/testing.md`, `web/src/app/dev-log/page.tsx` (currently a placeholder)

## The gap

`docs/metrics.md` already tracks a real running history — lines of code, complexity, DRYness — snapshotted at every OpenSpec archive with a written explanation of what moved and why. Right now that history only exists as an internal markdown file. Nothing on the live site shows a visitor that this tracking happens at all, even though it's genuine, ongoing engineering practice, not a one-time writeup.

## The idea

A running tally and/or chart on the Dev Log page showing how development is actually going over time — code volume, complexity, DRYness trend, maybe commit/change cadence — sourced from the same data already being collected in `docs/metrics.md`. Not a polished, curated case study; a real, live "building in public" signal, the same genre as GitHub's own contribution graphs or code-quality badges in a README, but presented as an actual chart/dashboard rather than a static badge.

## Why it matters beyond convenience

- Resonates specifically with the audience this site targets — technical interviewers and hiring managers respond to real, live engineering signal more than a polished static narrative, the same instinct behind `docs/testing.md`'s deliberately honest "no CI yet, and here's why" framing.
- Doubles as proof that the metrics-tracking discipline (`scc`, the archive-checkpoint convention) is real ongoing practice, not something written once and abandoned.
- Cheap to keep current once built — the underlying data already gets collected at every archive regardless of whether it's displayed anywhere.

## Open questions

- Needs an actual data pipeline, not just a display — something has to read `docs/metrics.md`'s (or a structured equivalent's) history and serve it to a chart component. Static generation at build time vs. an API endpoint both seem plausible; not yet decided.
- Raw numbers without narrative framing risk reading as "unresolved problem" rather than "transparency" — a dip in DRYness next to a one-line "this is when Farpost Pulse's backend landed, expected" note is the model to follow, not a bare chart.
- Does this launch with the full historical snapshot log already in `docs/metrics.md`, or start fresh from whenever it's built?
- Third Dev Log idea now sitting unscoped against the same still-placeholder page, alongside the layman's-terms glossary and the testing-rig entry — worth deciding relative ordering/priority once Dev Log actually gets built out.

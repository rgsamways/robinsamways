# rsw-lb-ru-throughput-dev-log-entry

**Slug:** rsw-lb-ru-throughput-dev-log-entry
**Date logged:** 2026-07-10
**Status:** unscoped — idea captured, not yet spec'd
**Related:** `docs/issues.md` (the real bug entry this would draw from), `web/src/app/dev-log/page.tsx` (currently a placeholder), `pieces/farpost-pulse-func/scripts/seed.js`

## The gap

Farpost Pulse's real deployment hit a genuine Cosmos DB bug: `npm run seed` failed against the live free-tier account because three containers, each defaulting to their own dedicated 400 RU/s throughput, totaled 1200 RU/s against a 1000 RU/s account cap — fixed by explicitly provisioning shared throughput at the database level instead. The underlying concept (Request Units as a normalized, decoupled-from-hardware cost model; shared vs. dedicated throughput provisioning) is a genuinely useful thing for another developer to understand, and this site has no content anywhere that captures real bugs-and-the-concept-they-reveal, distinct from both the layman's-terms glossary idea (aimed at non-technical readers) and the testing-rig entry (aimed at verification/process, not architecture concepts).

## The idea

A Dev Log entry — or a recurring format/category, not necessarily a one-off — built around real bugs actually hit during development, each paired with the deeper concept it reveals. The Cosmos DB RU/s bug is the first concrete example: what happened, why (Cosmos's default per-container dedicated-throughput behavior), and the general lesson (RU/s as a request-rate currency, not a storage or hardware metric; shared throughput pooling vs. fragmented dedicated allocations). Aimed at other developers specifically — this is technical-depth content, not the audience-broadening plain-language translation the glossary idea covers.

There's already a rich, ready-made backlog for this: every OpenSpec change's `docs/issues.md` resolution note captures exactly this kind of real detail contemporaneously (per this repo's existing handoff-logging convention), so entries wouldn't need to be manufactured after the fact — just adapted from material that already exists.

## Why it matters beyond convenience

- Directly reinforces the actual premise Farpost Pulse itself was built on — proving genuine, current hands-on experience. A real bug narrative, mess and all, is more credible signal than polished, error-free case-study prose.
- Complements the testing-rig entry and the metrics-dashboard idea rather than duplicating either — together they'd show the real, unpolished "how this actually gets built" picture instead of a curated highlight reel.
- Cheap to sustain if it becomes a recurring category: the source material (real bugs, real fixes) is a byproduct of normal work already being logged, not new effort invented specifically for content.

## Open questions

- One-off entry, or a recurring format/category drawing from the ongoing `docs/issues.md` backlog as new real bugs get logged?
- How Cosmos-specific vs. how generalized should the writeup be — a deep dive on this one bug, or framed as "a category of cloud-provisioning mistake worth knowing about," using this bug as the worked example?
- Fourth unscoped Dev Log idea now sitting against the same still-placeholder page, alongside the glossary, the testing-rig entry, and the metrics dashboard — worth deciding relative ordering/priority once Dev Log actually gets built.

## Context

Four lightbulbs accumulated against this same placeholder page over four days (`rsw-lb-layman-terms-glossary`, `rsw-lb-testing-rig-dev-log-entry`, `rsw-lb-public-dev-metrics-dashboard`, `rsw-lb-ru-throughput-dev-log-entry`), none ever prioritized against each other. Robin reviewed all four, approved each as-is, and confirmed build order matches presentation order. Two of the four ideas turned out to need something built first: the testing-rig entry needed real test suites to actually exist before it could honestly describe them (`add-automated-test-suites`, archived immediately before this change), and the bug-log entry idea gained a second real candidate (the Flex Consumption bug, found during the same deployment session as the originally-scoped Cosmos DB bug) worth launching with rather than holding back.

## Goals / Non-Goals

**Goals:**
- Ship all four ideas as real, live content on `/dev-log`, replacing the placeholder.
- Get the metrics dashboard's underlying data pipeline right — reliable, not fragile markdown-parsing.
- Launch the bug-log format with two entries, not one, so it reads as a genuine recurring category from day one rather than a single orphaned post.

**Non-Goals:**
- A per-entry routing structure (`/dev-log/<slug>`) for the bug-log entries — two entries doesn't justify it yet. Single-page, anchored sections for now; revisit if the entry count grows enough to matter (see Open Questions).
- Retroactively writing more historical Sreditor entries into Dev Log content — only the two already logged get adapted; future entries get added as they happen, per the new format this change establishes.
- Comments, reactions, or any interactive/social feature on entries — this is a showcase, not a blog platform.

## Decisions

- **Single page, not per-entry routes, for now.** Considered giving each bug-log entry (and future ones) its own route, matching Method/Narrative's per-project-page pattern. Rejected for the same reason a Tech-Stack nav tier was rejected earlier in this project: two entries doesn't justify the structural overhead, and promoting to per-entry routes later costs little if the format proves itself and the list actually grows (unlike the `pieces/` folder decision, nothing here gets baked into deploy configs that would make waiting expensive).
- **The metrics dashboard reads from a new structured data file, not by parsing `docs/metrics.md`'s prose markdown.** `docs/metrics.md` is written for a human reader — tables mixed with narrative delta explanations — and parsing that reliably at build or request time would be fragile (markdown-table-scraping breaks on any formatting drift). Instead, a small structured file (e.g. `docs/metrics.json`, one entry per snapshot: date, change name, headline numbers, DRYness) gets appended alongside `docs/metrics.md` at every archive checkpoint going forward, and backfilled once now for the five snapshots that already exist. `docs/metrics.md` stays the authoritative human-readable narrative; the JSON file is purely a machine-readable mirror for this one display purpose.
- **Backfilling the JSON file is a one-time transcription of already-known numbers**, not new data collection — every existing snapshot's numbers are already sitting in `docs/metrics.md`, this just gives them a second, structured home.
- **The dashboard renders from static data at build time**, not a live API call — Vercel already rebuilds on every push, and a new snapshot only happens at archive time (an infrequent, deliberate checkpoint), so there's no need for runtime fetching or a backend endpoint. Simpler, faster, and consistent with this being a "building in public" signal rather than a real-time monitoring tool.
- **Glossary launches with the 5 starter terms already named in the source lightbulb** (Twilio, OAuth 2.0 Client Credentials Flow, SOQL, Field History Tracking, NFC/RFID), not empty. First-pass wording, same "flag if exact copy is wanted instead" pattern used throughout this project — these are factual/technical explanations, not personal narrative, so drafting them doesn't require Robin's own voice the way resume or origin-story content does.
- **Bug-log entries are adapted, not copy-pasted, from their Sreditor source files.** The Sreditor entries in `docs/sreditor/` are written for future-Claude/future-Robin (internal, technical, includes things like exact time-invested estimates); a Dev Log entry is written for an external reader (a developer or interviewer) and should read as a genuine engineering story, not an internal audit trail repurposed verbatim.
- **The testing-rig entry is written now, not deferred further** — `add-automated-test-suites` archived immediately before this change, so `docs/testing.md`'s "honest current state" is now genuinely accurate to describe publicly, closing the gap that motivated deferring this specific lightbulb until testing was real.

## Risks / Trade-offs

- [Single-page structure could get long/unwieldy if the bug-log category grows a lot] → acceptable now; explicitly flagged as the trigger condition for promoting to per-entry routes later, not an oversight.
- [Backfilling `docs/metrics.json` from already-published `docs/metrics.md` numbers could introduce a transcription error] → mitigated by cross-checking each backfilled entry against its corresponding `docs/metrics.md` table directly, not re-deriving the numbers from scratch.
- [Static, build-time-only dashboard data means it won't update until the next deploy after a new snapshot] → acceptable; snapshots only happen at archive checkpoints, and archiving a change is already followed by normal git activity that triggers a Vercel rebuild anyway — no separate mechanism needed.

## Migration Plan

1. Build the glossary section with its 5 starter terms.
2. Adapt `docs/testing.md` into a public-facing Testing & Verification entry.
3. Create `docs/metrics.json`, backfill all five existing snapshots, build the dashboard component reading from it.
4. Adapt both Sreditor entries (Cosmos throughput, Flex Consumption zero-functions) into public-facing bug-log entries.
5. Add the local `HamburgerMenu` linking to all four sections.
6. Update the `site-navigation` requirement for Dev Log.

## Open Questions

- Exact wording for the glossary's 5 starter definitions and both bug-log entries' public-facing prose — first-pass draft acceptable, flag if Robin wants to review before it's final.
- At what entry count does the bug-log category actually justify per-entry routes? Not decided now — revisit when it comes up, not preemptively.

## 1. Glossary section

- [x] 1.1 Build the Glossary section on `/dev-log` with 5 starter entries: Twilio, OAuth 2.0 Client Credentials Flow, SOQL, Field History Tracking, NFC/RFID — each a short Q&A-style plain-language explanation, not assuming prior technical background. First-pass wording; flag if exact copy is wanted instead of drafting it yourself.
- [x] 1.2 Structure the section so more entries can be added later without restructuring (a simple growing list, matching the `docs/lightbulbs/` "just add another entry" spirit)

## 2. Testing & Verification entry

- [x] 2.1 Adapt `docs/testing.md`'s content into a public-facing Testing & Verification section — real suites (Vitest, Playwright, pytest, `node:test`), what each covers, and an explicit, honest statement that there's still no CI pipeline. Write for an external reader (developer/interviewer), not as an internal reference doc copied verbatim.
- [x] 2.2 Do not overclaim automation that doesn't exist — match `docs/testing.md`'s own honest tone

## 3. Metrics dashboard

- [x] 3.1 Create `docs/metrics.json` — one structured entry per snapshot (date, archived change name, headline numbers: files/lines/code/complexity, DRYness %) — and backfill all five snapshots already logged in `docs/metrics.md`, cross-checking each backfilled entry against its corresponding table directly rather than re-deriving numbers
- [x] 3.2 Add this repo's own `CLAUDE.md` "Code metrics — scc" convention note: future snapshots get appended to `docs/metrics.json` alongside `docs/metrics.md`, at the same archive checkpoint
- [x] 3.3 Build the Metrics dashboard component on `/dev-log`, reading `docs/metrics.json` at build time (static data, no runtime API) — a chart or tally showing code volume/complexity/DRYness trend over time
- [x] 3.4 Confirm the displayed data matches `docs/metrics.md`'s actual logged numbers exactly, not placeholder/illustrative data

## 4. Bug-log entries

- [x] 4.1 Adapt `docs/sreditor/2026/2026-07-10-cosmos-db-dedicated-vs-shared-throughput.md` into a public-facing bug-log entry — the real bug, the underlying concept (RU/s as a request-rate currency, shared vs. dedicated throughput), written for a developer reader, not copied verbatim from the internal Sreditor format
- [x] 4.2 Adapt `docs/sreditor/2026/2026-07-10-flex-consumption-silent-zero-functions.md` into a second public-facing bug-log entry, same treatment
- [x] 4.3 Structure the section so more entries can be added later without restructuring

## 5. Local navigation

- [x] 5.1 Add a local `HamburgerMenu` beside the "$ Dev Log" heading, linking to all four sections (Glossary, Testing & Verification, Metrics, and the bug-log entries section)
- [x] 5.2 Update `openspec/specs/site-navigation/spec.md`'s Dev Log requirement per this change's delta

## 6. Verification

- [x] 6.1 Confirm all four sections render correctly and the local menu links to each
- [x] 6.2 Confirm the Metrics dashboard's displayed numbers match `docs/metrics.md` exactly
- [x] 6.3 Confirm both bug-log entries read as genuine developer-facing writeups, not internal-audit-note copies
- [x] 6.4 `npm run build` clean, no console warnings
- [x] 6.5 Write representative test coverage for anything new that has real logic (e.g. the metrics data loading/parsing), per this repo's "tests ship with the feature" convention
- [x] 6.6 Run `scc --dryness web/src api pieces` and log the snapshot to `docs/metrics.md` **and** append the same snapshot to `docs/metrics.json` before archiving this change

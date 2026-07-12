# Code metrics

Running `scc` (Sloc Cloc and Code) snapshots, taken right before archiving each OpenSpec change — same checkpoint as the drift audit. Tracks code volume, complexity, and redundancy (DRYness = `ULOC / SLOC`) over time, so duplication growth is visible early and a refactor has an explicit before/after target instead of a vibe. See `CLAUDE.md`'s "Code metrics — scc" section for the convention, `docs/stack.md` for how the binary was obtained.

As of the `dev-log-content` change, every snapshot logged here also gets appended to `web/src/data/metrics.json` — a structured mirror of the same numbers that `/dev-log`'s Metrics section imports directly at build time (moved there from `docs/metrics.json` by the `sreditor-page-content` change, so the read is a normal bundler-resolved import inside `web/` rather than a filesystem read reaching outside Vercel's configured project root). This file (`docs/metrics.md`) stays the authoritative human-readable narrative; the JSON file is a display-only copy, always kept in sync with it.

Command: `scc --dryness --exclude-dir .git,.hg,.svn,node_modules,.venv,raw web/src api pieces` (run from repo root) — `pieces` covers every promoted portfolio-piece backend as one argument, no per-piece updates needed here as new ones get added. The explicit `--exclude-dir` became necessary as of the `farpost-pulse-build` snapshot: scc's `.gitignore`-based exclusion (its documented default behavior) didn't reliably keep `pieces/<piece>/node_modules` out of the scan when `pieces` was passed as a scan-root argument, even though the repo-root `.gitignore` already covers `node_modules/` — scc's own `--exclude-dir` default list is only `.git,.hg,.svn`, nothing project-specific. Confirmed by running `scc pieces` alone first and seeing ~4,500 files (clearly vendored `@azure/*` package content, not this piece's ~15 source files) before adding the explicit exclusion. The same failure mode recurred as of the `farpost-atlas-build` snapshot: `pieces/farpost-atlas-geo/data/raw/` (the ~200MB gitignored StatCan source shapefile/CSV used for one-time boundary ingestion, see that piece's `README.md`) leaked into the scan despite being gitignored, inflating the count by a 63,405-line CSV and an 833-line XML sidecar file — caught by the same "check the file/line count before trusting the number" habit, fixed by adding `raw` to `--exclude-dir`.

## Snapshots

### 2026-07-10 — baseline (after archiving `project-navigation-restructure`)

| Language | Files | Lines | Code | Complexity |
|---|---|---|---|---|
| TypeScript | 27 | 2,732 | 2,574 | 198 |
| Python | 8 | 1,231 | 1,016 | 116 |
| CSS | 1 | 24 | 21 | 0 |
| **Total** | **37** | **3,992** | **3,616** | **314** |

ULOC: 2,575 · **DRYness: 65%** (scc's "healthy balance of logic and structural ceremony" band)

First snapshot — no prior baseline to diff against.

### 2026-07-10 — after archiving `method-narrative-navigation`

| Language | Files | Lines | Code | Complexity |
|---|---|---|---|---|
| TypeScript | 29 | 2,822 | 2,656 | 201 |
| Python | 8 | 1,231 | 1,016 | 116 |
| CSS | 1 | 24 | 21 | 0 |
| Plain Text | 1 | 5 | 5 | 0 |
| **Total** | **39** | **4,082** | **3,698** | **317** |

ULOC: 2,599 · **DRYness: 64%**

Delta vs. baseline: +2 files, +82 code lines, +3 complexity, DRYness essentially flat (65% → 64%, within noise) — consistent with a routing/index-page restructure (new small index/placeholder pages, content moved not duplicated) rather than new logic. The new "Plain Text" line is `api/requirements.txt`, which scc wasn't counting in the prior snapshot (unrelated to this change) — not new code.

### 2026-07-10 — after archiving `farpost-pulse-build`

First snapshot to include `pieces/` — `pieces/farpost-pulse-func/`'s Node.js source shows up as a new JavaScript row for the first time.

| Language | Files | Lines | Code | Complexity |
|---|---|---|---|---|
| TypeScript | 37 | 3,603 | 3,378 | 249 |
| JavaScript | 12 | 865 | 710 | 56 |
| Python | 8 | 1,231 | 1,016 | 116 |
| JSON | 2 | 34 | 34 | 0 |
| CSS | 1 | 24 | 21 | 0 |
| Markdown | 1 | 40 | 31 | 0 |
| Plain Text | 1 | 5 | 5 | 0 |
| **Total** | **62** | **5,802** | **5,195** | **421** |

ULOC: 3,622 · **DRYness: 62%**

Delta vs. previous: +23 files, +1,497 code lines, +104 complexity, DRYness down slightly (64% → 62%, still within scc's "healthy" band). Almost entirely new surface area, not duplication: the three new Farpost Pulse frontend routes plus their shared components (`api.ts`, `TrendChart.tsx`, `BarChart.tsx`, `TechRoster.tsx`, `TechDetail.tsx`, `DashboardContent.tsx`) account for the TypeScript growth; the entire JavaScript row is new — `pieces/farpost-pulse-func/`'s 4 Function handlers, 4 shared `lib/` modules, and 4 `scripts/` files (the seed generator plus its two no-live-Cosmos-needed verification scripts). The `scripts/` files never ship to Azure (excluded via `.funcignore`), but `scc` counts real `.js` files in the repo regardless of deploy-time exclusion.

### 2026-07-10 — after archiving `project-page-parent-links`

| Language | Files | Lines | Code | Complexity |
|---|---|---|---|---|
| TypeScript | 37 | 3,612 | 3,387 | 249 |
| JavaScript | 12 | 868 | 713 | 56 |
| Python | 8 | 1,231 | 1,016 | 116 |
| JSON | 3 | 47 | 47 | 0 |
| CSS | 1 | 24 | 21 | 0 |
| Markdown | 1 | 40 | 31 | 0 |
| Plain Text | 1 | 5 | 5 | 0 |
| **Total** | **63** | **5,827** | **5,220** | **421** |

ULOC: 3,640 · **DRYness: 62%**

Delta vs. previous: essentially flat (+1 file, +25 code lines, complexity unchanged) — exactly what a two-line "Narrative" link added to two existing link arrays should look like. No trip-wire concern.

### 2026-07-11 — after archiving `add-automated-test-suites`

First snapshot to include real test files — new Python (`api/tests/`) and TypeScript (`web/src/**/__tests__/`) rows for the first time. Note: `vitest.config.ts`, `playwright.config.ts`, and everything under `web/e2e/` live outside `web/src`, so per this project's documented `scc` scan root (`web/src`, `api`, `pieces` — a project's own source, not root-level tooling config) they're real, committed files but don't show up in this count at all; only the two `__tests__/*.test.ts` files under `web/src` do.

| Language | Files | Lines | Code | Complexity |
|---|---|---|---|---|
| TypeScript | 39 | 3,725 | 3,484 | 251 |
| JavaScript | 12 | 892 | 731 | 52 |
| Python | 11 | 1,435 | 1,163 | 125 |
| JSON | 3 | 46 | 46 | 0 |
| CSS | 1 | 24 | 21 | 0 |
| Markdown | 1 | 44 | 34 | 0 |
| Plain Text | 2 | 7 | 7 | 0 |
| TOML | 1 | 3 | 3 | 0 |
| **Total** | **70** | **6,176** | **5,489** | **428** |

ULOC: 3,828 · **DRYness: 62%**

Delta vs. previous: +7 files, +269 code lines, +7 complexity, DRYness flat (62% → 62%) — **a real, expected code-volume increase, not a duplication signal.** Per this change's own tasks.md, this is exactly what should happen: `api/tests/conftest.py` + 2 test files (+3 Python files, matching the file delta exactly), 2 new `__tests__/*.test.ts` files under `web/src`, and `api/pyproject.toml` (new TOML row) and `api/requirements-dev.txt` (new second Plain Text file) for the dev-dependency split. `pieces/farpost-pulse-func/`'s JavaScript row stayed at 12 files (2 ad-hoc `scripts/{checkSeedShape,testHandlers}.js` removed, 2 real `test/*.test.js` files added in their place) with only a small line-count increase — consistent with "closer to a reformat than new work," per design.md. DRYness holding flat despite the volume increase means test files are genuinely new logic (assertions against real code paths), not copy-pasted boilerplate.

### 2026-07-11 — after archiving `dev-log-content`

All six new/changed files are TypeScript — `/dev-log` replaced its placeholder with real content (Glossary, Testing & Verification, Metrics dashboard, Bug Log), plus the `parseMetricsSnapshots` unit test this change's own tasks.md called for.

| Language | Files | Lines | Code | Complexity |
|---|---|---|---|---|
| TypeScript | 45 | 4,211 | 3,919 | 275 |
| JavaScript | 12 | 892 | 731 | 52 |
| Python | 11 | 1,435 | 1,163 | 125 |
| JSON | 3 | 46 | 46 | 0 |
| CSS | 1 | 24 | 21 | 0 |
| Markdown | 1 | 44 | 34 | 0 |
| Plain Text | 2 | 7 | 7 | 0 |
| TOML | 1 | 3 | 3 | 0 |
| **Total** | **76** | **6,662** | **5,924** | **452** |

ULOC: 4,112 · **DRYness: 62%**

Delta vs. previous: +6 files, +435 code lines, +24 complexity, DRYness flat (62% → 62%). All six new TypeScript files live under `web/src/components/dev-log/` (`glossary.ts`, `bugLog.ts`, `metrics.ts`, `MetricsTrendChart.tsx`, `MetricsDashboard.tsx`, and `__tests__/metrics.test.ts`) plus a significantly-grown `web/src/app/dev-log/page.tsx` (an existing file, so it doesn't add to the file count but accounts for real line growth). This is mostly genuine new content (glossary/bug-log prose, dashboard markup) rather than logic, which is consistent with DRYness holding exactly flat rather than moving in either direction — content-heavy pages read as "more code" to `scc` without changing the ratio of unique to duplicated logic underneath.

### 2026-07-11 — after archiving `sreditor-page-content`

`/method/sreditor` was rewritten in place from its placeholder to real content, and `web/src/app/method/page.tsx`'s Sreditor entry got an updated teaser and tags — no new files from that work. But this same commit (`c2ce224`) also relocated `docs/metrics.json` to `web/src/data/metrics.json`, which brought it inside this scan's scope for the first time, so the file count does move: +1.

| Language | Files | Lines | Code | Complexity |
|---|---|---|---|---|
| TypeScript | 45 | 4,487 | 4,191 | 283 |
| JavaScript | 12 | 892 | 731 | 52 |
| Python | 11 | 1,435 | 1,163 | 125 |
| JSON | 4 | 132 | 132 | 0 |
| CSS | 1 | 24 | 21 | 0 |
| Markdown | 1 | 44 | 34 | 0 |
| Plain Text | 2 | 7 | 7 | 0 |
| TOML | 1 | 3 | 3 | 0 |
| **Total** | **77** | **7,024** | **6,282** | **460** |

ULOC: 4,369 · **DRYness: 62%**

Delta vs. previous: +1 file, +358 code lines, +8 complexity, DRYness flat (62% → 62%) — the one new file is `web/src/data/metrics.json` entering scope, not new page logic; the Sreditor page content itself contributed the usual growth with no new files or test surface.

**Correction (logged 2026-07-11, same day):** the snapshot originally logged here read 76 files / 6,948 lines / 6,203 code / 4,315 ULOC — captured before `web/src/data/metrics.json`'s relocation was reflected on disk. Complexity and DRYness % were unaffected and are unchanged from the original log. Caught during a drift audit that independently re-ran `scc` against the same commit; corrected numbers above. See `docs/issues.md` for the full finding.

### 2026-07-11 — after archiving `farpost-atlas-build`

First snapshot to include `pieces/farpost-atlas-geo/` — a whole new Python service (FastAPI, a real Shapely spatial index) plus its own pytest suite, and six new TypeScript files (the two Farpost Atlas routes, `AtlasMap`/`AtlasMapLoader`/`BuildingDetail` components, `api.ts`). Command's `--exclude-dir` gained `raw` this snapshot — see the note above the Command line.

| Language | Files | Lines | Code | Complexity |
|---|---|---|---|---|
| TypeScript | 51 | 5,086 | 4,742 | 312 |
| Python | 24 | 2,370 | 1,923 | 160 |
| JavaScript | 12 | 892 | 731 | 52 |
| JSON | 4 | 144 | 144 | 0 |
| Markdown | 2 | 98 | 72 | 0 |
| Plain Text | 5 | 21 | 21 | 0 |
| TOML | 2 | 7 | 7 | 0 |
| CSS | 1 | 24 | 21 | 0 |
| **Total** | **101** | **8,642** | **7,661** | **524** |

ULOC: 5,316 · **DRYness: 62%**

Delta vs. previous: +24 files, +1,379 code lines, +64 complexity, DRYness flat (62% → 62%). File count reconciles exactly against what was actually built: +13 Python files (`api/`'s existing 11 unchanged; `farpost-atlas-geo/`'s 7 `app/` modules + 2 `scripts/` + 4 `tests/` = 13, new), +6 TypeScript files, +3 Plain Text (`requirements{,-dev,-ingest}.txt`), +1 each of JSON/Markdown/TOML (the boundary GeoJSON, this piece's `README.md`, its `pyproject.toml`). Real new surface area — a genuinely separate deployable service and a real Leaflet map — not duplication.

**Correction (logged 2026-07-11, same day):** the snapshot originally logged here read 8,630 lines / 7,649 code / 5,307 ULOC / 61% DRYness — captured before this same entry's own append to `web/src/data/metrics.json` was reflected on disk (the JSON row's line count grew by exactly the 12 lines one new snapshot entry adds). File count and complexity were unaffected. Same underlying self-referential gap as the `sreditor-page-content` correction above, smaller here since it's growth within an existing file rather than a whole missing file — caught the same way, an independent `scc` re-run during drift audit. See `docs/issues.md` for the full finding.

### 2026-07-11 — after archiving `farpost-hub-nav-restructure`

The Method/Narrative restructure: two new small nav components (`FarpostTabBar`, `TechStacksBrowser` + its pure `filterProjects` helper and unit tests), a new Dispatch placeholder page, a new `/techstacks` index page — plus `web/src/app/method/page.tsx` and `web/src/app/narrative/page.tsx` deleted outright. Atlas, Pulse, Credential Flow, and Sreditor's own pages moved (not duplicated) to their new routes.

| Language | Files | Lines | Code | Complexity |
|---|---|---|---|---|
| TypeScript | 55 | 5,284 | 4,928 | 319 |
| Python | 24 | 2,370 | 1,923 | 160 |
| JavaScript | 12 | 892 | 731 | 52 |
| JSON | 4 | 144 | 144 | 0 |
| Markdown | 2 | 98 | 72 | 0 |
| Plain Text | 5 | 21 | 21 | 0 |
| TOML | 2 | 7 | 7 | 0 |
| CSS | 1 | 24 | 21 | 0 |
| **Total** | **105** | **8,840** | **7,847** | **531** |

ULOC: 5,466 · **DRYness: 62%**

Delta vs. previous: +4 files, +198 lines, +186 code lines, +7 complexity, DRYness flat (62% → 62%). File count reconciles exactly: +6 new TypeScript files (`FarpostTabBar.tsx`, `techstacks/filterProjects.ts` + its `__tests__` file, `TechStacksBrowser.tsx`, the new `farpost-dispatch/page.tsx`, the new `techstacks/page.tsx`) minus -2 deleted (`web/src/app/method/page.tsx`, `web/src/app/narrative/page.tsx`) = +4. No trip-wire concern — this was mostly a routing/content-relocation change (Atlas, Pulse, Credential Flow, and Sreditor's pages moved wholesale, not copied), plus a small amount of genuinely new nav-component logic, consistent with DRYness holding exactly flat.

### 2026-07-11 — after archiving `page-chrome-simplification`

Removed every local per-page `HamburgerMenu` call site sitewide (Farpost hub, Farpost Atlas, Farpost Pulse, Sreditor, Credential Flow, Tech/Stacks index, Dev Log) and stripped `SectionHeader`'s now-unused `id`/`scroll-mt-4` anchor mechanic everywhere it's used. Added a one-line Farpost intro blurb and made `Header.tsx` sticky at the `lg` breakpoint. No new or deleted files — pure edits to existing pages/components.

| Language | Files | Lines | Code | Complexity |
|---|---|---|---|---|
| TypeScript | 55 | 5,191 | 4,842 | 320 |
| Python | 24 | 2,370 | 1,923 | 160 |
| JavaScript | 12 | 892 | 731 | 52 |
| JSON | 4 | 156 | 156 | 0 |
| Markdown | 2 | 98 | 72 | 0 |
| Plain Text | 5 | 21 | 21 | 0 |
| TOML | 2 | 7 | 7 | 0 |
| CSS | 1 | 24 | 21 | 0 |
| **Total** | **105** | **8,759** | **7,773** | **532** |

ULOC: 5,438 · **DRYness: 62%**

Delta vs. previous: +0 files, -81 lines, -74 code lines, +1 complexity (noise), DRYness flat (62% → 62%). Expected shape for a chrome-removal change: deleting ~13 local-menu call sites plus their `SECTION_LINKS`/`id` props removed more code than the new Farpost blurb paragraph and Header's sticky className added back, netting a small decrease with zero file-count change. No trip-wire concern.

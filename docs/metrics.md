# Code metrics

Running `scc` (Sloc Cloc and Code) snapshots, taken right before archiving each OpenSpec change — same checkpoint as the drift audit. Tracks code volume, complexity, and redundancy (DRYness = `ULOC / SLOC`) over time, so duplication growth is visible early and a refactor has an explicit before/after target instead of a vibe. See `CLAUDE.md`'s "Code metrics — scc" section for the convention, `docs/stack.md` for how the binary was obtained.

As of the `dev-log-content` change, every snapshot logged here also gets appended to `web/src/data/metrics.json` — a structured mirror of the same numbers that `/dev-log`'s Metrics section imports directly at build time (moved there from `docs/metrics.json` by the `sreditor-page-content` change, so the read is a normal bundler-resolved import inside `web/` rather than a filesystem read reaching outside Vercel's configured project root). This file (`docs/metrics.md`) stays the authoritative human-readable narrative; the JSON file is a display-only copy, always kept in sync with it.

Command: `scc --dryness --exclude-dir .git,.hg,.svn,node_modules,.venv,raw --count-as cls:Apex web/src api pieces` (run from repo root) — `pieces` covers every promoted portfolio-piece backend as one argument, no per-piece updates needed here as new ones get added. The explicit `--exclude-dir` became necessary as of the `farpost-pulse-build` snapshot: scc's `.gitignore`-based exclusion (its documented default behavior) didn't reliably keep `pieces/<piece>/node_modules` out of the scan when `pieces` was passed as a scan-root argument, even though the repo-root `.gitignore` already covers `node_modules/` — scc's own `--exclude-dir` default list is only `.git,.hg,.svn`, nothing project-specific. Confirmed by running `scc pieces` alone first and seeing ~4,500 files (clearly vendored `@azure/*` package content, not this piece's ~15 source files) before adding the explicit exclusion. The same failure mode recurred as of the `farpost-atlas-build` snapshot: `pieces/farpost-atlas-geo/data/raw/` (the ~200MB gitignored StatCan source shapefile/CSV used for one-time boundary ingestion, see that piece's `README.md`) leaked into the scan despite being gitignored, inflating the count by a 63,405-line CSV and an 833-line XML sidecar file — caught by the same "check the file/line count before trusting the number" habit, fixed by adding `raw` to `--exclude-dir`. `--count-as cls:Apex` became necessary as of the `farpost-dispatch-build` snapshot, the first to contain real Apex: scc's default extension mapping treats `.cls` as legacy Visual Basic for Applications, not Apex (its own recognized Apex extensions are only `.apex`/`.trigger`) — without the override, 5 of 6 `.cls` files silently miscounted as VBA. Confirmed by running without the flag first and noticing a "Visual Basic for Applications" language row that has no business appearing in this codebase at all.

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

### 2026-07-12 — after archiving `farpost-dispatch-build`

First snapshot to include real Apex — `pieces/farpost-dispatch-sf/`, a Salesforce DX project (custom object/field metadata, three Apex service classes with their test classes, a Named Credential, a permission set, two Lightning Web Components) plus a rewritten `/farpost/farpost-dispatch` case-study page and a new Playwright spec for it. `--count-as cls:Apex` added to the standing command this snapshot — see the note above the Command line.

| Language | Files | Lines | Code | Complexity |
|---|---|---|---|---|
| TypeScript | 55 | 5,551 | 5,194 | 329 |
| Python | 24 | 2,370 | 1,923 | 160 |
| XML | 21 | 457 | 457 | 0 |
| JavaScript | 14 | 984 | 808 | 72 |
| Apex | 7 | 780 | 634 | 37 |
| JSON | 5 | 180 | 180 | 0 |
| Plain Text | 5 | 21 | 21 | 0 |
| Markdown | 3 | 176 | 137 | 0 |
| HTML | 2 | 84 | 77 | 0 |
| TOML | 2 | 7 | 7 | 0 |
| CSS | 1 | 24 | 21 | 0 |
| **Total** | **139** | **10,634** | **9,459** | **598** |

ULOC: 6,477 · **DRYness: 61%**

Delta vs. previous: +34 files, +1,875 lines, +1,686 code lines, +66 complexity, DRYness down slightly (62% → 61%, still well within scc's "healthy" band — not a trip-wire, neither the <55% threshold nor a >10-point single-step drop). File count reconciles exactly: +21 XML (4 Contact field + 7 Job__c object/field + 6 Apex class `-meta.xml` sidecars + 1 Named Credential + 1 permission set + 2 LWC `js-meta.xml`), +7 Apex (6 `.cls` + `scripts/apex/seed.apex`), +2 JavaScript (the two LWC `.js` files), +2 HTML (the two LWC templates), +1 JSON (`sfdx-project.json`), +1 Markdown (`pieces/farpost-dispatch-sf/README.md`) = +34. TypeScript's file count holds flat at 55 despite the case-study page rewrite and new e2e spec, since both are edits to/within an existing file and `web/e2e/` sits outside this scan's documented root, respectively — only line growth, no new TS files. Real new surface area (a genuinely separate Salesforce runtime, the fourth "Portfolio piece isolation" instance), not duplication; the 1-point DRYness dip is consistent with a first-of-its-kind metadata-heavy piece (XML/permission-set boilerplate reads as less "unique" than prose or application logic) rather than any copy-pasted logic.

**Verification note distinct from every prior snapshot:** none of this piece's Apex has been deployed or executed — there is no local Salesforce CLI/runtime in this build environment. The Apex/metadata contributing to the numbers above was reviewed for internal consistency (field references, picklist values, class/method signatures) but not run; `sf apex run test` against a real org is Robin's own next step (see `docs/deployment-guide.md` Part 8c).

### 2026-07-15 — after archiving `dev-log-code-showcase`

Added the Code Showcase section to `/dev-log` (10 real, verified Farpost code entries written from `docs/farpost-devlog-handoff-robinsamways.md`), a five-pill section-filter bar (`filterSections.ts` + its Vitest suite, `DevLogSectionFilter.tsx`), and relocated the shared `CodeBlock` component out of `components/ops/` into `web/src/components/`, updating `/ops/deploy`'s import. This snapshot was taken after appending its own entry to `web/src/data/metrics.json`, so — unlike the `sreditor-page-content` and `farpost-atlas-build` snapshots above — the numbers already account for that self-referential growth; no later correction should be needed.

| Language | Files | Lines | Code | Complexity |
|---|---|---|---|---|
| TypeScript | 60 | 6,241 | 5,862 | 332 |
| Python | 24 | 2,370 | 1,923 | 160 |
| XML | 21 | 458 | 458 | 0 |
| JavaScript | 14 | 984 | 808 | 72 |
| Apex | 7 | 780 | 634 | 37 |
| JSON | 5 | 204 | 204 | 0 |
| Plain Text | 5 | 21 | 21 | 0 |
| Markdown | 3 | 185 | 146 | 0 |
| HTML | 2 | 84 | 77 | 0 |
| TOML | 2 | 7 | 7 | 0 |
| CSS | 1 | 24 | 21 | 0 |
| **Total** | **144** | **11,358** | **10,161** | **601** |

ULOC: 6,904 · **DRYness: 61%**

Delta vs. previous: +5 files, +724 lines, +702 code lines, +3 complexity, DRYness flat (61% → 61%). File count reconciles exactly: +5 new TypeScript files under `web/src/components/dev-log/` (`codeShowcase.ts`, `CodeShowcaseSection.tsx`, `filterSections.ts` + its `__tests__/filterSections.test.ts`, `DevLogSectionFilter.tsx`). The `CodeBlock` relocation is a pure move — `components/ops/CodeBlock.tsx` deleted, `components/CodeBlock.tsx` added — netting zero file-count change. The new `web/e2e/dev-log-section-filter.spec.ts` doesn't show up here, same as every prior e2e spec, since `web/e2e/` sits outside this scan's documented root. DRYness holding exactly flat despite a real content-and-logic increase (ten genuinely distinct Python code excerpts and their own framing prose, plus a small new pure-function/component pair mirroring an existing pattern) is consistent with this being real new material, not duplicated boilerplate.

Naming note worth recording here since it came up during this change: `CodeShowcase.tsx` (task 3.1's suggested component name) collides with `codeShowcase.ts` (task 2.2's data module) on a case-insensitive filesystem (Windows, default macOS) — the build's type checker resolved the import to the wrong file. Renamed the component to `CodeShowcaseSection.tsx` to avoid the same-name-different-case collision, mirroring the existing `metrics.ts` / `MetricsDashboard.tsx` naming split rather than `bugLog.ts`'s inline-in-page pattern.

### 2026-07-15 — after archiving `farpost-section-filter`

Relocated `filterSections.ts` and renamed/relocated `DevLogSectionFilter.tsx` to `SectionFilterBar.tsx` (with a new `ariaLabel` prop) out of `components/dev-log/` into a shared `web/src/components/` path, added `/farpost`'s own section-filter bar (four sections: Origin Story, Problems It Solves, Lifecycle Example, Process), and extracted a shared presentational `PillBar.tsx` now rendered by both `TechStacksBrowser.tsx` and `SectionFilterBar.tsx`. Also added `/techstacks`' first-ever e2e spec. This snapshot was taken after appending its own entry to `web/src/data/metrics.json`, same self-referential-growth handling as the prior snapshot.

| Language | Files | Lines | Code | Complexity |
|---|---|---|---|---|
| TypeScript | 61 | 6,287 | 5,909 | 332 |
| Python | 24 | 2,370 | 1,923 | 160 |
| XML | 21 | 458 | 458 | 0 |
| JavaScript | 14 | 984 | 808 | 72 |
| Apex | 7 | 780 | 634 | 37 |
| JSON | 5 | 216 | 216 | 0 |
| Plain Text | 5 | 21 | 21 | 0 |
| Markdown | 3 | 185 | 146 | 0 |
| HTML | 2 | 84 | 77 | 0 |
| TOML | 2 | 7 | 7 | 0 |
| CSS | 1 | 24 | 21 | 0 |
| **Total** | **145** | **11,416** | **10,220** | **601** |

ULOC: 6,932 · **DRYness: 61%**

Delta vs. previous: +1 file, +58 lines, +59 code lines, +0 complexity, DRYness flat (61% → 61%). File count reconciles exactly: `PillBar.tsx` is the only genuinely new file (+1) — `filterSections.ts`/`filterSections.test.ts` moved (not duplicated), `DevLogSectionFilter.tsx` was renamed in place to `SectionFilterBar.tsx`, and `TechStacksBrowser.tsx`/`farpost/page.tsx` were edited, not added. The two new e2e specs (`farpost-section-filter.spec.ts`, `techstacks-pill-filter.spec.ts`) don't show up here, same as every prior e2e spec, since `web/e2e/` sits outside this scan's documented root. DRYness holding exactly flat is the expected signal for this change specifically — its whole point was *removing* duplication (the byte-for-byte-identical pill row markup between `TechStacksBrowser` and the dev-log filter component) while adding a small, genuinely new amount of content (Farpost's own filter bar wiring); the two roughly offset.

### 2026-07-15 — after archiving `site-theme-toggle`

Added a site-wide light/dark theme toggle: a new `.dark` CSS override block in `globals.css` (the first change to that file since its five color tokens were established), a blocking FOUC-avoidance script in `layout.tsx`, and a new `ThemeToggle.tsx` (`lucide-react`'s `Lightbulb`, this site's first icon-library dependency) rendered below `MenuToggle` in `Header.tsx`, backed by a pure `theme.ts` + its own Vitest suite. This snapshot was taken after appending its own entry to `web/src/data/metrics.json`, same self-referential-growth handling as every snapshot since `dev-log-code-showcase`.

| Language | Files | Lines | Code | Complexity |
|---|---|---|---|---|
| TypeScript | 64 | 6,388 | 5,997 | 339 |
| Python | 24 | 2,370 | 1,923 | 160 |
| XML | 21 | 458 | 458 | 0 |
| JavaScript | 14 | 984 | 808 | 72 |
| Apex | 7 | 780 | 634 | 37 |
| JSON | 5 | 228 | 228 | 0 |
| Plain Text | 5 | 21 | 21 | 0 |
| Markdown | 3 | 185 | 146 | 0 |
| HTML | 2 | 84 | 77 | 0 |
| TOML | 2 | 7 | 7 | 0 |
| CSS | 1 | 32 | 28 | 0 |
| **Total** | **148** | **11,537** | **10,327** | **608** |

ULOC: 7,012 · **DRYness: 61%**

Delta vs. previous: +3 files, +121 lines, +107 code lines, +7 complexity, DRYness flat (61% → 61%). File count reconciles exactly: `theme.ts`, `theme.test.ts`, and `ThemeToggle.tsx` are the three new TypeScript files — `globals.css` and `Header.tsx`/`layout.tsx` were edited in place, not added, and `lucide-react` itself is a `node_modules` dependency, not source this scan counts. The new `web/e2e/theme-toggle.spec.ts` doesn't show up here, same as every prior e2e spec. DRYness holding exactly flat is consistent with this change's own shape — a handful of small, genuinely new files (a pure resolver function, its test, one client component) plus a five-line CSS block, no duplicated logic.

### 2026-07-15 — after archiving `page-feedback`

Extracted `contact.py`'s private rate-limiter and Resend-sending logic into shared `rate_limit.py`/`notify.py` (`contact.py` now calls both instead of its own copies, behavior unchanged — confirmed via the full `pytest` suite), then added a site-wide feedback widget: a new `FeedbackSubmission` table, `POST /feedback` (its own separate rate-limit bucket), and `FeedbackWidget.tsx` rendered once from `layout.tsx` after `{children}`, self-excluding on `/`, backed by a pure `feedback.ts` helper + its Vitest suite. This snapshot was taken after appending its own entry to `web/src/data/metrics.json`, same self-referential-growth handling as every snapshot since `dev-log-code-showcase`.

| Language | Files | Lines | Code | Complexity |
|---|---|---|---|---|
| TypeScript | 67 | 6,546 | 6,135 | 359 |
| Python | 28 | 2,635 | 2,144 | 173 |
| XML | 21 | 458 | 458 | 0 |
| JavaScript | 14 | 984 | 808 | 72 |
| Apex | 7 | 780 | 634 | 37 |
| JSON | 5 | 240 | 240 | 0 |
| Plain Text | 5 | 21 | 21 | 0 |
| Markdown | 3 | 185 | 146 | 0 |
| HTML | 2 | 84 | 77 | 0 |
| TOML | 2 | 7 | 7 | 0 |
| CSS | 1 | 32 | 28 | 0 |
| **Total** | **155** | **11,972** | **10,698** | **641** |

ULOC: 7,233 · **DRYness: 60%**

Delta vs. previous: +7 files, +435 lines, +371 code lines, +33 complexity, DRYness down 1 point (61% → 60%) — still well inside scc's "healthy" band, not a trip-wire (neither below 55% nor a >10-point single-step drop). File count reconciles exactly: +3 TypeScript (`feedback.ts`, `feedback.test.ts`, `FeedbackWidget.tsx`) and +4 Python (`rate_limit.py`, `notify.py`, `feedback.py`, `tests/test_feedback.py`) = +7; `contact.py`/`models.py`/`main.py`/`layout.tsx` were edited in place, not added. The new `web/e2e/feedback-widget.spec.ts` doesn't show up here, same as every prior e2e spec. The 1-point dip is consistent with this change's own shape: `feedback.py` and `contact.py` now share near-identical request-handling scaffolding (honeypot/fill-time check, rate-limit call, persist-then-notify) by necessity — mirroring the same pattern, not literally duplicating it — which reads as slightly less "unique" to `scc` than the net-new logic in prior snapshots.

### 2026-07-15 — after archiving `services-page`

Added a new `/services` route — six sections (Web Sites, Web Applications, Native Applications, Platform, Hourly, Field Documentation) behind the exact `SectionFilterBar`/`PillBar`/`filterSections` stack already built for `/dev-log` and `/farpost`, no new filter infrastructure — plus a "Services" entry in the hamburger menu. This snapshot was taken after appending its own entry to `web/src/data/metrics.json`, same self-referential-growth handling as every snapshot since `dev-log-code-showcase`.

| Language | Files | Lines | Code | Complexity |
|---|---|---|---|---|
| TypeScript | 68 | 6,767 | 6,352 | 362 |
| Python | 28 | 2,635 | 2,144 | 173 |
| XML | 21 | 458 | 458 | 0 |
| JavaScript | 14 | 984 | 808 | 72 |
| Apex | 7 | 780 | 634 | 37 |
| JSON | 5 | 252 | 252 | 0 |
| Plain Text | 5 | 21 | 21 | 0 |
| Markdown | 3 | 185 | 146 | 0 |
| HTML | 2 | 84 | 77 | 0 |
| TOML | 2 | 7 | 7 | 0 |
| CSS | 1 | 32 | 28 | 0 |
| **Total** | **156** | **12,205** | **10,927** | **644** |

ULOC: 7,334 · **DRYness: 60%**

Delta vs. previous: +1 file, +233 lines, +229 code lines, +3 complexity, DRYness flat (60% → 60%). File count reconciles exactly: `web/src/app/services/page.tsx` is the only new file — `MenuToggle.tsx` was edited in place, not added, and the two e2e specs (`services-section-filter.spec.ts`, plus the one-line addition to `global-navigation.spec.ts`) don't show up here, same as every prior e2e spec. This is almost entirely new prose content wrapped in already-tested, reused infrastructure — no new logic — consistent with DRYness holding exactly flat.

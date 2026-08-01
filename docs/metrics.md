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

### 2026-07-24 — after archiving `site-drawer-nav`

Replaced the header's hamburger dropdown and stacked light/dark toggle with a real, site-wide `DrawerNav`/`RightRail` (sticky rail on desktop, sliding drawer with backdrop on mobile), grouped nav (Site/Work/Writing/Ops, surfacing `/ops/deploy` for the first time), and `Header.tsx` simplified and re-pinned at its own natural scroll offset. `HamburgerMenu.tsx`/`MenuToggle.tsx`/old `ThemeToggle.tsx` retired.

**Honest scope note on this snapshot, unlike prior ones:** `scc` scans the filesystem, not git status, so this count also includes same-session exploratory work still sitting uncommitted alongside the shipped change — most notably the isolated `/prototype/homepage-drawer` mock (`web/src/components/prototype/*`, five theme sketches, the component-museum demo section) that the real `site-drawer-nav` implementation was designed from but doesn't depend on or share code with. The delta below is not attributable to `site-drawer-nav` alone.

| Language | Files | Lines | Code | Complexity |
|---|---|---|---|---|
| TypeScript | 82 | 7,908 | 7,328 | 406 |
| Python | 28 | 2,635 | 2,144 | 173 |
| XML | 21 | 458 | 458 | 0 |
| JavaScript | 14 | 984 | 808 | 72 |
| Apex | 7 | 780 | 634 | 37 |
| JSON | 5 | 252 | 252 | 0 |
| Plain Text | 5 | 21 | 21 | 0 |
| Markdown | 3 | 185 | 146 | 0 |
| CSS | 2 | 60 | 47 | 0 |
| HTML | 2 | 84 | 77 | 0 |
| TOML | 2 | 7 | 7 | 0 |
| **Total** | **171** | **13,374** | **11,922** | **688** |

ULOC: 7,945 · **DRYness: 59%**

Delta vs. previous: +15 files, +1,169 lines, +995 code lines, +44 complexity, DRYness dipped 1 point (60% → 59%) — still comfortably inside the healthy band, no `docs/issues.md` entry warranted. The dip and most of the file/line growth trace to the mock (five parallel theme-token tables, several small never-reused-elsewhere components) rather than the real shipped nav, which mostly replaced existing components 1:1.

### 2026-07-24 — after archiving `left-nav-restructure`

Restructured the left nav from a flat link list into a recursive collapsible tree (up to 3 levels deep): Work gained Farpost and Vocare submenus, each with six new project-record pages (Build Plan, Feature List, Tech Stack, Upgrade Path, Current Metrics, Outlook), backed by two new per-silo status-data files (`farpost-status.json`, `vocare-status.json`) so the fast-changing pages update via a data-file edit rather than a prose rewrite. Writing's Dev Log split from one pill-filtered page into a hub plus six real routes, with Code Showcase going a level deeper still into one route per article (each carrying a UTC timestamp alongside its Eastern-time equivalent). Added a public Lightbulbs page surfacing `docs/lightbulbs/` for the first time, reframed the Glossary as a communication-skill demonstration, and renamed Tech/Stacks to Experiments. Also fixed several things Robin found during review: a desktop header-content bleed-through bug (the mobile-only content mask needed a desktop equivalent scoped to just the content column, not the sidebars), the center content column not expanding to use available width below the `xl` breakpoint, the header photo moved to the left of its text, and the default browser scrollbar replaced with one closer to the background color.

| Language | Files | Lines | Code | Complexity |
|---|---|---|---|---|
| TypeScript | 113 | 9,427 | 8,689 | 469 |
| Python | 28 | 2,635 | 2,144 | 173 |
| XML | 21 | 458 | 458 | 0 |
| JavaScript | 14 | 984 | 808 | 72 |
| Apex | 7 | 780 | 634 | 37 |
| JSON | 7 | 366 | 366 | 0 |
| Plain Text | 5 | 21 | 21 | 0 |
| Markdown | 3 | 185 | 146 | 0 |
| CSS | 2 | 88 | 65 | 0 |
| HTML | 2 | 84 | 77 | 0 |
| TOML | 2 | 7 | 7 | 0 |
| **Total** | **204** | **15,035** | **13,415** | **751** |

ULOC: 8,776 · **DRYness: 58%**

Delta vs. previous: +33 files, +1,661 lines, +1,493 code lines, +63 complexity, DRYness dipped 1 point (59% → 58%) — still comfortably inside the healthy band, no `docs/issues.md` entry warranted. File count reconciles with the shape of the work: +31 TypeScript files (twelve new project-record pages, the Farpost/Vocare shared `project-record/` components, six new Dev Log route files, the Code Showcase index/article routes plus a timestamp utility, the Lightbulbs page and data, the recursive `navTree.ts` nav-matching logic, and their accompanying unit tests) and +2 JSON (`farpost-status.json`, `vocare-status.json`); `CSS`'s single existing file (`globals.css`) grew by 28 lines for the new scrollbar styling, not a new file. Python/API were untouched this change. The 1-point dip is consistent with a large volume of genuinely new page content and a recursive nav component, not duplicated logic.

### 2026-07-25 — after archiving `services-payments`

Added the first accounts and first payment-collecting code in this codebase: a passwordless magic-link `account-auth` module (`api/app/accounts/` — `Account`/`SignInToken` models, an HMAC-signed stateless session token, request/verify routes), a Stripe billing module (`api/app/billing/` — `StripeGateway` wrapping every raw Stripe SDK call, `SubscriptionService`/`FulfillmentFeeService`, checkout/webhook/portal/fulfillment-fee routes, the two-tier cancellation/refund policy from `docs/core-billing-model.md`), a seventh `/services` section (Troubleshooting & Questions, $12/year, a real Subscribe control), and understated "quoted per project" / real-rate pricing copy on the other six sections. `/sign-in` and `SignInForm.tsx` were replaced wholesale (no more fake "isn't live yet" stub), and a new `/sign-in/verify` route completes the magic-link flow. 36 new pytest tests — real (if lightweight) SQLite-backed persistence tests for the `Account`/`SignInToken`/`Subscription`/`FulfillmentFee` lifecycle (the first tests in this codebase to exercise a real `select()` query — which caught two genuine latent bugs, see `docs/sreditor/2026/2026-07-25-stripe-annual-subscription-refund-assembly.md`), pure-function refund-math tests, and mocked-Stripe-SDK webhook-handler tests.

| Language | Files | Lines | Code | Complexity |
|---|---|---|---|---|
| TypeScript | 117 | 9,730 | 8,959 | 505 |
| Python | 42 | 4,085 | 3,303 | 265 |
| XML | 21 | 458 | 458 | 0 |
| JavaScript | 14 | 984 | 808 | 72 |
| Apex | 7 | 780 | 634 | 37 |
| JSON | 7 | 390 | 390 | 0 |
| Plain Text | 5 | 24 | 24 | 0 |
| Markdown | 3 | 185 | 146 | 0 |
| CSS | 2 | 88 | 65 | 0 |
| HTML | 2 | 84 | 77 | 0 |
| TOML | 2 | 8 | 8 | 0 |
| **Total** | **222** | **16,816** | **14,872** | **879** |

ULOC: 9,695 · **DRYness: 58%**

Delta vs. previous: +18 files, +1,781 lines, +1,457 code lines, +128 complexity, DRYness flat (58% → 58%). File count reconciles exactly with the new files added: 4 in `api/app/accounts/`, 6 in `api/app/billing/`, 4 new pytest files (`test_accounts.py`, `test_billing_models.py`, `test_billing_webhooks.py`, `test_refund.py`), and 4 in `web/src` (`components/session.ts`, `components/VerifySignIn.tsx`, `components/services/SubscribeControl.tsx`, `app/sign-in/verify/page.tsx`) — 4+6+4+4 = 18. DRYness holding exactly flat is consistent with this being almost entirely new, non-duplicative logic (a new account/billing domain, not a variation on existing patterns) rather than copy-pasted code. Numbers already reflect this entry's own append to `web/src/data/metrics.json`.

### 2026-07-25 — after archiving `page-outline-nav`

Added the "on this page" outline flyout: `PageOutline.tsx` (client-side DOM scan of `main h2[id]` on mount and route change, `IntersectionObserver`-driven active-section highlighting, Escape/backdrop/close-button dismissal matching `SetupGallery`'s existing modal convention), and a `slugify`/`resolveUniqueSlug` utility giving every `SectionHeader` a stable, same-page-collision-safe anchor `id` for the first time (21 existing consumers, zero per-page opt-in required). `RightRail.tsx` was reorganized: the mobile top bar dropped to a single cog button, and the shared rail element gained a new Account icon and this change's outline trigger — final top-to-bottom order Account → Sign In → theme toggle → outline trigger. A minimal `/account` stub page ships as the Account icon's destination, an honest "not live yet" placeholder standing in for the real account hub captured at `docs/lightbulbs/rsw-lb-account-hub-private-chat.md`. 9 new Vitest tests (slug generation and collision suffixing) and 8 new Playwright e2e tests (trigger visibility at the 0/1/2+ section boundary, ordered listing, click-to-scroll-and-close, all three dismissal methods, active-section highlighting).

| Language | Files | Lines | Code | Complexity |
|---|---|---|---|---|
| TypeScript | 122 | 9,977 | 9,141 | 524 |
| Python | 42 | 4,087 | 3,305 | 265 |
| XML | 21 | 458 | 458 | 0 |
| JavaScript | 14 | 984 | 808 | 72 |
| Apex | 7 | 780 | 634 | 37 |
| JSON | 7 | 402 | 402 | 0 |
| Plain Text | 5 | 24 | 24 | 0 |
| Markdown | 3 | 185 | 146 | 0 |
| CSS | 2 | 88 | 65 | 0 |
| HTML | 2 | 84 | 77 | 0 |
| TOML | 2 | 8 | 8 | 0 |
| **Total** | **227** | **17,077** | **15,068** | **898** |

ULOC: 9,864 · **DRYness: 58%**

Delta vs. previous: +5 files, +261 lines, +196 code lines, +19 complexity, DRYness flat (58% → 58%). File count reconciles exactly: `PageOutline.tsx`, `slugify.ts`, `slugify.test.ts`, `page-outline.spec.ts`, and `app/account/page.tsx` — 5 new files, nothing else added or removed. `SectionHeader.tsx`'s own edit (the new `id` + `cache()` registry) was in-place, not a new file. DRYness holding exactly flat matches a small, genuinely new, non-duplicative feature — no copy-pasted logic. Numbers already reflect this entry's own append to `web/src/data/metrics.json`.

### Correction — the `page-outline-nav` snapshot above undercounted by 1 file

Caught independently while preparing the next snapshot (`site-settings-page`), the same way the `sreditor-page-content` and `farpost-atlas-build` corrections earlier in this log were: re-ran `scc --dryness --exclude-dir .git,.hg,.svn,node_modules,.venv,raw --count-as cls:Apex web/src api pieces` against the exact commit the `page-outline-nav` snapshot above was supposed to reflect (via a clean `git stash -u`, not a guess) and got **228 files / 17,173 lines / 15,128 code / 906 complexity / 10,030 ULOC**, not the 227 / 17,077 / 15,068 / 898 / 9,864 logged above. DRYness happened to round to the same 58% either way; every other figure is off by a small, uniform amount consistent with exactly one missed file, not a scan-scope error. Root cause not tracked down (that session's own working tree no longer exists to diff against). Logged here as a correction, not an edit to the entry above, per this project's own established convention for this exact mistake. `site-settings-page`'s own delta below is computed against this corrected baseline, not the stale 227.

### 2026-07-25 — after archiving `site-settings-page`

Built a real `/settings` page — Theme, Font Size, and Reduced Motion as three `SectionHeader` sections, replacing the earlier stub — and moved the theme toggle out of `RightRail.tsx` entirely (rail order now Settings → Account → Sign In → outline trigger, no toggle). New `fontScale.ts`/`reducedMotion.ts` utilities mirror `theme.ts`'s exact storage-key-plus-pure-resolve-function shape; a new `SettingsBootstrap.tsx`, mounted once in the root layout, applies all three persisted settings on every page load, replacing `RightRail.tsx`'s own theme-only bootstrap effect entirely (D2). Reduced motion actually gates the site's two real animated elements rather than shipping as an inert flag: `RightRail`'s slide transition is suppressed via a scoped CSS rule keyed off a `.reduce-motion` class on `<html>` (deliberately not a JS-conditional className — flagged as a design deviation from the task's literal wording, functionally equivalent and more robust against the cross-component-reactivity gap a JS-state approach would have had), and `PageOutline`'s `scrollIntoView` reads the resolved preference fresh at the moment of each click (an explicit JS `behavior` option can't be overridden by CSS, so this one case genuinely needs a JS-level check). `theme-toggle.spec.ts`'s three scenarios moved into a new `settings.spec.ts` (old file deleted, not left stale) targeting `/settings` instead of the now-removed rail button, plus new font-size and reduced-motion coverage (12 tests total, including a `scrollIntoView` spy confirming the actual `behavior` argument passed, not just the stored preference value).

| Language | Files | Lines | Code | Complexity |
|---|---|---|---|---|
| TypeScript | 131 | 10,409 | 9,459 | 553 |
| Python | 42 | 4,087 | 3,305 | 265 |
| XML | 21 | 458 | 458 | 0 |
| JavaScript | 14 | 984 | 808 | 72 |
| Apex | 7 | 780 | 634 | 37 |
| JSON | 7 | 426 | 426 | 0 |
| Plain Text | 5 | 24 | 24 | 0 |
| Markdown | 3 | 185 | 146 | 0 |
| CSS | 2 | 109 | 72 | 0 |
| HTML | 2 | 84 | 77 | 0 |
| TOML | 2 | 8 | 8 | 0 |
| **Total** | **236** | **17,554** | **15,417** | **927** |

ULOC: 10,263 · **DRYness: 58%**

Delta vs. corrected previous (228 files): +8 files, +381 lines, +289 code lines, +21 complexity, DRYness flat (58% → 58%). File count reconciles exactly: 9 new files (`fontScale.ts`, `reducedMotion.ts`, `fontScale.test.ts`, `reducedMotion.test.ts`, `SettingsBootstrap.tsx`, `settings/ThemeSetting.tsx`, `settings/FontSizeSetting.tsx`, `settings/ReducedMotionSetting.tsx`, `e2e/settings.spec.ts`) minus 1 deleted (`theme-toggle.spec.ts`) = +8. DRYness holding exactly flat matches genuinely new, non-duplicative logic — each setting's utility file is a distinct, independently-testable pure function, not a copy-pasted variant of another.

### 2026-07-25 — after archiving `restructure-left-nav`

Restructured the entire left nav: Metrics moved from Writing/Dev Log to its own `/metrics` route under Site; Sreditor moved from Writing to Work, gaining a from-scratch 10-page project-record submenu (`sreditor-status.json`, new); Farpost's and Vocare's submenus grew from 6 to 10 pages each (Bug List, Testing & Verification, Lightbulbs, Glossary, via three new shared components — `BugListSection.tsx`, `LightbulbsList.tsx`, `GlossaryList.tsx`); Atlas/Dispatch/Pulse moved from Farpost's own pill-tab bar (now deleted, `FarpostTabBar.tsx`) to a promoted-to-top-level Experiments group at `/techstacks/*`, with permanent redirects from every old `/farpost/farpost-*` URL; Dev Log's Code Showcase flattened from `/dev-log/code-showcase/<slug>` to `/dev-log/<slug>` directly, with the site-wide Bug Log/Testing & Verification/Glossary/Lightbulbs pages retired in favor of per-project equivalents (two real Farpost Pulse infrastructure bugs ported as new flattened Dev Log entries rather than a Bug List, since Pulse is now an Experiments piece with no Bug List page type). DRYness held flat (58% → 58%). File count reconciles exactly against the previous snapshot: 22 new files (3 shared components; 4 new Farpost pages; 4 new Vocare pages; 10 new Sreditor pages; `sreditor-status.json`) minus 9 deleted (`FarpostTabBar.tsx`; `bugLog.ts`, `glossary.ts`, `lightbulbs.ts` data/component files; the 4 retired site-wide Dev Log sub-pages; the Code Showcase hub page) = +13. DRYness holding exactly flat matches the new per-project pages being genuinely parallel structure (three near-identical shared components reused nine times across projects) rather than copy-pasted variation.

| Language | Files | Lines | Code | Complexity |
|---|---|---|---|---|
| TypeScript | 143 | 10,758 | 9,746 | 597 |
| Python | 42 | 4,087 | 3,305 | 265 |
| XML | 21 | 458 | 458 | 0 |
| JavaScript | 14 | 984 | 808 | 72 |
| JSON | 8 | 596 | 596 | 0 |
| Apex | 7 | 780 | 634 | 37 |
| Plain Text | 5 | 24 | 24 | 0 |
| Markdown | 3 | 185 | 146 | 0 |
| CSS | 2 | 109 | 72 | 0 |
| HTML | 2 | 84 | 77 | 0 |
| TOML | 2 | 8 | 8 | 0 |
| **Total** | **249** | **18,073** | **15,874** | **971** |

ULOC: 10,438 · **DRYness: 58%**

### 2026-07-26 — after archiving `mobile-chrome-redesign`

Consolidated the mobile top bar (brand pill left, one 3-icon cluster right — Account-or-Sign-In, Menu, Settings), replacing the old split hamburger-left/cog-right layout; the mobile nav is now a full-viewport takeover (`fixed inset-0`, no dim backdrop) instead of a narrow `w-72` slide-in drawer, sharing open/close state between `RightRail` (the trigger) and `DrawerNav` (the panel) via a new `MobileNavContext.tsx`. The desktop right rail widened from `xl:w-16` to `xl:w-64`, and `PageOutline` dropped its `createPortal`-to-`document.body` click-to-open modal entirely in favor of a persistent inline anchor list, CSS-hidden below `xl` (`hidden xl:block`) rather than shown via a mobile trigger. The Account/Sign-In icon is now genuinely session-conditional everywhere — `session.ts`'s `storeSession()`/`clearSession()` toggle a `data-signed-in` attribute on `<html>` (read live by new `globals.css` rules), the same DOM-attribute pattern already proven by theme/font-scale/reduced-motion, since `RightRail` mounts once at the root layout and never remounts on client-side nav. `/account` gained a real Sign Out button (`AccountSignOut.tsx`) using the existing `clearSession()`. `Header.tsx`'s photo moved back to the right of the contact-info block, restoring `resume-homepage`'s already-shipped spec. DRYness held flat (58% → 58%); complexity dropped slightly (971 → 968) since `PageOutline` lost its open-state/Escape-listener logic and the new files are mostly simple wrapper components. File count reconciles exactly: 4 new files in `web/src` (`MobileNavContext.tsx`, `AccountSignOut.tsx`, `session.test.ts`, `Header.test.tsx`) — no deletions. (`e2e/account-session.spec.ts`, also new, isn't in scc's `web/src api pieces` scan scope.)

| Language | Files | Lines | Code | Complexity |
|---|---|---|---|---|
| TypeScript | 147 | 10,827 | 9,770 | 594 |
| Python | 42 | 4,087 | 3,305 | 265 |
| XML | 21 | 458 | 458 | 0 |
| JavaScript | 14 | 984 | 808 | 72 |
| JSON | 8 | 608 | 608 | 0 |
| Apex | 7 | 780 | 634 | 37 |
| Plain Text | 5 | 24 | 24 | 0 |
| Markdown | 3 | 185 | 146 | 0 |
| CSS | 2 | 123 | 78 | 0 |
| HTML | 2 | 84 | 77 | 0 |
| TOML | 2 | 8 | 8 | 0 |
| **Total** | **253** | **18,168** | **15,916** | **968** |

ULOC: 10,476 · **DRYness: 58%**

### 2026-07-26 — after archiving `dev-log-topics`

Added a `topic: Topic` field one level above `category` on every Dev Log entry (fixed 5-value taxonomy — Engineering, Process & Verification, Architecture & Stack Decisions, Business Model, Human Factors), grew `CODE_SHOWCASE_ENTRIES` from 12 to 23 with 11 new entries carrying real final copy (3 about this project's own AI-assisted process, 8 drawn from existing `docs/lightbulbs/*-dev-log-entry.md` files, each graduated with a pointer note), gave `/dev-log` a single-select topic pill filter (`TopicFilter.tsx`, reusing the site's existing active-pill styling), and capped `DrawerNav`'s Dev Log submenu at the 5 most recent entries plus a "View All" link (`capRecentEntries.ts`) instead of listing all 23. DRYness held flat (58% → 58%).

**This delta is not purely `dev-log-topics`' own work** — worth stating plainly rather than implying otherwise. The previous snapshot (`mobile-chrome-redesign`) was logged before a separate batch of live, ad hoc post-archive tweaks that session (the outline's scroll-margin fix, the click glow, the per-anchor color strip, `cursor-pointer` additions — see `docs/handoff-2026-07-26-post-mobile-chrome-tweaks.md`) — none of which had their own snapshot. Those tweaks only edited already-existing files (`globals.css`, `PageOutline.tsx`, `SectionHeader.tsx`, `Header.tsx`, `PillBar.tsx`), so they added real lines to this delta without adding any files — `dev-log-topics` itself never touched any of those five files at all. File count still reconciles exactly against `dev-log-topics`' own new files alone (6: `TopicFilter.tsx`, `filterByTopic.ts`, `DevLogEntryList.tsx`, `capRecentEntries.ts`, `filterByTopic.test.ts`, `capRecentEntries.test.ts`), which is what makes the mixed attribution easy to miss — the file-count math working out perfectly doesn't mean the line-count delta is 100% this change's own.

| Language | Files | Lines | Code | Complexity |
|---|---|---|---|---|
| TypeScript | 153 | 11,388 | 10,260 | 603 |
| Python | 42 | 4,087 | 3,305 | 265 |
| XML | 21 | 458 | 458 | 0 |
| JavaScript | 14 | 984 | 808 | 72 |
| JSON | 8 | 620 | 620 | 0 |
| Apex | 7 | 780 | 634 | 37 |
| Plain Text | 5 | 24 | 24 | 0 |
| Markdown | 3 | 185 | 146 | 0 |
| CSS | 2 | 161 | 98 | 0 |
| HTML | 2 | 84 | 77 | 0 |
| TOML | 2 | 8 | 8 | 0 |
| **Total** | **259** | **18,779** | **16,438** | **977** |

ULOC: 10,815 · **DRYness: 58%**

### 2026-08-01 — after archiving `experiments-record-pages`

Fixed the redundant "Experiments > Experiments" nav node — Atlas/Dispatch/Pulse/Credential Flow are now direct children of the Experiments heading, plus a trailing "View All" link — and gave each of the four its own six-page submenu (Tech Stack, Architecture, Object Model, Design Notes, AI Notes, Setup Gallery), mirroring Work's existing project-record shape. 24 new `page.tsx` files (six per Experiment), plus three new Setup Gallery components: `farpost-dispatch/SetupGallery.tsx` and `farpost-pulse/SetupGallery.tsx` (both honest "screenshots coming soon" stubs pending Robin capturing real Experience Cloud/Azure screenshots), and `credential-flow/SetupGallery.tsx` migrated off the shared `portfolio/SetupGallery.tsx` with its existing real screenshots carried over unchanged. AI Notes and Design Notes are genuinely new writing for all four pieces (not reorganized content), including Atlas's honest "no AI mechanic today" stub and Pulse's "currently mocked" coaching-tip disclosure.

| Language | Files | Lines | Code | Complexity |
|---|---|---|---|---|
| TypeScript | 181 | 13,439 | 12,142 | 670 |
| Python | 42 | 4,091 | 3,306 | 265 |
| XML | 21 | 458 | 458 | 0 |
| JavaScript | 14 | 984 | 808 | 72 |
| JSON | 8 | 644 | 644 | 0 |
| Apex | 7 | 780 | 634 | 37 |
| Plain Text | 5 | 24 | 24 | 0 |
| Markdown | 3 | 185 | 146 | 0 |
| CSS | 2 | 170 | 98 | 0 |
| HTML | 2 | 84 | 77 | 0 |
| TOML | 2 | 8 | 8 | 0 |
| **Total** | **287** | **20,867** | **18,345** | **1,044** |

ULOC: 11,653 · **DRYness: 56%**

Delta vs. previous: +28 files, +2,088 lines, +1,907 code, +67 complexity, DRYness dipped 2 points (58% → 56%) — still comfortably above the 55% "high repetition" flag threshold and well short of the 10-point-drop trigger, so no `docs/issues.md` entry needed, though it's the lowest DRYness recorded so far and worth watching on the next snapshot. The dip tracks with a large amount of genuinely new case-study prose rather than duplicated logic: AI Notes and Design Notes are new writing for all four pieces, not reorganized content, per this change's own design.md. File count reconciles to +27 from this change's own new files (listed above); the remaining +1 (`web/src/app/contact/page.tsx`) landed in an intervening commit that didn't get its own snapshot.

# Code metrics

Running `scc` (Sloc Cloc and Code) snapshots, taken right before archiving each OpenSpec change — same checkpoint as the drift audit. Tracks code volume, complexity, and redundancy (DRYness = `ULOC / SLOC`) over time, so duplication growth is visible early and a refactor has an explicit before/after target instead of a vibe. See `CLAUDE.md`'s "Code metrics — scc" section for the convention, `docs/stack.md` for how the binary was obtained.

Command: `scc --dryness --exclude-dir .git,.hg,.svn,node_modules,.venv web/src api pieces` (run from repo root) — `pieces` covers every promoted portfolio-piece backend as one argument, no per-piece updates needed here as new ones get added. The explicit `--exclude-dir` became necessary as of the `farpost-pulse-build` snapshot: scc's `.gitignore`-based exclusion (its documented default behavior) didn't reliably keep `pieces/<piece>/node_modules` out of the scan when `pieces` was passed as a scan-root argument, even though the repo-root `.gitignore` already covers `node_modules/` — scc's own `--exclude-dir` default list is only `.git,.hg,.svn`, nothing project-specific. Confirmed by running `scc pieces` alone first and seeing ~4,500 files (clearly vendored `@azure/*` package content, not this piece's ~15 source files) before adding the explicit exclusion.

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

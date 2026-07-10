# Code metrics

Running `scc` (Sloc Cloc and Code) snapshots, taken right before archiving each OpenSpec change — same checkpoint as the drift audit. Tracks code volume, complexity, and redundancy (DRYness = `ULOC / SLOC`) over time, so duplication growth is visible early and a refactor has an explicit before/after target instead of a vibe. See `CLAUDE.md`'s "Code metrics — scc" section for the convention, `docs/stack.md` for how the binary was obtained.

Command: `scc --dryness web/src api pieces` (run from repo root) — `pieces` covers every promoted portfolio-piece backend as one argument, no per-piece updates needed here as new ones get added.

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

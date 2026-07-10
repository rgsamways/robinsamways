# Code metrics

Running `scc` (Sloc Cloc and Code) snapshots, taken right before archiving each OpenSpec change — same checkpoint as the drift audit. Tracks code volume, complexity, and redundancy (DRYness = `ULOC / SLOC`) over time, so duplication growth is visible early and a refactor has an explicit before/after target instead of a vibe. See `CLAUDE.md`'s "Code metrics — scc" section for the convention, `docs/stack.md` for how the binary was obtained.

Command: `scc --dryness web/src api` (run from repo root).

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

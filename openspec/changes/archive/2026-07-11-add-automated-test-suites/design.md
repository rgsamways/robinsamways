## Context

`docs/testing.md` already documents a layered verification approach (`npm run build`, Playwright, `TestClient`, real-vs-mocked external calls) and is honest that none of it is CI-automated. What it undersells is that *none of it persists at all* — every verification pass across this project's whole history has been a script written fresh, run once, then thrown away. The one exception, `pieces/farpost-pulse-func/scripts/{checkSeedShape,testHandlers}.js`, proves the pattern is valuable (it caught real bugs — a terminology mismatch, a misleading `aria-label` — before they shipped) but isn't built on an actual test framework.

Robin's framing for why this matters now, not later: "Farpost does, after all" — the real product this portfolio increasingly mirrors (Pulse, and the upcoming Atlas/Dispatch pieces) already treats real testing discipline as a baseline expectation, not optional polish.

## Goals / Non-Goals

**Goals:**
- Real, framework-based, committed test suites for all three pieces of this codebase (`web/`, `api/`, `pieces/farpost-pulse-func/`), covering unit, integration, and (for `web/`) e2e layers.
- Representative coverage proving each framework actually works end-to-end on real code, not a placeholder `it("works")`.
- A durable, written convention so future features don't silently regress back to "verify once, discard" — see `CLAUDE.md`.

**Non-Goals:**
- Exhaustive retrofit of every existing endpoint, component, and page. Diminishing returns on stable code; better spent extending coverage incrementally as that code actually changes.
- CI automation. A close, natural follow-up — but a distinct decision surface (secrets management for anything hitting real external services like Salesforce/Anthropic/Cosmos, what failure state blocks a merge) that deserves its own scoping, not bundled in here.
- Retiring the existing manual/live-service verification habit (real Anthropic calls, real Salesforce calls) described in `docs/testing.md` — that stays valuable for exactly the reason already documented there (a mock only proves the mock's shape is right); automated suites complement it, they don't replace it for integration points where the *real* external behavior is what's actually in question.

## Decisions

- **Vitest for `web/` unit tests.** Considered Jest — heavier config, slower, and Vitest has better native ESM/TypeScript support that fits a Turbopack-based Next.js 16 project more naturally. No existing Jest investment to preserve, so no switching cost either way; Vitest is simply the better current default.
- **Playwright for `web/` e2e, formalized rather than replaced.** It's already the de facto tool used throughout this project's entire verification history, just never committed as persistent spec files. Formalizing what's already proven in practice, not introducing something new to learn.
- **pytest for `api/` unit and integration tests.** The standard choice for FastAPI, and its `TestClient` (already used informally, extensively, throughout this project) is specifically designed to pair with it — this is the smallest possible step from current ad-hoc practice to a real suite.
- **`node:test` (Node's built-in runner) for `pieces/farpost-pulse-func/`, not Vitest.** Considered Vitest for consistency with `web/`'s choice. Rejected: this piece deliberately stays minimal-dependency (it's Azure Functions code, and per `CLAUDE.md`'s "Portfolio piece isolation" convention, isolated pieces are expected to make their own stack calls, not inherit `web/`'s). `node:test` ships with Node 20+, which this piece already requires (`engines: {"node": ">=20"}`), so it adds zero new dependencies for a genuinely small test surface.
- **Representative coverage, chosen by risk/value, not by exhaustive checklist.** Concretely: `api/` gets unit tests for pure logic with real edge-case history (`moderation.py`'s word-boundary matching, given the documented Scunthorpe-problem consideration) and integration tests for at least one full endpoint flow via `TestClient`; `web/` gets unit tests for pure comparator/utility logic (e.g., `loanApplication.ts`) and e2e specs covering global navigation plus one deep interactive flow; `pieces/farpost-pulse-func/` converts its two existing scripts into real `node:test` files, which is closer to a reformat than new work since the logic already exists and already works.
- **Test dependencies stay separate from runtime dependencies** wherever the tooling makes that natural — `package.json`'s existing `devDependencies` split already does this for `web/` and `pieces/farpost-pulse-func/`; `api/` should get an equivalent split (e.g., a `requirements-dev.txt`) rather than mixing `pytest` into the production `requirements.txt` that Railway actually deploys from.

## Risks / Trade-offs

- [Representative coverage leaves real gaps against 100%] → accepted deliberately; the goal here is proving real, working infrastructure and a durable convention, not a coverage percentage. Future feature work extends it incrementally, per the new `CLAUDE.md` convention.
- [No CI means committed tests can still silently bit-rot if nobody remembers to run them] → accepted as an explicit, named non-goal, not an oversight — flagged clearly as the natural next change once real suites exist to actually automate.
- [`pytest` needing a `requirements-dev.txt` split is a small deployment-config change] → low risk; Railway's build already only needs `requirements.txt`, a dev-only file alongside it doesn't affect production deploys as long as nothing in `app/` imports from it.

## Migration Plan

1. Set up Vitest for `web/`; write initial unit tests for representative pure logic.
2. Set up Playwright properly for `web/` (config + `web/e2e/`); write initial specs covering global navigation and at least one deep flow (e.g., Credential Flow's live demo widget, or Farpost Pulse's roster → detail → coaching-tip flow).
3. Set up pytest for `api/` (with a dev-only dependency split); write initial unit tests (`moderation.py`) and at least one integration test exercising a real endpoint via `TestClient`.
4. Convert `pieces/farpost-pulse-func/scripts/checkSeedShape.js` and `testHandlers.js` into real `node:test`-based files; add a real `npm test` script.
5. Rewrite `docs/testing.md` to describe the new, actual state — not the honest-gap framing it currently has.
6. Add the new convention to `CLAUDE.md`: tests are part of a feature's own change's `tasks.md` going forward.
7. Log every new dependency in `docs/stack.md`.

Before writing any `web/` test code, check this repo's own `web/AGENTS.md` reminder ("This is NOT the Next.js you know... read `node_modules/next/dist/docs/` before writing any code") for whatever Next.js 16's own current testing guidance actually says, rather than assuming prior-version conventions apply.

## Open Questions

- Exact initial coverage scope per piece is intentionally left to whoever implements this, guided by "highest-value/highest-risk paths" rather than a prescribed checklist — flag the specific choices made in the handoff/resolution note so they're not silently arbitrary.
- Whether `api/`'s dev dependencies live in a `requirements-dev.txt` or some other split (e.g., `pyproject.toml` extras) — implementer's call, driven by whatever fits this project's existing `pip`/`venv`-based workflow most naturally.

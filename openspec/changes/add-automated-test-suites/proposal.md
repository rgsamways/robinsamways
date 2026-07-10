## Why

No test coverage exists anywhere in this codebase as a persistent, re-runnable suite. Despite extensive verification narrated throughout `docs/issues.md`'s history — "verified via FastAPI's `TestClient`," "verified via headless browser," entire scripts wrapping real handlers over real HTTP — every bit of it was a one-off script, written once for that change's verification, then discarded. Only `pieces/farpost-pulse-func/` has anything that survives (`npm run test:seed-shape`, `npm run test:handlers`), and even those don't run on an actual test framework, just plain Node scripts with manual checks. `docs/testing.md`'s own "no CI, no persistent suite" disclosure understated how total the gap actually is — confirmed directly (no Playwright config or `.spec.ts` files anywhere in `web/`, no `tests/` directory or `pytest` dependency anywhere in `api/`). This needs fixing for real, not documented as an accepted trade-off.

## What Changes

- Establish real, framework-based unit test suites: Vitest for `web/`, pytest for `api/`, `node:test` for `pieces/farpost-pulse-func/`.
- Establish real, framework-based integration test suites reusing the same frameworks — pytest + `TestClient` for `api/` (formalizing the pattern already used ad hoc), `node:test` + the existing fake-Cosmos-client pattern for `pieces/farpost-pulse-func/`.
- Establish a real, committed Playwright e2e suite for `web/` — a proper `playwright.config.ts` and persistent `.spec.ts` files, replacing one-off verification scripts that get thrown away.
- Write representative, meaningful initial coverage on the highest-value/highest-risk paths per piece — not an exhaustive retrofit of every existing feature (see Non-Goals).
- Update `docs/testing.md` to describe what actually exists once this lands, and add the ongoing convention to `CLAUDE.md`: new features going forward include real tests as part of their own change's `tasks.md`, not retrofitted later.

## Non-Goals

- **Full retrofit of exhaustive test coverage across all existing code.** Not realistic in one change, and not the highest-value use of time for code that's already stable and unlikely to change. Representative coverage now, extended incrementally later, is the goal.
- **CI automation** (a GitHub Actions workflow running these suites automatically on push). A natural, tightly-coupled follow-up once real suites exist to run — but a distinct piece of work with its own decisions (secrets for anything hitting real external services, what blocks a merge), scoped out of this change deliberately.

## Capabilities

### New Capabilities
- `automated-testing`: real, committed, framework-based test suites exist for each piece of this codebase (`web/`, `api/`, and each promoted portfolio piece), runnable via a standard command, covering unit/integration/e2e layers appropriate to that piece's stack.

## Impact

- `web/`: new `vitest.config.ts` and unit test files (colocated or under a `__tests__/` convention — implementer's call), a new `playwright.config.ts` and `web/e2e/*.spec.ts` files, new devDependencies (`vitest`, `@playwright/test`), new `npm test` / `npm run test:e2e` scripts.
- `api/`: new `api/tests/` directory, `pytest` (and `httpx` if not already sufficient for `TestClient`) added as a dev dependency, initial `test_*.py` files.
- `pieces/farpost-pulse-func/`: `scripts/checkSeedShape.js` and `scripts/testHandlers.js` reworked into real `node:test`-based files (or new files alongside them, implementer's call on whether to migrate or replace), a real `npm test` script.
- `docs/testing.md`: rewritten to describe the actual new state, not the current honest-gap disclosure.
- `CLAUDE.md`: new convention — tests are part of a feature's own change going forward.
- `docs/stack.md`: new dev dependencies logged.

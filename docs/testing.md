# Testing & verification

How this project actually gets verified — consolidated in one place because the pieces have been scattered across `docs/stack.md` and buried inside individual `docs/issues.md` resolution notes. Written to be handed to someone else, not just kept in memory.

Last updated: 2026-07-10 (`add-automated-test-suites`).

## The honest current state

Real, committed, framework-based test suites now exist for every piece of this codebase — `web/` (Vitest for unit tests, Playwright for e2e), `api/` (pytest, unit and integration), and `pieces/farpost-pulse-func/` (`node:test`). They're runnable via a standard command, live in the repo, and don't get thrown away after one run.

What's still true, and worth being upfront about: **there's no CI pipeline.** Nothing runs these suites automatically on push. They're real and repeatable, but running them is still a manual step, not an enforced gate — a close, natural follow-up once real suites existed to actually automate, deliberately scoped out of the change that added the suites themselves. Coverage is also representative, not exhaustive — the highest-value/highest-risk paths per piece, extended incrementally as code that matters actually changes, not a retrofit of every existing feature.

## Frontend build correctness

`npm run build` (Next.js) is the baseline gate for every change — catches TypeScript errors and build-time failures before anything else gets checked. Nothing gets considered "done" without a clean build.

## Web unit tests (Vitest)

`npm run test` (single run) / `npm run test:watch` in `web/`. Covers pure logic — currently `loanApplication.ts`'s sort comparator and Farpost Pulse's `api.ts` client functions (request shape, error handling on a non-ok response), each mocked at the `fetch` boundary rather than hitting a real backend. `vitest.config.ts` follows Next.js's own documented Vitest setup (jsdom environment, `@testing-library/react` available for future component tests, `vite-tsconfig-paths` for the `@/*` import alias).

## Web e2e tests (Playwright — committed suite)

`npm run test:e2e` in `web/` runs `playwright.config.ts` against a real production build (`next build && next start`, automated via Playwright's `webServer`). Committed spec files live in `web/e2e/`:

- `global-navigation.spec.ts` — the Home/Method/Narrative/Farpost/Dev Log menu: opens, lists every destination, navigates correctly, and closes without leaving stray state.
- `farpost-pulse-coaching-flow.spec.ts` — the deep flow: roster → tech detail → coaching-tip generation, including the button's loading state.

The deep-flow spec mocks Farpost Pulse's backend calls via Playwright's `page.route()` rather than hitting the real, deployed Azure Function App — deliberate, so the suite is deterministic and runnable without live external infrastructure. This is a different concern from the manual/live-service verification described below, which stays valuable for exactly the reason it always has: a mocked route only proves the mock's shape is right, not that the real integration actually works. The committed suite verifies UI/interaction logic; manual live-service passes verify the real integration, at least once, when it matters.

## Manual / ad hoc browser verification (Playwright)

Playwright is also still reached for outside the committed suite — real full-page screenshots spot-checked against source content, real mobile-viewport testing (`isMobile`/`hasTouch`, `touchscreen.tap`), and one-off checks that aren't worth a permanent spec (e.g. confirming a favicon renders identically across engines). The committed suite in `web/e2e/` covers the core, stable flows; ad hoc runs still cover the long tail.

## API tests (pytest)

`pytest` in `api/` (rootdir-configured via `pyproject.toml`'s `pythonpath`, so it resolves `app.*` imports regardless of how it's invoked). Test-only dependencies live in `api/requirements-dev.txt`, layered on top of the production `requirements.txt` — Railway's actual deploy only ever installs `requirements.txt`, so pytest never touches production.

- **Unit:** `tests/test_moderation.py` — `contains_blocked_word`, covering both a real rejection and the word-boundary/Scunthorpe-problem case (`"Scunthorpe"`, `"Essex"` are not falsely flagged despite containing blocked substrings).
- **Integration:** `tests/test_loan_applications.py` — the loan application list/create flow through FastAPI's `TestClient`, formalizing the pattern already used ad hoc throughout this project's verification history. The outbound `_request` call to Salesforce is monkeypatched (per-test, via `pytest`'s `monkeypatch` fixture) so the suite never needs live Salesforce credentials; validation paths (blocked words, the honeypot/timing bot-check) are exercised without any Salesforce call happening at all.

`TestClient` is deliberately used **outside** a `with` block in these tests, so FastAPI's lifespan (and the real `init_db()` Postgres connection it triggers) never fires — the suite needs no live database, local or otherwise.

## API-level manual verification (real external calls)

**Real external calls are still used deliberately, not mocked, when testing the integration itself** — the Anthropic recommendation endpoint and the Salesforce OAuth/REST calls have each been verified against the real, live service at least once, specifically because mocking those would only prove the mock's shape was right, not that the actual integration works. The committed pytest suite complements this, it doesn't replace it.

## Farpost Pulse tests (`node:test`)

`npm test` in `pieces/farpost-pulse-func/` runs Node's built-in test runner (`node --test`) — zero new dependencies, since this piece deliberately stays minimal per `CLAUDE.md`'s "Portfolio piece isolation" convention, and `node:test` ships with Node 20+, which this piece already requires.

- `test/seedShape.test.js` — the generated seed data's shape and intentional patterns (one strong tech, one weak-angle tech, one slow-turnaround tech, three improving techs), using pure functions only, no Cosmos DB connection.
- `test/handlers.test.js` — all four HTTP handlers exercised directly against an in-memory fake Cosmos client (same "monkeypatch the shared client, test the real logic" pattern used for `api/`'s Salesforce integration), including the coaching-tip generator and the per-IP rate limiter tripping at the 6th request.

These replace what used to be two plain Node scripts with manual `console.log`-based checks (`scripts/checkSeedShape.js`, `scripts/testHandlers.js`) — same underlying logic and coverage, now on a real, standard test runner with real pass/fail reporting.

## Manual / ops-level checks

- `curl` and `psql` for direct connectivity or behavior checks — confirming Railway's Postgres wiring, hitting an endpoint directly to bypass the UI entirely.
- Docker, used once to run a local Postgres container for verifying the FastAPI + SQLModel + asyncpg wiring end-to-end before a real Railway database existed yet.
- Chrome DevTools' Issues tab, checked manually once for a specific accessibility advisory — found unreliable to drive through Playwright/CDP automation for that particular check, so the underlying condition (every form field has an `id` or `name`) was verified directly instead of trusting the automated signal.

## Adjacent, not testing, but part of the same discipline

- `scc` — code volume/complexity/duplication metrics, tracked at every OpenSpec archive (see `docs/metrics.md`). Not a testing tool, but the same "know what's actually true instead of assuming" instinct.
- ESLint — standard Next.js linting.

### Code-quality tooling is a deliberate two-tier setup, not one tool

This mirrors a standard industry pattern — platforms like SonarQube or CodeClimate bundle exactly this pairing into one dashboard: a cheap, always-on aggregate signal, plus a heavier diagnostic tool that only runs when the signal says something's worth investigating. Here it's two lightweight CLI tools instead of one heavy platform, which is a better fit for a solo project at this scale:

- **Tier 1, continuous: `scc`.** Runs at every OpenSpec archive, no exceptions. Reports an aggregate DRYness percentage (`ULOC / SLOC`) — a trip-wire, not a diagnosis. It can't tell you *which* lines are duplicated, only *how much*, in aggregate.
- **Tier 2, on-demand: `jscpd`** (copy-paste detector — not installed as of 2026-07-10, deliberately deferred). Localizes actual duplicate blocks, file-by-file and line-by-line. Reached for only when tier 1 trips a real threshold: DRYness below 55% (`scc`'s own "high repetition" line) or a drop of more than 10 points from the previous snapshot in one step (see `CLAUDE.md`'s "Code metrics — scc" section). Installing it before that threshold ever fires would be tooling ahead of a demonstrated need — the switching cost of adding an npm devDependency later is near zero, unlike infrastructure decisions (e.g. the `pieces/` folder layout) where waiting would mean real migration cost.

## The ongoing convention: tests ship with the feature, not after it

Going forward, an OpenSpec change that adds or modifies application behavior includes representative test coverage for that behavior as part of the same change's `tasks.md` — not deferred to a later retrofit. See `CLAUDE.md`'s testing convention. `add-automated-test-suites` itself was the one-time exception: establishing the frameworks and initial representative coverage that didn't exist as real suites before.

## For future portfolio pieces

Any piece promoted to its own backend (see `CLAUDE.md`'s "Portfolio piece isolation") should get the same layered treatment, adapted to its own stack — `pieces/farpost-pulse-func/`'s `node:test` suite is the concrete template: a build/compile check appropriate to its language, its own equivalent of `TestClient`-style endpoint testing (the fake-Cosmos-client pattern here), and Playwright-driven verification of anything it renders inside `web/`. The layers stay the same even when the technology underneath a given piece doesn't.

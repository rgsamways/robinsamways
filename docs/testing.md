# Testing & verification

How this project actually gets verified — consolidated in one place because the pieces have been scattered across `docs/stack.md` (and one mis-filed as "one-off" when it's actually the recurring method) and buried inside individual `docs/issues.md` resolution notes. Written to be handed to someone else, not just kept in memory.

Last updated: 2026-07-10.

## The honest starting point

There's no CI pipeline and no persistent, re-runnable automated test suite yet. Verification has been manual-but-thorough: every OpenSpec change's `tasks.md` ends with an explicit verification section, and whoever implements the change proves it once, deliberately, right before archiving — not "write a test that lives in the repo and runs on every future push." That's a real, deliberate trade-off for a solo project at this stage, not an oversight, and it's worth being upfront about exactly that if explaining this to someone rather than implying more automation exists than actually does.

## Frontend build correctness

`npm run build` (Next.js) is the baseline gate for every change — catches TypeScript errors and build-time failures before anything else gets checked. Nothing gets considered "done" without a clean build.

## Browser-driven UI verification (Playwright)

The primary tool for anything involving actual rendering or interaction — Playwright driving a real Chromium instance (occasionally Firefox too, e.g. confirming the favicon renders identically across engines). Used for:

- Navigation flows: menu open/close, link clicks, `waitForURL`-based navigation confirmation
- Interactive behavior: sort/filter controls, pagination, modal dismissal (close button, backdrop click, and Escape, tested independently)
- Real mobile-viewport testing — an actual `isMobile`/`hasTouch` context (e.g. 390×844 with `touchscreen.tap`), not just a resized desktop window
- Visual verification via full-page screenshots, spot-checked against source content

Why real browser automation rather than a lighter DOM-testing library: this is a portfolio site where rendering and interaction fidelity *is* the product being demonstrated — verifying real click/keyboard/touch behavior matters more here than it would for logic that's easily unit-testable in isolation.

## API-level testing (FastAPI TestClient)

FastAPI's built-in `TestClient`, often with the outbound `_request` call monkeypatched, verifies endpoint behavior (status codes, payload shapes, validation rules, rate limiting) without needing a live external service for every check.

**Real external calls are used deliberately, not mocked, when testing the integration itself** — the Anthropic recommendation endpoint and the Salesforce OAuth/REST calls have each been verified against the real, live service at least once, specifically because mocking those would only prove the mock's shape was right, not that the actual integration works.

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

## For future portfolio pieces

Any piece promoted to its own backend (see `CLAUDE.md`'s "Portfolio piece isolation") should still get the same layered treatment, adapted to its own stack: a build/compile check appropriate to its language, its own equivalent of `TestClient`-style endpoint testing, and Playwright-driven verification of anything it renders inside `web/`. The layers stay the same even when the technology underneath a given piece doesn't.

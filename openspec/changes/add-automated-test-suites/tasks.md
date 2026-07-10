## 1. Web: unit tests (Vitest)

- [ ] 1.1 Before writing any test code, check `web/AGENTS.md`'s reminder and read whatever Next.js 16's own current testing guidance actually says in `node_modules/next/dist/docs/`, rather than assuming prior-version conventions apply
- [ ] 1.2 Install and configure Vitest for `web/` (`vitest.config.ts`, a `npm run test` script)
- [ ] 1.3 Write initial unit tests for representative pure logic — at minimum, `loanApplication.ts`'s `compareLoanApplications` comparator; use judgment on 1-2 more high-value pure-logic candidates (e.g. Farpost Pulse's `api.ts` client functions, or a stats/formatting helper) rather than an exhaustive list
- [ ] 1.4 Log Vitest as a new dev dependency in `docs/stack.md`

## 2. Web: e2e tests (Playwright)

- [ ] 2.1 Install and configure Playwright properly for `web/` (`playwright.config.ts`, a `web/e2e/` directory, a `npm run test:e2e` script) — this formalizes a tool already used ad hoc throughout this project's history, not a new one to learn
- [ ] 2.2 Write an e2e spec covering global navigation (the Home/Method/Narrative/Farpost/Dev Log menu, opening/closing, navigating correctly)
- [ ] 2.3 Write at least one deeper e2e spec covering a real interactive flow — Credential Flow's live demo widget, or Farpost Pulse's roster → tech detail → coaching-tip generation flow; use judgment on which is more representative
- [ ] 2.4 Log Playwright as a new dev dependency in `docs/stack.md` (noting it was already informally used before this formalization)

## 3. API: unit and integration tests (pytest)

- [ ] 3.1 Install and configure pytest for `api/`, with test-only dependencies in a separate file (e.g. `requirements-dev.txt`) so Railway's production build (`requirements.txt`) is unaffected
- [ ] 3.2 Write unit tests for `moderation.py`'s `contains_blocked_word` — cover both a blocked-word rejection and the word-boundary/Scunthorpe-problem case (a name that contains a blocked substring inside a longer, innocuous word should NOT be rejected), matching the real edge case already documented in `docs/issues.md`'s history
- [ ] 3.3 Write at least one integration test using `TestClient` exercising a real endpoint's full request/response cycle (e.g. the loan application list/create flow), formalizing the pattern already used ad hoc throughout this project's verification history
- [ ] 3.4 Log pytest (and any other new test dependency) in `docs/stack.md`

## 4. Farpost Pulse: convert existing scripts to a real framework

- [ ] 4.1 Convert `pieces/farpost-pulse-func/scripts/checkSeedShape.js` into a real `node:test`-based test file (or add a new one alongside it — implementer's call on migrate vs. replace)
- [ ] 4.2 Convert `pieces/farpost-pulse-func/scripts/testHandlers.js` into a real `node:test`-based test file, preserving its existing fake-Cosmos-client pattern
- [ ] 4.3 Add a real `npm test` script to `pieces/farpost-pulse-func/package.json`
- [ ] 4.4 Update `pieces/farpost-pulse-func/README.md`'s "Verifying without a live Cosmos DB connection" section to reflect the real test command instead of the old ad-hoc script names, if they changed

## 5. Documentation and convention

- [ ] 5.1 Rewrite `docs/testing.md` to describe the actual new state (real suites, what each covers, how to run them) — replace the "no CI, no persistent suite" honest-gap framing with what's now true, keeping the same honest tone (still no CI, say so plainly) rather than overclaiming
- [ ] 5.2 Add the new convention to `CLAUDE.md`: a change that adds or modifies application behavior includes representative test coverage as part of its own `tasks.md`, not deferred to a later retrofit
- [ ] 5.3 Confirm `docs/stack.md` reflects every new test dependency across all three pieces

## 6. Verification

- [ ] 6.1 Confirm `web/`'s unit and e2e suites both run and pass cleanly
- [ ] 6.2 Confirm `api/`'s pytest suite runs and passes cleanly, and that `requirements.txt` alone (no dev dependencies) is still sufficient for `npm run build`-equivalent / a clean API boot
- [ ] 6.3 Confirm `pieces/farpost-pulse-func/`'s `npm test` runs and passes cleanly
- [ ] 6.4 `npm run build` clean in `/web`, no console warnings
- [ ] 6.5 Run `scc --dryness web/src api pieces` and log the snapshot to `docs/metrics.md` before archiving this change, per the convention in `CLAUDE.md` — expect a real increase in code volume this time (test files are genuine new code, not duplication) worth calling out explicitly in the delta note so it isn't mistaken for a DRYness regression

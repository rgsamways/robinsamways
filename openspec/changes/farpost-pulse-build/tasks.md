## 1. Azure Functions backend

- [x] 1.1 Scaffold the Node.js Azure Functions app source at `pieces/farpost-pulse-func/` in this repo (a piece-specific folder under `pieces/`, sibling to `web/` and `api/` at the repo root, targeting the already-provisioned `farpost-pulse-func` Azure resource, Flex Consumption, Node.js 22 LTS) — git-tracked here like everything else on this site; only its *deploy target* is different (Azure instead of Railway/Vercel), not its home repo. This is new source code delivered by this change, not deployed by it; deployment is Robin's manual step afterward
- [x] 1.2 Add the Cosmos DB SDK client, configured against `farpost-pulse-cosmos`, with three containers: `techs` (partition key `/id`), `jobs` (partition key `/techId`), `coachingHistory` (partition key `/techId`)
- [x] 1.3 Write the seed data generation script: 5-8 fake field techs, 20-30 jobs each — at least one consistently-strong tech, at least one with a specific recurring weakness (e.g. always missing roofline shots, or slow turnaround), the rest showing gradual improvement across their job history. Run it against local/mock data first, no live Cosmos DB connection required to validate shapes, before wiring up the real SDK calls
- [x] 1.4 Implement `generateCoachingTip(techStats)` as an isolated, mocked function — returns a canned/randomized tip from a small local array of examples, marked with a `// TODO: replace with real Azure OpenAI call once model deployment quota clears` comment
- [x] 1.5 Implement `GET /api/techs` — list all seeded techs with a snapshot stat each
- [x] 1.6 Implement `GET /api/techs/{id}/jobs` — job history for one tech
- [x] 1.7 Implement `POST /api/coaching/generate` — takes techId, pulls recent jobs, calls `generateCoachingTip()`, stores the result in `coachingHistory` (referencing the tech and the job records it was based on), returns the tip; add a per-IP rate limiter on this endpoint, using Credential Flow's existing limiter as a starting point for the threshold
- [x] 1.8 Implement `GET /api/dashboard/patterns` — aggregates stats across all techs (weakest angle type, avg turnaround, tag completion trend)
- [x] 1.9 Set all four endpoints to anonymous auth level (no function keys — nothing sensitive is at stake, all data is seeded/fake)
- [x] 1.10 Document the exact CORS origins Robin needs to configure on the Function App (production domain + localhost) — this change delivers the requirement and instructions, not a live Azure configuration change

## 2. Farpost Pulse frontend

- [x] 2.1 Rewrite `web/src/app/narrative/farpost-pulse/page.tsx` (currently a placeholder) as the landing page: case-study narrative prose (a company feedback origin story, what a company actually does and why there's no literal product bridge, architecture rationale, tech stack table with reasoning per choice, design/accessibility notes) plus a Tech Roster — cards for each seeded tech showing name + one snapshot stat, linking to that tech's detail page
- [x] 2.2 Build `web/src/app/narrative/farpost-pulse/[techId]/page.tsx`: job history table (property type, date, photos taken/required, angles covered/missed, NFC tags, turnaround), a "Generate Coaching Tip" button with a loading state that calls `POST /api/coaching/generate` and displays the returned tip in a small card, and a trend chart (tag completion or turnaround across that tech's last N jobs)
- [x] 2.3 Build `web/src/app/narrative/farpost-pulse/dashboard/page.tsx`: org-wide charts (tag completion per tech, most commonly missed angle, turnaround trend) sourced from `GET /api/dashboard/patterns`
- [x] 2.4 Wire all three pages to call the Function App directly from the browser via a `NEXT_PUBLIC_FARPOST_PULSE_API_URL` environment variable — no proxy through this repo's own `/api`
- [x] 2.5 Add a local `HamburgerMenu` beside the landing page's heading if it ends up with distinct scrollable sections worth linking to (narrative prose sections plus the roster) — use judgment on whether this is warranted given the page also serves as an entry point into two further routes
- [x] 2.6 Keep styling clean and accessible (semantic HTML, good contrast, keyboard navigable) — this is meant to demonstrate range, not just functionality, per the original concept doc's own framing

## 3. Update the Narrative index

- [x] 3.1 Rewrite Farpost Pulse's teaser text in `web/src/app/narrative/page.tsx` — remove the incorrect "the real build ... is a separate, already-scoped project" framing, replace with accurate copy describing what it actually is
- [x] 3.2 Add tags to Farpost Pulse's entry: Azure Functions, Cosmos DB, React (Azure OpenAI intentionally excluded until the real call is wired in, per design.md)

## 4. Verification

- [x] 4.1 Confirm all three routes render correctly: landing page (narrative + roster), a tech detail page (job history, coaching tip generation with loading state, trend chart), dashboard page (aggregate charts)
- [x] 4.2 Confirm `POST /api/coaching/generate` returns a mocked tip, stores it in `coachingHistory`, and that the rate limiter rejects excess requests from the same IP
- [x] 4.3 Confirm CORS works from localhost during development (production domain can't be verified until Robin deploys and configures the live Function App)
- [x] 4.4 Confirm the `/narrative` index shows Farpost Pulse's corrected teaser and its three tags, with no trace of the old "separate project" framing
- [x] 4.5 Confirm the trend chart genuinely reflects the seeded improvement pattern, not flat or random data
- [x] 4.6 `npm run build` clean in `/web`, no console warnings
- [x] 4.7 Run `scc --dryness web/src api pieces` and log the snapshot to `docs/metrics.md` before archiving this change, per the convention in `CLAUDE.md` — this is the first snapshot to include `pieces/`, so `farpost-pulse-func/`'s Node.js code shows up as a new language row for the first time

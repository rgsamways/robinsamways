# Technology stack

Exhaustive, running list of every technology, library, and tool used to build and ship this site — including one-off dev-time tools that never become a runtime dependency (e.g. something CLI reaches for once to accomplish a task, like extracting an image from a PDF). Update this whenever anything new gets introduced, however small. Last updated: 2026-07-15.

## Production stack

**Backend (`/api`)**
- Python
- FastAPI
- SQLModel
- asyncpg
- uvicorn
- httpx — direct REST calls to Resend's transactional-send API (`POST /contact`'s notification email; no Resend SDK), to Salesforce's OAuth token endpoint + REST API (`api/app/salesforce.py`; no `simple-salesforce` SDK, deliberate choice to demonstrate OAuth 2.0 Client Credentials Flow protocol mechanics directly), and to Anthropic's Messages API (`api/app/ai.py`; no `anthropic` SDK, same "show the mechanics" pattern applied consistently)
- Resend (transactional-send API) — live runtime dependency as of the `contact-form` change; called from `api/app/contact.py` on every valid contact submission. Previously only configured at the account/DNS level for the deployment guide's outbound mail; this is its first use from application code.
- Salesforce REST API + OAuth 2.0 Client Credentials Flow — live runtime dependency as of the `salesforce-loan-demo` change; `api/app/salesforce.py` authenticates to a Salesforce Developer Edition org via the Client Credentials Flow (with an in-memory, expiry-aware access-token cache) and calls the REST API's SOQL query and sobject-create endpoints against a custom `Loan_Application__c` object, backing the `/portfolio` case-study page's live demo widget.
- Salesforce Field History Tracking — live data dependency as of the `salesforce-relationship-view` change; enabled on `Loan_Application__c.Status__c`, queried via the auto-generated `Loan_Application__History` object to back the real status-change timeline on `/portfolio` (not a derived/fabricated timeline from the two date fields).
- Anthropic API (Claude Haiku 4.5, `claude-haiku-4-5`) — live runtime dependency as of the `salesforce-relationship-view` change; `api/app/ai.py` calls `POST https://api.anthropic.com/v1/messages` directly to generate a short "recommended next action" suggestion per Loan Application, generated fresh per request (not cached/stored), rate-limited per-IP via the same sliding-window limiter used elsewhere.
- LDNOOBW word list — public-domain/CC0 profanity blocklist (2026-07-08), embedded verbatim in `api/app/moderation.py`; no external moderation API, no new pip dependency, checked server-side against `applicant_name`/`account_name` at Loan Application creation.
- Postgres (Railway managed addon — planned, not yet deployed)

**Frontend (`/web`)**
- TypeScript
- Next.js 16 (App Router, Turbopack)
- React
- Tailwind CSS v4
- `next/font` (self-hosted JetBrains Mono)
- `next/og` (`ImageResponse`) — used in `web/src/app/icon.tsx` (2026-07-08) to code-generate the site favicon (black circle, accent-color `$`) at build time, replacing the static `favicon.ico`; no image editor involved.
- `leaflet` / `react-leaflet` / `react-leaflet-cluster` (2026-07-11) — the interactive map on `/narrative/farpost-atlas`, rendering clustered building markers and a GeoJSON rural-density overlay. Chosen over Mapbox/Azure Maps specifically because it needs no API key or vendor account; OpenStreetMap tiles. `AtlasMap.tsx` is dynamically imported with `ssr: false` (via a thin `"use client"` loader wrapper) since Leaflet touches `window` at module-evaluation time.
- `lucide-react` (2026-07-15, `site-theme-toggle`) — this site's first icon-library dependency, a single tree-shaken `Lightbulb` import for the new light/dark theme toggle in `Header.tsx`. Chosen over an emoji glyph (Robin's own ask was "a simple icon") for consistent cross-browser/OS rendering and a stroke color that cleanly reflects lit/dimmed state.

**Portfolio pieces (`pieces/`)** — see `CLAUDE.md`'s "Portfolio piece isolation" convention for why these live outside `api/`
- `pieces/farpost-pulse-func/` (2026-07-10) — Node.js 22, Azure Functions v4 programming model (`@azure/functions`), targeting the already-provisioned `farpost-pulse-func` Azure resource (Flex Consumption). Four HTTP-triggered, anonymous-auth endpoints backing `/narrative/farpost-pulse`'s three routes; called directly from the browser (no proxy through this repo's own `/api`) via `NEXT_PUBLIC_FARPOST_PULSE_API_URL`.
- Azure Cosmos DB (NoSQL API, `@azure/cosmos` SDK) — `farpost-pulse-cosmos` account, three containers (`techs`, `jobs`, `coachingHistory`). Real cloud dependency once deployed; source code is git-tracked in this repo, the Cosmos DB connection string is not (Function App application setting only).
- Azure OpenAI (Foundry project `rgsamways-0644`) — provisioned but not yet called; `generateCoachingTip()` runs against a mocked/templated function until the model deployment quota clears, isolated so the real call is a one-file swap later.
- `node:test` (Node's built-in test runner) — formalized 2026-07-10 (`add-automated-test-suites`) as this piece's test framework, replacing the two ad-hoc `scripts/{checkSeedShape,testHandlers}.js` with real `test/*.test.js` files (`npm test`). Zero new dependency — ships with the Node 20+ this piece already requires, deliberately chosen over Vitest to keep this piece minimal-dependency per "Portfolio piece isolation."
- `pieces/farpost-atlas-geo/` (2026-07-11) — Python, FastAPI, SQLModel, asyncpg (same stack as `api/`, deliberately a separate deployable per "Portfolio piece isolation"'s heavy-dependency trigger). `shapely` (an in-memory `STRtree` spatial index, built once at startup, queried on every `GET /api/buildings/{id}` for a real point-in-polygon rurality lookup) is a genuine runtime dependency, unlike `geopandas` (see One-off tools below, ingestion-only). Backs `/narrative/farpost-atlas`'s two routes; called directly from the browser via `NEXT_PUBLIC_FARPOST_ATLAS_API_URL`.
- Statistics Canada 2021 Census Dissemination Area cartographic boundary data (`lda_000b21a_e.zip`, ~197 MB, all of Canada) and table 98-10-0015-01 (population/dwelling counts and density by DA) — real government open data, spatially filtered down to North Hastings, Ontario's 37 Dissemination Areas at ingestion time (see `pieces/farpost-atlas-geo/scripts/ingest_boundaries.py`). The processed output (`pieces/farpost-atlas-geo/data/da_boundaries_north_hastings.geojson`, ~130 KB) is what's actually checked in and loaded at runtime.
- `pieces/farpost-dispatch-sf/` (2026-07-12) — Salesforce DX/Apex, the fourth "Portfolio piece isolation" instance and the first with a genuinely different platform (not a separate cloud service calling into `web/`, but application logic that only runs inside Salesforce itself). Custom fields on Contact, a `Job__c` object, `JobMatchingService`/`JobClaimService`/`OpenJobsController` Apex classes with `HttpCalloutMock`-covered test classes, and two Lightning Web Components. No local Salesforce CLI/runtime existed while authoring this piece — the Apex is real, hand-authored, structurally reviewed source, not yet deployed or test-run; that's Robin's own verification step (see `docs/deployment-guide.md` Part 8c).
- Experience Cloud, Partner Community licenses — the external-user portal a Professional (a real Partner Community-licensed Contact) logs into to see and claim their own matching Jobs. Confirmed real, free, unused licenses directly in the Developer Edition org (Setup → Company Information → User Licenses) before scoping this piece — no Guest User fallback needed.
- Named Credentials (`Anthropic_API`) — the Apex-side callout to Anthropic's Messages API, the same endpoint `api/app/ai.py` calls from Python, now called from the opposite direction (Apex calling out, not an external service calling into Salesforce). Uses the classic single-object `NamedCredential` metadata type (`customHeaders` for `x-api-key`/`anthropic-version`) rather than the newer split `ExternalCredential`/`NamedCredential` model, a deliberate choice made without deploy access to verify the newer model's schema — see `pieces/farpost-dispatch-sf/README.md`.

**Hosting / infra (planned, not yet live)**
- Vercel — `/web`
- Railway — `/api` + Postgres
- Azure — `pieces/farpost-pulse-func/` (Function App) + Cosmos DB, deployed independently of Vercel/Railway
- Railway — `pieces/farpost-atlas-geo/` (Python service) + its own Postgres database, deployed independently, per "Portfolio piece isolation" (provisioning is Robin's manual step — see `docs/issues.md`)
- Cloudflare — DNS
- GoDaddy — domain registration + `.com` → `.ca` forwarding

## Dev & build tooling
- npm / `create-next-app`
- ESLint
- Python `venv` / pip
- OpenSpec — spec-driven change workflow (`openspec/`)
- **scc** (Sloc Cloc and Code, `boyter/scc`, 2026-07-10) — code volume/complexity/redundancy (DRYness) metrics, snapshotted to `docs/metrics.md` at every OpenSpec archive (see `CLAUDE.md`). Not an npm/pip package — a standalone Go binary. `choco install scc` / `winget install --id benboyter.scc` both work with admin rights; installed here via the [direct release binary](https://github.com/boyter/scc/releases) instead, since this shell doesn't have elevated rights for Chocolatey. Currently at `c:/dev/tools/scc/scc.exe`, outside the repo — not on `PATH` by default.
- **Salesforce CLI** (`sf`, 2026-07-12) — deploys `pieces/farpost-dispatch-sf/`'s DX project source (`sf project deploy start`), runs its Apex test classes (`sf apex run test`), and runs the fictional-data seed script (`sf apex run --file scripts/apex/seed.apex`). Not installed in the environment this piece was authored in — no local Salesforce runtime existed to deploy/run any of it before handoff; installing it and authenticating to the Developer Edition org is Robin's own first step (`docs/deployment-guide.md` Part 8c).

## Testing & verification
See `docs/testing.md` for the full consolidated picture — what tool covers which layer, and why.

- **Playwright** (`@playwright/test`, Chromium, occasionally Firefox) — first used 2026-07-07 as an ad hoc verification tool, and the recurring method since for browser-driven UI verification (navigation, interaction, mobile viewports, screenshots). Formalized as a real, committed `web/e2e/` suite (`playwright.config.ts`, `npm run test:e2e`) as of the `add-automated-test-suites` change (2026-07-10) — no longer just ad hoc scripts thrown away after one run.
- **Vitest** (`vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/dom`, `vite-tsconfig-paths`) — added 2026-07-10 (`add-automated-test-suites`) as `web/`'s unit test runner, per Next.js's own documented Vitest setup guide. `npm run test` (single run) / `npm run test:watch`.
- **pytest** — added 2026-07-10 (`add-automated-test-suites`) as `api/`'s test runner; installed via a new `api/requirements-dev.txt` (which layers on top of `requirements.txt`) rather than the production `requirements.txt` Railway actually deploys from, so it's dev-only. `api/pyproject.toml` sets `pythonpath = ["."]` so `from app...` imports resolve regardless of how pytest is invoked. Run via `pytest` from `api/`. `pieces/farpost-atlas-geo/` follows the same pattern (2026-07-11) — its tests run against a real (if lightweight) SQLite database, not a mocked persistence layer, since `TrackedBuilding`/`TrackedRecord` querying is itself the thing worth integration-testing there; `aiosqlite`/`pytest-asyncio` are dev-only too.

## One-off / ad hoc tools
Reached for to accomplish a specific task, not part of the running app.

- **PyMuPDF** (`pymupdf` / `fitz`) — used 2026-07-07 by CLI to extract the headshot image directly out of `resume.pdf` into `web/public/images/headshot.png`.
- **pikepdf** — briefly evaluated 2026-07-07 as an alternative for the same PDF image extraction; not what ended up being used.
- **Docker** — used 2026-07-07 to run a local Postgres container for verifying the FastAPI + SQLModel + asyncpg wiring end-to-end before cleanup.
- **psql** — used 2026-07-07 to manually confirm Postgres connectivity during local testing.
- **.NET `System.Drawing` (via PowerShell)** — used 2026-07-08 to read the actual pixel dimensions of the 6 `SETUP_GALLERY` screenshots (neither PIL nor a JS image library was on hand), so `next/image`'s `width`/`height` props could reflect each image's real aspect ratio rather than an assumed one.
- **GeoPandas** (`geopandas`, `pyogrio`, `pyproj`) — used 2026-07-11 in `pieces/farpost-atlas-geo/scripts/ingest_boundaries.py` to reproject Statistics Canada's DA boundary file from NAD83/Lambert to WGS84, spatially filter to North Hastings, simplify geometry, and join population-density figures. Deliberately kept out of the deployed service's `requirements.txt` (a separate `requirements-ingest.txt`) — this is a genuine one-time, local-only ingestion step per design.md, not a runtime dependency; only its small GeoJSON output ships.
- **OpenStreetMap Nominatim API** — used 2026-07-11 (same ingestion script) to fetch real municipal boundary polygons for North Hastings' seven constituent municipalities, used to spatially scope the national StatCan DA file down to North Hastings without needing StatCan's own, much larger Census Subdivision boundary file. A free, keyless public API; results cached to `pieces/farpost-atlas-geo/data/raw/` so re-running the ingestion script doesn't re-hit it unnecessarily.

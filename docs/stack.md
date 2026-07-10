# Technology stack

Exhaustive, running list of every technology, library, and tool used to build and ship this site — including one-off dev-time tools that never become a runtime dependency (e.g. something CLI reaches for once to accomplish a task, like extracting an image from a PDF). Update this whenever anything new gets introduced, however small. Last updated: 2026-07-07.

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

**Portfolio pieces (`pieces/`)** — see `CLAUDE.md`'s "Portfolio piece isolation" convention for why these live outside `api/`
- `pieces/farpost-pulse-func/` (2026-07-10) — Node.js 22, Azure Functions v4 programming model (`@azure/functions`), targeting the already-provisioned `farpost-pulse-func` Azure resource (Flex Consumption). Four HTTP-triggered, anonymous-auth endpoints backing `/narrative/farpost-pulse`'s three routes; called directly from the browser (no proxy through this repo's own `/api`) via `NEXT_PUBLIC_FARPOST_PULSE_API_URL`.
- Azure Cosmos DB (NoSQL API, `@azure/cosmos` SDK) — `farpost-pulse-cosmos` account, three containers (`techs`, `jobs`, `coachingHistory`). Real cloud dependency once deployed; source code is git-tracked in this repo, the Cosmos DB connection string is not (Function App application setting only).
- Azure OpenAI (Foundry project `rgsamways-0644`) — provisioned but not yet called; `generateCoachingTip()` runs against a mocked/templated function until the model deployment quota clears, isolated so the real call is a one-file swap later.

**Hosting / infra (planned, not yet live)**
- Vercel — `/web`
- Railway — `/api` + Postgres
- Azure — `pieces/farpost-pulse-func/` (Function App) + Cosmos DB, deployed independently of Vercel/Railway
- Cloudflare — DNS
- GoDaddy — domain registration + `.com` → `.ca` forwarding

## Dev & build tooling
- npm / `create-next-app`
- ESLint
- Python `venv` / pip
- OpenSpec — spec-driven change workflow (`openspec/`)
- **scc** (Sloc Cloc and Code, `boyter/scc`, 2026-07-10) — code volume/complexity/redundancy (DRYness) metrics, snapshotted to `docs/metrics.md` at every OpenSpec archive (see `CLAUDE.md`). Not an npm/pip package — a standalone Go binary. `choco install scc` / `winget install --id benboyter.scc` both work with admin rights; installed here via the [direct release binary](https://github.com/boyter/scc/releases) instead, since this shell doesn't have elevated rights for Chocolatey. Currently at `c:/dev/tools/scc/scc.exe`, outside the repo — not on `PATH` by default.

## Testing & verification
See `docs/testing.md` for the full consolidated picture — what tool covers which layer, and why.

- **Playwright** (with Chromium, occasionally Firefox) — first used 2026-07-07, and the recurring method since for browser-driven UI verification (navigation, interaction, mobile viewports, screenshots). Not a one-off despite where it used to be filed.

## One-off / ad hoc tools
Reached for to accomplish a specific task, not part of the running app.

- **PyMuPDF** (`pymupdf` / `fitz`) — used 2026-07-07 by CLI to extract the headshot image directly out of `resume.pdf` into `web/public/images/headshot.png`.
- **pikepdf** — briefly evaluated 2026-07-07 as an alternative for the same PDF image extraction; not what ended up being used.
- **Docker** — used 2026-07-07 to run a local Postgres container for verifying the FastAPI + SQLModel + asyncpg wiring end-to-end before cleanup.
- **psql** — used 2026-07-07 to manually confirm Postgres connectivity during local testing.
- **.NET `System.Drawing` (via PowerShell)** — used 2026-07-08 to read the actual pixel dimensions of the 6 `SETUP_GALLERY` screenshots (neither PIL nor a JS image library was on hand), so `next/image`'s `width`/`height` props could reflect each image's real aspect ratio rather than an assumed one.

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

**Hosting / infra (planned, not yet live)**
- Vercel — `/web`
- Railway — `/api` + Postgres
- Cloudflare — DNS
- GoDaddy — domain registration + `.com` → `.ca` forwarding

## Dev & build tooling
- npm / `create-next-app`
- ESLint
- Python `venv` / pip
- OpenSpec — spec-driven change workflow (`openspec/`)

## One-off / ad hoc tools
Reached for to accomplish a specific task, not part of the running app.

- **PyMuPDF** (`pymupdf` / `fitz`) — used 2026-07-07 by CLI to extract the headshot image directly out of `resume.pdf` into `web/public/images/headshot.png`.
- **pikepdf** — briefly evaluated 2026-07-07 as an alternative for the same PDF image extraction; not what ended up being used.
- **Playwright** (with Chromium) — used 2026-07-07 for automated screenshot-based visual verification of the homepage and placeholder routes against the resume PDF.
- **Docker** — used 2026-07-07 to run a local Postgres container for verifying the FastAPI + SQLModel + asyncpg wiring end-to-end before cleanup.
- **psql** — used 2026-07-07 to manually confirm Postgres connectivity during local testing.
- **.NET `System.Drawing` (via PowerShell)** — used 2026-07-08 to read the actual pixel dimensions of the 6 `SETUP_GALLERY` screenshots (neither PIL nor a JS image library was on hand), so `next/image`'s `width`/`height` props could reflect each image's real aspect ratio rather than an assumed one.

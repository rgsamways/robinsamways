## Why

Robin has a pre-recorded video interview for Application Architect – CRM & LOS at Servus Credit Union on 2026-07-09. He wants a live personal site at robinsamways.ca to support that push, and it doubles as a standing portfolio piece demonstrating hands-on experience with major developer APIs (starting with Salesforce, relevant to the Servus role). The site needs to exist and be deployable before anything else can be layered on top of it.

## What Changes

- Add a monorepo layout with `/api` (FastAPI + Postgres via SQLModel) and `/web` (Next.js + TypeScript + Tailwind) subdirectories.
- Replace the current Python-only `.gitignore` with a merged Python + Node/Next.js version.
- Build a homepage that visually replicates Robin's resume PDF: terminal/dev aesthetic, monospace font, one amber/orange accent color, Markdown-style section headers, skills box, headshot, code-comment footer.
- Add a header nav menu (client-side toggle) linking to three placeholder pages: Portfolio, Farpost, Thoughts on programming.
- Stand up a minimal FastAPI skeleton (health check endpoint, Postgres connection via SQLModel, Railway-ready config) — no business endpoints yet.
- Stand up a minimal Next.js skeleton (Tailwind configured, deployable to Vercel) that renders the resume homepage and nav.

Explicitly out of scope for this change (deferred to a later change): the Salesforce OAuth2 integration and portfolio case study content, the Farpost case-study write-up content, the Thoughts/blog content, and the DNS/Cloudflare/GoDaddy cutover (all owned by Robin outside this repo or dependent on accounts he needs to create).

## Capabilities

### New Capabilities
- `resume-homepage`: The homepage that visually reproduces Robin's resume PDF (header, profile, experience, skills, education, continuing education, footer) using the terminal/monospace design language.
- `site-navigation`: The header menu component and the three placeholder routes it links to (Portfolio, Farpost, Thoughts).
- `web-foundation`: The Next.js + TypeScript + Tailwind app skeleton — project structure, build/dev scripts, Vercel deployment readiness.
- `api-foundation`: The FastAPI + Postgres (SQLModel) service skeleton — project structure, health check, DB connection config, Railway deployment readiness.

### Modified Capabilities
(none — this is the first change in the repo)

## Impact

- Affected code: entire repo (currently empty aside from `.gitignore`/`README.md`); creates `/web` and `/api` from scratch.
- Dependencies introduced: Next.js, React, TypeScript, Tailwind CSS (web); FastAPI, SQLModel, uvicorn, asyncpg/psycopg (api).
- No production deployment happens as part of this change — Railway/Vercel account linking and DNS cutover are follow-up steps Robin performs manually.

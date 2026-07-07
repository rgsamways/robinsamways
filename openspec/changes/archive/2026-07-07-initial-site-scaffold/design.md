## Context

New repo, currently just `.gitignore` (Python-only, needs merging) and a one-line `README.md`. This mirrors the structure of Robin's other project, Farpost (separate `farpost-api`/`farpost-web` repos, MongoDB/Beanie backend, Next.js frontend on Vercel, API on Railway), but deliberately smaller and consolidated: one monorepo, Postgres instead of MongoDB. Farpost's CLAUDE.md conventions (enum rules, notification-template rules, Twilio signature verification, etc.) are domain-specific to Farpost and do not apply here.

Driving constraint: Robin has an interview 2026-07-09. The homepage needs to be live-able quickly; Salesforce integration, Farpost case study content, Thoughts content, and DNS cutover are explicitly deferred to later changes so they don't block this one.

## Goals / Non-Goals

**Goals:**
- A deployable `/web` (Next.js) and `/api` (FastAPI) skeleton, monorepo, each independently deployable (Vercel / Railway).
- A homepage that is a faithful visual reproduction of Robin's resume PDF — this is the one piece of "real" content in this change.
- A working nav menu with three placeholder routes (Portfolio, Farpost, Thoughts) — empty/stub content is fine, the routes and nav interaction must work.
- `/api` skeleton must boot, connect to Postgres, and expose a health check — no business logic yet.

**Non-Goals:**
- No Salesforce OAuth2 integration or portfolio case-study content (separate change).
- No Farpost case-study write-up content, no Thoughts/blog content — placeholder pages only.
- No DNS/Cloudflare/GoDaddy work, no actual Railway/Vercel deployment — those are manual steps Robin performs outside this session.
- No CMS or database-backed content for the resume — resume content is static/hardcoded in this change (it changes rarely; a CMS would be premature).
- No auth, no user accounts — nothing in this scaffold requires them.

## Decisions

- **Monorepo with `/api` + `/web`, not two repos.** Farpost uses two repos because it's a larger, longer-lived product. This is a small solo portfolio site; one repo is less overhead. (Explicit instruction from the handoff brief.)
- **Postgres + SQLModel instead of MongoDB + Beanie.** Deliberate swap from the Farpost pattern. SQLModel is by the same author as FastAPI/Pydantic, so the ergonomics (model classes, async sessions) feel similar to Beanie despite the relational/document difference. Railway's managed Postgres addon is the target.
- **Resume content is hardcoded in React components, not fetched from the API.** The `/api` skeleton in this change has no content endpoints — it exists to prove the deployment path (health check + DB connectivity) so a later change can add real endpoints (e.g. Salesforce-backed) without re-plumbing infrastructure. Keeping resume text in the frontend avoids a round-trip and a DB dependency for content that rarely changes.
- **Single monospace font choice: JetBrains Mono**, loaded via `next/font` (self-hosted, no external request) to keep the terminal aesthetic consistent and avoid a FOUT/CLS penalty.
- **Nav menu is a simple client component (React state toggle), not a routing library or headless-UI dependency.** Three links don't justify an extra dependency.
- **Placeholder pages are real Next.js routes with minimal content** (e.g. "Portfolio — coming soon"), not 404s or external links, so the nav is fully functional and later changes just fill in content.

## Risks / Trade-offs

- [Resume visual fidelity is subjective and hard to verify without the source PDF at build time] → Treat the design description in the proposal/spec as the source of truth; ask Robin for a quick visual sanity check against the PDF before considering the homepage capability done.
- [Hardcoded resume content will drift from the PDF/LinkedIn over time] → Acceptable for v1; revisit with a CMS or data file only if edits become frequent.
- [SQLModel + async Postgres on Railway is a stack Robin hasn't used before on this project] → Keep the `/api` skeleton minimal (health check + one model) so any integration issues surface early and cheaply, before the Salesforce change adds real complexity.
- [No automated visual regression testing for the resume layout] → Out of scope for a solo portfolio site; manual review is sufficient at this scale.

## Migration Plan

N/A — greenfield repo, no existing users or data to migrate.

## Open Questions

- Exact headshot image file/format to use — Robin to supply from his resume assets when implementing.
- Final color hex value for the amber/orange accent — pick one during implementation and keep it as a single Tailwind theme token so it's a one-line change if Robin wants to adjust it.

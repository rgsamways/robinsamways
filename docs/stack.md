# Technology stack

Exhaustive, running list of every technology, library, and tool used to build and ship this site — including one-off dev-time tools that never become a runtime dependency (e.g. something CLI reaches for once to accomplish a task, like extracting an image from a PDF). Update this whenever anything new gets introduced, however small. Last updated: 2026-07-07.

## Production stack

**Backend (`/api`)**
- Python
- FastAPI
- SQLModel
- asyncpg
- uvicorn
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

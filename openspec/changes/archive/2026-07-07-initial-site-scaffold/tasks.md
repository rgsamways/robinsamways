## 1. Repo housekeeping

- [x] 1.1 Replace `.gitignore` with a merged Python + Node/Next.js version (add `node_modules`, `.next`, `.env*`, `.vercel`, `*.tsbuildinfo`, etc. alongside the existing Python entries)

## 2. Web foundation (`/web`)

- [x] 2.1 Scaffold a Next.js app (TypeScript, App Router, Tailwind) in `/web`
- [x] 2.2 Configure `next/font` to self-host JetBrains Mono
- [x] 2.3 Define the accent color as a single Tailwind theme token
- [x] 2.4 Verify `npm run build` and `npm run dev` both succeed with the default scaffold

## 3. API foundation (`/api`)

- [x] 3.1 Scaffold a FastAPI app in `/api` with SQLModel and a Postgres connection via `DATABASE_URL` env var
- [x] 3.2 Implement `GET /health` returning service + DB connectivity status
- [x] 3.3 Add dependency declaration (`pyproject.toml` or `requirements.txt`) and a Railway start command (`Procfile` or `railway.json`)
- [x] 3.4 Verify the app starts locally against a local/dev Postgres instance and `/health` returns 200

## 4. Resume homepage

- [x] 4.1 Build the header: `$ Robin Samways`, headshot top-right, horizontal rule beneath
- [x] 4.2 Build the Profile section
- [x] 4.3 Build the Experience section with all six roles, correct reverse-chronological order, right-aligned accent-colored date ranges, and `›` bullet line items (confirm Impres Pharma reads 2012 — 2025)
- [x] 4.4 Build the Skills section as a shaded box with accent-colored left border and aligned label/value rows
- [x] 4.5 Build the Education and Continuing Education sections
- [x] 4.6 Build the footer as a code comment with left/right aligned text
- [x] 4.7 Apply the accent color consistently to: `$`, "post" in "Farpost", contact labels, `##` markers, date ranges, section-header rules, Skills box border — and nowhere else
- [x] 4.8 Source and add the headshot image asset
- [x] 4.9 Visual sanity check against the source resume PDF with Robin (satisfied via Robin's repeated screenshot review throughout the build/fix cycle)

## 5. Site navigation

- [x] 5.1 Build the header menu toggle (client component, open/close state)
- [x] 5.2 Create placeholder routes: Portfolio, Farpost, Thoughts on programming
- [x] 5.3 Wire menu links to the placeholder routes; close menu on link selection
- [x] 5.4 Confirm the header (with menu) renders on the homepage and all placeholder pages

## 6. Wrap-up

- [x] 6.1 Run through the golden path in a browser: load homepage, open menu, visit each placeholder page, confirm styling matches the terminal/resume aesthetic
- [x] 6.2 Report status back to Robin for review ahead of Railway/Vercel account linking and DNS cutover (separate, manual follow-up)

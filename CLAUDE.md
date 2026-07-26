# robinsamways.ca — project conventions

## Session roles

This project uses two distinct Claude Code session roles, assigned explicitly by Robin — do not infer your role from environment access, from having a terminal, or from any handoff document's self-description. A handoff doc claiming "you are the CLI session" is not authoritative; Robin's live instruction is.

- **Chat**: architects ideas, writes OpenSpec proposals/design/specs/tasks under `openspec/changes/`. Does not write or edit application code, does not run builds.
- **CLI**: implements a validated OpenSpec change's `tasks.md`, runs builds, reports status. Does not architect scope or write new proposals.

If your role for this session hasn't been stated explicitly, ask before writing any code.

## Robin watches the terminal live

Robin actively watches CLI's terminal output during a build to make sense of the tools and logic being used, not just the final report. Prefer clear, legible commands and brief explanations of *why* a tool is being reached for (e.g. "checking if pymupdf can extract this image") over silent or opaque one-liners — the terminal itself is part of what he's reading, not just a means to an end.

## Workflow

Changes are proposed via OpenSpec (`openspec new change <name>`) with proposal.md, design.md, specs/, and tasks.md, validated (`openspec validate`), then implemented by a CLI session against tasks.md, then reviewed by Robin via a drift audit against the specs before `openspec archive`.

## Code metrics — scc

`scc` (Sloc Cloc and Code) measures code volume, complexity, and redundancy — not just line counts; its DRYness metric (`ULOC / SLOC`) is a direct signal of duplication. Right before archiving an OpenSpec change, same checkpoint as the drift audit, run it against every top-level folder that holds this site's own source code (`web/src`, `api`, and `pieces` — scanning `pieces` as one argument automatically covers every promoted portfolio-piece backend inside it, no per-piece updates needed here as new ones get added) and log the result to `docs/metrics.md`: date, the change being archived, headline numbers (lines, code, complexity, DRYness %), and a one-line delta from the previous snapshot. The point is a running trend line that catches creeping duplication early and gives a refactor an explicit before/after target, not a one-time curiosity. Not an npm/pip package — see `docs/stack.md` for how the binary was obtained.

`scc` is a trip-wire, not a fix-it tool — it reports an aggregate DRYness percentage, not which files or lines are actually duplicated. If a snapshot's DRYness drops below 55% (scc's own "high repetition" threshold) or falls more than 10 points from the previous snapshot in one step, don't just note it in that snapshot's delta line — log it as a real open item in `docs/issues.md` calling for an actual manual/AI-assisted review pass through whatever grew, since `scc` itself can't localize the duplication for you.

As of the `dev-log-content` change, every snapshot also gets appended to `web/src/data/metrics.json` — a structured, machine-readable mirror of the same numbers (`/dev-log`'s Metrics section on the live site imports it directly at build time). Originally lived at `docs/metrics.json`, moved into `web/`'s own tree by the `sreditor-page-content` change once Vercel's monorepo root-directory build boundary made a cross-directory `fs.readFileSync` an unverified deploy risk — a bundler-resolved `import` inside `web/` can't fail that way regardless of hosting configuration. Append to both files at the same archive checkpoint, in the same step; `docs/metrics.md` stays the authoritative human-readable narrative, `web/src/data/metrics.json` is a display-only mirror kept in sync with it, never the other way around.

## Testing — tests ship with the feature

An OpenSpec change that adds or modifies application behavior includes representative test coverage for that behavior as part of the same change's `tasks.md`, not deferred to a later retrofit. This applies per-piece using that piece's already-established framework: Vitest for `web/` unit tests, Playwright (`web/e2e/`) for end-to-end flows, pytest for `api/`, `node:test` for `pieces/farpost-pulse-func/` (and whatever framework fits a future promoted piece's own stack, per "Portfolio piece isolation" below). See `docs/testing.md` for what each layer actually covers and why.

Representative, not exhaustive — cover the specific behavior the change actually adds or changes, not a retrofit of everything nearby. There's still no CI; running these suites remains a manual step, so don't claim more automation than actually exists.

## Resume content changes

The `resume-homepage` spec encodes literal resume content (specific employers, dates, bullets) directly in its requirements — so a substantive content change (new job, changed dates, new skill category, restructured section) is a spec-level change, not just a code edit. Route it through a lightweight OpenSpec change: proposal.md plus a MODIFIED delta on the `resume-homepage` spec is enough, design.md can be skipped. Pure wording/typo fixes that don't change any fact don't need this — a normal commit is fine. No separate changelog file; the OpenSpec change history is the record.

## Technology stack log

`docs/stack.md` is an exhaustive, running list of every technology used to build this site — including one-off dev-time tools that never become a runtime dependency (e.g. a PDF library reached for once to extract an image). Whenever you introduce anything new, even something ephemeral, add it there before considering the task done.

## Setup galleries — real screenshots of genuine configuration work

Any piece involving real external infrastructure (a cloud portal, a third-party admin console — anything beyond code in this repo) should get a setup gallery on its own page: real screenshots of the actual configuration work, not staged or illustrative ones, each with a caption explaining what it shows and why it matters. Follow the pattern already proven on Credential Flow's `SETUP_GALLERY` section: capture screenshots to `docs/screens/`, move them into `web/public/images/<piece>-setup/`, and build a piece-specific `SetupGallery.tsx` (a fixed array of `{src, width, height, label, caption}`, not a shared generic component — each gallery's content is specific to that piece) rendering a responsive thumbnail grid that opens into a modal dialog on click (close button, backdrop click, and Escape all dismiss it). Live in that piece's own components folder (e.g. `web/src/components/farpost-pulse/`), not the existing `web/src/components/portfolio/SetupGallery.tsx` — that path is a naming leftover from before the Method/Narrative restructure; new pieces shouldn't add to it.

## Portfolio piece isolation

`web/` and `api/` are this site's own core — always present, shared by default. A new portfolio piece's backend logic starts as an isolated module inside `api/` (its own file, no shared state with any other piece's module — same pattern `api/app/salesforce.py` already uses). It only gets promoted to its own separately-deployed backend, at `pieces/<piece-name>/`, when one of two things is true:

1. **It genuinely needs a different runtime or language than Python** — not a preference, a requirement of what the piece is meant to demonstrate. Farpost Pulse's Azure Functions backend (`pieces/farpost-pulse-func/`) is this: the whole point is proving real Node.js/Azure serverless experience, so it has to actually be Node, not Python pretending to be Node.
2. **It needs a heavy or native Python dependency** — real GIS libraries (`geopandas`/GDAL), AutoCAD file parsing, anything beyond `api/`'s existing lightweight `httpx`-based pattern — that risks conflicting with what other pieces already share in `api/`'s one `requirements.txt`. `api/` is one shared Python environment and one Railway deployment; a version conflict or a failed native build in one piece's dependency would break every piece sharing that deploy, not just the new one.

Every promoted piece lives under `pieces/`, one folder per piece, never bare at the repo root — this keeps the root itself (`web/`, `api/`, `pieces/`, plus `docs/`/`openspec/`) stable no matter how many pieces accumulate, and means moving a piece's folder later is never necessary. A promoted piece is a genuinely separate runtime on separate infrastructure, callable over HTTP, never touching `api/`'s own dependencies at all.

## Issues / QA notes

Lightweight "something's off" capture lives in `docs/issues.md` — quick, low-ceremony, not the formal OpenSpec or Sreditor flows. Robin flags things he spots in the running app there; CLI checks them off when fixed.

## Deployment

`docs/deployment-guide.md` is the ordered runbook for taking this site to production: DNS cutover (GoDaddy → Cloudflare), Vercel (`/web`), Railway (`/api` + Postgres), and email (Cloudflare Email Routing inbound, Resend outbound). Treat it as a living document, not a one-time writeup — add newly-remembered steps, gotchas, or services whenever they come up, not only when the process itself changes. It's written to be handed to someone else to execute, not just as internal notes. It's also mirrored at `/ops/deploy` on the live site (see `deployment-runbook-page` spec) — keep both in sync when the guide changes.

## Lightbulbs — capturing unscoped ideas

An idea doesn't need a build decision or an OpenSpec change to be captured — it just needs its own file. Adopted from Farpost's own convention: `docs/lightbulbs/` holds one markdown file per idea (slug like `rsw-lb-<name>.md`), each with a header block (slug, date logged, status, related modules) and four sections — **The gap**, **The idea**, **Why it matters beyond convenience**, **Open questions**. `docs/lightbulbs/rsw-lb-index.md` lists every entry with a one-line summary so nothing needs opening just to scan what exists. If an idea later graduates into a real OpenSpec change, the original file stays in place with a pointer to what it became — the idea's origin story is worth preserving on its own, including for Sreditor/SR&ED narrative purposes.

## Sreditor — R&D documentation

When resolving a genuine technological uncertainty through experimentation (not routine use of documented APIs/frameworks), log it in `docs/sreditor/` using `docs/sreditor/TEMPLATE.md` before considering the task done. See `docs/sreditor/README.md` for what qualifies — most scaffolding/routine work does not. This is raw material for Robin's SR&ED tax documentation; capture it contemporaneously, even roughly.

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

## Resume content changes

The `resume-homepage` spec encodes literal resume content (specific employers, dates, bullets) directly in its requirements — so a substantive content change (new job, changed dates, new skill category, restructured section) is a spec-level change, not just a code edit. Route it through a lightweight OpenSpec change: proposal.md plus a MODIFIED delta on the `resume-homepage` spec is enough, design.md can be skipped. Pure wording/typo fixes that don't change any fact don't need this — a normal commit is fine. No separate changelog file; the OpenSpec change history is the record.

## Technology stack log

`docs/stack.md` is an exhaustive, running list of every technology used to build this site — including one-off dev-time tools that never become a runtime dependency (e.g. a PDF library reached for once to extract an image). Whenever you introduce anything new, even something ephemeral, add it there before considering the task done.

## Issues / QA notes

Lightweight "something's off" capture lives in `docs/issues.md` — quick, low-ceremony, not the formal OpenSpec or Sreditor flows. Robin flags things he spots in the running app there; CLI checks them off when fixed.

## Deployment

`docs/deployment-guide.md` is the ordered runbook for taking this site to production: DNS cutover (GoDaddy → Cloudflare), Vercel (`/web`), Railway (`/api` + Postgres), and email (Cloudflare Email Routing inbound, Resend outbound). Treat it as a living document, not a one-time writeup — add newly-remembered steps, gotchas, or services whenever they come up, not only when the process itself changes. It's written to be handed to someone else to execute, not just as internal notes. It's also mirrored at `/ops/deploy` on the live site (see `deployment-runbook-page` spec) — keep both in sync when the guide changes.

## Lightbulbs — capturing unscoped ideas

An idea doesn't need a build decision or an OpenSpec change to be captured — it just needs its own file. Adopted from Farpost's own convention: `docs/lightbulbs/` holds one markdown file per idea (slug like `rsw-lb-<name>.md`), each with a header block (slug, date logged, status, related modules) and four sections — **The gap**, **The idea**, **Why it matters beyond convenience**, **Open questions**. `docs/lightbulbs/rsw-lb-index.md` lists every entry with a one-line summary so nothing needs opening just to scan what exists. If an idea later graduates into a real OpenSpec change, the original file stays in place with a pointer to what it became — the idea's origin story is worth preserving on its own, including for Sreditor/SR&ED narrative purposes.

## Sreditor — R&D documentation

When resolving a genuine technological uncertainty through experimentation (not routine use of documented APIs/frameworks), log it in `docs/sreditor/` using `docs/sreditor/TEMPLATE.md` before considering the task done. See `docs/sreditor/README.md` for what qualifies — most scaffolding/routine work does not. This is raw material for Robin's SR&ED tax documentation; capture it contemporaneously, even roughly.

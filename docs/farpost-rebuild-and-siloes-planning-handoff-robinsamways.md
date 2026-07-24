# Handoff: Farpost rebuild + siloes planning, for robinsamways.ca

**What this file is:** a self-contained handoff, written during a Farpost work session
(2026-07-24), for a *different* project — Robin's personal portfolio site at
robinsamways.ca. It is not Farpost documentation and has no bearing on Farpost's own
specs, architecture, or build sequence. It exists at the Farpost repo root only because
that's where it was easiest to write it down. It should be picked up by a Claude Code
session working *inside* the robinsamways.ca project — Robin wants to combine it with
that session's own conversation into one coherent whole. Delete it from this repo once
that's done; don't delete anything from robinsamways.ca.

**How to use this file, if you are that future session:** read the whole thing before
continuing any siloes/rebuild-related work. It captures decisions and reasoning already
made tonight, much of which directly touches files already sitting in this very repo
(the Farpost session had direct write access to robinsamways.ca throughout) — so some of
this may already be visible in `CLAUDE.md`, `.gitignore`, `siloes/`, and
`docs/lightbulbs/`. This file's job is to explain *why*, in narrative form, so it can be
merged sensibly with whatever the other session already knows.

---

## 1. Farpost's actual current state (verified against real code tonight, not memory)

- 39 backend Beanie/MongoDB models, 39 frontend Next.js page routes, 75+ OpenSpec
  capability specs — a real, mature codebase, not a toy.
- Root identity problem found: "role" is modeled *twice*. `Professional` carries a
  `roles: list[str]` field, AND there are 10 separate per-role child tables (`adjuster`,
  `contractor`, `agent`, etc.) joined back by a bare string with no real foreign key.
  This happened because a later, correct architectural fix (`User` as root identity,
  `Professional`/`Owner`/`Admin` as role-memberships) landed on top of an earlier
  role-first design instead of replacing it.
- A generic person↔subject relationship pattern (`Stake`) already exists for
  property/building/asset relationships, but is bypassed in at least one known place
  (`StakeDispute.building_slug`).
- Recommended target pattern (mine, not yet confirmed final by Robin): collapse to one
  generic `Membership` table (user_id, type, role, status, granted_at) for "what is this
  person to Farpost," used with the same shape as `Stake` for "what do they relate to" —
  one pattern, no exceptions, replacing both the legacy per-role tables and any place
  `Stake` gets bypassed.

## 2. Decision: rebuild Farpost from scratch, as a robinsamways.ca silo

Robin's own diagnosis: the identity/roles model was "pieced together without a certain
goal" — confusion about whether buildings, properties, or assets were the core object
muddied how users should relate to any of them. Decision made: a full rebuild, not an
incremental fix, specifically because the root problem was a missing upfront goal, not
just messy code layered over time.

## 3. Tech stack decision for the Farpost rebuild

- **Off MongoDB, onto Postgres** — real foreign-key integrity and partial-unique
  constraints (things the current Mongo/Beanie schema fakes at the app level, e.g. a
  `User.slug` partial-filter-index workaround), plus PostGIS as a genuine geospatial
  upgrade over Mongo's geo support (dispatch-radius-matching currently does a Python-side
  haversine loop after narrowing in Mongo — PostGIS would do this natively).
- **Off Python/FastAPI, onto Node.js + TypeScript.**
- **Fastify, not Express** — deliberate, researched choice. Express had no major version
  between 2014 and Express 5 (October 2024), and lacked correct built-in async/await
  error handling until that release. Fastify was designed in 2016+ specifically to fix
  that plus schema-first validation and plugin encapsulation. Chosen knowing Express is
  still far more visible in job postings — a technical-merit-over-market-signal call,
  made deliberately, not an oversight.
- This converges Farpost onto the *same* stack Vocare's backend already runs
  (`c:\dev\vocare\backend\package.json`, verified directly): Fastify + Drizzle ORM +
  Postgres (`pg`) + better-auth. Vocare wasn't designed as "the reference stack" —  it was
  audited tonight and found to already *be* it.

## 4. Multi-project audit (real findings from tonight, not assumptions)

- **Vocare** (`c:\dev\vocare`): already Node/TS/Fastify/Drizzle/Postgres/better-auth,
  fully independent project with its own Railway + Vercel deployment. Doesn't need any
  part of this rebuild effort — it's already done, and isn't part of robinsamways.ca.
- **Sreditor** (`c:\dev\sreditor`): a TypeScript CLI npm package, not a web app with a
  schema — doesn't fit the "silo" pattern the same way pieces/products do.
- **Smallburg** (`c:\dev\smallburg`): has the identical Mongo/Python problem Farpost has.
  Deliberately deferred until the Farpost pattern is proven once, not tackled in
  parallel.
- **Mr.Commish**: no folder found under `c:\dev\` as of tonight — status/location
  unconfirmed, needs Robin to clarify.
- **Perche**: explicitly out of scope, left off the radar per Robin.

## 5. robinsamways.ca's own stack (verified tonight, this repo)

- `web/`: Next.js 16.2.10 + React 19.2.4 + TypeScript + Tailwind 4 — already aligned with
  where Farpost's frontend is headed.
- `api/`: Python/FastAPI + Postgres on Railway — **stays exactly as-is**, no change
  intended or needed. The existing "Portfolio piece isolation" CLAUDE.md rule already
  covers small demo modules needing a different runtime (e.g. Farpost Pulse's Node/Azure
  Functions piece under `pieces/`).

## 6. New "siloes/" convention added tonight — and a naming collision found + fixed

A new top-level `siloes/` directory (with README) and a new CLAUDE.md section, "Silo
isolation," were added this session to hold full standalone product rebuilds — bigger in
scope than a `pieces/` demo module, deployed independently, free to choose any stack.

**Important — a naming collision was discovered and reconciled tonight.** A *separate*
robinsamways.ca session had, the same day, already written
`docs/lightbulbs/rsw-lb-project-silos.md` (spelled "silos," no final "e"), describing the
*frontend* half of what turns out to be the same idea: each project gets a showcase
homepage under a "Work" nav group. Neither session knew about the other's work until the
Farpost session stumbled on that file while doing an unrelated task. Robin reconciled it
directly:

- **"Siloes" (with the e) is the correct spelling going forward.** The older file's
  slug/filename was left as-is (append-only convention), but it now has an "Update —
  2026-07-24" section pointing to this reconciliation.
- **The two halves are one unified feature, not two.** A silo's homepage shows project
  background/context, followed by the actual live working build of that project — and
  that live build *is* the real code in `siloes/<project>/`, not a mockup or separate
  embed. This also means a silo homepage supersedes any older standalone project page
  (e.g. `/farpost`, `/sreditor`) once it exists.
- **Shared navigation house style**, confirmed as deliberate and cross-project (not just
  a Farpost accommodation): a simple header (brand + UI effects) always surfacing
  sign-in/sign-up/sign-out (Lucide icon, text, or both depending on screen size), plus
  footer-based primary nav that translates cleanly to mobile — the same shape Vocare's
  real app already uses. The Farpost rebuild is meant to adopt this shape from day one,
  specifically so it drops cleanly into its silo homepage later.
- Both `CLAUDE.md`'s "Silo isolation" section and `rsw-lb-project-silos.md` now describe
  this consistently, each pointing at the other.

## 7. Git/repo mechanics for siloes (resolved tonight, no big restructure needed)

- Each silo stays a **fully independent git repo with its own GitHub remote** — the same
  pattern Farpost (`farpost-api`/`farpost-web`) and Vocare already use. No submodules, no
  subtrees.
- `siloes/<project>/` inside robinsamways.ca's own repo is just a local folder path for
  workspace convenience — robinsamways.ca's `.gitignore` now excludes `/siloes/*/`
  (keeping `/siloes/README.md` tracked) specifically so a real nested `.git/` folder
  doesn't get half-registered as a broken embedded-repo reference.
- The "silo homepage shows the live build" idea is a *linking/deployment* concern, not a
  git one — since each silo deploys independently, the homepage just needs to link to or
  embed that project's real live URL.
- **No migration needed right now.** The Farpost rebuild can `git init` fresh directly at
  `c:\dev\robinsamways\siloes\farpost\` with a brand-new GitHub repo whenever it actually
  starts — today's live Farpost repo (`c:\dev\farpost`, this repo) is untouched and keeps
  running as the current production system in the meantime. Vocare doesn't need to move
  either; it can stay at its current independent location and just be referenced.
- Recommended: a VS Code multi-root `.code-workspace` file spanning robinsamways.ca and
  each silo — Robin has done this before (`c:\dev\taplog-farpost-integration.code-workspace`
  already exists), so this would be the same habit applied to this project cluster.

## 8. Sanity check discussed tonight: is any of this novel?

Mostly no, and that's a good thing — named industry parallels worth knowing: this is a
**polyrepo** setup (independent repos/deploys) with a **local-only workspace nesting**
layered on top for convenience; narrowing to one converged stack across projects is
exactly what companies call a **"golden path"/"paved road"** (a Spotify-originated term);
the silo-homepage-per-project idea is structurally a personal-scale
**[Backstage](https://backstage.io)** (the CNCF developer portal built for exactly "one
catalog page per project, docs + links + live status"); and Farpost's OpenSpec
propose→validate→archive discipline mirrors **ADR/RFC-driven development**. The unusual
part isn't the mechanisms — it's applying this much process rigor to a solo personal
portfolio at all.

## 9. Dev-log / content ideas logged tonight (already written directly into this repo)

These already exist in `docs/lightbulbs/` in this repo (the Farpost session had direct
write access throughout tonight) — listed here just so the other session knows they
exist and doesn't re-derive them:

- `rsw-lb-ai-interview-format-mismatch-dev-log-entry.md` — honest entry on the mismatch
  between "learn by building" and a timed AI-interviewer format, using Farpost as
  counter-evidence.
- `rsw-lb-role-modeled-twice-dev-log-entry.md` — the "role modeled twice" schema lesson
  from section 1 above, framed as a generalizable design-drift story.
- `rsw-lb-fastify-vs-express-dev-log-entry.md` — the researched, against-the-grain
  Fastify decision from section 3.
- `rsw-lb-own-stack-discovery-dev-log-entry.md` — the Vocare stack-audit discovery from
  section 4, framed as "found my own stack by reading my own code."
- `rsw-lb-golden-path-backstage-parallel-dev-log-entry.md` — the section 8 parallel.
  Robin also wants this same insight adapted for his **resume**, **LinkedIn**, and a
  **new section on the robinsamways.ca homepage itself** — not yet drafted anywhere;
  whichever gets written first should be treated as the canonical version the others
  adapt from.

## 10. Open items — not yet decided

- The `Membership`/`Stake` unified schema pattern (section 1) is recommended, not
  confirmed final.
- Whether Vocare should ever physically relocate to `siloes/vocare/`, or permanently stay
  independent and just be referenced/linked.
- Showcase/theme treatment for `pieces/` is deliberately untouched for now — Robin said
  he'd revisit it later.
- Mr.Commish's actual status/location is unconfirmed.

---

## What to do when you're done

Once this has been read and combined with whatever the robinsamways.ca session already
knows, this file has served its purpose — delete it from the Farpost repo. Don't delete
anything from robinsamways.ca.

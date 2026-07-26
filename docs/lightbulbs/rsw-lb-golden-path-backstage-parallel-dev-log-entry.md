# rsw-lb-golden-path-backstage-parallel-dev-log-entry

**Slug:** rsw-lb-golden-path-backstage-parallel-dev-log-entry
**Date logged:** 2026-07-24
**Status:** scoped — became the `golden-path-not-planned` Dev Log entry on 2026-07-26 (`dev-log-topics` change) — the resume/LinkedIn/homepage versions noted in the 2026-07-24 update below remain unscoped
**Related:** `siloes/` convention (`CLAUDE.md`'s "Silo isolation"), the Farpost rebuild stack decision, `rsw-lb-own-stack-discovery-dev-log-entry`

## The gap

A visitor to the eventual silo homepages will see the *artifacts* (a project directory, a shared nav style, one converged tech stack) but nothing explaining the organizing philosophy behind them — or that it wasn't planned top-down, it was recognized after the fact as matching patterns real engineering orgs already use at scale.

## The idea

A Dev Log entry drawing the explicit parallel, discovered rather than planned: converging every project onto one stack (Fastify/Drizzle/Postgres/better-auth) is what companies call a "golden path" or "paved road" (a term popularized by Spotify, specifically to cut onboarding/maintenance cost); the silo homepages — one page per project, background plus a link to the live real thing — are structurally a personal-scale version of Backstage, the CNCF developer portal built for exactly that; and the OpenSpec propose-validate-archive discipline mirrors ADRs/RFC-driven development. Frame it as "I built this organically, then realized what it already was," not as if the plan came first.

## Why it matters beyond convenience

- Reads as more senior than "I organized my folders sensibly" — shows awareness of real platform-engineering patterns without having set out to copy them.
- Gives solo-project process rigor (drift-audits, spec discipline, DRYness tracking) a legible, named frame for a technical reader, instead of looking like unexplained overhead for a one-person project.
- Gives the `siloes/` convention a public narrative it doesn't currently have anywhere on the live site.

## Open questions

- Write this once the convention is actually proven out (Farpost rebuilt, at least one silo homepage live), or capture the "aha, this is basically Backstage" realization now, before it fades?
- Stand alone, or fold into `rsw-lb-own-stack-discovery-dev-log-entry` as a closing section — that entry is about discovering the *stack*, this one is about discovering the *organizing philosophy*; related but distinct enough to maybe stay separate.

## Update — 2026-07-24: not just a Dev Log entry

Robin wants this same insight to land in three more places, not just the Dev Log: **resume** (a bullet or summary line demonstrating platform-engineering awareness, not just feature-shipping), **LinkedIn** (likely as its own post, given the "golden path"/Backstage framing is punchy and self-contained), and a **new section on the robinsamways.ca homepage itself** (not just buried in Dev Log — something that greets a visitor directly with the organizing philosophy behind the whole site). All "at some point," not scoped or scheduled yet. Whichever gets written first (Dev Log, resume, LinkedIn, or homepage) should probably be treated as the canonical version the others adapt from, to avoid drafting the same insight four separate times from scratch.

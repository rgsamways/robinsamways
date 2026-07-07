# rsw-lb-rural-demographics-api

**Slug:** rsw-lb-rural-demographics-api
**Date logged:** 2026-07-07 (captured from a conversation on 2026-07-05)
**Status:** unscoped — idea captured, not yet spec'd
**Related:** future Portfolio page, Farpost's "40-Year Pulse" building-intelligence thesis, possible standalone repo

## The gap

The portfolio work planned so far (the Salesforce/LOS case study, [[rsw-lb-sreditor]]) all demonstrates *consuming* someone else's API or platform. Most developer portfolios do the same — CRUD apps, third-party API integrations. Being the one who *builds and operates* a public API, including its data pipeline (ingestion, cleaning, scheduling, normalization), is a differentiator that's underrepresented in typical portfolios and wasn't yet planned anywhere in this site's scope.

## The idea

Build a standalone **Rural Ontario Demographics API**: FastAPI + PostgreSQL, deployed on Railway (single-vendor pipeline, Robin already has an account). Ingests and normalizes public data — Statistics Canada census data, BuildForce Canada labor force forecasts, insurance premium trend data, and potentially municipal/provincial open data (land registry, tax assessment rolls) — into a clean relational schema (regions, years, metrics, values). Exposes filterable, documented endpoints (e.g. `/population/north-hastings?start_year=2010&end_year=2025`), API key auth, rate limiting, and a minimal demo UI (region + year range → chart/table) so the API has something visual to show, not just a Swagger page. Ingestion scripts (Python + pandas) open-sourced separately as their own contribution. GitHub repo run properly: clean commit history, strong README, Actions-based CI/CD.

Chosen deliberately over four other candidate portfolio ideas from the same conversation, kept here as a follow-up hit list once this one ships: an air-quality/home IoT monitor, an offline-first Android field-data-collection tool (parallels Farpost Scout), a sync system with conflict resolution (Supabase/CouchDB + WatermelonDB/Room), and a local-problem scraper/automation tool (permit data, property records).

Ties directly to Farpost's building-intelligence thesis: buildings age, populations shift, insurance risk changes with demographics — this is conceptually the data layer behind the "40-Year Pulse" longitudinal benchmark concept Farpost already has. Deliberate plan: build standalone first (own domain/subdomain, fully self-contained, faster to ship and demo independently), fold into Farpost later — accepting some duplicated work now in exchange for shipping speed.

Also draws on Robin's BA in Geography and his 2025 self-directed ML/health-data coursework (data cleaning, pivoting, handling missing values) — directly transferable to StatCan data wrangling, and a genuine personal-narrative hook rather than a generic tech demo.

## Why it matters beyond convenience

- Differentiates from the typical "I consumed an API" portfolio piece by being the API provider instead.
- Reusable, not throwaway — explicitly designed to fold into Farpost's building-intelligence layer later, so the effort compounds rather than being a one-off demo.
- Authentic personal hook: geography degree + real interest in population dynamics, not a generic CRUD-app portfolio filler.
- "Shreddable" in interviews — architecture, data pipeline, and design decisions are all easy to explain and defend live, which matters for the kind of Architect-level interviews Robin is doing.

## Open questions

- Does this live inside the `robinsamways.ca` monorepo (e.g. as a Portfolio subsection) or as its own standalone repo/subdomain? The captured plan explicitly says "own domain/subdomain, fully self-contained" for the initial build — worth deciding before scoping an OpenSpec change.
- Sequencing relative to the Salesforce case study and the Sreditor piece — which ships first?
- The conversation also captured a standing working-philosophy request: when Claude generates code for this project, it should explain *why* each piece is relevant to what employers currently ask for (data pipeline design, CI/CD, REST API principles, cloud deployment) — not just produce code, since Robin intends to personally understand/rewrite everything well enough to defend it in interviews. Worth deciding whether this becomes a standing `CLAUDE.md` convention once real coding starts here, or stays specific to this initiative.
- The captured portfolio-site visual direction (navy/orange, JetBrains Mono + Inter body text) predates and differs from what was actually built (single amber accent, JetBrains Mono throughout, no Inter) — the real implementation superseded this note; not a conflict to resolve, just noting the plan doc is now stale on that one point.

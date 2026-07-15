## Why

A handoff file (`docs/farpost-devlog-handoff-robinsamways.md`) already contains verified, real Farpost code and raw material for 10 dev-log entries showcasing engineering judgment to both developer and non-technical (recruiter) readers — it just hasn't been written into the site yet. At the same time, `/dev-log`'s four existing sections (Glossary, Testing & Verification, Metrics, Bug Log) have no way to jump between or isolate them since the page-local anchor menu was removed in `page-chrome-simplification`; a fifth section makes that gap more noticeable. `/techstacks` already proves a pill-filter pattern that fits this need well.

## What Changes

- Add a fifth `/dev-log` section, "Code Showcase," rendering all 10 entries from the handoff file, each entry's framing prose and callout copy written from the handoff's raw context notes (not pasted verbatim) to match the handoff's approved Entry 1 template shape: kicker (project · category · date) → title → 1-2 plain-language framing paragraphs → annotated code block(s) → "the fix" → "why this matters."
- The fix/why-this-matters structure and code blocks reuse this site's existing visual conventions instead of the handoff's raw inline-CSS format: Bug Log's existing labeled-subsection grammar ("The bug"/"The concept" → "The fix"/"Why this matters") and a relocated, shared version of the existing plain `CodeBlock` component (currently `web/src/components/ops/CodeBlock.tsx`, used only by `/ops/deploy`) — no new red/green callout styling, no hand-tokenized syntax-highlighting spans.
- Add a pill-style filter bar to `/dev-log`, visually and behaviorally modeled on `/techstacks`' existing pill bar: one pill per section (Glossary, Testing & Verification, Metrics, Bug Log, Code Showcase). Activating one or more pills shows only those sections; with no pills active, all sections show (same default as the `/techstacks` tag filter).
- New pure helper `filterSections.ts` (mirrors `techstacks/filterProjects.ts`) with its own Vitest unit test, and a new client component (mirrors `TechStacksBrowser.tsx`) that owns the pill state and conditionally renders the five section nodes passed to it from `page.tsx`.
- New Playwright e2e coverage (new spec or an extension of an existing one) for the pill bar: all five pills render, activating one hides the others, clearing all pills shows everything again.

## Capabilities

### New Capabilities
(none — this extends the existing Dev Log capability rather than introducing a new one)

### Modified Capabilities
- `dev-log-content`: adds the Code Showcase section (5th section, 10 entries) to the page's required sections, and adds the pill-style section filter bar as a formal requirement.

## Impact

- `web/src/app/dev-log/page.tsx` — renders a 5th section and delegates section visibility to the new filter component.
- `web/src/components/dev-log/` — new `codeShowcase.ts` (entry data), a new rendering component for Code Showcase entries, new `filterSections.ts` (+ test), new section-filter client component (+ e2e coverage).
- `web/src/components/ops/CodeBlock.tsx` — relocated to a shared, non-`ops`-specific path; `web/src/app/ops/deploy/page.tsx` updated to import from the new location.
- `openspec/specs/dev-log-content/spec.md` — modified requirements (see delta).
- `docs/metrics.md` + `web/src/data/metrics.json` — new `scc` snapshot appended at archive time.
- Out of scope: deleting the handoff file from the separate Farpost repo (Robin's own follow-up there); `openspec/specs/site-navigation/spec.md` (global hamburger menu is unaffected).

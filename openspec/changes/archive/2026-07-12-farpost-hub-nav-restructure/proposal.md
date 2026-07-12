## Why

The current top-level structure (Home / Method / Narrative / Farpost / Dev Log) organizes pages by *story type* — Method-type experiment writeups vs. Narrative-type case studies — a distinction that made sense when it shipped but has aged badly now that the site has real content to organize. Method has exactly one member (Sreditor) and has had exactly one the whole time. Narrative currently holds three pieces, two of which (Farpost Pulse, Farpost Atlas) are explicitly built as extensions of Farpost's own building-intelligence thesis and read oddly sitting one click away from `/farpost` under an unrelated index, while the third (Credential Flow) has no relationship to Farpost at all. Sreditor itself has grown into a real, separately-built product with its own real-world test results — it deserves a first-class destination, not a single entry inside a Method index that exists only to hold it.

Robin's replacement organizes by *subject* instead: Farpost becomes the umbrella for everything that's actually about Farpost (the origin story plus every tech-derived feature built for it), Sreditor gets promoted to its own top-level page, and everything genuinely unrelated to Farpost (Credential Flow today, more later) moves to a new Tech/Stacks section with its own browsing model. Method and Narrative disappear as concepts entirely.

## What Changes

- **Global nav** changes from `Home / Method / Narrative / Farpost / Dev Log` to `Home / Farpost / Sreditor / Tech/Stacks / Dev Log`. Method and Narrative are removed as destinations.
- **`/farpost` becomes a hub page** with a horizontal pill-tab bar (Origins, Atlas, Dispatch, Pulse) — each pill is a real navigation link, not a filter. Origins is the default view at `/farpost` itself (today's Origin Story/Problems Farpost Solves/Building Lifecycle Example/Process content, unchanged). Atlas and Pulse move here from `/narrative/farpost-atlas` and `/narrative/farpost-pulse`, keeping their own full sub-paths (`/farpost/farpost-atlas`, `/farpost/farpost-pulse`) and everything nested under them ([buildingId], [techId], dashboard). **Dispatch is a new, deliberately minimal placeholder page** (`/farpost/farpost-dispatch`) — the pill exists, the destination says "coming soon," matching the exact pattern used when Method/Narrative/Farpost/Dev Log were first stubbed out.
- **Sreditor is promoted to `/sreditor`**, a real top-level page, no longer nested under a Method index that's being removed. Its content is fully restructured from the current six-section Method-type shape (PROBLEM / EXISTING_APPROACHES / HYPOTHESIS / METHOD / RESULTS / CONCLUSION) into the same four-section shape Farpost's own page already uses: ORIGIN_STORY, PROBLEMS_SREDITOR_SOLVES, SRED_ELIGIBILITY_EXAMPLE, PROCESS — a deliberate parallel, not a coincidence; Sreditor and Farpost are now siblings in the nav, and reads as siblings in structure too. **This also absorbs and supersedes the still-pending, unapplied `sreditor-page-farpost-results` change** — its real content (Sreditor judged against Farpost's own 48-change OpenSpec history: one defensible claim, synthesized by rollup from three individually-ineligible changes; one near-miss) lands directly in SRED_ELIGIBILITY_EXAMPLE as part of this rewrite, rather than being applied once to the old six-section structure and immediately restructured again. That pending change's directory is removed, not archived, since none of its content was ever placed.
- **New `/techstacks` route** replaces Narrative's remaining role for pieces with no Farpost connection. Unlike Farpost's pill bar, Tech/Stacks' pill row is a multi-select *filter* — clicking a pill toggles it on/off and filters the project list shown below, without navigating away. Credential Flow moves here from `/narrative/credential-flow`, tags and content unchanged. Only one project exists here today; the filter has real pills from day one (Salesforce, OAuth 2.0, Anthropic AI — all genuinely used by Credential Flow — plus Azure, Python, TypeScript, PostgreSQL, AWS as forward-looking categories for future pieces) even though not every pill has a matching project yet.
- **`/method` and `/narrative` are removed entirely** — no redirect, no placeholder, the routes simply stop existing. The `method-index` and `narrative-index` capabilities are retired.
- **`project-page-navigation`'s parent-index-link requirement** is rewritten: a project page's local menu now links back to Farpost (for Atlas, Pulse, Dispatch) or Tech/Stacks (for Credential Flow) instead of Method/Narrative. Sreditor gets the same exemption Farpost already has (no parent link — it sits at the top nav tier itself).
- **BREAKING**: every existing `/method/*` and `/narrative/*` URL stops resolving. No redirects are in scope for this change (a genuinely fresh site with no external inbound links to preserve — flagged as an open question below in case that assumption is wrong).

## Capabilities

### New Capabilities
- `tech-stacks-index`: the `/techstacks` route — a multi-select pill-filter index of Narrative-type-but-not-Farpost-tied project pages, currently holding Credential Flow.

### Modified Capabilities
- `site-navigation`: global menu items change to Home/Farpost/Sreditor/Tech-Stacks/Dev Log; the "Placeholder routes exist for each menu item" requirement is rewritten to describe the new destinations instead of Method/Narrative indices.
- `farpost-page-content`: gains a new requirement describing the pill-tab hub navigation (Origins/Atlas/Dispatch/Pulse) and the Dispatch placeholder; its four existing content requirements (Origin Story, Problems Farpost Solves, Building Lifecycle Example, Process) are unchanged in substance — they now describe the Origins tab's content specifically.
- `farpost-pulse`: all three routes move from `/narrative/farpost-pulse*` to `/farpost/farpost-pulse*`.
- `farpost-atlas`: both routes move from `/narrative/farpost-atlas*` to `/farpost/farpost-atlas*`.
- `sreditor-page-content`: route moves from `/method/sreditor` to `/sreditor`; the required section structure changes from the six-section Method-type shape to a new four-section shape (ORIGIN_STORY, PROBLEMS_SREDITOR_SOLVES, SRED_ELIGIBILITY_EXAMPLE, PROCESS); content requirements rewritten to match.
- `project-page-navigation`: the parent-index-link requirement is rewritten to reference Farpost/Tech-Stacks instead of Method/Narrative; Sreditor gains the same no-parent-link exemption Farpost already has; the "Method's/Narrative's local menu links to its project pages" requirements are removed (their capabilities no longer exist) and replaced with an equivalent requirement for Tech/Stacks.

### Removed Capabilities
- `method-index`: the `/method` showcase index and its required six-section page structure are retired. Sreditor's page structure is redefined directly in `sreditor-page-content` instead.
- `narrative-index`: the `/narrative` showcase index is retired, split between `farpost-page-content` (for Farpost-tied pieces) and the new `tech-stacks-index` (for everything else).

## Impact

- Routes removed: `/method`, `/method/sreditor`.
- Routes moved: `/narrative/credential-flow` → `/techstacks/credential-flow`; `/narrative/farpost-pulse*` → `/farpost/farpost-pulse*`; `/narrative/farpost-atlas*` → `/farpost/farpost-atlas*`.
- Routes added: `/sreditor` (new location, rewritten content), `/techstacks` (new index), `/farpost/farpost-dispatch` (new placeholder).
- `/farpost` itself changes from a single scrolling page to a hub with a pill-tab bar; its existing content becomes the Origins tab, unchanged.
- New components needed: a pill-tab navigation bar (real links, Farpost's hub) and a pill-filter bar (multi-select toggle, Tech/Stacks) — distinct from each other and from the existing `HamburgerMenu` (per-page section-anchor menu, unchanged, still used on every individual page).
- Existing e2e specs (`global-navigation.spec.ts`, `farpost-atlas-map-flow.spec.ts`, `farpost-pulse-coaching-flow.spec.ts`) hardcode the old routes and need updating as part of this change, not a follow-up.
- `openspec/specs/method-index/` and `openspec/specs/narrative-index/` are deleted at archive time.
- New: `openspec/specs/tech-stacks-index/`.
- `openspec/changes/sreditor-page-farpost-results/` (pending, unapplied) is deleted as part of this change, its content absorbed here.
- No change to `api/`, Credential Flow's, Farpost Pulse's, or Farpost Atlas's own underlying functionality/backend — this is a navigation and content-structure change, not a functional rewrite of any piece.

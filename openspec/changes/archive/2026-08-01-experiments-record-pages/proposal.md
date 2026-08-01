## Why

Two problems, one fix. First, a real nav bug: the Experiments group renders a redundant middle node — `heading: "Experiments"` contains a single link also labeled "Experiments," which then contains Atlas/Dispatch/Pulse/Credential Flow — so the drawer visually reads as "Experiments > Experiments > Atlas." Work's own groups (Farpost, Vocare, Sreditor) don't have this problem because their heading's children are the projects themselves, not an intermediate relabeling.

Second, and the reason to fix it now rather than as a one-line rename: each Experiment currently lives on a single page bundling narrative, architecture, object model, and (where relevant) AI mechanics into one scroll — there's no equivalent of Work's ten-page project-record depth. Every employer evaluating a candidate right now is explicitly gauging AI knowledge, use, and mastery, and three of the four Experiments already have a real AI mechanic worth a dedicated page (Credential Flow's AI-assisted recommendations, Dispatch's Apex-native AI matching, Pulse's mocked-but-architected coaching-tip generator) — buried as one paragraph inside a single long page undersells that. Splitting each Experiment into its own project-record-style submenu gives AI usage, architecture, and real infrastructure setup room to each make their own case, the way Farpost/Vocare/Sreditor's submenu already does for build process.

## What Changes

- Fix the double-nested "Experiments > Experiments" node: the Experiments heading's links become Atlas, Dispatch, Pulse, and Credential Flow directly (mirroring Work's heading → Farpost/Vocare/Sreditor shape), plus a trailing "View All" link to `/techstacks` (mirroring Dev Log's existing "View All" pattern), preserving access to the filterable showcase index without an intermediate relabeling node.
- Give each of the four Experiments its own collapsible submenu of six new pages — **Tech Stack, Architecture, Object Model, Design Notes, AI Notes, Setup Gallery** — reachable the same way Farpost/Vocare/Sreditor's ten project-record pages are reachable today. Each Experiment's existing route (`/techstacks/farpost-atlas`, etc.) keeps rendering its current landing content unchanged and serves as that Experiment's "Overview," exactly as `/farpost` already does for Farpost — it is not duplicated as its own child link.
- Split each Experiment's existing single-page prose (object model, architecture, AI-mechanic sections already written into the `farpost-atlas`, `farpost-dispatch`, `farpost-pulse`, and `salesforce-loan-demo` specs) across the new pages rather than rewriting from scratch — this is substantially a reorganization of already-approved content, not new research, except where noted below.
- **AI Notes is genuinely new writing for all four**, not a reorganization: it covers both how AI tooling was used to build the piece (process) and how AI is used inside the piece itself (product), in that order.
  - Credential Flow and Dispatch have real AI product content to draw from already.
  - Pulse's coaching-tip generator is currently mocked pending Azure OpenAI deployment quota (per the existing `farpost-pulse` spec) — its AI Notes page must state that honestly, consistent with how Bug List and Testing & Verification already avoid overclaiming elsewhere on the site, not imply the tip generation is live AI today.
  - **Atlas has no AI mechanic at all today.** Per Robin's explicit direction, its AI Notes page ships as a stub for this change — an honest "not yet" placeholder plus a note that this is a known gap — while a follow-up change (not scoped here) works out how to genuinely bring AI into Atlas's geospatial piece.
- **Setup Gallery** is real, not new, for Credential Flow only — it already has one (`web/src/components/portfolio/SetupGallery.tsx`, screenshots at `web/public/images/salesforce-setup/`). This change moves it onto its own page and rebuilds it as a Credential-Flow-owned component (`web/src/components/credential-flow/SetupGallery.tsx`), since `CLAUDE.md` already flags the shared `portfolio/SetupGallery.tsx` path as a naming leftover new pieces shouldn't add to. Dispatch and Pulse need genuinely new galleries built from real screenshots Robin has to actually capture (Experience Cloud config; Azure Functions/Cosmos DB config) — this change can scope the page and component but not fabricate the screenshots. Atlas's gallery is an open question (see design.md) since it may not have a real external console step at all.

## Capabilities

### New Capabilities
None — every new page is scoped as additional requirements on the existing per-Experiment capability that already documents that piece (`farpost-atlas`, `farpost-dispatch`, `farpost-pulse`, `salesforce-loan-demo`), consistent with how those specs already carry page-level requirements for each Experiment's single existing route.

### Modified Capabilities
- `site-navigation`: Experiments' nav shape loses its redundant middle node, gains a trailing "View All" link, and each of Atlas/Dispatch/Pulse/Credential Flow becomes a collapsible group with its own six-page submenu.
- `farpost-atlas`: adds Tech Stack, Architecture, Object Model, Design Notes, AI Notes (stub), and Setup Gallery (open question) page requirements.
- `farpost-dispatch`: adds the same six page requirements, sourced substantially from its existing single-page content requirements.
- `farpost-pulse`: adds the same six page requirements; AI Notes must state the coaching-tip generator is currently mocked.
- `salesforce-loan-demo`: adds Tech Stack, Architecture, Object Model, and Design Notes page requirements.
- `salesforce-relationship-view`: adds the AI Notes page requirement (the real recommended-next-action AI feature already lives here, not in `salesforce-loan-demo`); modifies the existing Setup Gallery requirement to move it onto its own page under a Credential-Flow-owned component instead of the shared `portfolio/` one.

## Impact

- `web/src/components/DrawerNav.tsx` — nav data model changes: Experiments' `links` array is restructured, and a new `EXPERIMENT_RECORD_CHILDREN` helper (mirroring `PROJECT_RECORD_CHILDREN`) generates each Experiment's six-page submenu.
- `web/src/app/techstacks/farpost-atlas/`, `farpost-dispatch/`, `farpost-pulse/`, `credential-flow/` — six new route folders/pages each (24 total), plus content authored per the split described above.
- `web/src/components/credential-flow/SetupGallery.tsx` — new, migrated from `web/src/components/portfolio/SetupGallery.tsx`; that shared file's usage by Credential Flow is removed (the file itself may still be referenced elsewhere — confirm before deleting it).
- `web/src/components/farpost-dispatch/`, `farpost-pulse/` — new Setup Gallery components, blocked on Robin capturing real screenshots first.
- `openspec/specs/site-navigation/spec.md`, `farpost-atlas/spec.md`, `farpost-dispatch/spec.md`, `farpost-pulse/spec.md`, `salesforce-loan-demo/spec.md` — delta specs for the above.
- `web/e2e/global-navigation.spec.ts` — needs updating for the new nested submenu structure under Experiments.
- No change to any backend (`api/`, `pieces/farpost-pulse-func/`, the Salesforce org) — this change is presentation-layer only, reorganizing and extending existing documented facts about each piece, not changing what any of them actually do.

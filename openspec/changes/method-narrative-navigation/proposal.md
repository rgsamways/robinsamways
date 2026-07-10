## Why

The site currently files every portfolio proof-piece under one generic "Portfolio" index, but that conflates two structurally different kinds of pages: pieces that document a genuine technical experiment resolved through building something (Sreditor), and pieces that tell the story of something built for a specific real reason (Credential Flow, and the upcoming Farpost Pulse). Chronology ("old page" vs "new page") isn't the axis that actually matters to a visitor evaluating Robin's work — what kind of story a page tells is. Splitting Portfolio into two typed indexes, Method and Narrative, makes that distinction visible in the nav itself, and gives each category room to grow without further restructuring.

## What Changes

- Replace the "Portfolio" top-level nav item with two new top-level items, **Method** and **Narrative**, each a showcase index in the same structural shape Portfolio used (a typed array of project teasers + a local heading menu).
- Relocate Sreditor's existing placeholder page from `/sreditor` to `/method/sreditor`, listed as Method's first entry. Content unchanged.
- Relocate Credential Flow's existing content (previously "Salesforce Loan Demo") from `/portfolio/salesforce-loan-demo` to `/narrative/credential-flow`, listed as Narrative's first entry. Content and behavior unchanged (all 7 sections, live demo widget, relationship view) except the page's own heading and metadata title, which change from the stale "$ Portfolio" to "$ Credential Flow" — "Salesforce Loan Demo" survives as descriptive subtitle text on the Narrative index teaser, not erased, just demoted from title to description.
- Add a new placeholder route `/narrative/farpost-pulse`, listed as Narrative's second entry — same "coming soon" pattern Sreditor originally used. This is a nav slot only; the real Farpost Pulse build (a separate, already-scoped project) is explicitly out of scope here.
- Retire `/portfolio` and `/portfolio/salesforce-loan-demo` outright — no redirect, matching this site's existing tolerance for clean route retirement (no significant external inbound links yet).
- Add an optional `tags` field to each index's project-entry type, rendered as a small tag row under a project's teaser (e.g. "Salesforce · OAuth 2.0 · Anthropic AI" under Credential Flow) — a lightweight, non-nav way to signal tech stack per project, deliberately chosen over a third top-level nav tier.
- Formally spec, for the first time, the section-structure convention for future Method-type content: PROBLEM → EXISTING_APPROACHES → HYPOTHESIS → METHOD → RESULTS → CONCLUSION. This was previously only mentioned in a design doc's context notes and never became an actual requirement. Narrative-type pages remain free-form, following the case-study precedent Farpost and Credential Flow already established. Neither existing page's content is retrofitted by this requirement.
- **BREAKING**: `/portfolio` and `/portfolio/salesforce-loan-demo` stop resolving (no redirect).

## Capabilities

### New Capabilities
- `method-index`: the `/method` route's index-rendering mechanics, its extensibility for future entries, and the Method-type section-structure requirement (PROBLEM → EXISTING_APPROACHES → HYPOTHESIS → METHOD → RESULTS → CONCLUSION).
- `narrative-index`: the `/narrative` route's index-rendering mechanics, its extensibility, the optional `tags` field, and the Farpost Pulse placeholder entry.

### Modified Capabilities
- `site-navigation`: global menu list changes to Home / Method / Narrative / Farpost / Dev Log; Sreditor's placeholder route requirement moves under `/method/sreditor`; Portfolio's routes are retired; `/method` and `/narrative` are added as the new index routes.
- `portfolio-index`: this capability is retired in full — Portfolio as a concept no longer exists, superseded by `method-index` and `narrative-index`. Both of its existing requirements (Portfolio renders as a showcase index; Salesforce Loan Demo content lives at its own route) are removed.
- `project-page-navigation`: the Portfolio-specific local-menu requirement is replaced by two requirements (Method's local menu, Narrative's local menu); the project-page-local-menu scenario referencing Salesforce Loan Demo is updated to reference Credential Flow's new heading and route (its section list is unchanged); Farpost's requirement is untouched.
- `salesforce-loan-demo`: corrects a pre-existing stale route reference (still `/portfolio` from before the prior change's relocation to `/portfolio/salesforce-loan-demo`, never updated) to `/narrative/credential-flow`, and reflects the "Credential Flow" display rename.

## Impact

- New routes: `web/src/app/method/page.tsx`, `web/src/app/method/sreditor/page.tsx`, `web/src/app/narrative/page.tsx`, `web/src/app/narrative/credential-flow/page.tsx` (relocated from `web/src/app/portfolio/salesforce-loan-demo/page.tsx`, heading/title updated), `web/src/app/narrative/farpost-pulse/page.tsx`.
- Removed routes: `web/src/app/portfolio/page.tsx`, `web/src/app/portfolio/salesforce-loan-demo/page.tsx`, `web/src/app/sreditor/page.tsx` (moved, not duplicated).
- `web/src/components/MenuToggle.tsx`: global link list updated (Method, Narrative replace Portfolio and the top-level Sreditor entry).
- `web/src/app/farpost/page.tsx`, `web/src/app/dev-log/page.tsx`: untouched.
- `openspec/specs/site-navigation/spec.md`, `openspec/specs/project-page-navigation/spec.md`, `openspec/specs/salesforce-loan-demo/spec.md`: deltas as described above.
- `openspec/specs/portfolio-index/spec.md`: removed.
- New: `openspec/specs/method-index/spec.md`, `openspec/specs/narrative-index/spec.md`.

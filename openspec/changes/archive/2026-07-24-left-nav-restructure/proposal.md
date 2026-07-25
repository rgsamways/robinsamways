## Why

The left nav is a flat list of links with no room to express structure that already exists in the site's content — Farpost's four sub-pieces are reachable only through an on-page tab bar, Dev Log's five topics are only reachable by scrolling a single pill-filtered page, and Tech/Stacks' label no longer reflects what it actually indexes now that Farpost and Vocare exist as named ongoing projects. As the site grows into a multi-project record (per `docs/standard-methodology.md`'s siloes program) the nav needs to express two real levels — project/log, then the pages within it — the way Better Auth's own docs sidebar does, rather than staying flat until it becomes unusable.

## What Changes

- Add a collapsible-group left-nav data model: a nav entry can now have child links, rendered as a nested, expand/collapse-able list rather than a flat link, auto-expanded when the current route falls under one of its children.
- **BREAKING**: `DrawerNav.tsx`'s `NavGroup` shape changes from a flat `{heading, links}` list to support nested children under a link; any code reading the old flat shape needs updating.
- Add six new real routes under `/farpost`, reachable from a new collapsible "Farpost" entry in the Work group: Build Plan, Feature List, Tech Stack, Upgrade Path, Current Metrics, Outlook — a living record of the real Farpost rebuild happening in `siloes/farpost/`. The existing Atlas/Dispatch/Pulse demo routes and their tab bar are untouched; Build Plan and/or Feature List cross-link to them.
- Add a mirrored "Vocare" entry to the Work group with its own `/vocare` hub and the same six project-record pages, documenting the real Vocare build happening in its own separate, gitignored repository. Vocare has no existing demo pages to preserve or cross-link, unlike Farpost.
- Introduce a structured per-silo status-data-file convention (`web/src/data/farpost-status.json`, `web/src/data/vocare-status.json`, mirroring the existing `metrics.json` pattern) backing each project's Current Metrics page and Feature List's shipped/planned flags, so updating those two pages as the real silo build evolves is a data-file edit, not a prose rewrite. Build Plan, Tech Stack, Upgrade Path, and Outlook stay narrative, updated through the normal content-change cadence.
- Rename the "Tech/Stacks" left-nav label to sharpen it as an index of standalone experiments distinct from a named ongoing project (exact new label decided in design.md). No change to the page's route, content, or the `tech-stacks-index` capability's requirements.
- Restructure Dev Log from one page with five pill-filtered sections into a collapsible "Dev Log" left-nav entry with six real child routes: Bug Log, Metrics, Testing & Verification, Glossary, Code Showcase, and a new Lightbulbs section.
- Reframe the Glossary's content pitch from a flat "X, in layman's terms" dictionary into an explicit demonstration of translating technical decisions for non-technical stakeholders — same term/answer content, new framing copy.
- Split Code Showcase from a single filtered list into one real route per article, each carrying a visible UTC timestamp alongside its Eastern-time equivalent.
- Add a new Lightbulbs page surfacing this repo's existing `docs/lightbulbs/` idea-capture convention on the live site for the first time.

## Capabilities

### New Capabilities
- `farpost-project-record`: the six new Farpost sub-pages (Build Plan, Feature List, Tech Stack, Upgrade Path, Current Metrics, Outlook) documenting the real Farpost rebuild as a living, evolving record, reachable via the left nav's new collapsible Farpost submenu. Current Metrics and Feature List's shipped/planned flags are sourced from a structured status-data file rather than hand-maintained prose.
- `vocare-project-record`: a `/vocare` hub plus the same six project-record page shape, documenting the real Vocare build. No existing demo pages to cross-link, unlike Farpost.
- `dev-log-lightbulbs`: a new Dev Log sub-page surfacing `docs/lightbulbs/` idea-capture entries publicly for the first time.

### Modified Capabilities
- `site-navigation`: the nav gains a collapsible-group structure (Work > Farpost, Writing > Dev Log) with auto-expand on active route, and the Tech/Stacks label changes.
- `dev-log-content`: the five pill-filtered sections on one `/dev-log` page become six real child routes (adding Lightbulbs' entry point); Glossary's framing changes; Code Showcase becomes one route per article with UTC/Eastern timestamps instead of a single filtered list.

## Impact

- `web/src/components/DrawerNav.tsx` — nav data model and rendering logic (breaking shape change, expand/collapse state, active-route detection).
- `web/src/app/farpost/` — six new route folders/pages; new content authored for each.
- `web/src/app/vocare/` — a new hub route plus its own six project-record route folders/pages.
- `web/src/data/farpost-status.json`, `web/src/data/vocare-status.json` — new structured status-data files backing each project's Current Metrics and Feature List pages.
- `web/src/app/dev-log/page.tsx` and `web/src/components/dev-log/*` — split into per-topic route files; `CodeShowcaseSection.tsx` restructured into per-article routes; `glossary.ts` content reframed.
- New `web/src/app/dev-log/lightbulbs/` route surfacing `docs/lightbulbs/*.md`.
- `openspec/specs/site-navigation/spec.md` and `openspec/specs/dev-log-content/spec.md` — delta specs for the modified requirements.
- `web/e2e/global-navigation.spec.ts` and `web/e2e/dev-log-section-filter.spec.ts` — existing e2e coverage needs updating for the new route structure; new coverage needed for collapse/expand behavior.
- No change to `api/`, `siloes/farpost/`, or Vocare's silo content.

## 1. Nav data model foundation

- [x] 1.1 Extend `NavLink`/`NavGroup` types in `DrawerNav.tsx` to support optional nested `children`, with today's flat structure re-expressed in the new shape (no visible behavior change yet)
- [x] 1.2 Build a recursive `NavItem` component rendering a link plus, when it has children, a chevron toggle and an indented nested list
- [x] 1.3 Add expand state: a group is expanded by default when the current pathname matches it or any descendant, overridable per-session by clicking the chevron
- [x] 1.4 Verify existing nav entries with no children render identically to today (regression check before adding any new content)

## 2. Farpost project-record pages

- [x] 2.1 Create `web/src/data/farpost-status.json` (dated status snapshot fields for Current Metrics, plus a shipped/planned flag per feature for Feature List)
- [x] 2.2 Create `/farpost/build-plan` with provisional-framing intro copy and cross-links to `/farpost/farpost-atlas`, `/farpost/farpost-dispatch`, `/farpost/farpost-pulse` where relevant
- [x] 2.3 Create `/farpost/feature-list`, reading shipped/planned flags from `farpost-status.json`, cross-linking Atlas/Dispatch/Pulse where relevant
- [x] 2.4 Create `/farpost/tech-stack`, documenting the shared siloes baseline (Fastify/Drizzle/Postgres/better-auth) separately from any Farpost-specific stack items
- [x] 2.5 Create `/farpost/upgrade-path` with at least one concrete planned upgrade
- [x] 2.6 Create `/farpost/current-metrics`, rendering the dated snapshot from `farpost-status.json` narrated in `docs/metrics.md`'s style — no page-code change needed when the data file is later updated
- [x] 2.7 Create `/farpost/outlook` with forward-looking narrative distinct from Build Plan
- [x] 2.8 Wire the Farpost submenu (six pages above, in order) into `DrawerNav.tsx`'s Work group

## 3. Vocare project-record pages

- [x] 3.1 Create `web/src/data/vocare-status.json`, same shape as `farpost-status.json`
- [x] 3.2 Create `/vocare` hub: heading, short project-background blurb, links to its six pages below
- [x] 3.3 Create `/vocare/build-plan` with provisional-framing intro copy (no existing demo pages to cross-link)
- [x] 3.4 Create `/vocare/feature-list`, reading shipped/planned flags from `vocare-status.json`
- [x] 3.5 Create `/vocare/tech-stack`, documenting the shared siloes baseline separately from any Vocare-specific stack items
- [x] 3.6 Create `/vocare/upgrade-path` with at least one concrete planned upgrade
- [x] 3.7 Create `/vocare/current-metrics`, rendering the dated snapshot from `vocare-status.json`
- [x] 3.8 Create `/vocare/outlook` with forward-looking narrative distinct from Build Plan
- [x] 3.9 Wire the Vocare submenu (six pages above, in order) into `DrawerNav.tsx`'s Work group, alongside Farpost

## 4. Dev Log restructuring

- [x] 4.1 Convert `web/src/app/dev-log/page.tsx` into a hub: heading, intro blurb, and links to its six sub-pages — no topic content rendered inline
- [x] 4.2 Create `/dev-log/bug-log`, moving `BUG_LOG_ENTRIES` rendering there unchanged
- [x] 4.3 Create `/dev-log/metrics`, moving `MetricsDashboard` rendering there unchanged
- [x] 4.4 Create `/dev-log/testing-verification`, moving that copy there unchanged
- [x] 4.5 Create `/dev-log/glossary`, moving `GLOSSARY_ENTRIES` there, and rewrite the intro copy to frame the list as a communication-skill demonstration rather than a bare dictionary
- [x] 4.6 Remove the now-unused `SectionFilterBar`/pill-bar wiring from the old single-page Dev Log
- [x] 4.7 Wire the Dev Log submenu (Bug Log, Metrics, Testing & Verification, Glossary, Code Showcase, Lightbulbs, in order) into `DrawerNav.tsx`'s Writing group

## 5. Code Showcase per-article routes

- [x] 5.1 Define an article data shape (slug, title, kicker, UTC timestamp, framing paragraphs, code blocks, "The fix," "Why this matters") and migrate existing `CodeShowcaseSection` entries into it, assigning each a real UTC timestamp
- [x] 5.2 Add a timestamp-formatting utility rendering UTC alongside its Eastern-time equivalent via `Intl.DateTimeFormat` with `timeZone: "America/Toronto"` (handles EST/EDT automatically)
- [x] 5.3 Create `/dev-log/code-showcase` as an index listing every article (title, one-line teaser, UTC/Eastern timestamp)
- [x] 5.4 Create `/dev-log/code-showcase/[slug]` rendering one article's full content, matching the existing kicker/title/framing/code/"The fix"/"Why this matters" shape and visual styling shared with Bug Log
- [x] 5.5 Wire the Code Showcase submenu (one entry per article) into `DrawerNav.tsx`, nested under Dev Log

## 6. Lightbulbs page

- [x] 6.1 Build a small data source for the public Lightbulbs listing, adapted from `docs/lightbulbs/rsw-lb-index.md` (title/slug + one-line summary per entry, not raw internal markdown)
- [x] 6.2 Create `/dev-log/lightbulbs` rendering that listing
- [x] 6.3 For any entry whose source file notes it graduated into a real change, link to the resulting live site content
- [x] 6.4 Add Lightbulbs to the Dev Log submenu wired in task 4.7

## 7. Tech/Stacks rename

- [x] 7.1 Rename the left-nav label from "Tech/Stacks" to "Experiments"
- [x] 7.2 Update `/techstacks`'s page heading and metadata title to "Experiments" to match the new nav label (confirm with Robin first if this wasn't already settled — see design.md's Open Questions)

## 8. Test coverage

- [x] 8.1 Rewrite `web/e2e/global-navigation.spec.ts` for the collapsible structure: expand/collapse toggling, auto-expand on active route, manual-collapse override persisting, and every new route reachable from the nav
- [x] 8.2 Remove/replace `web/e2e/dev-log-section-filter.spec.ts` (pill bar is gone) with coverage for the new Dev Log hub and its sub-routes
- [x] 8.3 Add e2e coverage navigating to all six new Farpost sub-pages and all six new Vocare sub-pages via the left-nav submenus
- [x] 8.4 Add unit coverage for the UTC/Eastern timestamp-formatting utility, and e2e coverage for the Code Showcase index + at least one article route
- [x] 8.5 Add e2e coverage for the Lightbulbs route

## 9. Verification and cleanup

- [x] 9.1 Run the full Vitest and Playwright suites and fix any regressions
- [x] 9.2 Manually click through the full new nav structure at both mobile and desktop viewports
- [x] 9.3 Update `docs/stack.md` if any new one-off tooling was introduced while building this (none needed — no new dependencies)

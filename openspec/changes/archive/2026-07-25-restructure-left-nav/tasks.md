## 1. Resolve the open Lightbulbs question first

- [x] 1.1 Confirm with Robin whether `design.md`'s recommended default (retire the global Lightbulbs page; project-specific ideas move to that project's own Lightbulbs page; cross-project/meta ideas become ordinary Dev Log entries) is correct before touching any Lightbulbs content or routes.
- [x] 1.2 Audit every entry in `docs/lightbulbs/rsw-lb-index.md` and sort each into: Farpost-specific, Vocare-specific, Sreditor-specific, or cross-project/meta.

## 2. Status data files

- [x] 2.1 Extend `web/src/data/farpost-status.json` with new fields/arrays for Bug List, Testing & Verification, Lightbulbs (Farpost-specific entries from task 1.2), and Glossary.
- [x] 2.2 Extend `web/src/data/vocare-status.json` the same way, with Vocare-specific content.
- [x] 2.3 Create `web/src/data/sreditor-status.json` from scratch, covering all 10 project-record page fields (Build Plan, Feature List, Tech Stack, Upgrade Path, Current Metrics, Outlook, Bug List, Testing & Verification, Lightbulbs, Glossary) since Sreditor has never had this file before.
- [x] 2.4 While in `farpost-status.json`, fix the stale `deploymentStatus` field's `"siloes/farpost/"` wording (related cleanup debt noted in `proposal.md`'s Impact section — small enough to fold in here rather than opening a separate change).

## 3. New per-Work-project pages (12 routes)

- [x] 3.1 Build `/farpost/bug-list`, `/farpost/testing-verification`, `/farpost/lightbulbs`, `/farpost/glossary`, each sourced from `farpost-status.json` per the `farpost-project-record` spec deltas.
- [x] 3.2 Build the same 4 routes under `/vocare/*`, sourced from `vocare-status.json`, per the `vocare-project-record` spec deltas.
- [x] 3.3 Build all 10 routes under `/sreditor/*` (the existing hub gains links; Build Plan/Feature List/Tech Stack/Upgrade Path/Current Metrics/Outlook/Bug List/Testing & Verification/Lightbulbs/Glossary are all new), sourced from `sreditor-status.json`, per the new `sreditor-project-record` spec.

## 4. Experiments: consolidate pieces, remove the Farpost tab bar

- [x] 4.1 Move Atlas/Dispatch/Pulse's routes from `/farpost/farpost-atlas` (etc.) to `/techstacks/farpost-atlas` (etc.), per `tech-stacks-index`'s spec deltas.
- [x] 4.2 Add permanent redirects from every old `/farpost/farpost-atlas`, `/farpost/farpost-dispatch`, `/farpost/farpost-pulse` URL to its new `/techstacks/*` location.
- [x] 4.3 Add Atlas/Dispatch/Pulse teaser entries (with tags) to the `/techstacks` index, alongside the existing Credential Flow entry.
- [x] 4.4 Remove the `FarpostTabBar` pill-tab-bar component/usage from `/farpost` and its sub-pages, per `farpost-page-content`'s removed requirements.
- [x] 4.5 Adjust `/farpost`'s heading/intro-blurb/section-filter-bar layout now that the tab bar above it is gone, per `farpost-page-content`'s modified requirements.

## 5. Dev Log: flatten Code Showcase, retire superseded sub-pages

- [x] 5.1 Move each existing Code Showcase article from `/dev-log/code-showcase/<slug>` to `/dev-log/<slug>`, and update `/dev-log`'s hub listing to link directly to entries with no intermediate "Code Showcase" heading.
- [x] 5.2 Add permanent redirects from every old `/dev-log/code-showcase/<slug>` URL to its new `/dev-log/<slug>` location.
- [x] 5.3 Port any real existing content from `/dev-log/bug-log` into the correct project's new Bug List page (per task 1.2's audit — likely Sreditor's, per the original requirement's `docs/sreditor/` sourcing), then remove the old route with a redirect to `/dev-log`.
- [x] 5.4 Port any real existing content from `/dev-log/testing-verification` and `/dev-log/glossary` into the correct project(s)' new pages, then remove the old routes with redirects to `/dev-log`.
- [x] 5.5 Port Lightbulbs entries per task 1.2's audit: project-specific ones into that project's new `/lightbulbs` page, cross-project/meta ones into new ordinary Dev Log entries. Remove `/dev-log/lightbulbs` with a redirect to `/dev-log`.

## 6. Site: relocate Metrics

- [x] 6.1 Build `/metrics` rendering the same real scc-history content previously at `/dev-log/metrics`, per the new `site-metrics` spec.
- [x] 6.2 Add a permanent redirect from `/dev-log/metrics` to `/metrics`.

## 7. Nav structure

- [x] 7.1 Update `web/src/components/navTree.ts` / `DrawerNav.tsx`'s `NAV_GROUPS` to the new structure: Site (Home, Services, Metrics), Work (Farpost, Vocare, Sreditor — each with the 10-page submenu), Experiments (top-level; Atlas, Dispatch, Pulse, Credential Flow), Writing (Dev Log only, flattened entries), Ops (Deploy Runbook, unchanged).
- [x] 7.2 Verify auto-expand-on-active-route behavior still works correctly for the new group depths (Work's three project groups; Experiments as a new top-level collapsible group).

## 8. Tests

- [x] 8.1 Update/add Vitest coverage for `navTree.ts`'s expansion logic against the new group structure.
- [x] 8.2 Update/add Playwright coverage: Experiments is reachable as a top-level group; each Work project's submenu shows all 10 entries; old redirected URLs (Code Showcase articles, Dev Log Metrics/Bug Log/Testing/Glossary/Lightbulbs, Farpost-nested Atlas/Dispatch/Pulse) land on their correct new destinations.

## 9. Verification and archive

- [x] 9.1 Run the full build and both test suites; fix any failures.
- [x] 9.2 Manually click through the new nav tree end-to-end (every group, every submenu entry, every redirect) before considering this done.
- [x] 9.3 Drift-audit shipped behavior against every spec delta in this change before archiving, per this repo's own process.
- [x] 9.4 Run `scc` against `web/src` and log the snapshot to `docs/metrics.md` and `web/src/data/metrics.json`, per `CLAUDE.md`'s archive-checkpoint convention.
- [x] 9.5 Archive the change once drift-audited and metrics are logged.

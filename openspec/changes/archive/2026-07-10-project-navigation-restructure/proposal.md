## Why

The site's navigation model needs to evolve to support how Robin actually wants to organize his work going forward: Portfolio as a showcase index of individual one-off project pieces (each its own dedicated page), and Farpost/Sreditor promoted to top-level "graduated" projects — real products with their own developed vision, structurally the same kind of page as a Portfolio project but positioned outside the Portfolio index. Every top-level project page (Portfolio's index, each individual Portfolio project, Farpost, and eventually Sreditor) also needs its own local navigation — a hamburger menu beside the page's heading, distinct from the global site menu, linking to whatever that page's own children are (project pages, for an index; sections, for a project page itself).

Right now `/portfolio` conflates both roles at once — it directly renders the Salesforce Loan Demo case study rather than being an index that points to it, and there's no per-page local navigation pattern anywhere on the site, nor a nav slot for Sreditor.

## What Changes

- Extract a reusable, generic hamburger-menu component (button + dropdown link list) from the existing global `MenuToggle`, so the same interaction pattern can be reused for per-page local navigation without duplicating the UI logic.
- Add a per-heading local navigation menu next to the `<h1>` on `/portfolio`, `/portfolio/salesforce-loan-demo` (see below), and `/farpost` — each populated with links appropriate to that page (Portfolio's index links to individual project pages; a project page's own menu links to its own sections).
- Relocate the existing Salesforce Loan Demo case-study content (currently all of `/portfolio`) to its own route, `/portfolio/salesforce-loan-demo`, unchanged in content and behavior — this is a move, not a rewrite.
- Replace `/portfolio`'s content with a new, lightweight showcase index page: a short intro plus one teaser/hook entry (for now) linking to the Salesforce Loan Demo project page. Designed to hold more entries as future Portfolio projects (e.g. the rural-demographics-api idea) are built.
- Add **Sreditor** as a fifth entry in the global site menu (after Dev Log), with a new placeholder route at `/sreditor` (same "// coming soon" pattern Portfolio and Farpost both started with) — no per-heading local menu yet, since there are no sections to link to until real content exists.

## Capabilities

### New Capabilities
- `project-page-navigation`: the reusable per-heading hamburger menu component and its usage on Portfolio's index and the Salesforce Loan Demo project page.
- `portfolio-index`: Portfolio as a showcase listing page, and the relocation of the Salesforce Loan Demo case study to its own route.

### Modified Capabilities
- `site-navigation`: add Sreditor to the global menu and its placeholder route; update the existing "Portfolio route renders the Salesforce case study" requirement, since Portfolio now renders an index instead and the case study lives at its own sub-route.

## Impact

- `web/src/components/MenuToggle.tsx`: refactored to use the new extracted hamburger component rather than its own inline implementation; gains the Sreditor link.
- New route `web/src/app/portfolio/salesforce-loan-demo/page.tsx` (and its existing supporting components, unchanged in place under `web/src/components/portfolio/`).
- `web/src/app/portfolio/page.tsx`: rewritten as the showcase index.
- New route `web/src/app/sreditor/page.tsx`: placeholder.
- `web/src/app/farpost/page.tsx`: gains the per-heading local menu (content itself unchanged).
- `openspec/specs/site-navigation/spec.md`: delta as described above.

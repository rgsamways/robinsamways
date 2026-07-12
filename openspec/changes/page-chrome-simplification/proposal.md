## Why

The per-page local `HamburgerMenu` instances (jump-to-section links, plus Tech/Stacks' own local menu listing its project pages) existed to give a visitor a way to navigate within or between pieces when no other mechanism did. That's no longer true: Farpost's own pill-tab bar already handles piece-to-piece navigation, and Tech/Stacks' pill-filter-plus-card-list already handles project discovery. Robin flagged the local menus as "a distraction" after reviewing the live site. Separately, Farpost's hub page never got the one-line intro blurb Sreditor and Tech/Stacks both have, and its pill-tab bar currently sits above the heading rather than reading as part of the page's own intro block. Finally, the global identity header (name, title, contact info, headshot) scrolls away immediately on every page, losing the one piece of chrome most useful to keep visible while reading a long page.

## What Changes

- **Remove every local `HamburgerMenu` instance sitewide**: Farpost hub, Farpost Atlas, Farpost Pulse, Sreditor, Credential Flow, the Tech/Stacks index (its own project-list menu, not just the section-jump ones), and Dev Log. The global site menu (`site-navigation`, `MenuToggle`) is untouched — this only removes the per-page/local ones. The `HamburgerMenu` component itself stays, since `MenuToggle` still uses it.
- **Remove `SectionHeader`'s anchor-id mechanic** (`id` prop, `scroll-mt-4`) everywhere it's used — it only ever existed to support the jump-menus being removed. This touches Farpost, Sreditor, Farpost Atlas, Farpost Pulse, Credential Flow, Dev Log, `/ops/deploy`, and the homepage's resume sections. Confirmed via search that nothing in the codebase currently links to any of these `#anchor` fragments, so nothing functional is lost.
- **Add a one-line intro blurb under Farpost's "$ Farpost" heading** (new copy, drafted in design.md), matching the pattern already established on Sreditor and Tech/Stacks.
- **Move the pill-tab bar to sit below that new blurb**, instead of above the whole heading block.
- **Make the global identity header sticky at the `lg` breakpoint (1024px) and wider**; below that it scrolls normally with the page. A header this tall (headshot plus three lines of contact info) pinned on a phone or portrait tablet would eat too much vertical space.
- **Fix a pre-existing drift bug found while touching this area**: `salesforce-loan-demo`'s "Portfolio case-study content" and "Live demo widget on the Portfolio page" requirements still hardcode the retired `/narrative/credential-flow` route — never updated when `farpost-hub-nav-restructure` moved Credential Flow to `/techstacks/credential-flow`. The actual page content and route were already correct; only the spec text drifted.

## Capabilities

### Removed Capabilities
- `project-page-navigation`: every requirement in this capability describes either the local per-heading menu mechanism itself or a specific page's local menu (Farpost's, Tech/Stacks'). All are retired outright; no replacement capability.

### Modified Capabilities
- `farpost-page-content`: gains a new requirement for the intro blurb; the existing pill-tab-bar requirement's placement description changes from "above the heading" to "below the intro blurb."
- `sreditor-page-content`: the page-structure requirement drops its local-menu clause (the four-section structure itself is unchanged).
- `resume-homepage`: the header requirement gains sticky-at-`lg`-and-wider behavior.
- `salesforce-loan-demo`: corrects two requirements' stale `/narrative/credential-flow` route references to `/techstacks/credential-flow` — a drift fix, not new behavior.

## Impact

- Pages touched: `/farpost`, `/farpost/farpost-atlas`, `/farpost/farpost-pulse`, `/sreditor`, `/techstacks`, `/techstacks/credential-flow`, `/dev-log`, `/ops/deploy`, `/` (homepage resume sections), plus `web/src/components/Header.tsx`.
- Components: `SectionHeader` loses its `id`/`scroll-mt-4` behavior. `HamburgerMenu` itself is unchanged — only its per-page call sites are deleted.
- No route changes. No content-meaning changes beyond the new Farpost blurb and the `salesforce-loan-demo` route-reference correction.
- `openspec/specs/project-page-navigation/` is deleted at archive time (same handling as `method-index`/`narrative-index` in `farpost-hub-nav-restructure`).

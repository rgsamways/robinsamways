## Why

`/services` and `/farpost` both use `SectionFilterBar`'s pill filter to toggle which `SectionHeader` sections render — filtered-out sections are fully unmounted from the DOM, not just visually hidden. The right rail's "on this page" outline (`PageOutline.tsx`) only re-scans the page's headings on route change (`usePathname()`); toggling a pill never navigates, so the outline never notices the DOM actually changed. A visitor can filter a page down to one section while the outline still lists sections that are no longer there, or fails to show one that just reappeared.

## What Changes

- `PageOutline` re-scans whenever the page's rendered heading structure changes for any reason, not only on route change — via a generic DOM-mutation-based trigger, not a callback or context wired specifically to `SectionFilterBar`. This means any future in-page filtering mechanism gets outline sync for free, with zero coupling.
- The existing "outline needs 2+ sections to show at all" rule changes from an instantaneous count to "has this page view ever had 2+ sections" — once that's been true, the outline shows down to a minimum of 1 currently-visible entry while filtered; a page that never has more than 1 section, even after filtering, still shows nothing, preserving the original rule's intent.
- If the currently active (highlighted) section is filtered out, the active highlight clears rather than pointing at a stale entry.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `page-outline-nav`: the outline's re-scan trigger, its minimum-section-count gate, and active-section handling when a section disappears mid-session all change as described above.

## Impact

- `web/src/components/PageOutline.tsx` — adds a `MutationObserver`-based re-scan trigger, tracks the maximum section count observed this page view, resets `activeId` when it's no longer present after a re-scan.
- No change to `SectionFilterBar.tsx`, `PillBar.tsx`, `filterSections.ts`, or `TechStacksBrowser.tsx` — the fix is entirely on `PageOutline`'s side, by design (see design.md D1).
- Test coverage: new Playwright coverage on `/services` (the page with the most sections/pills) confirming the outline's entry count tracks pill toggles live, including the down-to-1 case and the active-section-cleared case.

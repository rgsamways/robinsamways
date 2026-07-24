## Why

The current header (a small hamburger dropdown plus a stacked light/dark toggle) doesn't take advantage of screen space on a laptop/desktop, and was designed before this site had more than a handful of pages. A left-drawer navigation plus a right-hand display-settings rail was already explored and validated at `/prototype/homepage-drawer` (an isolated, disposable mock — see `docs/design-system-handoff.md`). It's time to bring that proven interaction pattern to the real site so Robin can see and use it, rather than leaving it parked in a mock.

## What Changes

- Replace the header's hamburger dropdown (`HamburgerMenu.tsx`/`MenuToggle.tsx`) with a persistent left navigation drawer: sticky in-flow on desktop/laptop, a slide-out drawer with backdrop on mobile — the same responsive mechanism validated in the mock.
- Reorganize the flat six-link menu into grouped sections — **Site** (Home, Services), **Work** (Farpost, Tech/Stacks), **Writing** (Dev Log, Sreditor), **Ops** (Deploy Runbook) — surfacing `/ops/deploy` in navigation for the first time (it exists today but isn't linked anywhere). This grouping is a proposed default, easy to adjust in review, not a hard requirement.
- Add a right-hand display-settings rail: same responsive drawer mechanism, mirrored to the right, carrying the existing light/dark toggle repositioned out of the header stack.
- Applies across **every** page of the site, not just the homepage (the mock only ever wired up one page).
- **Explicitly not shipping yet**: the mock's 5-theme picker (Current/Handoff/Ad/Vocare/Farpost) and its "apply to whole site vs. selected silos" scope toggle. Those stay exactly where they are, in the isolated `/prototype` mock, untouched — real décor value for them shows up once project-silo pages exist to actually use different themes per project (see `docs/lightbulbs/rsw-lb-project-silos.md`). Shipping a multi-theme picker on the live portfolio site today, before there's a reason for a visitor to ever pick anything but the real look, isn't worth the scope right now. Flagged for review in case that read is wrong.

## Capabilities

### New Capabilities
(none — this reshapes existing navigation/theme behavior, it doesn't introduce a new concept)

### Modified Capabilities
- `site-navigation`: the hamburger-dropdown menu is replaced by a persistent, grouped left drawer; `/ops/deploy` becomes a linked route for the first time.
- `theme-toggle`: the light/dark toggle moves from directly-below-the-hamburger to the new right-hand rail; its behavior (persistence, no-flash, system-preference default) is unchanged.

## Impact

- `web/src/components/Header.tsx`, `HamburgerMenu.tsx`, `MenuToggle.tsx`, `ThemeToggle.tsx`: retired or substantially rewritten.
- New real (non-mock) components: a site-wide `DrawerNav` and `RightRail`, informed by the mock's validated interaction pattern but built fresh for real site-wide use — not a copy of the prototype's mock-specific components (which had mock-only concerns like in-page table-of-contents anchors and a 5-theme switcher that aren't part of this change).
- `web/src/app/layout.tsx`: restructured to accommodate persistent side columns site-wide, rather than the current single centered column.
- `docs/design-system-handoff.md` / the `/prototype/homepage-drawer` mock: unchanged, stays as the reference/testbed it already is.

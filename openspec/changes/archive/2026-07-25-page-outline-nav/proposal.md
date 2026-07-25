## Why

`left-nav-restructure`'s `design.md` explicitly deferred the right-rail "on this page" in-page-anchor outline menu (Better-Auth-style) as a Non-Goal — discussed in that session but never specced. Robin's original ask also mentioned "top-level menus" (now satisfied by the recursive collapsible nav tree that shipped) and "navigate to page anchors like Better Auth" (still open). Several real pages on the site already have enough internal structure to benefit: `/services` (7 sections), `/ops/deploy` (10), `/farpost/farpost-dispatch` (6), the homepage (6), and eight more pages with 3+ `SectionHeader` sections each — none of them currently offer a way to jump directly to a section or see where you are while scrolling.

## What Changes

- Add an "on this page" outline: a dismissible flyout panel, triggered by a new icon in the existing nav-icon set (`RightRail.tsx` — same slim icon-rail already holding the theme toggle and, as of `services-payments`' cleanup, the Sign In icon), listing the current page's sections as clickable anchor links and highlighting the one currently in view while scrolling.
- The icon only appears on pages that actually have something to outline — derived at runtime from the page's real headings, not a hand-maintained per-page list (the same anti-duplication principle just applied to `PageHeading`). A page with 0 or 1 `SectionHeader` sections shows no icon at all.
- `SectionHeader` (used by 21 pages today) gains a stable `id` on its `<h2>`, slugified from its `title`, so it becomes a real, individually linkable anchor target for the first time — currently it renders a heading with no `id` at all.
- Deliberately a flyout, not a persistent always-visible column like Better Auth's own docs site: the existing right rail's width is consistent across every page today (a slim icon column at `xl`+, a top-bar icon group below it), and a persistent outline column would either force that width to change per-page or need a fourth layout column, both of which are larger, riskier layout changes than this feature is worth. A click-to-open flyout keeps the icon rail exactly as wide everywhere and reuses interaction patterns (Escape/backdrop/close-button dismissal, slide-in panel) already proven in this codebase.
- Bundled while `RightRail.tsx` is already being touched: consolidate the mobile top bar down to a single settings/cog button (the Sign In icon it currently shows moves into the rail itself, matching where it already lives on desktop — one control, one place, not duplicated between a top-bar link and a rail icon). The rail (the same shared element already sliding in on mobile and sticky on desktop) gains a new Account icon above Sign In, and this change's own outline trigger goes at the bottom, below the theme toggle — rail order top to bottom: Account, Sign In, theme toggle, outline trigger.
- Add a minimal `/account` stub page as the Account icon's destination — an honest "not live yet" placeholder, the same precedent `/sign-in` itself set before `account-auth` existed. The real account hub (managing an in-progress engagement, messaging Robin privately) is a substantially bigger feature that needs its own scoping pass — captured as `docs/lightbulbs/rsw-lb-account-hub-private-chat.md`, not built here.

## Capabilities

### New Capabilities
- `page-outline-nav`: the on-this-page outline flyout — heading discovery, the trigger icon's conditional visibility, anchor navigation, and scroll-position highlighting.
- `account-hub-stub`: the placeholder `/account` page and its rail icon, standing in for the real account hub until that gets its own scoped change.

### Modified Capabilities
- None. `SectionHeader`'s new `id` is additive (existing rendered output and behavior for every current consumer is unchanged); no existing spec describes `SectionHeader`'s markup today, so there is nothing to amend.

## Impact

- `web/src/components/SectionHeader.tsx`: add a slugified `id` to the rendered `<h2>`, with a same-page collision-disambiguation strategy for two sections sharing an identical title.
- `web/src/components/RightRail.tsx`: mobile top bar drops to a single cog button; the shared rail element gains the relocated Sign In icon, a new Account icon, and this change's outline trigger, in that top-to-bottom order.
- New `web/src/components/PageOutline.tsx` (or similarly named): the flyout panel itself — DOM scan for `h2[id]` inside `<main>`, `IntersectionObserver`-driven active-section tracking, smooth-scroll-to-anchor on click, panel dismissal.
- New `web/src/app/account/page.tsx`: minimal stub page, same tone as `/sign-in`'s original "isn't live yet" placeholder.
- No backend, no data model, no new dependency (`lucide-react` already ships the icon set this needs; `IntersectionObserver` is a native browser API).

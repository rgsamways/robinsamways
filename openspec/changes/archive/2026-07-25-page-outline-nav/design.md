## Context

`SectionHeader.tsx` renders a bare `<h2>` with no `id` — used by 21 pages, several with real depth (`/ops/deploy` has 10 sections, `/services` has 7). There is currently no way to link to, or navigate directly to, any of these sections. The right-rail icon column (`RightRail.tsx`) already establishes a proven pattern for this kind of nav-adjacent control: a slim, always-consistent-width icon rail on desktop (`xl:w-16`), a top-bar icon group on mobile, and a slide-in panel for anything that needs more room than a single icon (currently used for the theme toggle).

## Goals / Non-Goals

**Goals:**
- Let a visitor jump directly to any section on the current page and see, while scrolling, which section they're currently in.
- Derive the outline from the page's real headings at runtime — no per-page hand-maintained anchor list, so new `SectionHeader` usage gets outline support automatically, with zero page-level opt-in.
- Show the trigger icon only where it's actually useful (pages with real section structure), not everywhere.
- Reuse this codebase's already-proven dismissal conventions (Escape, backdrop click, close button) rather than inventing a new interaction pattern.

**Non-Goals:**
- No persistent, always-visible outline column (Better Auth's docs-site pattern) — see proposal.md's rationale. This is a click-to-open flyout instead.
- No nested/h3-level sub-sections in this pass — only `SectionHeader`'s `<h2>` level. If a page later needs deeper nesting, that's a follow-up, not blocked by this change's shape.
- No change to `PageHeading`'s own `<h1>` — the outline lists a page's internal sections, not the page's own title.
- No cross-page search or site-wide anchor index — strictly the current page's own sections.
- No SSR/no-JS fallback — the outline is a client-side enhancement (DOM scan + `IntersectionObserver`), consistent with this site's existing mobile drawer nav also being client-only.

## Decisions

**D1 — A click-to-open flyout, not a persistent column.** The right rail is `xl:w-16` on every single page today; a persistent outline would need that width to grow on pages that have one and stay slim on pages that don't (jarring per-page layout shift), or a new fourth grid column site-wide (bigger structural change than this feature justifies). A flyout, triggered by a new icon in the existing rail, keeps every page's chrome exactly as wide as it is today.

**D2 — The icon only renders when the current page has ≥2 `SectionHeader` instances.** A page with zero sections has nothing to outline; a page with exactly one section has nothing to *choose between* — an outline listing a single item isn't useful. ≥2 is the natural cutoff, not an arbitrary tuned number. This is a runtime check (see D3), not a hand-maintained list of "which pages get the icon."

**D3 — Discovery is a client-side DOM scan, not a build-time or props-based registry.** On mount and on every route change (`usePathname` from `next/navigation`), `PageOutline` runs `document.querySelectorAll('main h2[id]')` and builds its anchor list from whatever it finds. This is the direct continuation of the principle from `PageHeading`'s extraction: the heading text and its outline entry come from the *same* rendered element, so they can never drift out of sync, and no page needs to declare its sections twice (once for content, once for a nav list). The trade-off is that the outline is empty for a frame until hydration/mount completes — acceptable for a nav convenience, not a content requirement, and no worse than this site's existing mobile drawer nav (also client-rendered).

**D4 — `SectionHeader` gets a slugified `id`, generated from `title`, with same-page collision handling.** `id="{slug(title)}"`, where `slug` lowercases, replaces non-alphanumerics with `-`, and trims leading/trailing `-`. If two `SectionHeader`s on the same page produce the same slug (identical or slug-colliding titles), the second and later occurrences get a numeric suffix (`-2`, `-3`, ...) so `id`s stay unique and every section remains individually reachable. Slugs are derived from the *visible title text*, not a stable separately-authored key — acceptable because these are in-page anchors, not URLs meant to be bookmarked or shared externally; if that assumption turns out to be wrong later, switching to an explicit optional `id` prop on `SectionHeader` is a small, additive follow-up.

**D5 — Active-section tracking via `IntersectionObserver`, not scroll-position math.** Observing each `h2[id]` element directly (rather than computing scroll offsets by hand) is the standard, more robust approach to "which section is currently in view," and avoids the well-known fragility of manual scroll-position thresholds across varying content heights.

**D6 — Dismissal follows this codebase's existing conventions exactly.** Escape key, backdrop click, and an explicit close button all dismiss the panel — the same three mechanisms `SetupGallery`'s modal already establishes as this site's standard. Clicking an anchor link inside the panel also closes it (a flyout, not a persistent sidebar, so closing after the visitor acts on it is the expected menu-like behavior — consistent with how the mobile drawer nav also closes after a link is followed).

**D7 — The mobile top bar collapses to a single cog button; every actual control lives in the rail.** Today the mobile top bar shows Sign In as a standalone link *and* a cog that opens a panel containing only the theme toggle — the same control (Sign In) exists in two different places depending on breakpoint, and the top bar's role is inconsistent (sometimes "here's a control," sometimes "here's a button that reveals controls"). Moving Sign In into the shared rail element makes the top bar's job singular on every breakpoint: it's the one thing that opens the rail. Nothing is removed, only relocated.

**D8 — Rail order, top to bottom: Account, Sign In, theme toggle, outline trigger.** Account (identity/"who am I and what's mine") sits above Sign In (the action that establishes that identity) because it's the more primary, at-a-glance concern; the theme toggle is a page-independent preference, appropriately below both identity controls; this change's own outline trigger goes last because, unlike the other three, it's the only control that isn't present on every page (D2) — placing the conditional one at the bottom means the rail's fixed controls never shift position depending on which page you're on.

**D9 — `/account` ships as an honest stub, not a real hub.** `docs/lightbulbs/rsw-lb-account-hub-private-chat.md` captures the actual idea (managing an in-progress engagement, messaging Robin privately) — genuinely undersketched right now (no data model, no messaging mechanism decided). Shipping a stub page now, in the same spirit as `/sign-in`'s own original placeholder before `account-auth` existed, gives the new rail icon somewhere honest to point without blocking this change on a much larger, unscoped feature.

## Risks / Trade-offs

**[Slug collisions]** → Handled explicitly by D4's numeric-suffix rule; covered by a unit test on the slug utility itself, not left to be caught visually.

**[Client-side-only discovery]** → The outline can't be crawled/indexed and won't exist in a no-JS render. Acceptable: this is a navigation convenience for sighted, JS-enabled visitors, not content, and matches the existing mobile nav's own JS-dependency.

**[Icon-rail crowding]** → `RightRail.tsx` now holds up to three controls (theme toggle, Sign In, and this). Confirm at implementation time that the mobile top-bar group (currently two icons) still reads clearly with a third; if it feels cramped, a group/divider treatment is a small follow-up, not a reason to change this change's shape.

## Migration Plan

No data, no backend, no existing behavior change for any page that doesn't use `SectionHeader` (the overwhelming majority of the change is additive: a new `id` attribute, a new component, a new conditionally-rendered icon). Existing `SectionHeader` consumers get working anchors and outline support automatically, with no per-page edits required.

## Open Questions

- Whether the ≥2-section threshold (D2) should be tunable per-page (an explicit opt-out prop) if a future page has 2+ sections but the outline genuinely adds no value there. Not addressed now — cross that bridge if a real page actually needs it, rather than adding an unused escape hatch speculatively.

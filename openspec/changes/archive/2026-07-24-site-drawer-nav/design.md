## Context

`/prototype/homepage-drawer` already validated the responsive drawer mechanism (sticky rail on desktop, sliding drawer with backdrop on mobile) on one isolated page, built purely for exploration — it deliberately never touched `Header.tsx`, `layout.tsx`, or `globals.css`. This change brings that validated pattern to the real, permanent site, across every page.

## Goals / Non-Goals

**Goals:**
- Real, site-wide left navigation drawer and right-hand display-settings rail, replacing the current hamburger dropdown and stacked toggle.
- Reuse the *pattern* proven in the mock (responsive mechanics, backdrop/Escape dismissal) without reusing the mock's actual files, which carry mock-only concerns.
- Ship something visible and usable quickly — deliberately the smallest version of this that's still real.

**Non-Goals:**
- Not shipping the mock's 5-theme picker or its site-vs-silo scope toggle. No real content exists yet that benefits from picking a different look per project — that's tied to project-silo pages not yet built (`docs/lightbulbs/rsw-lb-project-silos.md`).
- Not touching `globals.css`'s actual color tokens — the site's real look is unchanged, only its navigation chrome moves.
- Not building the project-silos "Work" showcase content itself — this change only makes room for it in the nav grouping.

## Decisions

**D1 — New components, not promoted mock files.** `web/src/components/prototype/DrawerNav.tsx` and `RightRail.tsx` carry mock-specific concerns (an in-page table-of-contents prop, a 5-way theme context) that don't belong in production. Real `web/src/components/DrawerNav.tsx` and `RightRail.tsx` are new, minimal files: same responsive CSS mechanics, none of the mock's theme-switching machinery. The prototype directory is left completely untouched.

**D2 — Layout restructure is additive, not a rewrite.** `app/layout.tsx`'s current `mx-auto max-w-3xl` centered column becomes a flex row (`DrawerNav` + main content + `RightRail`), the same structural move already proven in the mock's own page. `FeedbackWidget` and the theme-init script stay exactly where they are.

**D3 — The right rail ships with one control, not two.** The mock's rail had a palette button (theme picker) and a lightbulb (light/dark). This change ships only the lightbulb, repositioned — the palette button isn't included since there's no multi-theme picker shipping yet (see Non-Goals). Room is left in the component for a second button later, not built now.

**D4 — Nav grouping is a proposal default, not a locked decision.** Site/Work/Writing/Ops is carried over directly from the mock, including surfacing `/ops/deploy` for the first time. This is genuinely a smaller, easier-to-revise decision than the technical mechanics above — flagged clearly in the proposal for a quick yes/no rather than blocking on it.

## Risks / Trade-offs

**[Layout restructure touches every page at once]** → It's a shared layout change by nature; mitigate by verifying a representative sample of pages (homepage, a long page like Dev Log, a short page like a Tech/Stacks piece) at both mobile and desktop widths before considering this done, not just the homepage.

**[Surfacing `/ops/deploy` in nav is a visibility change, not just a layout one]** → That page was previously reachable only by direct URL. Confirm this is actually wanted before shipping, since it's a small but real content-exposure decision riding along with an otherwise purely structural change.

## Migration Plan

No data migration — this is a frontend-only structural change. Roll out as one change; no incremental/dark-launch mechanism needed since there's no backend dependency.

## Implementation note (discovered during apply)

The original proposal didn't catch that `resume-homepage`'s "Header replicates resume header layout" requirement also asserts the `$ Robin Samways` title and `lg:sticky` pinning, both on `Header.tsx` specifically. Since the title and persistent visibility now live in `DrawerNav`, a delta for `resume-homepage` was added (`specs/resume-homepage/spec.md`) — `Header.tsx` keeps the headshot and horizontal rule, drops the title and its own sticky behavior entirely, since the drawer now owns "stay visible while scrolling."

## Open Questions

- Confirm the Site/Work/Writing/Ops grouping and the `/ops/deploy` surfacing (D4) — easy to adjust before implementation starts.
- Whether the right rail's now-single-button layout should reserve visible space for a future second button, or render cleanly as just the one control until there's a second thing to put there.

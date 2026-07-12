## Context

Worked out directly with Robin in a scoping conversation after he reviewed the live `farpost-hub-nav-restructure` deploy in-browser. He flagged the per-page local menus as a distraction now that Farpost's pill-tab bar and Tech/Stacks' pill-filter-plus-cards make them redundant, and asked for three more small chrome changes in the same pass: a Farpost intro blurb (pills moved below it), a sticky identity header (with a mobile/laptop split he left to my judgment), and confirmed the local-menu removal should include Tech/Stacks' own project-list menu, not just the section-jump ones.

## Goals / Non-Goals

**Goals:**
- Remove now-redundant local navigation chrome sitewide.
- Give Farpost the same heading-plus-blurb pattern Sreditor and Tech/Stacks already have.
- Keep the site's identity (name, title, contact info) visible while scrolling, on screens with room for it.

**Non-Goals:**
- No change to the global site menu (`site-navigation`, `MenuToggle`) — it's a different mechanism entirely, unaffected by this change.
- No visual redesign of the pill-tab bar or pill-filter bar themselves — only Farpost's is repositioned, not restyled.
- No new content beyond the one Farpost blurb line.

## Decisions

- **"All pages" is read literally.** `/ops/deploy` and the homepage's resume sections both use `SectionHeader` with `id`s but never had a `HamburgerMenu` wired to them — searched the codebase and confirmed nothing links to any of these `#anchor` fragments anywhere, so stripping the anchor mechanic from `SectionHeader` globally loses no working functionality on any page, not just the ones touched by tonight's Farpost hub build.
- **`HamburgerMenu` the component stays.** Only its local/per-page call sites are deleted. It remains load-bearing for the global site menu via `MenuToggle`.
- **Sticky breakpoint: Tailwind's `lg` (1024px), not `md` (768px).** The real constraint is vertical space, not width — a portrait tablet at `md` width can still be short on height. `lg` keeps the sticky header to genuinely wide viewports (laptop/desktop) where a header this tall (headshot plus three lines of contact info) pinned at the top doesn't meaningfully crowd the content below it. Below `lg`, the header scrolls normally.
- **`project-page-navigation` is retired outright, not trimmed to a stub.** Every one of its four requirements exists solely to describe a local menu that no longer exists anywhere once this change ships. Handled the same way `method-index`/`narrative-index` were retired during `farpost-hub-nav-restructure`'s archive: the archive tool can't rebuild a spec down to zero requirements (it errors), so this capability's delta spec file gets held out of the automatic archive-apply pass and `openspec/specs/project-page-navigation/` is deleted by hand at archive time.
- **The `salesforce-loan-demo` route-reference fix is bundled into this change**, not split into its own, since it's a one-line factual correction discovered while directly touching this exact page for the menu removal — not new scope.

## Final Copy

### Farpost intro blurb (new, under "$ Farpost")

A building-intelligence platform &mdash; NFC-tagged records that outlive any single owner, insurer, or contractor, born from a rural dispatch gap nobody else was solving.

*(First draft — Robin, edit freely; matches the length/tone of Sreditor's and Tech/Stacks' existing subtitle lines.)*

## Migration Plan

1. Delete all local `HamburgerMenu` call sites and their `SECTION_LINKS`/menu-link arrays: Farpost, Farpost Atlas, Farpost Pulse, Sreditor, Credential Flow, Tech/Stacks index, Dev Log.
2. Strip `SectionHeader`'s `id` prop and `scroll-mt-4` class — it becomes a heading-plus-rule only, no anchor target.
3. Add Farpost's new blurb paragraph under its `<h1>`; move `<FarpostTabBar />` to render after the blurb instead of before the heading block.
4. Add sticky behavior (`lg:sticky lg:top-0`, a solid background so page content doesn't show through while pinned, and an appropriate `z-index`) to `Header.tsx`.
5. Fix `salesforce-loan-demo`'s two stale `/narrative/credential-flow` route references in its own spec file — spec-only correction, the actual page/route is already right.
6. Verify no e2e spec exercises a local per-page menu (confirmed none currently do — only the global menu is tested) and that the full suite still passes.
7. Verify, run `scc`, log the snapshot.

## Open Questions

None — Robin confirmed scope (including Tech/Stacks' project-list menu) and delegated the sticky breakpoint choice directly in the scoping conversation.

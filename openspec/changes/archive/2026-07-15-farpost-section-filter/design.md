## Context

The archived `dev-log-code-showcase` change built a section-visibility pill filter for `/dev-log`: a pure helper `filterSections<T extends {id: string}>(sections, activeIds)` (empty `activeIds` = show all) plus a client component (`DevLogSectionFilter.tsx`) that owns pill state and conditionally renders pre-built section nodes, styled to match `/techstacks`' existing `TechStacksBrowser.tsx` pill markup. Both currently live under `web/src/components/dev-log/`.

`/farpost` (`web/src/app/farpost/page.tsx`) already has a pill bar of its own, `FarpostTabBar` — but it is a *navigation* bar (real `<Link>`s to `/farpost/farpost-atlas`, `/farpost/farpost-dispatch`, `/farpost/farpost-pulse`) rendered above the page heading, required to stay there by the existing "Farpost renders as a hub with a pill-tab bar to its sub-pieces" requirement. The new ask is a second, unrelated pill bar: a filter over `/farpost`'s own four sections, placed below the heading and intro blurb, matching where `/dev-log`'s filter bar sits relative to its heading.

Once this was scoped, the natural follow-up question came up: should `/techstacks` be pulled onto the same `filterSections`/`SectionFilterBar` machinery too, for consistency? No — `/techstacks`' filter matches tags against a heterogeneous list of projects (many-to-many, OR-logic via `filterProjects.ts`); `filterSections` matches a pill id against one of a small fixed set of named sections (toggle-visibility). Those are genuinely different filter semantics and shouldn't be unified. What *is* real, addressable duplication: `SectionFilterBar`'s pill-button markup (the `role="group"` wrapper, `aria-pressed` buttons, active/inactive Tailwind classes) was copied verbatim from `TechStacksBrowser`'s own pill row when it was first built. Robin asked to fold extracting that shared markup into this change, since it directly serves his stated goal of being able to make pill-bar styling changes site-wide in one place.

## Goals / Non-Goals

**Goals:**
- Add the same section-filter interaction to `/farpost` that `/dev-log` already has, placed below the heading/intro blurb.
- Avoid shipping the pill-filter logic twice — generalize what already exists rather than copy it.
- Deduplicate the pill-button *row markup* specifically, across all three pill bars on the site (`/techstacks`, `/dev-log`, `/farpost`), so a future site-wide pill-styling change is a one-file edit.

**Non-Goals:**
- Any change to `FarpostTabBar`'s behavior, styling, or position.
- Any change to `/dev-log`'s or `/techstacks`' user-facing behavior (both relocations/extractions are internal implementation moves only).
- Unifying `/techstacks`' tag-filtering logic with `/dev-log`/`/farpost`'s section-toggling logic — they stay two genuinely different filters sharing only their visual row.
- Filtering within `/farpost`'s sub-pages (Atlas/Dispatch/Pulse) — this change only touches `/farpost` itself.

## Decisions

**1. Relocate `filterSections.ts` and generalize the pill-bar component to a shared location, rather than duplicating either for Farpost.**
Both are already page-agnostic: `filterSections` takes a generic `{id: string}` array, and the pill-bar component's only dev-log-specific detail is a hardcoded `aria-label`. Move `filterSections.ts` to `web/src/components/filterSections.ts` (alongside the already-shared `CodeBlock.tsx`), and rename/relocate `DevLogSectionFilter.tsx` to `web/src/components/SectionFilterBar.tsx`, adding one new prop — `ariaLabel: string` — so each page's `role="group"` stays accessibly distinct ("filter dev log sections" vs. "filter farpost sections"). `/dev-log/page.tsx` updates its import and passes its existing label explicitly; its rendered output and behavior don't change. Alternative considered: copy both files into a new `components/farpost/` module — rejected as the same near-duplication the prior change's `CodeBlock` relocation was written specifically to avoid.

**2. Move the helper's test to a new top-level `components/__tests__/` folder.**
Every other `__tests__` folder in this codebase lives inside a page-specific component subfolder (`dev-log/__tests__`, `techstacks/__tests__`, etc.) because the code under test is page-specific. `filterSections` no longer is, once shared — so its test moves with it to `web/src/components/__tests__/filterSections.test.ts`, the first top-level instance of that pattern, for the same reason the function itself moved.

**3. Farpost's four sections get short, human-readable pill labels distinct from their `SectionHeader` slugs.**
`origin-story` → "Origin Story", `problems` → "Problems It Solves", `lifecycle-example` → "Lifecycle Example", `process` → "Process" — mirroring how `/dev-log`'s pills use human-readable labels ("Testing & Verification") rather than its `SectionHeader` slugs ("TESTING_AND_VERIFICATION").

**4. Placement: below the intro blurb, above Origin Story — never touching `FarpostTabBar`.**
`page.tsx` keeps `<FarpostTabBar />` first, then the heading, then the intro blurb, exactly as today; the new `<SectionFilterBar>` is inserted immediately after the intro blurb paragraph, before the first section — the same position `/dev-log`'s filter bar occupies relative to its own heading/summary.

**5. Extract a presentational `PillBar` component for the row markup only; keep `filterProjects.ts` and `filterSections.ts` separate.**
`web/src/components/PillBar.tsx` takes `{ pills: {id, label}[], activeIds: string[], onToggle: (id) => void, ariaLabel: string }` and renders exactly the markup currently duplicated between `TechStacksBrowser` and `SectionFilterBar` — the `role="group"` wrapper and each button's `aria-pressed`/active-vs-inactive classes. `TechStacksBrowser` builds `pills` from its `tags` prop (`{id: tag, label: tag}`) and keeps its own `activeTags` state and `filterProjects` call untouched, just swapping its inline pill JSX for `<PillBar>`. `SectionFilterBar` does the same for its `sections` prop, keeping `filterSections` untouched. Neither page's filtering *behavior* changes — same DOM output, same interaction — only the pill row's JSX now has one source of truth. Alternative considered: leave the duplication as-is since it's only ~15 lines twice — rejected because Robin explicitly wants a single edit point for site-wide pill styling going forward, and the component boundary (presentation vs. filtering logic) is a clean, correctly-scoped one, not a forced abstraction.

## Risks / Trade-offs

- **[Risk]** Relocating shared files touches `/dev-log/page.tsx` again, even though this change's user-facing scope is `/farpost`. → **Mitigation**: it's a pure import-path + prop-name update (add `ariaLabel="filter dev log sections"`), no behavior change; the existing `dev-log-section-filter.spec.ts` e2e assertions stay valid unmodified and re-verify this directly.
- **[Risk]** Two pill bars on one page (`FarpostTabBar` above the heading, the new filter bar below it) could read as visually redundant to a first-time visitor. → **Mitigation**: they're visually adjacent but functionally distinct (one navigates to other pages, one hides/shows content on this one) and use the same established pill idiom already proven legible on `/dev-log` (nav pills above via the hamburger-independent `FarpostTabBar` pattern, filter pills below).
- **[Risk]** `/techstacks`' pill filter currently has zero e2e coverage, so a mistake made while swapping its markup for `PillBar` (e.g. losing the OR-tag-union behavior) wouldn't be caught by any committed test. → **Mitigation**: add a minimal e2e spec for `/techstacks`' pill filter as part of this change (see tasks.md), since this change is what's newly touching that code path — closing a pre-existing gap that happens to sit directly in this diff's path, not a general retrofit.

## Open Questions

None outstanding.

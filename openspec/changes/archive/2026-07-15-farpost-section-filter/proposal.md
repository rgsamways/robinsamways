## Why

`/dev-log` and `/techstacks` now both use a pill bar below their heading/summary to filter their own content, but `/farpost`'s only pill bar (`FarpostTabBar`) is a navigation bar to sibling pages, sitting above the heading. `/farpost` itself still renders its four sections (Origin Story, Problems It Solves, Lifecycle Example, Process) unconditionally, with no way to jump to or isolate one — the same gap the Dev Log filter bar just closed there.

## What Changes

- Add a pill-style filter bar to `/farpost`, below the "$ Farpost" heading and intro blurb, filtering the page's four existing sections (Origin Story, Problems It Solves, Lifecycle Example, Process) — same placement and interaction as `/dev-log`'s filter bar, distinct from `FarpostTabBar`, which stays exactly where it is today (above the heading, navigating to sibling pages).
- Generalize and relocate the filter infrastructure built for `/dev-log` (`filterSections.ts`, and the pill-bar client component) out of `components/dev-log/` into a shared, non-page-specific location, so `/dev-log` and `/farpost` both use the same implementation instead of shipping the same pill-filter logic twice.
- Extract the pill-button *row* itself (markup/styling only — `role="group"`, `aria-pressed` buttons, active/inactive classes) into a shared, presentational `PillBar` component, and have `/techstacks`' `TechStacksBrowser` render it too, alongside the new `SectionFilterBar`. This does not change `/techstacks`' filtering behavior (still tag-matching across a project list via `filterProjects.ts`) or `/farpost`/`/dev-log`'s (still section-visibility toggling via `filterSections.ts`) — those two filters stay genuinely different and un-unified. Only the pill row's visual rendering, which was already byte-for-byte duplicated between `TechStacksBrowser` and the new `SectionFilterBar`, is shared.
- `/dev-log`'s and `/techstacks`' own behavior is unchanged — same pills, same filtering semantics each already had — only the implementation's file locations move.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `farpost-page-content`: adds one new requirement — a pill-style filter bar for the Origins tab's four sections. No existing requirement's text changes.

## Impact

- `web/src/app/farpost/page.tsx` — wraps its four sections with the new filter bar, below the heading/intro blurb.
- `web/src/components/filterSections.ts` (new shared location, relocated from `components/dev-log/`) + `web/src/components/__tests__/filterSections.test.ts` (relocated).
- `web/src/components/SectionFilterBar.tsx` (new shared, generalized component, replacing `components/dev-log/DevLogSectionFilter.tsx`).
- `web/src/components/PillBar.tsx` (new shared, presentational pill-row component, used by both `SectionFilterBar` and `TechStacksBrowser`).
- `web/src/components/techstacks/TechStacksBrowser.tsx` — updated to render the shared `PillBar` instead of its own inline pill markup; its tag-filtering logic (`filterProjects.ts`) is untouched.
- `web/src/app/dev-log/page.tsx` — updated to import the relocated/generalized component; no behavior change.
- `web/e2e/` — new e2e coverage for `/farpost`'s filter bar and for `/techstacks`' pill filter (previously uncovered by any e2e spec); existing `dev-log-section-filter.spec.ts` re-verified, not rewritten.
- `openspec/specs/farpost-page-content/spec.md` — one new ADDED requirement (see delta).
- `docs/metrics.md` + `web/src/data/metrics.json` — new `scc` snapshot appended at archive time.
- Out of scope: `FarpostTabBar.tsx`, any Farpost sub-page (Atlas/Dispatch/Pulse), `dev-log-content`'s spec (unaffected).

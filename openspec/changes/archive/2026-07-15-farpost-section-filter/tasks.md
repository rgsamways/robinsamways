## 1. Generalize and relocate the shared filter infrastructure

- [x] 1.1 Move `web/src/components/dev-log/filterSections.ts` to `web/src/components/filterSections.ts`; no logic changes (already generic).
- [x] 1.2 Move `web/src/components/dev-log/__tests__/filterSections.test.ts` to `web/src/components/__tests__/filterSections.test.ts`, updating its import path only.
- [x] 1.3 Rename/relocate `web/src/components/dev-log/DevLogSectionFilter.tsx` to `web/src/components/SectionFilterBar.tsx`, adding a required `ariaLabel: string` prop used for the pill row's `aria-label` (replacing the hardcoded "filter dev log sections" string).
- [x] 1.4 Update `web/src/app/dev-log/page.tsx`'s import to `SectionFilterBar` from the new shared path, passing `ariaLabel="filter dev log sections"` explicitly so its rendered output is unchanged.
- [x] 1.5 Confirm `web/e2e/dev-log-section-filter.spec.ts` still passes unmodified against the relocated component.

## 2. Shared pill-row component

- [x] 2.1 Create `web/src/components/PillBar.tsx`: presentational component taking `{ pills: {id, label}[], activeIds: string[], onToggle: (id: string) => void, ariaLabel: string }`, rendering the exact `role="group"` wrapper + `aria-pressed` button markup/classes currently duplicated between `TechStacksBrowser.tsx` and `SectionFilterBar.tsx`.
- [x] 2.2 Update `web/src/components/techstacks/TechStacksBrowser.tsx` to build `pills` from its `tags` prop and render `<PillBar>` instead of its own inline pill JSX; keep `activeTags` state and the `filterProjects` call unchanged.
- [x] 2.3 Update `web/src/components/SectionFilterBar.tsx` to build `pills` from its `sections` prop and render `<PillBar>` instead of its own inline pill JSX; keep `activeIds` state and the `filterSections` call unchanged.
- [x] 2.4 Confirm `web/src/components/techstacks/__tests__/filterProjects.test.ts` still passes unmodified (pure filtering logic, untouched by the markup swap).

## 4. Farpost filter bar

- [x] 4.1 In `web/src/app/farpost/page.tsx`, give the four existing sections ids/labels (`origin-story` → "Origin Story", `problems` → "Problems It Solves", `lifecycle-example` → "Lifecycle Example", `process` → "Process") and build them as an array of `{id, label, node}`, mirroring how `dev-log/page.tsx` builds its own section array.
- [x] 4.2 Render `<SectionFilterBar sections={...} ariaLabel="filter farpost sections" />` immediately after the intro blurb paragraph and before the first section — `FarpostTabBar` stays exactly where it is today, above the heading, untouched.

## 5. Test coverage

- [x] 5.1 Confirm `web/src/components/__tests__/filterSections.test.ts` (task 1.2) and `web/src/components/techstacks/__tests__/filterProjects.test.ts` (task 2.4) both pass via `npm run test`.
- [x] 5.2 Add a new Playwright e2e spec covering `/farpost`'s filter bar: all four pills render, activating one pill isolates its section, clearing all active pills restores all four sections.
- [x] 5.3 Add a new Playwright e2e spec covering `/techstacks`' pill filter (previously uncovered by any e2e spec): pills render for every tag, activating a tag pill narrows the project list to matches, activating a second tag shows the union not the intersection, clearing all pills restores the full list.
- [x] 5.4 Run `npm run build` in `web/` and confirm a clean build.

## 6. Metrics and wrap-up

- [x] 6.1 Run `scc` against `web/src`, `api`, and `pieces`; append the new snapshot to `docs/metrics.md` (date, change name, headline numbers, one-line delta from the previous snapshot) and to `web/src/data/metrics.json`.
- [x] 6.2 If the new snapshot's DRYness drops below 55% or falls more than 10 points from the previous snapshot, log it as an open item in `docs/issues.md` per `CLAUDE.md`'s scc convention.
- [x] 6.3 Report status back to Robin for the drift audit against `openspec/specs/farpost-page-content/spec.md` before archiving.

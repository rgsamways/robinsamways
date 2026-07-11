## 1. New navigation components

- [ ] 1.1 Build a pill-tab bar component (real `Link`s, active-tab styling based on current path) for Farpost's hub — distinct from the existing `HamburgerMenu` (section-anchor menu, unchanged, still used per-page)
- [ ] 1.2 Build a pill-filter bar component (`"use client"`, multi-select toggle state, OR-logic filtering against a project list passed in as props) for Tech/Stacks
- [ ] 1.3 Write unit tests for the pill-filter bar's filtering logic (empty selection shows all, single pill filters correctly, multiple pills use OR not AND, a pill with zero matches renders an empty result without erroring), per this repo's "tests ship with the feature" convention

## 2. Farpost hub

- [ ] 2.1 Move `web/src/app/narrative/farpost-atlas/page.tsx` and `web/src/app/narrative/farpost-atlas/[buildingId]/page.tsx` to `web/src/app/farpost/farpost-atlas/page.tsx` and `web/src/app/farpost/farpost-atlas/[buildingId]/page.tsx`; update `NEXT_PUBLIC_FARPOST_ATLAS_API_URL`-consuming code paths only if any hardcode the old route (check `web/src/components/farpost-atlas/api.ts`, unlikely but verify)
- [ ] 2.2 Move `web/src/app/narrative/farpost-pulse/page.tsx`, `[techId]/page.tsx`, and `dashboard/page.tsx` to `web/src/app/farpost/farpost-pulse/page.tsx`, `[techId]/page.tsx`, and `dashboard/page.tsx`
- [ ] 2.3 Build `web/src/app/farpost/farpost-dispatch/page.tsx`: minimal placeholder per `design.md`'s Final Copy (heading "$ Dispatch", the coming-soon body copy)
- [ ] 2.4 Add the pill-tab bar (Origins/Atlas/Dispatch/Pulse) to `web/src/app/farpost/page.tsx` (Origins — unchanged content, new tab bar), the moved Atlas page, the moved Pulse page, and the new Dispatch page
- [ ] 2.5 In Atlas's and Pulse's existing `SECTION_LINKS` arrays, remove the first entry (`{ href: "/narrative", label: "Narrative" }`) — the pill-tab bar now provides that navigation, making the local-menu parent link redundant
- [ ] 2.6 Update Atlas's and Pulse's internal links to each other and to their own sub-routes ([buildingId], [techId], dashboard) to the new `/farpost/farpost-atlas*` / `/farpost/farpost-pulse*` paths (marker popups, roster cards, any relative links)
- [ ] 2.7 Update `NEXT_PUBLIC_FARPOST_ATLAS_API_URL` and `NEXT_PUBLIC_FARPOST_PULSE_API_URL` references in `docs/deployment-guide.md` and `/ops/deploy` if they reference the old frontend routes anywhere (the env vars themselves are unaffected; only check for hardcoded `/narrative/...` mentions)

## 3. Tech/Stacks index

- [ ] 3.1 Move `web/src/app/narrative/credential-flow/page.tsx` to `web/src/app/techstacks/credential-flow/page.tsx`, content and tags unchanged
- [ ] 3.2 In Credential Flow's `SECTION_LINKS`, update the parent-index link from `{ href: "/narrative", label: "Narrative" }` to `{ href: "/techstacks", label: "Tech/Stacks" }`
- [ ] 3.3 Build `web/src/app/techstacks/page.tsx`: same card-list pattern as today's `/narrative` index, plus the pill-filter bar above it, seeded with the 8 tags in `design.md`'s Final Copy (Salesforce, OAuth 2.0, Anthropic AI, Azure, Python, TypeScript, PostgreSQL, AWS); Credential Flow's entry carried over unchanged (teaser text, tags: Salesforce, OAuth 2.0, Anthropic AI)
- [ ] 3.4 Add a local `HamburgerMenu` beside the "$ Tech/Stacks" heading listing Credential Flow (matching the old Narrative-index pattern)

## 4. Sreditor rewrite

- [ ] 4.1 Move `web/src/app/method/sreditor/page.tsx` to `web/src/app/sreditor/page.tsx`
- [ ] 4.2 Replace its content entirely with the four sections in `design.md`'s Final Copy — ORIGIN_STORY, PROBLEMS_SREDITOR_SOLVES, SRED_ELIGIBILITY_EXAMPLE, PROCESS — copy is final, not a first draft; flag a genuine typo rather than silently rewording anything substantive, same convention as the original page
- [ ] 4.3 Update the local `HamburgerMenu`'s `SECTION_LINKS`: remove the old `{ href: "/method", label: "Method Index" }` parent link entirely (Sreditor has no parent index now), replace the six old section anchors with four new ones matching the new section IDs
- [ ] 4.4 Preserve the METHOD section's real external OpenSpec link (`target="_blank" rel="noopener noreferrer"`) — it now lives inside the PROCESS section's copy
- [ ] 4.5 Check for JSX whitespace-glue regressions proactively (this page's own documented recurring bug) via headless-browser text extraction, not just a source read

## 5. Global navigation and cleanup

- [ ] 5.1 Update `web/src/components/MenuToggle.tsx`'s `links` array to Home/Farpost/Sreditor/Tech-Stacks/Dev Log with the new routes
- [ ] 5.2 Delete `web/src/app/method/` and `web/src/app/narrative/` entirely (both directories, including the index pages and all now-moved sub-routes)

## 6. Update existing tests

- [ ] 6.1 Update `web/e2e/global-navigation.spec.ts`'s menu-item list and assertions to Home/Farpost/Sreditor/Tech-Stacks/Dev Log and their new routes
- [ ] 6.2 Update `web/e2e/farpost-atlas-map-flow.spec.ts`'s hardcoded `/narrative/farpost-atlas` and `/narrative/farpost-atlas/1` references to `/farpost/farpost-atlas` and `/farpost/farpost-atlas/1`
- [ ] 6.3 Update `web/e2e/farpost-pulse-coaching-flow.spec.ts`'s hardcoded `/narrative/farpost-pulse` references to `/farpost/farpost-pulse`
- [ ] 6.4 Run the full existing unit + e2e suite and confirm everything still passes against the new routes

## 7. Verification

- [ ] 7.1 Confirm `/farpost` shows Origins content with the pill-tab bar, and each pill navigates correctly to `/farpost/farpost-atlas`, `/farpost/farpost-dispatch`, `/farpost/farpost-pulse`, with the current page's pill visually active on each
- [ ] 7.2 Confirm `/techstacks` shows the pill-filter bar and Credential Flow's card; confirm filtering behavior (single pill, multiple pills OR-combined, deselect-all, a zero-match pill)
- [ ] 7.3 Confirm `/sreditor` renders all four sections in order with the new copy, local menu has no parent-index link, and the external OpenSpec link still works
- [ ] 7.4 Confirm `/method` and `/narrative` both 404 (not redirect, per design.md's explicit non-goal)
- [ ] 7.5 Confirm the global menu shows Home/Farpost/Sreditor/Tech-Stacks/Dev Log in that order, and every link resolves
- [ ] 7.6 `npm run build` clean, no console warnings
- [ ] 7.7 Run `scc --dryness --exclude-dir .git,.hg,.svn,node_modules,.venv,raw web/src api pieces` and log the snapshot to `docs/metrics.md` **and** `web/src/data/metrics.json` before archiving this change, per the convention in `CLAUDE.md`

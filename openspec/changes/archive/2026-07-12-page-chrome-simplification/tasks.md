## 1. Remove local menus

- [x] 1.1 Remove the local `HamburgerMenu` and its `SECTION_LINKS` array from `web/src/app/farpost/page.tsx`
- [x] 1.2 Remove the local `HamburgerMenu` and its `SECTION_LINKS` array from `web/src/app/farpost/farpost-atlas/page.tsx`
- [x] 1.3 Remove the local `HamburgerMenu` and its `SECTION_LINKS` array from `web/src/app/farpost/farpost-pulse/page.tsx`
- [x] 1.4 Remove the local `HamburgerMenu` and its `SECTION_LINKS` array from `web/src/app/sreditor/page.tsx`
- [x] 1.5 Remove the local `HamburgerMenu` and its `SECTION_LINKS` array from `web/src/app/techstacks/credential-flow/page.tsx`
- [x] 1.6 Remove the local `HamburgerMenu` (project-list menu) from `web/src/app/techstacks/page.tsx`
- [x] 1.7 Remove the local `HamburgerMenu` and its `SECTION_LINKS` array from `web/src/app/dev-log/page.tsx`
- [x] 1.8 Confirm `web/src/components/HamburgerMenu.tsx` itself is untouched and `MenuToggle.tsx` still uses it for the global menu

## 2. Remove heading anchors

- [x] 2.1 Update `web/src/components/SectionHeader.tsx`: drop the `id` prop and `scroll-mt-4` class — heading + rule only
- [x] 2.2 Remove now-unused `id="..."` arguments passed to `<SectionHeader>` across every call site (Farpost, Farpost Atlas, Farpost Pulse, Sreditor, Credential Flow, Dev Log, `/ops/deploy`, homepage resume sections) — confirm via search that no in-page link references any of these anchors before removing

## 3. Farpost blurb and pill placement

- [x] 3.1 Add the intro blurb paragraph under `/farpost`'s "$ Farpost" `<h1>`, using design.md's Final Copy (flagged as a first draft — check with Robin before treating it as final, unlike the verbatim-copy convention used elsewhere)
- [x] 3.2 Move `<FarpostTabBar />` in `web/src/app/farpost/page.tsx` to render after the heading+blurb block instead of before it

## 4. Sticky header

- [x] 4.1 Add `lg:sticky lg:top-0` plus an opaque background and appropriate `z-index` to `web/src/components/Header.tsx`, so it pins on viewports ≥1024px wide and scrolls normally below that
- [x] 4.2 Verify no visual regression from the sticky header overlapping page content on first paint (check spacing/margin on the content immediately below it)

## 5. Fix stale route references

- [x] 5.1 No application code changes needed — `/techstacks/credential-flow` is already correct; this is a spec-only correction applied at archive time via this change's `salesforce-loan-demo` delta

## 6. Verification

- [x] 6.1 Confirm no local per-page `HamburgerMenu` remains anywhere except the global one (`MenuToggle`) — check all seven touched pages
- [x] 6.2 Confirm `/farpost` shows heading → blurb → pill-tab bar → Origins content, in that order
- [x] 6.3 Confirm the header stays pinned while scrolling at ≥1024px width and scrolls normally below that (check at a genuinely narrow width, not just resizing a desktop window)
- [x] 6.4 Run the full existing unit + e2e suite and confirm everything still passes (none currently exercise a local menu, so no spec updates expected — verify that assumption holds)
- [x] 6.5 `npm run build` clean, no console warnings
- [x] 6.6 Check for JSX whitespace-glue regressions on every page whose JSX changed (Farpost's new blurb paragraph, Header's new className) via headless-browser text extraction, not just a source read
- [x] 6.7 Run `scc --dryness --exclude-dir .git,.hg,.svn,node_modules,.venv,raw web/src api pieces` and log the snapshot to `docs/metrics.md` **and** `web/src/data/metrics.json` before archiving this change, per the convention in `CLAUDE.md`

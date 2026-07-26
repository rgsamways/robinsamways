## 1. Track eligibility and re-scan on DOM change (design.md D1, D3)

- [x] 1.1 In `PageOutline.tsx`, add a ref tracking the maximum section count observed during the current page view, reset whenever `pathname` changes.
- [x] 1.2 Add a `MutationObserver` watching the `main` content area (`childList: true, subtree: true`), created/torn down in the same effect that resets on `pathname` change.
- [x] 1.3 On each mutation batch, debounce to one re-scan (a microtask or short delay — pick whichever keeps `sections` state updates minimal per filter click) and update the max-observed ref if the new count is higher.
- [x] 1.4 Change the "show at all" gate from `sections.length < MIN_SECTIONS_TO_SHOW` (checked against the current scan) to checking the max-observed ref, while still rendering however many sections are currently in `sections` (down to 1) once eligible.

## 2. Active-section reset on filter-out (design.md D4)

- [x] 2.1 After a re-scan, if `activeId` is no longer present in the new `sections` list, reset `activeId` to `null`.
- [x] 2.2 Confirm the existing `IntersectionObserver` effect (already keyed on `[sections]`) correctly tears down and re-observes the new element set after a re-scan — no changes expected there, just verify.

## 3. Test coverage

- [x] 3.1 Playwright: on `/services`, toggle pills down to a single visible section and confirm the outline shows exactly that one entry (not empty, not stale).
- [x] 3.2 Playwright: from that filtered-to-one state, re-enable a pill and confirm the outline grows back to include the restored section, live, no reload.
- [x] 3.3 Playwright: scroll to make a section active, then filter it out, and confirm no outline entry remains marked active.
- [x] 3.4 Confirm a page that only ever has 1 `SectionHeader` section (pick an existing example, unfiltered) still shows no outline at all — this rule shouldn't regress. (Existing `/metrics` test already covers this; still passes unchanged.)
- [x] 3.5 Vitest (if the max-observed/debounce logic is extracted into a small testable helper rather than living inline) — otherwise cover via the Playwright cases above. (Logic stayed inline in `PageOutline.tsx`; covered by 3.1–3.3 above.)

## 4. Pre-archive verification

- [x] 4.1 Full Vitest + Playwright suite green, `npm run build` clean.
- [x] 4.2 Drift audit: every requirement/scenario in the updated `page-outline-nav` delta checked against the real implementation on both `/services` and `/farpost`.
- [x] 4.3 Confirm `/techstacks` is genuinely unaffected (no `SectionHeader` content there) — a quick sanity check, not a new test.
- [x] 4.4 No `scc` re-log needed unless a new helper file is added beyond edits to `PageOutline.tsx` and its test file — note the decision either way. (No new file added; no re-log.)
- [x] 4.5 Log the resolution in `docs/issues.md` per the handoff-logging convention.

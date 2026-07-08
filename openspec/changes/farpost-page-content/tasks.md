## 1. Page content

- [x] 1.1 Replace the placeholder in `web/src/app/farpost/page.tsx` with the four drafted sections, in order: `ORIGIN_STORY`, `PROBLEMS_FARPOST_SOLVES`, `BUILDING_LIFECYCLE_EXAMPLE`, `PROCESS` — exact copy is in `design.md`, verbatim, not to be reworded
- [x] 1.2 Use the existing `SectionHeader` component per section, matching the ALL_CAPS naming convention already used on `/portfolio`
- [x] 1.3 Style `PROBLEMS_FARPOST_SOLVES`'s five bolded sub-points as clear visual sub-headings within the one section, not as five separate top-level sections
- [x] 1.4 Style `BUILDING_LIFECYCLE_EXAMPLE`'s dated entries consistently with the existing status-history timeline pattern from `RelationshipView.tsx` (chronological, `›`-prefixed entries) rather than inventing a new timeline component
- [x] 1.5 Make sure `BUILDING_LIFECYCLE_EXAMPLE`'s opening line ("a fictional example...") is visually clear as a disclaimer before the timeline itself, not buried

## 2. Verification

- [x] 2.1 Run `npm run build` in `/web` and confirm it succeeds
- [x] 2.2 Confirm no console warnings/errors on `/farpost`
- [x] 2.3 Proofread the final rendered page against the exact copy in `design.md` — flag (don't silently fix) anything that looks like it needs a wording change, since the copy is meant to be final

## 3. Housekeeping

- [x] 3.1 Update `docs/lightbulbs/rsw-lb-farpost-origin-story.md`'s status line from "unscoped — idea captured, not yet written into the page" to reflect that it became this OpenSpec change

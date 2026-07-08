## Why

`web/src/app/farpost/page.tsx` is still a bare placeholder ("// coming soon") — the same state the Portfolio page was in before the Salesforce case study filled it in. Robin and Chat drafted real, final copy for the page tonight (founder origin story, the problems Farpost actually solves, a worked example, and the engineering discipline behind building it), and it's ready to go into the page as-is.

## What Changes

- Replace the `/farpost` page's placeholder content with four fully-drafted sections, in this order: `ORIGIN_STORY`, `PROBLEMS_FARPOST_SOLVES`, `BUILDING_LIFECYCLE_EXAMPLE`, `PROCESS`. (This ordering — problems the origin story sets up, then a concrete illustration, then engineering process as a closing note — is Chat's judgment call, not Robin's explicit instruction beyond origin-story-first; adjustable if it reads wrong once assembled.)
- All copy is final and provided verbatim in `design.md` — this change is about placement, structure, and matching the site's existing presentation conventions, not wordsmithing.
- The `BUILDING_LIFECYCLE_EXAMPLE` section's dated entries should be styled consistently with the existing status-history timeline pattern already used in the Salesforce case study (`RelationshipView.tsx`), for visual consistency across the site.
- Update `docs/lightbulbs/rsw-lb-farpost-origin-story.md`'s status from "unscoped" to reflect that it became this real OpenSpec change.

## Capabilities

### New Capabilities
- `farpost-page-content`: the four-section content and layout for the `/farpost` page.

### Modified Capabilities
(none — no existing capability spec covers the `/farpost` page's content)

## Impact

- `web/src/app/farpost/page.tsx`: full rewrite from placeholder to real content.
- No API, data model, or dependency changes — this is presentation/content only.
- `docs/lightbulbs/rsw-lb-farpost-origin-story.md`: status update.

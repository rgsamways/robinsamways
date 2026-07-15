## Why

The site currently has no page that says, plainly, "I do this kind of work, here's the shape of it, get in touch" — the homepage is a resume, and Farpost/Tech-Stacks/Dev Log are all about specific projects. Robin wants a dedicated Services page a prospective client (not just a recruiter) can land on and immediately understand what's on offer.

## What Changes

- Add a new `/services` route and a "Services" link to the top-level hamburger menu (appended after Dev Log).
- The page follows the same shape already established by `/dev-log` and `/farpost`: a heading, a short intro blurb, then a pill bar (reusing the existing shared `SectionFilterBar`/`PillBar`/`filterSections` infrastructure — no new filter code needed) filtering six sections: Web Sites, Web Applications, Native Applications, Platform, Hourly, and Field Documentation.
- No prices or rates are shown publicly (per Robin's decision) — every section describes scope and ends with a call-to-action. Five of the six sections link to the homepage contact form; Field Documentation links out to `field.farpost.ca`, its own existing dedicated channel, instead.
- Web Sites is broken into 3 packages (draft placeholder tiers — names/scope to be edited by Robin after seeing them, per his decision to have a draft to react to rather than starting blank).
- The existing site-wide feedback widget (from `page-feedback`) applies to `/services` automatically, with no extra work, since it already renders on every non-homepage page from the root layout.

## Capabilities

### New Capabilities
- `services-page-content`: the Services page's sections, their content, the package-tier structure under Web Sites, and each section's call-to-action.

### Modified Capabilities
- `site-navigation`: the menu's link list and the placeholder-routes requirement both gain a "Services" entry.

## Impact

- `web/src/components/MenuToggle.tsx` — adds `{ href: "/services", label: "Services" }`.
- `web/src/app/services/page.tsx` (new) — six sections wrapped in the existing `SectionFilterBar`.
- `web/e2e/global-navigation.spec.ts` — add Services to `GLOBAL_MENU_LINKS`, extending existing parameterized coverage with no new test code.
- `web/e2e/services-section-filter.spec.ts` (new) — mirrors `dev-log-section-filter.spec.ts`/`farpost-section-filter.spec.ts`'s pill-bar coverage shape for six sections.
- `openspec/specs/site-navigation/spec.md` — two MODIFIED requirements (menu list, placeholder routes).
- `docs/metrics.md` + `web/src/data/metrics.json` — new `scc` snapshot appended at archive time.
- Out of scope: any change to the homepage contact form itself, to `field.farpost.ca` (an existing external site this change only links to), or to the shared filter infrastructure (reused as-is).

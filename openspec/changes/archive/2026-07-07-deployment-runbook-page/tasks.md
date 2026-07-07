## 1. Route and layout

- [x] 1.1 Create the route at `web/src/app/ops/deploy/page.tsx`
- [x] 1.2 Add `noindex` to the page's metadata (e.g. `robots: { index: false, follow: false }`)
- [x] 1.3 Do NOT add a link to this route in `web/src/components/MenuToggle.tsx` — confirm it stays absent

## 2. Content

- [x] 2.1 Port all eight parts of `docs/deployment-guide.md` into site components, reusing `SectionHeader` (or an equivalent) for each part heading and the site's existing accent/mono styling for commands, DNS records, and env vars
- [x] 2.2 Style callouts (gotchas/tips) and the verification checklist consistently with the site's existing Skills-box visual language (shaded box, accent-colored left border)
- [x] 2.3 Confirm the header (with menu) renders on this page like every other page, per the existing `site-navigation` spec

## 3. Verification

- [x] 3.1 Visit `/ops/deploy` directly and confirm all eight parts render correctly
- [x] 3.2 Confirm the route does not appear in the header menu on any page
- [x] 3.3 Confirm `noindex` is present in the rendered page's metadata
- [x] 3.4 Report back for Robin's review

## 1. Navigation

- [x] 1.1 Add `{ href: "/services", label: "Services" }` to `web/src/components/MenuToggle.tsx`'s `links` array, after Dev Log.
- [x] 1.2 Add `{ label: "Services", path: "/services" }` to `web/e2e/global-navigation.spec.ts`'s `GLOBAL_MENU_LINKS` array — this alone extends the existing "lists every destination" and per-link "navigates to X" tests to cover Services, no new test code needed.

## 2. Services page content

- [x] 2.1 Create `web/src/app/services/page.tsx`: "$ Services" heading, a short intro blurb (Robin is a developer available for freelance/contract work), then six sections built as `{id, label, node}` and passed to the existing `<SectionFilterBar sections={...} ariaLabel="filter services sections" />` — same wiring pattern as `dev-log/page.tsx` and `farpost/page.tsx`.
- [x] 2.2 Write the Web Sites section: three packages per design.md decision 2 (draft names/scope — **flag to Robin that this is placeholder copy for him to edit, not final**), no dollar figures, ending with a call-to-action link to `/`.
- [x] 2.3 Write the Web Applications section per design.md decision 2 (positioned between a website and a platform; references this site and Farpost Pulse as proof), ending with a call-to-action link to `/`.
- [x] 2.4 Write the Native Applications section per design.md decision 2 (Android development, current focus; references TapLog and the Padre Software native mobile work already on the resume), ending with a call-to-action link to `/`.
- [x] 2.5 Write the Platform section per design.md decision 2 (large builds, third-party integration, cloud; references Farpost itself and this site's demonstrated Salesforce/Stripe/Twilio/Azure integrations), ending with a call-to-action link to `/`.
- [x] 2.6 Write the Hourly section per design.md decision 2 (contract/hourly work against an existing codebase, no rate shown), ending with a call-to-action link to `/`.
- [x] 2.7 Write the Field Documentation section per design.md decision 2 (solo drone/ground-level property documentation, North Hastings, Transport Canada Basic RPAS certified, DJI Mini 4 Pro), ending with a call-to-action link to `field.farpost.ca` (not `/` — deliberate exception, see design.md decision 3).

## 3. Test coverage

- [x] 3.1 Add `web/e2e/services-section-filter.spec.ts` mirroring `dev-log-section-filter.spec.ts`/`farpost-section-filter.spec.ts`'s shape for six pills: all six render and all six sections show by default, activating one pill isolates its section, clearing all restores all six.
- [x] 3.2 Confirm the updated `global-navigation.spec.ts` (task 1.2) passes via `npm run test:e2e`.
- [x] 3.3 Take a quick screenshot of `/services` at a narrow mobile viewport and confirm the six-pill row wraps cleanly (per design.md's risk note — one more pill than any existing pill bar on the site).
- [x] 3.4 Run `npm run build` in `web/` and confirm a clean build.

## 4. Metrics and wrap-up

- [x] 4.1 Run `scc` against `web/src`, `api`, and `pieces`; append the new snapshot to `docs/metrics.md` (date, change name, headline numbers, one-line delta from the previous snapshot) and to `web/src/data/metrics.json`.
- [x] 4.2 If the new snapshot's DRYness drops below 55% or falls more than 10 points from the previous snapshot, log it as an open item in `docs/issues.md` per `CLAUDE.md`'s scc convention.
- [x] 4.3 Report status back to Robin for the drift audit against `openspec/specs/services-page-content/spec.md` and `openspec/specs/site-navigation/spec.md` — flag clearly that the Web Sites package copy (task 2.2) is a draft for him to review/edit before archiving, not finished marketing copy.

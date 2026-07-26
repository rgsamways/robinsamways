## 1. New /contact route

- [x] 1.1 Create `web/src/app/contact/page.tsx` rendering `PageHeading` + `ContactForm` (import unchanged from `web/src/components/resume/ContactForm.tsx`), matching the `## CONTACT` section-header styling it already uses on the homepage.
- [x] 1.2 Confirm `ContactForm` itself needs no code changes — same fields, same client-side validation, same `POST /contact` call.

## 2. Homepage pointer

- [x] 2.1 In `web/src/app/page.tsx`, replace the `## CONTACT` section's `<ContactForm />` with a short pointer sentence and a link to `/contact`, keeping the same section-header position (after Continuing Education, before the footer).

## 3. Nav

- [x] 3.1 Add a Contact entry to `DrawerNav.tsx`'s `NAV_GROUPS` Site group, after Metrics, linking to `/contact`.

## 4. Test coverage

- [x] 4.1 Confirm existing `ContactForm` Vitest/e2e coverage still passes unchanged (same component, new location).
- [x] 4.2 Add a small e2e check: `/contact` renders the real form and a successful submission behaves identically to before; the homepage's pointer link navigates to `/contact`.
- [x] 4.3 Update `global-navigation.spec.ts` (or wherever the Site group's entries are asserted) to include Contact.

## 5. Pre-archive verification

- [x] 5.1 Full Vitest + Playwright suite green, `npm run build` clean.
- [x] 5.2 Check `/contact` and the homepage's revised Contact section for the JSX whitespace-glue bug this project has hit repeatedly on new/changed content.
- [x] 5.3 Drift audit: every requirement/scenario in the updated `resume-homepage`, `contact-form`, and `site-navigation` deltas checked against the real implementation.
- [x] 5.4 No `scc` re-log needed unless file count changes meaningfully beyond the one new route file — note the decision either way.
- [x] 5.5 Log the resolution in `docs/issues.md` per the handoff-logging convention, and note that this change also formalizes the 5 ad hoc live tweaks from `docs/handoff-2026-07-26-post-mobile-chrome-tweaks.md` into a committed, full-suite-verified state if that hasn't happened separately by then.

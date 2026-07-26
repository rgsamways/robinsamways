## Why

Robin wants a standalone `/contact` page reachable from the left nav, with the contact form moved off the homepage entirely — the homepage currently locks the full form into its resume flow (`## CONTACT`, after Continuing Education, before the footer), which no longer reflects where he wants a visitor to actually reach it.

## What Changes

- New `/contact` route, under Site in the left nav (Home, Services, Metrics, Contact), rendering the real `ContactForm` (currently `web/src/components/resume/ContactForm.tsx`) with the same `## CONTACT` section-header styling it already uses.
- The homepage's `## CONTACT` section stops containing the form — it becomes a short pointer (one line, a link to `/contact`), staying in its existing position after Continuing Education and before the footer.
- `ContactForm` itself, and the `POST /contact` API endpoint it calls, are unchanged — only where the form renders moves.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `resume-homepage`: the "Contact section present after Continuing Education" requirement changes from containing the full form to containing a short pointer link to `/contact`.
- `contact-form`: the "Homepage contact form" requirement changes from "the homepage SHALL include a contact form" to "the `/contact` page SHALL include a contact form" — the API endpoint requirement is unaffected.
- `site-navigation`: the Site group's entry list changes from Home/Services/Metrics to Home/Services/Metrics/Contact.

## Impact

- `web/src/app/contact/page.tsx` — new route, renders `ContactForm`.
- `web/src/app/page.tsx` — `## CONTACT` section's content changes from the form to a pointer link.
- `web/src/components/DrawerNav.tsx` — `NAV_GROUPS`' Site entry list gains Contact.
- No change to `web/src/components/resume/ContactForm.tsx` or the API's `POST /contact` route.
- Test coverage: existing contact-form Vitest/e2e coverage should still pass unchanged (form behavior is identical, just relocated) plus a small addition confirming the new route renders it and the homepage pointer links correctly.

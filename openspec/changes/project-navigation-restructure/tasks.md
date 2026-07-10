## 1. Extract the reusable hamburger component

- [x] 1.1 Extract `MenuToggle.tsx`'s button+dropdown implementation into a new, generic `HamburgerMenu.tsx` component taking `links: {href: string; label: string}[]` and an `ariaLabel` prop (for the open/close button's accessible name, since more than one hamburger can now exist on a page)
- [x] 1.2 Refactor `MenuToggle.tsx` into a thin wrapper: keep its own hardcoded global `links` array (Home/Portfolio/Farpost/Dev Log — Sreditor added in section 5), render `HamburgerMenu` with it
- [x] 1.3 Preserve existing interaction behavior exactly — no click-outside-to-close or Escape handling added; this is an extraction, not a redesign
- [x] 1.4 Verify the global menu in the Header still opens, closes, navigates, and closes-on-link-click identically to before the refactor

## 2. Relocate Salesforce Loan Demo to its own route

- [x] 2.1 Create `web/src/app/portfolio/salesforce-loan-demo/page.tsx` containing the current `web/src/app/portfolio/page.tsx` content verbatim (including its use of `PortfolioDemos`) — a move, not a rewrite
- [x] 2.2 Verify `/portfolio/salesforce-loan-demo` renders identically to how `/portfolio` rendered before this change — same case-study copy, same live demo widget, same relationship view, same setup gallery

## 3. Rebuild Portfolio as a showcase index

- [x] 3.1 Replace `web/src/app/portfolio/page.tsx` with a new, lightweight index: a short intro sentence describing Portfolio as a showcase of individual project pieces, plus one teaser entry linking to `/portfolio/salesforce-loan-demo` — exact wording is a first pass, not final; flag if you want a suggested draft rather than writing it yourself
- [x] 3.2 Structure the index so a second project teaser can be added later without restructuring the page

## 4. Add local navigation menus

- [x] 4.1 Add a `HamburgerMenu` beside `/portfolio`'s "$ Portfolio" heading, linking to each individual project page (currently just Salesforce Loan Demo)
- [x] 4.2 Add a `HamburgerMenu` beside `/portfolio/salesforce-loan-demo`'s heading, linking to its own sections (Overview, Why Client Credentials Flow, Licensing Limitations, Farpost Parallel, Live Demo, Relationship View, Setup Gallery) — add matching `id` attributes to each section's heading if they don't already have one, so the links can jump to them
- [x] 4.3 Add a `HamburgerMenu` beside `/farpost`'s "$ Farpost" heading, linking to its own sections (Origin Story, Problems Farpost Solves, Building Lifecycle Example, Process) — same `id`-attribute requirement as above

## 5. Add Sreditor's nav slot

- [x] 5.1 Add `{ href: "/sreditor", label: "Sreditor" }` to `MenuToggle.tsx`'s global links array, after Dev Log
- [x] 5.2 Create `web/src/app/sreditor/page.tsx` as a placeholder, matching the exact pattern Portfolio and Farpost both used before their content was written ("$ Sreditor" heading, "// coming soon" style message) — no local `HamburgerMenu` yet, since there's nothing to link to

## 6. Verification

- [x] 6.1 Confirm every route works: `/portfolio` (index), `/portfolio/salesforce-loan-demo` (relocated case study), `/farpost` (unchanged content, new local menu), `/sreditor` (new placeholder)
- [x] 6.2 Confirm the global menu includes all five items (Home, Portfolio, Farpost, Dev Log, Sreditor) in order and navigates correctly
- [x] 6.3 Confirm each page's local menu links actually scroll to / navigate to the right target
- [x] 6.4 `npm run build` clean, no console warnings

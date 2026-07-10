## Context

Tonight's earlier work already established the pattern this change formalizes: Portfolio and Farpost both started as placeholders and got filled in one at a time. This change is the first piece of a broader, evolving site-architecture direction Robin and Chat talked through directly: every project page (an individual Portfolio project, Farpost, Sreditor) is the same underlying page template, just positioned at different tiers of the nav hierarchy depending on maturity — one-off "look what I can do" pieces live inside Portfolio's index; graduated, real-product-in-progress pieces (Farpost, eventually Sreditor) get their own top-level nav slot. A separate, later decision (already made, not part of this change) is that new project pages going forward will follow a scientific-method section structure (`PROBLEM` → `EXISTING_APPROACHES` → `HYPOTHESIS` → `METHOD` → `RESULTS` → `CONCLUSION`); today's existing pages (Salesforce Loan Demo, Farpost) are explicitly *not* being retrofitted to that structure in this change — that's deferred.

## Goals / Non-Goals

**Goals:**
- Give Portfolio, its first project page, and Farpost a working per-heading local navigation menu, built on one reusable component rather than three separate implementations.
- Relocate the Salesforce Loan Demo content to its own route with zero behavior change — a move, not a rewrite.
- Turn `/portfolio` into a real (if currently sparse) showcase index, ready to hold more project entries later.
- Add Sreditor's nav slot and placeholder route now, so the global menu already reflects the intended final shape even though Sreditor's real content doesn't exist yet.

**Non-Goals:**
- Writing Sreditor's actual page content — still being worked out conversationally, not ready to spec yet.
- Retrofitting Salesforce Loan Demo's or Farpost's existing sections into the scientific-method structure — explicitly deferred, agreed with Robin.
- Building the rural-demographics-api or any second Portfolio project — the index just needs to be *capable* of holding more than one entry, not have a second one yet.
- Any change to Farpost's or Salesforce Loan Demo's actual written content — only the addition of a local nav menu around it.

## Decisions

- **Extract, don't duplicate.** `MenuToggle.tsx`'s existing button+dropdown implementation becomes a generic, presentational `HamburgerMenu` component taking a `links: {href, label}[]` prop (and an `ariaLabel` for the open/close button, since "Open menu" is ambiguous once there are multiple hamburgers on one page — the global one and a page-local one). `MenuToggle` becomes a thin wrapper passing the global link list; Portfolio/Farpost pages render `HamburgerMenu` directly with their own link lists.
- **Preserve existing interaction behavior exactly during extraction.** The current `MenuToggle` has no click-outside-to-close or Escape-to-close handling — just toggle-button and link-click. This is a refactor, not a redesign; don't add new interaction behavior as a side effect of the extraction. (Worth a future accessibility pass, just not bundled into this change.)
- **New route slug: `/portfolio/salesforce-loan-demo`.** Descriptive, matches the capability name already used in OpenSpec (`salesforce-loan-demo`), and reads clearly in a URL.
- **Sreditor gets a route and a global-nav entry now, but no local hamburger yet.** A local menu with zero links is pointless UI; add it once Sreditor has real sections to link to, in whatever change actually writes that content.
- **Portfolio's index copy is intentionally minimal for now** — a short intro sentence plus one teaser entry. Robin explicitly wants to focus on structure right now, not content polish; the teaser text is easy to revise later without needing another structural change.

## Risks / Trade-offs

- [Relocating Salesforce Loan Demo's route could break any external links or bookmarks pointing at the old `/portfolio` URL as the case study] → acceptable; this site has no significant external inbound links yet, and the interview this was built for has already happened.
- [Two hamburgers visible at once on a project page — the global one in the Header, and the new page-local one next to the `<h1>`] → deliberate and already implied by Robin's own framing (global site nav vs. per-page local nav are different things); distinct `ariaLabel`s keep them screen-reader-distinguishable.

## Migration Plan

1. Extract `HamburgerMenu` from `MenuToggle`, verify the global menu still behaves identically.
2. Create `/portfolio/salesforce-loan-demo/page.tsx` with the current `/portfolio/page.tsx` content moved in verbatim (including its `PortfolioDemos` usage); verify it renders identically at the new URL.
3. Replace `/portfolio/page.tsx` with the new index page.
4. Add the local `HamburgerMenu` to Portfolio's index (linking to Salesforce Loan Demo) and to the Salesforce Loan Demo page itself (linking to its own sections).
5. Add the local `HamburgerMenu` to Farpost's page (linking to its own four sections).
6. Add Sreditor to the global menu and create its placeholder route.

## Open Questions

- Exact wording for Portfolio's index intro and the Salesforce Loan Demo teaser — left loose in `tasks.md`, since Robin wants to focus on structure first and revisit copy later.

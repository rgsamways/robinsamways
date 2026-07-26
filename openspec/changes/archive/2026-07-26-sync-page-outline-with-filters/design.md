## Context

Confirmed by direct investigation, not assumed: `SectionFilterBar.tsx` (used by `/services` and `/farpost`) owns `activeIds` state and computes `visibleSections = filterSections(sections, activeIds)`, rendering only the filtered result — toggling a pill fully unmounts/remounts `SectionHeader` instances, it doesn't CSS-hide them. `TechStacksBrowser.tsx` filters plain project links, not `SectionHeader` content, so `/techstacks` is unaffected. No `FarpostTabBar` component exists in this codebase. `PageOutline.tsx`'s only re-scan trigger today is `usePathname()` changing; there is no context, callback, or custom event connecting any filter component to `PageOutline` — confirmed absent, not just unlikely.

## Goals / Non-Goals

**Goals:**
- The outline reflects whatever `SectionHeader` content is actually rendered at any moment, including after in-page filtering, without polling or a fixed delay.
- No new coupling between `PageOutline` and `SectionFilterBar` (or any future filter component) — the fix should work for a filter mechanism that doesn't exist yet, same as the original DOM-scan design already works for pages nobody had written when it shipped.
- A page that's genuinely narrowed to 1 visible section via filtering still gets a useful 1-entry outline; a page that only ever has 1 section, unfiltered, still shows nothing (original rule's intent preserved, not discarded).

**Non-Goals:**
- No change to `SectionFilterBar`, `PillBar`, `filterSections.ts`, or `TechStacksBrowser` — this is entirely a `PageOutline`-side fix.
- No cross-page or persisted filter state — this is about staying in sync within a single page view, nothing more.

## Decisions

**D1 — A `MutationObserver` on the content area, not a callback/context wired to `SectionFilterBar`.**
Watching `main` for `childList`/`subtree` changes triggers a re-scan generically, regardless of *why* the DOM changed — a pill filter today, anything else tomorrow. *Alternative considered:* a shared context or callback prop `SectionFilterBar` calls on every toggle. Rejected — it would require every current and future filter-style component to remember to wire into it, reintroducing exactly the per-component opt-in fragility the original "derived at runtime from the page's actual rendered headings, not a hand-maintained list" design was built to avoid.

**D2 — Debounce re-scans to one per settled DOM batch.**
A single pill toggle can produce several mutation records in one React commit (removing multiple `SectionHeader` subtrees). Re-scanning on every individual mutation record would run the scan (and the `IntersectionObserver` teardown/setup effect that depends on `sections`) redundantly. Coalesce via a microtask or short delay so one filter click produces one re-scan.

**D3 — Track the maximum section count observed this page view, not just the current count, to gate whether the outline shows at all.**
A ref (reset whenever `pathname` changes) holds the highest section count seen so far. Once it reaches 2, the outline is "eligible" for the rest of this page view and shows however many sections are currently visible, down to a minimum of 1. A page that never crosses 2 (a genuinely single-section page, filtered or not) stays hidden, matching the original rule's rationale — the rule was never really about "exactly how many sections are visible right now," it was about "does this page have enough real structure to be worth an outline."
*Known limitation, stated rather than engineered around speculatively:* this assumes a page's default/initial filter state shows enough sections to cross 2 at least once — true today for both `/services` and `/farpost` (both default to all pills active). A hypothetical future page that deep-links directly into an already-narrowed filter state would never cross the threshold and would stay hidden even if broader filtering exists. Not solved here; flagged as a real but currently non-existent edge case.

**D4 — A filtered-out active section resets `activeId` to `null`, not a guessed replacement.**
If a re-scan's new section list no longer contains the currently active id, clear it. This matches the component's own existing initial state (no active section until the `IntersectionObserver` first fires) rather than inventing new "pick the nearest remaining section" logic for what's a rare edge case — the observer re-establishes a real active section on the next scroll or observer tick regardless.

## Risks / Trade-offs

- [Risk] A `MutationObserver` runs continuously for the life of the page view → Mitigation: scoped to one container, and this site's actual DOM churn from filtering is deliberate/low-frequency, not a hot loop.
- [Risk] D3's "ever reached 2" heuristic is an inference about initial filter state, not a guarantee → Mitigation: stated explicitly above; revisit only if a real page violates the assumption.

## Migration Plan

Pure client-side change, no data or schema impact. Normal deploy flow; rollback is a plain revert.

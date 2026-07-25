## 1. SectionHeader anchor ids

- [x] 1.1 Add a `slugify(title)` utility (lowercase, non-alphanumeric → `-`, trim leading/trailing `-`) — small shared function, not inlined into `SectionHeader.tsx` so the outline scanner/tests can reason about the same slug format without re-deriving it
- [x] 1.2 Update `SectionHeader.tsx` to render its `<h2>` with `id={slug}`, with same-page collision disambiguation (second+ occurrence of an identical slug gets a `-2`, `-3`, ... suffix) — collision registry is a `react` `cache()`-scoped `Set` per Server Component render pass (degrades to no-op, not a crash, for the one client-rendered consumer, `SetupGallery`)
- [x] 1.3 Unit test: slug generation (basic cases, punctuation, leading/trailing separators) and same-page collision suffixing — `web/src/components/__tests__/slugify.test.ts`, 9 tests

## 2. Outline discovery and panel

- [x] 2.1 Create `web/src/components/PageOutline.tsx`: on mount and on every `usePathname()` change, scan `main h2[id]` and build the section list (title text + id), in document order
- [x] 2.2 Render nothing (no trigger icon) when fewer than two sections are found; render the trigger icon otherwise
- [x] 2.3 Implement the flyout panel: list of anchor links, click navigates (`scrollIntoView` or equivalent smooth scroll) and closes the panel
- [x] 2.4 Implement dismissal: Escape key, backdrop click, explicit close button — matching `SetupGallery`'s existing modal conventions
- [x] 2.5 Implement active-section highlighting via `IntersectionObserver` over the same `h2[id]` elements, updating which entry is marked active as the visitor scrolls

## 3. Nav wiring and rail reorganization

- [x] 3.1 Remove the standalone Sign In link from `RightRail.tsx`'s mobile top bar — the top bar keeps only the cog button
- [x] 3.2 Move the Sign In icon into the shared rail element (the same div already sliding in on mobile / sticky on desktop), and add a new Account icon above it, linking to `/account`
- [x] 3.3 Add this change's outline trigger icon to the same shared rail element, below the theme toggle — final top-to-bottom rail order: Account, Sign In, theme toggle, outline trigger
- [x] 3.4 Build the minimal `/account` stub page (`web/src/app/account/page.tsx`) — an honest "not live yet" placeholder, same tone as `/sign-in`'s original stub
- [x] 3.5 Checked `global-navigation.spec.ts` and `services-section-filter.spec.ts` directly (grep for "Sign In"/"Sign in"/aria-labels) — neither hardcodes the old mobile-top-bar Sign In link; it was never asserted on by name/text in either spec, so nothing needed updating. Confirmed via a full e2e re-run (74/74 pass) rather than assuming.
- [x] 3.6 `docs/lightbulbs/rsw-lb-account-hub-private-chat.md` and its `rsw-lb-index.md` entry both already present — confirmed, not re-authored

## 4. Testing (representative, per this project's testing convention)

- [x] 4.1 Playwright e2e: a page with 2+ sections shows the trigger; opening it lists sections in order; clicking an entry scrolls to and closes; Escape/backdrop/close-button each dismiss — `web/e2e/page-outline.spec.ts`
- [x] 4.2 Playwright e2e: a page with 0 or 1 sections shows no trigger — same file, two dedicated tests (`/sign-in` for 0, `/dev-log/glossary` for 1)
- [x] 4.3 Vitest: covered by 1.3 above (slug utility) — no additional component-level unit tests needed beyond the e2e coverage of the interactive behavior

## 5. Docs and process

- [x] 5.1 Drift audit against this change's spec before archiving — every requirement/scenario in both `page-outline-nav` and `account-hub-stub` specs checked against the real implementation; `openspec validate --strict` passes
- [x] 5.2 Run `scc` against `web/src`, `api`, and `pieces` and log the snapshot to `docs/metrics.md` and `web/src/data/metrics.json` at archive time — 227 files, DRYness flat at 58%

## 1. Shared mobile-nav open state (design.md D1)

- [x] 1.1 Create `web/src/components/MobileNavContext.tsx` exporting a `{ open, setOpen }` context + `useMobileNav()` hook.
- [x] 1.2 Mount a small client provider wrapping `<DrawerNav />` and `<RightRail />` together in `web/src/app/layout.tsx`.
- [x] 1.3 Update `DrawerNav.tsx` to read/write `open` via `useMobileNav()` instead of its own local `useState` for the mobile panel.

## 2. Full-viewport mobile nav panel (design.md D5)

- [x] 2.1 In `DrawerNav.tsx`, replace the mobile panel's container classes (`w-72`, `-translate-x-full`/`translate-x-0`) with a full-viewport takeover (`fixed inset-0`), keeping the existing `xl:sticky xl:w-64` desktop styling untouched.
- [x] 2.2 Remove the backdrop `<div>` (`bg-black/40`) — nothing shows behind an opaque full-viewport panel.
- [x] 2.3 Keep `NAV_GROUPS`, `NavItem`, and all collapse/expand/auto-expand-on-active-route logic unchanged.
- [x] 2.4 Keep an explicit close control sized appropriately for the full-viewport layout; confirm Escape and link-click still close it via the shared context.
- [x] 2.5 Keep the existing fade/slide transition for polish, gated by the `motion-safe-transition` reduced-motion CSS hook.

## 3. Unified mobile top bar (design.md Context, Goals)

- [x] 3.1 In `DrawerNav.tsx`, remove the hamburger button from its own top-bar row — the row now shows only the "$ Robin Samways" brand pill, top-left.
- [x] 3.2 In `RightRail.tsx`, replace the current single-cog mobile top bar with a 3-icon cluster, top-right, in this order: Account-or-Sign-In icon, menu/hamburger icon (calling `setOpen(true)` from `useMobileNav()`), Settings icon.
- [x] 3.3 Remove `RightRail`'s old mobile slide-in panel entirely (the narrow `w-16` panel, its own backdrop, and its own open/close state) — Account-or-Sign-In and Settings are now direct links in the top bar, nothing opens.
- [x] 3.4 Confirm the desktop persistent rail's icon order still reads top-to-bottom sensibly with the widened rail from task group 5.

## 4. Session-conditional icon, no reload needed (design.md D4)

- [x] 4.1 In `web/src/components/session.ts`, have `storeSession()` set `document.documentElement.dataset.signedIn = "true"` and `clearSession()` remove that attribute, alongside their existing localStorage writes.
- [x] 4.2 Add a bootstrap effect (extend `SettingsBootstrap` or add a small sibling mounted the same way) that sets the initial `data-signed-in` attribute from `getStoredSession()` on first load.
- [x] 4.3 Add global CSS rules to `globals.css`, next to the existing `.reduce-motion` rule, toggling visibility of a "signed-in-only" vs. "signed-out-only" element based on `html[data-signed-in="true"]`.
- [x] 4.4 Update `RightRail.tsx` (both the desktop rail and the new mobile cluster from task 3.2) to render both the Account link and the Sign In link unconditionally, tagged with the new CSS classes, replacing the old always-both-visible rendering.

## 5. Right rail widening + inline outline (design.md D2, D3)

- [x] 5.1 Widen `RightRail.tsx`'s desktop rail from `xl:w-16` to `xl:w-64`.
- [x] 5.2 Rework `PageOutline.tsx`: remove `createPortal`, the backdrop, and the open/close panel state — render the anchor list inline, directly in the rail's flow.
- [x] 5.3 Make the outline's visibility CSS-only (`hidden xl:block`), so it never renders any trigger or content below the `xl` breakpoint.
- [x] 5.4 Keep the existing `IntersectionObserver`-driven active-section highlighting and the click-to-scroll behavior (respecting reduced motion), applied to the always-rendered list instead of a conditionally-open one.
- [x] 5.5 Confirm via grep that `PageOutline` was the only `createPortal` consumer in the codebase before removing the import; remove it if so.

## 6. Account page sign-out (design.md D6)

- [x] 6.1 Update `web/src/app/account/page.tsx` (or add a small client subcomponent it renders) to check `getStoredSession()` on mount.
- [x] 6.2 When a session exists, render a Sign Out button alongside the existing "isn't live yet" message; when none exists, render only the existing message.
- [x] 6.3 Sign Out button calls `clearSession()` then a client-side navigation back to `/` (no hard reload needed, per D4's side benefit).

## 7. Header photo position fix (design.md D7)

- [x] 7.1 In `Header.tsx`, swap the flex container's children (contact-info block first/left, `<Image>` last/right) and add `justify-between` so the photo pins to the far edge — no breakpoint-specific classes, applies at every viewport width, restoring `resume-homepage`'s already-shipped requirement.

## 8. Test coverage updates

- [x] 8.1 Update `web/e2e/global-navigation.spec.ts`: replace the backdrop-click-closes assertion (removed) with full-viewport-takeover assertions (covers the viewport, closes via Escape/close-button/link-click), and update selectors for the new top-bar icon cluster.
- [x] 8.2 Update `web/e2e/page-outline.spec.ts`: remove open/close-panel assertions, add always-visible-on-desktop assertions (2+ sections), and add a case confirming no outline appears at all on a mobile viewport regardless of section count.
- [x] 8.3 Add Vitest coverage for `session.ts`'s new `data-signed-in` attribute toggling in `storeSession()`/`clearSession()`.
- [x] 8.4 Add e2e coverage for the session-conditional icon swap (signed-out state shows Sign In only; after completing sign-in, Account shows and Sign In doesn't; after Sign Out from `/account`, Sign In shows again) and for `/account`'s Sign Out button end-to-end.
- [x] 8.5 Add a lightweight check (Vitest or a headless render assertion) confirming `Header.tsx` renders the photo after the contact-info block in the DOM.

## 9. Pre-archive verification

- [x] 9.1 Full Vitest + Playwright suite green, `npm run build` clean.
- [x] 9.2 Drift audit: every requirement/scenario in the updated `site-navigation`, `page-outline-nav`, `account-hub-stub`, and `site-settings-page` deltas checked against the real implementation.
- [x] 9.3 Run `scc --dryness --exclude-dir .git,.hg,.svn,node_modules,.venv,raw web/src api pieces`, log the snapshot to both `docs/metrics.md` and `web/src/data/metrics.json` with a one-line delta from the previous snapshot.
- [x] 9.4 Log the resolution in `docs/issues.md` per the handoff-logging convention, including any judgment calls made beyond this file's literal wording.

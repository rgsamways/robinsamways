## Why

The laptop/desktop chrome (left `DrawerNav`, right `RightRail`) already looks the way Robin wants it. Mobile doesn't: the top bar splits controls across two independent fixed bars (a hamburger + brand pill on the left, a lone cog on the right), the nav opens into a narrow drawer behind a dim scrim instead of taking over the screen the way Better Auth's mobile nav does, and the account/sign-in icons show unconditionally instead of reflecting whether a visitor is actually signed in — even though real passwordless sign-in already exists in this codebase. The homepage header photo has also drifted to the left of its info block on every viewport, contradicting `resume-homepage`'s own already-shipped spec.

## What Changes

- Mobile top bar becomes: brand pill top-left (unchanged), one 3-icon cluster top-right — Account-or-Sign-In (session-conditional), menu, settings.
- The mobile nav panel changes from a narrow (`w-72`) slide-in drawer with a dim backdrop to a full-viewport takeover, mirroring Better Auth's mobile nav — no scrim, no competing content, just the nav.
- `RightRail`'s separate mobile trigger-and-slide-panel mechanism (cog opens a narrow `w-16` icon strip) is retired; Account/Sign-In and Settings become direct top-bar icons on mobile, nothing to open.
- The Account/Sign-In icon becomes session-conditional everywhere (mobile and desktop): shows Sign In when signed out, Account when signed in — never both, driven by the existing `getStoredSession()`.
- `/account` gains a real, working Sign Out button (using the existing `clearSession()`) when a session exists, while remaining an honest "hub isn't live yet" placeholder otherwise.
- The desktop right rail widens and its "on this page" outline stops being a click-to-open, portaled modal — it becomes a persistent inline anchor list (Better-Auth-docs style): click an entry, the page scrolls there, nothing opens or closes.
- The on-page outline is dropped from mobile entirely for now — no trigger, no access point there.
- `Header.tsx`'s photo moves back to the right of the contact-info block (loc/tel/email on the left), restoring `resume-homepage`'s already-specified "top-right" layout — a code fix, not a spec change, bundled here because it's the same area Robin's mockups already cover.
- **BREAKING**: the mobile nav's dismissible-backdrop interaction (click backdrop to close) goes away with the scrim itself — closing is now Escape, an explicit close control, or selecting a link.

## Capabilities

### New Capabilities
(none — this reworks how existing nav/outline/account capabilities present on mobile and desktop, it doesn't introduce a new one)

### Modified Capabilities
- `site-navigation`: the mobile menu mechanism changes from a slide-in drawer with a dismissible backdrop to a full-viewport takeover; top-bar composition changes (hamburger moves out of the brand-pill bar into the new right-side icon cluster).
- `page-outline-nav`: the outline trigger/panel model is replaced by an always-visible inline anchor list on desktop only; it is no longer shown on mobile at all, so the panel-dismissal (Escape/backdrop/close-button) and "mobile top bar shows only the cog" requirements no longer apply as written.
- `account-hub-stub`: the Account icon becomes session-conditional (swapping with Sign In, not shown alongside it) rather than always present; `/account` gains a real, working Sign Out control instead of being a pure placeholder.
- `site-settings-page`: the reduced-motion requirement's "nav rail's slide transition" scenario needs to reflect that `RightRail` no longer has a slide transition on mobile (it's retired) — only the nav panel's (formerly `DrawerNav`'s drawer, now the full-viewport takeover) transition remains subject to reduced motion.

## Impact

- `web/src/components/DrawerNav.tsx` — mobile top bar and slide-in panel restructured to a full-viewport takeover; hamburger trigger moves out of this component's own top bar.
- `web/src/components/RightRail.tsx` — mobile slide-panel mechanism removed; icons render directly in the shared mobile top bar; Account/Sign-In icon becomes session-conditional; hosts the new full-viewport nav's trigger button, requiring shared open/close state with `DrawerNav` (see design.md).
- `web/src/components/PageOutline.tsx` — reworked from a portaled click-to-open panel to a persistent inline list, desktop-only; the `createPortal`-to-`document.body` workaround likely becomes unnecessary.
- `web/src/components/Header.tsx` — photo/contact-info order swapped back to match the already-shipped `resume-homepage` spec.
- `web/src/app/account/page.tsx` — gains a client-side session check and a working Sign Out button.
- Test coverage: `web/e2e/global-navigation.spec.ts`, `web/e2e/page-outline.spec.ts`, and related Vitest specs need updates to match the new interaction model, not just additions alongside stale assertions.

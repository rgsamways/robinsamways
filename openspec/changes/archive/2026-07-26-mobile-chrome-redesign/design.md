## Context

`DrawerNav.tsx` and `RightRail.tsx` are two fully independent components, each rendering its own fixed mobile top bar (`xl:hidden`) and its own slide-in panel with its own open/close state — they don't share anything today. `PageOutline.tsx` is a click-to-open panel `createPortal`'d to `document.body` specifically because `RightRail`'s own element carries a permanent CSS transform (needed for its slide animation) that would otherwise break a nested `position: fixed` modal. Real session state already exists (`session.ts`'s `getStoredSession()`/`storeSession()`/`clearSession()`, localStorage-backed) but nothing reads it today — `RightRail` renders both an Account and a Sign In icon unconditionally. Per `site-settings-page`'s own precedent (`docs/issues.md`, 2026-07-25 entry), `RightRail`/`PageOutline` mount once at the root layout and never remount on client-side navigation — that constraint already shaped how theme/font-scale/reduced-motion settings apply (a `data-*`/class attribute on `<html>`, flipped directly by the setting's own write function, read live by CSS or by an on-demand JS check at interaction time — never cached React state that could go stale).

## Goals / Non-Goals

**Goals:**
- Consolidate the mobile top bar into one visual row: brand pill left, a 3-icon cluster (Account-or-Sign-In, Menu, Settings) right.
- Replace the mobile nav's narrow slide-in + scrim with a full-viewport takeover, reusing `DrawerNav`'s existing `NAV_GROUPS` content unchanged.
- Make the Account/Sign-In icon genuinely reflect session state, on both mobile and desktop, without going stale given the no-remount constraint above.
- Turn the desktop outline into a persistent inline anchor list in a widened rail; drop it from mobile.
- Restore `Header.tsx`'s photo to the right, per `resume-homepage`'s already-shipped (but currently un-implemented) requirement.

**Non-Goals:**
- No new auth backend or Better Auth adoption — this only consumes what already exists.
- No mobile access to the page outline (explicitly deferred).
- No change to nav information architecture (`NAV_GROUPS` content/grouping stays as-is).
- No visual theming changes beyond layout/positioning.

## Decisions

**D1 — Shared mobile-nav open state via a small React context, not a lifted-state prop or a DOM-attribute hack.**
The hamburger trigger needs to render visually inside `RightRail`'s icon cluster, but the nav panel itself (content, `NAV_GROUPS`, collapse logic) stays owned by `DrawerNav`. A new `MobileNavContext.tsx` (a `{ open, setOpen }` context + hook) is provided by a small client wrapper mounted in `layout.tsx` around both `<DrawerNav />` and `<RightRail />`. `RightRail` renders the trigger button and calls `setOpen(true)`; `DrawerNav` renders the full-viewport panel keyed off the same `open` value and calls `setOpen(false)` on close/link-click/Escape.
*Alternative considered:* lifting `open` state directly into `layout.tsx`. Rejected — `layout.tsx` is a Server Component; forcing it client-side to hold interactive state would lose server rendering for the entire app shell just to pass one boolean down two levels.
*Alternative considered:* a DOM-attribute toggle (like D4 below). Rejected here specifically because the panel's *content* (not just visibility) needs the open boolean to conditionally mount/behave (Escape listener, focus handling) — that's genuine component state, not a style toggle, so React state is the right tool, unlike D4's case.

**D2 — `PageOutline` becomes a plain inline block, CSS-responsive only, no portal.**
Once the outline is desktop-only and always-visible (not a modal), the transformed-ancestor problem that motivated `createPortal` no longer applies — it just renders inline inside `RightRail`'s widened column. Visibility is `hidden xl:block`, matching every other responsive element on this site (CSS breakpoint, not a JS `matchMedia` check). Confirmed via grep that `PageOutline` is the only `createPortal` consumer in the codebase, so removing it has no other blast radius.

**D3 — Right rail widens to `xl:w-64` (matching `DrawerNav`'s own width).**
Symmetric with the left nav, and 256px comfortably fits this site's actual section-heading lengths (checked against existing `SectionHeader` titles sitewide) without wrapping in the common case. Simpler to reason about than picking a new bespoke width.

**D4 — Session-conditional icon via a `data-signed-in` attribute on `<html>`, not React state or a new event bus.**
`storeSession()` and `clearSession()` (in `session.ts`) additionally set `document.documentElement.dataset.signedIn = "true"` / remove it, at the same moment they write/clear localStorage. A small bootstrap effect (extending the existing `SettingsBootstrap`, or a sibling mounted the same way) sets the initial attribute from `getStoredSession()` on first load. Both the Account link and the Sign In link render unconditionally in the DOM; new global CSS in `globals.css` (mirroring the existing `.reduce-motion` rule's shape) shows exactly one based on the attribute — e.g. `html:not([data-signed-in="true"]) .signed-in-only { display: none }` / `html[data-signed-in="true"] .signed-out-only { display: none }`.
*Why not React state:* `RightRail` mounts once at the root layout and never remounts on client-side navigation (established precedent, `site-settings-page`) — a `useState` read once on mount would go stale the instant a visitor signs in or out without a full reload. This is the same problem theme/font-scale/reduced-motion already solved with a DOM attribute/class read live by CSS; reusing that pattern here means sign-in/sign-out reflect instantly with no reload and no new context/event-bus plumbing.
*Side benefit:* `/account`'s Sign Out button (D6) no longer needs a hard page reload to update the rail — `clearSession()` flips the attribute directly, so a plain client-side navigation back to `/` is enough.

**D5 — Full-viewport mobile nav reuses `DrawerNav`'s existing content/logic untouched.**
Only the outer container changes: `fixed inset-0` instead of `w-72` + `-translate-x-full`/`translate-x-0`, no backdrop `<div>` (nothing shows behind an opaque full-viewport panel). `NAV_GROUPS`, `NavItem`, collapse/expand, and per-item auto-expand-on-active-route logic are unchanged. A quick fade/slide transition is kept for polish, gated by the existing reduced-motion CSS hook (`motion-safe-transition`), consistent with how the current drawer animates.

**D6 — `/account`'s Sign Out button.**
Calls `clearSession()` (which flips the `data-signed-in` attribute per D4) then a plain client-side `router.push("/")` — no hard reload needed, per D4's side benefit. Rendered only when `getStoredSession()` returns non-null at mount (this one page's own small client check, distinct from the rail's attribute-driven approach, since this page needs the actual email/token, not just a boolean).

**D7 — `Header.tsx` order swap.**
Swap the two children of the existing `flex items-start gap-4` container (contact-info block first/left, `<Image>` last/right) and add `justify-between` so the photo pins to the far edge rather than sitting immediately after the text. No breakpoint-specific classes — matches `resume-homepage`'s requirement that this layout hold "on every viewport width."

## Risks / Trade-offs

- [Risk] Removing the mobile nav's click-outside-to-close backdrop is a real interaction change some returning visitors won't expect → Mitigation: this is Robin's own explicit, informed choice (mirroring Better Auth's proven pattern); Escape and an explicit close control remain.
- [Risk] D4's approach renders both icon variants in the DOM at all times → Mitigation: negligible — two small `<Link>` elements, no measurable cost, and it avoids a heavier context/event-bus solution for a problem CSS attributes already solve elsewhere in this codebase.
- [Risk] Global CSS rules keyed off a DOM attribute are easy to forget when adding a *third* rail icon later → Mitigation: keep both selectors adjacent to the existing `.reduce-motion` rule in `globals.css` with a short comment pointing at this decision.
- [Risk] `MobileNavContext` is a new piece of shared client state in a codebase that otherwise favors plain modules (`theme.ts`, `session.ts`) → Mitigation: justified specifically because this is live, two-way UI state (open/close), not a persisted preference — the existing plain-module pattern doesn't fit this case, D1 explains why.

## Migration Plan

Pure client-side UI change — no data migration, no schema, no environment variables. Ships through the normal Vercel deploy flow. Rollback is a plain revert; nothing persisted (session tokens, localStorage keys) changes shape.

## Open Questions

None blocking — the one judgment call left to implementation is exactly how much transition/animation (if any) the full-viewport nav keeps for polish; default to a quick fade respecting reduced-motion, per D5.

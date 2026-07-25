## Why

`/settings` currently ships as an honest stub ("isn't live yet") from `page-outline-nav`, and the site's only real display preference — light/dark theme — lives as a toggle button inside `RightRail.tsx`, disconnected from any dedicated settings surface. Robin asked for a real settings page and confirmed the theme toggle should move there rather than stay in the rail, alongside a short list of genuinely common, broadly valuable preferences from other big-name applications: a font-size scale and a reduced-motion override, on top of the theme toggle itself.

## What Changes

- Build `/settings` for real, replacing the stub: one page, one section per setting (matching this site's existing `SectionHeader`-delimited single-page pattern, e.g. `/services`), each section holding that setting's actual control.
- **Theme** — the existing light/dark toggle relocates from `RightRail.tsx` to `/settings`. Same underlying `theme.ts` logic and localStorage key, just a different component renders the control; the rail loses this button entirely (final rail order: Settings → Account → Sign In → outline trigger).
- **Font size** — a small scale (Small / Default / Large / Extra Large), applied via a root CSS custom property multiplier so existing `rem`-based sizing scales proportionally without touching every component's className.
- **Reduced motion** — a tri-state control (System / On / Off) that actually disables this site's real existing animations (`RightRail`'s slide transition, `PageOutline`'s smooth `scrollIntoView`) when resolved to "on," rather than a checkbox with nothing behind it. Defaults to respecting the OS `prefers-reduced-motion` preference.
- Extract the "apply persisted settings on mount" bootstrapping (currently entangled in `RightRail.tsx`'s own effect, theme-only) into its own small, always-mounted component, since it's about to cover three settings instead of one and doesn't belong embedded in a nav component.
- Explicitly **not** built now, deliberately deferred (see design.md's Non-Goals): high-contrast/underline-links mode, email preferences, and a keyboard-shortcuts cheat sheet — all real ideas from the same brainstorm, held back because each needs its own scoping pass rather than being bundled in by default. Session management ("sign out everywhere") stays with the account-hub idea (`rsw-lb-account-hub-private-chat.md`), not general site settings.

## Capabilities

### New Capabilities
- `site-settings-page`: the real `/settings` page, its font-size and reduced-motion preferences, and the global bootstrap that applies every persisted setting (theme included) on every page load regardless of which page a visitor is on.

### Modified Capabilities
- None with an existing spec. `RightRail.tsx`'s theme toggle was never specced on its own (it shipped as part of `left-nav-restructure`'s drawer-nav work); this change removes it as part of relocating the capability, not amending a prior requirement.

## Impact

- `web/src/app/settings/page.tsx`: real controls replacing the stub.
- `web/src/components/RightRail.tsx`: theme toggle button removed entirely.
- New small utilities mirroring `theme.ts`'s exact shape (storage key + `resolveInitial...` pure function) for font-size and reduced-motion.
- New always-mounted bootstrap component (e.g. rendered once in `app/layout.tsx`) applying all three persisted settings on mount — replaces the theme-only version of this logic currently living inside `RightRail.tsx`.
- Existing animated elements (`RightRail`'s slide transition, `PageOutline`'s scroll behavior) gain real conditional logic keyed off the reduced-motion setting.
- No backend, no new dependency.

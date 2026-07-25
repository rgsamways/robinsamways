## Context

`theme.ts` already establishes the site's one existing pattern for a persisted display preference: a storage key constant plus a pure `resolveInitialTheme(stored, osPreference)` function, applied on mount via an effect that currently lives inside `RightRail.tsx` (which also renders the toggle button itself). `RightRail.tsx` is rendered unconditionally in the root layout, so it doubles today as both "the nav rail" and "the thing that bootstraps theme on every page load" — a coupling that was harmless at one setting but doesn't scale cleanly to three.

## Goals / Non-Goals

**Goals:**
- A real `/settings` page controlling theme, font size, and reduced motion.
- Every persisted setting applies on every page load, regardless of which page a visitor lands on or navigates to — not just when `/settings` itself is mounted.
- Reduced motion actually changes real behavior (the rail's slide transition, the outline's smooth scroll), not just a stored flag with no effect.
- Follow `theme.ts`'s exact established shape for each new setting, so the pattern stays recognizable rather than each setting inventing its own persistence style.

**Non-Goals:**
- High-contrast/underline-links mode — a real idea from the same brainstorm, held back because it needs its own visual-design pass (what actually changes under high contrast) rather than being bundled in by default alongside settings that are purely mechanical (a scale, a boolean).
- Email preferences — no concrete "what emails does this site send outside Stripe's own receipts" inventory exists yet; a preferences UI with nothing real behind it isn't worth building.
- Keyboard shortcuts cheat sheet — independent feature (a `?`-triggered modal), doesn't depend on or block anything here; a natural fast-follow, not part of this change.
- Session management ("sign out everywhere") — belongs to the account-hub idea, not general site settings; not duplicated here.
- A three-way light/dark/system theme selector — the existing toggle is binary (light/dark) and already resolves system preference when nothing is stored; this change relocates it, it doesn't redesign it.

## Decisions

**D1 — One page, one `SectionHeader` per setting.** Matches `/services`' existing single-page, multi-section pattern rather than inventing per-setting sub-routes. Free side benefit: once `/settings` has its real sections, `page-outline-nav`'s existing ≥2-heading rule picks it up automatically — no special-casing needed, the outline trigger just appears once there's real content to outline.

**D2 — Persisted-settings bootstrap moves out of `RightRail.tsx` into its own small, always-mounted component.** `RightRail.tsx`'s job is navigation; theme-application logic living inside it was tolerable at one setting, not at three. A new component (mounted once in `app/layout.tsx`, alongside `DrawerNav`/`RightRail`) reads all three storage keys on mount and applies the corresponding DOM state (theme's `dark` class, font-scale's CSS variable, reduced-motion's class) — `RightRail.tsx` afterward contains zero settings-related code, only nav icons.

**D3 — Font size is a CSS custom property multiplier, not per-component overrides.** A `--font-scale` variable set on `<html>`, with the root `font-size` computed from it (`calc(1rem * var(--font-scale))`), so every existing `rem`-based size scales proportionally for free. No component needs to know the setting exists.

**D4 — Reduced motion is tri-state (System/On/Off), mirroring the real semantics of `prefers-reduced-motion`.** "System" (the default) means no stored override — the OS media query decides. An explicit override in either direction takes precedence, exactly like theme's own "stored preference beats OS preference" rule. Resolved to a single boolean at apply-time (`shouldReduceMotion`), consumed by the two real animated elements this site has: `RightRail`'s slide transition (skip the `transition-transform` classes) and `PageOutline`'s `scrollIntoView` (`behavior: "auto"` instead of `"smooth"`).

**D5 — Each new setting gets its own storage key and its own pure resolve function, matching `theme.ts` exactly** (e.g. `FONT_SCALE_STORAGE_KEY` / `resolveInitialFontScale`, `REDUCED_MOTION_STORAGE_KEY` / `resolveInitialReducedMotion`) rather than one combined settings object. Keeps each setting independently testable (mirroring how theme's own resolve function is a plain, isolated unit) and avoids a shared-blob schema that has to be migrated later if a setting's shape changes.

## Risks / Trade-offs

**[Behavioral wiring drift]** → Reduced motion is only worth building if it actually gates real animations. Both real animated elements this site has today (`RightRail` transition, `PageOutline` scroll) are explicitly in scope to wire up — not just the setting's storage/UI half.

**[Bootstrap timing]** → The new global bootstrap component must apply settings before paint is visible where feasible (same class-of-problem `theme.ts`'s own mount effect already has — a brief flash of the wrong theme/font-scale on first load is a pre-existing, accepted trade-off in this codebase, not something this change needs to solve for the first time).

## Migration Plan

No data, no backend. `RightRail.tsx` loses a button; `/settings` gains real controls in place of its stub copy. Anyone with an existing theme preference in localStorage keeps it — the storage key itself doesn't change, only which component reads/writes it.

## Open Questions

- Whether font-scale's four steps are the right granularity (vs. a continuous slider) — start with discrete steps since that's simpler to test and reason about; revisit only if it feels insufficient in practice.

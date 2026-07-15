## Why

The whole site currently ships one fixed light color scheme, defined once as a handful of CSS custom properties (`--background`, `--foreground`, `--muted`, `--accent`, `--skills-bg`) that every component already consumes via Tailwind's `bg-background`/`text-foreground`/etc. tokens rather than hardcoded colors. That architecture makes a site-wide dark mode a genuinely small, low-risk addition — a second set of token values plus a toggle, not a per-component rewrite.

## What Changes

- Add a light/dark theme toggle in the header, rendered as a lightbulb icon directly below the existing hamburger menu toggle.
- Add a `.dark` CSS class that overrides the five existing color tokens in `globals.css`; toggling adds/removes that class on `<html>`, re-theming the whole site instantly with no per-component changes.
- On first visit (no stored preference yet), the site defaults to the visitor's OS-level `prefers-color-scheme`; once a visitor toggles explicitly, that choice persists (`localStorage`) and overrides the OS preference on future visits.
- A small blocking script in `<head>` applies the resolved theme before first paint, avoiding a flash of the wrong theme.
- Theme state itself (persistence, default-to-system-preference) is implemented with plain React state, `localStorage`, and `matchMedia` — no new dependency for that. The toggle's icon uses `lucide-react`'s `Lightbulb` (this site's first icon-library dependency), chosen over an emoji glyph for consistent cross-browser rendering; logged in `docs/stack.md` per this project's stack-tracking convention.

## Capabilities

### New Capabilities
- `theme-toggle`: a site-wide light/dark mode toggle, its persistence behavior, and its default-to-system-preference behavior.

### Modified Capabilities
(none — this doesn't change any existing requirement's text)

## Impact

- `web/src/app/globals.css` — new `.dark` token overrides.
- `web/src/app/layout.tsx` — blocking inline theme-resolution script in `<head>`, `suppressHydrationWarning` on `<html>`.
- `web/src/components/Header.tsx` — renders the new toggle below `MenuToggle`.
- `web/src/components/ThemeToggle.tsx` (new) + `web/src/components/theme.ts` (new, pure theme-resolution logic) + `web/src/components/__tests__/theme.test.ts` (new).
- `web/e2e/` — new e2e coverage for the toggle's default/toggle/persist behavior.
- Known, explicit non-goal: `/farpost/farpost-atlas`'s Leaflet map tiles are third-party raster imagery (OpenStreetMap) and won't re-theme with the page — only the page chrome around the map does.
- `docs/metrics.md` + `web/src/data/metrics.json` — new `scc` snapshot appended at archive time.

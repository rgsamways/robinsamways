## Context

Every color on this site already flows through five CSS custom properties defined once in `globals.css` (`--background`, `--foreground`, `--muted`, `--accent`, `--skills-bg`), re-exposed as Tailwind v4 theme tokens via `@theme inline`, and consumed everywhere as `bg-background`, `text-foreground`, `text-muted`, `text-accent`, `bg-skills-bg`. A grep across every component for hardcoded colors turned up only: two SVG trend charts that already read `var(--accent)` directly (so they'll follow a theme swap automatically), a generated favicon (`app/icon.tsx`, a static asset — out of scope, favicons don't need to react to page theme), Farpost Atlas's density-choropleth fill colors (a fixed data-viz color ramp, not a light/dark page-chrome concern), and a modal backdrop's `bg-black/80` scrim (already theme-agnostic by design). Nothing else bypasses the token system — this is what makes a global toggle a small change here rather than a per-component audit.

The header (`Header.tsx`) already has one icon-button toggle, `MenuToggle` (wrapping `HamburgerMenu.tsx`): a plain-glyph button (☰/✕), `aria-expanded`, sized `h-8 w-8`. The site has no icon-library dependency today. Robin asked for "a simple icon" for the new toggle and, given the choice between matching the existing plain-glyph idiom or introducing a small icon library, chose the latter — an SVG icon renders identically across every OS/browser and takes a stroke color cleanly for the lit/dimmed state, where an emoji glyph would not.

## Goals / Non-Goals

**Goals:**
- One toggle, in the header, below the hamburger, switches the whole site between light and dark instantly.
- Respect the visitor's OS-level preference by default; remember an explicit choice once made.
- No flash of the wrong theme on first paint.
- A clean, simple icon for the toggle, rendering consistently across browsers/OSes.

**Non-Goals:**
- Re-theming third-party imagery that isn't this site's own chrome — Leaflet/OpenStreetMap map tiles on `/farpost/farpost-atlas` stay as their normal (light) raster tiles; only the page around the map follows the toggle. A dark tile provider or CSS filter hack is a separate, bigger decision not being made here.
- Per-page or per-component theme overrides — this is one global switch, not a per-section setting.
- Changing Farpost Atlas's density-color ramp (`densityToFillColor`) — that's a fixed data-visualization scale, not a page-chrome color, and stays as-is in both themes.

## Decisions

**1. Dark mode is a `.dark` class on `<html>` that overrides the existing five CSS custom properties — not `dark:` utility variants scattered through components.**
Because every component already themes itself through `--background`/`--foreground`/`--muted`/`--accent`/`--skills-bg`, a `.dark { --background: ...; ... }` block in `globals.css` re-themes the entire site the instant the class is toggled, with zero changes to any component's `className`. Alternative considered: Tailwind v4's `dark:` variant convention (typically paired with a `@custom-variant dark (&:where(.dark, .dark *));` declaration) applied per-utility across every component — rejected as touching dozens of files to achieve exactly what one new CSS block already achieves, given this site's existing token architecture.

**2. Starting dark-mode values, to be contrast-checked visually during implementation:**
```css
.dark {
  --background: #0a0a0a;
  --foreground: #e5e5e5;
  --muted: #a1a1aa;
  --accent: #fbbf24;
  --skills-bg: #1c1917;
}
```
The accent shifts from amber-600 (`#d97706`, tuned for a white background) to amber-400 (`#fbbf24`) for adequate contrast against a near-black background — same hue family, not a different brand color. These are a starting point, not a final visual sign-off: CLI should take real before/after screenshots of a representative page in both themes and adjust values if anything reads as low-contrast, since that's a visual judgment this proposal can't make without seeing it rendered.

**3. The toggle is a single `lucide-react` `Lightbulb` icon, not a swap between two different icons, and not an emoji glyph.**
`HamburgerMenu` swaps glyphs to reflect open/closed state (☰ ↔ ✕); the theme toggle instead keeps one icon and reflects state through style — full accent-colored/opaque when light mode is active ("the light is on"), dimmed/muted-colored when dark mode is active ("lights off") — plus `aria-pressed` for assistive tech. This is this site's first icon-library dependency (`lucide-react`), a deliberate, small trade against staying at zero: a tree-shakeable single-icon import, and the only realistic way to get a genuinely "simple," visually consistent icon rather than an emoji whose glyph and color rendering varies by OS. Per `CLAUDE.md`'s stack-log convention, this gets logged in `docs/stack.md`. Alternative considered: swap to a second icon (e.g. `Moon`) for dark mode, mirroring the hamburger's swap pattern — rejected since Robin's own ask was specifically one lightbulb icon, and a lit/unlit treatment of it reads more literally as a light switch than alternating to an unrelated moon symbol.

**4. Placement: a new flex column in `Header.tsx` stacking `MenuToggle` above the new `ThemeToggle`, left of the title block.**
`Header.tsx`'s current `<MenuToggle />` becomes `<div className="flex flex-col items-center gap-2"><MenuToggle /><ThemeToggle /></div>` — hamburger on top, lightbulb directly beneath it, matching "below the top-level hamburger" literally.

**5. Persistence and default-resolution logic is a pure, unit-tested function; DOM/storage access stays a thin wrapper around it.**
`web/src/components/theme.ts` exports `resolveInitialTheme(storedTheme: string | null, prefersDark: boolean): "light" | "dark"` — a pure function taking already-read inputs (no DOM access itself), so its four branches (valid stored value wins either way; no stored value falls back to system preference in each direction) are directly unit-testable, mirroring how `filterSections`/`filterProjects` keep their pure logic separate from the stateful component around them. `ThemeToggle.tsx` (the stateful client component) and the blocking `<head>` script are both thin callers of this function.

**6. FOUC avoidance via a blocking inline script in `layout.tsx`'s `<head>`, with `suppressHydrationWarning` on `<html>`.**
The standard, dependency-free pattern for this problem: a small synchronous script (reading `localStorage` + `matchMedia`, calling the same resolution logic, then setting `document.documentElement.classList`) runs before first paint, so the very first frame already has the right theme. Because that script mutates `<html>`'s class attribute outside of React's own render, React's hydration check on that one element is expected to disagree with the server-rendered markup — `suppressHydrationWarning` on `<html>` is the documented way to silence exactly that expected, harmless mismatch (and only that one).

## Risks / Trade-offs

- **[Risk]** The proposed dark-mode hex values (decision 2) are a best guess without having rendered them. → **Mitigation**: tasks.md requires real screenshots of at least one representative page in both themes before considering the change done, with values adjusted if contrast reads poorly — this design doc sets a starting point, not a final palette.
- **[Risk]** `suppressHydrationWarning` is a blunt instrument — placed on the wrong element, it could silence a real, unrelated hydration bug on that element in the future. → **Mitigation**: scope it to the `<html>` tag only (never `<body>` or lower), since that's the single element the blocking script actually touches.
- **[Risk]** A visitor with the map overlay open on `/farpost/farpost-atlas` in dark mode may find the light OpenStreetMap tiles jarring against a dark page. → **Mitigation**: named explicitly as a non-goal above rather than silently shipped as if it were handled; a dark tile provider is a reasonable, separate future change if it turns out to bother Robin in practice.
- **[Risk]** Reintroducing `.dark` overrides for exactly five tokens is only low-risk *because* nothing bypasses the token system today — if a future component ever hardcodes a color, it will silently ignore the toggle. → **Mitigation**: no automated guard against this is being added (would be over-engineering for a five-variable system); the existing scc/drift-audit discipline is the backstop if it ever happens.
- **[Risk]** `lucide-react` is a new dependency purely for one icon. → **Mitigation**: it's a per-icon named import (tree-shaken, not the whole library) and a genuinely common, well-maintained choice; logged in `docs/stack.md` per convention rather than added quietly.

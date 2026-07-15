## 1. Theme resolution logic

- [x] 1.1 Create `web/src/components/theme.ts`: a `Theme = "light" | "dark"` type, a shared `localStorage` key constant, and a pure `resolveInitialTheme(storedTheme: string | null, prefersDark: boolean): Theme` function.
- [x] 1.2 Add `web/src/components/__tests__/theme.test.ts` covering all four branches: valid stored "dark" wins over `prefersDark: false`; valid stored "light" wins over `prefersDark: true`; no stored value + `prefersDark: true` → dark; no stored value + `prefersDark: false` → light; an invalid/garbage stored value is ignored and falls back to system preference.

## 2. Dark-mode tokens

- [x] 2.1 Add a `.dark { --background: #0a0a0a; --foreground: #e5e5e5; --muted: #a1a1aa; --accent: #fbbf24; --skills-bg: #1c1917; }` block to `web/src/app/globals.css` (see design.md decision 2 — starting values, not final).

## 3. FOUC-free theme application

- [x] 3.1 In `web/src/app/layout.tsx`, add a blocking inline `<script>` in `<head>` that reads the stored preference and `matchMedia("(prefers-color-scheme: dark)")`, calls `resolveInitialTheme`, and sets/clears the `dark` class on `document.documentElement` before first paint.
- [x] 3.2 Add `suppressHydrationWarning` to the `<html>` element in `layout.tsx` (and only that element) to silence the expected class-attribute mismatch caused by the script in 3.1.

## 4. Toggle component and header placement

- [x] 4.1 Add `lucide-react` as a dependency (`npm install lucide-react` in `web/`); log it in `docs/stack.md` per `CLAUDE.md`'s stack-tracking convention.
- [x] 4.2 Create `web/src/components/ThemeToggle.tsx`: a client component rendering `lucide-react`'s `Lightbulb` icon inside a button (sized to match `MenuToggle`'s `h-8 w-8` button pattern), reading/toggling the `dark` class on `document.documentElement` and persisting the choice via the shared storage key from `theme.ts`. Visually distinguish state via color/opacity (lit when light mode is active, dimmed when dark mode is active) and set `aria-pressed` accordingly.
- [x] 4.3 Update `web/src/components/Header.tsx` to wrap `<MenuToggle />` and the new `<ThemeToggle />` in a `flex flex-col items-center gap-2` container, so the lightbulb renders directly below the hamburger.

## 5. Test coverage

- [x] 5.1 Confirm `web/src/components/__tests__/theme.test.ts` (task 1.2) passes via `npm run test`.
- [x] 5.2 Add a new Playwright e2e spec covering: (a) with `page.emulateMedia({ colorScheme: "dark" })` and no stored preference, the site loads in dark mode by default; (b) activating the toggle switches the page to the other theme immediately; (c) reloading after an explicit toggle keeps the chosen theme.
- [x] 5.3 Take real before/after screenshots of at least one representative page (e.g. the homepage) in both themes; adjust the dark-mode token values from task 2.1 if any text/background/accent combination reads as low-contrast.
- [x] 5.4 Run `npm run build` in `web/` and confirm a clean build.

## 6. Metrics and wrap-up

- [x] 6.1 Run `scc` against `web/src`, `api`, and `pieces`; append the new snapshot to `docs/metrics.md` (date, change name, headline numbers, one-line delta from the previous snapshot) and to `web/src/data/metrics.json`.
- [x] 6.2 If the new snapshot's DRYness drops below 55% or falls more than 10 points from the previous snapshot, log it as an open item in `docs/issues.md` per `CLAUDE.md`'s scc convention.
- [x] 6.3 Report status back to Robin for the drift audit against `openspec/specs/theme-toggle/spec.md` before archiving.

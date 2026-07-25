## 1. Font size and reduced-motion utilities

- [x] 1.1 Add `web/src/components/fontScale.ts`: `FontScale` type (`"small" | "default" | "large" | "xlarge"`), `FONT_SCALE_STORAGE_KEY`, `resolveInitialFontScale(stored)` — pure, mirrors `theme.ts`'s shape
- [x] 1.2 Add `web/src/components/reducedMotion.ts`: `ReducedMotionPref` type (`"system" | "on" | "off"`), `REDUCED_MOTION_STORAGE_KEY`, `resolveInitialReducedMotionPref(stored)` (pure — resolves the stored preference only, not the OS query) and `shouldReduceMotion(pref, osPrefersReduced)` (pure — resolves the final boolean per D4)
- [x] 1.3 Unit tests for both: storage-key round-trip resolution and (for reduced motion) all three pref × both OS-preference combinations — `fontScale.test.ts` (6 tests), `reducedMotion.test.ts` (10 tests)

## 2. Global settings bootstrap

- [x] 2.1 Create a new always-mounted client component (e.g. `web/src/components/SettingsBootstrap.tsx`) that reads all three storage keys on mount and applies: theme's `dark` class, font-scale's `--font-scale` CSS variable on `<html>`, reduced-motion's resolved class (e.g. `.reduce-motion` on `<html>`)
- [x] 2.2 Mount it once in `app/layout.tsx`, alongside `DrawerNav`/`RightRail`
- [x] 2.3 Remove the theme-bootstrap effect and the `dark`-class-toggling logic from `RightRail.tsx` — that responsibility now lives solely in `SettingsBootstrap`

## 3. Rail change

- [x] 3.1 Remove the theme toggle button (the `Lightbulb` icon control) from `RightRail.tsx` entirely — final rail order: Settings → Account → Sign In → outline trigger
- [x] 3.2 Confirm `theme-toggle.spec.ts`'s existing assertions (which currently target the rail's toggle button) get moved/rewritten against `/settings` in task 5, not left pointing at a button that no longer exists there — moved into the new `settings.spec.ts` (old file deleted, not left stale)

## 4. /settings page

- [x] 4.1 Replace the stub content in `web/src/app/settings/page.tsx` with three `SectionHeader`-delimited sections: Theme, Font Size, Reduced Motion
- [x] 4.2 Theme section: the relocated toggle control, reusing `theme.ts` as-is — `components/settings/ThemeSetting.tsx`
- [x] 4.3 Font Size section: four-option control (Small/Default/Large/Extra Large) writing to `fontScale.ts`'s storage key and updating the `--font-scale` variable immediately on change — `components/settings/FontSizeSetting.tsx`
- [x] 4.4 Reduced Motion section: three-option control (System/On/Off) writing to `reducedMotion.ts`'s storage key and updating the applied class immediately on change — `components/settings/ReducedMotionSetting.tsx`

## 5. Wire reduced motion into real animations

- [x] 5.1 `RightRail.tsx`'s slide-in transition: skip/short-circuit the `transition-transform` classes when reduced motion is active — implemented as a scoped CSS rule (`.reduce-motion .motion-safe-transition { transition: none !important; }`) rather than a JS-conditional className; a deliberate deviation from the task's literal wording, flagged rather than silent — see design note below.
- [x] 5.2 `PageOutline.tsx`'s `scrollIntoView`: use `behavior: "auto"` instead of `"smooth"` when reduced motion is active — read fresh (localStorage + matchMedia) at the moment of each click, not cached mount-time state, since PageOutline is mounted once for the whole session and a stale cached value would ignore a preference changed on `/settings` without a full reload

## 6. Testing (representative, per this project's testing convention)

- [x] 6.1 Moved/rewrote `theme-toggle.spec.ts`'s scenarios into a new `web/e2e/settings.spec.ts` (old file deleted) targeting `/settings` instead of the rail button; added a case confirming the rail no longer renders a theme toggle
- [x] 6.2 Playwright e2e: changing font size rescales visibly and persists across reload and across a different page — 2 tests
- [x] 6.3 Playwright e2e: reduced motion's three states, confirming actual animation suppression via the rail's real computed `transitionDuration` and a `scrollIntoView` spy capturing the actual `behavior` argument passed at each click — not just the stored preference value — 6 tests
- [x] 6.4 Vitest: covered by 1.3 above

## 7. Docs and process

- [x] 7.1 Drift audit against this change's spec before archiving — every requirement/scenario checked against the real implementation and verified via e2e; `openspec validate --strict` passes
- [x] 7.2 Run `scc` against `web/src`, `api`, and `pieces` and log the snapshot to `docs/metrics.md` and `web/src/data/metrics.json` at archive time — 236 files, DRYness flat at 58%; also caught and corrected a real 1-file undercount in the prior `page-outline-nav` snapshot (228, not 227) via a clean `git stash -u` re-run against that exact commit

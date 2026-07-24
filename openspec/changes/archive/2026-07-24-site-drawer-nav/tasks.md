## 1. New navigation components

- [x] 1.1 Build `web/src/components/DrawerNav.tsx` — sticky rail on desktop, sliding drawer with backdrop + Escape dismissal on mobile, grouped links (Site/Work/Writing/Ops), "$ Robin Samways" title link at top
- [x] 1.2 Build `web/src/components/RightRail.tsx` — same responsive mechanism mirrored right, carrying the repositioned light/dark toggle only
- [x] 1.3 Port `ThemeToggle.tsx`'s existing logic (lit/dimmed lucide-react Lightbulb, persistence, no-flash init script) into `RightRail.tsx` without behavior changes

## 2. Layout restructure

- [x] 2.1 Restructure `app/layout.tsx` into a flex row: `DrawerNav` + main content + `RightRail`, replacing the current centered `max-w-3xl` column
- [x] 2.2 Retire `Header.tsx`, `HamburgerMenu.tsx`, `MenuToggle.tsx`, old `ThemeToggle.tsx` placement once the new components fully replace their behavior
- [x] 2.3 Confirm `FeedbackWidget` and the theme-init `<Script>` still render correctly in the restructured layout

## 3. Content

- [x] 3.1 Confirm final nav grouping and labels (Site/Work/Writing/Ops) per design.md's open question before wiring links
- [x] 3.2 Link `/ops/deploy` into the Ops group

## 4. Verification

- [x] 4.1 Check homepage, a long page (Dev Log), and a short page (a Tech/Stacks piece) at both mobile and desktop widths
- [x] 4.2 Verify mobile drawer/rail open, close (toggle, backdrop, Escape), and link-selection-closes behavior on both sides
- [x] 4.3 Verify light/dark toggle behavior (persistence, no-flash-on-load, `aria-pressed` state) is unchanged after the move

## 5. Docs and process

- [x] 5.1 Run `scc` against `web/src`, `api`, and `pieces` and log the snapshot to `docs/metrics.md` and `web/src/data/metrics.json` at archive time
- [x] 5.2 Drift audit against this change's specs before archiving — checked all three spec deltas (`site-navigation`, `theme-toggle`, `resume-homepage`) against current `DrawerNav.tsx`/`RightRail.tsx`/`Header.tsx`/`layout.tsx`, including the later mobile-tweak follow-ups (title badge, cog icon, top-bar mask, re-pinned header). No drift — the follow-ups are additions within latitude the specs already allowed (none prescribed a specific icon glyph or prohibited a decorative element), not contradictions.

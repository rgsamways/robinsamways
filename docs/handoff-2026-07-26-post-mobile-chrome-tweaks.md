# Handoff: live tweaks after `mobile-chrome-redesign`, for Chat

**Date:** 2026-07-26
**From:** CLI (this session)
**Context:** After `mobile-chrome-redesign` was implemented and archived, Robin spun up the dev server and gave a series of live, direct fixes/tweaks against the running app — none of these went through an OpenSpec proposal, since they're small enough that Robin drove them ad hoc in chat with CLI. This file exists so Chat isn't surprised by code that doesn't trace back to any archived change. Not a bug list — everything below is already implemented, working, and test-covered where relevant.

## What shipped, beyond `mobile-chrome-redesign`'s own tasks.md

1. **Sticky-header scroll overlap, fixed.** `PageOutline`'s `scrollIntoView` was landing headings right under `Header.tsx`'s sticky bar, which then covered them. Added `scroll-margin-top: 11rem` to `main h2[id]` in `globals.css` (measured against Header's real rendered height — bottom edge sits at 161px on desktop, sized with headroom). This also fixes plain `#anchor` page loads, not just outline clicks.
   - Consequence: `PageOutline.tsx`'s `IntersectionObserver` rootMargin had to be recalibrated to match (`"0px 0px -80% 0px"` → `"-176px 0px -60% 0px"`), or the "active" highlight band would still start at the literal viewport top, underneath the header. If either value ever changes, the other needs to move with it — they're a matched pair, called out in comments at both sites.

2. **Momentary glow on outline clicks.** Real feedback when a trailing section is already at (or near) max scroll and can't visibly move further. New `@keyframes outline-target-glow` in `globals.css` (`color-mix(in srgb, var(--accent) 40%, transparent)` — started at 20%, bumped to 40% at Robin's request), applied/removed via `PageOutline.tsx`'s `handleSelect` with a fixed `setTimeout` (not `animationend`, since reduced motion sets `animation: none` and that event never fires there — reduced motion keeps a static highlight instead of the animated fade, same "suppress motion, not all feedback" stance as the rest of this site).
   - The glow targets the **whole heading strip** (`##` through the end of the solid `<hr>` line), not just the heading text. `SectionHeader.tsx`'s wrapper `<div>` got a new `section-heading-row` marker class specifically so `PageOutline` has a stable hook to `closest()` onto, rather than assuming DOM shape.

3. **Persistent color strip on every outline entry.** `PageOutline.tsx`'s list buttons now all carry a `border-l-2` strip — muted (`border-foreground/20`) by default, accent-colored when that entry is active — instead of the old plain-text/no-border styling. Fixed border width on both states (only the color changes) so there's no layout jitter when the active entry moves.

4. **Header photo resized ~20% smaller.** `h-24 w-24` (96px) → `h-[4.8rem] w-[4.8rem]` (76.8px), an arbitrary-value Tailwind class (not a standard step) to match "about 20%" precisely. Still pins snug to the top-right corner via the same `flex items-start justify-between` container `mobile-chrome-redesign` already set up — no structural change needed there, size alone.

5. **Hand cursor on things that act like links but aren't `<a>` tags.** `<button>` elements don't get the browser's default pointer cursor the way anchor links do. Added `cursor-pointer` to:
   - `PageOutline.tsx`'s outline-entry buttons
   - `PillBar.tsx`'s pill buttons (shared by `SectionFilterBar` — Farpost/Services/etc. section filters — and `TechStacksBrowser`'s tag filter on `/techstacks`)

## Asked, then explicitly declined — do not re-introduce

**Left-nav label-click-to-toggle.** Robin asked whether clicking a parent nav item's *label* (not just its arrow) should also collapse/expand it, in sync with the arrow. I flagged the real tradeoff (the only version that adds genuinely new behavior is toggle-only-no-navigation, since route-based auto-expand already makes "navigate + toggle" indistinguishable from today's behavior) and asked which he wanted. He picked toggle-only, then immediately walked it back before I wrote any code — realized navigating via the label is why `DrawerNav.tsx` works the way it does today, and asked me to leave it alone. **No code was changed for this.** `DrawerNav.tsx`'s `NavItem` still has the arrow as the only toggle control, label click still navigates. If this comes up again from a different angle, the reasoning above (why "toggle-only" was the only version with real teeth) is worth surfacing again before implementing anything.

## Explicitly deferred, needs Chat's scoping

**A standalone `/contact` page.** Robin wants a new page under Site in the left nav, with `ContactForm` (currently `web/src/components/resume/ContactForm.tsx`, rendered inside the homepage's `## CONTACT` section per `page.tsx`) moved off the homepage entirely and onto it. I flagged that this isn't a quick tweak — it directly contradicts two live requirements:
- `resume-homepage`'s "Contact section present after Continuing Education" requirement (explicitly locks Contact into the homepage, after Continuing Education, before the footer)
- `site-navigation`'s Site group definition (currently Home, Services, Metrics — no Contact)

Per `CLAUDE.md`'s own "Resume content changes" convention, this is spec-level, not just a code edit — a lightweight OpenSpec change (proposal.md + MODIFIED deltas on both specs, design.md skippable) is the right vehicle. Robin agreed to have Chat pick this up rather than have CLI improvise it live. **Nothing has been built for this — no `/contact` route exists, `ContactForm` still renders on the homepage exactly as before.** Worth deciding while scoping: what (if anything) replaces the Contact section's spot on the homepage — a pointer/link to `/contact`, or nothing at all.

## Not yet re-verified end-to-end

None of the five items above have a fresh full-suite run captured in this file (they were verified individually — Vitest/relevant Playwright specs re-run after each change, all green — but not re-confirmed together in one pass, and nothing here has been committed to git yet). Worth a full `npm run build` + Vitest + Playwright pass and a fresh `scc` snapshot before this is considered done, whichever session (Chat via a follow-up change, or CLI again) formalizes these into an archived record — right now they exist only as live, uncommitted working-tree edits.

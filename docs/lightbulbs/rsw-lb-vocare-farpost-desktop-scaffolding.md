# rsw-lb-vocare-farpost-desktop-scaffolding

**Slug:** rsw-lb-vocare-farpost-desktop-scaffolding
**Date logged:** 2026-07-24
**Status:** unscoped — idea captured, not yet spec'd
**Related:** [[rsw-lb-project-silos]], Vocare, Farpost, the drawer-nav/theme mock at `/prototype/homepage-drawer`

## The gap

Vocare was deliberately built mobile-first — a condensed center column, bottom navigation, a simple top header for branding — a shape that barely changes between phone and laptop view. That's a reasonable mobile-first bet, but it likely means large-screen visitors get a narrow column stranded in a wide viewport rather than a layout that actually uses the space. Farpost, being rebuilt right now in a separate session, risks inheriting the same mobile-first shape (deliberately, per [[rsw-lb-project-silos]]'s update) without a matching plan for what happens on a laptop or desktop screen.

## The idea

Having just explored how a left-nav drawer plus a right-hand styling rail can give robinsamways.ca's own site a real large-screen layout (`/prototype/homepage-drawer`), consider applying that same scaffolding/page-layout thinking to Vocare's and Farpost's own actual apps — not their eventual silo showcase inside robinsamways.ca, but the real, live products themselves. This is a materially different, larger initiative than anything done in the robinsamways.ca repo: it would mean touching each app's own codebase directly, which this session has no access to.

## Why it matters beyond convenience

- Mobile-first is a defensible starting design, but shipping the same condensed column at a 1920px-wide viewport leaves real estate unused for exactly the audience most likely to be evaluating the work on a laptop — recruiters, interviewers, anyone assessing Robin's actual product craft.
- Solving this once as a repeatable drawer-based large-screen pattern could plausibly generalize across every one of Robin's own projects, rather than each app inventing its own desktop layout from scratch.
- Ties the robinsamways.ca exploration back into real product work rather than leaving it as a self-contained site-only exercise.

## Open questions

- This session has no file access to either Vocare's or Farpost's actual codebases — Farpost's rebuild is already underway in a separate VSCode instance. Does this stay a robinsamways.ca-side design exercise (a portable handoff document, the same move as `docs/design-system-handoff.md`) that gets carried into those other sessions, or does it happen natively inside them instead?
- Should Vocare's and Farpost's real large-screen layout end up matching their eventual silo presentation inside robinsamways.ca, or can the silo be a curated showcase that looks different from the live product?
- Sequencing: Farpost's rebuild is already in progress elsewhere — does this idea need to reach that session before more of the rebuild locks in, or is it a later-pass concern?

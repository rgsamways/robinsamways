# rsw-lb-project-silos

**Slug:** rsw-lb-project-silos
**Date logged:** 2026-07-24
**Status:** unscoped — idea captured, not yet spec'd
**Related:** the "Work" nav group in the design-system-handoff drawer mock (`docs/design-system-handoff.md`, `/prototype/homepage-drawer`), Farpost, Vocare, Sreditor, the multi-theme system built into that same mock

## The gap

Each of Robin's own projects currently lives as a one-off: Farpost has its own page plus several narrative pieces, Sreditor has its own page, and other pieces are scattered under `techstacks`/`pieces`. There's no single organizing pattern that says "this is one of Robin's projects" regardless of which one a visitor lands on, and no one place that shows the full set of them at a glance. The drawer-nav mock's new "Work" group (currently just Farpost + Tech/Stacks) gestures at this without yet formalizing it.

## The idea

Introduce **project silos** as a first-class content type: each of Robin's own projects — Farpost, Vocare, Sreditor, and whatever comes next — gets its own silo with a consistent internal structure, slotting naturally under the "Work" group in the new left-drawer navigation. Above the silos, a **project-silos homepage** acts as a showcase/directory: one page presenting all of Robin's projects at a glance, linking into each one's own silo.

A striking possible payoff of work already done: the multi-theme toggle system built into the `/prototype/homepage-drawer` mock (Current/Handoff/Ad/Vocare/Farpost) could let each silo literally render in that project's own theme — Farpost's silo in the Farpost theme, Vocare's in the Vocare theme — rather than everything staying in one site-wide look.

## Why it matters beyond convenience

- Gives every visitor one consistent mental model for "this is a Robin project," instead of each one being a differently-structured bespoke page.
- A showcase homepage lets someone scan the full body of independent work in one place before choosing which project to dig into — the current scattered-pages structure doesn't support that today.
- Gives the drawer-nav "Work" group reorganization (already explored in the handoff mock) a concrete reason to exist, rather than just being a plausible-looking regrouping of existing links.
- Could reuse the exact component-museum pieces already built for the handoff mock (`SectionHeading`, `ConceptBlock`, `ComparisonCards`, `ChatBubble`, the theme system) as the actual building blocks of each silo, rather than starting from scratch.

## Update — 2026-07-24

Vocare's real layout is deliberately mobile-first: a condensed center column, navigation on the bottom, a simple top header for branding — a shape that barely has to change between phone and laptop. That's exactly why it "fits nicely as a silo piece" per Robin. Farpost is being rebuilt right now in a separate VSCode session Robin has open (out of scope for this repo/session) — Robin wants that rebuild to deliberately adopt the same condensed-column/bottom-nav/simple-header shape Vocare already has, specifically so it drops cleanly into a silo later. Worth remembering when Farpost's silo actually gets built: the shape constraint was set during the rebuild, not invented at silo time.

See also [[rsw-lb-vocare-farpost-desktop-scaffolding]] — a related but distinct idea about giving Vocare's and Farpost's own real apps (not their silos) a better large-screen layout, prompted by seeing the drawer/rail scaffolding work on robinsamways.ca itself.

## Update — 2026-07-24 (reconciled with the Farpost-session's `siloes/` work)

Spelling correction: **"siloes" is the correct spelling going forward**, not "silos" as used above and in this file's slug/title — confirmed directly by Robin after a same-day mix-up where a separate Claude Code session (working on the Farpost rebuild) independently created a `siloes/` directory and CLAUDE.md convention for backend deployment isolation, without knowing this file already existed describing the frontend showcase-homepage half of what turns out to be the same idea. This file's own filename/slug is left as-is (append-only convention), but any new writing should use "siloes."

The two halves are confirmed as **one unified feature, not two competing ideas**: a silo's homepage (the thing described above, under "Work") shows project background/context, followed immediately by the actual live working build of that project — and that live build *is* the real code living in `siloes/<project>/` (the backend/deployment folder), not a separate embed or mockup. This also resolves the "does this replace `/farpost`, `/sreditor`..." open question below: yes, a silo's homepage supersedes those standalone pages, since it now contains the actual working app rather than just narrative content about it.

Also confirmed: the Vocare-shape layout constraint recorded above (condensed column, bottom nav, simple header) is now a **deliberate cross-project navigation house style**, not just a Farpost-specific accommodation — every future silo build follows it: simple header (brand + UI effects) always surfacing sign-in/sign-up/sign-out (Lucide icon, text, or both depending on screen size), footer-based primary nav. See `CLAUDE.md`'s updated "Silo isolation" section for the canonical description of all of this.

## Open questions

- What counts as a project silo? Farpost and Sreditor clearly do; worth confirming Vocare's status (shipped/live vs. in progress) since that changes how much real content a Vocare silo would have. Correction to make note of: earlier in this same conversation, Vocare had been treated purely as an external design reference for the theme toggle — this idea's framing ("each silo is one of my projects") means it's actually one of Robin's own, which changes how that theme should be talked about going forward.
- Does a silo's theme literally lock to that project's own theme (Farpost silo always Farpost-themed), or is theme still a site-wide, visitor-controlled toggle that happens to default per silo?
- Does this replace `/farpost`, `/sreditor`, and the existing `pieces/`-adjacent pages, or sit above them as a new top-level index while those stay as-is underneath?
- Sequencing relative to the still-open drawer-nav/theme scaffold exploration — is this the next concrete direction once a template gets chosen, or a separate track to pick up later?

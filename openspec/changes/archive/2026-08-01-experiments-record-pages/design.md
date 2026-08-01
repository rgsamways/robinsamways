## Context

`DrawerNav.tsx` today gives Work's three projects a real two-level shape (`heading: "Work"` → `Farpost`/`Vocare`/`Sreditor` links, each with a ten-page `PROJECT_RECORD_CHILDREN` submenu) but gives Experiments only a fake version of that shape: `heading: "Experiments"` contains one link, also labeled "Experiments," whose children are the four actual pieces. Nothing under that single link has its own submenu — Atlas, Dispatch, Pulse, and Credential Flow are each still one page bundling narrative, architecture, data model, and (where present) AI-mechanic content together, the way Farpost's single `/farpost` page bundled everything before the `left-nav-restructure` change split it into ten.

This change does for Experiments what that earlier change did for Work: fix the nav shape, then use the resulting room to actually separate content that's currently flattened onto one page. The AI-mastery motivation (see proposal.md's Why) makes this a natural moment to also add net-new AI Notes content, not just reorganize what already exists.

## Goals / Non-Goals

**Goals:**
- Remove the redundant "Experiments > Experiments" nav node; each of Atlas/Dispatch/Pulse/Credential Flow becomes a direct child of the Experiments heading, matching Work's shape exactly.
- Preserve access to the `/techstacks` filterable showcase index via a trailing "View All" link, rather than losing that entry point.
- Give each Experiment a six-page submenu — Tech Stack, Architecture, Object Model, Design Notes, AI Notes, Setup Gallery — sourced from content already written into each piece's own spec wherever possible.
- Write genuinely new AI Notes content for all four, honestly reflecting each piece's real AI state today (real/live, real/mocked, or absent).
- Scope, but not necessarily complete, Setup Gallery for pieces that need real screenshots Robin hasn't captured yet.

**Non-Goals:**
- Changing what any Experiment's backend actually does — Atlas's spatial join, Dispatch's Apex matching, Pulse's mocked tip generator, and Credential Flow's OAuth flow are all unchanged. This is a documentation/presentation restructuring of already-true facts.
- Solving Atlas's AI gap. Robin has explicitly deferred that to a follow-up change; this change ships an honest stub, not a rushed AI feature bolted onto Atlas to fill the page.
- Capturing Dispatch's or Pulse's setup screenshots — that's Robin's manual step (per his established screenshot workflow), not something this change's implementation can do on its own. The page and component get built; the real images get slotted in once captured.
- Deleting `web/src/components/portfolio/SetupGallery.tsx` outright — only Credential Flow's usage of it moves. Confirm nothing else references that file before removing it in a later cleanup.

## Decisions

**Each Experiment's existing route stays its "Overview" — no separate `Overview` child link.** Considered adding an explicit `Overview` entry as the first child of each Experiment's submenu (mirroring the shape the idea started in during brainstorming: "Experiments > Atlas > Overview"). Rejected for the same reason Farpost's hub page isn't listed as a child called "Overview" under itself: `/farpost` already is the overview, reachable by clicking "Farpost" itself, and Build Plan/Feature List/etc. are the *additional* pages beyond it. Doing anything else for Experiments would make it the only project-record-shaped submenu on the site with a redundant self-referencing first child — the opposite of the fix this change makes to Experiments' current redundant node.

**Six shared page types, not a bespoke set per Experiment.** Tech Stack, Architecture, Object Model, Design Notes, AI Notes, and Setup Gallery apply uniformly across Atlas/Dispatch/Pulse/Credential Flow, even though not every page will have equally rich content for every piece (Atlas's AI Notes; possibly Atlas's Setup Gallery). Considered a bespoke per-piece page list instead (e.g. Atlas gets "Data Sourcing" instead of a thin Setup Gallery). Rejected because a uniform template is what makes this genuinely comparable to Work's project-record convention — a visitor who's learned Farpost's ten-page shape shouldn't have to relearn a different shape for every Experiment — and because "this page is thin/stubbed for this piece" is itself honest, useful information (it shows where a piece's story is still developing), not a reason to hide the page.

**AI Notes covers process then product, in that order, on one page.** Considered as two separate pages (as first discussed). Condensed to one page with two labeled subsections because most Experiments won't have enough distinct content in each half to justify a full separate page, and a visitor curious about "how AI was used here" shouldn't have to guess which of two pages holds which half.

**Pulse's AI Notes must disclose the mock.** The `farpost-pulse` spec already states plainly that `generateCoachingTip()` returns canned/randomized text "rather than a real Azure OpenAI call... clearly marked with a comment indicating it is a placeholder pending model deployment quota." AI Notes' product-half for Pulse states this same fact in visitor-facing copy — the architecture (an isolated, swappable function boundary ready for a real model call) is real and worth describing; the current output is not real AI, and the page shouldn't blur that line just because it's the one page whose whole purpose is showcasing AI usage.

**Atlas's AI Notes ships as an explicit, dated stub, not omitted or faked.** Since Robin wants to revisit how to bring AI into Atlas later, the page should say so directly (e.g. "Atlas doesn't use AI today — see [dated] for where that's headed") rather than silently having a thinner page than its siblings or, worse, forcing in a token AI feature just to fill the section. This is the same honesty pattern the site already uses for Bug List and Testing & Verification when there's genuinely nothing (yet) to report.

**Credential Flow's Setup Gallery migrates rather than duplicates.** It already has real screenshots and a working component; the work here is relocating it onto its own page under the new submenu and rebuilding the component under `web/src/components/credential-flow/` instead of the shared `portfolio/` path, per `CLAUDE.md`'s existing note that the `portfolio/` path is a naming leftover. No new screenshots needed.

## Risks / Trade-offs

- [Twenty-four new routes/pages is a large content-authoring surface for one change] → mitigated by most of it being reorganization of prose that already exists and is already approved in each piece's spec, not new research; only AI Notes (all four) and Design Notes (all four) are substantially new writing.
- [Atlas's Setup Gallery may end up with nothing genuine to show] → flagged as an open question below rather than assumed either way; if there's no real external config step, the page should say so honestly (mirroring the Atlas AI Notes stub pattern) rather than being forced to exist with padding.
- [Dispatch and Pulse's Setup Gallery pages ship with placeholder/empty states until Robin captures real screenshots] → acceptable and consistent with how this site already treats real-infra-dependent content elsewhere (e.g. Bug List's honest "nothing logged yet" state); tasks.md scopes the page/component work as completable independent of when screenshots arrive.
- [A visitor comparing Atlas's thin AI Notes and possibly-thin Setup Gallery against its three siblings might read the piece as less finished] → acceptable trade-off; the alternative (hiding the gap or faking content) is worse, and the stub itself doubles as a visible, dated marker of real forward-looking scope for anyone reading closely, including for Sreditor-style record-keeping of open work.

## Migration Plan

1. Fix the Experiments nav shape first (remove the redundant node, add "View All"), with no new pages yet — proves the structural fix in isolation before content moves.
2. Add the `EXPERIMENT_RECORD_CHILDREN` six-page submenu to all four Experiments in the nav, initially pointing at not-yet-built routes is avoided — build routes and wire nav per-Experiment together, one Experiment at a time, so the site never ships a dead link.
3. Build Atlas's six pages first (its Setup Gallery open question gets resolved with Robin here, before repeating the pattern three more times).
4. Build Dispatch's six pages, including its Setup Gallery page/component scoped to accept real screenshots once captured.
5. Build Pulse's six pages, including the honest mocked-AI disclosure.
6. Build Credential Flow's six pages, migrating its existing Setup Gallery last (lowest risk, since the hard part — real screenshots — already exists).
7. Update `web/e2e/global-navigation.spec.ts` last, against the final structure.

No feature flag or rollback tooling exists on this site; rollback is a normal `git revert` if something ships broken.

## Open Questions

- Does Atlas have any genuine external-infrastructure configuration step to photograph for a Setup Gallery (e.g. enabling a spatial extension or provisioning the Postgres host it actually runs on), or is it pure code + a public GeoJSON file with nothing real to show? Needs Robin's confirmation against how `farpost-atlas-geo` is actually deployed today before that page is built — if there's genuinely nothing, the page should say so rather than being skipped silently or padded with unrelated screenshots.
- Exact wording for Atlas's AI Notes stub (how much detail to give about the deferred follow-up) is drafted during implementation and should be reviewed by Robin, since the actual plan for bringing AI into Atlas doesn't exist yet.

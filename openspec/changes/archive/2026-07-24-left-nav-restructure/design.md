## Context

`DrawerNav.tsx` today renders a flat two-level structure: a heading (Site, Work, Writing, Ops) containing a flat list of `{href, label}` links. Farpost's four pieces (Origins/Atlas/Dispatch/Pulse) are already real routes, but reachable only via an on-page `FarpostTabBar`, not the left nav. Dev Log's five topics are pill-filtered sections on one page (`/dev-log`), not routes at all. Tech/Stacks' label and pitch ("Ideas with no relation to Farpost") predate Farpost and Vocare existing as named ongoing projects, so it now reads as a leftover rather than a deliberate category.

The right rail (`RightRail.tsx`) is being reserved for a separate, not-yet-built in-page anchor/outline menu — that establishes the left nav's job as between-page navigation only, never within-page anchors. This design treats every new nav entry as a real route for that reason, including Code Showcase's articles.

## Goals / Non-Goals

**Goals:**
- A left-nav data model that supports collapsible groups nested at least two levels deep (Work > Farpost > Build Plan; Writing > Dev Log > Code Showcase > article), auto-expanded when the active route falls under one of its descendants.
- Six new real, content-bearing routes under `/farpost` documenting the live `siloes/farpost/` rebuild as an evolving record, without touching the existing Atlas/Dispatch/Pulse pages or their tab bar.
- A mirrored `/vocare` hub and the same six-page shape documenting the live Vocare build, with no cross-linking (Vocare has no existing demo pages).
- Dev Log's five existing topics become real routes under a collapsible "Dev Log" entry, plus a new Lightbulbs route, plus Code Showcase becoming one route per article.
- Tech/Stacks' left-nav label changes to reflect what it actually is now.

**Non-Goals:**
- The right-rail in-page anchor/outline menu — separate future work, not built here.
- Any change to `siloes/farpost/`'s own code, or to Vocare's silo.
- Retiring or restructuring the existing Atlas/Dispatch/Pulse demo pages.
- Building CI or automated cross-repo metrics collection from `siloes/farpost/` or Vocare's repo (see Decisions, Current Metrics).
- Solving the full siloes-to-site content migration/sync workflow long-term, or embedding either project's actual live build on its Work homepage (per `CLAUDE.md`'s silo-homepage convention). This change only introduces the status-data-file convention as a stepping stone — Robin's explicit call is to work out the fuller migration mechanics later, once real building in `siloes/farpost/` and `siloes/vocare/` has progressed further.

## Decisions

**Recursive nav data model, not a fixed two-level shape.** `NavLink` becomes `{ href, label, children?: NavLink[] }`, and `NavGroup` stays `{ heading, links: NavLink[] }`. A single recursive `NavItem` component renders a link plus, if it has children, a chevron toggle and an indented nested list — rather than one component for top-level links and a different one for children. Alternative considered: hardcode exactly two nesting levels (group → link → child) since that covers Work/Writing today. Rejected because Code Showcase's articles need a third level (Writing > Dev Log > Code Showcase > article), and a recursive component costs no more than a fixed one while not needing a second rewrite when the next project inevitably needs a third level too.

**Expand state is derived from the route by default, with per-session manual override.** On render, a group is considered expanded if the current pathname starts with any descendant's `href`, unless the visitor has explicitly toggled that group this session (tracked in a `Record<string, boolean>` of overrides, keyed by the group's own `href`). Clicking the chevron flips the override for that key. This gives auto-expand-on-active-route (matching the Better Auth reference screenshots) without fighting a visitor who deliberately collapses a group they're currently inside. Alternative considered: expand state fully derived from route with no manual override — rejected because a visitor reading a long Code Showcase article shouldn't lose the ability to collapse that list out of the way.

**Dev Log's root route becomes a lightweight hub, mirroring `/farpost`'s existing pattern.** `/dev-log` keeps its heading and intro blurb but no longer renders any topic's content directly — it becomes a short index linking to its six children, matching how `/farpost` already carries real Origins content while also exposing Atlas/Dispatch/Pulse via its tab bar. Alternative considered: redirect `/dev-log` straight to `/dev-log/bug-log` (or another arbitrarily-chosen first child) — rejected as arbitrary, and inconsistent with the hub pattern the site already established for Farpost.

**Code Showcase becomes an index page plus one route per article.** `/dev-log/code-showcase` lists every article (title, one-line teaser, UTC + Eastern timestamp), linking to `/dev-log/code-showcase/<slug>`. The left nav shows every article as a child of "Code Showcase," three levels deep. Each article's existing content (kicker, framing paragraphs, code blocks, "The fix," "Why this matters" — per the `dev-log-content` capability's existing Code Showcase requirement) moves as-is into its own route; only the container changes, not the content shape.

**Article timestamps show UTC with an explicit Eastern-time label, not UTC alone.** Each article stores a UTC ISO timestamp; the page renders both, e.g. `2026-07-24T18:42Z · 2:42 PM EDT`, using `Intl.DateTimeFormat` with `timeZone: "America/Toronto"` so DST is handled automatically rather than hardcoding an EST/EDT offset. Alternative considered: UTC only — rejected per Robin's explicit ask to "account for timezone differences," since a reader shouldn't have to convert it themselves.

**Current Metrics and Feature List's shipped/planned flags are sourced from a structured per-silo status-data file, not hand-maintained prose.** `siloes/farpost/` and Vocare's repo are separate, gitignored repositories this build (`web/`) has no access to at build or request time, and `scc` is only run against this repo's own `web/src`, `api`, `pieces` per `CLAUDE.md`, so neither project can drive a live-fetched chart the way Dev Log's Metrics page does against real `web/src/data/metrics.json` history. Instead, each project gets its own small JSON file (`web/src/data/farpost-status.json`, `web/src/data/vocare-status.json`) holding a dated status snapshot plus a shipped/planned flag per feature; Current Metrics renders the snapshot narrated in `docs/metrics.md`'s style, and Feature List reads the same file's flags rather than maintaining them separately in page copy. Updating either page after real progress in the silo repo becomes "edit the JSON file, redeploy" rather than rewriting prose. Alternative considered: pure hand-authored prose for both pages, matching every other project-record page — rejected because Current Metrics and Feature List are explicitly the two pieces of content that change fastest as the silo build actually progresses, and Robin asked for an easy update step for exactly that reason; forcing every update through a full content rewrite would make staleness the path of least resistance. Alternative considered: a fully automated pipeline reading directly from each silo's repo — rejected as out of scope for now (see Non-Goals); the silo repos are gitignored and not even present in most checkouts of this repo.

**Vocare mirrors Farpost's six-page shape and status-data-file convention exactly, with no cross-linking.** Vocare has no equivalent of Farpost's Atlas/Dispatch/Pulse demo pages, so its Build Plan and Feature List pages have nothing to cross-link to — otherwise the two projects' pages are structurally identical (same six page types, same `vocare-status.json` convention backing Current Metrics/Feature List). Vocare gets its own `/vocare` hub (heading + short project-background blurb + links to its six pages) since, unlike Farpost, there's no pre-existing `/vocare` page with real content to anchor the submenu to.

**Tech/Stacks' left-nav label changes to "Experiments."** Considered "Pieces" (matches `CLAUDE.md`'s own `pieces/` portfolio-isolation convention) but rejected: a visitor has no reason to know that repo-internal term, and it reads as confusingly literal next to "Farpost" and "Vocare." "Experiments" needs no prior context and directly signals "tried for its own sake, not sustained like a Work project" — the actual distinction being drawn. Only the nav-facing label changes under this decision; see Open Questions for whether the page's own heading should follow suit.

## Risks / Trade-offs

- [Six new Farpost pages need real, substantive copy (Build Plan, Feature List, Tech Stack, Upgrade Path, Outlook), not just nav wiring] → tasks.md scopes content-writing as explicit tasks, not an afterthought; content is drafted from what's actually known about the `siloes/farpost/` rebuild today and explicitly framed as provisional/evolving, consistent with `docs/standard-methodology.md`'s own framing. The same applies to Vocare's six pages.
- [A status-data-file convention only helps if it's actually kept updated — a JSON file nobody edits goes stale just as easily as prose nobody rewrites] → not solved by this change; noted as a real limitation rather than assumed away. The convention only lowers the friction of updating, it doesn't guarantee it happens.
- [Splitting Code Showcase into per-article routes changes every existing article's URL] → no external links to individual entries exist yet (they were pill-filtered sections on one page, not independently linkable), so there's nothing to redirect from.
- [Recursive nav component is more complex than the flat one it replaces] → mitigated by keeping the recursion shallow in practice (max 3 levels) and covering expand/collapse + auto-expand behavior with a dedicated e2e test, not just visual inspection.
- [`global-navigation.spec.ts` and `dev-log-section-filter.spec.ts` assert today's flat/pill-filtered structure] → both get rewritten as part of this change's tasks, not left broken.

## Migration Plan

1. Extend the nav data model and `DrawerNav.tsx` rendering first, with the *existing* flat structure expressed in the new shape (no visible behavior change) — proves the recursive component works before content moves.
2. Add the six new Farpost routes and wire them into the Work > Farpost submenu; add the status-data-file convention and wire Current Metrics/Feature List to read from it.
3. Add the mirrored `/vocare` hub and its six routes, backed by its own status-data file, and wire the Work > Vocare submenu.
4. Split Dev Log into its hub + five topic routes + Lightbulbs, update the Writing > Dev Log submenu, retire the old pill-filter bar on `/dev-log`.
5. Split Code Showcase into its index + per-article routes, nested under Dev Log > Code Showcase in the nav.
6. Rename the Tech/Stacks nav label.
7. Rewrite/add e2e coverage last, against the final structure, rather than incrementally patching it at every step.

No feature flag or rollback tooling exists on this site (single Vercel production deploy on push to `main`); rollback is a normal `git revert` if something ships broken.

## Open Questions

- Should Tech/Stacks' page heading/metadata title also change to "Experiments" for consistency with the new nav label, or deliberately stay "Tech/Stacks" as the page's own internal name while only the nav-facing label changes? (Recommendation: change both — a nav label that doesn't match the page you land on reads as a mistake, not a deliberate distinction.)
- Exact content for the six new Farpost pages beyond their headings/purpose is drafted during implementation from what's known today about the `siloes/farpost/` rebuild — Robin should review it for accuracy against the actual parallel build, since this session doesn't have direct visibility into that other session's current state.

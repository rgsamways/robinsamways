## Context

The left nav (`DrawerNav.tsx`/`navTree.ts`) and the `site-navigation` spec that governs it have grown organically. Several real inconsistencies have accumulated: the site's own Metrics page sits under "Writing" instead of "Site"; Sreditor sits under "Writing" instead of "Work" despite being a polished, standalone project; and Atlas/Dispatch/Pulse — pieces built to explore ideas relevant to Farpost, never actually built *as* Farpost — live inside Farpost's own hub page and pill-tab bar, which Robin identifies as the actual origin of the confusion that led to (and eventually retired) the "siloes" concept. Separately, every "Work" project's per-project template (`farpost-project-record`, `vocare-project-record`) currently has 6 sub-pages; Robin wants a consistent, larger 10-page template applied to every Work project going forward, including Sreditor, which has never had a project-record submenu at all.

`farpost-status.json`/`vocare-status.json` already establish the real precedent for how a separate, inaccessible project repo's content gets onto this site: a structured, hand-maintained JSON data file in `web/src/data/`, not a live fetch — because (per the existing `farpost-project-record` spec) "the `siloes/farpost/` repository is not accessible to this site's build process." That underlying constraint (Farpost is a genuinely separate polyrepo) is unaffected by siloes being scrapped as a concept — the data-file pattern is the right one to extend, not replace.

## Goals / Non-Goals

**Goals:**
- Resolve the Site/Work/Experiments/Writing group-membership inconsistencies Robin named.
- Apply one consistent 10-page template to every Work project (Farpost, Vocare, Sreditor).
- Fully separate Atlas/Dispatch/Pulse from Farpost's own hub/tab bar, not just add a second nav entry point alongside the existing one.
- Establish the content-sourcing mechanism for the four new per-project page types, reusing the existing status-data-file precedent rather than inventing a new one.

**Non-Goals:**
- Redesigning `DrawerNav`'s visual style or its drawer/sidebar mechanics (slide behavior, breakpoints, backdrop).
- Any change to `RightRail`.
- Scaffolding real nav entries for Jernel, Baby Kitty, or Monkeyback — none have real content yet.
- Refreshing Ops/Deploy Runbook's actual content (separate, later task).
- Fixing `farpost-status.json`'s stale `"siloes/farpost/"` wording — noted as related debt, not fixed here, since it's a content/wording fix unrelated to this change's structural scope.

## Decisions

**1. Atlas/Dispatch/Pulse's URLs move from `/farpost/*` to `/techstacks/*`, with redirects — not just a second nav entry pointing at the old URLs.**
Keeping the old `/farpost/farpost-atlas` URL while also linking to it from Experiments would leave the exact conflation Robin named (the URL itself still says "farpost") half-resolved. Moving the routes fully separates them. Redirects (`/farpost/farpost-atlas` → `/techstacks/farpost-atlas`, etc.) preserve any existing links. Alternative considered: leave URLs as-is, only add an Experiments nav entry pointing at them — rejected as not actually fixing the thing Robin identified as the root confusion.

**2. Farpost's hub page loses its pill-tab bar entirely, not just the Atlas/Dispatch/Pulse tabs.**
Once Atlas/Dispatch/Pulse move out, the tab bar would have exactly one tab (Origins) left, which is a pointless single-item control. Farpost's Build Plan/Feature List/etc. are already reachable via the left-nav submenu, a separate, already-existing navigation surface — no content becomes unreachable by removing the top tab bar. Alternative considered: keep a one-tab bar for visual consistency with Sreditor/Vocare's hub headers — rejected, a single-item tab control isn't consistency, it's a vestige.

**3. `tech-stacks-index` (route `/techstacks`, nav label "Experiments") keeps its existing route and capability name; only its scope and content broaden.**
This mirrors the already-established precedent in this repo of the nav *label* diverging from the route/capability *name* (this exact capability was already renamed from "Tech/Stacks" to "Experiments" at the label level previously, while the route and spec name stayed put). Avoids unnecessary URL churn on top of the Atlas/Dispatch/Pulse route changes already happening in this change.

**4. New per-project content (Bug List, Testing & Verification, Lightbulbs, Glossary) is sourced by extending each project's existing structured status-data file** (`farpost-status.json`, `vocare-status.json`, and a new `sreditor-status.json`), the same mechanism `Current Metrics`/`Feature List` already use — not a live fetch, not a new content pipeline. Keeps one established pattern for "how a separate repo's content reaches this site" instead of a second, competing one.

**5. Sreditor gains a new `sreditor-project-record` capability (10-page submenu) alongside its existing hub content, mirroring Farpost's Origins-hub-plus-submenu split exactly.** `/sreditor` keeps its real, already-good 4-section content (`sreditor-page-content`, unchanged) as the hub; the new submenu is purely additive.

**6. Lightbulbs is the one item left as an open question below, not resolved by a silent default in this design.** See Open Questions.

## Risks / Trade-offs

- **[Risk]** Moving Atlas/Dispatch/Pulse's URLs breaks any external links or bookmarks. → **Mitigation**: permanent redirects from every old `/farpost/farpost-*` URL to its new `/techstacks/*` location.
- **[Risk]** Retiring Dev Log's Bug Log/Testing & Verification/Glossary as site-wide pages could silently drop real existing content if it isn't migrated into the new per-project equivalents. → **Mitigation**: `tasks.md` must include auditing existing content at each retiring route and porting anything real into the corresponding project's status-data file before the old route is removed.
- **[Risk]** Four new sub-pages × three Work projects (12 new routes) is a lot of new surface area to launch with thin content. → **Mitigation**: proposal explicitly accepts stub-acceptable content for launch; these are real, functioning pages that can be filled in over time, not placeholders claiming false completeness.

## Migration Plan

1. Extend `farpost-status.json`/`vocare-status.json`; create `sreditor-status.json`.
2. Build the 4 new page routes × 3 projects (12 routes total), rendering from the extended data files.
3. Update `navTree.ts`/`DrawerNav.tsx` for the full new group structure.
4. Move Atlas/Dispatch/Pulse routes to `/techstacks/*`; add redirects from their old `/farpost/*` paths.
5. Remove the pill-tab bar from Farpost's hub.
6. Flatten Code Showcase's entries directly under Dev Log; add redirects from old `/dev-log/code-showcase/<slug>` to the new flattened URLs (exact new path pattern TBD in tasks.md).
7. Retire Dev Log's Bug Log/Testing & Verification/Glossary routes with redirects to their new per-project homes (or to the relevant project's hub, where a 1:1 redirect target isn't meaningful).
8. Resolve the Lightbulbs open question (below) before touching `dev-log-lightbulbs`.

Rollback: each step is an independent nav/route change with no data migration or destructive action — reverting the relevant commit(s) is sufficient at any stage.

## Open Questions

**Lightbulbs: retire the global page, or keep it alongside new per-project ones?** Some `docs/lightbulbs/` entries are clearly project-specific (e.g. the Vocare Anchor/Audience reframe); others are genuinely cross-project or meta (e.g. the golden-path/Backstage parallel, the Fastify-vs-Express stack choice). Recommended default, pending Robin's confirmation: retire the single global `/dev-log/lightbulbs` page; each Work project's new Lightbulbs sub-page shows that project's own tagged ideas; genuinely cross-project/meta lightbulbs surface as ordinary Dev Log entries instead (which fits Dev Log's now-explicit framing as "experiences and findings... any time something interesting happens"), rather than keeping a third, separate "general lightbulbs" bucket.

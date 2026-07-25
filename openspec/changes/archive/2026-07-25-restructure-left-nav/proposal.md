## Why

The left nav's current shape has accumulated real inconsistencies as the site grew: the site's own code-quality Metrics page is filed under "Writing" rather than "Site"; Sreditor (a polished, standalone project) sits under "Writing" instead of alongside Farpost/Vocare under "Work"; and Atlas/Dispatch/Pulse — pieces built to explore ideas *relevant to* Farpost but never actually built *as* Farpost — live inside Farpost's own page and tab bar, conflating exploratory work with the real project. That last conflation is, by Robin's own account, where the now-scrapped "siloes" concept's confusion originated. Separately, "Work" projects currently offer six sub-pages each (Build Plan, Feature List, Tech Stack, Upgrade Path, Current Metrics, Outlook); Robin wants every Work project to eventually be "a polished result," which means a consistent, larger template (adding Bug List, Testing & Verification, Lightbulbs, Glossary) applied uniformly, including to Sreditor once it moves there.

## What Changes

- **Site** group gains a **Metrics** entry (moved from Dev Log) — the site's own `scc` code-quality history, distinct from each Work project's own "Current Metrics."
- **Work** group gains **Sreditor** (moved from Writing) alongside Farpost and Vocare. Jernel, Baby Kitty, and Monkeyback are *not* added in this change (no real content yet) — the tree structure just shouldn't need rework when they arrive later.
- Every Work project's submenu (Farpost, Vocare, and the newly-added Sreditor) grows from 6 to 10 sub-pages: the existing Build Plan/Feature List/Tech Stack/Upgrade Path/Current Metrics/Outlook, plus new **Bug List**, **Testing & Verification**, **Lightbulbs**, and **Glossary** pages. Sreditor needs this submenu built from scratch (it currently has no project-record pages at all, only a single hub page).
- **Experiments** is promoted from a child of Work to its own top-level nav group, sibling to Site/Work/Writing/Ops — the home for "pieces" (`CLAUDE.md`'s Portfolio piece isolation convention). Atlas, Dispatch, and Pulse move here from Farpost's own pill-tab bar; Credential Flow (currently the sole entry at the already-existing `/techstacks` route) moves in alongside them. This retires the current rule that this index only holds pieces "unrelated to Farpost" — it becomes a general pieces index regardless of Farpost-relatedness. **BREAKING**: Farpost's own hub page loses its Atlas/Dispatch/Pulse tabs; those pieces are reachable via Experiments instead. Existing URLs for these pieces need redirects if they change.
- **Writing** keeps only **Dev Log**. Two structural changes inside it: (1) "Code Showcase" stops being an intermediate grouping node — its article entries become direct children of Dev Log itself. (2) Dev Log's other former children (Bug Log, Testing & Verification, Glossary — Metrics already covered above) are retired as site-wide pages, superseded by the new per-Work-project versions. **Lightbulbs is a genuine open question, not silently resolved**: some existing `docs/lightbulbs/` entries are project-specific (Farpost, Vocare) and some are genuinely site-level or cross-project — whether the global Lightbulbs page retires entirely or stays as a cross-project index alongside new per-project ones needs a decision in `design.md`, not an assumption baked in here.
- **Ops** is unchanged structurally in this change (content refresh is separate, later work).

## Capabilities

### New Capabilities
- `sreditor-project-record`: Sreditor's own 10-page Work-project submenu (mirroring `farpost-project-record`/`vocare-project-record`'s shape), since Sreditor has never had one before.
- `site-metrics`: the site's own real scc code-quality history, at its new `/metrics` route under Site — content unchanged from its prior home under `dev-log-content`, just relocated to its own capability since it's conceptually about the site itself, not a Dev Log topic.

### Modified Capabilities
- `site-navigation`: nav group membership and ordering changes (Site/Work/Experiments/Writing/Ops), per "What Changes" above.
- `farpost-project-record`: submenu grows from 6 to 10 pages.
- `vocare-project-record`: submenu grows from 6 to 10 pages.
- `tech-stacks-index`: broadens from a Farpost-unrelated-only index to a general Experiments index; gains Atlas/Dispatch/Pulse.
- `farpost-page-content`: the pill-tab-bar requirement changes — Atlas/Dispatch/Pulse tabs are removed from Farpost's own hub page.
- `dev-log-content`: the Dev Log hub's six-link requirement changes to reflect Code Showcase's entries flattening directly into Dev Log and the other four sub-pages retiring from this capability.
- `dev-log-lightbulbs`: scope depends on the open Lightbulbs question above — resolved in `design.md`, not here.

## Impact

- `web/src/components/navTree.ts` and `DrawerNav.tsx` (nav data/structure).
- `farpost-status.json`/`vocare-status.json` (extended for new sub-pages) and a new `sreditor-status.json`.
- New page routes for Bug List/Testing & Verification/Lightbulbs/Glossary under `/farpost/*`, `/vocare/*`, and `/sreditor/*` (new submenu entirely for the latter).
- `farpost-status.json`'s existing `deploymentStatus` field literally says "In active development in `siloes/farpost/`" — stale wording now that siloes are scrapped. Noted here as related cleanup debt; not fixed as part of this change since it's a wording/content fix, not a structural one.
- Redirects for any Atlas/Dispatch/Pulse URLs that move out of the `/farpost/*` namespace, if `design.md` decides they should move rather than just gain a second nav entry point.

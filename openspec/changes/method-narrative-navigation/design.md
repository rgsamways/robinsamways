## Context

This is the second navigation restructure in as many days. The first (`project-navigation-restructure`, archived 2026-07-10) turned `/portfolio` into a generic showcase index and built the reusable pieces this change reuses wholesale: the local `HamburgerMenu` component and the `PROJECTS`-array-plus-teaser index pattern. That change's own design.md flagged, in its Context section, an intended-but-unspecced convention that "new project pages going forward" would follow a scientific-method section structure — but scoped it as a future decision, not something to build then.

Working through what to actually do with that intention (a separate planning conversation with Robin) surfaced that "old page vs. new page" was never the right axis — it was really "what kind of story does this page tell." That reframing is what this change formalizes: Method and Narrative as two typed indexes, replacing the one generic Portfolio index, with the section-structure convention attached to Method specifically rather than applied uniformly.

Farpost was explicitly considered for inclusion under one of the two new indexes and rejected — see Decisions below.

## Goals / Non-Goals

**Goals:**
- Split the single Portfolio index into two typed indexes, Method and Narrative, reusing the existing index-page and local-HamburgerMenu pattern rather than inventing a new one.
- Relocate Sreditor and Credential Flow (renamed from Salesforce Loan Demo) into their respective new indexes with zero unintended content change.
- Finally write down the Method-type section-structure requirement as a real spec, closing a gap that's existed since the prior change.
- Add a lightweight `tags` field so tech-stack signal has a home without becoming a third nav tier.
- Add Farpost Pulse's nav slot and placeholder now, matching the "slot now, content later" precedent already used for Sreditor.

**Non-Goals:**
- Writing Sreditor's real Method-structured content, or Farpost Pulse's real build (Azure Functions, Cosmos DB, the AI coaching demo). Both stay placeholders here.
- Retrofitting Farpost's or Credential Flow's existing sections into the new Method structure — neither is Method-type, and this requirement is scoped to apply going forward only.
- Any tag-based filtering UI — tags are display-only metadata in this change.
- Touching Farpost itself in any way.

## Decisions

- **Method vs. Narrative is a content-type axis, not a chronology or tech-stack axis.** Considered and rejected: keeping "new pages get scientific method" as a blanket forward-looking rule regardless of content (status quo going in) — rejected because Farpost Pulse, though new, is a narrative response to specific interview feedback, not a documented experiment; forcing it into PROBLEM/HYPOTHESIS/METHOD framing would read as stilted. Also considered: a Tech-Stack top-level tier (Salesforce, Azure, etc.) either above or alongside Method/Narrative — rejected as premature for 2-3 total project pages, and because it would compete with the axis that actually matters to an interviewer regardless of which stack they're hiring for. Resolved as tags instead (see below).
- **Farpost stays top-level, filed under neither Method nor Narrative.** It's the real company/product with its own resume Experience entry, categorically different from a portfolio proof-piece even though its `ORIGIN_STORY` section reads narratively in tone. Filing it under Narrative was considered and explicitly rejected by Robin — Method/Narrative are indexes of things built to demonstrate a skill or resolve an experiment, and Farpost isn't that.
- **Tags, not a third nav tier, for tech-stack signal.** A `tags?: string[]` field on the existing project-entry type, rendered as a small row under the teaser. Costs nothing now, doesn't block a filter UI being layered on later if entries accumulate enough to justify it. Rejected: a dedicated Tech Stack index or filter page now — no current entry count justifies the structural overhead, and it's much easier to add a tier later than to walk one back.
- **`/portfolio` retires with no redirect.** Same reasoning the prior change already used and validated: no significant external inbound links exist yet, and the interview cycle the original case study was built for has already happened. Consistent, not a new risk.
- **Display rename only — capability IDs `salesforce-loan-demo` and `salesforce-relationship-view` are untouched.** Renaming those IDs would ripple into their existing cross-references for no benefit; the capability IDs describe the underlying technical capability accurately regardless of what the page is titled. Only the page's own `<h1>`, metadata title, and its Narrative-index teaser text change.
- **The Method-type section-structure requirement is scoped to future content only.** Applying it retroactively to Farpost or Credential Flow was considered and rejected — both are Narrative-type pages with an already-established, working shape; rewriting either for a structure that doesn't even apply to their category would be pure churn.
- **Fold the stale `/portfolio` route reference in `salesforce-loan-demo`'s spec into this change.** The prior change relocated the actual page to `/portfolio/salesforce-loan-demo` but never updated this capability's own requirement text, which still said `/portfolio` — a drift caught while researching this change, not introduced by it. Fixing it here avoids touching the same requirement twice in two consecutive changes.

## Risks / Trade-offs

- [`/portfolio` and `/portfolio/salesforce-loan-demo` both start 404ing with no redirect] → acceptable, per the already-validated precedent from the prior change; no known external links to either.
- [Two consecutive nav restructures in two days could read as churn if anyone's tracking the site's history closely] → acceptable; both changes are cheap (routing + index-page composition, not core content rewrites), and the second one is specifically correcting an organizing principle the first one got right structurally but wrong categorically (generic index vs. typed indexes).
- [The Method-type section structure has never been used in practice yet — Sreditor's real content will be the first real test of whether PROBLEM → EXISTING_APPROACHES → HYPOTHESIS → METHOD → RESULTS → CONCLUSION actually fits] → acceptable; that's explicitly deferred to Sreditor's own future content change, where it can be adjusted if it doesn't fit in practice, before it's ever applied to a second Method page.

## Migration Plan

1. Relocate Sreditor's placeholder from `/sreditor` to `/method/sreditor` (move, not rewrite).
2. Relocate Credential Flow's content from `/portfolio/salesforce-loan-demo` to `/narrative/credential-flow`; update its `<h1>`/metadata title from "$ Portfolio" to "$ Credential Flow"; everything else in that page moves verbatim.
3. Build `/method/page.tsx` (index, one entry: Sreditor) and `/narrative/page.tsx` (index, two entries: Credential Flow, Farpost Pulse), reusing the existing index-page pattern plus the new optional `tags` field.
4. Add the new `/narrative/farpost-pulse` placeholder route.
5. Delete `web/src/app/portfolio/` entirely (both the index and the old salesforce-loan-demo route).
6. Update `MenuToggle.tsx`'s global link list to Home / Method / Narrative / Farpost / Dev Log.
7. Update local `HamburgerMenu` usages: Method's index menu (currently nothing to link to beyond its own one entry — same shape Portfolio's local menu used), Narrative's index menu, Credential Flow's own local menu (section links unchanged).

## Open Questions

- Exact wording for Method's and Narrative's index intro copy — left loose in tasks.md, same "first pass, flag if you want exact wording instead" treatment the prior change used for Portfolio's intro.

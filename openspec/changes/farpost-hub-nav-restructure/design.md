## Context

This restructure replaces the story-type-based nav (Method vs. Narrative) established by `method-narrative-navigation` with a subject-based one, worked out directly with Robin across a planning conversation rather than from a written brief. Two pieces already living under Narrative (Farpost Pulse, Farpost Atlas) are explicitly built as extensions of Farpost's own thesis and belong under Farpost; Sreditor has grown into a real product with its own real-world test results and deserves a top-level destination rather than a single entry in a Method index that exists only to hold it; everything with no Farpost relationship (Credential Flow today) needs a home that doesn't imply a Farpost connection it doesn't have.

This change also absorbs the still-pending, unapplied `sreditor-page-farpost-results` change. That change's real content — Sreditor judged against Farpost's own 48-change OpenSpec history — was fully drafted but never placed, since Sreditor's page structure is changing out from under it before it shipped. Rather than place it into the old six-section structure and immediately restructure again, its facts are redrafted directly into the new SRED_ELIGIBILITY_EXAMPLE section below, and that pending change's directory is deleted as part of this change's tasks.

## Goals / Non-Goals

**Goals:**
- Reorganize the site by subject (Farpost / Sreditor / everything else) instead of by story type (Method / Narrative).
- Give Sreditor a real top-level page with content structured the same way Farpost's own page is (Origin Story / Problems Solves / Eligibility Example / Process) — siblings in the nav, siblings in shape.
- Fold Farpost Pulse and Farpost Atlas under a real Farpost hub with pill-tab navigation between Origins/Atlas/Dispatch/Pulse.
- Give Credential Flow (and future unrelated pieces) a home — Tech/Stacks — with a genuinely different browsing model (multi-select tag filtering) than Farpost's hub (direct navigation), since the two sections serve different browsing needs: Farpost's four pieces are few enough to tab between directly, Tech/Stacks is meant to scale past that.
- Ship a real, if minimal, Dispatch placeholder so the pill bar's fourth tab isn't a dead link.

**Non-Goals:**
- Any functional change to Credential Flow, Farpost Pulse, or Farpost Atlas's own underlying behavior — this is routing and surrounding content only.
- Building Farpost Dispatch for real — the placeholder reserves the nav slot; the actual Salesforce Experience Cloud partner portal (`rsw-lb-farpost-dispatch`) stays unscoped.
- Redirects from old `/method/*`/`/narrative/*` URLs — this is a portfolio site with no meaningful external inbound-link surface to preserve yet; flagged in Open Questions in case that assumption is wrong.
- Changing Home or Dev Log in any way.

## Decisions

- **Farpost's pill bar is real navigation; Tech/Stacks' pill bar is a filter.** Two different components, two different interaction models, because the two sections solve different problems. Farpost has exactly four pieces (Origins, Atlas, Dispatch, Pulse) — few enough that direct tabs between full pages is the more honest, simpler interaction, and each piece is substantial enough to deserve its own full page rather than being one filtered view among many. Tech/Stacks is explicitly meant to hold an unbounded, growing set of unrelated pieces over time, where a static index eventually becomes hard to scan — a multi-select tag filter scales better than a flat list and is the more standard pattern for browsing a growing, taggable catalog.
- **The pill-tab bar appears on every Farpost sub-page, not just the hub itself** (`/farpost`, `/farpost/farpost-atlas`, `/farpost/farpost-dispatch`, `/farpost/farpost-pulse` all show it, with the current page's pill visually active) — so a visitor can jump directly between Farpost pieces without returning to `/farpost` first, standard tab-bar behavior. This is a new UI element, separate from each page's existing `HamburgerMenu` (which still handles that specific page's own section anchors — Origin Story, Architecture, etc. — unchanged).
- **`/farpost` itself is the Origins tab's content**, not a separate hub-only landing view with no content of its own. Consistent with how a tab bar conventionally defaults to its first tab, and avoids inventing an awkward `/farpost/farpost-origins` route for content that's always simply been "the Farpost page." Atlas, Dispatch, and Pulse each get their own explicit sub-route since they're genuinely separate, substantial pages.
- **Sub-routes keep the doubled `farpost-` prefix** (`/farpost/farpost-atlas`, `/farpost/farpost-pulse`, `/farpost/farpost-dispatch`) rather than shortening to `/farpost/atlas` — confirmed directly with Robin. Preserves each piece's full original slug/name across the move.
- **Tech/Stacks' filter uses OR logic**: selecting multiple pills shows any project matching at least one selected tag, not only projects matching all of them. Standard behavior for a small, sparse catalog (one project today) — AND logic would make it trivially easy to filter down to zero results.
- **Tech/Stacks' pill list is seeded with 8 tags, not just Credential Flow's own 3.** Salesforce, OAuth 2.0, and Anthropic AI are real and currently filterable (Credential Flow uses all three); Azure, Python, TypeScript, PostgreSQL, and AWS are forward-looking categories with no matching project yet, included because the section is explicitly meant to grow and an empty-looking filter bar on day one would undersell that. A pill with zero current matches still functions correctly (empty result set), so this costs nothing structurally.
- **Sreditor's four sections mirror Farpost's own shape exactly** — ORIGIN_STORY, PROBLEMS_SREDITOR_SOLVES, SRED_ELIGIBILITY_EXAMPLE, PROCESS — a deliberate parallel now that they're nav siblings, not a coincidence. See Final Copy below for the actual redistribution of the existing six-section content plus the new Farpost-calibration findings.
- **Sreditor gets the same no-parent-link exemption Farpost already has** in `project-page-navigation` — it sits at the top nav tier itself now, not nested under a retired Method index.
- **`docs/deployment-guide.md` and `/ops/deploy` are untouched** — neither references `/method` or `/narrative` routes; this restructure has no deployment-runbook impact.

## Risks / Trade-offs

- [Removing `/method/*` and `/narrative/*` with no redirects breaks any external link or bookmark pointing at them] → accepted; this is a fast-moving portfolio site that's already had one full nav restructure and multiple route renames (Salesforce Loan Demo → Credential Flow, the original `/portfolio` route) without redirects, and there's no evidence of meaningful external inbound links yet. Revisit if that assumption turns out wrong.
- [Two different pill-bar interaction models (navigate vs. filter) on two adjacent top-level sections could read as inconsistent to a visitor] → mitigated by the two sections looking visually distinct enough (Farpost's pills sit beside a page heading like a tab bar; Tech/Stacks' pills sit above a filterable list with clear toggle-state styling) that the difference reads as intentional rather than accidental — a real UI risk worth watching once built, not something to resolve on paper.
- [Sreditor's page content is a substantial rewrite, not just a route move — real risk of losing detail in the redistribution] → mitigated by drafting the actual redistributed copy directly in this design doc (below), preserving every specific fact from the original six sections and the pending Farpost-calibration draft rather than summarizing from memory.

## Migration Plan

1. Build the two new nav components: a pill-tab bar (real links, active-state styling, used on Farpost's four pages) and a pill-filter bar (multi-select toggle, OR-logic filtering, used on Tech/Stacks).
2. Move Farpost Atlas's two routes and Farpost Pulse's three routes under `/farpost/farpost-atlas*` and `/farpost/farpost-pulse*`; add the pill-tab bar to all four Farpost pages (Origins/`/farpost` itself, Atlas, Dispatch, Pulse).
3. Build the new `/farpost/farpost-dispatch` placeholder page.
4. Move Credential Flow to `/techstacks/credential-flow`; build the new `/techstacks` index with the pill-filter bar and project-card list (same card pattern as today's `/narrative`).
5. Rewrite `/method/sreditor` as `/sreditor`, replacing its content with the Final Copy below.
6. Update `MenuToggle.tsx`'s global link list to Home/Farpost/Sreditor/Tech-Stacks/Dev Log.
7. Update `project-page-navigation`-governed local menus: Atlas/Dispatch/Pulse link back to `/farpost`; Credential Flow links back to `/techstacks`; Sreditor gets no parent link (matching Farpost's own exemption).
8. Delete `/method` and `/narrative` routes entirely, and their `openspec/specs/method-index/` and `openspec/specs/narrative-index/` capability files at archive time.
9. Delete `openspec/changes/sreditor-page-farpost-results/` (superseded, never applied).
10. Update the three route-hardcoding e2e specs (`global-navigation.spec.ts`, `farpost-atlas-map-flow.spec.ts`, `farpost-pulse-coaching-flow.spec.ts`) to the new routes.
11. Verify, run `scc`, log the snapshot.

## Open Questions

- Whether old `/method/*`/`/narrative/*` URLs need redirects after all — treated as a non-goal above; revisit if Robin has shared specific old links anywhere.
- Exact visual treatment for the two different pill-bar styles (navigate vs. filter) — implementer's judgment, should read as clearly different interaction models, not just left to chance.

## Final Copy

### Sreditor — ORIGIN_STORY

I didn&rsquo;t set out to build a tax-credit tool. Early in building robinsamways.ca, I started keeping a plain markdown log &mdash; <code>docs/sreditor/</code> &mdash; every time I hit a genuine technical uncertainty and had to systematically work through it. Not because I had SR&ED specifically in mind yet; it was just good practice for hard problems, worth writing down while I still remembered the actual sequence of not-knowing, investigating, and resolving.

The habit paid off enough that I started paying attention to why it mattered. Canada&rsquo;s SR&ED tax credit runs on a specific three-part test &mdash; a genuine technological uncertainty, a systematic investigation that resolved it, and a resulting technological advancement &mdash; assessed through Form T661 Part 2&rsquo;s three word-limited lines. Roughly 60% of audited claims get denied or substantially reduced, and the gap between an approved claim and a denied one is almost never the eligibility of the underlying work. It&rsquo;s the documentation. When a developer reconstructs this narrative months later, at filing time, they remember what they built, not what they didn&rsquo;t know going in &mdash; producing exactly the kind of product-description language and after-the-fact-assembled claim CRA&rsquo;s own denial statistics penalize.

I already had the fix, informally: a contemporaneous log, kept as I actually hit uncertainty, not reconstructed later. The only real question was whether that discipline could be automated into something a solo developer would actually keep using, instead of abandoning it the way manual note-taking usually gets abandoned once a deadline hits. Sreditor is that automation &mdash; built for real, in its own repository, across one extended session, using the same propose &rarr; implement &rarr; verify &rarr; archive discipline it exists to document.

### Sreditor — PROBLEMS_SREDITOR_SOLVES

<strong>Manual note-taking gets abandoned.</strong> No structure, no CRA-shaped framing, and because it&rsquo;s a separate chore layered on top of actual work, inconsistently kept or dropped entirely once a deadline hits. Sreditor removes the separate-chore problem by judging each change automatically, right when it&rsquo;s archived &mdash; no extra discipline required beyond already using OpenSpec.

<strong>Git history isn&rsquo;t SR&ED-shaped.</strong> Commit messages are written for other developers &mdash; what changed, not what was uncertain or how it was systematically investigated. Sreditor reads <code>proposal.md</code>/<code>design.md</code>/<code>tasks.md</code> instead &mdash; structured reasoning a developer already writes at decision time, not reverse-engineered from commit diffs.

<strong>Reconstruction at filing time is the most expensive and least reliable option.</strong> An accountant or SR&ED consultant interviewing a developer months later reconstructs intent from memory, under time pressure &mdash; the exact failure mode behind CRA&rsquo;s own denial statistics, and the developer being interviewed has usually already forgotten the real sequence of events. Sreditor&rsquo;s judgment happens in near real time instead, while the sequence is still fresh.

<strong>Generic project tooling &mdash; and the funded competitors built on top of it &mdash; are still reconstruction, just automated.</strong> Jira, Azure DevOps, timesheets track work, not scientific uncertainty; tickets describe features and tasks, not hypotheses and experiments. Mining tickets, commits, and timesheets after the fact &mdash; literally how the funded competitors in this space operate &mdash; doesn&rsquo;t fix the fact that it&rsquo;s still reconstruction. Sreditor judges contemporaneously instead of reconstructing anything.

### Sreditor — SRED_ELIGIBILITY_EXAMPLE

Built across one extended session, in seven phases plus a corroborating-signals extension, each shipped through Sreditor&rsquo;s own required propose &rarr; implement &rarr; verify &rarr; archive loop &mdash; the same discipline a user&rsquo;s project goes through, applied to itself. As of the most recent count: 26 TypeScript source files, 1,222 non-blank lines of code, 52 passing tests across 12 test files. Every command works end to end against real Anthropic API calls, not fixtures &mdash; <code>init</code>, <code>reflect</code>, <code>judge</code> (with drift-auditing and corroborating signals), <code>rollup</code> (with a real pre-call cost estimate), <code>report</code> (T661-line-structured markdown with real word counts), plus <code>scan</code>, <code>status</code>, and <code>doctor</code>.

Two real tests, not one. Judged against its own build first: Sreditor found <em>itself</em> SR&ED-ineligible at every single phase &mdash; including its hardest debugging work. Then, judged against Farpost&rsquo;s real, unrelated OpenSpec history &mdash; 48 archived changes, roughly four times Sreditor&rsquo;s own build &mdash; it returned exactly one defensible claim. Not one easy win: a project rollup synthesized from three individually-ineligible changes (a dispatch/ranking abstraction built once around claim-to-contractor assignment, then proven to generalize to a structurally different inspection-to-inspector flow, surfacing and fixing three real hidden defects along the way). None of the three contributing changes cleared the bar judged on its own &mdash; two were rated &ldquo;not close,&rdquo; one &ldquo;some signal&rdquo; &mdash; the eligibility only became visible once rollup viewed them as one continuous investigation. Exactly one other change out of the full 48 registered above &ldquo;not close&rdquo; at all, and it still stayed out: the closest it came to a real technical question was resolved with a single empirical check, not a structured investigation, and CRA&rsquo;s test asks for the latter. A skeptical judge that clears almost nothing, twice, on two different projects &mdash; including work it has every real incentive to find eligible in &mdash; is the calibration the entire design bet on. Not a limitation to explain away &mdash; the point, twice over.

Testing against a codebase four times Sreditor&rsquo;s own size also did what dogfooding alone couldn&rsquo;t: it broke things dogfooding never touched. Rollup failed outright against Farpost&rsquo;s mostly-ineligible 48-change log &mdash; first an opaque parse error, then a clean token-limit error once diagnosed &mdash; because the judgment prompt asked the model to enumerate every ineligible change into its own bucket, which blew the output ceiling at that scale; fixed by having code assemble that bucket instead of the model. Rollup&rsquo;s exact grouping also showed real run-to-run variance &mdash; an earlier run pulled a fourth, unrelated change into the dispatch narrative; the saved run kept it at three, same underlying story, a different boundary &mdash; worth stating plainly rather than implying the grouping is fully deterministic.

Still rough, worth naming plainly: markdown-only report output, no PDF or CSV yet. A single source adapter &mdash; OpenSpec only &mdash; though the adapter interface is designed to be tool-agnostic. Canada&rsquo;s CRA SR&ED program only, not a general international R&D tax credit tool. The git-to-code correlation heuristic behind corroborating signals only sees a change&rsquo;s final archiving commit, not earlier implementation commits along the way. Not yet published &mdash; <code>npm publish</code> and tagging <code>v0.1.0</code> is the one remaining step, held back pending sign-off, not a technical blocker.

### Sreditor — PROCESS

Sreditor is a CLI tool, Node.js and TypeScript, that reads a project&rsquo;s archived <a href="https://github.com/Fission-AI/OpenSpec" target="_blank" rel="noopener noreferrer">OpenSpec</a> change artifacts &mdash; <code>proposal.md</code>, <code>design.md</code>, <code>tasks.md</code>, structured reasoning a developer already writes at decision time under a spec-driven workflow &mdash; and judges each one against CRA&rsquo;s three-part test via a deliberately skeptical Claude (Sonnet 5) prompt, structured through <code>zod</code> schemas so the output is never freeform prose.

What a developer actually does: <code>sreditor init</code> runs a one-time AI-assisted interview that drafts a developer-authored &ldquo;anchor&rdquo; document &mdash; goal, genuine uncertainty, success criteria; the AI only assists in framing, never invents content, and the document is append-only once saved. From there, build normally through OpenSpec&rsquo;s own propose &rarr; apply &rarr; archive loop. <code>sreditor judge</code> judges each newly-archived change against the three-part test, and separately compares it against the anchor for scope drift &mdash; a second, distinct model call, kept apart from the eligibility judgment specifically so one doesn&rsquo;t bias the other. <code>sreditor rollup</code> periodically groups the accumulated judgments into CRA-shaped &ldquo;projects,&rdquo; the level CRA actually wants a claim framed at &mdash; gated behind a real token-cost estimate first, since it&rsquo;s the one command that processes the whole accumulated log at once. <code>sreditor report</code> renders the rollup into T661-structured markdown, with real word counts checked against the 350/700/350 limits.

A few decisions worth naming directly, the same discipline behind this site&rsquo;s own drift-audited build process: the two-layer judgment model (per-change judgment running continuously, rollup as the periodic filing-time synthesis step on top of an already-accumulated record) means the habit of thinking in SR&ED terms forms during the build, not at the end of the year. Every judgment prompt lives in the repo as plain TypeScript, readable by a developer, their accountant, or a CRA reviewer, not hidden behind a platform &mdash; transparency is the actual trust mechanism, not a slogan. Every call runs against the developer&rsquo;s own Anthropic account at standard rates, no markup, no subscription &mdash; the direct structural reason a solo developer or a tiny CCPC is a market the funded, per-seat-priced competitors aren&rsquo;t built to serve. Three optional corroborating-signal tools can feed extra context into a judgment prompt if installed, but are structurally barred from ever determining eligibility on their own &mdash; the prompt is explicitly instructed to treat them as non-authoritative.

### Farpost Dispatch placeholder (`/farpost/farpost-dispatch`)

Heading: &ldquo;$ Dispatch&rdquo;

Body: Coming soon &mdash; a Salesforce Experience Cloud partner portal matching field professionals to jobs across rural coverage areas, a direct callback to Farpost&rsquo;s own founding story: the rural service-availability gap that started all of this. Proves building <em>inside</em> Salesforce, not just integrating with it from the outside, the way Credential Flow does.

### Tech/Stacks index (`/techstacks`)

Heading: &ldquo;$ Tech/Stacks&rdquo;

Subtitle: Ideas with no relation to Farpost &mdash; a place to try a stack or a concept just to see if it can be built.

Pill filter tags (8, OR-logic, multi-select): Salesforce, OAuth 2.0, Anthropic AI, Azure, Python, TypeScript, PostgreSQL, AWS.

Project cards: identical to today&rsquo;s Credential Flow entry on `/narrative` &mdash; same teaser text, same tags (Salesforce, OAuth 2.0, Anthropic AI), route updated to `/techstacks/credential-flow`.

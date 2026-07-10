## 1. Relocate Sreditor to Method

- [ ] 1.1 Move `web/src/app/sreditor/page.tsx` to `web/src/app/method/sreditor/page.tsx` — content unchanged ("$ Sreditor" heading, "// coming soon" style message), no local `HamburgerMenu` yet (nothing to link to)
- [ ] 1.2 Delete the old `web/src/app/sreditor/` route once moved

## 2. Relocate and rename Credential Flow

- [ ] 2.1 Move `web/src/app/portfolio/salesforce-loan-demo/page.tsx` to `web/src/app/narrative/credential-flow/page.tsx` — all 7 sections, `PortfolioDemos.tsx`/`SetupGallery.tsx` usage, and existing local `HamburgerMenu` section links move verbatim
- [ ] 2.2 Update this page's `<h1>` from "$ Portfolio" to "$ Credential Flow", and its `metadata.title` to match — this is the fix for the stale-heading item flagged in `docs/issues.md` from the prior navigation change, folded in here rather than patched separately
- [ ] 2.3 Confirm no other copy on the page needs to change — "Salesforce Loan Demo" as a phrase can still appear in the case-study body text itself where it's factually describing the Salesforce work, this rename only concerns the page's own title/heading and its index-teaser entry

## 3. Build the Method index

- [ ] 3.1 Create `web/src/app/method/page.tsx`: a data-driven index (a typed array of project entries — slug/title/teaser/optional tags — same shape the Portfolio index used), currently one entry: Sreditor, teaser text + link to `/method/sreditor`
- [ ] 3.2 Add a local `HamburgerMenu` beside the "$ Method" heading, linking to each listed project page (currently just Sreditor)
- [ ] 3.3 Add a short intro sentence describing Method as pages that resolve a genuine technical uncertainty through experimentation — first-pass wording, flag if exact copy is wanted instead of drafting it yourself

## 4. Build the Narrative index

- [ ] 4.1 Create `web/src/app/narrative/page.tsx`: same data-driven index pattern, two entries: Credential Flow (teaser text — "Salesforce Loan Demo — a live Salesforce integration case study: OAuth 2.0 Client Credentials Flow, a custom Loan Application object model, AI-assisted recommendations, and a real Field History Tracking timeline" — linking to `/narrative/credential-flow`, tags: Salesforce, OAuth 2.0, Anthropic AI) and Farpost Pulse (teaser text noting it's a coming-soon entry, linking to `/narrative/farpost-pulse`, no tags yet)
- [ ] 4.2 Extend the project-entry type with an optional `tags?: string[]` field; render it as a small tag row beneath a teaser only when present (Credential Flow shows tags, Farpost Pulse's placeholder entry does not)
- [ ] 4.3 Add a local `HamburgerMenu` beside the "$ Narrative" heading, linking to both listed project pages
- [ ] 4.4 Add a short intro sentence describing Narrative as pages that tell the story of something built for a specific real reason — first-pass wording, flag if exact copy is wanted instead

## 5. Add the Farpost Pulse placeholder

- [ ] 5.1 Create `web/src/app/narrative/farpost-pulse/page.tsx` as a placeholder, matching the exact "$ <Title>" / "// coming soon" pattern already used by Method, Portfolio, and Sreditor's placeholders before their content was written — no local `HamburgerMenu` yet, since there's nothing to link to
- [ ] 5.2 Note in a code comment or the page itself is NOT required — this is intentionally minimal; the real Farpost Pulse build (Azure Functions, Cosmos DB, AI coaching demo) is a separate, already-scoped future change, out of scope here

## 6. Retire Portfolio

- [ ] 6.1 Delete `web/src/app/portfolio/` in its entirety (the index page and the old `salesforce-loan-demo` route) — both routes now 404, no redirect, per design.md's precedent

## 7. Update global navigation

- [ ] 7.1 Update `MenuToggle.tsx`'s hardcoded global `links` array to Home / Method / Narrative / Farpost / Dev Log, in that order — Portfolio and the top-level Sreditor entry are removed

## 8. Verification

- [ ] 8.1 Confirm every route works: `/method` (index, one entry), `/method/sreditor` (relocated placeholder), `/narrative` (index, two entries with Credential Flow's tags visible), `/narrative/credential-flow` (relocated content under its new heading, live demo widget and relationship view still functioning), `/narrative/farpost-pulse` (new placeholder), `/farpost` (unchanged), `/dev-log` (unchanged)
- [ ] 8.2 Confirm `/portfolio` and `/portfolio/salesforce-loan-demo` both now 404
- [ ] 8.3 Confirm the global menu lists Home, Method, Narrative, Farpost, Dev Log in order and navigates correctly
- [ ] 8.4 Confirm each index's local menu links work, and Credential Flow's own local menu still jumps to all 7 sections correctly
- [ ] 8.5 Confirm Credential Flow's `<h1>` and browser-tab title both read "Credential Flow", not "Portfolio"
- [ ] 8.6 `npm run build` clean, no console warnings
- [ ] 8.7 Run `scc --dryness web/src api` and log the snapshot to `docs/metrics.md` before archiving this change, per the convention in `CLAUDE.md`

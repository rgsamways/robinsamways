## 1. Build the real page

- [ ] 1.1 Rewrite `web/src/app/method/sreditor/page.tsx` from its placeholder to the six required sections (PROBLEM, EXISTING_APPROACHES, HYPOTHESIS, METHOD, RESULTS, CONCLUSION), using the verbatim copy in this change's `design.md` — copy is final, not a first draft; flag a genuine typo rather than silently rewording anything substantive, same convention used for `farpost-page-content`
- [ ] 1.2 Match the existing `SectionHeader` convention and curly-quote (`&rsquo;`/`&ldquo;`/`&rdquo;`/`&mdash;`) style already used on Farpost's and Credential Flow's pages
- [ ] 1.3 The METHOD section includes a real external link to OpenSpec's GitHub repo (`https://github.com/Fission-AI/OpenSpec`) — use `target="_blank" rel="noopener noreferrer"`, matching how external links are handled elsewhere on this site if a precedent exists, or a sensible default if not
- [ ] 1.4 Add a local `HamburgerMenu` beside the "$ Sreditor" heading, linking to all six sections

## 2. Update the Method index entry

- [ ] 2.1 Update Sreditor's `PROJECTS` entry in `web/src/app/method/page.tsx` with the new teaser text from `design.md`
- [ ] 2.2 Add tags to the same entry: TypeScript, Node.js, Claude API, OpenSpec

## 3. Verification

- [ ] 3.1 Confirm all six sections render in the correct order with the verbatim copy
- [ ] 3.2 Confirm the local menu's six links all jump to the correct section
- [ ] 3.3 Confirm Method's index shows the updated teaser and tags for Sreditor
- [ ] 3.4 `npm run build` clean, no console warnings, no JSX whitespace-glue regressions (check proactively, per this project's documented recurring bug)
- [ ] 3.5 Run `scc --dryness web/src api pieces` and log the snapshot to `docs/metrics.md` **and** `docs/metrics.json` before archiving this change, per the convention in `CLAUDE.md`

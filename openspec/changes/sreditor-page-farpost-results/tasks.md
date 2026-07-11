## 1. Place the updated copy

- [ ] 1.1 In `web/src/app/method/sreditor/page.tsx`, replace RESULTS' second through sixth paragraphs with the RESULTS Final Copy in `design.md`, keeping the first paragraph (the seven-phases build story) verbatim and unchanged. Copy is final, not a first draft — flag a genuine typo rather than silently rewording anything substantive, same convention as the original page.
- [ ] 1.2 Replace CONCLUSION's three paragraphs with the CONCLUSION Final Copy in `design.md`, keeping the final "Next:" line's format and the existing italic emphasis on "itself."
- [ ] 1.3 No changes needed to PROBLEM, EXISTING_APPROACHES, HYPOTHESIS, METHOD, the local `HamburgerMenu`, or the `/method` index entry — confirm nothing else drifted while editing.

## 2. Verification

- [ ] 2.1 Confirm the full RESULTS section reads in order with the new content, and the local menu's `#results` and `#conclusion` anchors still land correctly
- [ ] 2.2 `npm run build` clean, no console warnings
- [ ] 2.3 Proactively check for JSX whitespace-glue regressions around any new inline `<code>`/`<em>` tags introduced by the new copy (this page's documented recurring bug) — extract rendered text and check tag boundaries, not just a visual read
- [ ] 2.4 Run `scc --dryness --exclude-dir .git,.hg,.svn,node_modules,.venv web/src api pieces` and log the snapshot to `docs/metrics.md` **and** `web/src/data/metrics.json` before archiving this change, per the convention in `CLAUDE.md`

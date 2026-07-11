## Context

`/method/sreditor` shipped (archived as `sreditor-page-content`, 2026-07-11) with a RESULTS section that explicitly named its own biggest gap: the T661 narrative register had "only been calibrated against a deliberately ineligible test set — Sreditor's own build — never yet against a genuinely eligible one." That gap is now closed. Robin ran Sreditor's full `reflect`/`judge`/`rollup` pipeline against Farpost's real OpenSpec archive — 48 changes, roughly four times Sreditor's own build — and pulled the facts from `.sreditor/rollup.json` and `.sreditor/judgments.jsonl` after a full re-judge. The result: exactly one defensible claim, and it did not come from any single change clearing the bar on its own — it came from rollup synthesizing three individually-ineligible changes into one continuous investigation. One other change, out of the full 48, registered as "some signal" and still stayed out. The same test run also surfaced real, scale-driven bugs in Sreditor's own rollup/judge/report code (token-ceiling failures, a non-deterministic grouping boundary) that dogfooding on Sreditor's own small build had never exercised.

## Goals / Non-Goals

**Goals:**
- Replace RESULTS' and CONCLUSION's now-stale calibration claims with the real Farpost result, stated with the same specificity and honesty as everything else on this page (the 48-change denominator, the synthesis-not-single-change nature of the one defensible claim, the one borderline item and exactly why it stayed out).
- Fold in the newly-found rollup non-determinism as an explicit, plainly-stated limitation — consistent with the page's own established practice of naming rough edges rather than hiding them.
- Leave PROBLEM, EXISTING_APPROACHES, HYPOTHESIS, and METHOD untouched — none of the underlying design reasoning changed, only the empirical evidence reporting on it.

**Non-Goals:**
- A full write-up of the scale-driven tool bugs the Farpost run exposed (token-ceiling crashes, the missing reasoning output, the anchor-bias theory tested and disproved) — RESULTS gets a brief, honest mention; the full story is tracked separately as `docs/lightbulbs/rsw-lb-sreditor-farpost-scale-bugs.md`, a future Dev Log bug-log candidate, not part of this page.
- Any change to the `/method` index's Sreditor teaser or tags — still accurate, untouched.
- Any change to Sreditor's own codebase — this change only touches robinsamways.ca's description of it.

## Decisions

- **Report the one defensible claim as "synthesized from three individually-ineligible changes," not as "1 of 48."** Robin was explicit that this framing is both more accurate and more interesting than a flat hit-rate, and it's the framing that actually demonstrates the two-layer judgment model (per-change judgment, rollup as synthesis) doing real work rather than just packaging pre-judged results.
- **State the rollup non-determinism finding plainly, as a new "still rough" item, rather than omitting it.** An earlier run pulled a fourth, unrelated change into the same dispatch narrative; the saved run kept it at three. Consistent with the page's own established voice (RESULTS already names markdown-only output and single-jurisdiction scope as rough edges without hedging) — a page built on "specific, checkable facts... not aspirational or illustrative claims" doesn't get to soften an inconvenient one.
- **Drop "CI green on every push" from the updated stats paragraph.** It wasn't part of the facts gathered for this update, and restating it without reconfirmation would be exactly the kind of unverified claim this page's own `Content reflects Sreditor's real, verifiable state` requirement exists to prevent. Noted here explicitly rather than silently dropped.
- **Keep the scale-driven bug narrative to one paragraph in RESULTS, not an exhaustive list.** The full detail (five distinct fixes, the anchor-bias theory tested and disproved) belongs in its own Dev Log bug-log entry later; this page's RESULTS section needs enough to support the calibration claim's credibility, not a complete debugging log.
- **CONCLUSION reframes "the most credible evidence" from one data point to two** — Sreditor judging itself ineligible, then judging Farpost's real history and finding almost nothing — since the second data point is arguably the stronger one (an unrelated, human-built, much larger project, not a self-referential test).

## Risks / Trade-offs

- [Stating rollup's grouping isn't perfectly reproducible run-to-run could read as undermining confidence in the tool] → acceptable and intentional; this page's credibility rests on naming real limitations, not hiding them, and the underlying finding is a minor reproducibility gap in change-grouping, not a wrong-verdict bug — the eligibility judgment itself didn't change between runs, only which changes got bundled into the narrative.
- [Dropping a previously-stated claim ("CI green on every push") without evidence it became false could look like an unexplained retraction] → mitigated by flagging it explicitly here and in the handoff to Robin, rather than quietly omitting it.

## Migration Plan

1. In `web/src/app/method/sreditor/page.tsx`, replace RESULTS' second through sixth paragraphs with the Final Copy below, keeping the first paragraph (the seven-phases build story) verbatim and unchanged.
2. Replace CONCLUSION's three paragraphs with the Final Copy below, keeping the final "Next:" line's format.
3. Verify: page renders correctly, `npm run build` clean, proactively check for JSX whitespace-glue regressions around any new inline `<code>`/`<em>` tags (the page's documented recurring bug).
4. No `openspec/specs/` changes, no `/method` index changes — nothing else to update.

## Open Questions

None — the facts gathered directly answer everything needed; the copy below is final, voice-adapted content ready to place, same "flag a genuine issue rather than silently reword" convention as the original page.

## Final Copy

### RESULTS (paragraphs 2 onward — paragraph 1 is unchanged)

As of the most recent count: 26 TypeScript source files, 1,222 non-blank lines of code, 52 passing tests across 12 test files. Every command works end to end against real Anthropic API calls, not fixtures &mdash; `init`, `reflect`, `judge` (with drift-auditing and corroborating signals), `rollup` (with a real pre-call cost estimate), `report` (T661-line-structured markdown with real word counts), plus `scan`, `status`, and `doctor`.

Calibration no longer rests on Sreditor&rsquo;s own build alone. It has since been run against Farpost&rsquo;s real OpenSpec history &mdash; 48 archived changes, roughly four times Sreditor&rsquo;s own build &mdash; and returned exactly one defensible claim. Not one easy win: a project rollup synthesized from three individually-ineligible changes (a dispatch/ranking abstraction built once around claim-to-contractor assignment, migrated onto by its first real consumer, then proven to generalize to a structurally different inspection-to-inspector flow, surfacing and fixing three real hidden defects along the way). None of the three contributing changes cleared the bar judged on its own &mdash; two were rated &ldquo;not close,&rdquo; one &ldquo;some signal&rdquo; &mdash; the eligibility only became visible once rollup viewed them as one continuous investigation. Exactly one other change out of the full 48 registered above &ldquo;not close&rdquo; at all, and it still stayed out: the closest it came to a real technical question was resolved with a single empirical check, not a structured investigation, and CRA&rsquo;s test asks for the latter. A roughly one-in-fifty hit rate against a live project&rsquo;s real change history &mdash; on a claim the tool only found by synthesizing across changes, not by taking any single change&rsquo;s word for it &mdash; is the calibration evidence this page previously said didn&rsquo;t exist yet.

Testing against a codebase four times Sreditor&rsquo;s own size also did what dogfooding alone couldn&rsquo;t: it broke things dogfooding never touched. Rollup failed outright against Farpost&rsquo;s mostly-ineligible 48-change log &mdash; first an opaque parse error, then a clean token-limit error once diagnosed &mdash; because the judgment prompt asked the model to enumerate every ineligible change into its own bucket, which blew the output ceiling at that scale; fixed by having code assemble that bucket instead of the model. And rollup&rsquo;s exact grouping showed real run-to-run variance &mdash; an earlier run pulled a fourth, unrelated change into the dispatch narrative; the saved run kept it at three, same underlying story, a different boundary &mdash; worth stating plainly rather than implying the grouping is fully deterministic.

Still rough, and worth naming plainly rather than hiding: markdown-only report output, no PDF or CSV yet. A single source adapter &mdash; OpenSpec only &mdash; though the adapter interface is designed to be tool-agnostic, nothing else is built. Canada&rsquo;s CRA SR&ED program only, not a general international R&D tax credit tool. The git-to-code correlation heuristic behind corroborating signals only sees a change&rsquo;s final archiving commit, not earlier implementation commits along the way. And, as the Farpost run showed directly, rollup&rsquo;s exact grouping boundary isn&rsquo;t perfectly reproducible run to run.

Not yet published. `npm publish` and tagging `v0.1.0` remains the one remaining step &mdash; a live, externally-visible action deliberately held back pending sign-off, not a technical blocker.

### CONCLUSION (full replacement)

This proves the core bet is buildable, not just plausible: a contemporaneous, developer-native SR&ED judgment loop that runs continuously rather than being reconstructed once a year, verified end to end against two real projects&rsquo; real build histories &mdash; its own, and now Farpost&rsquo;s.

The honest state is early but real. Not a mockup or a demo script &mdash; a working CLI that has made real, billed API calls against two separate codebases&rsquo; actual git and OpenSpec history, with a full test suite. Genuinely pre-1.0, single-adapter, single-jurisdiction &mdash; and, as of the Farpost run, honestly non-deterministic in one specific place: rollup&rsquo;s exact grouping boundary isn&rsquo;t guaranteed to repeat run to run.

The most credible evidence for the whole thesis is now two data points, not one. Judged by its own standard, Sreditor found *itself* SR&ED-ineligible at every single phase of its own build &mdash; including its hardest debugging work. Then, run against Farpost&rsquo;s real, unrelated 48-change history, it returned exactly one defensible claim, and that claim only became visible through rollup synthesizing three individually-ineligible changes into one continuous investigation, not from any single change taking the tool&rsquo;s word for it. A skeptical judge that clears almost nothing, twice, on two different projects &mdash; including work it has every real incentive to find eligible in &mdash; is the calibration this entire design bet on. Not a limitation to explain away &mdash; the point, twice over.

Next: `npm publish`, tag `v0.1.0`.

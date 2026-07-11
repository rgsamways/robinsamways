## Context

This is the first Method-type page built against the section structure specified in `method-index` (PROBLEM → EXISTING_APPROACHES → HYPOTHESIS → METHOD → RESULTS → CONCLUSION), which existed as a requirement without a real test case until tonight. Sreditor was built for real, in its own separate repository, across one extended session — Robin brought back a structured brief already mapped to this exact section order, so this change is placement and voice-adaptation (first-person, matching Farpost's and Credential Flow's established convention), not content invention.

## Goals / Non-Goals

**Goals:**
- Ship all six required sections with real, verifiable content — specific numbers, specific architecture decisions, nothing vague or aspirational.
- Update Method's index entry (teaser + tags) to match.
- Add the local `HamburgerMenu`, matching every other project page.

**Non-Goals:**
- A setup gallery (real screenshots of Sreditor's own CLI output, CI runs, etc.) — a reasonable future addition once there's a moment to actually capture them, not blocking this content change.
- Any change to `docs/sreditor/` (this project's own R&D log) or the Sreditor product's own repository — this change only touches robinsamways.ca.
- The third Dev Log bug-log entry (the `cross-spawn`/ANSI/`ENOBUFS` debugging story) — logged separately as `rsw-lb-sreditor-tool-integration-bugs`, not part of this change.

## Decisions

- **Verbatim-with-voice-adaptation, not a rewrite.** The brief Robin brought back is already precise and complete; this change converts its voice to first-person (matching Farpost's `ORIGIN_STORY` convention) and places it into the required section structure, without inventing or embellishing facts.
- **The `docs/sreditor/` connection is stated with direct confidence, not hedged.** The Sreditor session's own brief flagged this as "noted as told" since it couldn't verify another repository — this repo can verify it directly (it's this project's own folder), so the page states it as fact.

## Final Copy

### PROBLEM

Canada&rsquo;s SR&ED tax credit runs on a specific three-part test: a genuine technological uncertainty, a systematic investigation that resolved it, and a resulting technological advancement. CRA assesses all three through Form T661 Part 2 &mdash; three lines, word-limited to 350, 700, and 350 words respectively. Of the claims that get audited, roughly 60% are denied or substantially reduced, and the gap between an approved claim and a denied one is almost never the eligibility of the underlying work. It&rsquo;s the documentation.

Here&rsquo;s the specific failure mode. When a developer reconstructs this narrative months later, at filing time, they no longer remember the actual sequence of uncertainty, investigation, and resolution &mdash; they remember what they built, not what they didn&rsquo;t know going in. That produces two things CRA explicitly penalizes: narratives written in product-description language (&ldquo;we built a real-time pipeline handling 50,000 events/sec&rdquo;) instead of investigation language (&ldquo;investigation into whether known architectures could maintain latency under loads exceeding published benchmarks&rdquo;), and a claim assembled near a deadline that reads as curated rather than contemporaneous &mdash; which erodes credibility with a reviewer even when the work itself was genuinely eligible.

### EXISTING_APPROACHES

- **Manual note-taking.** No structure, no CRA-shaped framing, and because it&rsquo;s a separate chore layered on top of actual work, inconsistently kept or abandoned entirely once a deadline hits.
- **Relying on git history.** Commit messages are written for other developers &mdash; what changed, not what was uncertain or how it was systematically investigated. Git history has no real mapping to CRA&rsquo;s three-part test; it&rsquo;s a record of output, not of reasoning.
- **An accountant or SR&ED consultant interviewing the developer months later.** Reconstructs intent from memory, at year-end, under time pressure &mdash; exactly the failure mode behind CRA&rsquo;s own denial statistics. Also the most expensive option, and the developer being interviewed has usually already forgotten the real sequence of events.
- **Generic project-management tooling.** Jira, Azure DevOps, timesheets &mdash; built for tracking work, not scientific uncertainty. Tickets describe features and tasks, not hypotheses and experiments. This is also, literally, how the funded competitors in this space operate: mining tickets, commits, and timesheets to reconstruct SR&ED intent after the fact from signals that were never written with CRA framing in mind. Automating the reconstruction doesn&rsquo;t fix the fact that it&rsquo;s still reconstruction.

### HYPOTHESIS

A lightweight, developer-native, contemporaneous logging practice &mdash; integrated into how a developer already works rather than added as a separate chore &mdash; produces stronger, more defensible SR&ED documentation than any form of after-the-fact reconstruction, however careful.

Concretely: judge SR&ED eligibility per change, in near real time, as changes are actually completed &mdash; not once a year at filing time. Keep the judgment deliberately skeptical rather than generous, so the resulting record stays credible under audit. Make the reasoning transparent &mdash; published prompts, not a black box &mdash; so the trust story doesn&rsquo;t depend on taking a vendor&rsquo;s word for it. Make it free and frictionless enough (CLI-native, bring-your-own API key) that a solo developer actually keeps using it, instead of abandoning it the way manual note-taking gets abandoned.

### METHOD

Sreditor is a CLI tool, Node.js and TypeScript, that reads a project&rsquo;s archived <a href="https://github.com/Fission-AI/OpenSpec" target="_blank" rel="noopener noreferrer">OpenSpec</a> change artifacts &mdash; `proposal.md`, `design.md`, `tasks.md`, structured reasoning a developer already writes at decision time under a spec-driven workflow &mdash; and judges each one against CRA&rsquo;s three-part test via a deliberately skeptical Claude (Sonnet 5) prompt, structured through `zod` schemas so the output is never freeform prose.

What a developer actually does: `sreditor init` runs a one-time AI-assisted interview that drafts a developer-authored &ldquo;anchor&rdquo; document &mdash; goal, genuine uncertainty, success criteria. The AI only assists in framing; it never invents content, and the document is append-only once saved. From there, build normally, using OpenSpec&rsquo;s own propose &rarr; apply &rarr; archive loop. `sreditor judge` judges each newly-archived change against the three-part test, and separately compares it against the anchor for scope drift &mdash; a second, distinct model call, kept apart from the eligibility judgment specifically so one doesn&rsquo;t bias the other. `sreditor rollup` periodically groups the accumulated judgments into CRA-shaped &ldquo;projects,&rdquo; the level CRA actually wants a claim framed at &mdash; gated behind a real token-cost estimate before the call runs, since it&rsquo;s the one command that processes the whole accumulated log at once. `sreditor report` renders the rollup into markdown, pre-structured around T661 Part 2&rsquo;s actual line numbers, with real word counts &mdash; not model-claimed ones &mdash; checked against the 350/700/350 limits.

A few decisions worth naming directly. The two-layer judgment model &mdash; per-change judgment running continuously, rollup as just the filing-time packaging step on top of an already-accumulated record &mdash; means the habit of thinking in SR&ED terms forms during the build, not at the end of the year. Drift-auditing runs as a second, independent model call, and its output is a plain-language narrative rather than a numeric score, so it&rsquo;s legible directly in the log instead of buried in a metric. Transparency is the actual trust mechanism, not a slogan: every judgment prompt lives in the repo as plain TypeScript, readable by a developer, their accountant, or a CRA reviewer, not hidden behind a platform. Every call runs against the developer&rsquo;s own Anthropic account at standard rates &mdash; no markup, no subscription &mdash; which is also the direct structural reason a solo developer or a tiny CCPC is a market the funded, per-seat-priced competitors aren&rsquo;t built to serve. And corroborating signals &mdash; three optional external tools that can feed extra context into a judgment prompt if installed &mdash; are structurally barred from ever determining eligibility on their own; the prompt is explicitly instructed to treat them as non-authoritative.

Sreditor didn&rsquo;t start as an idea in the abstract. This site&rsquo;s own `docs/sreditor/` folder &mdash; a plain markdown log of technological-uncertainty write-ups, kept by hand since the first week of building robinsamways.ca &mdash; was the original manual prototype. Sreditor is that same discipline, automated.

### RESULTS

Built across one extended session, in seven phases plus a corroborating-signals extension, each shipped through a full propose &rarr; implement &rarr; verify &rarr; archive loop &mdash; Sreditor&rsquo;s own build tracked the same way a user&rsquo;s project would be, using OpenSpec on itself.

As of tonight: 26 TypeScript source files, roughly 1,100 lines of code, 46 passing tests across 12 test files, CI green on every push. Every command works end to end against real Anthropic API calls, not fixtures &mdash; `init`, `reflect`, `judge` (with drift-auditing and corroborating signals), `rollup` (with a real pre-call cost estimate), `report` (T661-line-structured markdown with real word counts), plus `scan`, `status`, and `doctor`. Sreditor is dogfooded on its own build &mdash; its real judgment log and real anchor document, produced by running the tool on itself, are the actual calibration data behind everything above.

Still rough, and worth naming plainly rather than hiding: markdown-only report output, no PDF or CSV yet. A single source adapter &mdash; OpenSpec only &mdash; though the adapter interface is designed to be tool-agnostic, nothing else is built. Canada&rsquo;s CRA SR&ED program only, not a general international R&D tax credit tool. The git-to-code correlation heuristic behind corroborating signals only sees a change&rsquo;s final archiving commit, not earlier implementation commits along the way. And the T661 narrative register has been checked against a real published CRA example, but only calibrated against a deliberately ineligible test set &mdash; Sreditor&rsquo;s own build &mdash; never yet against a genuinely eligible one.

Not yet published. `npm publish` and tagging `v0.1.0` is the one remaining step &mdash; a live, externally-visible action deliberately held back pending sign-off, not a technical blocker.

### CONCLUSION

This proves the core bet is buildable, not just plausible: a contemporaneous, developer-native SR&ED judgment loop that runs continuously rather than being reconstructed once a year, verified end to end against a real project&rsquo;s real build history &mdash; its own.

The honest state is early but real. Not a mockup or a demo script &mdash; a working CLI that has made real, billed API calls against its own actual git and OpenSpec history, with a full test suite and green CI. Genuinely pre-1.0, single-adapter, single-jurisdiction, not yet calibrated against a real eligible project.

The most credible evidence for the whole thesis might be an unglamorous one. Judged by its own standard, Sreditor found *itself* SR&ED-ineligible at every single phase tonight &mdash; including its hardest debugging work. That&rsquo;s the skeptical calibration the entire design bet on, holding up under the most self-interested test case available. Not a limitation to explain away &mdash; the point.

Next: `npm publish`, tag `v0.1.0`.

## Index entry update (`web/src/app/method/page.tsx`)

- **Teaser:** &ldquo;A CLI tool that judges SR&ED tax-credit eligibility from a project&rsquo;s own OpenSpec change history, in near real time &mdash; contemporaneous documentation instead of reconstructing a claim from memory months later.&rdquo;
- **Tags:** TypeScript, Node.js, Claude API, OpenSpec

## Risks / Trade-offs

- [Sreditor-the-product is a separate, actively-developing codebase — page content could drift from its real state as it evolves] → acceptable; this is a snapshot of tonight's real state, same as every other Narrative/Method page describes a point-in-time state of its subject. Update later if the product changes materially, same as any other page.

## Migration Plan

1. Replace `web/src/app/method/sreditor/page.tsx`'s placeholder with the six sections above, in order, matching the site's existing `SectionHeader`/curly-quote conventions.
2. Add the local `HamburgerMenu`, linking to all six sections.
3. Update Method's index entry (teaser + tags) per above.
4. Verify build clean, local menu links work, index entry renders correctly.

## Open Questions

None — the brief resolved every open question a first-pass draft would normally leave for Robin to weigh in on.

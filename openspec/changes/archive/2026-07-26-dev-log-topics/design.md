## Context

`web/src/components/dev-log/codeShowcase.ts` holds every Dev Log entry as one flat array (`CODE_SHOWCASE_ENTRIES`), each with a granular `category` (Data Ingestion, Payments, Notifications, ...). `web/src/app/dev-log/page.tsx` lists them all, most recent first, no grouping. `DrawerNav.tsx`'s Dev Log submenu (per the already-shipped `site-navigation` spec) lists every entry by title too — proven fine at 12 entries, not proven at 23. `docs/lightbulbs/` holds 9 files ending `-dev-log-entry.md`, each an unscoped idea for a future entry; one of them (`rsw-lb-ru-throughput-dev-log-entry.md`) turns out to already be fulfilled by the existing `cosmos-db-shared-throughput` entry, confirmed by reading both directly rather than assumed from the filename.

## Goals / Non-Goals

**Goals:**
- Give 23 entries a browsable structure on `/dev-log` without inventing a new UI pattern this site doesn't already have proof of.
- Cap the left-nav submenu's growth so it stays usable as the entry count keeps climbing.
- Ship the 11 new entries with real, specific final copy — not placeholders CLI has to invent.

**Non-Goals:**
- No change to any existing entry's code, prose, category, or slug.
- No multi-topic tagging (an entry belongs to exactly one topic) — see D2 for why.
- No change to individual entry pages (`/dev-log/<slug>`) — this only touches the hub page and the nav.

## Decisions

**D1 — A `topic: string` field, one level above `category`, with a fixed 5-value taxonomy.**
`Engineering`, `Process & Verification`, `Architecture & Stack Decisions`, `Business Model`, `Human Factors`. Every existing entry's `category` maps cleanly onto exactly one of these (see table below) — no existing entry needs a new, invented topic, and no topic is empty.

| Topic | Entries (by category or slug) |
|---|---|
| Engineering | All 12 existing entries (Data Ingestion, Dispatch Architecture, Reputation Scoring, Payments ×3, Notifications, Data Modeling, AI Integration, Infrastructure ×2) + new `role-modeled-twice` |
| Process & Verification | New: `minor-change-real-scope`, `same-source-different-story`, `drift-audit-doesnt-self-verify`, `how-this-site-actually-gets-tested` |
| Architecture & Stack Decisions | New: `fastify-vs-express-tradeoff`, `golden-path-not-planned`, `found-my-own-stack` |
| Business Model | New: `billing-model-convergence`, `three-prices-in-three-days` |
| Human Factors | New: `ai-interview-format-mismatch` |

*Alternative considered:* leave `category` as the only grouping field and derive topic from it at render time via a lookup table in the component. Rejected — a stored field is one source of truth CLI can inventory directly against the live array; a derived lookup table is a second place the mapping has to stay correct, for no real savings (both need the same table to exist somewhere).

**D2 — Single-select topic pills, not multi-select tags.**
Every one of the 23 entries has exactly one clear best-fit topic (confirmed while drafting D1's table — nothing straddled two). Reusing `FarpostTabBar`'s existing single-select pattern (active-link styling, one selection at a time, an "All" reset state) is simpler to build and to browse than introducing this site's *other* existing pattern — Tech/Stacks' multi-select OR-logic pill filter — for a case that doesn't need OR-logic across values that never overlap per entry.

**D3 — Left-nav submenu caps at 5 most recent, plus a "View All" link.**
5 keeps the submenu roughly the same visual height it already has today at fewer, sometimes-longer titles. The cap is a plain slice of `ENTRIES` (already sorted by `publishedAtUtc` for the hub page) — no new sorting logic. "View All" links to `/dev-log`, which is where the real browsing UI (D1/D2) now lives.
*Alternative considered:* collapse "Dev Log" to a single link with no submenu at all. Rejected only because Robin's own reaction to the capped-list idea was positive ("that's a nice idea") — a small win of in-nav discoverability for the site's most recent work is worth keeping, at a bounded, non-growing cost.

**D4 — `docs/lightbulbs/` graduation notes.**
Per this project's existing lightbulb convention ("if an idea later graduates into a real OpenSpec change, the original file stays in place with a pointer to what it became"), each of the 8 drafted-from-lightbulb files gets a one-line pointer to its new slug once this ships; `rsw-lb-ru-throughput-dev-log-entry.md` gets a note that it was independently already fulfilled by `cosmos-db-shared-throughput`, not by this change.

## Risks / Trade-offs

- [Risk] A future entry might genuinely straddle two topics (D2 assumes it won't) → Mitigation: revisit single-select vs. multi-select only if that actually happens; don't build multi-select speculatively for a case that hasn't occurred yet.
- [Risk] 5 as the nav cap is a guess, not measured → Mitigation: cheap to change later, it's one constant; not worth more design effort than that.
- [Risk] Assigning `topic: "Engineering"` to 13 of 23 entries makes that one pill dominate the filter → Mitigation: accurate to what's actually been written so far; a real signal that more Process/Architecture/Business content (like this batch) is worth continuing, not a UI problem to hide.

## Migration Plan

Pure content + client-side UI change. No data migration. Ships through the normal Vercel deploy flow. Rollback is a plain revert.

## Open Questions

None blocking.

## Final Copy — 11 New Dev Log Entries

Verbatim `CodeShowcaseEntry` content for CLI to insert into `CODE_SHOWCASE_ENTRIES`. Do not rewrite the prose — write it into the real field shapes (`framing: string[]`, `codeBlocks: {language, code}[]`, `theFix: string[]`, `whyThisMatters: string[]`), splitting each framing/fix/why block into the same number of paragraphs shown below.

---

### 1. `minor-change-real-scope`
- project: `robinsamways.ca` · category: `AI-Assisted Development` · topic: `Process & Verification`
- date: `2026-07-26` · publishedAtUtc: `2026-07-26T15:00:00Z`
- title: "10 Minutes, Nine Task Groups: What 'Minor UI Change' Actually Cost"
- teaser: "A casual request to clean up the mobile nav turned into a shared-state decision, a stale-session bug pattern avoided before it existed, and a spec drift finding — none of it visible from outside."

framing:
1. "The request was framed casually: move some icons around, make the mobile nav full-screen instead of a narrow drawer, tidy up the 'on this page' outline. The kind of ask that sounds like a CSS tweak. The developer directing it even joked he hoped it wouldn't take more than 10 minutes."
2. "Tracing what 'move an icon' actually touches surfaced three things invisible from the outside: the icon meant to swap between 'Account' and 'Sign In' would go stale the instant someone signed in, because the component hosting it never remounts on client-side navigation — a constraint documented from a prior, unrelated change, easy to never notice until a real user hit it live. Removing a modal's escape-hatch `createPortal` call required confirming nothing else in the codebase depended on it. And the header photo — already flipped once, the day before, on a whim — turned out to have drifted from a requirement the site's own spec had stated all along."

codeBlocks: [{ language: "markdown", code:
"D4 — Session-conditional icon via a `data-signed-in` attribute on `<html>`, not\nReact state or a new event bus.\n\nWhy not React state: RightRail mounts once at the root layout and never\nremounts on client-side navigation (established precedent, site-settings-page)\n— a useState read once on mount would go stale the instant a visitor signs in\nor out without a full reload." }]

theFix: ["Nothing here got 'fixed' after the fact — the process caught it before any code existed. Writing a design doc before writing a line of implementation forced each of these costs into the open during planning: what should have been a one-line CSS change grew into 9 task groups covering a new shared-state context, a CSS pattern reused from an existing settings feature, two rewritten end-to-end test files, and a restoration of an already-shipped-but-undelivered spec requirement."]

whyThisMatters: ["Working solo with AI, a rigid process — proposal, design, spec deltas, task list, all before implementation — doesn't just catch AI's mistakes. It catches the mistake of underestimating scope before a single line is committed, which is exactly the difference between a line item in a proposal and a late-night bug-fix entry discovered after something ships and breaks quietly in production."]

---

### 2. `same-source-different-story`
- project: `robinsamways.ca` · category: `AI-Assisted Development` · topic: `Process & Verification`
- date: `2026-07-26` · publishedAtUtc: `2026-07-26T15:30:00Z`
- title: "I Rewrote Ten Already-Published Stories Without Noticing"
- teaser: "Handed the same code and the same context notes a second time, I wrote nine completely different titles and framings for content that had already been live on the site for days — proof the same input doesn't produce the same output twice."

framing:
1. "Handed a leftover draft file — raw code plus short context notes for 10 dev-log entries — the task was to write full prose for nine of them, confident they were unpublished. A quick check landed in the wrong directory and came back empty, so the mistake looked confirmed instead of caught. Only once asked directly, 'I suspect these are already live, aren't they?', did a proper check turn up the real answer: all 10 had shipped already."
2. "The interesting part isn't the miss — it's the diff between the two versions of the same story. Same code, same context notes, same author, same model. The sentences that came out were genuinely different every time — not paraphrases of each other, independently-arrived-at framings of identical facts."

codeBlocks: [{ language: "text", code:
"published:      \"A Generic Dispatch Loop, Built Before It Needed to Be\"\nthis session:   \"One Dispatch Loop, Built Before It Had a Second Job\"\n\npublished:      \"The Fix That Almost Reopened the Bug It Fixed\"\nthis session:   \"Fixing a Race Without Reopening It\"\n\npublished:      \"Not Every Fact Goes Stale at the Same Rate\"\nthis session:   \"A Roof Goes Stale Faster Than a Foundation\"" }]

theFix: ["There wasn't an internal check that caught this — a direct question was the actual correction, not anything about the output itself. Nine confidently-written, individually plausible entries gave no signal that they were reproducing something that already existed. The real fix was checking the right file the second time: the actual data component, not the page-route directory that happened to be checked first."]

whyThisMatters: ["Non-determinism in generated prose is quietly dangerous for exactly this reason — a single fluent, confident-sounding answer carries no signal about whether it's genuinely new or a re-derivation of something that already exists elsewhere. The same 'trust but verify' discipline this site's own case studies apply to AI-written code applies just as much to AI-written content: check whether it already exists before treating a good answer as a new one."]

---

### 3. `drift-audit-doesnt-self-verify`
- project: `robinsamways.ca` · category: `AI-Assisted Development` · topic: `Process & Verification`
- date: `2026-07-26` · publishedAtUtc: `2026-07-26T16:00:00Z`
- title: "A 'Drift-Audited and Synced' Report That Wasn't"
- teaser: "A change shipped with an honestly-flagged behavioral deviation — and the spec's own literal wording about that exact behavior still didn't get corrected until a second, separate read caught it after archiving."

framing:
1. "A mobile nav redesign shipped with a pre-archive drift audit against four modified specs, and one flagged deviation in the closing report: the menu button, once its own panel becomes a full-viewport takeover, can't be 'activated again' to close itself — the panel visually covers the button that would trigger it. Escape, an explicit close control, and selecting a link cover the real need. A sound call, matching how a well-known auth library's own mobile nav behaves."
2. "But the requirement text itself, already merged into the live spec, still read 'activating the menu button again... SHALL close it' — a claim that stopped being reachable the moment the panel went full-viewport. The report said 'drift-audited and synced.' The one sentence describing this exact behavior wasn't. Nobody had reason to doubt it — until asked directly whether that claim always holds, which prompted an actual diff between the flagged deviation and the live spec text, by a second reader, not the process that produced the report."

codeBlocks: [{ language: "markdown", code:
"before: \"Activating the menu button again, pressing Escape, or selecting a\n         link SHALL close it; there is no backdrop to click...\"\n\nafter:  \"Pressing Escape, activating the panel's own explicit close control,\n         or selecting a link SHALL close it — the menu button itself is\n         covered by the open panel and isn't reachable again while it's\n         open...\"" }]

theFix: ["The fix itself was trivial — one sentence, corrected directly in the live spec once the mismatch was found. The real gap wasn't the sentence, it was the distance between 'flagged a deviation clearly' and 'confirmed every requirement's literal wording still matches that deviation' — two different checks, reported as if they were one."]

whyThisMatters: ["Reliably catching behavioral divergence and reporting it honestly is real, hard work — that's not a small thing, and it's the part most likely to matter to whoever's reading the report. But treating a summary line like 'drift-audited and synced' as proof the spec text itself was re-diffed against every named deviation is a false sense of completeness. What actually closes the gap isn't a bigger audit step — it's not trusting the summary at face value once a concrete deviation is already on the table, and going to read the actual text yourself."]

---

### 4. `ai-interview-format-mismatch`
- project: `robinsamways.ca` · category: `Interview Process` · topic: `Human Factors`
- date: `2026-07-24` · publishedAtUtc: `2026-07-24T22:00:00Z`
- title: "What a Timed AI Interview Actually Measures"
- teaser: "Two AI-interview attempts surfaced a real weak spot in cold, timed terminology recall — even though the reasoning ability the interview was supposedly testing stayed intact the whole time."

framing:
1. "Two attempted AI-conducted technical interviews — one cut short around ten minutes in, one completed — surfaced something concrete: fast, verbal recall of syntax-level terminology (`const` vs. `var`, the spread operator, `interface` vs. `type`) is a real weak spot under a cold, timed format. Worth saying plainly rather than only showcasing wins."
2. "What didn't falter, in the same sessions, was the actual reasoning: spotting an off-by-one bug in a loop, and correctly explaining why it produced the wrong output. The gap wasn't understanding — it was retrieving the right word for something already understood, fast, out loud, on the clock. Farpost — 39 backend models, dozens of spec-tracked changes, real production bugs found by reasoning about spec-vs-code mismatches, not by naming vocabulary quickly — is concrete counter-evidence sitting right next to the gap."

codeBlocks: [{ language: "text", code:
"interview format tested:  cold, timed, verbal recall of syntax terminology\nwhat actually held up:    diagnosing an off-by-one loop bug and explaining\n                          why it produced the wrong result, unprompted" }]

theFix: ["There isn't a fix here in the usual sense — the honest response was recognizing the format mismatch for what it is: a timed vocabulary quiz measures something real, but narrower than it presents itself as measuring, and it's a different skill than the reasoning that actually ships production code."]

whyThisMatters: ["A portfolio that's all technical wins reads as curated. Naming a real limitation plainly — paired with hard evidence of the specific capability the format failed to measure — is a more credible signal than either overclaiming or staying silent about it. It's also a quiet argument to anyone evaluating candidates the same way: a take-home or portfolio review surfaces real capability that a cold timed quiz can miss entirely."]

---

### 5. `billing-model-convergence`
- project: `robinsamways.ca` · category: `Business Model` · topic: `Business Model`
- date: `2026-07-24` · publishedAtUtc: `2026-07-24T20:00:00Z`
- title: "Two Projects Independently Invented the Same Pricing Shape"
- teaser: "Designing a shared billing model surfaced that two separate projects had each already arrived at the identical 'buy a bundle, spend per use' pattern — independently, under different names, before anyone connected them."

framing:
1. "While designing a cross-project billing model meant to be shared in shape, not in runtime, an old, unbuilt idea from one project turned up describing a professional 'token bucket': buy 50 tokens for $20, spend one per claim. Structurally, that's identical to a separately-conceived idea from a second project — 'session packs' — a prepaid balance spent per use, arrived at with no connection to the first."
2. "Neither project copied the other. Both independently converged on the same abstraction under different names, before this billing-model effort ever connected the two. It's the same shape of discovery as finding an already-converged tech stack by auditing real code instead of deciding on one from scratch — this time one level up, in the business model rather than the technology."

codeBlocks: [{ language: "text", code:
"Project A's own idea (unbuilt, logged earlier): buy 50 tokens / $20, spend 1 per use\nProject B's own idea (separately conceived):    prepaid packs, spent per use\n\nSame shape. Different names. Neither copied the other." }]

theFix: ["The shared design ended up generalizing this convergence directly — a credit-pack pattern with a real consumption ledger, not just a decrementing counter, built to fit both projects' own already-independently-chosen shape rather than inventing a third abstraction neither had actually asked for."]

whyThisMatters: ["A shared pattern validated by two independent teams already arriving at it is stronger evidence than a pattern designed once on a whiteboard and then imposed. This is the same 'golden path recognized after the fact, not planned top-down' story showing up a second time — in monetization design instead of technology choice — which is a signal it's a real pattern, not a coincidence."]

---

### 6. `fastify-vs-express-tradeoff`
- project: `robinsamways.ca` · category: `Stack Decisions` · topic: `Architecture & Stack Decisions`
- date: `2026-07-24` · publishedAtUtc: `2026-07-24T18:00:00Z`
- title: "Choosing the Framework With 10x Fewer Downloads, on Purpose"
- teaser: "Express had no major version for a decade and still lacked built-in async-error handling until late 2024 — the decision to use Fastify anyway traded market visibility for technical merit, deliberately."

framing:
1. "Choosing a Node framework for a rebuild meant actually comparing, not defaulting. Express went without a major release from 2014 until Express 5 in October 2024, and didn't have correct built-in async/await error handling until that release. Fastify was designed from 2016 onward specifically to fix that gap, plus schema-first request validation and plugin encapsulation as first-class features, not bolted-on middleware."
2. "Express still has roughly an order of magnitude more downloads, and is the framework most job postings name explicitly. Choosing Fastify anyway was a knowing trade — technical merit over market visibility — not unaware of the tradeoff, made in spite of it."

codeBlocks: [{ language: "text", code:
"Express: no major version 2014 -> Oct 2024 (v5); correct built-in async\n         error handling only arrives with that release\nFastify: designed 2016+ specifically around that gap, plus schema-first\n         validation and plugin encapsulation as first-class features\n\nExpress: ~10x the downloads; the framework most job postings name explicitly\nFastify: chosen anyway, for the technical reasons above" }]

theFix: ["Not a bug fix — a documented, comparative decision, made with the tradeoff named explicitly rather than discovered later. The evidence (release history, what each framework actually fixed and when) is checkable, not a preference stated as fact."]

whyThisMatters: ["This is a direct, evidence-backed answer to 'why did you choose X' — the question a copied tutorial stack can't actually answer. Going against the more market-visible choice for a stated, defensible reason is a stronger signal of real technical judgment than following convention because it's what most postings mention."]

---

### 7. `golden-path-not-planned`
- project: `robinsamways.ca` · category: `Platform Engineering` · topic: `Architecture & Stack Decisions`
- date: `2026-07-24` · publishedAtUtc: `2026-07-24T19:00:00Z`
- title: "I Built a 'Golden Path' Before I Knew That Was the Name for It"
- teaser: "Converging every project onto one stack, and giving each one the same homepage-plus-live-build shape, turned out to match patterns real engineering orgs already run at scale — recognized after the fact, not planned top-down."

framing:
1. "Converging every project onto one stack is what companies call a 'golden path' or 'paved road,' a term Spotify popularized specifically to describe cutting onboarding and maintenance cost by giving every team the same well-supported route. Giving each project its own homepage — background, then a link straight to the live, real build — is structurally a personal-scale version of Backstage, the CNCF developer portal built for exactly that purpose."
2. "None of this was planned that way from the start. It was recognized after the fact, once the pattern was already sitting in a handful of separate projects, that it already matched terms and structures real platform teams use at scale. The honest framing is 'built organically, then realized what it already was,' not 'copied a framework I'd read about.'"

codeBlocks: [{ language: "text", code:
"what got built:                       the industry term for it:\none converged stack across             \"golden path\" / \"paved road\" (Spotify)\n  every project\none homepage per project, each         a personal-scale Backstage\n  linking straight to the real           (CNCF developer portal)\n  live build\npropose -> validate -> archive         ADR / RFC-driven development\n  discipline before any code" }]

theFix: ["There's no fix here — the realization itself is the content. Naming the parallel explicitly, after building it, is more honest than presenting it as if the plan came first."]

whyThisMatters: ["This reads as more senior than 'I organized my folders sensibly' — it shows awareness of real platform-engineering patterns without having set out to copy them, and it gives process rigor that could otherwise look like unexplained overhead for a one-person project (drift audits, spec discipline, dryness tracking) a legible, named frame for a technical reader."]

---

### 8. `found-my-own-stack`
- project: `robinsamways.ca` · category: `Stack Decisions` · topic: `Architecture & Stack Decisions`
- date: `2026-07-24` · publishedAtUtc: `2026-07-24T17:00:00Z`
- title: "I Found My Tech Stack by Auditing My Own Code"
- teaser: "Checking real dependency files across four separate projects turned up a stack that had already converged on its own, before it was ever consciously named as 'the stack.'"

framing:
1. "Auditing the actual dependency files across four separate projects found that one had already converged on a specific framework/ORM/database/auth combination, on its own, before that combination was ever consciously chosen as a deliberate standard."
2. "The insight wasn't 'I decided on a stack.' It was 'I looked at what I'd already built across separate projects and recognized the decision I'd already made, independently, more than once.' The other projects are now being deliberately brought toward that same stack, on purpose this time."

codeBlocks: [{ language: "text", code:
"Project A's real dependencies (checked directly, not assumed):\n  one framework, one ORM, one database, one auth library\n\nProject B's dependencies at the time: a different stack entirely\nProject C's dependencies at the time: the same underlying problem as B\n\nThe decision was already made. It just hadn't been named yet." }]

theFix: ["Not a fix — an audit. Checking real dependency files directly, across every real project, rather than deciding on a stack from preference and asserting it after the fact."]

whyThisMatters: ["A stack page that says 'I found this by auditing my own code' is more credible than one that just asserts preferences — it's evidence a pattern was actually followed in practice, independently, more than once, rather than a list of technologies picked because they sounded right."]

---

### 9. `role-modeled-twice`
- project: `Farpost` · category: `Data Modeling` · topic: `Engineering`
- date: `2026-07-24` · publishedAtUtc: `2026-07-24T21:00:00Z`
- title: "Fixing a Design Without Tearing Out What It Replaced"
- teaser: "A professional's 'role' turned out to be modeled two different ways in the same schema at once — not from a bad decision, but from a good one that arrived late and never removed the skeleton underneath it."

framing:
1. "Diagnosing why an identity/roles model felt overcomplicated turned up a real duplication: a `Professional` record carries a `roles: list[str]` field, and separately has ten per-role child tables — adjuster, contractor, agent, and so on — joined back to it by a bare string, with no actual foreign key. 'Role' was modeled twice, two different ways, at the same time."
2. "The root cause wasn't a bad decision. `User`-as-root-identity was the right correction to an earlier, role-first design — but the retrofit that introduced it never removed the old skeleton it was meant to replace, so both versions kept running side by side. That's a generalizable failure mode, not a one-off mistake: fixing part of a design without tearing out what it replaced."

codeBlocks: [{ language: "python", code:
"class Professional(Document):\n    roles: list[str]  # source of truth #1\n\nclass Adjuster(Document):\n    professional_id: str  # joined back by a bare string, no real FK\n    # ...9 more per-role tables shaped exactly like this one" }]

theFix: ["The lesson generalizes past this one schema: when a correct architectural fix lands on top of an existing structure, the old structure has to actually be removed, not left running in parallel next to its replacement. Two sources of truth for the same fact don't average out to one correct answer — they just create a place for the two to quietly disagree."]

whyThisMatters: ["Catching and explaining your own design drift reads as more senior than a highlight reel of wins only, and it generalizes past this one project — anyone who's inherited or built an accreted codebase will recognize the exact pattern: a good fix, arriving late, that never finished the job of removing what it was fixing."]

---

### 10. `how-this-site-actually-gets-tested`
- project: `robinsamways.ca` · category: `Verification Practice` · topic: `Process & Verification`
- date: `2026-07-10` · publishedAtUtc: `2026-07-10T18:00:00Z`
- title: "No CI, and That's a Deliberate Choice — Not a Gap"
- teaser: "This site's real testing approach — Playwright, FastAPI's TestClient, real external calls when testing an integration itself, and no persistent CI — is a documented, deliberate trade-off for a solo project at this scale, not an oversight left unexplained."

framing:
1. "How this site actually gets verified before shipping: Playwright for browser-driven UI checks, FastAPI's `TestClient` for API-level testing, and — deliberately — real external calls when the thing under test is an integration itself, rather than mocking away the exact behavior being verified. There's no CI or persistent, automatically-triggered test suite yet."
2. "That absence is a stated trade-off, not something quietly left out and hoped nobody would ask. For a solo project at this scale, the actual practice is: run the real suite manually before every archive checkpoint, verify drift against the spec directly, and be upfront that automation hasn't been added yet rather than implying more automation exists than actually does."

codeBlocks: [{ language: "text", code:
"Playwright         -> real browser-driven UI checks\nFastAPI TestClient -> API-level testing\nreal external calls -> when testing an integration itself, not a mock of it\nno CI / no persistent suite -> deliberate, stated trade-off at this scale" }]

theFix: ["Not a bug fix — a documented practice. The honesty is the point: being upfront about what doesn't exist yet, and why that's a deliberate choice rather than a gap being hidden, is itself part of the verification discipline being described."]

whyThisMatters: ["This demonstrates a real, separately-evaluated skill — thinking about testing and verification strategy, not just shipping features — using this site's own actual practice as the worked example instead of a hypothetical. Overclaiming automation that doesn't exist would be less credible than plainly explaining why it doesn't, yet."]

---

### 11. `three-prices-in-three-days`
- project: `Vocare` · category: `Business Model` · topic: `Business Model`
- date: `2026-07-24` · publishedAtUtc: `2026-07-24T23:00:00Z`
- title: "Three Prices in Three Days, and Why Each Change Was Right"
- teaser: "A one-time $10 lifetime unlock, raised to $29, then moved to a $12/year recurring plan — a real account of changing your mind under evidence, not a single pricing decision presented as if it were final from day one."

framing:
1. "One project's actual pricing history, in order: launched at a one-time $10 lifetime unlock, raised to a one-time $29 lifetime unlock, then moved toward a $12/year recurring plan — marketed as '$1/month' — inside of three days. Each change had a real reason, not a random walk."
2. "The reasoning behind the final move: a low, recurring entry price brings in more users faster than either lifetime price point did, because it lowers the up-front decision cost a visitor has to make. The evidence for the change sits directly in the actual Stripe Checkout code being replaced — a one-time payment call, moving to a real recurring subscription."

codeBlocks: [{ language: "text", code:
"day 1: one-time $10 lifetime unlock\nday 2: raised to one-time $29 lifetime unlock\nday 3: moving to $12/year recurring (\"$1/month\"), replacing both" }]

theFix: ["Not a code fix — a pricing decision revised twice in three days, each time for a stated reason, ending on the actual Stripe primitive changing shape: one-time payment mode replaced by a real recurring subscription object."]

whyThisMatters: ["Most portfolio pricing content shows a single decision made once and stuck with. An honest account of changing your mind, with real reasons attached to each change, is a stronger signal of actual pricing judgment under evidence than a static 'here's my pricing' page that implies it was right the first time."]

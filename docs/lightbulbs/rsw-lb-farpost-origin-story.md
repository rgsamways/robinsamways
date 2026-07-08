# rsw-lb-farpost-origin-story

**Slug:** rsw-lb-farpost-origin-story
**Date logged:** 2026-07-07
**Status:** scoped and drafted — became the OpenSpec change `farpost-page-content` (2026-07-08), copy finalized collaboratively with Robin, implementation handed to CLI
**Related:** `web/src/app/farpost/page.tsx` (currently a placeholder), Farpost's professional-reputation graph and "40-Year Pulse" building-intelligence thesis (see `rsw-lb-rural-demographics-api`), `salesforce-loan-demo`'s Farpost parallel copy

## The gap

`web/src/app/farpost/page.tsx` is still a bare placeholder ("// coming soon") — the same state the Portfolio page was in before tonight's Salesforce case study filled it in. Whenever it does get written, the risk is that it reads like every other founder's product pitch: a feature list and a value proposition, no origin. The actual founding story — a real rural-insurance pain point, a false start, and an unplanned synthesis — is more concrete and more defensible in an interview than an abstract "here's what Farpost does" framing, and it's currently not captured anywhere in the repo at all.

## The idea

Open the Farpost page with the real founder story, told in four beats:

1. **The spark.** An insurance adjuster had a claim in a rural setting and couldn't find anyone — a contractor, an inspector — willing or able to travel out from the bigger cities to handle it. Not a technology gap; a professional-availability gap. Rural claims were stalling for a reason no software addressed.
2. **The first build.** Robin built a dispatch claims app directly in response — solving the immediate coordination problem: getting the right professional to the right claim regardless of geography.
3. **The detour.** Shortly after, a separate side project: an Android compliance app called TapLog, built independently of the dispatch work. Three weeks into building it, another company turned out to already be building the exact same thing — a direct, humbling collision with existing competition, and reason enough to stop.
4. **The synthesis.** Rather than discard TapLog outright, the tag/scan-based verification idea at its core — RFID tags — got scavenged into the dispatch work. That fusion of "dispatch the right professional" and "verifiably log what happened at this physical location, over time" is what became Farpost's building intelligence platform.

The page should tell this as a real narrative — first person, specific, unpolished where unpolished is true (the TapLog collision is a failure, not a pivot dressed up as strategy) — before moving into whatever product/architecture content follows it. Robin has asked for this to be written "more deeply and professionally" than the bullet points above; that drafting work (and pulling in any additional real Farpost documentation/detail Robin can supply) is a CLI content-writing task against `web/src/app/farpost/page.tsx`, not something to finalize in this lightbulb.

## Why it matters beyond convenience

- Turns Farpost from a feature pitch into a founder story with a concrete, personal hook — the same instinct already applied to the Salesforce case study's honest licensing-limitation framing and the Farpost professional-reputation-graph parallel.
- The TapLog failure is an asset, not something to hide: showing a builder who tries things, hits a wall, and recovers the useful part of a failed attempt is more credible to an interviewer than a story with no false starts in it.
- Gives the "40-Year Pulse" / building-intelligence thesis referenced elsewhere in this repo's lightbulbs an actual origin, rather than it appearing to have arrived fully formed.

## Open questions

- Exact chronology and naming details (when the dispatch app shipped, what TapLog's competitor was, how long the RFID-to-Farpost transition took) — Robin to supply or confirm before this becomes final page copy.
- Whether any existing Farpost-side documentation (a README, pitch deck, or prior write-up in the separate Farpost repo) should be pulled in for additional accuracy/detail — none exists in *this* repo (`robinsamways.ca`) to draw from.
- Whether this origin story becomes its own section above the eventual product/architecture content, or is woven throughout — a content-structure decision for whoever writes the actual page.

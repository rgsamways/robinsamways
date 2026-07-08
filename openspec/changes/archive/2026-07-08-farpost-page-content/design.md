## Context

`/farpost` has been a bare placeholder since the site was first built. Robin and Chat drafted real, final copy for it tonight, section by section, with Robin reviewing and approving each one before moving to the next. This is a content/presentation change, not a technical integration — there's no new data model, dependency, or API surface, so this design doc is intentionally short.

## Final Copy

The exact, final text for all four sections. Verbatim — do not reword, condense, or "improve" any of it. Flag a genuine typo rather than silently fixing it.

### ORIGIN_STORY

> I didn't set out to build a building-intelligence platform. In late May 2026, an insurance adjuster I knew had a rural claim and couldn't find anyone to work it — no contractor, no inspector willing to make the drive out from the city for one job. It wasn't a technology problem, it was an availability problem nobody's software was built to solve. I built a dispatch app in about a week to fix exactly that: get the right professional to the right claim, regardless of how far out it was.
>
> Three weeks later, deep into a second, unrelated project — an Android compliance app called TapLog, built around RFID tags for verifying physical inspections — I found out another company was already building almost the same thing. Not similar. The same thing, down to a striking number of features I'd built without ever knowing theirs existed. That's a hard thing to sit with three weeks in, and there wasn't a version of finishing TapLog that still made sense, so I stopped.
>
> I didn't throw the idea away, though. The part of TapLog that actually mattered — an RFID tag verifying a physical location, logging what happened there over time — got folded straight into the dispatch app I'd already built. Dispatch the right professional to the right building, and keep a real, tag-verified record of what happened at that building afterward. That fusion, arrived at by mid-June 2026, is what Farpost actually is.

### PROBLEMS_FARPOST_SOLVES

Five sub-points. Each bolded lead-in below is a sub-heading *within* this one section — not five separate top-level sections.

> **The problem that matters most: it dies with the owner.** The facts that actually matter about a building — where the water shutoff is, the model and serial number on the furnace, who did the roof and when, where the warranty and manuals live — exist in exactly one place today: a single owner's head. When that person sells, retires, or just forgets, the knowledge is gone with them. Farpost anchors those facts to the building itself, via an NFC tag on the physical structure, so they survive the person. It pays off at 2am hunting a water shutoff, at a sale, or handing a job to a new contractor who's never set foot in the building before. This is the core value proposition, deliberately designed to work for a single owner with zero network effect — nobody else has to be using Farpost for it to already be useful.
>
> **The rural service-availability gap — where this all started.** National restoration franchises decline claims outside their service zones across North Hastings, cottage country, and the wider Canadian Shield. Farpost's dispatch flow connects adjusters directly to local contractors who'd otherwise never get found for that work. It's real, live, and still fully supported — it's just no longer the platform's defining feature, since the "it dies with the owner" problem turned out to be the deeper, more durable one.
>
> **Every professional starts from zero.** An inspector who's been to a building before, a contractor who already knows its quirks, an adjuster who already has the claim history — none of that persists or connects across roles today. Every visit starts cold. Farpost builds one living record tied to the building, so the right professional already knows what they're walking into instead of re-discovering it every time.
>
> **No neutral, portable building history exists.** Right now, an owner's building memory is effectively locked to whichever insurer or professional relationship happens to be active at the time. Farpost is carrier-neutral by design — the "Switzerland" that owners, brokers, and contractors can all trust — so the record survives a carrier switch. No insurer would ever build this themselves: they're structurally conflicted, and an insurer-owned version of this record could never actually be neutral.
>
> **A smaller mechanic worth mentioning: staleness, not just presence.** Facts about a building don't all age the same way — a foundation photo is good for years, but "current occupant" can be stale in months. Farpost tracks that decay per fact and surfaces it plainly ("this record is three years stale") rather than passing judgment on it. Consistent with the platform's broader principle: it documents, it doesn't evaluate.

### BUILDING_LIFECYCLE_EXAMPLE

Render the dated entries as a chronological list styled consistently with the existing status-history timeline pattern from `RelationshipView.tsx` (dated, chronological, `›`-prefixed entries).

> A fictional example, illustrating how a Farpost record actually behaves over a building's life — not a real property, but a realistic composite of what the platform is for.
>
> **124 Concession Rd 7, rural North Hastings** — tagged 2019.
>
> - **2019-04** — Owner (Marlene) tags the building on move-in. Logs the well pump breaker location, the septic tank's approximate location and last-pumped date, and photographs the foundation and electrical panel.
> - **2019-11** — First real payoff: a burst pipe at 1am. Marlene's son, visiting for the weekend and unfamiliar with the property, scans the tag on the mechanical room door and finds the water shutoff in under a minute instead of guessing in the dark.
> - **2021-06** — Roof replaced. The contractor logs the shingle brand, warranty term, and invoice link directly against the building record — not just Marlene's own filing cabinet.
> - **2022-09** — Wind damage claim. The adjuster assigned to the file is new to the area and has never been to this property; the tag surfaces the 2021 roof replacement and its warranty terms immediately, resolving in one visit what would otherwise have taken a callback to confirm.
> - **2023-03** — Marlene sells the property to a new owner, who switches insurance carriers the same year. The record itself doesn't move with the insurer or the old owner — it stays with the building, carrier-neutral, and transfers cleanly to the new owner and their new broker.
> - **2024-01** — The system flags the septic "last pumped" fact as stale — three years since last recorded, past its expected service interval. Not a verdict, just a fact surfaced: "this record is 3 years stale." The new owner has it serviced and logs the update.
> - **Today** — the record has outlived one owner, one carrier, one roof, and one emergency at 1am, and every professional who's touched the building since 2019 added to the same file instead of starting their own.

### PROCESS

> Building Farpost solo means there's no one else to catch drift between what a feature was supposed to do and what it actually does — so I built that check into the process itself. Every non-trivial change starts as a written proposal (what's changing, why, and the exact behavior expected of it) before any code gets written, and nothing merges until a deliberate drift audit confirms the shipped behavior actually matches what was proposed — not just that it works, but that it works the way it was supposed to. It's the same discipline behind this site's own Salesforce case study, built the same way: propose, implement, audit for drift, then finalize.
>
> Alongside that, I keep a contemporaneous log of genuine technical uncertainty resolved through real experimentation, written down as I hit it — not reconstructed from memory after the fact. It's the same discipline Canadian SR&ED tax credits ask of R&D work, kept up because it's good practice for hard problems regardless of the tax angle, and it's paid off enough as its own habit that it's becoming a small project in its own right.

## Goals / Non-Goals

**Goals:**
- Get the four already-approved sections into `web/src/app/farpost/page.tsx`, in a sensible order, matching the site's existing section/header conventions.
- Style the `BUILDING_LIFECYCLE_EXAMPLE` timeline consistently with the existing status-history display pattern from the Salesforce case study, so the site's visual language for "a timeline of dated events" stays consistent rather than inventing a second one.

**Non-Goals:**
- Rewording, condensing, or "improving" the drafted copy — it's final. Fix only genuine typos if CLI spots one, and flag it rather than silently rewording anything substantive.
- Any new interactivity, API calls, or data fetching — this page is entirely static content, unlike the Portfolio page's live Salesforce demo.

## Decisions

- **Section order: `ORIGIN_STORY` → `PROBLEMS_FARPOST_SOLVES` → `BUILDING_LIFECYCLE_EXAMPLE` → `PROCESS`.** Origin story first was Robin's explicit instruction (it's the hook). The other three are Chat's judgment: the problems section expands on what the origin story introduces, the lifecycle example makes those problems concrete with a worked case, and the process section closes on engineering discipline — mirroring how the Portfolio page's Salesforce case study closes on architecture rationale after establishing what/why. Adjustable if it reads wrong once assembled; not a hard requirement.
- **First-person voice for this page, contrasting the resume's third person.** Deliberate — this is the one place on the site written as Robin actually speaking, per the original lightbulb's own instruction. Don't rewrite it back into third person.
- **`BUILDING_LIFECYCLE_EXAMPLE` reuses the existing timeline visual pattern**, not a new component. Look at how `RelationshipView.tsx` renders status-history entries (dated, chronological, `›`-prefixed) and match that shape rather than building something new from scratch.
- **No design.md-level technical decisions beyond layout/styling** — this really is just copy plus presentation.

## Risks / Trade-offs

- [The "seven of eight" TapLog feature-overlap detail was left out of the final `ORIGIN_STORY` copy since Robin couldn't confirm the exact number tonight] → copy uses softer phrasing ("a striking number of features") instead; can be sharpened later if Robin confirms the number in his separate Farpost-focused session.
- [This is a lot of prose for one page — risk of feeling dense/wall-of-text] → each section already has clear `SectionHeader`-style breaks and the `PROBLEMS_FARPOST_SOLVES` section uses bolded sub-headings within it, matching how the Salesforce case study handles similarly dense content.

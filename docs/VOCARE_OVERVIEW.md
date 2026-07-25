# Vocare — Project Overview

*Written 2026-07-24 as a standalone summary to carry into the `robinsamways` project, so Robin can read it there and merge it with other conversation threads. Source: `vocare-project-specification.md`, `BUILD_LOG.md`, `CLAUDE.md`, `HANDOFF.md`, `FIXLIST.md`, and the OpenSpec capability specs.*

---

## What Vocare is

Vocare is an AI-conversational career/interview practice app, sold as a **$29 one-time lifetime fee** (not a subscription), with an optional, strictly consent-gated data layer sitting behind it as a possible future second business line.

The spec states its own founding thesis directly:

> "People are being screened out of jobs by AI interviewers optimizing for shallow, mechanical signals (syntax trivia, 'why A over B') instead of real signal (what someone has actually built, how they think about tradeoffs, how their work has evolved). Vocare is a cheap, unlimited-use practice tool where a person just talks — what they've done, what they're doing, what they want next — with no trivia and no scoring pressure in the moment. Feedback and any downstream value happen *after* the conversation, never during it."

Origin story: the project began the day Robin failed an AI-driven technical screening interview — not for lack of ability, but because the interview rewarded syntax recall over the architectural judgment that real experience builds. That gap is the literal seed of the idea.

Every named competitor (SmallTalk2Me, Bossed, Huru, Himalayas, LockedIn AI, My Interview Practice, Applicado) is subscription-priced (~$9/month). The one-time-fee model and the "no real-time judgment" rule are the two things the spec calls out as genuine differentiation.

## Who it serves

- **Primary framing:** people practicing for job interviews / career conversations. The spec explicitly notes this is *not* meant to be limited to people who are unemployed and job-hunting — it's designed to also serve employed people passively exploring roles, and people building an internal case for a promotion or skip-level move — though it flags that the current framing "reads as implicitly aimed at" the unemployed case without that being a deliberate constraint.
- **Floated-but-not-committed niches:** career changers, immigrants adapting to unfamiliar interview norms, return-to-work parents, and minors (16–17-year-olds applying for first jobs — real enough that there's a designed age gate, 13+ absolute floor per Anthropic's terms, 16+ recommended).

## How it works, end to end

1. **Sign up** — passwordless magic-link email, date-of-birth (age gate) and country (for crisis-resource localization) captured at signup.
2. **Free trial** — 3 free sessions, decremented on *completion*, not start, before the $29 paywall.
3. **Have a conversation** — open-ended, non-technical, past/present/future framing, text or voice, optionally anchored to a saved target role/job description. Topic-seed chips, a qualitative time expectation, and redirect agency give the user control — none of which can suppress the independent, live, per-turn crisis-safety check running throughout.
4. **Session ends** → full transcript stored (`transcript_turns`).
5. **Async mining pass** (never during the live conversation) extracts structured signal: ownership language, tradeoff reasoning, tech mentions, clarity, sentiment, growth notes, quantified-impact quotes, and (if anchored) audience-keyword matches plus a topic-relevance score that doubles as abuse detection.
6. **Coaching feedback** is generated deterministically from the mining result — template-based, no second LLM call, plain-language, quote-grounded, **never a numeric score**.
7. **Progress over time** — users can reread any past session/feedback and see qualitative trend indicators (improving *and* declining, never silent on decline), and manage "anchors" (goals) with a revisable history.
8. **Optional future data layer** (not built yet) — Tier 1 (opt-in public "here I am" profile), Tier 2a (self-tagged aggregate), Tier 2b (mined, anonymized aggregate) — all consent-gated, never joinable back to identity in any sellable form.
9. **Eventual Phase 2** — an employer-facing surface querying this data. Design is explicitly unresolved (see "Open questions" below).

## Module map (M0–M11)

| Module | What it does | Status |
|---|---|---|
| M0 | Repo/scaffold, CI, Railway + Vercel deploy | **Built**, live since 2026-07-21 |
| M1 | Magic-link auth, $29 Stripe paywall, 3-free-session gate, fair-use velocity cap, age/country capture | **Built**, live (Stripe still in test mode) |
| M2 | Core conversation engine — question arc, adaptive follow-up, anchor steering, crisis-safety net, personas | **Built**, live |
| M2.1 | App navigation shell (Conversation / Feedback / Progress & Anchors / Profile tabs) | **Built**, live |
| M3 | Voice capture (Web Speech API / Expo speech recognition, typed fallback) | **Built**, live — one real-device re-verification still owed (see `FIXLIST.md`) |
| M4 | Async post-session mining pipeline | **Built**, live |
| M5 | Coaching feedback generation | **Built**, live |
| M6 | Progress over time — session history, trend indicators, anchor CRUD/archive/revisions | **In progress** (active OpenSpec change `m6-progress-over-time`) |
| M7 | Anonymization / Tier 2b aggregate pipeline | **Planned**, not started |
| M8 | Tier 2a self-tagged aggregate | **Planned**, not started |
| M9 | Tier 1 opt-in public profiles | **Planned**, not started |
| M10 | Android packaging (Expo shell, Play Store) | **Planned** — not conditional on anything else, can happen any time |
| M11 | Employer-facing surface (actual second revenue line) | **Planned**, deliberately last, gated behind proven consumer demand and unresolved design questions |

## Most vital / load-bearing components

These are the pieces the spec itself calls out as structural — remove one and the product either stops working or stops being *this* product:

- **The no-real-time-judgment conversation engine (M2/M3)** — no scores, grades, or evaluative language ever surface mid-session. Called "the entire point of differentiation" from subscription competitors.
- **The crisis-safety net** — a live, per-turn, synchronous check independent of the async mining pipeline, built because an open-ended "talk about your career" format is *more* likely to surface real distress than a scripted chatbot.
- **Server-side, un-spoofable entitlement checks (M1)** — every session start re-verifies against the server, never a client-cached flag. The security boundary protecting the $29 revenue model.
- **The privacy/consent-tier architecture (Tier 1/2a/2b)** — explicitly called "load-bearing, not a checklist item." Aggregate data must never be joinable back to `users` in a sellable export.
- **The async, post-session mining pipeline (M4)** — the sole feed for coaching feedback, progress trends, and abuse detection, deliberately decoupled in timing from the live conversation to protect the judgment-free promise.
- **Anchors (private goal-tracking)** — never leaks into public/sold tiers; M9 has an explicit guardrail against auto-populating public profiles from private anchor data.
- **The fair-use velocity cap** — keeps "$29 lifetime unlimited" from repeating the AAirpass failure mode (a real historical unlimited-lifetime-offer disaster the spec cites by name).

## ⚠️ Open item to raise with Robin: what should Vocare eventually *be*?

The spec itself treats the long-term shape of the product as unresolved — this is distinct from the build, which is well-specified and mostly executed through M5/M6. Specifically still open, per the spec's own Parking Lot and M11 notes:

- Whether Vocare repositions from "mock interview practice" to a broader **"career conversations"** category (raises, pivots, promotions, return-to-work) — parked pending real alpha usage data.
- Who the target user really is — the current framing leans toward "job-hunting from unemployment" without that being a deliberate choice; employed/passive and internal-promotion users are floated but unvalidated.
- **M11 (employer-facing side) is a full open identity question, not an implementation detail.** Direct quote from the spec: *"Directed sessions are a real identity shift for the product, not just a new feature... does the no-score/not-judged framing still hold for a session a company requested and will read?"* No answer exists yet for agent-to-agent trust/fraud, what signal an employer's AI would actually see, or whether a company ever receives a raw transcript.
- Whether the business model stays single ($29 one-time) or gains a subscription/pay-per-session tier — floated, not evaluated.
- A referral program — floated, undecided.

**Reminder:** bring a definition of what you want Vocare to *eventually* be into the next conversation — the build has outpaced a settled answer to that question, and M9/M11 (half the product's dual-revenue identity) are sitting on top of it unresolved.

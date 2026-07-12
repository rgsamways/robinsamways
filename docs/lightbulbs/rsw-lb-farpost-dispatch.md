# rsw-lb-farpost-dispatch

**Slug:** rsw-lb-farpost-dispatch
**Date logged:** 2026-07-10
**Status:** unscoped — idea captured, licensing researched 2026-07-11, not yet spec'd. **Next session: start here.**
**Related:** `/farpost` (the origin story this directly echoes; `/farpost/farpost-dispatch` already has a placeholder page from `farpost-hub-nav-restructure`), `/techstacks/credential-flow` (being renamed "Salesforce Client Credentials Flow" specifically to leave room for this piece and `rsw-lb-azure-client-credentials-flow.md` — see Open Questions below, one is now resolved), `rsw-lb-farpost-atlas.md` (logged alongside this one)

## The gap

Credential Flow proves real Salesforce OAuth/API-integration mechanics, but it's only thematically parallel to Farpost — a loan-application object model, not something modeling a problem Farpost genuinely has. There's no Salesforce piece yet that's directly portable to farpost.ca the way Pulse and Atlas are, and no piece yet demonstrating building *inside* Salesforce (Experience Cloud, a portal a real user logs into) rather than calling it from the outside.

## The idea

**Farpost Dispatch** — a Salesforce-built partner network for matching field professionals (contractors, inspectors) to jobs across rural coverage areas. Professionals register through a self-service Experience Cloud portal, list their service region and certifications, and see/claim available jobs; Farpost's ops side manages the whole pipeline natively in Salesforce.

This is a direct callback to Farpost's actual founding story, already written on the real `/farpost` page: an insurance adjuster couldn't find anyone to work a rural claim — no contractor, no inspector willing to make the drive out. That's a professional-network/matching problem, and it's exactly what Salesforce Experience Cloud is built for. Unlike Credential Flow's loan-app model, Dispatch would be modeling a problem Farpost genuinely has, not one merely structurally similar to it.

## Why it matters beyond convenience

- Proves a distinct, complementary Salesforce competency from Credential Flow — building a user-facing portal inside Salesforce, not just API-level integration via OAuth from outside it.
- The narrative writes itself because it's true, not constructed: the exact same problem that founded Farpost, solved with the exact tool built for solving it. An interviewer reading both `/farpost` and this piece back to back gets a coherent story, not two unrelated demos.
- Directly portable — a real partner-matching pipeline is closer to something Farpost could actually run on than Credential Flow's demo loan system ever was.

## Research findings (2026-07-11)

Real open question from the original capture — Experience Cloud licensing on a free Developer Edition org — got a first research pass. Summary, sourced from Salesforce's own licensing docs plus developer-community sources (not all independently confirmed against a primary Salesforce doc — flagged below where that matters):

- **Building the site itself is free.** Enabling Digital Experiences and building pages in Experience Builder requires no paid license — up to 100 sites per org, Developer Edition included. [Learn More About Experience Cloud Licenses](https://help.salesforce.com/s/articleView?id=experience.exp_cloud_plan_licenses.htm&language=en_US&type=5), [Salesforce Experience Cloud – Build Free Public site (Arrify)](https://arrify.com/salesforce-experience-cloud/)
- **Real external-user login is normally paid.** Customer Community ($2/login or $5/member/month), Customer Community Plus ($6/$15), Partner Community ($10/$25) — per [Arrify's Experience Cloud licensing breakdown](https://arrify.com/salesforce-experience-cloud/). No genuinely free tier for authenticated external members at production pricing.
- **But Developer Edition orgs commonly ship with a small free allotment — commonly cited as 10 of each Community license type** — enough for a portfolio demo seeding a handful of fictional field professionals, the same pattern Credential Flow already uses for its seed data. This figure came from a developer-community forum summary, not confirmed against a primary Salesforce doc in this pass — **verify directly in Robin's own org (Setup → Company Information → User Licenses) before committing scope to real member login.**
- **Free fallback if that verification comes back short:** the Guest User license (unauthenticated public access) is always free with no login wall. Dispatch could be scoped as a public coverage-area/job board (Experience Builder pages, Flow automation, maybe Apex) without individual professional logins — a real but different pitch than "professionals self-register," still proves building *inside* Salesforce rather than integrating with it from outside.

## Open questions

- **Object model** — is "matching" itself the interesting technical piece (AI-assisted recommendation, similar in spirit to Credential Flow's existing Anthropic-powered suggestion, but recommending a professional for a job instead of a next action)? Not yet scoped. **This is the real next decision.**
- ~~Does this replace or sit alongside Credential Flow?~~ **Resolved 2026-07-11:** they sit alongside each other in different sections — Credential Flow (being renamed "Salesforce Client Credentials Flow") stays under Tech/Stacks as the OAuth-integration piece; Dispatch lives under the Farpost hub as the "building inside Salesforce" piece. No merge, no retirement.
- Whether the free-tier Community-license count holds in Robin's actual org — see Research findings above, needs direct verification before scoping tasks.md around real member self-registration vs. the Guest User fallback.

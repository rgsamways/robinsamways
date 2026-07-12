# rsw-lb-farpost-dispatch

**Slug:** rsw-lb-farpost-dispatch
**Date logged:** 2026-07-10
**Status:** unscoped — idea captured, licensing fully confirmed in Robin's real org 2026-07-11 (Partner Community licenses available, no fallback needed), not yet spec'd. Only remaining blocker is the object-model decision. **Next session: start here.**
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
- **Confirmed 2026-07-11, directly in Robin's own org** (Setup → Company Information → User Licenses): the free allotment is real, but the commonly-cited "10 of each" figure doesn't hold exactly — actual counts are **Customer Community Login: 5 total / 0 used / 5 remaining**, and **Customer Portal Manager Custom: 10 total / 0 used / 10 remaining**, both Active with no expiration date shown. Either is enough for a portfolio demo seeding a handful of fictional field professionals, the same pattern Credential Flow already uses for its seed data. The free-tier licensing risk is now closed.
- **Confirmed 2026-07-11, full 26-item license list checked:** Partner Community licenses are also present and free — **Partner Community: 5/0/5**, **Partner Community Login: 5/0/5**, plus **Partner App Subscription: 2/0/2**, **Silver Partner: 4/0/4**, **Gold Partner: 6/0/6**, and **Customer Community Plus: 5/0/5** / **Customer Community Plus Login: 5/0/5** as further options. Dispatch can genuinely be framed as a partner portal (real contractors/inspectors as Salesforce "partners," not "customers") using real Partner Community licenses — the more accurate framing for the field-professional-network pitch, not a fallback or compromise.

## Open questions

- **Object model** — is "matching" itself the interesting technical piece (AI-assisted recommendation, similar in spirit to Credential Flow's existing Anthropic-powered suggestion, but recommending a professional for a job instead of a next action)? Not yet scoped. **This is the real next decision.**
- ~~Does this replace or sit alongside Credential Flow?~~ **Resolved 2026-07-11:** they sit alongside each other in different sections — Credential Flow (being renamed "Salesforce Client Credentials Flow") stays under Tech/Stacks as the OAuth-integration piece; Dispatch lives under the Farpost hub as the "building inside Salesforce" piece. No merge, no retirement.
- ~~Whether the free-tier Community-license count holds in Robin's actual org~~ **Resolved 2026-07-11:** confirmed directly — real, free, unused Partner Community, Partner Community Login, Customer Community, and Customer Community Plus licenses all present (5 each). Real member self-registration is scopeable, and Dispatch can use the more accurate Partner Community license family rather than a Customer Community fallback. Licensing is fully closed — see Research findings above.

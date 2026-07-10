# rsw-lb-farpost-dispatch

**Slug:** rsw-lb-farpost-dispatch
**Date logged:** 2026-07-10
**Status:** unscoped — idea captured, not yet spec'd
**Related:** `/farpost` (the origin story this directly echoes), `/narrative/credential-flow` (the existing, differently-scoped Salesforce piece), `rsw-lb-farpost-atlas.md` (logged alongside this one)

## The gap

Credential Flow proves real Salesforce OAuth/API-integration mechanics, but it's only thematically parallel to Farpost — a loan-application object model, not something modeling a problem Farpost genuinely has. There's no Salesforce piece yet that's directly portable to farpost.ca the way Pulse and Atlas are, and no piece yet demonstrating building *inside* Salesforce (Experience Cloud, a portal a real user logs into) rather than calling it from the outside.

## The idea

**Farpost Dispatch** — a Salesforce-built partner network for matching field professionals (contractors, inspectors) to jobs across rural coverage areas. Professionals register through a self-service Experience Cloud portal, list their service region and certifications, and see/claim available jobs; Farpost's ops side manages the whole pipeline natively in Salesforce.

This is a direct callback to Farpost's actual founding story, already written on the real `/farpost` page: an insurance adjuster couldn't find anyone to work a rural claim — no contractor, no inspector willing to make the drive out. That's a professional-network/matching problem, and it's exactly what Salesforce Experience Cloud is built for. Unlike Credential Flow's loan-app model, Dispatch would be modeling a problem Farpost genuinely has, not one merely structurally similar to it.

## Why it matters beyond convenience

- Proves a distinct, complementary Salesforce competency from Credential Flow — building a user-facing portal inside Salesforce, not just API-level integration via OAuth from outside it.
- The narrative writes itself because it's true, not constructed: the exact same problem that founded Farpost, solved with the exact tool built for solving it. An interviewer reading both `/farpost` and this piece back to back gets a coherent story, not two unrelated demos.
- Directly portable — a real partner-matching pipeline is closer to something Farpost could actually run on than Credential Flow's demo loan system ever was.

## Open questions

- Object model: is "matching" itself the interesting technical piece (AI-assisted recommendation, similar in spirit to Credential Flow's existing Anthropic-powered suggestion, but recommending a professional for a job instead of a next action)? Not yet scoped.
- Does this replace or sit alongside Credential Flow under Narrative — two Salesforce pieces on the same index, or does one eventually get retired/merged?
- Real Experience Cloud licensing/setup constraints (similar to the Financial Services Cloud/Agentforce licensing limitation already disclosed on Credential Flow) haven't been researched yet — worth checking what a free Developer Edition org actually permits before committing to the Experience Cloud angle specifically.

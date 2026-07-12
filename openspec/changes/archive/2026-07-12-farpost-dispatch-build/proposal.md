## Why

Every other Farpost-hub piece and Credential Flow prove Salesforce/AI skills from *outside* Salesforce — calling its REST API, or building a separate FastAPI/Azure/geo backend. Nothing yet proves building *inside* Salesforce itself: Experience Cloud, Apex, a real portal an external user logs into. `rsw-lb-farpost-dispatch` closes that gap with a direct callback to Farpost's own founding story (an adjuster who couldn't find anyone to work a rural claim) — a partner network matching field professionals to jobs across rural coverage areas, built natively in Salesforce.

Licensing was the open risk on this lightbulb; it's now closed. Robin confirmed directly in his own Developer Edition org (Setup → Company Information → User Licenses) that real, free, unused Partner Community licenses exist (5 Partner Community, 5 Partner Community Login, plus Customer Community/Plus and Customer Portal Manager Custom as further options) — no Guest User fallback needed.

**This is not a third rewrite of Farpost's real dispatch engine.** The actual farpost.ca product has a mature, live, twice-rebuilt dispatch system (`f13-dispatch-rebuild`, then `unify-claim-dispatch-on-work-request`) — a generalized `DispatchableRequest`/`work-request-dispatch` framework on MongoDB/FastAPI/Twilio, already explicitly designed for reuse across future request types. It needs nothing from this change and this change touches none of it. Farpost Dispatch (the portfolio piece) is a parallel, illustrative system on entirely separate infrastructure (Salesforce, not MongoDB), built to demonstrate a specific skill to an interviewer — same founding story for narrative color, zero code, data, or architecture sharing with the real product.

## What Changes

- A real Salesforce DX project, `pieces/farpost-dispatch-sf/`, deployed to Robin's Developer Edition org: custom fields on Contact (Service Region, Certifications, Availability, Rating) for Professionals under Partner Community licenses, a `Job__c` custom object, an Apex matching service that ranks eligible Professionals for a Job and calls Anthropic via a Named Credential for a natural-language recommendation (the same "explain the why" pattern Credential Flow established, but the callout now originates *from inside* Salesforce via Apex, not from Python calling in — a genuinely different, complementary skill), and a concurrency-safe claim service (professionals self-claim jobs, first-claim-wins).
- Two Experience Builder-facing Lightning Web Components: an ops-side recommendation panel on the Job record page, and a Partner Community portal page showing each Professional their own matching open jobs with a Claim action.
- Fictional seed data: professionals and jobs spanning multiple rural regions, certification types, and urgency levels, with genuine matching variation.
- Replaces the `/farpost/farpost-dispatch` placeholder on robinsamways.ca with a real case-study page (architecture, object model, the AI-matching mechanic, tech stack) — no live public embed or login link, since exposing a free-tier Salesforce org's login publicly risks abuse and governor-limit exhaustion. A `SetupGallery` of real configuration screenshots is a deferred, non-blocking follow-up once Robin has actually done the manual Salesforce configuration, same precedent as Farpost Pulse's and Farpost Atlas's own still-pending setup galleries.
- `docs/deployment-guide.md` gains a new Farpost Dispatch/Salesforce subsection under its existing "Portfolio piece deployments" part, documenting Robin's manual steps: installing the Salesforce CLI, authenticating to his org, deploying the DX project, creating the Experience Cloud site via the setup wizard, assigning Partner Community licenses, entering the real Anthropic API key into the Named Credential, and building the Experience Builder page layout.

## Capabilities

### New Capabilities
- `farpost-dispatch`: the full Salesforce-native app — custom objects/fields, the Apex matching and claim services, the Named Credential-based Anthropic callout, the two Lightning Web Components, seed data, and the robinsamways.ca case-study page.

### Modified Capabilities
- `farpost-page-content`: removes the "Dispatch renders as a placeholder page" requirement, replacing it with requirements for the real case-study page's required sections.

## Impact

- New package: `pieces/farpost-dispatch-sf/` (Salesforce DX project — Apex classes + tests, custom object/field metadata, permission set, Named/External Credential metadata, LWC bundles). Not part of `api/`'s shared Python dependency set or any existing deploy target — Apex is a different runtime than Python, satisfying the "Portfolio piece isolation" convention's runtime-difference trigger directly, same as Farpost Pulse's Node.js Azure Functions.
- Rewritten route: `web/src/app/farpost/farpost-dispatch/page.tsx` (placeholder → real case-study content, no new API calls — this page has no live backend widget).
- `openspec/specs/farpost-page-content/spec.md`: delta as described above.
- New: `openspec/specs/farpost-dispatch/spec.md`.
- `docs/deployment-guide.md` and `/ops/deploy` gain a new Farpost Dispatch/Salesforce subsection, kept in sync per `CLAUDE.md`.
- `docs/stack.md` gains new entries: Salesforce DX/Apex, Experience Cloud/Partner Community, Named Credentials, Salesforce CLI (`sf`).
- No change to `api/`, Credential Flow, Farpost Atlas, Farpost Pulse, Method, Sreditor, or the real farpost.ca product's own dispatch engine.
- **Genuinely different verification constraint from every prior piece**: there is no local Salesforce runtime. CLI can write correct Apex/metadata source and correct Apex test classes, but cannot deploy, run, or independently confirm any of it passes — that only happens once Robin installs the Salesforce CLI, authenticates to his real org, and deploys. This is closer to Farpost Pulse's Azure deployment split (Robin does the real cloud step) than to Atlas or `api/`, where CLI could run the full local test suite itself before handoff.

## Why

Robin already receives informal tech-help requests — people asking him computer and application-design questions — with no way to charge for it today, and every existing `/services` category ends in a manual "get in touch" contact flow with no payment collection anywhere on the site. This change makes that chargeable, is genuinely time-sensitive (Robin's own stated financial situation), and doubles as the first real, live implementation of the shared identity/billing design already written for Robin's other projects (`docs/core-user-model.md`, `docs/core-billing-model.md`) — proving it out in Python before it's built again in TypeScript for Farpost/Vocare. Per Robin's direct decision, this stays an **independent** implementation: its own accounts, its own database, following the same design shape as the other projects without sharing any runtime, session, or login with them.

## What Changes

- **Every** `/services` section may now show pricing information — a real reversal of the page's current "no section displays a price" rule, not a scoped exception for one section. Kept deliberately understated: subtle, shown at the point a payment is actually being asked for, never on the homepage. Fixed-scope categories (Troubleshooting & Questions, Hourly) show a real number; genuinely variable-scope categories (Platform, custom builds) may instead state plainly that pricing is quoted per project and disclosed before any payment is collected — still transparent, without pretending a bespoke platform build has one fixed price.
- Add a new **"Troubleshooting & Questions"** category: $12/year (marketed as "$1/month"), real Stripe Checkout subscribe button.
- Add a minimal **account system** to robinsamways.ca — passwordless, magic-link email sign-in, mirroring the exact pattern Vocare's real `better-auth` config already uses (no password field at all). This is the Python-native counterpart to `docs/core-user-model.md`'s Layer 0/1, built independently (no shared runtime with Farpost/Vocare, per Robin's decision), needed so a subscriber has a real identity to attach billing records and manage their own subscription against — not anonymous email-only records.
- Add a new Python/SQLModel billing module in `api/` implementing two patterns, ported conceptually (not code-shared) from `docs/core-billing-model.md`:
  - A recurring annual **Subscription** — the $12/year Troubleshooting & Questions plan.
  - A one-time postpaid **FulfillmentFee** — for the other five existing categories (Web Sites, Web Applications, Native Applications, Platform, Hourly, Field Documentation), invoiced per engagement after a quote is agreed and the work is delivered. This is the same conceptual shape Farpost's own per-job platform fee already uses — this change is meant to become the canonical reference the Farpost/Vocare rebuilds converge their own equivalent flows toward, not merely a same-shaped cousin. That convergence work happens in those projects' own repos/sessions, not here.
- Real Stripe integration: Checkout Session creation for the subscription, webhook handling for renewals (`invoice.paid`) and disputes, and a cancellation flow implementing the two-tier refund policy already decided: no refund past the first month of year one (any earlier exception is Robin's own manual, discretionary Stripe refund — not automated); from year two onward, mid-period cancellation triggers a cash refund proportional to unused days, computed against the amount actually charged (tax included), via an explicit refund call.
- Self-service subscription management (viewing status, canceling) via **Stripe's own Customer Portal** rather than custom account-management UI — chosen specifically because it's the lowest-friction option and can be the same mechanism on every project regardless of that project's own auth choice, per Robin's "least friction, same everywhere" instruction.
- Genuinely object-oriented Python class design (not a pile of routes) so the same shape extends cleanly to future billing and account patterns without rework.
- Explicitly **out of scope**: Terms of Service / refund-policy copy and GST/HST sole-proprietorship tax registration. Real prerequisites to public launch, not solved in code — tracked as launch blockers.

## Capabilities

### New Capabilities
- `account-auth`: passwordless magic-link email sign-in for robinsamways.ca — a new, independent account system, not shared with any other project.
- `services-billing`: the billing backend — `Subscription` and `FulfillmentFee` models, Stripe Checkout/webhook/Customer-Portal integration, cancellation and refund logic, built on `api/`'s existing Python/FastAPI/SQLModel/Postgres stack, attached to `account-auth`'s user identity.

### Modified Capabilities
- `services-page-content`: every section may now display pricing information (a full reversal of the existing "no section displays a price" rule, not a single-section carve-out), and the Troubleshooting & Questions section additionally gets a working subscribe control.

## Impact

- `api/`: new account-auth module (magic-link email sign-in) and new billing module (SQLModel models, Stripe client wiring, webhook route, Customer Portal integration) — first accounts and first payment-collecting code in this codebase.
- `web/src/app/services/page.tsx`: pricing information across all seven sections (subtle, contextual), plus real subscribe/checkout UI on Troubleshooting & Questions.
- New Stripe configuration: a real annual Price/Product, webhook secret, Customer Portal configuration, live-vs-test key discipline (same caution already established in Farpost's own equivalent change).
- `docs/core-user-model.md` / `docs/core-billing-model.md`: not modified by this change, but this change is their first real-world validation — and the reference other projects' equivalent flows are meant to converge toward.
- New non-code prerequisites before public launch: Terms of Service/refund-policy copy and a GST/HST sole-proprietorship registration decision — neither is implemented here, both are real blockers to flipping this on publicly.

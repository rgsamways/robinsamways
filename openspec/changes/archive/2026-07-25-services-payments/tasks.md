## 1. Account foundation (`account-auth`)

- [x] 1.1 Add `Account` (`id`, `email` unique, `created_at`) and `SignInToken` (`token`, `account_id`, `expires_at`, `used_at`) to `app/models.py`
- [x] 1.2 Create `app/accounts/` module: request-sign-in-link + verify-link service functions, using the existing `app/notify.py` send path
- [x] 1.3 Add the sign-in request and verify routes
- [x] 1.4 Add session handling (cookie or token) so a verified sign-in persists across requests
- [x] 1.5 Replace `/sign-in` and `SignInForm.tsx` wholesale — retire the stub's fake "isn't live yet" state, build new UI that calls the real request-sign-in-link route and shows a "check your email" confirmation
- [x] 1.6 Add the magic-link verify page/route (e.g. `/sign-in/verify`) that calls the verify-link backend route, establishes the session, and redirects the visitor into a signed-in state

## 2. Billing foundation

- [x] 2.1 Add `stripe` to `api/requirements.txt`, note it in `docs/stack.md` per the technology stack log convention
- [x] 2.2 Add `BillingRecord` (non-table SQLModel mixin: `id`, `account_id`, `stripe_customer_id`, `created_at`) to `app/models.py`
- [x] 2.3 Add `Subscription(BillingRecord, table=True)` — `interval`, `price_cents`, `status`, `period_number`, `current_period_start`, `current_period_end`, `period_charged_cents`, `canceled_at`, `stripe_subscription_id`
- [x] 2.4 Add `FulfillmentFee(BillingRecord, table=True)` — `subject_type`, `subject_description`, `fee_cents`, `stripe_invoice_id`, `paid_at`, `collected`
- [x] 2.5 Create `app/billing/` module: `gateway.py` (the `StripeGateway` class wrapping every raw Stripe SDK call — checkout session creation, subscription cancel, refund, Customer Portal session creation, invoice/customer lookups)

## 3. Subscription checkout and renewal

- [ ] 3.1 Create the real Stripe annual Price/Product for the $12/year Troubleshooting & Questions plan (test mode first) — **not done by CLI**: the only Stripe account reachable from this session's tools is "Vocare sandbox" (a different project's account, confirmed via `get_stripe_account_info`); creating a robinsamways.ca Product/Price there would violate `CLAUDE.md`'s Silo isolation convention. `StripeGateway` reads the Price id from `STRIPE_TROUBLESHOOTING_PRICE_ID` — Robin creates the real annual Price (`recurring.interval=year`, `unit_amount=1200`, `currency=cad`) in his own robinsamways.ca Stripe account (test mode) and sets that env var. Same pattern as other pieces' manual Dashboard/portal provisioning steps.
- [x] 3.2 Implement `SubscriptionService.start_checkout(account)` — creates/reuses a Stripe Customer, returns a Checkout Session URL, creating the `Account` first via `account-auth` if one doesn't already exist
- [x] 3.3 Add the `/billing/checkout-session` route calling `SubscriptionService.start_checkout`
- [x] 3.4 Implement the Stripe webhook route: `checkout.session.completed` creates the initial `Subscription` row (period 1) attached to the account
- [x] 3.5 Implement `invoice.paid` handling: increments `period_number`, updates `period_charged_cents`/`current_period_start`/`current_period_end` from the real invoice
- [x] 3.6 Implement `charge.dispute.created` handling: marks the affected `Subscription` inactive

## 4. Cancellation and refund policy

- [x] 4.1 Implement `SubscriptionService.cancel(subscription)`: period 1 → `cancel_at_period_end=True`, no refund logic
- [x] 4.2 Implement the period-2+ mid-cancellation path: immediate cancel, compute `period_charged_cents * (days_remaining / days_in_period)`, call `StripeGateway.refund(...)`
- [x] 4.3 Implement the Stripe Customer Portal session route for signed-in accounts to manage/cancel their own subscription

## 5. Fulfillment fees (the other five categories)

- [x] 5.1 Implement `FulfillmentFeeService.record_and_invoice(account, subject_type, subject_description, fee_cents)` — creates the row and sends a real Stripe invoice
- [x] 5.2 Decided (Robin, mid-implementation): a minimal internal route, `POST /billing/fulfillment-fee`, guarded by a shared-secret `x-admin-api-key` header (`ADMIN_API_KEY` env var) — no full admin auth system. Chosen over the Stripe-Dashboard-directly alternative because it keeps `FulfillmentFeeService` actually exercised by the app and keeps this app's own `FulfillmentFee` row from silently drifting out of sync with whatever Robin created by hand in Stripe.

## 6. Frontend — `/services` page

- [x] 6.1 Add the seventh "Troubleshooting & Questions" section to `web/src/app/services/page.tsx`, matching the existing section pattern
- [x] 6.2 Show the $12/year price and a working "Subscribe" control that calls the checkout-session endpoint and redirects to Stripe
- [x] 6.3 Add subtle, understated pricing information to the other six sections — a real number for Hourly ($125/hour, Robin's own averaged rate — see docs/issues.md handoff), "quoted per project, disclosed before payment" language for the variable-scope sections (Web Sites, Web Applications, Native Applications, Platform) — confirmed none of it appears on the homepage (homepage has no `/services` content at all)
- [x] 6.4 Add the new pill to the existing `SectionFilterBar` wiring — automatic: `SectionFilterBar` derives its pills directly from the `sections` array, so adding the 7th section object wires the pill with no separate change

## 7. Testing (representative, per this project's testing convention)

- [x] 7.1 pytest: `Account`/`SignInToken` lifecycle (request link, verify, expiry, reuse rejection) — `tests/test_accounts.py`, real (if lightweight) SQLite persistence, same precedent as `pieces/farpost-atlas-geo`'s suite
- [x] 7.2 pytest: `Subscription`/`FulfillmentFee` model round-trips — `tests/test_billing_models.py`
- [x] 7.3 pytest: cancellation refund math (period 1 → $0; period 2+ mid-period → correct proportional amount) as pure-function unit tests, independent of live Stripe calls — `tests/test_refund.py`
- [x] 7.4 pytest: webhook handlers against constructed Stripe event fixtures (checkout completed, invoice paid, dispute created) — mocked Stripe SDK (a `_FakeGateway`), no real network calls — `tests/test_billing_webhooks.py` (also covers both cancellation orchestration paths)
- [ ] 7.5 Manual Stripe test-mode checklist: full checkout → renewal (simulated) → both cancellation paths → Customer Portal session, run once against `sk_test_...` before this change is considered done — **not done by CLI**, same reason as 3.1: no real robinsamways.ca Stripe test keys are reachable from this session. Robin's own step once `STRIPE_SECRET_KEY`/`STRIPE_WEBHOOK_SECRET`/`STRIPE_TROUBLESHOOTING_PRICE_ID` are set.

## 8. Docs and process

- [ ] 8.1 Stripe product/price setup gets a `SetupGallery` (per `CLAUDE.md`'s "Setup galleries" convention) — real screenshots of the actual Stripe Dashboard configuration. **Deferred, not done by CLI**: same root cause as 3.1/7.5 — no real robinsamways.ca Stripe configuration exists yet to screenshot (only "Vocare sandbox" is reachable from this session, deliberately not used per Silo isolation). Non-blocking follow-up once Robin does the real setup, same precedent as Farpost Atlas's/Pulse's still-pending galleries — logged in `docs/issues.md`.
- [x] 8.2 Evaluate whether the cancellation/refund mechanism assembly (Stripe has no native feature for it) qualifies for a `docs/sreditor/` entry per that convention's technological-uncertainty bar — yes: `docs/sreditor/2026/2026-07-25-stripe-annual-subscription-refund-assembly.md`
- [x] 8.3 Run `scc` against `web/src`, `api`, and `pieces` and log the snapshot to `docs/metrics.md` and `web/src/data/metrics.json` at archive time — 222 files, DRYness flat at 58%
- [x] 8.4 Drift audit against this change's specs before archiving — every requirement/scenario in `account-auth`, `services-billing`, and `services-page-content` checked against the real implementation, all satisfied. `openspec validate services-payments --strict` passes. One pre-existing spec-text inconsistency found (not introduced by this implementation, not fixed by CLI — flagged for Robin): `services-page-content`'s "Services page renders six sections behind a pill filter bar" requirement title says "six" while its own body/scenarios consistently say "seven" (already listing Troubleshooting & Questions) — a title/body mismatch already present in the validated spec delta before implementation started.

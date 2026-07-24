## 1. Account foundation (`account-auth`)

- [ ] 1.1 Add `Account` (`id`, `email` unique, `created_at`) and `SignInToken` (`token`, `account_id`, `expires_at`, `used_at`) to `app/models.py`
- [ ] 1.2 Create `app/accounts/` module: request-sign-in-link + verify-link service functions, using the existing `app/notify.py` send path
- [ ] 1.3 Add the sign-in request and verify routes
- [ ] 1.4 Add session handling (cookie or token) so a verified sign-in persists across requests

## 2. Billing foundation

- [ ] 2.1 Add `stripe` to `api/requirements.txt`, note it in `docs/stack.md` per the technology stack log convention
- [ ] 2.2 Add `BillingRecord` (non-table SQLModel mixin: `id`, `account_id`, `stripe_customer_id`, `created_at`) to `app/models.py`
- [ ] 2.3 Add `Subscription(BillingRecord, table=True)` — `interval`, `price_cents`, `status`, `period_number`, `current_period_start`, `current_period_end`, `period_charged_cents`, `canceled_at`, `stripe_subscription_id`
- [ ] 2.4 Add `FulfillmentFee(BillingRecord, table=True)` — `subject_type`, `subject_description`, `fee_cents`, `stripe_invoice_id`, `paid_at`, `collected`
- [ ] 2.5 Create `app/billing/` module: `gateway.py` (the `StripeGateway` class wrapping every raw Stripe SDK call — checkout session creation, subscription cancel, refund, Customer Portal session creation, invoice/customer lookups)

## 3. Subscription checkout and renewal

- [ ] 3.1 Create the real Stripe annual Price/Product for the $12/year Troubleshooting & Questions plan (test mode first)
- [ ] 3.2 Implement `SubscriptionService.start_checkout(account)` — creates/reuses a Stripe Customer, returns a Checkout Session URL, creating the `Account` first via `account-auth` if one doesn't already exist
- [ ] 3.3 Add the `/billing/checkout-session` route calling `SubscriptionService.start_checkout`
- [ ] 3.4 Implement the Stripe webhook route: `checkout.session.completed` creates the initial `Subscription` row (period 1) attached to the account
- [ ] 3.5 Implement `invoice.paid` handling: increments `period_number`, updates `period_charged_cents`/`current_period_start`/`current_period_end` from the real invoice
- [ ] 3.6 Implement `charge.dispute.created` handling: marks the affected `Subscription` inactive

## 4. Cancellation and refund policy

- [ ] 4.1 Implement `SubscriptionService.cancel(subscription)`: period 1 → `cancel_at_period_end=True`, no refund logic
- [ ] 4.2 Implement the period-2+ mid-cancellation path: immediate cancel, compute `period_charged_cents * (days_remaining / days_in_period)`, call `StripeGateway.refund(...)`
- [ ] 4.3 Implement the Stripe Customer Portal session route for signed-in accounts to manage/cancel their own subscription

## 5. Fulfillment fees (the other five categories)

- [ ] 5.1 Implement `FulfillmentFeeService.record_and_invoice(account, subject_type, subject_description, fee_cents)` — creates the row and sends a real Stripe invoice
- [ ] 5.2 Decide and implement how Robin triggers this (minimal internal route/CLI vs. Stripe Dashboard directly for now — see design.md's open question)

## 6. Frontend — `/services` page

- [ ] 6.1 Add the seventh "Troubleshooting & Questions" section to `web/src/app/services/page.tsx`, matching the existing section pattern
- [ ] 6.2 Show the $12/year price and a working "Subscribe" control that calls the checkout-session endpoint and redirects to Stripe
- [ ] 6.3 Add subtle, understated pricing information to the other six sections — a real number for Hourly, "quoted per project, disclosed before payment" language for the variable-scope sections (Web Sites, Web Applications, Native Applications, Platform) — confirm none of it appears on the homepage
- [ ] 6.4 Add the new pill to the existing `SectionFilterBar` wiring

## 7. Testing (representative, per this project's testing convention)

- [ ] 7.1 pytest: `Account`/`SignInToken` lifecycle (request link, verify, expiry, reuse rejection)
- [ ] 7.2 pytest: `Subscription`/`FulfillmentFee` model round-trips
- [ ] 7.3 pytest: cancellation refund math (period 1 → $0; period 2+ mid-period → correct proportional amount) as pure-function unit tests, independent of live Stripe calls
- [ ] 7.4 pytest: webhook handlers against constructed Stripe event fixtures (checkout completed, invoice paid, dispute created) — mocked Stripe SDK, no real network calls
- [ ] 7.5 Manual Stripe test-mode checklist: full checkout → renewal (simulated) → both cancellation paths → Customer Portal session, run once against `sk_test_...` before this change is considered done

## 8. Docs and process

- [ ] 8.1 Stripe product/price setup gets a `SetupGallery` (per `CLAUDE.md`'s "Setup galleries" convention) — real screenshots of the actual Stripe Dashboard configuration
- [ ] 8.2 Evaluate whether the cancellation/refund mechanism assembly (Stripe has no native feature for it) qualifies for a `docs/sreditor/` entry per that convention's technological-uncertainty bar
- [ ] 8.3 Run `scc` against `web/src`, `api`, and `pieces` and log the snapshot to `docs/metrics.md` and `web/src/data/metrics.json` at archive time
- [ ] 8.4 Drift audit against this change's specs before archiving

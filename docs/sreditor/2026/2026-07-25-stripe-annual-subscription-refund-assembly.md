# Assembling a two-tier refund policy Stripe has no single feature for

**Date:** 2026-07-25
**Project change:** openspec/changes/services-payments
**Time invested (approx):** ~1 hour, within the larger billing-module build

## Technological uncertainty

Robin's cancellation policy for the $12/year Troubleshooting & Questions subscription is genuinely two-tiered: no refund at all in year one (past month one, which is a manual exception, not code), but a cash refund proportional to unused days from year two onward, computed against the amount actually charged (tax included), not the nominal list price. Stripe's Billing API has no single endpoint or flag for "refund unused days on a flat annual plan." It wasn't obvious going in exactly which Stripe primitives compose to deliver this correctly, or where the real API's object shapes would create edge cases the design doc's TypeScript sketch (`docs/core-billing-model.md`) hadn't anticipated, since that sketch was written before any of it touched a real Stripe SDK.

## Hypothesis / approach

Assemble the policy from four separate Stripe primitives: `Subscription.modify(cancel_at_period_end=True)` for year-1 cancellations, `Subscription.cancel()` + an explicit `Refund.create()` for year-2+ mid-period cancellations, and `checkout.session.completed`/`invoice.paid` webhooks to track `period_number` and the real charged amount over time. The refund math itself (`period_charged_cents * days_remaining / days_in_period`) was already fully specified in `docs/core-billing-model.md` — the uncertainty was entirely in the surrounding orchestration, not the arithmetic.

## Investigation

Two real gaps surfaced only once actual Stripe SDK shapes and a real test database were involved, not just reading API docs:

1. **Double-counting period 1.** Stripe fires `invoice.paid` for a *brand-new* subscription's very first invoice, not just for renewals — if the webhook handler blindly incremented `period_number` on every `invoice.paid`, period 1 (already recorded by `checkout.session.completed`) would double-count to period 2 on its own creation. Resolved by checking the invoice's `billing_reason` field: only `"subscription_cycle"` (a real renewal) increments; `"subscription_create"` is a no-op. This distinction isn't mentioned in `docs/core-billing-model.md`'s original TypeScript sketch at all — it only exists because of how Stripe's real event sequencing behaves.

2. **No charge id on `Subscription`.** The refund call needs "the current period's charge id" (per design.md's own D5 step 4), but neither the app's own schema nor Stripe's `Subscription` object carries one directly. Rather than adding a speculative `stripe_charge_id` column no task explicitly called for, resolved by fetching the subscription's most recent `Invoice` at cancel time (`Invoice.list(subscription=..., limit=1)`) and reading its `charge` field — sourced fresh from Stripe at the moment of cancellation rather than a possibly-stale stored value.

A third, unrelated-seeming issue surfaced while writing this module's first real database-backed pytest tests (not mocked at the session boundary, unlike this codebase's existing contact/feedback tests) — worth recording here since it was found through the same investigation, not planned in advance: `app/db.py` built its session via plain SQLAlchemy `AsyncSession`, which has no `.exec()` method — that's a SQLModel-only addition. Every `select()`-based query this change introduced would have raised `AttributeError` in production the first time it ran, never caught by any existing test since no prior code in this codebase ever queried the database at all (`contact.py`/`feedback.py` only ever call `.add()`+`.commit()`). Fixed by swapping `app/db.py` to SQLModel's own `AsyncSession` subclass. A related, second-order finding from the same test run: SQLite (this suite's real-but-lightweight test backend) silently drops timezone awareness on `DateTime(timezone=True)` columns on read-back, unlike production's real Postgres/asyncpg — comparisons like `expires_at < now` raised `TypeError: can't subtract offset-naive and offset-aware datetimes` under the test backend even though the same code is correct against Postgres. Fixed with a small `_as_utc()` normalizer at each comparison site, treating a naive value as already-UTC (consistent with this codebase's universal UTC convention).

## Outcome

All four Stripe primitives compose correctly once the `billing_reason` distinction and the charge-id lookup were in place; verified with `pytest` webhook-fixture tests (`tests/test_billing_webhooks.py`) against a `_FakeGateway` standing in for the real Stripe SDK, including the double-counting scenario and both cancellation paths. The `.exec()`/timezone issues were real latent bugs, not test artifacts — caught only because this change's tests were the first in this codebase to actually exercise a `select()` query against the database, rather than mocking persistence entirely.

## Knowledge gained

Stripe's own event model (`billing_reason` on invoices) is the actual source of truth for "is this a fresh subscription or a renewal," not something inferable from the app's own state alone — any future subscription-billing work in this codebase (or the Farpost/Vocare TypeScript equivalents this change is meant to be a reference for) should check `billing_reason` rather than assuming `invoice.paid` only ever means "renewal." Separately: this codebase's own persistence layer (`app/db.py`) was never actually exercised by a real query before this change — worth remembering that "the tests pass" said nothing about query correctness until a change actually needed one, and that SQLite vs. Postgres timezone handling is a real, silent divergence to normalize against defensively rather than assume away.

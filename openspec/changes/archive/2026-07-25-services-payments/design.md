## Context

`api/` has no user accounts, login, or auth system today — `ContactSubmission`/`FeedbackSubmission` are anonymous, single-write records (see `app/models.py`). This change adds the first accounts and the first payment-collecting code in the codebase. It's also the first real, live implementation of the shared identity/billing design written for Robin's other projects (`docs/core-user-model.md`, `docs/core-billing-model.md`) — built here in Python/SQLModel, deliberately **independent**: Robin's explicit decision is that each project (robinsamways.ca, Farpost, Vocare) runs its own separate accounts and login, following the same design shape, sharing no runtime, session, or database with any other project.

## Goals / Non-Goals

**Goals:**
- A minimal, real account system (`account-auth`) so a subscriber has an actual identity to attach billing records to.
- A working $12/year Stripe subscription for the new Troubleshooting & Questions service, with the two-tier cancellation/refund policy already decided in `docs/core-billing-model.md`.
- A `FulfillmentFee` record type for the other five `/services` categories, invoiced per engagement after delivery.
- Genuinely object-oriented Python: a shared base shape, isolated Stripe integration, and clean extension points for future billing and account patterns.
- Validate the abstract design in `docs/core-user-model.md`/`docs/core-billing-model.md` against real, live code before it's built again in TypeScript — and become the reference those projects' equivalent flows converge toward.

**Non-Goals:**
- No shared runtime, session, or database with Farpost's or Vocare's own accounts — same design shape, independently implemented, per Robin's explicit decision.
- No password-based login — magic-link email only, mirroring Vocare's real `better-auth` configuration.
- No public *fixed* pricing for genuinely variable-scope work (Platform, custom builds) — those sections state that pricing is quoted per project and disclosed before payment, rather than showing one number for work that doesn't have one.
- No Terms of Service, refund-policy copy, or GST/HST registration handling — real prerequisites to public launch, tracked separately, not solved here.
- No literal code-sharing with Farpost's/Vocare's future TypeScript billing package — this validates the same *design*, in a different language, by choice.

## Decisions

**D1 — A minimal `Account` model backs both auth and billing.** `id`, `email` (unique), `created_at` — deliberately thin. No password field exists anywhere in the schema.

**D2 — Magic-link sign-in via a short-lived, single-use token table.** A `SignInToken` (`token`, `account_id`, `expires_at`, `used_at`) is created and emailed on request; following it exchanges the token for a session, then marks it used. No new dependency required beyond the email-sending path this codebase already has (`app/notify.py`) — this mirrors Vocare's real magic-link flow conceptually without needing `better-auth` itself, which is Node-only.

**D3 — Billing records attach to `account_id`, not a bare email string.** `docs/core-billing-model.md`'s TypeScript sketches attach rows to `userId` directly (after dropping the earlier `User`/`Membership` polymorphism); this is the direct Python equivalent now that `account-auth` exists. A non-table `BillingRecord(SQLModel)` mixin holds the shared fields (`id`, `account_id`, `stripe_customer_id`, `created_at`); `Subscription` and `FulfillmentFee` both inherit from it and add `table=True`. This is the "object-oriented, easy to extend" structure Robin asked for: a third billing pattern later is a new subclass of `BillingRecord`, not a new copy-pasted table.

**D4 — All raw Stripe SDK calls live behind one `StripeGateway` class.** Matches this codebase's existing isolated-module convention (`app/salesforce.py`, `app/ai.py` — one file per external integration, no shared state). Every service class depends on `StripeGateway`, never the `stripe` SDK directly — so upgrading Stripe API versions or swapping test/live keys touches one class, not every call site.

**D5 — The real cancellation/refund mechanism, ported directly from `docs/core-billing-model.md`.** Stripe has no single feature for "refund unused days on a flat annual plan" — this is assembled:
1. Signup creates a Stripe annual Price (`recurring.interval = "year"`, `unit_amount = 1200`) and Subscription. Stripe auto-charges $12 and auto-renews yearly on its own.
2. The `invoice.paid` webhook increments `period_number` and updates `period_charged_cents`/`current_period_start`/`current_period_end` from the real invoice — never assumed equal to the list price, so the refund basis stays tax-correct.
3. Canceling in period 1: `cancel_at_period_end=True`. No refund logic runs; access continues through the paid period, then lapses. Any earlier exception ("crazy life-changing moment") is Robin's own manual Stripe Dashboard refund — deliberately not a code path.
4. Canceling in period 2+, mid-period: cancel immediately, compute the refund as `period_charged_cents * (days_remaining / days_in_period)`, then call `StripeGateway.refund(charge_id, amount_cents)` explicitly.

**D6 — Self-service subscription management via Stripe's Customer Portal, decided (no longer open).** A signed-in account can request a Customer Portal session, scoped to their own Stripe customer record — Stripe itself handles the actual cancel/view-status UI. Chosen specifically because it's the lowest-friction option and can be the *same* mechanism regardless of what auth approach any other project uses, per Robin's "least friction, same everywhere" instruction — this doesn't depend on `account-auth`'s specific shape at all, only on knowing which Stripe customer belongs to the signed-in account.

**D7 — `FulfillmentFee` has no public checkout flow.** Unlike `Subscription`, there's no Stripe Checkout Session for this — it's created by Robin (an operator action, matching Farpost's own F22 pattern where the operator approves and the fee invoice fires) once a quote is agreed and work is delivered, then Stripe sends a real invoice to the client's email.

## Risks / Trade-offs

**[Live Stripe keys]** → Same discipline as Farpost's own F22 change: develop and test exclusively against `sk_test_...` keys; a documented test checklist runs before any live key is ever used in this codebase.

**[Magic-link email delivery failure locks a user out]** → Use the existing, already-proven `app/notify.py` send path rather than a new one; log delivery failures for manual follow-up (this site has no support-ticket system, so Robin is the fallback).

**[Legal/tax exposure]** → Real, not mitigated in code. Flagged in the proposal as an explicit launch blocker, not attempted here.

## Migration Plan

No existing data to migrate — this is wholly new functionality. Deploy behind `sk_test_...` keys first, run the test checklist, then switch to live keys as a config-only change (same pattern as Farpost's F22).

## Open Questions

- Whether `FulfillmentFee` creation gets a minimal internal admin route/CLI command in this change, or is set up directly in the Stripe Dashboard for now and formalized later once real usage patterns are known.

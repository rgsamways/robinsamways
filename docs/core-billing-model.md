# Core billing model — subscriptions and one-time purchases across siloes

**What this file is:** a portable design document, same convention as `docs/core-user-model.md` and `docs/design-system-handoff.md`.

**Deliberately simple, per Robin:** billing attaches directly to `userId`, full stop — not `User`-or-`Membership` polymorphism. An earlier draft of this doc scoped Farpost's $12/year to a professional `Membership` specifically, to avoid contradicting Farpost's own documented "base platform stays free forever" strategy. Robin overrode that directly: Farpost is being rebuilt from scratch, and any existing stated philosophy that contradicts the new pricing gets dropped, not preserved. Every project charges the same $12/year on signup, uniformly, on the account itself — no role-scoping, no exceptions.

**Grounded in real code**, same discipline as the User model: `c:\dev\vocare\backend\src\billing\` and `c:\dev\farpost\farpost-api` (the live `F22` platform-fee change) and `docs/lightbulbs/farpost-lb-payment-models.md`.

---

## What's real today

- **Vocare**: one-time lifetime unlock. Stripe Checkout `mode: "payment"`, a single purchase flips `user.entitlementStatus` to `"paid"` forever (reversed only on `charge.dispute.created`). Not a subscription.
- **Farpost**: a live per-job platform fee. One Stripe *invoice* per approved job, a `Payment` subdocument (`platform_fee_cents`, `platform_fee_invoice_id`, `platform_fee_paid_at`, `platform_fee_collected`) on the job/claim record, fee disclosed at job creation, confirmed at approval.
- **Farpost's own unbuilt lightbulb** (`farpost-lb-payment-models.md`, 2026-07-01) already named two more shapes for professional-facing revenue: flat monthly subscription tiers, and a **token/credit bucket** ("buy 50 tokens/$20, spend per claim") — independently arriving at the same shape as Robin's Vocare "session packs" idea. That lightbulb's own conclusion: "ship per-transaction (already live), design the schema to support all four, add subscription when a firm asks... the expensive piece is the data model, not the billing UI" — this doc is that data model.

**Neither project has a recurring subscription implemented anywhere.** Robin's $1/mo-or-$12/year proposal is genuinely new, not a reconciliation of existing code.

---

## Pattern 1 — Subscription (recurring)

Attaches directly to `userId` — the same $12/year plan applies uniformly to every account in every project, no role-scoping.

```ts
// @rsw/core-billing/src/subscription.ts
import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";

export function subscriptionTable(tableName: string) {
  return pgTable(tableName, {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(), // matches better-auth's user.id
    interval: text("interval", { enum: ["monthly", "annual"] }).notNull(),
    priceCents: integer("price_cents").notNull(), // the nominal/list price — see periodChargedCents below for what was actually collected
    status: text("status", { enum: ["active", "canceled", "past_due"] })
      .notNull()
      .default("active"),
    // Which billed period this is — 1 for the original signup year, 2+ for
    // each successful renewal. Incremented by the `invoice.paid` webhook.
    // This is the field the whole cancellation-refund policy hinges on.
    periodNumber: integer("period_number").notNull().default(1),
    currentPeriodStart: timestamp("current_period_start").notNull(),
    currentPeriodEnd: timestamp("current_period_end").notNull(),
    // The real amount Stripe actually collected for the current period,
    // tax included — the refund basis, not the nominal `priceCents`. Pulled
    // from the invoice/charge, not assumed equal to the list price.
    periodChargedCents: integer("period_charged_cents").notNull(),
    canceledAt: timestamp("canceled_at"),
    stripeSubscriptionId: text("stripe_subscription_id"),
    stripeCustomerId: text("stripe_customer_id"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  });
}

// Robin's actual policy, confirmed: year 1 is non-refundable past the first
// month (any exception in that first month is Robin's own manual,
// discretionary call via the Stripe dashboard/API — not something this
// function or any automated rule handles). From the first renewal onward,
// canceling mid-period refunds the unused days, computed as a fraction of
// what was actually charged (tax included) rather than the nominal price —
// this sidesteps the pre-tax/post-tax question entirely, since refunding a
// proportional share of the real charged total is correct either way.
export function computeCancellationRefundCents(params: {
  periodNumber: number;
  periodChargedCents: number;
  periodStart: Date;
  cancelDate: Date;
  daysInPeriod?: number; // default 365
}): number {
  if (params.periodNumber <= 1) return 0;
  const daysInPeriod = params.daysInPeriod ?? 365;
  const daysUsed = Math.floor(
    (params.cancelDate.getTime() - params.periodStart.getTime()) / 86_400_000,
  );
  const daysRemaining = Math.max(daysInPeriod - daysUsed, 0);
  return Math.round(params.periodChargedCents * (daysRemaining / daysInPeriod));
}
```

**The real Stripe mechanism — resolved, not just schema.** "$1/month" is marketing framing, not a literal monthly charge — this is one $12 charge per year. Stripe doesn't have a single feature flag for "refund unused days on a flat annual plan"; the flow is assembled from a few standard primitives:

1. **Signup:** create a Stripe Product + Price (`recurring: { interval: "year" }`, `unit_amount: 1200`) and a Subscription against it. Stripe charges $12 immediately and will auto-renew every 365 days on its own.
2. **Each successful renewal:** the `invoice.paid` webhook increments `periodNumber` and updates `periodChargedCents`/`currentPeriodStart`/`currentPeriodEnd` from the real invoice — not assumed.
3. **Cancellation in period 1 (year one):** don't cut access immediately — call Stripe's `cancel_at_period_end: true`. They keep what they already paid for through the full year; it simply doesn't renew. No refund logic runs. Any "crazy life-changing moment" exception in month one is Robin manually issuing a Stripe refund himself — deliberately not an automated code path.
4. **Cancellation in period 2+ (a renewal year), mid-period:** cancel immediately (`stripe.subscriptions.cancel`), compute the refund via `computeCancellationRefundCents`, then explicitly call `stripe.refunds.create({ charge: <the current period's charge id>, amount: refundCents })`. Stripe does not do this automatically — this is genuinely assembled, not a native feature.

**Freemium boundaries are not part of this schema.** Whether "free" means "3 sessions then hard paywall" (Vocare) or "basic usage forever" (Farpost) is domain logic each project enforces itself by checking subscription/entitlement status — the shared package just tracks *whether* someone's paid, not what free vs. paid means functionally in that project.

---

## Pattern 2 — one-time purchases (two shapes, opposite payment timing)

### 2a. Postpaid fulfillment fee — generalizes Farpost's live `F22` pattern

Money collected *after* the value is delivered, tied to a specific action's completion.

```ts
export function fulfillmentFeeTable(tableName: string) {
  return pgTable(tableName, {
    id: text("id").primaryKey(),
    subjectType: text("subject_type").notNull(), // project-defined: "job", "claim", "dispatch", ...
    subjectId: text("subject_id").notNull(),
    payerId: text("payer_id").notNull(), // the requestor's user.id
    feeCents: integer("fee_cents").notNull(),
    stripeInvoiceId: text("stripe_invoice_id"),
    paidAt: timestamp("paid_at"),
    collected: boolean("collected").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  });
}
```

This is close to a direct lift of Farpost's real `Payment` subdocument shape, generalized past "job" to any `subjectType` — Farpost's dispatch-a-claim-to-a-contractor example maps directly (`subjectType: "claim"`).

### 2b. Prepaid credit pack — Vocare's "session packs" and Farpost's own "tokens" idea, same shape

Money collected *before* consumption; a balance draws down over time.

```ts
export function creditPackTable(tableName: string) {
  return pgTable(tableName, {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    sku: text("sku").notNull(), // project-defined, e.g. "interview-prep-5-pack", "claim-tokens-50"
    unitsPurchased: integer("units_purchased").notNull(),
    unitsRemaining: integer("units_remaining").notNull(),
    priceCents: integer("price_cents").notNull(),
    stripePaymentIntentId: text("stripe_payment_intent_id"),
    purchasedAt: timestamp("purchased_at").notNull().defaultNow(),
  });
}

// A ledger, not just a decrementing counter — Farpost's own lightbulb
// specifically wanted "visibility as balance draws down, no surprise
// invoices." An audit trail delivers that; a bare counter doesn't.
export function creditPackConsumptionTable(tableName: string) {
  return pgTable(tableName, {
    id: text("id").primaryKey(),
    packId: text("pack_id").notNull(), // references creditPackTable.id
    unitsConsumed: integer("units_consumed").notNull().default(1),
    context: jsonb("context").$type<Record<string, unknown>>(), // e.g. { sessionId }
    consumedAt: timestamp("consumed_at").notNull().defaultNow(),
  });
}
```

Vocare's session pack (`sku: "interview-prep-5-pack"`, consumption logged per practice session) and Farpost's professional token bucket (`sku: "claim-tokens-50"`, consumption logged per claim/calculation) are the *same table*, different `sku` values and different `context` payloads — this is the strongest evidence in this whole doc that the abstraction is real rather than invented, since two separate projects reached for it independently before this design existed.

---

## How this connects to `core-user-model.md`'s open Entitlement question

That doc flagged Farpost's future per-role paid tiers as "Layer 2-adjacent, undesigned." Now moot — entitlement is simply per-`userId`: an entitlement check is a *derived* question — "does this user have an active row in `subscriptionTable` (Pattern 1), or a `creditPackTable` row with `unitsRemaining > 0` for the relevant `sku` (Pattern 2b)?" — not a separate stored field, and not scoped through `Membership` at all. Vocare's current single `entitlementStatus` flag on `User` is a degenerate case of exactly this.

---

## Resolutions from Robin, 2026-07-24

**Vocare migrates to the $12/year plan, replacing its lifetime-unlock entirely** — not coexisting. Worth remembering Vocare's actual pricing history here since it's a real, honest iteration story: one-time $10 lifetime → one-time $29 lifetime → now $12/year. Robin's own read: the recurring low-entry-price model should bring in more users faster than either lifetime price point did. (Logged as a Dev Log candidate — see `rsw-lb-index.md`.)

**Farpost's planned multi-tier professional subscriptions are dropped.** Robin's question back: "I think it's much simpler to just get the user going cheaply for year one in any of my projects, and find more revenue through the one-time action/events. What say you?" Agreed.

**Correction — the Membership-scoping compromise above is overridden, not kept.** My first pass tried to preserve Farpost's documented "base platform stays free forever" strategy (`farpost-revenue-by-role.md`) by scoping the $12/year to a professional `Membership` only. Robin's direct instruction: Farpost is being rebuilt from scratch — drop any existing stated philosophy that contradicts the new pricing rather than contort the new design to preserve it. **Final answer: every account in every project, Farpost included, pays the same $12/year on signup, uniformly, attached directly to `userId`.** No role-scoping, no "basic accounts stay free" carve-out. `farpost-revenue-by-role.md`'s free-forever framing is superseded by this decision for the rebuild — worth a note in that doc (or its replacement) when the rebuild actually touches it, so the two don't sit around contradicting each other unremarked.

This is also why Pattern 1 and Pattern 2b dropped the `User`/`Membership` polymorphism entirely (see the schemas above) — with no real use case left for role-scoped billing, the extra branch was complexity without a purpose. If a future project genuinely needs it, that's a fresh, evidence-based redesign then, not something to keep speculatively now.

One thing this simplification gives up, worth naming rather than burying: the original tier idea existed partly to let a brokerage cleanly expense one flat subscription covering several adjusters. A flat per-account $12/year doesn't solve that on its own. Not a reason to keep the tier ladder now — but if brokerage-level bulk billing becomes a real ask later, it's a smaller, separate feature (buying N account-years at once) rather than a reason to resurrect differentiated tiers.

**Net effect:** every project uses the identical $12/year entry price, on the same field (`userId`), with all further revenue coming from Pattern 2's one-time actions — the simplest version of this that still covers every real case in front of us, and a stronger "golden path" narrative alongside the shared stack/scaffold work already in `docs/standard-methodology.md`.

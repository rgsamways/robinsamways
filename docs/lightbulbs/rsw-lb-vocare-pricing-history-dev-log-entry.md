# rsw-lb-vocare-pricing-history-dev-log-entry

**Slug:** rsw-lb-vocare-pricing-history-dev-log-entry
**Date logged:** 2026-07-24
**Status:** scoped — became the `three-prices-in-three-days` Dev Log entry on 2026-07-26 (`dev-log-topics` change)
**Related:** `docs/core-billing-model.md`, Vocare's real billing code (`c:\dev\vocare\backend\src\billing\`)

## The gap

No Dev Log entry documents a real pricing-iteration story — most portfolio content shows a decision made once and stuck with, not an honest account of changing your mind with reasons.

## The idea

A short Dev Log entry (or a beat inside the larger billing-model entry) narrating Vocare's actual pricing history in 3 days: launched at a one-time $10 lifetime unlock, raised to $29 lifetime, and is now moving to a $12/year recurring plan (marketed as "$1/month") specifically because Robin's own read is that a low, recurring entry price will bring in more users faster than either lifetime price point did. Real evidence lives in the actual Stripe Checkout code (`mode: "payment"`, one-time) that this replaces.

## Why it matters beyond convenience

- Shows real pricing judgment under changing evidence, not a single static "here's my pricing" claim — a stronger signal than most portfolio pricing pages.
- Ties directly into the larger cross-project billing-model story (see `rsw-lb-billing-model-convergence-dev-log-entry`) as a concrete before/after data point.

## Open questions

- Fold into the larger billing-model entry as one section, or stand alone as a short, punchy "I changed my mind about pricing three times in three days, here's why" post?
- Wait until the $12/year migration actually ships before publishing, or capture the reasoning now while it's fresh?

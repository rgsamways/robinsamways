# rsw-lb-billing-model-convergence-dev-log-entry

**Slug:** rsw-lb-billing-model-convergence-dev-log-entry
**Date logged:** 2026-07-24
**Status:** unscoped — idea captured, not yet spec'd
**Related:** `docs/core-billing-model.md`, `rsw-lb-own-stack-discovery-dev-log-entry` (the same shape of discovery, applied to billing instead of tech stack), `farpost-lb-payment-models.md`

## The gap

`rsw-lb-own-stack-discovery-dev-log-entry` already captures "I found my tech stack by auditing my own code." A structurally identical discovery just happened one level up the stack — in the business model, not the technology — and isn't captured anywhere yet.

## The idea

A Dev Log entry (or a section of the stack-discovery one) documenting: while designing a shared cross-project billing model, Farpost's own unbuilt lightbulb (`farpost-lb-payment-models.md`, logged 2026-07-01) turned out to already describe a "token bucket" purchase pattern — buy a bundle upfront, spend per use — independently identical in shape to Vocare's separately-conceived "session packs" idea. Neither project copied the other; both arrived at the same abstraction under different names before this design effort connected them. Same "recognized a decision I'd already made" pattern as the stack discovery, this time for monetization design rather than technology choice.

## Why it matters beyond convenience

- A second, independent instance of the same "golden path discovered, not imposed" narrative strengthens the platform-engineering story rather than making it look like a one-off coincidence.
- Demonstrates the abstraction work itself (shared `Subscription`/`CreditPack`/`FulfillmentFee` patterns) was validated by real convergent evidence, not invented from a whiteboard.

## Open questions

- Fold into `rsw-lb-golden-path-backstage-parallel-dev-log-entry` as a second example, or stand alone since it's about business-model convergence specifically, not the platform/tooling convergence that entry already covers?
- Publish before or after the billing model actually ships anywhere real?

# rsw-lb-fastify-vs-express-dev-log-entry

**Slug:** rsw-lb-fastify-vs-express-dev-log-entry
**Date logged:** 2026-07-24
**Status:** unscoped — idea captured, not yet spec'd
**Related:** the Farpost rebuild's stack decision, Vocare's existing Fastify backend

## The gap

No Dev Log entry currently documents a deliberate technology choice made against the market grain, backed by real comparative research rather than a default/tutorial pick.

## The idea

Document the Fastify-vs-Express research done for the Farpost rebuild: Express had no major version between 2014 and Express 5 (October 2024), and lacked correct built-in async/await error handling until that release; Fastify was designed in 2016+ specifically to fix that, plus schema-first validation and plugin encapsulation. The decision to use Fastify anyway — despite Express having roughly an order of magnitude more downloads and being what most job postings name explicitly — was made knowingly, trading market-visibility for technical merit.

## Why it matters beyond convenience

- Demonstrates real comparative technical judgment defensible with evidence, not vibes — directly answers the "why did you choose X" interview question in a way that a copied tutorial stack can't.
- Shows willingness to go against the more common/market-visible choice for a stated, defensible reason, which is a stronger signal than following convention.

## Open questions

- Publish before the Farpost rebuild actually uses Fastify in production, or wait until real experience (positives and pain points) can back up the choice?
- Revisit if Express 5's fixes end up closing the practical gap enough that the story reads as less decisive in hindsight.

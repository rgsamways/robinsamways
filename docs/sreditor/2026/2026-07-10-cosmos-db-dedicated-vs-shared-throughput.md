# Cosmos DB free-tier account rejected container creation with an undocumented-in-practice default throughput allocation

**Date:** 2026-07-10
**Project change:** openspec/changes/archive/2026-07-10-farpost-pulse-build
**Time invested (approx):** roughly 30-45 minutes from first error to fully verified fix, spanning the initial diagnosis, the code fix, and discovering + resolving the pre-existing-state complication.

## Technological uncertainty

Creating a Cosmos DB database via `client.databases.createIfNotExists({ id: DATABASE_NAME })` (no throughput specified), followed by three separate `container.createIfNotExists()` calls (also with no per-container throughput specified), failed against the real free-tier account (`farpost-pulse-cosmos`, capped at 1000 RU/s total) with a `BadRequest`/substatus 1028 error: "would have increased the total throughput to 1200 RU/s." Nothing in the code, the Cosmos SDK's method signatures, or the immediate error path made it obvious that omitting throughput at both the database and container level causes each container to silently request its own dedicated 400 RU/s allocation rather than sharing a pool — this only surfaced once the third container's implicit request pushed the account over its cap.

## Hypothesis / approach

The error message itself named the actual numbers (1200 RU/s requested vs. 1000 RU/s cap, in multiples of 400), which pointed directly at per-container dedicated throughput as the mechanism, rather than a single database-wide allocation. Hypothesis: explicitly provisioning shared throughput at the database level, and leaving the container-creation calls otherwise unchanged, would let all three containers draw from one pool instead of each reserving their own.

## Investigation

- Confirmed the account's actual configured cap (1000 RU/s, free tier) via the Azure Portal.
- Read the seed script's container-creation code to identify exactly where throughput was (and wasn't) being specified.
- Applied the fix: `client.databases.createIfNotExists({ id: DATABASE_NAME, throughput: 1000 })`, leaving each container's own `createIfNotExists()` call unchanged.
- Before declaring the fix complete, checked the live account's actual state directly rather than only re-running the script — this surfaced a second, non-obvious problem: the *first*, failed seeding attempt had already succeeded in creating the `techs` and `jobs` containers before failing on the third, and those two containers had already been provisioned with their own dedicated 400 RU/s offers each. The code fix alone could not retroactively convert already-existing containers to shared throughput.
- Confirmed with Robin, then deleted and recreated the database entirely to get a clean state under the corrected provisioning model.
- Re-ran seeding successfully (6 techs, 144 jobs); verified directly in the Azure Portal (Cosmos DB account → Settings → Scale) that the database shows a single 1000 RU/s shared offer, with none of the three containers holding their own dedicated allocation.

## Outcome

The fix worked once applied to a clean database. Seeding succeeded end-to-end against the real account, and the resulting throughput configuration was confirmed correct via direct inspection, not just the absence of an error.

## Knowledge gained

Cosmos DB's SDK defaults to per-container dedicated throughput whenever neither the database nor the container explicitly opts into shared throughput — this default is not obviously stated at the point of writing `createIfNotExists()` calls, only discoverable once an account's cap is actually exceeded. More importantly: a code fix that switches to database-level shared throughput does **not** retroactively affect containers that were already created under the old (dedicated) model — partial failure during a first attempt can leave real, already-provisioned resources in an inconsistent state that a second, corrected run won't fix on its own. For any future Cosmos DB work on a throughput-capped account, the real lesson is to check actual live resource state directly (not just "did the script run without error this time") before trusting that a fix is complete, especially after a prior attempt partially succeeded before failing.

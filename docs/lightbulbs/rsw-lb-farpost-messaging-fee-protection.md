# rsw-lb-farpost-messaging-fee-protection

**Slug:** rsw-lb-farpost-messaging-fee-protection
**Date logged:** 2026-07-26
**Status:** unscoped — direction decided (open messaging, protect revenue by making the platform attractive rather than restricting communication), specific mechanisms and pricing not yet finalized. Robin wants to revisit this "when it comes to it," not now.
**Related:** `docs/core-billing-model.md`, `docs/handoff-2026-07-26-farpost-rebuild-why-it-matters.md`, `docs/handoff-2026-07-26-farpost-role-admin-requirement.md`

## The gap

Adding direct messaging between Farpost users (professionals, homeowners) is wanted — messaging is how people actually interact, and Robin sees it as important, not optional. But it creates a real disintermediation risk: two parties who can message freely could arrange the same kind of work relationship Farpost currently monetizes (a per-job fulfillment fee when a claim is dispatched from an adjuster to a contractor) entirely off-platform, bypassing that fee. No design yet addresses this tension.

## The idea

**Direction decided:** don't restrict messaging to prevent this — accept it as a real possibility and instead make staying on-platform genuinely more attractive than going around it. Concrete levers discussed:

- **Reputation that only accrues on-platform.** Farpost's dispatch model already ranks candidates by tracked reputation signals — work done off-platform earns a professional nothing toward future dispatch ranking, a real incentive to keep transactions in-system that doesn't depend on catching anyone.
- **Bundle messaging with the actual work artifacts** — scheduling, photos, NFC-anchored records, invoicing, claim history — in the same thread, so going elsewhere costs convenience, not just breaks a rule.
- **Some protection or guarantee tied to on-platform completion** (dispute backing, payment guarantee) that a homeowner or contractor would lose by going around Farpost — this is the lever that protects revenue on the homeowner side too, not just professional-to-professional.
- A building's history showing real work with no matching Farpost transaction (Robin's own first instinct) is a reasonable **detection/audit backstop**, but it's after-the-fact, not preventive — worth keeping, not relying on alone.

**Confirmed pricing anchor, restated directly by Robin:** freemium from the start — $1/month covers a thin set of niceties, and anything beyond that is a one-off action/event requiring a specific feature the user opts into and pays for at that moment. This matches `docs/core-billing-model.md`'s existing shape (uniform low entry price + Pattern 2's one-time actions), not a departure from it.

**Pricing compromise floated, not decided:** an optional upgrade tier (e.g. $29/month) that waives the per-job fulfillment fee (e.g. 10% of a contractor's estimate) entirely, as an alternative to paying that fee per transaction on the base $1/month plan. Two things flagged directly, worth re-reading before this gets built:
1. This is a second tier, which is a conscious, specific override of `core-billing-model.md`'s explicit "multi-tier professional subscriptions dropped for simplicity" decision — narrower in shape than what was dropped (one flat lever, not a role-scoped matrix), but still worth deciding deliberately rather than drifting back into it.
2. **Real financial risk: adverse selection.** At a $28/month price gap, only professionals dispatching more than ~$280/month in gross estimates would benefit from upgrading — meaning the highest-volume professionals (the ones generating the most fee revenue today) are exactly the ones who'd upgrade and cap what they owe, right when their volume is highest. A flat unlimited buyout is the classic "unlimited plan" trap. A capped version (e.g., waives fees up to some monthly gross-dispatched ceiling, 10% still applies above it) was suggested as a safer alternative, not yet decided. Needs real Farpost transaction-volume data to calibrate any actual number — not something to guess at.

## Why it matters beyond convenience

- Directly protects Farpost's actual revenue model against the most obvious failure mode of adding a feature (messaging) explicitly requested because "it's how humans interact."
- The reputation-based incentive is a genuinely elegant fit — it reuses infrastructure Farpost already has (the dispatch ranking system) rather than inventing new enforcement machinery.
- Naming the adverse-selection risk explicitly, before any pricing is built, avoids a real, quantifiable revenue mistake (capping fees exactly on the highest-value users) that would be easy to not notice until real usage data showed it.

## Open questions

- Exact mechanism(s) from the "make it attractive" list — none are fully designed, all are directions.
- Whether the fee-waiver upgrade tier happens at all, and if so, flat-unlimited vs. volume-capped — needs real transaction-volume data Farpost doesn't have yet (pre-launch).
- Whether messaging should be scoped only to already-dispatched job contexts (a stronger structural mitigation discussed earlier in the same conversation) or fully open contact between any two users — leaning open per Robin's "messaging is important, how humans interact" framing, but not explicitly confirmed either way.
- Where this eventually lives: likely folds into Farpost's own identity/dispatch design work, not a standalone feature spec.

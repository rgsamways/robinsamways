# rsw-lb-account-hub-private-chat

**Slug:** rsw-lb-account-hub-private-chat
**Date logged:** 2026-07-25
**Status:** unscoped — idea captured, not yet spec'd. A stub `/account` page and rail icon ship as part of `page-outline-nav`, standing in for this until it's actually scoped.
**Related:** `services-payments` (`account-auth`, the accounts this hub would sit on top of), `page-outline-nav` (ships the placeholder icon/page)

## The gap

`account-auth` now gives robinsamways.ca real accounts, and `services-billing` gives subscribers a real `Subscription`/`FulfillmentFee` record — but there's no page where a signed-in visitor can actually see any of that. `/sign-in` doubles as a thin "manage subscription" surface via the Stripe Customer Portal handoff, but that only covers billing. Robin also wants a place for whatever informal work he's doing for someone (troubleshooting, a project in progress) to live, and a way for that person to reach him privately without it being a public contact-form submission or an email he has to remember to check.

## The idea

A real account hub at `/account` (the icon added by `page-outline-nav` currently points at a stub): a signed-in visitor's home base for anything Robin's doing for them — status of an in-progress engagement, a running thread instead of a static contact form, and whatever billing self-service doesn't already live in Stripe's Customer Portal. The "private chat" half is the least defined part: is it truly two-way (a real message thread, notifications, maybe email fallback when Robin's offline), or a one-way "leave Robin a note tied to your account" that's really just a richer, authenticated version of the existing contact form? Both are plausible; the value of a real thread (context persists, no re-explaining) is the main case for the heavier option.

## Why it matters beyond convenience

- Gives `account-auth`'s accounts an actual reason to exist beyond gating the $12/year subscription — right now signing in only unlocks Stripe's own portal, nothing native to the site.
- A real private-communication feature (even a modest one) is a genuinely new capability for this site, not a variation on the contact-form/billing patterns already built — worth scoping carefully rather than backing into it as a side effect of a nav icon.
- Ties back to the same "one signed-in identity, one place billing/engagement state attaches to" thinking already established in `docs/core-user-model.md`/`docs/core-billing-model.md`.

## Open questions

- Real two-way messaging (with notification delivery) vs. an authenticated one-way note — meaningfully different scope and worth deciding before writing a proposal, not during it.
- What "managing an engagement" concretely shows — is there a data model for an engagement/ticket at all yet, or does this need one designed from scratch alongside the hub itself?
- Whether this becomes its own OpenSpec change once scoped, or folds into a broader `account-hub` change alongside whatever comes out of the messaging-vs-note decision above.

# Handoff: replace ad hoc role-suggestion with an admin-controlled role screen

**What this file is:** a real product requirement from Robin, to be designed properly in
Farpost's own repo — not fully speced here, since that design needs Farpost's actual
schema/codebase context, which this session doesn't have. This corrects a misunderstanding
in an earlier robinsamways.ca-side note (`docs/handoff-2026-07-26-farpost-rebuild-why-it-
matters.md`), which described role curation as an optional, low-priority extra. It isn't —
Robin wants it, and the old approach it replaces was a real, admitted mess, not a
hypothetical concern.

## The problem with the old approach

In Farpost's current/old system, adding a new professional role was haphazard: a user
could suggest a role the platform didn't already support, and an admin was "supposed to"
add it somewhere — but there was no real, structured process behind that. It was a
genuine mess in practice, not just a theoretical gap.

## What's wanted instead

A dedicated admin screen that lets an admin create and manage professional roles directly,
behind the scenes — not a user-facing self-service flow, and not a loose, ad hoc
suggestion-then-maybe-someone-adds-it pipeline. This is deliberately admin-controlled: the
admin decides when and how a new role gets added, not the end user.

## Why this needs to happen carefully, not casually

Each professional role can carry a meaningfully different set of features, tools, and
workflows — an adjuster's needs are not a contractor's needs are not a home-security
professional's needs — many of which the platform hasn't built yet at the point a role is
first added. Adding a role isn't just adding a label to a list; it potentially commits to,
or at least surfaces, real feature/tooling work still ahead. The admin process should
reflect that weight, not treat "add a role" as a trivial one-field form submission.

## How this relates to the already-decided shared identity design

The cross-project shared design (`docs/core-user-model.md`) makes `Membership.role` a
plain, unconstrained text field, deliberately with no shared curation apparatus, so it
works simply across every project using the shared package. This admin screen is exactly
the kind of Farpost-owned layer built *on top of* that plain field that design already
anticipated — the difference is this isn't optional or low-priority, it's a real
requirement Robin wants addressed as part of the rebuild.

## Open questions for the Farpost session to actually design

- Does a role need its own state (e.g., proposed / in development / fully supported), so
  the system can honestly reflect that a role exists but its tooling isn't built yet,
  rather than presenting every role as equally ready?
- Does a user-facing "suggest a role" channel still exist at all, feeding into the admin's
  queue, or does that go away entirely in favor of the admin creating roles directly when
  a real need is identified?
- What does the admin actually need to define when creating a role — just a name and
  description, or also which features/permissions/tools attach to it, even before those
  are built?
- Who can access this admin screen, and does that tie into the shared identity/Membership
  design's own permission model, or is it Farpost-specific?

This is real, wanted scope for the rebuild — not a nice-to-have to defer indefinitely.

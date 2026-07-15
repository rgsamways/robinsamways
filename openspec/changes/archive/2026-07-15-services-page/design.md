## Context

`/dev-log` and `/farpost` both already establish the exact page shape Robin asked for: heading → intro blurb → a pill bar (via the shared `SectionFilterBar`/`PillBar`/`filterSections`, built during `dev-log-code-showcase` and `farpost-section-filter`) → the filtered sections themselves. `/services` reuses that infrastructure verbatim — this change adds zero new filter logic, only new content and one new page.

Robin's answers to three open questions shaped this page's scope: no public prices/rates (every section says "contact for pricing" instead of a number), placeholder package tiers for Web Sites that he'll edit after seeing a draft, and a homepage-contact-form call-to-action per section — plus one late addition, a sixth pill for Field Documentation, tied to the existing `field.farpost.ca` (already a real, separate service Robin operates, per his resume's Farpost role bullet: solo drone/ground-level property documentation for North Hastings, Transport Canada Basic RPAS certified, DJI Mini 4 Pro).

## Goals / Non-Goals

**Goals:**
- One new page, reusing existing filter infrastructure exactly, no new abstractions.
- Honest content: every claim about capability (Android, cloud, third-party integration) is backed by something already true and demonstrable elsewhere on this site or in Robin's real resume — not aspirational copy.
- A clear, low-commitment call-to-action per section, since the point of the page is generating contact, not closing a sale on the page itself.

**Non-Goals:**
- Any pricing or rate figures, public or otherwise — explicitly decided against.
- A quote-request form separate from the existing homepage contact form — reusing what exists is enough for a first version.
- Building or changing anything at `field.farpost.ca` itself — this change only links to it.

## Decisions

**1. Reuse `SectionFilterBar` exactly as `/dev-log`/`/farpost` already do — no new component.**
`web/src/app/services/page.tsx` builds six `{id, label, node}` section descriptors and renders `<SectionFilterBar sections={...} ariaLabel="filter services sections" />`, identical in shape to the other two pages. This is the whole reason those two were generalized in the first place.

**2. Draft copy per section, to be edited by Robin — not final marketing copy.**
- **Web Sites** — three placeholder tiers: **Starter** (a small brochure/portfolio presence — a handful of pages, mobile-responsive, a contact form, deployed and hosted), **Standard** (a growing business site — more pages, basic content updates, on-page SEO basics, simple third-party integrations like booking or email), **Advanced** (a fully custom site — bespoke design/interactivity, deeper integrations such as payments or scheduling, performance and SEO tuning). Names and scope are explicitly a draft for Robin to rename/adjust.
- **Web Applications** — positioned as more than a website, less than a platform: logged-in accounts, a real database-backed backend, custom business logic or dashboards. References this very site (spec-driven, tested, deployed) and Farpost Pulse as concrete proof of the pattern rather than abstract claims.
- **Native Applications** — Android development, stated as the current focus (not claiming iOS). References TapLog (the real Android RFID-verification app from Farpost's own origin story) and the native production-line mobile apps built at Padre Software (both already true, already on this site's resume) as evidence.
- **Platform** — large builds involving third-party integration and cloud infrastructure. References Farpost itself as the running example, plus the site's own demonstrated integrations (Salesforce, Stripe, Twilio, Azure) across its portfolio pieces.
- **Hourly** — contract/hourly engagement against an existing codebase (bug fixes, feature work, ongoing support), contact for rate.
- **Field Documentation** — solo drone and ground-level property documentation for the North Hastings region, Transport Canada Basic RPAS certified, DJI Mini 4 Pro — the one section whose call-to-action deviates from the rest (see decision 3).

**3. Field Documentation's call-to-action links to `field.farpost.ca`, not the homepage contact form.**
Every other section's CTA points at `/` (the existing contact form), per Robin's stated default. Field Documentation already has its own dedicated channel at `field.farpost.ca`, which is the more useful, specific destination for someone interested in that particular service — routing them back to the general contact form instead would be a worse experience for no reason. Flagged explicitly since it's a deliberate exception to the otherwise-uniform CTA rule, not an oversight.

**4. "Services" is appended to the end of the hamburger menu, after Dev Log.**
No signal from Robin on preferred position; appending is the lowest-risk choice (doesn't reorder or deprioritize any existing item) and is trivial to reorder later if he wants it more prominent.

**5. No new test infrastructure — this reuses three already-established test shapes.**
The pill-bar e2e coverage mirrors `dev-log-section-filter.spec.ts`/`farpost-section-filter.spec.ts` exactly (six pills instead of five/four). The menu coverage extends `global-navigation.spec.ts`'s existing `GLOBAL_MENU_LINKS` array and parameterized test loop — adding one array entry gets both "lists every destination" and "navigates to X" coverage for free, no new test code. No new pure logic exists to unit-test (the page is static content wrapped in an already-tested filter component).

## Risks / Trade-offs

- **[Risk]** Draft placeholder copy (decision 2) ships to production before Robin has reviewed/edited it, if the change is archived without a read-through. → **Mitigation**: tasks.md calls out explicitly that this is draft content Robin should skim before archiving, same spirit as the theme-toggle's "unverified starting palette" caveat.
- **[Risk]** `field.farpost.ca` is outside this repo entirely — if it's not actually live yet, the Field Documentation CTA would link to a dead or unfinished site. → **Mitigation**: this is Robin's own domain and his own explicit instruction to link there; not something this change can verify from inside this repo, so it's named here rather than silently assumed fine.
- **[Risk]** Six pills is one more than any existing pill bar on the site (`/dev-log` has five, `/farpost` has four) — worth confirming it still reads cleanly on a narrow mobile viewport. → **Mitigation**: `PillBar` already wraps (`flex flex-wrap`), the same as the other two pages; no layout change needed, but worth a quick visual check on a real small viewport during implementation.

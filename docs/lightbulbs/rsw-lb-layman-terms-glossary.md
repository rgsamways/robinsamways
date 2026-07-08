# rsw-lb-layman-terms-glossary

**Slug:** rsw-lb-layman-terms-glossary
**Date logged:** 2026-07-08
**Status:** unscoped — idea captured, not yet spec'd
**Related:** `web/src/app/dev-log/page.tsx` (currently a placeholder), `InfoTooltip.tsx` (the portfolio page's existing inline-explanation pattern)

## The gap

This site's technical content — the Salesforce case study, Farpost's product description, the Dev Log itself — is written for a reader who already knows what OAuth, SOQL, NFC tags, or Twilio are. That's fine for a technical interviewer reading closely, but it silently loses everyone else: a recruiter forwarding the link, an HR screener, a hiring manager's non-technical colleague glancing at it before a meeting. Right now there's no mechanism on the site to catch that reader before they bounce — jargon either gets a quick `InfoTooltip` (built for the Farpost-reputation-graph explanation) or nothing at all, and there's no dedicated place for a fuller, plain-language translation of a term.

## The idea

A running "X, in layman's terms" glossary/FAQ section on the Dev Log page (currently also just a placeholder) — a growing list of short Q&A entries, each answering something like "What is Twilio in layman's terms?" in language that doesn't assume any technical background, without dumbing down the substance underneath. Not a one-time write: entries get added as new tools/concepts show up elsewhere on the site (Twilio, OAuth 2.0 Client Credentials Flow, SOQL, Field History Tracking, NFC/RFID, Railway, Vercel, whatever comes next), the same organically-growing-list spirit as `docs/issues.md` or the lightbulbs folder itself.

Writing each entry is also genuine self-test value for Robin: if a concept can't be explained cleanly in plain language, that's a sign the underlying understanding is shakier than it feels — a low-cost forcing function similar to what the SR&ED logging habit does for technical uncertainty.

## Why it matters beyond convenience

- Widens the site's actual audience. A portfolio site that only a technical reader can follow is quietly failing at exactly the moment a recruiter or non-technical stakeholder is the one deciding whether to pass the link along.
- Translating technical concepts for non-technical stakeholders is a real, often explicitly evaluated skill at the Architect level — this section doubles as a demonstration of that skill, not just a courtesy to readers.
- Cheap to grow incrementally — unlike a big content build, this is a small addition every time a new term comes up, so it never needs a dedicated "finish the glossary" push.
- Complements, rather than duplicates, the existing `InfoTooltip` pattern: a tooltip is a quick inline aside; this is the fuller reference for a reader who wants to actually understand the term, not just get a one-sentence gloss.

## Open questions

- Format: a simple scrolling list of Q&A entries, or something searchable/filterable once the list gets long (Robin's own framing — "could be a very long list there" — suggests this matters sooner rather than later)?
- Scope: strictly limited to terms that actually appear elsewhere on this site, or a broader standing glossary of software-engineering concepts in general?
- Should entries link bidirectionally with `InfoTooltip` — e.g. clicking the OAuth tooltip on `/portfolio` jumps to this section's fuller "What is OAuth in layman's terms?" entry — or do the two stay independent?
- Does this launch with a starter set of entries drafted now (Twilio, OAuth 2.0 Client Credentials Flow, SOQL, Field History Tracking, NFC/RFID), or start empty and grow only as new terms actually get used elsewhere on the site?
- If the list grows large enough, does it stay a section within Dev Log, or eventually deserve to be its own page/nav entry — the same "starts embedded, may graduate to its own top-level thing" trajectory already flagged for Sreditor?

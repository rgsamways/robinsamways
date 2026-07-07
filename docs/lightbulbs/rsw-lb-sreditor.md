# rsw-lb-sreditor

**Slug:** rsw-lb-sreditor
**Date logged:** 2026-07-07
**Status:** unscoped — idea captured, not yet spec'd
**Related:** `docs/sreditor/`, future Portfolio page, possible future OpenSpec change

## The gap

Independent and small-team developers doing genuinely SR&ED-eligible work — resolving real technological uncertainty through systematic investigation — routinely under-claim or miss it entirely. Not because the work doesn't qualify, but because nobody captures the evidence contemporaneously, and most developers have never been shown what a CRA SR&ED auditor is actually looking for in that evidence. The gap is procedural, not technical: developers know how to build things, but not how to document the R&D story of what they built in a form that survives an audit.

## The idea

"Sreditor" — first built as this project's own contemporaneous SR&ED working log (`docs/sreditor/`) — becomes a portfolio piece that teaches other developers to run the same practice themselves. Three parts:

1. An explainer of how Sreditor was actually built and used on this project: the `docs/sreditor/` convention, the `CLAUDE.md`-codified habit of logging uncertainty as it's resolved, and the distinction between routine work and genuinely SR&ED-eligible work.
2. A form-based, guided workflow that walks a developer through the key things SR&ED auditors actually look for (technological uncertainty, systematic investigation, knowledge gained), producing a filled-out entry in the same shape as this project's own log.
3. Guidance for applying the practice inside a developer's own environment using Claude Code — how to set up the same `CLAUDE.md` convention and `docs/` folder pattern on their own project, so the habit becomes automatic instead of something they have to remember to do manually.

## Why it matters beyond convenience

- Real money: SR&ED credits are meaningful and routinely missed by solo/small-team developers who don't know the documentation bar.
- Demonstrates exactly the kind of hands-on, teachable engineering practice this whole portfolio site exists to showcase — not just "I can use an API," but "I can build a process other developers can adopt."
- The idea has provenance worth preserving: it emerged directly from building this project under real time pressure, which is a genuine, dated example of the practice being born from actual need rather than designed in the abstract.
- Cross-pollinates with Farpost's own lightbulbs convention — reusing an idea-capture practice already validated on a different, larger project rather than inventing a new one from scratch.

## Open questions

- Is the form-based workflow a static client-side tool (no backend/persistence), or does it need `/api` + a database to save/export entries? Leans static for v1, given `/api` currently has zero business endpoints.
- Does this live under Portfolio as a case study, or does it eventually justify hosting something at `sreditor.ca`/`sreditor.com` directly — the domains already owned?
- How much of Farpost's actual lightbulbs practice (this very file's origin) can be shown as a real, concrete example inside the case study itself, rather than just described abstractly?
- Scope of "auditor criteria" content: does this need real research into CRA's actual SR&ED evaluation criteria to be credible, or is it enough to reflect the practice as Robin understands it from his own experience?

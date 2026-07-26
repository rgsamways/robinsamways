## Context

A page relocation with no architectural complexity — per `CLAUDE.md`'s "Resume content changes" convention this would normally skip design.md entirely; a minimal one is included here only because the tooling's dependency graph requires it before `tasks.md` unlocks.

## Goals / Non-Goals

**Goals:** Move `ContactForm`'s rendering location from the homepage to `/contact`, leaving a short pointer behind; add Contact to the Site nav group.

**Non-Goals:** No change to `ContactForm`'s own fields, validation, or the `POST /contact` API endpoint. No change to any other Site/Work/Experiments/Writing/Ops nav entry.

## Decisions

**D1 — The homepage's old slot becomes a one-line pointer, not nothing.** Per Robin's own choice: keep the `## CONTACT` header and a short sentence + link to `/contact`, rather than removing the section outright — preserves the section-header rhythm of the rest of the homepage (Profile → Experience → Skills → Education → Continuing Education → Contact) instead of ending abruptly on Continuing Education.

**D2 — Contact placed last in the Site group.** Home, Services, Metrics already read as an ascending specificity order (site root → what's offered → proof-of-work numbers); Contact as a closing "how to reach me" entry fits the same logic without needing to reorder the existing three.

## Risks / Trade-offs

- [Risk] A visitor who bookmarked or linked directly to homepage's `#contact` anchor loses the form itself → Mitigation: the pointer link is at the same anchor position, one click from the real form; acceptable given Robin's explicit choice in D1.

## Migration Plan

Pure content-relocation change, no data/schema impact. Normal deploy flow; rollback is a plain revert.

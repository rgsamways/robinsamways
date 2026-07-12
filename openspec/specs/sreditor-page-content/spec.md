# sreditor-page-content Specification

## Purpose
TBD - created by archiving change sreditor-page-content. Update Purpose after archive.
## Requirements
### Requirement: Content reflects Sreditor's real, verifiable state
The page's content SHALL describe Sreditor's actual built state — specific, checkable facts (file counts, test counts, what commands work end-to-end, what's still unfinished) — rather than aspirational or illustrative claims about what it might eventually do. When Sreditor has been run against an external project's real history, not just its own build, the SRED_ELIGIBILITY_EXAMPLE section SHALL state that result with the same specificity, including the denominator (how much of the external project was judged) and how any claim it surfaced was actually found, not just whether it was found.

#### Scenario: SRED_ELIGIBILITY_EXAMPLE states real, specific facts
- **WHEN** a visitor reads the SRED_ELIGIBILITY_EXAMPLE section
- **THEN** it states concrete, verifiable facts about Sreditor's actual implementation state, including what remains unfinished, not just what works

#### Scenario: SRED_ELIGIBILITY_EXAMPLE reflects calibration against an external project
- **WHEN** Sreditor has been run against a real external project's own history
- **THEN** the section states that result as a specific, checkable fact (e.g. how many changes were judged, how many claims surfaced, and whether a claim was found through a single change or through rollup synthesizing multiple changes) rather than describing calibration as untested against external work

### Requirement: Sreditor page presents real content in a structure that mirrors Farpost's own page
The `/sreditor` route SHALL render real content — not a placeholder — structured into four sections, in order: ORIGIN_STORY, PROBLEMS_SREDITOR_SOLVES, SRED_ELIGIBILITY_EXAMPLE, and PROCESS — the same four-section shape `farpost-page-content` requires of the Farpost hub's Origins tab, since Sreditor and Farpost are now nav siblings.

#### Scenario: Visitor sees all four sections in order
- **WHEN** a visitor loads `/sreditor`
- **THEN** the page shows ORIGIN_STORY, PROBLEMS_SREDITOR_SOLVES, SRED_ELIGIBILITY_EXAMPLE, and PROCESS sections, in that order, with real content in each


## RENAMED Requirements
- FROM: `### Requirement: Sreditor page presents real content in the required Method-type structure`
- TO: `### Requirement: Sreditor page presents real content in a structure that mirrors Farpost's own page`

## MODIFIED Requirements

### Requirement: Sreditor page presents real content in a structure that mirrors Farpost's own page
The `/sreditor` route SHALL render real content — not a placeholder — structured into four sections, in order: ORIGIN_STORY, PROBLEMS_SREDITOR_SOLVES, SRED_ELIGIBILITY_EXAMPLE, and PROCESS — the same four-section shape `farpost-page-content` requires of the Farpost hub's Origins tab, since Sreditor and Farpost are now nav siblings. A local navigation menu beside the page heading SHALL link to each section. Sreditor SHALL NOT have a parent-index link in its local menu, matching Farpost's own exemption in `project-page-navigation` — it sits at the top nav tier itself.

#### Scenario: Visitor sees all four sections in order
- **WHEN** a visitor loads `/sreditor`
- **THEN** the page shows ORIGIN_STORY, PROBLEMS_SREDITOR_SOLVES, SRED_ELIGIBILITY_EXAMPLE, and PROCESS sections, in that order, with real content in each

#### Scenario: Local menu links to each section, with no parent-index link
- **WHEN** a visitor opens the local menu beside the Sreditor page's heading
- **THEN** the menu includes links to all four sections and no link back to a parent index

### Requirement: Content reflects Sreditor's real, verifiable state
The page's content SHALL describe Sreditor's actual built state — specific, checkable facts (file counts, test counts, what commands work end-to-end, what's still unfinished) — rather than aspirational or illustrative claims about what it might eventually do. When Sreditor has been run against an external project's real history, not just its own build, the SRED_ELIGIBILITY_EXAMPLE section SHALL state that result with the same specificity, including the denominator (how much of the external project was judged) and how any claim it surfaced was actually found, not just whether it was found.

#### Scenario: SRED_ELIGIBILITY_EXAMPLE states real, specific facts
- **WHEN** a visitor reads the SRED_ELIGIBILITY_EXAMPLE section
- **THEN** it states concrete, verifiable facts about Sreditor's actual implementation state, including what remains unfinished, not just what works

#### Scenario: SRED_ELIGIBILITY_EXAMPLE reflects calibration against an external project
- **WHEN** Sreditor has been run against a real external project's own history
- **THEN** the section states that result as a specific, checkable fact (e.g. how many changes were judged, how many claims surfaced, and whether a claim was found through a single change or through rollup synthesizing multiple changes) rather than describing calibration as untested against external work

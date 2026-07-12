## MODIFIED Requirements

### Requirement: Sreditor page presents real content in a structure that mirrors Farpost's own page
The `/sreditor` route SHALL render real content — not a placeholder — structured into four sections, in order: ORIGIN_STORY, PROBLEMS_SREDITOR_SOLVES, SRED_ELIGIBILITY_EXAMPLE, and PROCESS — the same four-section shape `farpost-page-content` requires of the Farpost hub's Origins tab, since Sreditor and Farpost are now nav siblings.

#### Scenario: Visitor sees all four sections in order
- **WHEN** a visitor loads `/sreditor`
- **THEN** the page shows ORIGIN_STORY, PROBLEMS_SREDITOR_SOLVES, SRED_ELIGIBILITY_EXAMPLE, and PROCESS sections, in that order, with real content in each

## ADDED Requirements

### Requirement: Sreditor hub links to its project-record pages, alongside its existing real content
The existing `/sreditor` hub (its four sections per `sreditor-page-content`, unchanged) SHALL additionally present links to Sreditor's ten project-record pages, in this order: Build Plan, Feature List, Tech Stack, Upgrade Path, Current Metrics, Outlook, Bug List, Testing & Verification, Lightbulbs, and Glossary, sourced from a new `sreditor-status.json` data file, the same mechanism `farpost-status.json`/`vocare-status.json` already use.

#### Scenario: Visitor sees the hub's existing content plus its ten project-record links
- **WHEN** a visitor loads `/sreditor`
- **THEN** the page shows its existing four real sections and links to each of Build Plan, Feature List, Tech Stack, Upgrade Path, Current Metrics, Outlook, Bug List, Testing & Verification, Lightbulbs, and Glossary, in that order

### Requirement: Build Plan documents Sreditor's forward development sequencing
The `/sreditor/build-plan` route SHALL present Sreditor's real forward development sequencing as far as it can currently be forecast, explicitly framed in its introductory copy as provisional and expected to change, sourced from `sreditor-status.json`.

#### Scenario: Visitor reads the build plan's provisional framing
- **WHEN** a visitor loads `/sreditor/build-plan`
- **THEN** the introductory copy explicitly states the plan is provisional and will evolve

### Requirement: Feature List enumerates Sreditor's real and planned capabilities
The `/sreditor/feature-list` route SHALL enumerate Sreditor's real and planned capabilities, each flagged as shipped or planned via `sreditor-status.json` (the same file used by Current Metrics), rather than the shipped/planned flag being hand-maintained separately in page copy.

#### Scenario: Feature List distinguishes shipped from planned via the shared status data
- **WHEN** a visitor reads the Feature List
- **THEN** each entry's shipped/planned flag matches the value recorded for it in `sreditor-status.json`

### Requirement: Tech Stack documents Sreditor's real technology choices
The `/sreditor/tech-stack` route SHALL document Sreditor's real technology choices (its TypeScript CLI/npm-package stack), sourced from `sreditor-status.json`.

#### Scenario: Visitor sees Sreditor's real stack
- **WHEN** a visitor loads `/sreditor/tech-stack`
- **THEN** the page describes Sreditor's actual technology choices, not a generic or placeholder stack

### Requirement: Upgrade Path documents planned evolution of Sreditor
The `/sreditor/upgrade-path` route SHALL document planned upgrades or evolutions to Sreditor (e.g. new detection capabilities, calibration against additional external projects).

#### Scenario: Visitor reads the upgrade path
- **WHEN** a visitor loads `/sreditor/upgrade-path`
- **THEN** the page describes at least one concrete planned upgrade, or honestly states none are currently planned

### Requirement: Current Metrics presents a real status snapshot of Sreditor
The `/sreditor/current-metrics` route SHALL present a dated status snapshot of Sreditor's real current state (e.g. version, real usage/calibration indicators per `sreditor-page-content`'s SRED_ELIGIBILITY_EXAMPLE), sourced from `sreditor-status.json`, narrated in the style of `docs/metrics.md`. Updating the snapshot SHALL require editing only that data file, not the page's own code.

#### Scenario: Visitor sees a dated snapshot sourced from the status data file
- **WHEN** a visitor loads `/sreditor/current-metrics`
- **THEN** the page shows the dated status fields present in `sreditor-status.json`

### Requirement: Outlook presents forward-looking narrative for Sreditor
The `/sreditor/outlook` route SHALL present forward-looking narrative on where Sreditor is headed beyond its immediate build plan.

#### Scenario: Visitor reads the outlook
- **WHEN** a visitor loads `/sreditor/outlook`
- **THEN** the page presents forward-looking narrative distinct from the concrete, near-term Build Plan content

### Requirement: Bug List documents real bugs found and fixed in Sreditor
The `/sreditor/bug-list` route SHALL present a running, dated account of real bugs found and fixed during Sreditor's development, sourced from `sreditor-status.json`. The page SHALL honestly state if no entries exist yet, rather than fabricating placeholder bugs.

#### Scenario: Empty bug list is stated honestly
- **WHEN** a visitor loads `/sreditor/bug-list` before any entries exist
- **THEN** the page states plainly that no bugs have been logged yet

### Requirement: Testing & Verification describes Sreditor's real testing practice
The `/sreditor/testing-verification` route SHALL describe Sreditor's actual testing practice, sourced from `sreditor-status.json`, without overclaiming automation that doesn't exist.

#### Scenario: Visitor reads an accurate account of Sreditor's testing practice
- **WHEN** a visitor reads `/sreditor/testing-verification`
- **THEN** the copy accurately reflects Sreditor's real current testing state

### Requirement: Lightbulbs surfaces Sreditor-specific idea-capture entries
The `/sreditor/lightbulbs` route SHALL render a public listing of idea-capture entries specific to Sreditor, sourced from `sreditor-status.json`.

#### Scenario: Visitor sees Sreditor's own lightbulb ideas
- **WHEN** a visitor loads `/sreditor/lightbulbs`
- **THEN** the page lists Sreditor-specific idea entries, not ideas belonging to other projects

### Requirement: Glossary explains Sreditor-specific technical terms in plain language
The `/sreditor/glossary` route SHALL present a growing list of "X, in layman's terms" entries specific to Sreditor's own domain, sourced from `sreditor-status.json`.

#### Scenario: Visitor reads a Sreditor glossary entry
- **WHEN** a visitor reads an entry on `/sreditor/glossary`
- **THEN** the term is explained in plain language, without assuming the reader already knows related jargon

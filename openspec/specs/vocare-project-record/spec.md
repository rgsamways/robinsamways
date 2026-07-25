# vocare-project-record Specification

## Purpose
TBD - created by archiving change left-nav-restructure. Update Purpose after archive.
## Requirements
### Requirement: Vocare hub presents project background and links to its project-record pages
The `/vocare` route SHALL render a heading, a short project-background blurb introducing Vocare, and links to its ten project-record pages, in this order: Build Plan, Feature List, Tech Stack, Upgrade Path, Current Metrics, Outlook, Bug List, Testing & Verification, Lightbulbs, and Glossary. Embedding Vocare's actual live build on this page remains explicitly out of scope for this requirement, tracked separately.

#### Scenario: Visitor sees the hub and its ten links
- **WHEN** a visitor loads `/vocare`
- **THEN** the page shows the heading, project-background blurb, and links to each of Build Plan, Feature List, Tech Stack, Upgrade Path, Current Metrics, Outlook, Bug List, Testing & Verification, Lightbulbs, and Glossary, in that order

### Requirement: Build Plan documents forward build sequencing as a living, evolving forecast
The `/vocare/build-plan` route SHALL present Vocare's forward build sequencing as far as it can currently be forecast, explicitly framed in its introductory copy as provisional and expected to change, not a fixed roadmap.

#### Scenario: Visitor reads the build plan's provisional framing
- **WHEN** a visitor loads `/vocare/build-plan`
- **THEN** the introductory copy explicitly states the plan is provisional and will evolve

### Requirement: Feature List enumerates real and planned Vocare capabilities, sourced from structured per-silo data
The `/vocare/feature-list` route SHALL enumerate Vocare's real and planned capabilities, each flagged as shipped or planned via the structured status-data file `web/src/data/vocare-status.json` (the same file used by Current Metrics), rather than the shipped/planned flag being hand-maintained separately in page copy.

#### Scenario: Feature List distinguishes shipped from planned via the shared status data
- **WHEN** a visitor reads the Feature List
- **THEN** each entry's shipped/planned flag matches the value recorded for it in `vocare-status.json`

### Requirement: Tech Stack documents Vocare's converged stack plus any project-specific additions
The `/vocare/tech-stack` route SHALL document the converged siloes stack (Fastify, Drizzle, Postgres, better-auth, per `docs/standard-methodology.md`) as it applies to Vocare, plus any stack items specific to Vocare beyond that shared baseline.

#### Scenario: Visitor sees both shared and Vocare-specific stack items
- **WHEN** a visitor loads `/vocare/tech-stack`
- **THEN** the page distinguishes the shared siloes baseline stack from any items specific to Vocare

### Requirement: Upgrade Path documents planned evolution of the live build
The `/vocare/upgrade-path` route SHALL document planned upgrades or evolutions to the live Vocare build (e.g. infrastructure, dependency, or architecture changes anticipated after initial launch).

#### Scenario: Visitor reads the upgrade path
- **WHEN** a visitor loads `/vocare/upgrade-path`
- **THEN** the page describes at least one concrete planned upgrade beyond the current live build

### Requirement: Current Metrics presents a status snapshot sourced from structured per-silo data, not a live dashboard
The `/vocare/current-metrics` route SHALL present a dated status snapshot of the live Vocare build (e.g. deployment status, real usage or scope indicators), sourced from the structured status-data file `web/src/data/vocare-status.json` and narrated in the style of `docs/metrics.md`, rather than an automated live-fetch chart, since Vocare's repository is not accessible to this site's build process. Updating the snapshot SHALL require editing only that data file, not the page's own code.

#### Scenario: Visitor sees a dated snapshot sourced from the status data file
- **WHEN** a visitor loads `/vocare/current-metrics`
- **THEN** the page shows the dated status fields present in `vocare-status.json`, not a live-fetched chart

### Requirement: Outlook presents forward-looking narrative for the project
The `/vocare/outlook` route SHALL present forward-looking narrative on where the Vocare project is headed beyond its immediate build plan (e.g. market positioning, longer-term product direction).

#### Scenario: Visitor reads the outlook
- **WHEN** a visitor loads `/vocare/outlook`
- **THEN** the page presents forward-looking narrative distinct from the concrete, near-term Build Plan content

### Requirement: Bug List documents real bugs found and fixed in Vocare
The `/vocare/bug-list` route SHALL present a running, dated account of real bugs found and fixed during Vocare's development, sourced from `vocare-status.json`, each entry naming the bug, its real or likely cause, and how it was resolved. The page SHALL honestly state if no entries exist yet, rather than fabricating placeholder bugs.

#### Scenario: Visitor reads a bug-list entry
- **WHEN** a visitor loads `/vocare/bug-list` after at least one entry exists in `vocare-status.json`
- **THEN** the page shows that entry's date, description, and resolution

#### Scenario: Empty bug list is stated honestly
- **WHEN** a visitor loads `/vocare/bug-list` before any entries exist
- **THEN** the page states plainly that no bugs have been logged yet, rather than showing fabricated entries

### Requirement: Testing & Verification describes Vocare's real testing practice
The `/vocare/testing-verification` route SHALL describe Vocare's actual testing practice — what's covered, what isn't, and whether it's automated or manual — sourced from `vocare-status.json`, without overclaiming automation that doesn't exist.

#### Scenario: Visitor reads an accurate account of Vocare's testing practice
- **WHEN** a visitor reads `/vocare/testing-verification`
- **THEN** the copy accurately reflects Vocare's real current testing state as recorded in `vocare-status.json`

### Requirement: Lightbulbs surfaces Vocare-specific idea-capture entries
The `/vocare/lightbulbs` route SHALL render a public listing of idea-capture entries specific to Vocare, sourced from `vocare-status.json`, presenting each idea's title and one-line summary.

#### Scenario: Visitor sees Vocare's own lightbulb ideas
- **WHEN** a visitor loads `/vocare/lightbulbs`
- **THEN** the page lists Vocare-specific idea entries from `vocare-status.json`, not ideas belonging to other projects

### Requirement: Glossary explains Vocare-specific technical terms in plain language
The `/vocare/glossary` route SHALL present a growing list of "X, in layman's terms" entries specific to Vocare's own domain and technical choices, sourced from `vocare-status.json`, each explained without assuming prior technical background.

#### Scenario: Visitor reads a Vocare glossary entry
- **WHEN** a visitor reads an entry on `/vocare/glossary`
- **THEN** the term is explained in plain language, without assuming the reader already knows related jargon

## ADDED Requirements

### Requirement: Vocare hub presents project background and links to its project-record pages
The `/vocare` route SHALL render a heading, a short project-background blurb introducing Vocare, and links to its six project-record pages, in this order: Build Plan, Feature List, Tech Stack, Upgrade Path, Current Metrics, and Outlook. Embedding Vocare's actual live build on this page is explicitly out of scope for this requirement (tracked separately, per `CLAUDE.md`'s silo-homepage convention).

#### Scenario: Visitor sees the hub and its six links
- **WHEN** a visitor loads `/vocare`
- **THEN** the page shows the heading, project-background blurb, and links to each of Build Plan, Feature List, Tech Stack, Upgrade Path, Current Metrics, and Outlook, in that order

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

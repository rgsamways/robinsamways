# farpost-project-record Specification

## Purpose
TBD - created by archiving change left-nav-restructure. Update Purpose after archive.
## Requirements
### Requirement: Build Plan documents forward build sequencing as a living, evolving forecast
The `/farpost/build-plan` route SHALL present the real Farpost rebuild's forward build sequencing as far as it can currently be forecast, explicitly framed in its introductory copy as provisional and expected to change, not a fixed roadmap. It SHALL cross-link to the existing Atlas, Dispatch, and Pulse demo pages where their underlying ideas are slotted into the build plan.

#### Scenario: Visitor reads the build plan's provisional framing
- **WHEN** a visitor loads `/farpost/build-plan`
- **THEN** the introductory copy explicitly states the plan is provisional and will evolve

#### Scenario: Build plan cross-links existing demo pages
- **WHEN** a visitor reads the section of the Build Plan referencing Atlas, Dispatch, or Pulse
- **THEN** each reference links to that piece's existing live demo page

### Requirement: Feature List enumerates real and planned Farpost capabilities, sourced from structured per-silo data
The `/farpost/feature-list` route SHALL enumerate Farpost's real and planned capabilities, each flagged as shipped or planned via the structured status-data file `web/src/data/farpost-status.json` (the same file used by Current Metrics), rather than the shipped/planned flag being hand-maintained separately in page copy. It SHALL cross-link to the existing Atlas, Dispatch, and Pulse demo pages where a listed feature corresponds to one of those pieces' ideas.

#### Scenario: Feature List distinguishes shipped from planned via the shared status data
- **WHEN** a visitor reads the Feature List
- **THEN** each entry's shipped/planned flag matches the value recorded for it in `farpost-status.json`

### Requirement: Tech Stack documents Farpost's converged stack plus any project-specific additions
The `/farpost/tech-stack` route SHALL document the converged siloes stack (Fastify, Drizzle, Postgres, better-auth, per `docs/standard-methodology.md`) as it applies to Farpost, plus any stack items specific to Farpost beyond that shared baseline.

#### Scenario: Visitor sees both shared and Farpost-specific stack items
- **WHEN** a visitor loads `/farpost/tech-stack`
- **THEN** the page distinguishes the shared siloes baseline stack from any items specific to Farpost

### Requirement: Upgrade Path documents planned evolution of the live build
The `/farpost/upgrade-path` route SHALL document planned upgrades or evolutions to the live Farpost build (e.g. infrastructure, dependency, or architecture changes anticipated after initial launch).

#### Scenario: Visitor reads the upgrade path
- **WHEN** a visitor loads `/farpost/upgrade-path`
- **THEN** the page describes at least one concrete planned upgrade beyond the current live build

### Requirement: Current Metrics presents a status snapshot sourced from structured per-silo data, not a live dashboard
The `/farpost/current-metrics` route SHALL present a dated status snapshot of the live Farpost build (e.g. deployment status, real usage or scope indicators), sourced from the structured status-data file `web/src/data/farpost-status.json` and narrated in the style of `docs/metrics.md`, rather than an automated live-fetch chart, since the `siloes/farpost/` repository is not accessible to this site's build process. Updating the snapshot SHALL require editing only that data file, not the page's own code.

#### Scenario: Visitor sees a dated snapshot sourced from the status data file
- **WHEN** a visitor loads `/farpost/current-metrics`
- **THEN** the page shows the dated status fields present in `farpost-status.json`, not a live-fetched chart

#### Scenario: Updating the snapshot doesn't require a content rewrite
- **WHEN** `farpost-status.json`'s fields are updated and the site is redeployed
- **THEN** the Current Metrics page reflects the new values without any change to the page's own component code

### Requirement: Outlook presents forward-looking narrative for the project
The `/farpost/outlook` route SHALL present forward-looking narrative on where the Farpost project is headed beyond its immediate build plan (e.g. market positioning, longer-term product direction).

#### Scenario: Visitor reads the outlook
- **WHEN** a visitor loads `/farpost/outlook`
- **THEN** the page presents forward-looking narrative distinct from the concrete, near-term Build Plan content

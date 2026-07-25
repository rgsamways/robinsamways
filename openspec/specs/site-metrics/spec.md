# site-metrics Specification

## Purpose
TBD - created by archiving change restructure-left-nav. Update Purpose after archive.
## Requirements
### Requirement: Metrics section shows real code-metrics history for the site itself
The `/metrics` route SHALL render a chart or tally of this project's real `scc` snapshot history (code volume, complexity, DRYness over time), sourced from structured data kept in sync with `docs/metrics.md`'s snapshot log — the same content that previously lived at `/dev-log/metrics`, unchanged, just relocated under Site.

#### Scenario: Visitor views the metrics history
- **WHEN** a visitor loads `/metrics`
- **THEN** it displays real historical data points matching `docs/metrics.md`'s logged snapshots, not placeholder or illustrative data

#### Scenario: Old Dev Log Metrics URL redirects
- **WHEN** a visitor navigates to the old `/dev-log/metrics` URL
- **THEN** the browser is redirected permanently to `/metrics`

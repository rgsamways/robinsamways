# dev-log-content Specification

## Purpose
TBD - created by archiving change dev-log-content. Update Purpose after archive.
## Requirements
### Requirement: Dev Log renders real content with a local section menu
The `/dev-log` route SHALL render real content organized into four sections — Glossary, Testing & Verification, Metrics, and bug-log entries — with a local navigation menu beside the page heading linking to each section, replacing the prior placeholder.

#### Scenario: Visitor sees all four sections
- **WHEN** a visitor loads `/dev-log`
- **THEN** the page shows the Glossary, Testing & Verification, Metrics, and bug-log entries sections, in that order

#### Scenario: Local menu links to each section
- **WHEN** a visitor opens the local menu beside the Dev Log heading
- **THEN** the menu includes links to all four sections

### Requirement: Glossary section explains technical terms in plain language
The Glossary section SHALL present a growing list of "X, in layman's terms" entries, launching with at least 5 terms actually used elsewhere on this site (Twilio, OAuth 2.0 Client Credentials Flow, SOQL, Field History Tracking, NFC/RFID), each explained without assuming prior technical background.

#### Scenario: Visitor reads a glossary entry
- **WHEN** a visitor reads a Glossary entry
- **THEN** the term is explained in plain language, without assuming the reader already knows related jargon

### Requirement: Testing & Verification section describes real practice honestly
The Testing & Verification section SHALL describe this project's actual testing practice — real committed suites, what each covers, and that there is still no CI pipeline — adapted from `docs/testing.md` for a public reader, without overclaiming automation that doesn't exist.

#### Scenario: Visitor reads an accurate account of testing practice
- **WHEN** a visitor reads the Testing & Verification section
- **THEN** the copy accurately reflects what test suites exist and explicitly states that running them remains a manual step, not CI-automated

### Requirement: Metrics section shows real code-metrics history
The Metrics section SHALL render a chart or tally of this project's real `scc` snapshot history (code volume, complexity, DRYness over time), sourced from structured data kept in sync with `docs/metrics.md`'s snapshot log.

#### Scenario: Visitor views the metrics history
- **WHEN** a visitor loads the Metrics section
- **THEN** it displays real historical data points matching `docs/metrics.md`'s logged snapshots, not placeholder or illustrative data

### Requirement: Bug-log entries pair a real bug with the concept it reveals
The bug-log entries section SHALL present dated writeups, each pairing a real bug encountered during development with the underlying technical concept it reveals, launching with at least 2 entries adapted from existing `docs/sreditor/` source material.

#### Scenario: Visitor reads a bug-log entry
- **WHEN** a visitor reads a bug-log entry
- **THEN** it describes a real bug actually encountered on this project and explains the underlying concept, written for a developer reader rather than as an internal audit note

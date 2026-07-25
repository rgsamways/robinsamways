# dev-log-content Specification

## Purpose
TBD - created by archiving change dev-log-content. Update Purpose after archive.
## Requirements
### Requirement: Dev Log renders as a hub linking to its entries directly
The `/dev-log` route SHALL render a hub page — a heading, a short intro blurb, and a list of links to every Dev Log entry (the former Code Showcase articles, now direct children of Dev Log, plus any future posts), most recent first — rather than rendering any entry's content directly on `/dev-log` itself, and rather than grouping entries under an intermediate "Code Showcase" heading.

#### Scenario: Visitor sees the hub and its entries
- **WHEN** a visitor loads `/dev-log`
- **THEN** the page shows the heading, intro blurb, and a link to every Dev Log entry, most recent first, with no intermediate "Code Showcase" grouping and no Bug Log/Metrics/Testing & Verification/Glossary links

### Requirement: Dev Log entries present real Farpost code with a plain-language framing and payoff, each at its own route with a timestamp
Every Dev Log entry SHALL showcase one genuine, verified piece of code or real development experience, each at its own route (`/dev-log/<slug>`, no longer nested under a `/dev-log/code-showcase/` prefix). Each entry's page SHALL include: a kicker identifying the project, category, and date; a title; a timestamp shown in UTC alongside its Eastern-time equivalent; 1-2 plain-language framing paragraphs a non-engineer reader can follow; one or more annotated code blocks where applicable; a labeled "The fix" explanation of the technical specifics; and a labeled "Why this matters" explanation translating the fix into a named engineering competency (e.g. root-cause diagnosis, judgment under ambiguity, defensive design, verification discipline). At least the 10 existing entries SHALL remain present under their new flattened routes.

#### Scenario: Visitor reads a Dev Log entry at its own flattened route
- **WHEN** a visitor loads `/dev-log/<slug>` for a given entry
- **THEN** the page shows the kicker, title, UTC/Eastern timestamp, framing paragraphs, real code, "The fix," and "Why this matters," in that order

#### Scenario: Old Code Showcase URLs redirect to the flattened routes
- **WHEN** a visitor navigates to the old `/dev-log/code-showcase/<slug>` URL for an existing entry
- **THEN** the browser is redirected permanently to `/dev-log/<slug>`

#### Scenario: Timestamp shows both UTC and Eastern time
- **WHEN** a visitor reads a Dev Log entry's timestamp
- **THEN** both the UTC time and its Eastern-time equivalent are shown, clearly labeled, so the reader does not need to convert it themselves

#### Scenario: Dev Log entries visually match each other regardless of origin
- **WHEN** a visitor views two Dev Log entries side by side
- **THEN** both use the same code-block and labeled-subsection styling, rather than two different visual systems

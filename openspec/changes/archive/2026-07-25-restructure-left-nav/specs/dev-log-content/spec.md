## REMOVED Requirements

### Requirement: Glossary section explains technical terms in plain language, framed as a communication skill
**Reason**: Superseded by per-Work-project Glossary pages (Farpost's, Vocare's, Sreditor's own technical terms), since a single site-wide glossary no longer fit once every Work project got its own template.
**Migration**: See the `farpost-project-record`, `vocare-project-record`, and `sreditor-project-record` capabilities' own Glossary requirements. Any real entries from the old site-wide glossary should be re-homed under whichever project they actually concern.

### Requirement: Glossary renders at its own route
**Reason**: Superseded — see the requirement above.
**Migration**: `/dev-log/glossary` should redirect to `/dev-log` (the hub); real content moves to each project's own `/glossary` route.

### Requirement: Testing & Verification section describes real practice honestly
**Reason**: Superseded by per-Work-project Testing & Verification pages.
**Migration**: See the `farpost-project-record`, `vocare-project-record`, and `sreditor-project-record` capabilities' own Testing & Verification requirements. The real content this requirement already covers (real committed suites, no CI pipeline) should be re-homed under whichever project it actually describes.

### Requirement: Testing & Verification renders at its own route
**Reason**: Superseded — see the requirement above.
**Migration**: `/dev-log/testing-verification` should redirect to `/dev-log`; real content moves to each project's own `/testing-verification` route.

### Requirement: Metrics section shows real code-metrics history
**Reason**: Moved out of Dev Log entirely, to a new `site-metrics` capability under the Site nav group — this is the site's own code-quality history, not a Dev Log topic.
**Migration**: See the new `site-metrics` capability.

### Requirement: Metrics renders at its own route
**Reason**: Superseded — see the requirement above.
**Migration**: `/dev-log/metrics` should redirect to `/metrics` (its new home under Site).

### Requirement: Bug-log entries pair a real bug with the concept it reveals
**Reason**: Superseded by per-Work-project Bug List pages — bugs are now tracked against the specific project they occurred in, not as a single undifferentiated site-wide list.
**Migration**: See the `farpost-project-record`, `vocare-project-record`, and `sreditor-project-record` capabilities' own Bug List requirements. Existing entries should be re-homed under whichever project they actually concern (the existing entries are Sreditor-sourced, per the original requirement's `docs/sreditor/` note, so they belong under `sreditor-project-record`'s Bug List).

### Requirement: Bug Log renders at its own route
**Reason**: Superseded — see the requirement above.
**Migration**: `/dev-log/bug-log` should redirect to `/dev-log`; real content moves to the relevant project's own `/bug-list` route.

## MODIFIED Requirements

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

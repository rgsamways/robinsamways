## ADDED Requirements

### Requirement: Founder origin story section
The `/farpost` page SHALL open with an `ORIGIN_STORY` section telling the real founding narrative in first person: the rural-availability problem that prompted the dispatch app, the TapLog side-project and its collision with an existing competitor, and the synthesis of TapLog's RFID-tag verification idea into the dispatch app that became Farpost.

#### Scenario: Origin story is the first section on the page
- **WHEN** a visitor loads `/farpost`
- **THEN** the `ORIGIN_STORY` section appears before any other content section on the page

#### Scenario: Origin story is told in first person
- **WHEN** a visitor reads the `ORIGIN_STORY` section
- **THEN** the copy is written in first person ("I built...", "I found out..."), distinct from the resume's third-person voice used elsewhere on the site

### Requirement: Key problems Farpost solves section
The `/farpost` page SHALL include a `PROBLEMS_FARPOST_SOLVES` section covering, at minimum: the "it dies with the owner" knowledge-loss problem as the platform's core value proposition, the rural service-availability gap from the origin story, the lack of cross-professional continuity on a building, the absence of a neutral/portable building history across carriers, and the staleness/decay mechanic for tracked facts.

#### Scenario: Core value proposition is presented first and distinctly
- **WHEN** a visitor reads the `PROBLEMS_FARPOST_SOLVES` section
- **THEN** the "it dies with the owner" problem is presented as the platform's core value proposition, explicitly noting it works for a single owner with zero network effect

#### Scenario: Carrier neutrality is explained
- **WHEN** a visitor reads the section's building-history sub-point
- **THEN** the copy explains why Farpost is carrier-neutral by design and why no insurer would build an equivalent record themselves

### Requirement: Illustrative building lifecycle example
The `/farpost` page SHALL include a `BUILDING_LIFECYCLE_EXAMPLE` section presenting a chronological, dated timeline of events for a single fictional building, explicitly and prominently labeled as fictional rather than a real property, styled consistently with the site's existing status-history timeline pattern (as used in the Salesforce case study's `RelationshipView.tsx`).

#### Scenario: Example is clearly marked as fictional
- **WHEN** a visitor reads the `BUILDING_LIFECYCLE_EXAMPLE` section
- **THEN** the copy explicitly states the example is fictional/illustrative before presenting the timeline itself

#### Scenario: Timeline demonstrates the problems section's claims concretely
- **WHEN** a visitor reads the timeline's dated entries
- **THEN** the entries collectively illustrate the knowledge-persistence, cross-professional, carrier-neutrality, and staleness mechanics described in `PROBLEMS_FARPOST_SOLVES`

### Requirement: Engineering process section
The `/farpost` page SHALL include a `PROCESS` section describing the spec-first, drift-audited development discipline used to build Farpost, and the contemporaneous logging of genuine technical uncertainty consistent with Canadian SR&ED documentation practice.

#### Scenario: Process section describes drift-auditing
- **WHEN** a visitor reads the `PROCESS` section
- **THEN** the copy explains that changes are proposed before being built and are audited for drift between proposed and shipped behavior before being finalized

#### Scenario: Process section does not name the Sreditor product
- **WHEN** a visitor reads the `PROCESS` section's mention of contemporaneous R&D logging
- **THEN** the copy does not name or promote "Sreditor" as a product, since that idea is scoped to stand on its own separately from the Farpost page

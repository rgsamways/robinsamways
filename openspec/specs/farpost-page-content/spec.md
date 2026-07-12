# farpost-page-content Specification

## Purpose
TBD - created by archiving change farpost-page-content. Update Purpose after archive.
## Requirements
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

### Requirement: Farpost renders as a hub with a pill-tab bar to its sub-pieces
The `/farpost` route and all of its sub-pages SHALL display a horizontal pill-tab bar with four tabs — Origins, Atlas, Dispatch, Pulse — each a real navigation link (not a filter) to that piece's own page: `/farpost` (Origins, the default view), `/farpost/farpost-atlas`, `/farpost/farpost-dispatch`, `/farpost/farpost-pulse`. The tab bar SHALL indicate which tab corresponds to the current page. On `/farpost` itself, the tab bar SHALL render below the page's heading and intro blurb, not above them.

#### Scenario: Visitor sees the pill-tab bar on the hub
- **WHEN** a visitor loads `/farpost`
- **THEN** the page shows the "$ Farpost" heading and intro blurb first, followed by the pill-tab bar with Origins, Atlas, Dispatch, and Pulse, with Origins indicated as active

#### Scenario: Visitor navigates between Farpost pieces via the pill bar
- **WHEN** a visitor on `/farpost` activates the "Atlas" pill
- **THEN** the browser navigates to `/farpost/farpost-atlas`, and that page shows the same pill-tab bar with Atlas indicated as active

#### Scenario: The pill bar appears on every Farpost sub-page
- **WHEN** a visitor loads any of `/farpost/farpost-atlas`, `/farpost/farpost-dispatch`, or `/farpost/farpost-pulse`
- **THEN** the same pill-tab bar is present, allowing direct navigation to any other Farpost piece without returning to `/farpost` first

### Requirement: Origins is the hub's default content
The Origin Story, Problems Farpost Solves, Building Lifecycle Example, and Process sections (as already required elsewhere in this capability) SHALL render at `/farpost` itself, as the Origins tab's content — not at a separate sub-route.

#### Scenario: Loading /farpost shows the Origins content directly
- **WHEN** a visitor loads `/farpost`
- **THEN** the page shows the Origin Story, Problems Farpost Solves, Building Lifecycle Example, and Process sections directly, with no intermediate hub-only landing view

### Requirement: Dispatch renders as a placeholder page
The `/farpost/farpost-dispatch` route SHALL render a minimal placeholder page — a heading and a short description of what Farpost Dispatch will be (a Salesforce Experience Cloud partner portal matching field professionals to jobs across rural coverage areas) — clearly marked as not yet built, rather than a 404 or a broken pill.

#### Scenario: Visitor sees the Dispatch placeholder
- **WHEN** a visitor loads `/farpost/farpost-dispatch`
- **THEN** the page shows a heading identifying it as Dispatch and placeholder content describing what it will be, using the site's monospace/terminal styling

### Requirement: Farpost hub has an intro blurb beneath its heading
The `/farpost` page's "$ Farpost" heading SHALL be followed by a short intro blurb (one to two sentences), matching the pattern already used on the Sreditor and Tech/Stacks pages' own headings.

#### Scenario: Visitor sees the intro blurb under the heading
- **WHEN** a visitor loads `/farpost`
- **THEN** the page shows a short intro blurb directly beneath the "$ Farpost" heading, before the pill-tab bar


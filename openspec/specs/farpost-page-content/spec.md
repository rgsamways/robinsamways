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
The `/farpost` route and all of its sub-pages SHALL display a horizontal pill-tab bar with four tabs — Origins, Atlas, Dispatch, Pulse — each a real navigation link (not a filter) to that piece's own page: `/farpost` (Origins, the default view), `/farpost/farpost-atlas`, `/farpost/farpost-dispatch`, `/farpost/farpost-pulse`. The tab bar SHALL indicate which tab corresponds to the current page. On `/farpost` itself, the tab bar SHALL render above the page's heading and intro blurb, matching every other Farpost sub-page's tab-bar placement.

#### Scenario: Visitor sees the pill-tab bar on the hub
- **WHEN** a visitor loads `/farpost`
- **THEN** the page shows the pill-tab bar first, with Origins, Atlas, Dispatch, and Pulse and Origins indicated as active, followed by the "$ Farpost" heading and intro blurb

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

### Requirement: Dispatch renders as a real case-study page
The `/farpost/farpost-dispatch` route SHALL render the real Farpost Dispatch case-study page (its required sections and content are specified by the `farpost-dispatch` capability), replacing the earlier placeholder entirely.

#### Scenario: Visitor sees real content, not a placeholder
- **WHEN** a visitor loads `/farpost/farpost-dispatch`
- **THEN** the page shows the real case-study content — not "coming soon" placeholder text — while still rendering the shared Farpost pill-tab bar with Dispatch indicated as active

### Requirement: Farpost hub has an intro blurb beneath its heading
The `/farpost` page's "$ Farpost" heading SHALL be followed by a short intro blurb (one to two sentences), matching the pattern already used on the Sreditor and Tech/Stacks pages' own headings.

#### Scenario: Visitor sees the intro blurb under the heading
- **WHEN** a visitor loads `/farpost`
- **THEN** the page shows a short intro blurb directly beneath the "$ Farpost" heading, after the pill-tab bar

### Requirement: A pill bar filters the Origins tab's own sections by visibility
The `/farpost` page SHALL display a horizontal row of pills below its "$ Farpost" heading and intro blurb, above the Origin Story section, one pill per section (Origin Story, Problems It Solves, Lifecycle Example, Process). Activating a pill toggles it on or off; when one or more pills are active, only the corresponding sections are shown. With no pills active, all sections are shown. This filter bar is distinct from the existing `FarpostTabBar` pill-tab navigation bar, which continues to render above the heading and link to Farpost's sub-pages.

#### Scenario: Filter bar renders below the heading and intro blurb
- **WHEN** a visitor loads `/farpost`
- **THEN** the pill-tab navigation bar appears first, then the "$ Farpost" heading and intro blurb, then the section-filter pill bar, then the Origin Story section

#### Scenario: Activating a pill isolates its section
- **WHEN** a visitor activates the "Process" pill
- **THEN** only the Process section remains visible; the other three are hidden

#### Scenario: Activating multiple pills shows the union of their sections
- **WHEN** a visitor activates both the "Origin Story" and "Process" pills
- **THEN** both the Origin Story and Process sections are shown, and the other two remain hidden

#### Scenario: Deactivating every pill shows every section again
- **WHEN** a visitor deactivates every active pill
- **THEN** all four sections are shown again


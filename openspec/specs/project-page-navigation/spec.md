# project-page-navigation Specification

## Purpose
TBD - created by archiving change project-navigation-restructure. Update Purpose after archive.
## Requirements
### Requirement: Reusable per-heading local navigation menu
The site SHALL provide a reusable hamburger-menu component, distinct from the global site menu, that can be placed beside any top-level page heading and populated with a page-specific list of links.

#### Scenario: Local menu opens and closes independently of the global menu
- **WHEN** a visitor opens a page's local heading menu
- **THEN** only that menu opens — the global site menu's open/closed state is unaffected

#### Scenario: Local menu items are specific to the page it appears on
- **WHEN** a visitor opens the local menu on two different pages
- **THEN** each menu shows a different set of links, appropriate to that specific page

### Requirement: Farpost's local menu links to its own sections
The `/farpost` page's heading SHALL include a local navigation menu listing links to its own sections.

#### Scenario: Farpost's local menu lists its sections
- **WHEN** a visitor opens the local menu beside the "$ Farpost" heading
- **THEN** the menu includes links to Farpost's own sections (Origin Story, Problems Farpost Solves, Building Lifecycle Example, and Process)

### Requirement: Method's local menu links to its project pages
The `/method` index page's heading SHALL include a local navigation menu listing every individual project page currently published under Method.

#### Scenario: Method's local menu lists the Sreditor project
- **WHEN** a visitor opens the local menu beside the "$ Method" heading
- **THEN** the menu includes a link to the Sreditor project page

### Requirement: Narrative's local menu links to its project pages
The `/narrative` index page's heading SHALL include a local navigation menu listing every individual project page currently published under Narrative.

#### Scenario: Narrative's local menu lists its published projects
- **WHEN** a visitor opens the local menu beside the "$ Narrative" heading
- **THEN** the menu includes a link to the Credential Flow project page and a link to the Farpost Pulse placeholder page

### Requirement: A project page's local menu links to its own sections and back to its parent index
An individual project page (e.g. Credential Flow, Farpost Pulse) SHALL include a local navigation menu listing links to its own sections, plus a link back to the parent index (Method or Narrative) it is published under. Farpost is exempt from the parent-link portion of this requirement — it has no parent index, since it sits at the same top-level tier as Method and Narrative rather than being published under either.

#### Scenario: Credential Flow's local menu lists its sections and links back to Narrative
- **WHEN** a visitor opens the local menu beside the Credential Flow project page's heading
- **THEN** the menu includes links to that page's own sections (Overview, Why Client Credentials Flow, Licensing Limitations, Farpost Parallel, Live Demo, Relationship View, and Setup Gallery), plus a link back to the Narrative index

#### Scenario: Farpost Pulse's local menu lists its sections and links back to Narrative
- **WHEN** a visitor opens the local menu beside the Farpost Pulse landing page's heading
- **THEN** the menu includes links to that page's own sections (Origin Story, Architecture, Tech Stack, Design Notes, and Tech Roster), plus a link back to the Narrative index


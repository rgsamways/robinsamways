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

### Requirement: A project page's local menu links to its own sections and back to its parent index
A Tech/Stacks project page (e.g. Credential Flow) SHALL include a local navigation menu listing links to its own sections, plus a link back to the Tech/Stacks index it is published under. Farpost's own pieces (Origins, Atlas, Dispatch, Pulse) and Sreditor are exempt from the parent-link portion of this requirement: Farpost's pieces already have a persistent pill-tab bar providing direct navigation back to any other Farpost piece, making a duplicate local-menu parent link redundant; Sreditor has no parent index at all, sitting at the top nav tier itself.

#### Scenario: Credential Flow's local menu lists its sections and links back to Tech/Stacks
- **WHEN** a visitor opens the local menu beside the Credential Flow project page's heading
- **THEN** the menu includes links to that page's own sections (Overview, Why Client Credentials Flow, Licensing Limitations, Farpost Parallel, Live Demo, Relationship View, and Setup Gallery), plus a link back to the Tech/Stacks index

#### Scenario: Farpost Pulse's local menu lists its sections without a parent-index link
- **WHEN** a visitor opens the local menu beside the Farpost Pulse landing page's heading
- **THEN** the menu includes links to that page's own sections (Origin Story, Architecture, Tech Stack, Design Notes, and Tech Roster), and no link back to a parent index — the pill-tab bar already provides that navigation

### Requirement: Tech/Stacks' local menu links to its project pages
The `/techstacks` index page's heading SHALL include a local navigation menu listing every individual project page currently published under Tech/Stacks.

#### Scenario: Tech/Stacks' local menu lists its published projects
- **WHEN** a visitor opens the local menu beside the "$ Tech/Stacks" heading
- **THEN** the menu includes a link to the Credential Flow project page


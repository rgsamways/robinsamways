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

### Requirement: Portfolio's local menu links to its project pages
The `/portfolio` index page's heading SHALL include a local navigation menu listing every individual project page currently published under Portfolio.

#### Scenario: Portfolio's local menu lists the Salesforce Loan Demo project
- **WHEN** a visitor opens the local menu beside the "$ Portfolio" heading
- **THEN** the menu includes a link to the Salesforce Loan Demo project page

### Requirement: A project page's local menu links to its own sections
An individual project page (e.g. the Salesforce Loan Demo project page) SHALL include a local navigation menu listing links to its own sections.

#### Scenario: Salesforce Loan Demo's local menu lists its sections
- **WHEN** a visitor opens the local menu beside the Salesforce Loan Demo project page's heading
- **THEN** the menu includes links to that page's own sections (Overview, Why Client Credentials Flow, Licensing Limitations, Farpost Parallel, Live Demo, Relationship View, and Setup Gallery)

### Requirement: Farpost's local menu links to its own sections
The `/farpost` page's heading SHALL include a local navigation menu listing links to its own sections.

#### Scenario: Farpost's local menu lists its sections
- **WHEN** a visitor opens the local menu beside the "$ Farpost" heading
- **THEN** the menu includes links to Farpost's own sections (Origin Story, Problems Farpost Solves, Building Lifecycle Example, and Process)


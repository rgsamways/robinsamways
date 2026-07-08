# site-navigation Specification

## Purpose
TBD - created by archiving change initial-site-scaffold. Update Purpose after archive.
## Requirements
### Requirement: Header exposes a menu toggle
The site header SHALL include a menu button (e.g. hamburger icon) that, when activated, opens a navigation menu listing links to Home, Portfolio, Farpost, and Dev Log, in that order. The menu SHALL be closable by activating the toggle again or by selecting a link.

#### Scenario: Menu opens and closes
- **WHEN** a visitor clicks the menu button
- **THEN** a menu listing Home, Portfolio, Farpost, and Dev Log appears, with Home first
- **WHEN** the visitor clicks the menu button again
- **THEN** the menu closes

#### Scenario: Selecting a link navigates and closes the menu
- **WHEN** a visitor clicks "Portfolio" in the open menu
- **THEN** the browser navigates to the Portfolio page and the menu closes

#### Scenario: Selecting Home navigates to the homepage
- **WHEN** a visitor on a placeholder page clicks "Home" in the open menu
- **THEN** the browser navigates to the homepage and the menu closes

### Requirement: Placeholder routes exist for each menu item
The site SHALL have two placeholder routes — Farpost and Dev Log (at path `/dev-log`) — each rendering a minimal placeholder page (e.g. a heading and short "coming soon" style message) rather than a 404 or external redirect. The Portfolio route SHALL instead render the real case-study content and live demo widget defined by the `salesforce-loan-demo` capability, not a placeholder.

#### Scenario: Portfolio route renders the Salesforce case study
- **WHEN** a visitor navigates to the Portfolio route
- **THEN** a page renders with the Salesforce integration case-study content and live demo widget defined by the `salesforce-loan-demo` capability, using the site's monospace/terminal styling

#### Scenario: Farpost route renders a placeholder page
- **WHEN** a visitor navigates to the Farpost route
- **THEN** a page renders with a heading identifying it as Farpost and placeholder content, using the site's monospace/terminal styling

#### Scenario: Dev Log route renders a placeholder page
- **WHEN** a visitor navigates to the `/dev-log` route
- **THEN** a page renders with a heading identifying it as Dev Log and placeholder content, using the site's monospace/terminal styling

### Requirement: Menu is accessible from every page
The menu toggle SHALL appear in the header on the homepage and on all placeholder pages, so a visitor can navigate between sections from anywhere on the site.

#### Scenario: Menu available on a placeholder page
- **WHEN** a visitor is on the Portfolio placeholder page
- **THEN** the header menu toggle is present and opens the same navigation menu as on the homepage

### Requirement: Header title links to the homepage
The "$ Robin Samways" header text SHALL be a link to the homepage (`/`), available on the homepage itself and on every placeholder page.

#### Scenario: Clicking the header title navigates home
- **WHEN** a visitor on a placeholder page clicks the "$ Robin Samways" header text
- **THEN** the browser navigates to the homepage


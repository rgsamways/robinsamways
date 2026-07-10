## MODIFIED Requirements

### Requirement: Header exposes a menu toggle
The site header SHALL include a menu button (e.g. hamburger icon) that, when activated, opens a navigation menu listing links to Home, Portfolio, Farpost, Dev Log, and Sreditor, in that order. The menu SHALL be closable by activating the toggle again or by selecting a link.

#### Scenario: Menu opens and closes
- **WHEN** a visitor clicks the menu button
- **THEN** a menu listing Home, Portfolio, Farpost, Dev Log, and Sreditor appears, with Home first
- **WHEN** the visitor clicks the menu button again
- **THEN** the menu closes

#### Scenario: Selecting a link navigates and closes the menu
- **WHEN** a visitor clicks "Portfolio" in the open menu
- **THEN** the browser navigates to the Portfolio page and the menu closes

#### Scenario: Selecting Home navigates to the homepage
- **WHEN** a visitor on a placeholder page clicks "Home" in the open menu
- **THEN** the browser navigates to the homepage and the menu closes

### Requirement: Placeholder routes exist for each menu item
The site SHALL have placeholder routes for Farpost's content-bearing sub-pages, Dev Log (at path `/dev-log`), and Sreditor (at path `/sreditor`) — each rendering a minimal placeholder page (e.g. a heading and short "coming soon" style message) rather than a 404 or external redirect. The Portfolio route SHALL render a showcase index of individual project pages, as defined by the `portfolio-index` capability, rather than rendering any single project's case-study content directly.

#### Scenario: Portfolio route renders the showcase index
- **WHEN** a visitor navigates to the Portfolio route
- **THEN** a page renders showing the Portfolio showcase index, with at least one entry linking to the Salesforce Loan Demo project page, using the site's monospace/terminal styling

#### Scenario: Farpost route renders its real content
- **WHEN** a visitor navigates to the Farpost route
- **THEN** a page renders with Farpost's real content (not a placeholder), using the site's monospace/terminal styling

#### Scenario: Dev Log route renders a placeholder page
- **WHEN** a visitor navigates to the `/dev-log` route
- **THEN** a page renders with a heading identifying it as Dev Log and placeholder content, using the site's monospace/terminal styling

#### Scenario: Sreditor route renders a placeholder page
- **WHEN** a visitor navigates to the `/sreditor` route
- **THEN** a page renders with a heading identifying it as Sreditor and placeholder content, using the site's monospace/terminal styling

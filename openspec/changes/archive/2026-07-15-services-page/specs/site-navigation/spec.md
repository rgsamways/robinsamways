## MODIFIED Requirements

### Requirement: Header exposes a menu toggle
The site header SHALL include a menu button (e.g. hamburger icon) that, when activated, opens a navigation menu listing links to Home, Farpost, Sreditor, Tech/Stacks, Dev Log, and Services, in that order. The menu SHALL be closable by activating the toggle again or by selecting a link.

#### Scenario: Menu opens and closes
- **WHEN** a visitor clicks the menu button
- **THEN** a menu listing Home, Farpost, Sreditor, Tech/Stacks, Dev Log, and Services appears, with Home first
- **WHEN** the visitor clicks the menu button again
- **THEN** the menu closes

#### Scenario: Selecting a link navigates and closes the menu
- **WHEN** a visitor clicks "Farpost" in the open menu
- **THEN** the browser navigates to the Farpost page and the menu closes

#### Scenario: Selecting Home navigates to the homepage
- **WHEN** a visitor on any page clicks "Home" in the open menu
- **THEN** the browser navigates to the homepage and the menu closes

### Requirement: Placeholder routes exist for each menu item
The Farpost route SHALL render Farpost's real content (as a hub, per the `farpost-page-content` capability), not a placeholder. The Sreditor route SHALL render Sreditor's real content, as defined by the `sreditor-page-content` capability, not a placeholder. The Tech/Stacks route SHALL render a showcase index of Tech/Stacks-type project pages, as defined by the `tech-stacks-index` capability. The Dev Log route SHALL render its real content, as defined by the `dev-log-content` capability, not a placeholder. The Services route SHALL render its real content, as defined by the `services-page-content` capability, not a placeholder.

#### Scenario: Farpost route renders its hub content
- **WHEN** a visitor navigates to the Farpost route
- **THEN** a page renders with Farpost's real content (not a placeholder), using the site's monospace/terminal styling

#### Scenario: Sreditor route renders its real content
- **WHEN** a visitor navigates to the Sreditor route
- **THEN** a page renders with Sreditor's real content (not a placeholder), using the site's monospace/terminal styling

#### Scenario: Tech/Stacks route renders its showcase index
- **WHEN** a visitor navigates to the Tech/Stacks route
- **THEN** a page renders showing the Tech/Stacks showcase index, with at least one entry linking to the Credential Flow project page, using the site's monospace/terminal styling

#### Scenario: Dev Log route renders its real content
- **WHEN** a visitor navigates to the `/dev-log` route
- **THEN** a page renders with Dev Log's real content (not a placeholder), using the site's monospace/terminal styling

#### Scenario: Services route renders its real content
- **WHEN** a visitor navigates to the `/services` route
- **THEN** a page renders with Services' real content (not a placeholder), using the site's monospace/terminal styling

## MODIFIED Requirements

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

## ADDED Requirements

### Requirement: Header title links to the homepage
The "$ Robin Samways" header text SHALL be a link to the homepage (`/`), available on the homepage itself and on every placeholder page.

#### Scenario: Clicking the header title navigates home
- **WHEN** a visitor on a placeholder page clicks the "$ Robin Samways" header text
- **THEN** the browser navigates to the homepage

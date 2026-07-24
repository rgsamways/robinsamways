## MODIFIED Requirements

### Requirement: Header exposes a menu toggle
On a laptop/desktop viewport, the site SHALL show a persistent left navigation drawer at all times, grouped into sections — **Site** (Home, Services), **Work** (Farpost, Tech/Stacks), **Writing** (Dev Log, Sreditor), and **Ops** (Deploy Runbook) — with no toggle needed to reveal it. On a mobile viewport, the same drawer SHALL be hidden by default behind a menu button that, when activated, slides it into view with a dismissible backdrop; activating the button again, selecting a link, or clicking the backdrop SHALL close it.

#### Scenario: Desktop shows the drawer persistently
- **WHEN** a visitor loads any page at a laptop/desktop viewport width
- **THEN** the grouped navigation drawer (Site, Work, Writing, Ops) is visible without any toggle interaction

#### Scenario: Mobile menu opens and closes
- **WHEN** a visitor at a mobile viewport width clicks the menu button
- **THEN** the navigation drawer slides into view over a backdrop
- **WHEN** the visitor clicks the menu button again, clicks the backdrop, or selects a link
- **THEN** the drawer closes

#### Scenario: Selecting a link navigates and closes the drawer
- **WHEN** a visitor at a mobile viewport clicks "Farpost" in the open drawer
- **THEN** the browser navigates to the Farpost page and the drawer closes

#### Scenario: Selecting Home navigates to the homepage
- **WHEN** a visitor on any page selects "Home" in the drawer
- **THEN** the browser navigates to the homepage

### Requirement: Menu is accessible from every page
The navigation drawer (persistent on desktop, toggle-revealed on mobile) SHALL be present on every page of the site, so a visitor can navigate between sections from anywhere.

#### Scenario: Drawer available on any page
- **WHEN** a visitor is on any page of the site (e.g. the Sreditor page)
- **THEN** the same navigation drawer is present and functions identically to how it does on the homepage

### Requirement: Header title links to the homepage
The "$ Robin Samways" title SHALL appear at the top of the navigation drawer and SHALL be a link to the homepage (`/`), available on every page of the site.

#### Scenario: Clicking the title navigates home
- **WHEN** a visitor on any page clicks the "$ Robin Samways" title at the top of the drawer
- **THEN** the browser navigates to the homepage

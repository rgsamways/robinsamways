# site-navigation Specification

## Purpose
TBD - created by archiving change initial-site-scaffold. Update Purpose after archive.
## Requirements
### Requirement: Header exposes a menu toggle
On a laptop/desktop viewport, the site SHALL show a persistent left navigation drawer at all times, grouped into sections — **Site** (Home, Services), **Work** (Farpost, Vocare, Experiments), **Writing** (Dev Log, Sreditor), and **Ops** (Deploy Runbook) — with no toggle needed to reveal it. The Farpost entry and the Vocare entry under Work, and the Dev Log entry under Writing, SHALL each render as collapsible groups with their own child links (per the "Collapsible nav groups expand and collapse, auto-expanded on the active route" requirement), rather than plain links. On a mobile viewport, the same drawer SHALL be hidden by default behind a menu button that, when activated, slides it into view with a dismissible backdrop; activating the button again, selecting a link, or clicking the backdrop SHALL close it.

#### Scenario: Desktop shows the drawer persistently
- **WHEN** a visitor loads any page at a laptop/desktop viewport width
- **THEN** the grouped navigation drawer (Site, Work, Writing, Ops) is visible without any toggle interaction

#### Scenario: Mobile menu opens and closes
- **WHEN** a visitor at a mobile viewport width clicks the menu button
- **THEN** the navigation drawer slides into view over a backdrop
- **WHEN** the visitor clicks the menu button again, clicks the backdrop, or selects a link
- **THEN** the drawer closes

#### Scenario: Selecting a link navigates and closes the drawer
- **WHEN** a visitor at a mobile viewport clicks "Experiments" in the open drawer
- **THEN** the browser navigates to the Experiments (Tech/Stacks) page and the drawer closes

#### Scenario: Selecting Home navigates to the homepage
- **WHEN** a visitor on any page selects "Home" in the drawer
- **THEN** the browser navigates to the homepage

### Requirement: Collapsible nav groups expand and collapse, auto-expanded on the active route
A nav entry with child links (Farpost under Work; Dev Log under Writing; Code Showcase under Dev Log) SHALL render with a toggle control that shows or hides its children. A group SHALL render expanded by default whenever the current route matches the group's own link or any descendant's link, and collapsed otherwise, unless the visitor has manually toggled that group during the current session, in which case the manual state SHALL take precedence until the page is reloaded.

#### Scenario: Visiting a child route auto-expands its ancestor groups
- **WHEN** a visitor loads `/farpost/build-plan`
- **THEN** the Farpost group under Work is shown expanded, with Build Plan visible among its children

#### Scenario: A collapsed group can be expanded manually
- **WHEN** a visitor on an unrelated page clicks the toggle next to "Farpost"
- **THEN** the Farpost group expands to show its child links, without navigating away from the current page

#### Scenario: Manually collapsing the active group keeps it collapsed
- **WHEN** a visitor on `/dev-log/code-showcase/some-article` clicks the toggle to collapse the Code Showcase group
- **THEN** the group collapses and stays collapsed despite its own route being active, until the page reloads

### Requirement: Work group's Farpost entry links to a collapsible submenu of project-record pages
The Work group's "Farpost" entry SHALL be a link to `/farpost` (rendering Farpost's Origins content, unchanged) and SHALL also expose a collapsible submenu of the `farpost-project-record` capability's pages: Build Plan, Feature List, Tech Stack, Upgrade Path, Current Metrics, and Outlook, in that order. The existing Atlas/Dispatch/Pulse pieces remain reachable via `/farpost`'s own on-page tab bar and are not duplicated in this submenu.

#### Scenario: Farpost submenu lists the six project-record pages
- **WHEN** a visitor expands the Farpost group under Work
- **THEN** the submenu shows Build Plan, Feature List, Tech Stack, Upgrade Path, Current Metrics, and Outlook, in that order, and does not list Atlas, Dispatch, or Pulse

### Requirement: Work group's Vocare entry links to a collapsible submenu of project-record pages
The Work group's "Vocare" entry SHALL be a link to `/vocare` (rendering a short hub landing, per the `vocare-project-record` capability) and SHALL also expose a collapsible submenu of that capability's pages: Build Plan, Feature List, Tech Stack, Upgrade Path, Current Metrics, and Outlook, in that order.

#### Scenario: Vocare submenu lists the six project-record pages
- **WHEN** a visitor expands the Vocare group under Work
- **THEN** the submenu shows Build Plan, Feature List, Tech Stack, Upgrade Path, Current Metrics, and Outlook, in that order

### Requirement: Writing group's Dev Log entry links to a collapsible submenu of Dev Log pages
The Writing group's "Dev Log" entry SHALL be a link to `/dev-log` (rendering a short hub landing, per the `dev-log-content` capability) and SHALL also expose a collapsible submenu listing Bug Log, Metrics, Testing & Verification, Glossary, Code Showcase, and Lightbulbs, in that order. The Code Showcase entry SHALL itself be a further collapsible submenu listing every published article.

#### Scenario: Dev Log submenu lists its six sub-pages
- **WHEN** a visitor expands the Dev Log group under Writing
- **THEN** the submenu shows Bug Log, Metrics, Testing & Verification, Glossary, Code Showcase, and Lightbulbs, in that order

#### Scenario: Code Showcase submenu lists every article
- **WHEN** a visitor expands the Code Showcase entry within the Dev Log submenu
- **THEN** the submenu lists every published Code Showcase article by title

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

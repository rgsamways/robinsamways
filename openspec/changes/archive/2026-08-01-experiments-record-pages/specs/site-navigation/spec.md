## MODIFIED Requirements

### Requirement: Header exposes a menu toggle
On a laptop/desktop viewport, the site SHALL show a persistent left navigation drawer at all times, grouped into sections — **Site** (Home, Services, Metrics, Contact), **Work** (Farpost, Vocare, Sreditor), **Experiments** (Atlas, Dispatch, Pulse, Credential Flow, View All), **Writing** (Dev Log), and **Ops** (Deploy Runbook) — with no toggle needed to reveal it. The Farpost, Vocare, and Sreditor entries under Work; the Atlas, Dispatch, Pulse, and Credential Flow entries under Experiments; and the Dev Log entry under Writing SHALL each render as collapsible groups with their own child links (per the "Collapsible nav groups expand and collapse, auto-expanded on the active route" requirement), rather than plain links. The Experiments group's "View All" entry is a plain link with no children, matching Dev Log's own "View All" entry. On a mobile viewport, the drawer SHALL be hidden by default behind a menu button positioned in a shared icon cluster at the top-right of the viewport, alongside the site's Account-or-Sign-In icon and Settings icon (per the `account-hub-stub` capability) — the brand pill on the opposite, top-left side of the same bar is the only other control in that row. Activating the menu button SHALL open the navigation as a full-viewport takeover, not a narrow slide-in panel: no other page content or backdrop remains visible while it's open. Pressing Escape, activating the panel's own explicit close control, or selecting a link SHALL close it — the menu button itself is covered by the open panel and isn't reachable again while it's open, so there is no click-to-toggle path back through it, and there is no backdrop to click either, since nothing else is visible while it's open.

#### Scenario: Desktop shows the drawer persistently
- **WHEN** a visitor loads any page at a laptop/desktop viewport width
- **THEN** the grouped navigation drawer (Site, Work, Experiments, Writing, Ops) is visible without any toggle interaction

#### Scenario: Site group includes Contact
- **WHEN** a visitor views the Site group in the navigation drawer
- **THEN** it lists Home, Services, Metrics, and Contact, in that order

#### Scenario: Mobile menu opens as a full-viewport takeover
- **WHEN** a visitor at a mobile viewport width activates the menu button
- **THEN** the navigation opens covering the entire viewport, with no other page content or backdrop visible behind it

#### Scenario: Escape closes the open mobile nav without navigating
- **WHEN** a visitor at a mobile viewport has the full-viewport nav open and presses Escape
- **THEN** the nav closes and no navigation occurs

#### Scenario: Selecting a link navigates and closes the mobile nav
- **WHEN** a visitor at a mobile viewport clicks "Experiments" in the open full-viewport nav
- **THEN** the browser navigates to the Experiments index page and the nav closes

#### Scenario: Selecting Home navigates to the homepage
- **WHEN** a visitor on any page selects "Home" in the drawer
- **THEN** the browser navigates to the homepage

### Requirement: Collapsible nav groups expand and collapse, auto-expanded on the active route
A nav entry with child links (Farpost, Vocare, and Sreditor under Work; Atlas, Dispatch, Pulse, and Credential Flow under Experiments; Dev Log under Writing) SHALL render with a toggle control that shows or hides its children. A group SHALL render expanded by default whenever the current route matches the group's own link or any descendant's link, and collapsed otherwise, unless the visitor has manually toggled that group during the current session, in which case the manual state SHALL take precedence until the page is reloaded.

#### Scenario: Visiting a child route auto-expands its ancestor groups
- **WHEN** a visitor loads `/farpost/build-plan`
- **THEN** the Farpost group under Work is shown expanded, with Build Plan visible among its children

#### Scenario: Visiting an Experiment's sub-page auto-expands its group
- **WHEN** a visitor loads `/techstacks/farpost-atlas/architecture`
- **THEN** the Atlas group under Experiments is shown expanded, with Architecture visible among its children

#### Scenario: A collapsed group can be expanded manually
- **WHEN** a visitor on an unrelated page clicks the toggle next to "Farpost"
- **THEN** the Farpost group expands to show its child links, without navigating away from the current page

#### Scenario: Manually collapsing the active group keeps it collapsed
- **WHEN** a visitor on `/vocare/glossary` clicks the toggle to collapse the Vocare group
- **THEN** the group collapses and stays collapsed despite its own route being active, until the page reloads

### Requirement: Experiments is a top-level nav group, not nested under Work
The Experiments group SHALL render as a top-level entry in the navigation drawer, a sibling of Site, Work, Writing, and Ops, rather than a child of Work. Its links SHALL be Atlas, Dispatch, Pulse, and Credential Flow directly — each its own link with its own collapsible submenu of the `experiment-record` page shape (per that piece's own capability spec) — followed by a trailing "View All" plain link to `/techstacks`, mirroring Dev Log's own trailing "View All" pattern. There SHALL be no intermediate link also labeled "Experiments" containing the four pieces — that redundant node from the prior implementation is removed.

#### Scenario: Experiments appears at the top level, not under Work
- **WHEN** a visitor views the collapsed navigation drawer
- **THEN** Experiments appears as its own top-level entry alongside Site, Work, Writing, and Ops, and expanding Work does not reveal an Experiments child

#### Scenario: Experiments' links are the four pieces directly, with no redundant middle node
- **WHEN** a visitor expands the Experiments group
- **THEN** the group's direct links are Atlas, Dispatch, Pulse, Credential Flow, and View All, in that order, with no link also labeled "Experiments" among them

#### Scenario: View All links to the showcase index
- **WHEN** a visitor clicks "View All" under Experiments
- **THEN** the browser navigates to `/techstacks`, the filterable showcase index

#### Scenario: Each Experiment entry expands its own submenu
- **WHEN** a visitor expands the "Atlas" entry under Experiments
- **THEN** its submenu shows Tech Stack, Architecture, Object Model, Design Notes, AI Notes, and Setup Gallery, in that order

### Requirement: Placeholder routes exist for each menu item
The Farpost route SHALL render Farpost's real content (as a hub, per the `farpost-page-content` capability), not a placeholder. The Sreditor route SHALL render Sreditor's real content, as defined by the `sreditor-page-content` capability, not a placeholder. The Experiments route SHALL render a showcase index of pieces, as defined by the `tech-stacks-index` capability. The Dev Log route SHALL render its real content, as defined by the `dev-log-content` capability, not a placeholder. The Services route SHALL render its real content, as defined by the `services-page-content` capability, not a placeholder. The site's Metrics route (under Site) SHALL render its real content, unchanged in content from its prior location under Dev Log. Each Experiment's own route (`/techstacks/farpost-atlas`, `/techstacks/farpost-dispatch`, `/techstacks/farpost-pulse`, `/techstacks/credential-flow`) SHALL continue to render that piece's existing landing content unchanged, serving as that piece's "Overview" without a separate `Overview` child link — matching how `/farpost`, `/vocare`, and `/sreditor` each serve as their own overview rather than appearing as an `Overview` child under themselves.

#### Scenario: Farpost route renders its hub content
- **WHEN** a visitor navigates to the Farpost route
- **THEN** a page renders with Farpost's real content (not a placeholder), using the site's monospace/terminal styling

#### Scenario: Sreditor route renders its real content
- **WHEN** a visitor navigates to the Sreditor route
- **THEN** a page renders with Sreditor's real content (not a placeholder), using the site's monospace/terminal styling

#### Scenario: Experiments route renders its showcase index
- **WHEN** a visitor navigates to the Experiments route
- **THEN** a page renders showing the Experiments showcase index, with entries linking to Atlas, Dispatch, Pulse, and Credential Flow, using the site's monospace/terminal styling

#### Scenario: Dev Log route renders its real content
- **WHEN** a visitor navigates to the `/dev-log` route
- **THEN** a page renders with Dev Log's real content (not a placeholder), using the site's monospace/terminal styling

#### Scenario: Services route renders its real content
- **WHEN** a visitor navigates to the `/services` route
- **THEN** a page renders with Services' real content (not a placeholder), using the site's monospace/terminal styling

#### Scenario: Site's Metrics route renders under Site, unchanged in content
- **WHEN** a visitor navigates to the Metrics route under Site
- **THEN** the page renders the same real scc-metrics content that previously lived under Dev Log

#### Scenario: An Experiment's own route still renders its existing landing content
- **WHEN** a visitor navigates to `/techstacks/farpost-atlas`
- **THEN** the page renders the same case-study narrative and interactive map it rendered before this change, with no separate "Overview" link required to reach it

## ADDED Requirements

### Requirement: Experiments group's Atlas entry links to a collapsible submenu of experiment-record pages
The Experiments group's "Atlas" entry SHALL be a link to `/techstacks/farpost-atlas` (rendering Atlas's existing landing content, unchanged) and SHALL also expose a collapsible submenu of six pages: Tech Stack, Architecture, Object Model, Design Notes, AI Notes, and Setup Gallery, in that order, per the `farpost-atlas` capability's page requirements.

#### Scenario: Atlas submenu lists its six pages
- **WHEN** a visitor expands the Atlas entry under Experiments
- **THEN** the submenu shows Tech Stack, Architecture, Object Model, Design Notes, AI Notes, and Setup Gallery, in that order

### Requirement: Experiments group's Dispatch entry links to a collapsible submenu of experiment-record pages
The Experiments group's "Dispatch" entry SHALL be a link to `/techstacks/farpost-dispatch` (rendering Dispatch's existing landing content, unchanged) and SHALL also expose a collapsible submenu of the same six pages — Tech Stack, Architecture, Object Model, Design Notes, AI Notes, and Setup Gallery, in that order — per the `farpost-dispatch` capability's page requirements.

#### Scenario: Dispatch submenu lists its six pages
- **WHEN** a visitor expands the Dispatch entry under Experiments
- **THEN** the submenu shows Tech Stack, Architecture, Object Model, Design Notes, AI Notes, and Setup Gallery, in that order

### Requirement: Experiments group's Pulse entry links to a collapsible submenu of experiment-record pages
The Experiments group's "Pulse" entry SHALL be a link to `/techstacks/farpost-pulse` (rendering Pulse's existing landing content, unchanged) and SHALL also expose a collapsible submenu of the same six pages — Tech Stack, Architecture, Object Model, Design Notes, AI Notes, and Setup Gallery, in that order — per the `farpost-pulse` capability's page requirements.

#### Scenario: Pulse submenu lists its six pages
- **WHEN** a visitor expands the Pulse entry under Experiments
- **THEN** the submenu shows Tech Stack, Architecture, Object Model, Design Notes, AI Notes, and Setup Gallery, in that order

### Requirement: Experiments group's Credential Flow entry links to a collapsible submenu of experiment-record pages
The Experiments group's "Credential Flow" entry SHALL be a link to `/techstacks/credential-flow` (rendering Credential Flow's existing landing content, unchanged) and SHALL also expose a collapsible submenu of the same six pages — Tech Stack, Architecture, Object Model, Design Notes, AI Notes, and Setup Gallery, in that order — per the `salesforce-loan-demo` capability's page requirements.

#### Scenario: Credential Flow submenu lists its six pages
- **WHEN** a visitor expands the Credential Flow entry under Experiments
- **THEN** the submenu shows Tech Stack, Architecture, Object Model, Design Notes, AI Notes, and Setup Gallery, in that order

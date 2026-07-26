# site-navigation Specification

## Purpose
TBD - created by archiving change initial-site-scaffold. Update Purpose after archive.
## Requirements
### Requirement: Header exposes a menu toggle
On a laptop/desktop viewport, the site SHALL show a persistent left navigation drawer at all times, grouped into sections — **Site** (Home, Services, Metrics, Contact), **Work** (Farpost, Vocare, Sreditor), **Experiments** (Atlas, Dispatch, Pulse, Credential Flow), **Writing** (Dev Log), and **Ops** (Deploy Runbook) — with no toggle needed to reveal it. The Farpost, Vocare, and Sreditor entries under Work; the Experiments group itself; and the Dev Log entry under Writing SHALL each render as collapsible groups with their own child links (per the "Collapsible nav groups expand and collapse, auto-expanded on the active route" requirement), rather than plain links. On a mobile viewport, the drawer SHALL be hidden by default behind a menu button positioned in a shared icon cluster at the top-right of the viewport, alongside the site's Account-or-Sign-In icon and Settings icon (per the `account-hub-stub` capability) — the brand pill on the opposite, top-left side of the same bar is the only other control in that row. Activating the menu button SHALL open the navigation as a full-viewport takeover, not a narrow slide-in panel: no other page content or backdrop remains visible while it's open. Pressing Escape, activating the panel's own explicit close control, or selecting a link SHALL close it — the menu button itself is covered by the open panel and isn't reachable again while it's open, so there is no click-to-toggle path back through it, and there is no backdrop to click either, since nothing else is visible while it's open.

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
A nav entry with child links (Farpost, Vocare, and Sreditor under Work; the Experiments group; Dev Log under Writing) SHALL render with a toggle control that shows or hides its children. A group SHALL render expanded by default whenever the current route matches the group's own link or any descendant's link, and collapsed otherwise, unless the visitor has manually toggled that group during the current session, in which case the manual state SHALL take precedence until the page is reloaded.

#### Scenario: Visiting a child route auto-expands its ancestor groups
- **WHEN** a visitor loads `/farpost/build-plan`
- **THEN** the Farpost group under Work is shown expanded, with Build Plan visible among its children

#### Scenario: A collapsed group can be expanded manually
- **WHEN** a visitor on an unrelated page clicks the toggle next to "Farpost"
- **THEN** the Farpost group expands to show its child links, without navigating away from the current page

#### Scenario: Manually collapsing the active group keeps it collapsed
- **WHEN** a visitor on `/vocare/glossary` clicks the toggle to collapse the Vocare group
- **THEN** the group collapses and stays collapsed despite its own route being active, until the page reloads

### Requirement: Work group's Farpost entry links to a collapsible submenu of project-record pages
The Work group's "Farpost" entry SHALL be a link to `/farpost` (rendering Farpost's Origins content, unchanged) and SHALL also expose a collapsible submenu of the `farpost-project-record` capability's pages: Build Plan, Feature List, Tech Stack, Upgrade Path, Current Metrics, Outlook, Bug List, Testing & Verification, Lightbulbs, and Glossary, in that order. Atlas, Dispatch, and Pulse are no longer reachable from this submenu or from Farpost's own page — they are surfaced under the top-level Experiments group instead.

#### Scenario: Farpost submenu lists the ten project-record pages
- **WHEN** a visitor expands the Farpost group under Work
- **THEN** the submenu shows Build Plan, Feature List, Tech Stack, Upgrade Path, Current Metrics, Outlook, Bug List, Testing & Verification, Lightbulbs, and Glossary, in that order, and does not list Atlas, Dispatch, or Pulse

### Requirement: Work group's Vocare entry links to a collapsible submenu of project-record pages
The Work group's "Vocare" entry SHALL be a link to `/vocare` (rendering a short hub landing, per the `vocare-project-record` capability) and SHALL also expose a collapsible submenu of that capability's pages: Build Plan, Feature List, Tech Stack, Upgrade Path, Current Metrics, Outlook, Bug List, Testing & Verification, Lightbulbs, and Glossary, in that order.

#### Scenario: Vocare submenu lists the ten project-record pages
- **WHEN** a visitor expands the Vocare group under Work
- **THEN** the submenu shows Build Plan, Feature List, Tech Stack, Upgrade Path, Current Metrics, Outlook, Bug List, Testing & Verification, Lightbulbs, and Glossary, in that order

### Requirement: Work group's Sreditor entry links to a collapsible submenu of project-record pages
The Work group's "Sreditor" entry SHALL be a link to `/sreditor` (rendering Sreditor's existing hub content, unchanged, per `sreditor-page-content`) and SHALL also expose a collapsible submenu of the `sreditor-project-record` capability's pages: Build Plan, Feature List, Tech Stack, Upgrade Path, Current Metrics, Outlook, Bug List, Testing & Verification, Lightbulbs, and Glossary, in that order.

#### Scenario: Sreditor submenu lists the ten project-record pages
- **WHEN** a visitor expands the Sreditor group under Work
- **THEN** the submenu shows Build Plan, Feature List, Tech Stack, Upgrade Path, Current Metrics, Outlook, Bug List, Testing & Verification, Lightbulbs, and Glossary, in that order

### Requirement: Experiments is a top-level nav group, not nested under Work
The Experiments group SHALL render as a top-level entry in the navigation drawer, a sibling of Site, Work, Writing, and Ops, rather than a child of Work. It SHALL expose a collapsible submenu listing Atlas, Dispatch, Pulse, and Credential Flow.

#### Scenario: Experiments appears at the top level, not under Work
- **WHEN** a visitor views the collapsed navigation drawer
- **THEN** Experiments appears as its own top-level entry alongside Site, Work, Writing, and Ops, and expanding Work does not reveal an Experiments child

#### Scenario: Experiments submenu lists its four pieces
- **WHEN** a visitor expands the Experiments group
- **THEN** the submenu shows Atlas, Dispatch, Pulse, and Credential Flow

### Requirement: Writing group's Dev Log entry links to a collapsible submenu of Dev Log pages
The Writing group's "Dev Log" entry SHALL be a link to `/dev-log` (rendering a short hub landing, per the `dev-log-content` capability) and SHALL also expose a collapsible submenu listing the 5 most recently published Dev Log entries by title, most recent first, followed by a trailing "View All" link to `/dev-log` — not every entry, since Dev Log is an unbounded, growing stream rather than a fixed page set. Dev Log no longer has Bug Log, Metrics, Testing & Verification, Glossary, or Lightbulbs as its own sub-pages — that content now lives per-Work-project (or, for Metrics, under Site).

#### Scenario: Dev Log submenu lists the 5 most recent entries plus View All
- **WHEN** a visitor expands the Dev Log group under Writing, and more than 5 Dev Log entries exist
- **THEN** the submenu lists the 5 most recently published entries by title, most recent first, followed by a "View All" link to `/dev-log`, with no "Code Showcase" grouping node anywhere in the tree

#### Scenario: Fewer than 5 entries exist
- **WHEN** fewer than 5 Dev Log entries exist
- **THEN** the submenu lists all of them, most recent first, still followed by the "View All" link

### Requirement: Placeholder routes exist for each menu item
The Farpost route SHALL render Farpost's real content (as a hub, per the `farpost-page-content` capability), not a placeholder. The Sreditor route SHALL render Sreditor's real content, as defined by the `sreditor-page-content` capability, not a placeholder. The Experiments route SHALL render a showcase index of pieces, as defined by the `tech-stacks-index` capability. The Dev Log route SHALL render its real content, as defined by the `dev-log-content` capability, not a placeholder. The Services route SHALL render its real content, as defined by the `services-page-content` capability, not a placeholder. The site's Metrics route (under Site) SHALL render its real content, unchanged in content from its prior location under Dev Log.

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

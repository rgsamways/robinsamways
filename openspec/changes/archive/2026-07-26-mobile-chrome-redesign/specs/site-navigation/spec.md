## MODIFIED Requirements

### Requirement: Header exposes a menu toggle
On a laptop/desktop viewport, the site SHALL show a persistent left navigation drawer at all times, grouped into sections — **Site** (Home, Services, Metrics), **Work** (Farpost, Vocare, Sreditor), **Experiments** (Atlas, Dispatch, Pulse, Credential Flow), **Writing** (Dev Log), and **Ops** (Deploy Runbook) — with no toggle needed to reveal it. The Farpost, Vocare, and Sreditor entries under Work; the Experiments group itself; and the Dev Log entry under Writing SHALL each render as collapsible groups with their own child links (per the "Collapsible nav groups expand and collapse, auto-expanded on the active route" requirement), rather than plain links. On a mobile viewport, the drawer SHALL be hidden by default behind a menu button positioned in a shared icon cluster at the top-right of the viewport, alongside the site's Account-or-Sign-In icon and Settings icon (per the `account-hub-stub` capability) — the brand pill on the opposite, top-left side of the same bar is the only other control in that row. Activating the menu button SHALL open the navigation as a full-viewport takeover, not a narrow slide-in panel: no other page content or backdrop remains visible while it's open. Activating the menu button again, pressing Escape, or selecting a link SHALL close it; there is no backdrop to click, since nothing else is visible while it's open.

#### Scenario: Desktop shows the drawer persistently
- **WHEN** a visitor loads any page at a laptop/desktop viewport width
- **THEN** the grouped navigation drawer (Site, Work, Experiments, Writing, Ops) is visible without any toggle interaction

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

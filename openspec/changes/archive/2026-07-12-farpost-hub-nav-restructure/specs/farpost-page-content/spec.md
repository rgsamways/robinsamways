## ADDED Requirements

### Requirement: Farpost renders as a hub with a pill-tab bar to its sub-pieces
The `/farpost` route and all of its sub-pages SHALL display a horizontal pill-tab bar with four tabs — Origins, Atlas, Dispatch, Pulse — each a real navigation link (not a filter) to that piece's own page: `/farpost` (Origins, the default view), `/farpost/farpost-atlas`, `/farpost/farpost-dispatch`, `/farpost/farpost-pulse`. The tab bar SHALL indicate which tab corresponds to the current page.

#### Scenario: Visitor sees the pill-tab bar on the hub
- **WHEN** a visitor loads `/farpost`
- **THEN** the page shows the pill-tab bar with Origins, Atlas, Dispatch, and Pulse, with Origins indicated as active

#### Scenario: Visitor navigates between Farpost pieces via the pill bar
- **WHEN** a visitor on `/farpost` activates the "Atlas" pill
- **THEN** the browser navigates to `/farpost/farpost-atlas`, and that page shows the same pill-tab bar with Atlas indicated as active

#### Scenario: The pill bar appears on every Farpost sub-page
- **WHEN** a visitor loads any of `/farpost/farpost-atlas`, `/farpost/farpost-dispatch`, or `/farpost/farpost-pulse`
- **THEN** the same pill-tab bar is present, allowing direct navigation to any other Farpost piece without returning to `/farpost` first

### Requirement: Origins is the hub's default content
The Origin Story, Problems Farpost Solves, Building Lifecycle Example, and Process sections (as already required elsewhere in this capability) SHALL render at `/farpost` itself, as the Origins tab's content — not at a separate sub-route.

#### Scenario: Loading /farpost shows the Origins content directly
- **WHEN** a visitor loads `/farpost`
- **THEN** the page shows the Origin Story, Problems Farpost Solves, Building Lifecycle Example, and Process sections directly, with no intermediate hub-only landing view

### Requirement: Dispatch renders as a placeholder page
The `/farpost/farpost-dispatch` route SHALL render a minimal placeholder page — a heading and a short description of what Farpost Dispatch will be (a Salesforce Experience Cloud partner portal matching field professionals to jobs across rural coverage areas) — clearly marked as not yet built, rather than a 404 or a broken pill.

#### Scenario: Visitor sees the Dispatch placeholder
- **WHEN** a visitor loads `/farpost/farpost-dispatch`
- **THEN** the page shows a heading identifying it as Dispatch and placeholder content describing what it will be, using the site's monospace/terminal styling

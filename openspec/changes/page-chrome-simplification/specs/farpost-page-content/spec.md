## MODIFIED Requirements

### Requirement: Farpost renders as a hub with a pill-tab bar to its sub-pieces
The `/farpost` route and all of its sub-pages SHALL display a horizontal pill-tab bar with four tabs — Origins, Atlas, Dispatch, Pulse — each a real navigation link (not a filter) to that piece's own page: `/farpost` (Origins, the default view), `/farpost/farpost-atlas`, `/farpost/farpost-dispatch`, `/farpost/farpost-pulse`. The tab bar SHALL indicate which tab corresponds to the current page. On `/farpost` itself, the tab bar SHALL render below the page's heading and intro blurb, not above them.

#### Scenario: Visitor sees the pill-tab bar on the hub
- **WHEN** a visitor loads `/farpost`
- **THEN** the page shows the "$ Farpost" heading and intro blurb first, followed by the pill-tab bar with Origins, Atlas, Dispatch, and Pulse, with Origins indicated as active

#### Scenario: Visitor navigates between Farpost pieces via the pill bar
- **WHEN** a visitor on `/farpost` activates the "Atlas" pill
- **THEN** the browser navigates to `/farpost/farpost-atlas`, and that page shows the same pill-tab bar with Atlas indicated as active

#### Scenario: The pill bar appears on every Farpost sub-page
- **WHEN** a visitor loads any of `/farpost/farpost-atlas`, `/farpost/farpost-dispatch`, or `/farpost/farpost-pulse`
- **THEN** the same pill-tab bar is present, allowing direct navigation to any other Farpost piece without returning to `/farpost` first

## ADDED Requirements

### Requirement: Farpost hub has an intro blurb beneath its heading
The `/farpost` page's "$ Farpost" heading SHALL be followed by a short intro blurb (one to two sentences), matching the pattern already used on the Sreditor and Tech/Stacks pages' own headings.

#### Scenario: Visitor sees the intro blurb under the heading
- **WHEN** a visitor loads `/farpost`
- **THEN** the page shows a short intro blurb directly beneath the "$ Farpost" heading, before the pill-tab bar

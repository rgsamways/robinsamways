## MODIFIED Requirements

### Requirement: A page with real section structure surfaces an outline trigger
On desktop viewports only, the system SHALL render an "on this page" outline as an always-visible inline anchor list in the widened right rail, whenever the current page has two or more `SectionHeader` sections, derived at runtime from the page's actual rendered headings — not from a hand-maintained per-page list. On mobile viewports, the outline is not shown at all — no trigger, no access point.

#### Scenario: A page with two or more sections shows the inline outline on desktop
- **WHEN** a visitor at a desktop viewport loads a page containing two or more `SectionHeader` sections
- **THEN** an inline "on this page" anchor list appears in the right rail, with no click needed to reveal it

#### Scenario: A page with fewer than two sections shows no outline
- **WHEN** a visitor loads a page containing zero or one `SectionHeader` sections
- **THEN** no outline appears anywhere, on any viewport

#### Scenario: Mobile shows no outline regardless of section count
- **WHEN** a visitor at a mobile viewport loads a page with two or more `SectionHeader` sections
- **THEN** no outline trigger or list appears anywhere on that page

### Requirement: The outline lists the page's real sections in document order
The inline outline SHALL list every `SectionHeader` section on the current page, in the order they appear in the document, each as a clickable link to its section.

#### Scenario: The outline shows every section
- **WHEN** a visitor at a desktop viewport views a page with several sections
- **THEN** the outline lists each section's title, in the same order they appear on the page

### Requirement: Selecting an outline entry navigates to that section
Clicking an entry in the outline SHALL scroll the page to that section's heading. The outline remains visible afterward — there is nothing to close, since it is not a panel.

#### Scenario: Clicking an outline entry jumps to its section
- **WHEN** a visitor clicks a section's entry in the outline
- **THEN** the page scrolls to that section's heading and the outline stays visible, unchanged

### Requirement: The outline highlights the section currently in view
The system SHALL visually mark whichever listed section is currently scrolled into view, updating as the visitor scrolls.

#### Scenario: Scrolling into a section marks it active
- **WHEN** a visitor scrolls so that a different section's heading enters the viewport
- **THEN** that section's entry in the outline becomes the one marked active, and the previously active entry is no longer marked active

## REMOVED Requirements

### Requirement: The mobile top bar exposes only the rail-open control
**Reason**: The mobile top bar no longer opens a secondary rail panel at all — Settings, the Account-or-Sign-In icon, and the menu button are direct icons in a single top-bar cluster (per `site-navigation` and `account-hub-stub`), and the outline no longer appears on mobile in any form.
**Migration**: See this capability's "A page with real section structure surfaces an outline trigger" requirement (outline is desktop-only) and `site-navigation`'s "Header exposes a menu toggle" requirement (mobile top-bar composition).

### Requirement: The outline trigger sits below the theme toggle in the rail
**Reason**: There is no longer a separate outline "trigger" — the outline is an always-visible inline list on desktop, not a rail icon with its own position in an icon stack.
**Migration**: The outline's placement is now described structurally (inline, in the widened right rail) by this capability's "A page with real section structure surfaces an outline trigger" requirement, not by ordering relative to other rail icons.

### Requirement: The outline panel can be dismissed the same ways every other panel on this site can
**Reason**: The outline is no longer a dismissible panel on desktop (it's always visible, nothing to dismiss) and is not shown on mobile at all, so there is nothing to dismiss on any viewport.
**Migration**: None needed — this requirement has no replacement, since the interaction it described no longer exists.

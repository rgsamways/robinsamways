## MODIFIED Requirements

### Requirement: A page with real section structure surfaces an outline trigger
On desktop viewports only, the system SHALL render an "on this page" outline as an always-visible inline anchor list in the widened right rail, once the current page view has ever had two or more `SectionHeader` sections rendered at once, derived at runtime from the page's actual rendered headings — not from a hand-maintained per-page list. Once eligible, the outline SHALL reflect however many `SectionHeader` sections are currently rendered, down to a minimum of one, including after in-page filtering removes or restores sections without a route change. A page that never renders more than one `SectionHeader` section at a time during the current page view, filtered or not, SHALL show no outline. On mobile viewports, the outline is not shown at all — no trigger, no access point.

#### Scenario: A page with two or more sections shows the inline outline on desktop
- **WHEN** a visitor at a desktop viewport loads a page containing two or more `SectionHeader` sections
- **THEN** an inline "on this page" anchor list appears in the right rail, with no click needed to reveal it

#### Scenario: A page that never has more than one section shows no outline
- **WHEN** a visitor loads a page that renders zero or one `SectionHeader` section at a time throughout the current page view
- **THEN** no outline appears anywhere, on any viewport

#### Scenario: Mobile shows no outline regardless of section count
- **WHEN** a visitor at a mobile viewport loads a page with two or more `SectionHeader` sections
- **THEN** no outline trigger or list appears anywhere on that page

## ADDED Requirements

### Requirement: The outline stays synced when in-page filtering changes which sections are visible
The system SHALL re-derive the outline's section list whenever the page's rendered `SectionHeader` content changes for any reason during the current page view, not only on navigation — including when a pill filter or similar in-page control adds or removes sections from the page without changing the route. Once the outline has become eligible per the two-or-more rule, it SHALL continue showing even when filtering narrows the currently visible sections down to exactly one. If the section currently marked active is removed by such a change, the system SHALL clear the active marking rather than continuing to mark a section that is no longer present.

#### Scenario: Filtering down to one section still shows that one entry
- **WHEN** a visitor on a page with an eligible outline uses an in-page filter to narrow the visible sections down to exactly one
- **THEN** the outline updates to show that one remaining section, rather than disappearing or continuing to list sections that are no longer rendered

#### Scenario: Filtering back up restores the additional entries
- **WHEN** a visitor who had filtered a page down to one section re-enables a filter that restores a second section
- **THEN** the outline updates to include that section again, without requiring a page reload or navigation

#### Scenario: Filtering out the active section clears the active marking
- **WHEN** the section currently marked active in the outline is removed by an in-page filter change
- **THEN** no entry in the outline remains marked active until the visitor scrolls or otherwise causes a new section to become active

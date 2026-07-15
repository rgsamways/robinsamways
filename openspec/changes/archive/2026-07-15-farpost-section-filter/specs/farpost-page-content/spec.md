## ADDED Requirements

### Requirement: A pill bar filters the Origins tab's own sections by visibility
The `/farpost` page SHALL display a horizontal row of pills below its "$ Farpost" heading and intro blurb, above the Origin Story section, one pill per section (Origin Story, Problems It Solves, Lifecycle Example, Process). Activating a pill toggles it on or off; when one or more pills are active, only the corresponding sections are shown. With no pills active, all sections are shown. This filter bar is distinct from the existing `FarpostTabBar` pill-tab navigation bar, which continues to render above the heading and link to Farpost's sub-pages.

#### Scenario: Filter bar renders below the heading and intro blurb
- **WHEN** a visitor loads `/farpost`
- **THEN** the pill-tab navigation bar appears first, then the "$ Farpost" heading and intro blurb, then the section-filter pill bar, then the Origin Story section

#### Scenario: Activating a pill isolates its section
- **WHEN** a visitor activates the "Process" pill
- **THEN** only the Process section remains visible; the other three are hidden

#### Scenario: Activating multiple pills shows the union of their sections
- **WHEN** a visitor activates both the "Origin Story" and "Process" pills
- **THEN** both the Origin Story and Process sections are shown, and the other two remain hidden

#### Scenario: Deactivating every pill shows every section again
- **WHEN** a visitor deactivates every active pill
- **THEN** all four sections are shown again

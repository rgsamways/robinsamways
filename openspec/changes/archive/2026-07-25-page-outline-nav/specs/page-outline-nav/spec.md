## ADDED Requirements

### Requirement: A page with real section structure surfaces an outline trigger
The system SHALL show an "on this page" outline trigger icon in the nav icon set (mobile top bar and desktop icon rail) only when the current page has two or more `SectionHeader` sections, derived at runtime from the page's actual rendered headings — not from a hand-maintained per-page list.

#### Scenario: A page with two or more sections shows the trigger
- **WHEN** a visitor loads a page containing two or more `SectionHeader` sections
- **THEN** the outline trigger icon appears in the nav icon set

#### Scenario: A page with fewer than two sections shows no trigger
- **WHEN** a visitor loads a page containing zero or one `SectionHeader` sections
- **THEN** no outline trigger icon appears anywhere in the nav

### Requirement: Every SectionHeader renders a stable, unique anchor id
Each `SectionHeader` instance SHALL render its heading with an `id` slugified from its `title`, and SHALL disambiguate same-page title collisions so every section remains individually reachable by a unique anchor.

#### Scenario: A section's heading gets a slugified id
- **WHEN** a `SectionHeader` with title "Phase 1 — Port The Core" renders
- **THEN** its heading element has an `id` derived from that title (lowercased, non-alphanumeric characters replaced, no leading/trailing separator)

#### Scenario: Two sections with the same title both stay individually reachable
- **WHEN** a page renders two `SectionHeader` instances with identical titles
- **THEN** the system gives the second instance a numerically-suffixed variant of the first's id, so both ids remain unique on that page

### Requirement: Opening the outline lists the page's real sections in document order
Opening the outline trigger SHALL show a dismissible panel listing every `SectionHeader` section on the current page, in the order they appear in the document, each as a clickable link to its section.

#### Scenario: Opening the outline shows every section
- **WHEN** a visitor opens the outline trigger on a page with several sections
- **THEN** the panel lists each section's title, in the same order they appear on the page

### Requirement: Selecting an outline entry navigates to that section and closes the panel
Clicking an entry in the outline panel SHALL scroll the page to that section's heading and SHALL close the panel.

#### Scenario: Clicking an outline entry jumps to its section
- **WHEN** a visitor clicks a section's entry in the open outline panel
- **THEN** the page scrolls to that section's heading and the outline panel closes

### Requirement: The outline highlights the section currently in view
While the outline panel is open, the system SHALL visually mark whichever listed section is currently scrolled into view, updating as the visitor scrolls.

#### Scenario: Scrolling into a section marks it active
- **WHEN** a visitor scrolls so that a different section's heading enters the viewport while the outline panel is open
- **THEN** that section's entry in the outline panel becomes the one marked active, and the previously active entry is no longer marked active

### Requirement: The mobile top bar exposes only the rail-open control
On viewports below the desktop breakpoint, the top bar SHALL show only the settings/cog button that opens the nav rail — no other control SHALL appear directly in the top bar.

#### Scenario: The mobile top bar shows only the cog
- **WHEN** a visitor loads any page on a mobile-width viewport
- **THEN** the top bar shows only the cog button, with Sign In and any other rail controls reachable only after opening the rail

### Requirement: The outline trigger sits below the theme toggle in the rail
When shown (per the two-or-more-sections rule above), the outline trigger icon SHALL appear below the theme toggle in the rail's control order.

#### Scenario: The outline trigger renders last
- **WHEN** the outline trigger is visible in the rail
- **THEN** it appears below the theme toggle, and the theme toggle appears below the Sign In icon

### Requirement: The outline panel can be dismissed the same ways every other panel on this site can
The outline panel SHALL close when the visitor presses Escape, clicks outside the panel, or activates an explicit close control — the same three dismissal mechanisms already used by this site's other dismissible panels.

#### Scenario: Escape dismisses the open panel
- **WHEN** the outline panel is open and the visitor presses Escape
- **THEN** the panel closes

#### Scenario: A backdrop click dismisses the open panel
- **WHEN** the outline panel is open and the visitor clicks outside it
- **THEN** the panel closes

#### Scenario: The close control dismisses the open panel
- **WHEN** the outline panel is open and the visitor activates its close button
- **THEN** the panel closes

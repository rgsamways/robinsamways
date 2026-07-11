## MODIFIED Requirements

### Requirement: A project page's local menu links to its own sections and back to its parent index
A Tech/Stacks project page (e.g. Credential Flow) SHALL include a local navigation menu listing links to its own sections, plus a link back to the Tech/Stacks index it is published under. Farpost's own pieces (Origins, Atlas, Dispatch, Pulse) and Sreditor are exempt from the parent-link portion of this requirement: Farpost's pieces already have a persistent pill-tab bar providing direct navigation back to any other Farpost piece, making a duplicate local-menu parent link redundant; Sreditor has no parent index at all, sitting at the top nav tier itself.

#### Scenario: Credential Flow's local menu lists its sections and links back to Tech/Stacks
- **WHEN** a visitor opens the local menu beside the Credential Flow project page's heading
- **THEN** the menu includes links to that page's own sections (Overview, Why Client Credentials Flow, Licensing Limitations, Farpost Parallel, Live Demo, Relationship View, and Setup Gallery), plus a link back to the Tech/Stacks index

#### Scenario: Farpost Pulse's local menu lists its sections without a parent-index link
- **WHEN** a visitor opens the local menu beside the Farpost Pulse landing page's heading
- **THEN** the menu includes links to that page's own sections (Origin Story, Architecture, Tech Stack, Design Notes, and Tech Roster), and no link back to a parent index — the pill-tab bar already provides that navigation

## REMOVED Requirements

### Requirement: Method's local menu links to its project pages
**Reason**: The Method index and its capability are retired. Sreditor, its only member, is promoted to a top-level page with no parent index.
**Migration**: No replacement needed — Sreditor's own local menu (defined in `sreditor-page-content`) links only to its own sections, with no parent-index link at all.

### Requirement: Narrative's local menu links to its project pages
**Reason**: The Narrative index and its capability are retired, split between the Farpost hub and the new Tech/Stacks index.
**Migration**: See the new "Tech/Stacks' local menu links to its project pages" requirement below for the equivalent Tech/Stacks behavior. Farpost's own pieces are reachable via the pill-tab bar instead of a local-menu listing.

## ADDED Requirements

### Requirement: Tech/Stacks' local menu links to its project pages
The `/techstacks` index page's heading SHALL include a local navigation menu listing every individual project page currently published under Tech/Stacks.

#### Scenario: Tech/Stacks' local menu lists its published projects
- **WHEN** a visitor opens the local menu beside the "$ Tech/Stacks" heading
- **THEN** the menu includes a link to the Credential Flow project page

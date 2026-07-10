## REMOVED Requirements

### Requirement: Portfolio's local menu links to its project pages
**Reason**: Portfolio is retired; superseded by separate local menus on the new Method and Narrative indexes.
**Migration**: See the two ADDED requirements below (Method's local menu, Narrative's local menu).

## ADDED Requirements

### Requirement: Method's local menu links to its project pages
The `/method` index page's heading SHALL include a local navigation menu listing every individual project page currently published under Method.

#### Scenario: Method's local menu lists the Sreditor project
- **WHEN** a visitor opens the local menu beside the "$ Method" heading
- **THEN** the menu includes a link to the Sreditor project page

### Requirement: Narrative's local menu links to its project pages
The `/narrative` index page's heading SHALL include a local navigation menu listing every individual project page currently published under Narrative.

#### Scenario: Narrative's local menu lists its published projects
- **WHEN** a visitor opens the local menu beside the "$ Narrative" heading
- **THEN** the menu includes a link to the Credential Flow project page and a link to the Farpost Pulse placeholder page

## MODIFIED Requirements

### Requirement: A project page's local menu links to its own sections
An individual project page (e.g. the Credential Flow project page) SHALL include a local navigation menu listing links to its own sections.

#### Scenario: Credential Flow's local menu lists its sections
- **WHEN** a visitor opens the local menu beside the Credential Flow project page's heading
- **THEN** the menu includes links to that page's own sections (Overview, Why Client Credentials Flow, Licensing Limitations, Farpost Parallel, Live Demo, Relationship View, and Setup Gallery)

## RENAMED Requirements
- FROM: `### Requirement: A project page's local menu links to its own sections`
- TO: `### Requirement: A project page's local menu links to its own sections and back to its parent index`

## MODIFIED Requirements

### Requirement: A project page's local menu links to its own sections and back to its parent index
An individual project page (e.g. Credential Flow, Farpost Pulse) SHALL include a local navigation menu listing links to its own sections, plus a link back to the parent index (Method or Narrative) it is published under. Farpost is exempt from the parent-link portion of this requirement — it has no parent index, since it sits at the same top-level tier as Method and Narrative rather than being published under either.

#### Scenario: Credential Flow's local menu lists its sections and links back to Narrative
- **WHEN** a visitor opens the local menu beside the Credential Flow project page's heading
- **THEN** the menu includes links to that page's own sections (Overview, Why Client Credentials Flow, Licensing Limitations, Farpost Parallel, Live Demo, Relationship View, and Setup Gallery), plus a link back to the Narrative index

#### Scenario: Farpost Pulse's local menu lists its sections and links back to Narrative
- **WHEN** a visitor opens the local menu beside the Farpost Pulse landing page's heading
- **THEN** the menu includes links to that page's own sections (Origin Story, Architecture, Tech Stack, Design Notes, and Tech Roster), plus a link back to the Narrative index

## MODIFIED Requirements

### Requirement: Narrative renders as a showcase index of story-driven pages
The `/narrative` route SHALL render a showcase index of Narrative-type project pages — pages that tell the story of something built for a specific real reason — each represented by a short teaser that links to that project's own dedicated page.

#### Scenario: Index lists the Credential Flow project
- **WHEN** a visitor loads `/narrative`
- **THEN** the page shows a teaser entry for Credential Flow, linking to `/narrative/credential-flow`

#### Scenario: Index lists the Farpost Pulse project
- **WHEN** a visitor loads `/narrative`
- **THEN** the page shows a teaser entry for Farpost Pulse, accurately describing it as a real, built project on this site (not a placeholder, and not framed as a separate project elsewhere), linking to `/narrative/farpost-pulse`

#### Scenario: Index lists the Farpost Atlas project
- **WHEN** a visitor loads `/narrative`
- **THEN** the page shows a teaser entry for Farpost Atlas, accurately describing it as a real, built project on this site, linking to `/narrative/farpost-atlas`

#### Scenario: Index is capable of holding more than one project
- **WHEN** a third Narrative-type project is added to the index in the future
- **THEN** it can be added as an additional teaser entry without restructuring the index page itself

### Requirement: Project entries support optional display tags
A project entry in a showcase index (Method or Narrative) SHALL support an optional short list of tags, rendered beneath its teaser text when present, signaling the technologies or stack involved in that project without requiring a dedicated navigation tier.

#### Scenario: Credential Flow's entry shows its tags
- **WHEN** a visitor views Credential Flow's entry on the `/narrative` index
- **THEN** the entry displays its tags (e.g. Salesforce, OAuth 2.0, Anthropic AI) beneath its teaser text

#### Scenario: Farpost Pulse's entry shows its tags
- **WHEN** a visitor views Farpost Pulse's entry on the `/narrative` index
- **THEN** the entry displays its tags (e.g. Azure Functions, Cosmos DB, React) beneath its teaser text

#### Scenario: Farpost Atlas's entry shows its tags
- **WHEN** a visitor views Farpost Atlas's entry on the `/narrative` index
- **THEN** the entry displays its tags (e.g. FastAPI, GeoPandas, Leaflet) beneath its teaser text

#### Scenario: An entry with no tags renders without a tag row
- **WHEN** a project entry with no tags defined is added to an index (e.g. a future placeholder entry, before its real content and tags exist)
- **THEN** no tag row renders for that entry

### Requirement: Credential Flow content lives at its own route
The Credential Flow case-study content and live demo widget (as defined by the `salesforce-loan-demo` and `salesforce-relationship-view` capabilities, previously titled "Salesforce Loan Demo") SHALL be served at `/narrative/credential-flow`.

#### Scenario: Credential Flow page renders under its new heading
- **WHEN** a visitor navigates to `/narrative/credential-flow`
- **THEN** the page renders the same case-study content and live demo widget previously served at `/portfolio/salesforce-loan-demo`, under a "$ Credential Flow" heading and matching metadata title, with "Salesforce Loan Demo" retained as descriptive subtitle text rather than removed

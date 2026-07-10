## MODIFIED Requirements

### Requirement: Narrative renders as a showcase index of story-driven pages
The `/narrative` route SHALL render a showcase index of Narrative-type project pages — pages that tell the story of something built for a specific real reason — each represented by a short teaser that links to that project's own dedicated page.

#### Scenario: Index lists the Credential Flow project
- **WHEN** a visitor loads `/narrative`
- **THEN** the page shows a teaser entry for Credential Flow, linking to `/narrative/credential-flow`

#### Scenario: Index lists the Farpost Pulse project
- **WHEN** a visitor loads `/narrative`
- **THEN** the page shows a teaser entry for Farpost Pulse, accurately describing it as a real, built project on this site (not a placeholder, and not framed as a separate project elsewhere), linking to `/narrative/farpost-pulse`

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

#### Scenario: An entry with no tags renders without a tag row
- **WHEN** a project entry with no tags defined is added to an index (e.g. a future placeholder entry, before its real content and tags exist)
- **THEN** no tag row renders for that entry

## REMOVED Requirements

### Requirement: Farpost Pulse placeholder route
**Reason**: Farpost Pulse is no longer a placeholder — its real content is now defined by the `farpost-pulse` capability's landing/detail/dashboard page requirements.
**Migration**: See the `farpost-pulse` capability's "Farpost Pulse landing page" requirement, which covers the same `/narrative/farpost-pulse` route with real content.

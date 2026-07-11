## MODIFIED Requirements

### Requirement: Placeholder routes exist for each menu item
The Method route SHALL render a showcase index of Method-type project pages, as defined by the `method-index` capability. The Narrative route SHALL render a showcase index of Narrative-type project pages, as defined by the `narrative-index` capability. The Farpost route SHALL render Farpost's real content, not a placeholder. The Dev Log route SHALL render its real content, as defined by the `dev-log-content` capability, not a placeholder.

#### Scenario: Method route renders its showcase index
- **WHEN** a visitor navigates to the Method route
- **THEN** a page renders showing the Method showcase index, with at least one entry linking to the Sreditor project page, using the site's monospace/terminal styling

#### Scenario: Narrative route renders its showcase index
- **WHEN** a visitor navigates to the Narrative route
- **THEN** a page renders showing the Narrative showcase index, with entries linking to the Credential Flow project page and the Farpost Pulse placeholder page, using the site's monospace/terminal styling

#### Scenario: Farpost route renders its real content
- **WHEN** a visitor navigates to the Farpost route
- **THEN** a page renders with Farpost's real content (not a placeholder), using the site's monospace/terminal styling

#### Scenario: Dev Log route renders its real content
- **WHEN** a visitor navigates to the `/dev-log` route
- **THEN** a page renders with Dev Log's real content (not a placeholder), using the site's monospace/terminal styling

## MODIFIED Requirements

### Requirement: Placeholder routes exist for each menu item
The site SHALL have two placeholder routes — Farpost and Dev Log (at path `/dev-log`) — each rendering a minimal placeholder page (e.g. a heading and short "coming soon" style message) rather than a 404 or external redirect. The Portfolio route SHALL instead render the real case-study content and live demo widget defined by the `salesforce-loan-demo` capability, not a placeholder.

#### Scenario: Portfolio route renders the Salesforce case study
- **WHEN** a visitor navigates to the Portfolio route
- **THEN** a page renders with the Salesforce integration case-study content and live demo widget defined by the `salesforce-loan-demo` capability, using the site's monospace/terminal styling

#### Scenario: Farpost route renders a placeholder page
- **WHEN** a visitor navigates to the Farpost route
- **THEN** a page renders with a heading identifying it as Farpost and placeholder content, using the site's monospace/terminal styling

#### Scenario: Dev Log route renders a placeholder page
- **WHEN** a visitor navigates to the `/dev-log` route
- **THEN** a page renders with a heading identifying it as Dev Log and placeholder content, using the site's monospace/terminal styling

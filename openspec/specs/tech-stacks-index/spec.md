# tech-stacks-index Specification

## Purpose
TBD - created by archiving change farpost-hub-nav-restructure. Update Purpose after archive.
## Requirements
### Requirement: Experiments renders as a filterable showcase index of pieces
The Experiments route (`/techstacks`) SHALL render a showcase index of pieces — code built to explore a stack or a concept for its own sake, whether or not the idea it explores relates to another project — each represented by a short teaser that links to that piece's own dedicated page. This supersedes the prior restriction to pieces "unrelated to Farpost": Atlas, Dispatch, and Pulse (pieces that explore ideas relevant to Farpost but are not part of Farpost's own project pages) now appear here alongside Credential Flow.

#### Scenario: Index lists the Credential Flow project
- **WHEN** a visitor loads `/techstacks`
- **THEN** the page shows a teaser entry for Credential Flow, linking to `/techstacks/credential-flow`

#### Scenario: Index lists Atlas, Dispatch, and Pulse alongside Farpost-unrelated pieces
- **WHEN** a visitor loads `/techstacks`
- **THEN** the page shows teaser entries for Atlas, Dispatch, and Pulse, linking to their own pages under `/techstacks/`, alongside Credential Flow

#### Scenario: Index is capable of holding more than one project
- **WHEN** a new project is added to the index in the future
- **THEN** it can be added as an additional teaser entry without restructuring the index page itself

### Requirement: Atlas, Dispatch, and Pulse content lives at their own routes under Experiments
The Atlas, Dispatch, and Pulse case-study content and live demo widgets (as defined by the `farpost-atlas`, `farpost-dispatch`, and `farpost-pulse` capabilities) SHALL be served at `/techstacks/farpost-atlas`, `/techstacks/farpost-dispatch`, and `/techstacks/farpost-pulse` respectively. Their prior routes under `/farpost/*` SHALL redirect permanently to these new locations.

#### Scenario: Atlas page renders under its new route
- **WHEN** a visitor navigates to `/techstacks/farpost-atlas`
- **THEN** the page renders the same case-study content and live demo widget previously served at `/farpost/farpost-atlas`

#### Scenario: Old Farpost-nested URLs redirect
- **WHEN** a visitor navigates to the old `/farpost/farpost-atlas`, `/farpost/farpost-dispatch`, or `/farpost/farpost-pulse` URL
- **THEN** the browser is redirected permanently to the corresponding new `/techstacks/*` URL

### Requirement: A pill bar filters project entries by tag
The `/techstacks` index SHALL display a horizontal row of tag pills above the project list. Activating a pill toggles it on or off; when one or more pills are active, only projects whose tags include at least one active pill (OR logic, not AND) are shown. With no pills active, all projects are shown.

#### Scenario: Selecting a pill filters the list
- **WHEN** a visitor activates the "Salesforce" pill
- **THEN** only projects tagged "Salesforce" remain visible in the list below

#### Scenario: Selecting multiple pills shows the union, not the intersection
- **WHEN** a visitor activates both the "Salesforce" and "Azure" pills
- **THEN** the list shows every project tagged "Salesforce" OR "Azure", not only projects tagged with both

#### Scenario: Deactivating all pills shows every project again
- **WHEN** a visitor deactivates every active pill
- **THEN** the full, unfiltered project list is shown

#### Scenario: A pill with no matching projects still renders and functions
- **WHEN** a visitor activates a pill with no currently-tagged projects (e.g. "AWS")
- **THEN** the pill is selectable and shows an empty result set, without error

### Requirement: Project entries support optional display tags
A project entry on the Tech/Stacks index SHALL support a short list of tags, rendered beneath its teaser text, signaling the technologies or stack involved and used to drive the pill filter above.

#### Scenario: Credential Flow's entry shows its tags
- **WHEN** a visitor views Credential Flow's entry on `/techstacks`
- **THEN** the entry displays its tags (Salesforce, OAuth 2.0, Anthropic AI) beneath its teaser text

### Requirement: Atlas, Dispatch, and Pulse entries support the same optional display tags as other pieces
Atlas, Dispatch, and Pulse entries on the Experiments index SHALL support the same short list of display tags other entries use, signaling the technologies or stack involved and used to drive the pill filter.

#### Scenario: Atlas's entry shows its tags
- **WHEN** a visitor views Atlas's entry on `/techstacks`
- **THEN** the entry displays tags reflecting its real stack and subject matter (e.g. geospatial, StatCan data)

### Requirement: Credential Flow content lives at its own route
The Credential Flow case-study content and live demo widget (as defined by the `salesforce-loan-demo` and `salesforce-relationship-view` capabilities) SHALL be served at `/techstacks/credential-flow`.

#### Scenario: Credential Flow page renders under its route
- **WHEN** a visitor navigates to `/techstacks/credential-flow`
- **THEN** the page renders the same case-study content and live demo widget previously served at `/narrative/credential-flow`, under a "$ Credential Flow" heading and matching metadata title


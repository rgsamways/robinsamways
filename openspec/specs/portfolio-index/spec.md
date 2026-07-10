# portfolio-index Specification

## Purpose
TBD - created by archiving change project-navigation-restructure. Update Purpose after archive.
## Requirements
### Requirement: Portfolio renders as a showcase index
The `/portfolio` route SHALL render a showcase index of individual portfolio projects, rather than any single project's content directly — each project represented by a short teaser that links to that project's own dedicated page.

#### Scenario: Index lists the Salesforce Loan Demo project
- **WHEN** a visitor loads `/portfolio`
- **THEN** the page shows a teaser entry for the Salesforce Loan Demo project, linking to `/portfolio/salesforce-loan-demo`

#### Scenario: Index is capable of holding more than one project
- **WHEN** a second project is added to the Portfolio index in the future
- **THEN** it can be added as an additional teaser entry without restructuring the index page itself

### Requirement: Salesforce Loan Demo content lives at its own route
The Salesforce Loan Demo case-study content and live demo widget (as defined by the `salesforce-loan-demo` and `salesforce-relationship-view` capabilities) SHALL be served at `/portfolio/salesforce-loan-demo`, unchanged in content and behavior from what previously rendered directly at `/portfolio`.

#### Scenario: Salesforce Loan Demo page renders identically to before the move
- **WHEN** a visitor navigates to `/portfolio/salesforce-loan-demo`
- **THEN** the page renders the same case-study content and live demo widget that previously rendered at `/portfolio`, with no content or behavior changes from the relocation itself


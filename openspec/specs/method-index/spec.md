# method-index Specification

## Purpose
TBD - created by archiving change method-narrative-navigation. Update Purpose after archive.
## Requirements
### Requirement: Method renders as a showcase index of experiment-driven pages
The `/method` route SHALL render a showcase index of Method-type project pages — pages that document a genuine technical experiment or uncertainty resolved through building something — each represented by a short teaser that links to that project's own dedicated page.

#### Scenario: Index lists the Sreditor project
- **WHEN** a visitor loads `/method`
- **THEN** the page shows a teaser entry for Sreditor, linking to `/method/sreditor`

#### Scenario: Index is capable of holding more than one project
- **WHEN** a second Method-type project is added to the index in the future
- **THEN** it can be added as an additional teaser entry without restructuring the index page itself

### Requirement: Method-type project pages follow a fixed section structure
A Method-type project page (one listed under the `/method` index) SHALL structure its written content using the following sections, in order: PROBLEM, EXISTING_APPROACHES, HYPOTHESIS, METHOD, RESULTS, CONCLUSION.

#### Scenario: A new Method-type page's sections follow the fixed order
- **WHEN** a new Method-type project page is built
- **THEN** its content is organized into PROBLEM, EXISTING_APPROACHES, HYPOTHESIS, METHOD, RESULTS, and CONCLUSION sections, in that order

#### Scenario: This requirement does not apply to Narrative-type pages
- **WHEN** a Narrative-type page (e.g. Credential Flow or Farpost) is built or modified
- **THEN** it is not required to use the PROBLEM/EXISTING_APPROACHES/HYPOTHESIS/METHOD/RESULTS/CONCLUSION structure


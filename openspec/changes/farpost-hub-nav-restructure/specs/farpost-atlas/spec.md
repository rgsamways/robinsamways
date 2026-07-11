## MODIFIED Requirements

### Requirement: Farpost Atlas landing page
The `/farpost/farpost-atlas` route SHALL render a landing page combining written case-study narrative (the geospatial/GIS skill gap this piece closes, its tie to Farpost's real staleness mechanic, and architecture rationale) with an interactive map showing all seeded tracked buildings as clustered markers, plus a toggle for a rural-density overlay rendering North Hastings Dissemination Area boundaries.

#### Scenario: Visitor sees the map
- **WHEN** a visitor loads `/farpost/farpost-atlas`
- **THEN** the page shows the case-study narrative and a map with markers for all seeded tracked buildings, each linking to that building's own detail page

#### Scenario: Visitor toggles the rural-density overlay
- **WHEN** a visitor activates the rural-density overlay toggle
- **THEN** the map renders North Hastings Dissemination Area boundary polygons, styled to reflect population density

### Requirement: Building detail page
The `/farpost/farpost-atlas/{buildingId}` route SHALL render one tracked building's full list of tracked records (septic, well pump, foundation, electrical panel), each showing its last-recorded date and a computed staleness fact, plus that building's rurality classification from its spatial join against the Dissemination Area boundary data.

#### Scenario: Visitor views a building's tracked records
- **WHEN** a visitor navigates to `/farpost/farpost-atlas/{buildingId}` for a valid seeded building
- **THEN** the page shows that building's tracked records, each with a last-recorded date and a staleness fact stated as information (e.g. "3 years stale"), not a pass/fail verdict

#### Scenario: Visitor sees rurality classification
- **WHEN** a visitor views a building's detail page
- **THEN** the page shows the population-density figure of the Dissemination Area polygon containing that building's coordinates

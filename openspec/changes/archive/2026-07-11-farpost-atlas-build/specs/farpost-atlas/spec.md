## ADDED Requirements

### Requirement: Farpost Atlas landing page
The `/narrative/farpost-atlas` route SHALL render a landing page combining written case-study narrative (the geospatial/GIS skill gap this piece closes, its tie to Farpost's real staleness mechanic, and architecture rationale) with an interactive map showing all seeded tracked buildings as clustered markers, plus a toggle for a rural-density overlay rendering North Hastings Dissemination Area boundaries.

#### Scenario: Visitor sees the map
- **WHEN** a visitor loads `/narrative/farpost-atlas`
- **THEN** the page shows the case-study narrative and a map with markers for all seeded tracked buildings, each linking to that building's own detail page

#### Scenario: Visitor toggles the rural-density overlay
- **WHEN** a visitor activates the rural-density overlay toggle
- **THEN** the map renders North Hastings Dissemination Area boundary polygons, styled to reflect population density

### Requirement: Building detail page
The `/narrative/farpost-atlas/{buildingId}` route SHALL render one tracked building's full list of tracked records (septic, well pump, foundation, electrical panel), each showing its last-recorded date and a computed staleness fact, plus that building's rurality classification from its spatial join against the Dissemination Area boundary data.

#### Scenario: Visitor views a building's tracked records
- **WHEN** a visitor navigates to `/narrative/farpost-atlas/{buildingId}` for a valid seeded building
- **THEN** the page shows that building's tracked records, each with a last-recorded date and a staleness fact stated as information (e.g. "3 years stale"), not a pass/fail verdict

#### Scenario: Visitor sees rurality classification
- **WHEN** a visitor views a building's detail page
- **THEN** the page shows the population-density figure of the Dissemination Area polygon containing that building's coordinates

### Requirement: Tracked-building data model
`farpost-atlas-geo`'s Postgres database SHALL store `TrackedBuilding` records (id, address, latitude, longitude, owner name, region name) and `TrackedRecord` records (id, building id, record type, last-recorded date, notes), where record type is one of septic, well pump, foundation, or electrical panel.

#### Scenario: A building's tracked records are queryable by building
- **WHEN** the backend queries tracked records for a given building id
- **THEN** it returns only that building's own tracked records

### Requirement: Spatial join against Statistics Canada boundary data
`farpost-atlas-geo` SHALL determine a building's rurality classification via a live point-in-polygon spatial join, using Shapely, between the building's coordinates and a pre-processed GeoJSON file of Statistics Canada's 2021 Census Dissemination Area boundaries for North Hastings, Ontario, loaded into an in-memory spatial index at application startup.

#### Scenario: A building's coordinates resolve to a containing Dissemination Area
- **WHEN** the backend looks up rurality for a building's coordinates
- **THEN** it returns the population-density figure of the Dissemination Area polygon whose boundary contains that point

### Requirement: Seed data with intentional staleness and rurality variation
`farpost-atlas-geo` SHALL be seeded with 12-15 fictional tracked buildings across North Hastings, each with 2-4 tracked records, patterned so that some records are genuinely overdue and some current, and so building placement spans from village-centre to deep-rural Dissemination Areas.

#### Scenario: Map shows genuine staleness and rurality variation
- **WHEN** a visitor views the seeded buildings on the map and their detail pages
- **THEN** at least one building shows an overdue tracked record and the seeded buildings span more than one rurality classification

### Requirement: Farpost Atlas HTTP endpoints
`farpost-atlas-geo` SHALL expose three HTTP endpoints: `GET /api/buildings` (list all seeded buildings with coordinates and a rollup staleness flag), `GET /api/buildings/{id}` (one building's full tracked-record list with per-record staleness and rurality), and `GET /api/boundaries` (a GeoJSON `FeatureCollection` of North Hastings Dissemination Area polygons with population-density properties).

#### Scenario: Listing buildings returns seeded data
- **WHEN** a client sends `GET /api/buildings`
- **THEN** the API returns the seeded building list, each with coordinates and a rollup staleness flag

#### Scenario: Boundaries endpoint returns valid GeoJSON
- **WHEN** a client sends `GET /api/boundaries`
- **THEN** the API returns a GeoJSON `FeatureCollection` whose features carry a population-density property

### Requirement: Cross-origin access from robinsamways.ca
`farpost-atlas-geo` SHALL be configured to accept cross-origin requests from robinsamways.ca's production domain and from localhost during development, so the Next.js frontend can call it directly from the browser.

#### Scenario: Browser request from the production domain succeeds
- **WHEN** a browser on robinsamways.ca's production domain sends a request to `farpost-atlas-geo`
- **THEN** the request succeeds without being blocked by a CORS preflight failure

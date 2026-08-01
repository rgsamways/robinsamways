# farpost-atlas Specification

## Purpose
TBD - created by archiving change farpost-atlas-build. Update Purpose after archive.
## Requirements
### Requirement: Farpost Atlas landing page
The `/techstacks/farpost-atlas` route SHALL render a landing page combining written case-study narrative (the geospatial/GIS skill gap this piece closes and its tie to Farpost's real staleness mechanic) with an interactive map showing all seeded tracked buildings as clustered markers, plus a toggle for a rural-density overlay rendering North Hastings Dissemination Area boundaries. The page SHALL briefly summarize the architecture rationale and link to the dedicated Architecture page for the full spatial-join explanation, rather than carrying that detail in full itself.

#### Scenario: Visitor sees the map
- **WHEN** a visitor loads `/techstacks/farpost-atlas`
- **THEN** the page shows the case-study narrative and a map with markers for all seeded tracked buildings, each linking to that building's own detail page

#### Scenario: Visitor toggles the rural-density overlay
- **WHEN** a visitor activates the rural-density overlay toggle
- **THEN** the map renders North Hastings Dissemination Area boundary polygons, styled to reflect population density

#### Scenario: Visitor sees a brief architecture summary linking to the full page
- **WHEN** a visitor reads the landing page's architecture-rationale summary
- **THEN** the copy is brief and links to `/techstacks/farpost-atlas/architecture` for the full spatial-join explanation

### Requirement: Building detail page
The `/farpost/farpost-atlas/{buildingId}` route SHALL render one tracked building's full list of tracked records (septic, well pump, foundation, electrical panel), each showing its last-recorded date and a computed staleness fact, plus that building's rurality classification from its spatial join against the Dissemination Area boundary data.

#### Scenario: Visitor views a building's tracked records
- **WHEN** a visitor navigates to `/farpost/farpost-atlas/{buildingId}` for a valid seeded building
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

### Requirement: Tech Stack page documents Atlas's real technology choices
The `/techstacks/farpost-atlas/tech-stack` route SHALL document the technologies Atlas actually uses — Python/FastAPI backend, Shapely for the spatial join, an in-memory GeoJSON spatial index, and the Next.js/Leaflet frontend map — distinguishing what's genuinely GIS work from what's a lighter-weight stand-in for a production GIS stack.

#### Scenario: Visitor sees the real stack, not marketing language
- **WHEN** a visitor loads `/techstacks/farpost-atlas/tech-stack`
- **THEN** the page names Shapely, the in-memory GeoJSON index, and Leaflet specifically, rather than describing the piece only in generic "GIS" terms

### Requirement: Architecture page describes the spatial join mechanism
The `/techstacks/farpost-atlas/architecture` route SHALL describe how the spatial join actually works: the pre-processed Statistics Canada Dissemination Area GeoJSON loaded into an in-memory spatial index at application startup, and the point-in-polygon lookup performed per building via Shapely, plus the three HTTP endpoints (`/api/buildings`, `/api/buildings/{id}`, `/api/boundaries`) that expose it.

#### Scenario: Visitor reads how a coordinate resolves to a rurality classification
- **WHEN** a visitor reads `/techstacks/farpost-atlas/architecture`
- **THEN** the copy explains the startup-time index load and the per-request point-in-polygon lookup, not just that "a spatial join happens"

### Requirement: Object Model page documents TrackedBuilding and TrackedRecord
The `/techstacks/farpost-atlas/object-model` route SHALL document the `TrackedBuilding` and `TrackedRecord` schema (fields and relationship) already defined in this capability's data-model requirement, presented as a reference page distinct from the architecture narrative.

#### Scenario: Visitor sees the two record types and their relationship
- **WHEN** a visitor loads `/techstacks/farpost-atlas/object-model`
- **THEN** the page shows `TrackedBuilding`'s fields, `TrackedRecord`'s fields, and states that each `TrackedRecord` belongs to exactly one `TrackedBuilding`

### Requirement: Design Notes page explains the Shapely/in-memory-index decision
The `/techstacks/farpost-atlas/design-notes` route SHALL explain why Atlas uses Shapely plus an in-memory GeoJSON index rather than a real PostGIS-backed spatial database, and what would change about the approach if this piece were scaled beyond its current fixed North Hastings dataset.

#### Scenario: Visitor understands the trade-off, not just the choice
- **WHEN** a visitor reads `/techstacks/farpost-atlas/design-notes`
- **THEN** the copy names at least one concrete limitation of the in-memory approach and what a production-scale alternative would look like

### Requirement: AI Notes page ships as an honest stub pending a future change
The `/techstacks/farpost-atlas/ai-notes` route SHALL state plainly that Atlas does not currently use AI as part of its own mechanic, unlike Credential Flow, Dispatch, and Pulse, and SHALL note that bringing AI into Atlas is a deferred idea to be worked out in a future change — without fabricating an AI feature or omitting the page to avoid the gap.

#### Scenario: Visitor reads an honest "not yet" rather than a fabricated feature
- **WHEN** a visitor loads `/techstacks/farpost-atlas/ai-notes`
- **THEN** the page states that Atlas has no AI mechanic today and that this is a known, tracked gap, rather than describing an AI feature that doesn't exist

### Requirement: Setup Gallery page reflects whatever real external configuration Atlas actually required
The `/techstacks/farpost-atlas/setup-gallery` route SHALL show real screenshots of any genuine external infrastructure configuration Atlas's deployment actually required (e.g. provisioning the Postgres host `farpost-atlas-geo` runs on), or, if no such real external configuration step exists beyond code and a static data file, SHALL state that honestly rather than showing unrelated or staged screenshots.

#### Scenario: Real configuration exists
- **WHEN** Atlas's deployment involved a genuine external console step
- **THEN** the page shows real screenshots of that step with captions explaining what each shows and why it matters, per the site's established Setup Gallery pattern

#### Scenario: No real configuration exists
- **WHEN** Atlas's deployment involved no genuine external console step beyond code and a static GeoJSON file
- **THEN** the page states that honestly instead of showing staged or unrelated screenshots


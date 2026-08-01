## MODIFIED Requirements

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

## ADDED Requirements

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

## 1. Boundary data ingestion

- [x] 1.1 Source Statistics Canada's 2021 Census Dissemination Area cartographic boundary file and DA-level population/dwelling count table, scoped to North Hastings, Ontario
- [x] 1.2 Write the one-time `geopandas` ingestion script (`pieces/farpost-atlas-geo/scripts/ingest_boundaries.py`): reproject from NAD83/Lambert conformal conic to WGS84, simplify polygon geometry for web rendering, join population-density figures by DGUID, export a clean GeoJSON `FeatureCollection`
- [x] 1.3 Check the exported GeoJSON into `pieces/farpost-atlas-geo/data/da_boundaries_north_hastings.geojson`; document how to re-run the ingestion script if the source data changes

## 2. `farpost-atlas-geo` backend

- [x] 2.1 Scaffold the Python/FastAPI app at `pieces/farpost-atlas-geo/`, its own `requirements.txt` (FastAPI, `geopandas`, Shapely, a Postgres driver) — a new piece under `pieces/`, isolated from `api/`'s shared dependency set per `CLAUDE.md`'s "Portfolio piece isolation" convention
- [x] 2.2 Load the ingested GeoJSON into an in-memory Shapely `STRtree` at application startup
- [x] 2.3 Define `TrackedBuilding` and `TrackedRecord` models (record type: septic, well pump, foundation, electrical panel) against a Postgres database
- [x] 2.4 Implement per-`recordType` staleness computation (expected refresh interval, anchored on `/farpost`'s real septic 36-month example), computed at response time against the current date, not stored
- [x] 2.5 Implement the point-in-polygon rurality lookup: given a building's coordinates, query the `STRtree` and return the containing Dissemination Area's population-density figure
- [x] 2.6 Write the seed data script: 12-15 fictional tracked buildings across North Hastings (distinct from `/farpost`'s own "Marlene" example), 2-4 tracked records each, patterned so some records are genuinely overdue and building placement spans village-centre to deep-rural Dissemination Areas
- [x] 2.7 Implement `GET /api/buildings` — list all seeded buildings with coordinates and a rollup staleness flag
- [x] 2.8 Implement `GET /api/buildings/{id}` — one building's full tracked-record list with per-record staleness, plus its rurality classification
- [x] 2.9 Implement `GET /api/boundaries` — the GeoJSON `FeatureCollection` of North Hastings Dissemination Area polygons with population-density properties
- [x] 2.10 Document the exact CORS origins Robin needs to configure (production domain + localhost) — this change delivers the requirement and instructions, not a live configuration change
- [x] 2.11 Write pytest coverage for `farpost-atlas-geo`, per this repo's "tests ship with the feature" convention: staleness computation across all four record types (including a boundary-condition test at the exact threshold), the point-in-polygon rurality lookup against a small fixture polygon set, and at least one integration test via FastAPI's `TestClient` for each of the three endpoints

## 3. Farpost Atlas frontend

- [x] 3.1 Add `leaflet` and `react-leaflet` (plus a Leaflet marker-clustering plugin) to `web/`'s dependencies
- [x] 3.2 Build `web/src/app/narrative/farpost-atlas/page.tsx`: case-study narrative (the GIS skill gap this closes, its tie to Farpost's real staleness mechanic, architecture rationale, tech stack table with reasoning per choice) plus the interactive Leaflet map — clustered building markers, a rural-density overlay toggle rendering the Dissemination Area polygons from `GET /api/boundaries`
- [x] 3.3 Build `web/src/app/narrative/farpost-atlas/[buildingId]/page.tsx`: tracked-record list with last-recorded dates and staleness facts, plus that building's rurality classification, sourced from `GET /api/buildings/{id}`
- [x] 3.4 Wire both pages to call `farpost-atlas-geo` directly from the browser via a `NEXT_PUBLIC_FARPOST_ATLAS_API_URL` environment variable — no proxy through this repo's own `/api`
- [x] 3.5 Add a local `HamburgerMenu` beside the landing page's heading, linking to its narrative sections and the map
- [x] 3.6 Keep styling clean and accessible (semantic HTML, good contrast, keyboard navigable)
- [x] 3.7 Write representative Vitest/Playwright coverage for anything with real logic — at minimum, a Playwright e2e spec covering the map-to-building-detail navigation flow, per this repo's "tests ship with the feature" convention

## 4. Update the Narrative index

- [x] 4.1 Add Farpost Atlas's entry to `web/src/app/narrative/page.tsx` with real teaser copy (accurately describing it as a real, built project, not a placeholder)
- [x] 4.2 Add tags to Farpost Atlas's entry: FastAPI, GeoPandas, Leaflet

## 5. Verification

- [x] 5.1 Confirm both routes render correctly: landing page (narrative + map with clustering and the rural-density overlay toggle), building detail page (tracked records with staleness facts, rurality classification)
- [x] 5.2 Confirm the seeded data genuinely varies — at least one overdue tracked record, buildings spanning more than one rurality classification
- [x] 5.3 Confirm CORS works from localhost during development (production domain can't be verified until Robin deploys and configures the live service)
- [x] 5.4 Confirm the `/narrative` index shows Farpost Atlas's real teaser and its tags
- [x] 5.5 `npm run build` clean in `/web`, no console warnings; `pytest` clean in `pieces/farpost-atlas-geo/`
- [x] 5.6 Add every new dependency (`geopandas`, Shapely, `react-leaflet`, `leaflet`, the clustering plugin, the StatCan boundary/population-count data source) to `docs/stack.md`
- [x] 5.7 Note in a handoff to Robin (via `docs/issues.md`, per the handoff-logging convention) that once he provisions the Railway service and Postgres database, deploys `farpost-atlas-geo`, and captures real screenshots of that setup, a `SetupGallery` component for this piece (per `CLAUDE.md`'s "Setup galleries" convention) is a real, non-blocking follow-up — not part of this change, same precedent already set by Farpost Pulse's own still-pending Azure setup gallery
- [x] 5.8 Run `scc --dryness --exclude-dir .git,.hg,.svn,node_modules,.venv web/src api pieces` and log the snapshot to `docs/metrics.md` **and** `web/src/data/metrics.json` before archiving this change, per the convention in `CLAUDE.md`

## Why

Every Narrative piece shipped so far proves a skill category Credential Flow already established or Farpost Pulse extended — OAuth integration, serverless functions, an AI SDK. None of them prove genuine spatial/GIS work, a real, distinct technical category Robin explicitly wants a piece for. There's also an existing unscoped lightbulb (`rsw-lb-rural-demographics-api`) with real StatCan rural-demographic data and no home to actually use it in. Farpost Atlas closes both gaps at once: a geospatial map of tracked buildings, with a genuine spatial join (not just pins on a map) against real Statistics Canada census boundary data — and, per Farpost's own real "40-Year Pulse" building-intelligence thesis and its staleness mechanic (the septic "last pumped 3 years ago" fact on `/farpost`), a feature that's directly portable to farpost.ca itself, not just thematically adjacent.

## What Changes

- Build the real Farpost Atlas app as two routes under `/narrative/farpost-atlas`: a landing page (case-study narrative plus an interactive map of seeded tracked buildings, with a toggle for a rural-density overlay) and a per-building detail page (tracked records — septic, well pump, foundation, electrical — each with its own staleness flag, mirroring the mechanic already established on `/farpost`).
- Backend is a new, separately-deployed piece: `pieces/farpost-atlas-geo/` (Python, FastAPI), promoted out of `api/` from day one under the "Portfolio piece isolation" convention's heavy/native-dependency trigger — `geopandas`/Shapely are genuine runtime dependencies (not a one-off ingestion script), doing a live point-in-polygon spatial join between a building's coordinates and Statistics Canada's 2021 Census Dissemination Area boundary files, scoped to the North Hastings, Ontario region (the same region named in `rsw-lb-rural-demographics-api`'s example endpoint, keeping continuity between the two related lightbulbs and keeping the boundary-file ingestion scope small and tractable). This is the first real piece built specifically to exercise that convention's heavy-dependency trigger, which was written with GIS libraries as its explicit example before any piece existed to prove it.
- Seed data: 12-15 fake tracked buildings across North Hastings, each with 2-4 tracked records patterned so staleness flags mean something (some buildings genuinely overdue, some current) and so the rural-density overlay has real variation to show (buildings ranging from village-centre to deep-rural placement).
- Folds in just enough of `rsw-lb-rural-demographics-api`'s real StatCan data (the 2021 Census DA boundary files and population-density figures for North Hastings) to power Atlas's spatial join — this is not the full standalone public rural-demographics API that lightbulb originally described; that broader "public API for others to consume" idea remains open and unscoped, tracked separately.
- Give Farpost Atlas's `/narrative` index entry a real teaser and tags, replacing... nothing — unlike Pulse, Atlas has no existing placeholder route or index entry; this is a net-new addition to the index, not a placeholder conversion.

## Capabilities

### New Capabilities
- `farpost-atlas`: the full app — two routes, the tracked-building/tracked-record data model, the `farpost-atlas-geo` backend's spatial-join and buildings endpoints, seed data, and the CORS requirement allowing this repo's frontend to call it.

### Modified Capabilities
- `narrative-index`: adds a new scenario for the Farpost Atlas entry (teaser accurately describing it as a real, built project, linking to `/narrative/farpost-atlas`), alongside the existing Credential Flow and Farpost Pulse entries.

## Impact

- New routes: `web/src/app/narrative/farpost-atlas/page.tsx`, `web/src/app/narrative/farpost-atlas/[buildingId]/page.tsx`.
- New package: `pieces/farpost-atlas-geo/` (Python, FastAPI, `geopandas`/Shapely, its own `requirements.txt`, deployed separately — not part of `api/`'s shared dependency set or Railway service).
- New dependency: `react-leaflet`/`leaflet` in `web/` for the interactive map (chosen over Mapbox/Azure Maps — no API key/vendor account needed, standard GeoJSON polygon rendering for the rural-density overlay).
- One-time data asset: Statistics Canada's 2021 Census Dissemination Area cartographic boundary file, scoped to North Hastings, converted to GeoJSON and checked into `pieces/farpost-atlas-geo/`.
- `openspec/specs/narrative-index/spec.md`: delta as described above.
- New: `openspec/specs/farpost-atlas/spec.md`.
- `CLAUDE.md`'s "Portfolio piece isolation" section gains a real example reference (currently hypothetical) once this ships.
- No change to `api/`, Credential Flow, Farpost Pulse, Method, or Sreditor.

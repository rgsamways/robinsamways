## Context

Farpost Atlas started as an unscoped lightbulb (`rsw-lb-farpost-atlas`, logged 2026-07-10) written explicitly to prove out a convention that existed only hypothetically until now: `CLAUDE.md`'s "Portfolio piece isolation" section cites "real GIS libraries (`geopandas`/GDAL)" as its example of a heavy/native dependency that should get its own `pieces/<name>/` deployable rather than living in `api/`'s shared, lightweight `httpx`-based stack. It also absorbs a second, older, homeless lightbulb (`rsw-lb-rural-demographics-api`, logged 2026-07-07) — real Statistics Canada rural-demographic data that had no piece to live in yet. Robin confirmed this ships as a Narrative-type piece and chose the full-weight option (real `geopandas`/Shapely as a genuine runtime dependency of a separately-deployed service, not a one-off local script) specifically to exercise the isolation convention for real, not just on paper.

## Goals / Non-Goals

**Goals:**
- Ship a real, working two-route app demonstrating genuine spatial/GIS work — a point-in-polygon spatial join against real Statistics Canada census boundary data, not just markers rendered on a map.
- Make `pieces/farpost-atlas-geo/` the first real, deployed instance of the isolation convention's heavy-dependency trigger.
- Directly echo Farpost's own real staleness mechanic (`/farpost`'s septic "3 years stale" fact) with tracked buildings and tracked records, so the piece reads as a genuine extension of Farpost's building-intelligence thesis, not a generic mapping demo.
- Add Farpost Atlas as a real, accurate `/narrative` index entry.

**Non-Goals:**
- Live/dynamic building submission or any write endpoints — buildings and tracked records are fixed seed data; the value being demonstrated is the spatial join and its visualization, not another CRUD surface (Pulse already proved that pattern).
- Province-wide or national boundary data — scoped to North Hastings, Ontario only, to keep ingestion and file size tractable.
- The full standalone public Rural Ontario Demographics API described in `rsw-lb-rural-demographics-api` — this change borrows only the North Hastings boundary and population-density data needed for Atlas's own spatial join. The broader "public API for others to consume" idea stays open and unscoped.
- PostGIS or any spatial database extension — boundary/building volumes here are a few dozen polygons and a dozen-odd buildings, well within what an in-memory Shapely spatial index handles without a heavier dependency.
- Porting anything to farpost.ca itself — this ships as a robinsamways.ca portfolio piece; a real port is future work, made easier by this piece already being independent infrastructure.
- Any change to `api/`, Credential Flow, Farpost Pulse, Method, or Sreditor.

## Decisions

- **`pieces/farpost-atlas-geo/` (Python, FastAPI) from day one, not started inside `api/`.** Considered and rejected: prototyping inside `api/` first and promoting later, the usual default. Rejected because the point of this change is specifically to exercise the isolation convention's heavy-dependency trigger with a real deployed instance — starting inside `api/` and promoting later would still work technically, but wouldn't be the genuine first real test case the lightbulb was written to produce. `geopandas` handles one-time ingestion/reprojection; Shapely's spatial index runs the actual point-in-polygon join on every `GET /api/buildings` request in the live deployed service — a real runtime dependency, not just a dev-time tool (contrast with `pymupdf`, used once locally and logged in `docs/stack.md` as ephemeral, never deployed).
- **No PostGIS — an in-memory Shapely `STRtree`, built once at FastAPI startup from a pre-processed GeoJSON file.** At this scale (a few dozen North Hastings DA polygons, 12-15 buildings) a spatial database extension is unjustified weight. Buildings and tracked records themselves live in a small Postgres database (Railway, matching `api/`'s existing pattern and `rsw-lb-rural-demographics-api`'s original infra plan) — only the boundary-polygon lookup uses the in-memory index.
- **Boundary data: Statistics Canada's 2021 Census Dissemination Area cartographic boundary file, scoped to North Hastings.** A Dissemination Area is StatCan's smallest standard geography (population 400-700), giving genuinely fine-grained rurality resolution rather than a single county-wide bucket. The raw file ships in Lambert conformal conic projection (NAD83); a one-time `geopandas` ingestion script reprojects to WGS84 (what Leaflet expects), simplifies geometry for web rendering, joins DA-level population/dwelling counts from StatCan's census profile tables (by DGUID) to compute a population-density figure per polygon, and writes a clean GeoJSON checked into `pieces/farpost-atlas-geo/data/`. This ingestion step runs once, locally, before this change ships — it is not part of the live request path.
- **Frontend calls `farpost-atlas-geo` directly from the browser**, same pattern as Pulse's relationship with its Function App and for the same reason: nothing sensitive is at stake (all data is seeded/fake), so a server-side proxy through `api/` would add complexity without adding real protection. Exposed via `NEXT_PUBLIC_FARPOST_ATLAS_API_URL`.
- **Mapping library: `react-leaflet` + OpenStreetMap tiles, not Mapbox or Azure Maps.** No API key or vendor account needed (unlike Mapbox), and no reason to reach for Azure again just for brand consistency with Pulse — Leaflet is the standard, well-documented choice for rendering GeoJSON polygon overlays plus marker clustering, and keeps this piece's own stack decisions justified on their own technical merits rather than following Pulse's lead. Marker clustering via a standard Leaflet clustering plugin.
- **Staleness computed server-side, per tracked record, not stored.** Each `TrackedRecord` has a `recordType` (`septic`, `well_pump`, `foundation`, `electrical_panel`) and a `lastRecordedDate`; each `recordType` carries its own "expected refresh interval," anchored on the real example already established on `/farpost` (septic pump-out, ~36 months). `isStale`/`monthsStale` are computed at response time against the current date — a fact surfaced, not a verdict passed, matching `/farpost`'s own stated framing exactly.
- **Rurality is a property of the DA polygon a building's point falls inside**, joined at request time via the Shapely `STRtree` query, not precomputed and stored per building — if the boundary data is ever refreshed, buildings don't need re-processing.
- **Seed data uses clearly fictional names/addresses distinct from `/farpost`'s own "Marlene" example** — Atlas illustrates the same mechanic at a different, larger scale (many tracked buildings across a region, mapped), not a literal re-telling of Farpost's one worked example.
- **Section structure: Narrative-type**, per Robin's framing of this as a "big narrative piece." Follows the same free-form case-study shape as Credential Flow and Farpost Pulse, not the Method-type PROBLEM/EXISTING_APPROACHES/HYPOTHESIS/METHOD/RESULTS/CONCLUSION structure.
- **Two routes, not three.** Unlike Pulse's roster/detail/dashboard split, Atlas's map view already is the aggregate/overview surface — a third "dashboard" route aggregating stats a visitor can already read off the map (rural vs. urban building counts, staleness distribution) would be redundant rather than a genuinely distinct interactive view. Building detail is the one drill-down that needs its own page.

## Risks / Trade-offs

- [In-memory Shapely spatial index rebuilds from the checked-in GeoJSON on every cold start] → acceptable at this scale (tens of polygons); would need a persisted index or PostGIS at real production scale, not a concern for a portfolio demo.
- [StatCan's boundary files ship in Lambert conformal conic/NAD83, not the WGS84 Leaflet expects] → handled once at ingestion time via `geopandas`' reprojection, not a per-request cost or a live failure mode.
- [Two separately-deployed Python services (`api/` and `pieces/farpost-atlas-geo/`) means two Railway services to provision, monitor, and pay for] → the accepted cost of the isolation convention's own trigger, taken deliberately here specifically to prove the convention works as designed, not incurred accidentally.
- [No live write endpoints means Atlas demonstrates less "full CRUD" breadth than Pulse] → acceptable and deliberate; Pulse already proved that pattern, Atlas's differentiation is spatial-join depth instead.
- [Simplifying DA polygon geometry for web rendering could visibly distort boundaries at close zoom] → acceptable for a portfolio demo at regional zoom levels; simplification tolerance is a tuning knob in the ingestion script, not a structural constraint.

## Migration Plan

1. Source Statistics Canada's 2021 Census Dissemination Area cartographic boundary file and DA-level population/dwelling count table, scoped to North Hastings.
2. Write the one-time `geopandas` ingestion script: reproject to WGS84, simplify geometry, join population-density figures by DGUID, export a clean GeoJSON checked into `pieces/farpost-atlas-geo/data/`.
3. Build `pieces/farpost-atlas-geo/`'s FastAPI app: load the GeoJSON into a Shapely `STRtree` at startup, implement `GET /api/buildings`, `GET /api/buildings/{id}`, `GET /api/boundaries`; seed Postgres with 12-15 buildings and their tracked records.
4. Build the two Next.js routes against local/mock data first, then against the real deployed backend.
5. Document the CORS configuration and the `NEXT_PUBLIC_FARPOST_ATLAS_API_URL` env var Robin needs to set in Vercel.
6. Update the `/narrative` index's Farpost Atlas entry (teaser + tags).
7. Robin provisions the Railway service and Postgres database, deploys `farpost-atlas-geo`, sets the frontend env var — outside this change's own scope, documented for a clean handoff (same pattern as Pulse's Azure deployment).

## Open Questions

- Exact wording for the landing page's case-study narrative — first-pass draft acceptable, same "flag if exact wording is wanted instead" convention used on prior changes.
- Whether each `recordType`'s "expected refresh interval" should be independently tuned or share sensible defaults anchored on the septic 36-month example — left to implementation judgment.

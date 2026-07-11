# Farpost Atlas — `farpost-atlas-geo`

A real GIS backend: a point-in-polygon spatial join between seeded tracked-building coordinates and Statistics Canada's 2021 Census Dissemination Area boundary data, scoped to North Hastings, Ontario. Backs the `/narrative/farpost-atlas` map and building-detail pages. Isolated from `api/` under `CLAUDE.md`'s "Portfolio piece isolation" convention — Shapely is a genuine runtime dependency here, not a one-off local script; `geopandas` isn't (see below).

## Boundary data ingestion

`data/da_boundaries_north_hastings.geojson` (checked into this repo, ~130 KB) is the *output* of a one-time ingestion script. It is not regenerated at runtime or at deploy time — only re-run manually if the source data changes.

### Re-running `scripts/ingest_boundaries.py`

1. Download Statistics Canada's 2021 Census Dissemination Area **cartographic boundary file** (all of Canada, ~197 MB zipped, NAD83 / Statistics Canada Lambert projection):
   `https://www12.statcan.gc.ca/census-recensement/2021/geo/sip-pis/boundary-limites/files-fichiers/lda_000b21a_e.zip`
   Unzip into `data/raw/` (so `data/raw/lda_000b21a_e.shp` and its sibling `.dbf`/`.shx`/`.prj`/`.xml` files exist).
2. Download Statistics Canada table **98-10-0015-01** (2021 population and dwelling counts, land area, and population density by Dissemination Area), CSV format:
   `https://www150.statcan.gc.ca/n1/tbl/csv/98100015-eng.zip`
   Unzip `98100015.csv` into `data/raw/`.
3. The script also needs real municipal boundary polygons for North Hastings' seven constituent municipalities (Bancroft, Faraday, Carlow/Mayo, Hastings Highlands, Limerick, Tudor and Cashel, Wollaston) — used to spatially scope the national DA file down to North Hastings without needing StatCan's much larger Census Subdivision boundary file. The script fetches these itself from OpenStreetMap's Nominatim API on first run and caches the result to `data/raw/north_hastings_municipalities.geojson`; delete that cache file to force a re-fetch.
4. From this directory, with a Python 3.11+ virtualenv active and `requirements-ingest.txt` installed (`geopandas`/`pandas`/`requests` — one-time ingestion tooling, deliberately kept out of `requirements.txt` since the deployed service itself never needs `geopandas`, only the pre-processed GeoJSON and `shapely`):
   ```
   pip install -r requirements-ingest.txt
   python scripts/ingest_boundaries.py
   ```
   This reprojects the filtered DAs to WGS84 (what Leaflet expects), spatially filters to the 37 DAs that intersect North Hastings, joins the real StatCan population-density figure onto each by `DAUID`, simplifies geometry for web rendering, and writes `data/da_boundaries_north_hastings.geojson`.

`data/raw/` is gitignored (see the repo root's `.gitignore`) — the source files are large, publicly re-downloadable, and not needed at runtime; only the small processed output is committed.

## Running the backend

```
python -m venv .venv
.venv/Scripts/activate   # or source .venv/bin/activate on macOS/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Requires a `DATABASE_URL` environment variable pointing at a Postgres database (see `.env.example`) for `TrackedBuilding`/`TrackedRecord` data — the boundary GeoJSON above is loaded from disk, not the database.

## Seeding

```
python scripts/seed.py
```

Seeds 12-15 fictional tracked buildings across North Hastings with 2-4 tracked records each, patterned so some records are genuinely overdue and building placement spans village-centre to deep-rural Dissemination Areas.

## Testing

```
pytest
```

## CORS

Configure `farpost-atlas-geo` (once deployed) to accept cross-origin requests from `https://robinsamways.ca`, `https://www.robinsamways.ca`, and `http://localhost:3000` — see `app/main.py`'s CORS middleware configuration, matching the pattern already used by `api/` and `pieces/farpost-pulse-func/`.

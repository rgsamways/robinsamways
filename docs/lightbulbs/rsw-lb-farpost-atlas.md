# rsw-lb-farpost-atlas

**Slug:** rsw-lb-farpost-atlas
**Date logged:** 2026-07-10
**Status:** unscoped — idea captured, not yet spec'd
**Related:** `rsw-lb-rural-demographics-api.md` (the StatCan data this would consume), `CLAUDE.md`'s "Portfolio piece isolation" convention, `/narrative` (Narrative index — a `Method`-type or `Narrative`-type piece, not yet decided)

## The gap

Farpost Pulse proved genuine hands-on Node.js/Azure serverless experience. There's no portfolio piece yet demonstrating geospatial/GIS skills — a real, distinct technical category from anything built so far (OAuth integration, serverless + AI coaching), and one Robin explicitly wants a piece for. There's also an existing unscoped lightbulb (`rsw-lb-rural-demographics-api`) with real StatCan rural-demographic data and no home to actually use it in yet.

## The idea

**Farpost Atlas** — a geospatial map of tracked buildings, with two distinct pieces:

1. **Plotting buildings on a map** (markers, clustering) — mostly frontend work, a mapping API (Mapbox/Leaflet/Azure Maps), lat/lng points only. Not real GIS on its own.
2. **A rural-density overlay** using the StatCan data from `rsw-lb-rural-demographics-api` — matching a building's point location against census boundary polygons ("is this building in a rural area, and how rural"). This is the piece that's genuine GIS: a spatial join, not just rendering pins. Staleness indicators (echoing Farpost's own "septic last pumped 3 years ago" mechanic) would layer on top — which tracked buildings have overdue records, shown spatially.

Directly portable to farpost.ca, not just thematically adjacent — a map of tracked buildings with staleness flags is an obviously valuable real feature for a building-intelligence platform.

## Why it matters beyond convenience

- Proves a genuinely different skill category (spatial data, mapping APIs, possibly PostGIS/`geopandas`) than anything built so far — not a repeat of Credential Flow's OAuth work or Pulse's serverless/AI pattern.
- Becomes the first real test case for the "Portfolio piece isolation" convention's heavy/native-dependency trigger, written hypothetically (using GIS as the example) before this piece existed to actually prove it out.
- Reuses an already-captured, currently-homeless idea (the rural demographics data) instead of starting cold.

## Open questions

- Method-type or Narrative-type? It could go either way — real spatial-join work has genuine technical uncertainty worth documenting (Method), but it's also a concrete "I built this feature" story (Narrative). Worth deciding deliberately rather than defaulting.
- Does this need real Python geospatial tooling (`geopandas`/Shapely, its own `pieces/` folder) from day one, or can a first pass use simpler point-in-polygon logic without the heavy dependency, promoting later only if it proves necessary?
- Exact data source/format for the census boundary polygons — StatCan publishes these, but the right ingestion approach isn't scoped yet.

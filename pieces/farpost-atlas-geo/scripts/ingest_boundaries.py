"""One-time ingestion script: builds the North Hastings Dissemination Area
boundary GeoJSON that farpost-atlas-geo's spatial index loads at startup.

Not part of the live request path -- run manually whenever the source data
changes (see the README in this piece's root for the full re-run instructions
and where each source file comes from).

Inputs (not checked into the repo -- see README for download instructions):
  - Statistics Canada's 2021 Census Dissemination Area cartographic boundary
    shapefile (lda_000b21a_e.shp and its sibling files), NAD83 / Statistics
    Canada Lambert (EPSG:3347).
  - Statistics Canada table 98-10-0015-01 (population and dwelling counts,
    land area, and population density per Dissemination Area, 2021 Census),
    as CSV.
  - Real municipal boundary polygons (WGS84) for North Hastings' seven
    constituent municipalities, fetched from OpenStreetMap's Nominatim API
    (see fetch_municipality_boundaries() below) -- used to spatially scope
    the national DA file down to North Hastings without needing StatCan's
    much larger Census Subdivision boundary file.

Output:
  data/da_boundaries_north_hastings.geojson -- a FeatureCollection of DA
  polygons (WGS84) intersecting North Hastings, each carrying DAUID and a
  real, StatCan-sourced population-density figure.
"""

import json
import time
from pathlib import Path

import geopandas as gpd
import pandas as pd
import requests
from shapely.ops import unary_union

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
RAW_DIR = Path(__file__).resolve().parent.parent / "data" / "raw"

DA_SHAPEFILE = RAW_DIR / "lda_000b21a_e.shp"
POPULATION_CSV = RAW_DIR / "98100015.csv"
OUTPUT_GEOJSON = DATA_DIR / "da_boundaries_north_hastings.geojson"

# The seven municipalities that make up North Hastings, per northhastings.com
# ("North Hastings ... encompasses seven municipalities as well as the towns
# of Bancroft, Maynooth and Coe Hill" -- Maynooth and Coe Hill are unincorporated
# communities within Hastings Highlands and Wollaston respectively, not
# separate municipalities, so they aren't queried again here).
NORTH_HASTINGS_MUNICIPALITIES = [
    "Bancroft, Ontario, Canada",
    "Faraday, Ontario, Canada",
    "Carlow/Mayo, Ontario, Canada",
    "Hastings Highlands, Ontario, Canada",
    "Limerick, Ontario, Canada",
    "Tudor and Cashel, Ontario, Canada",
    "Wollaston, Ontario, Canada",
]

NOMINATIM_USER_AGENT = "farpost-atlas-geo-ingestion/1.0 (robinsamways.ca portfolio project)"

# Simplification tolerance in degrees, applied after reprojection to WGS84.
# Chosen empirically to keep the output GeoJSON small for web rendering while
# leaving DA boundaries clearly distinguishable at regional (not building-lot)
# zoom levels -- see design.md's "simplifying DA polygon geometry" trade-off.
SIMPLIFY_TOLERANCE_DEGREES = 0.0003


def fetch_municipality_boundaries() -> gpd.GeoDataFrame:
    """Real municipal boundary polygons from OpenStreetMap's Nominatim API,
    used to spatially scope the national DA file to North Hastings. Cached
    to data/raw/ so re-running the script doesn't re-hit Nominatim's shared,
    rate-limited public instance unnecessarily."""
    cache_path = RAW_DIR / "north_hastings_municipalities.geojson"
    if cache_path.exists():
        return gpd.read_file(cache_path)

    features = []
    for query in NORTH_HASTINGS_MUNICIPALITIES:
        response = requests.get(
            "https://nominatim.openstreetmap.org/search",
            params={"q": query, "format": "jsonv2", "polygon_geojson": 1, "limit": 1},
            headers={"User-Agent": NOMINATIM_USER_AGENT},
            timeout=15,
        )
        response.raise_for_status()
        results = response.json()
        if not results:
            raise RuntimeError(f"Nominatim returned no result for {query!r}")
        result = results[0]
        features.append(
            {
                "type": "Feature",
                "properties": {"name": result["name"]},
                "geometry": result["geojson"],
            }
        )
        time.sleep(1.1)  # Nominatim's usage policy: max 1 request/second.

    gdf = gpd.GeoDataFrame.from_features(features, crs="EPSG:4326")
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    gdf.to_file(cache_path, driver="GeoJSON")
    return gdf


def load_population_density() -> pd.DataFrame:
    """DAUID -> population-density figures from StatCan table 98-10-0015-01,
    already computed by StatCan itself (population / land area), not
    re-derived here."""
    df = pd.read_csv(POPULATION_CSV, encoding="utf-8-sig")
    df = df.rename(
        columns={
            "GEO": "DAUID",
            "Population and dwelling counts (5): Population, 2021 [1]": "population",
            "Population and dwelling counts (5): Land area in square kilometres, 2021 [4]": "land_area_km2",
            "Population and dwelling counts (5): Population density per square kilometre, 2021 [5]": "population_density",
        }
    )
    # DA-level rows have a purely numeric DAUID (province/CD/CSD-level rows
    # have text names in this column instead, e.g. "Ontario").
    df = df[df["DAUID"].astype(str).str.fullmatch(r"\d{8}")]
    df["DAUID"] = df["DAUID"].astype(str)
    return df[["DAUID", "population", "land_area_km2", "population_density"]]


def main() -> None:
    print("Loading North Hastings municipality boundaries (Nominatim/OSM)...")
    municipalities = fetch_municipality_boundaries()
    north_hastings_region = unary_union(municipalities.geometry)
    print(f"  {len(municipalities)} municipalities loaded, union area covers North Hastings.")

    print("Loading Ontario Dissemination Areas from the StatCan cartographic boundary file...")
    da = gpd.read_file(DA_SHAPEFILE, where="PRUID = '35'")
    print(f"  {len(da)} Ontario DAs loaded (from 57,932 nationally).")

    print("Reprojecting to WGS84...")
    da = da.to_crs("EPSG:4326")

    print("Spatially filtering to DAs intersecting North Hastings...")
    da = da[da.geometry.intersects(north_hastings_region)].copy()
    print(f"  {len(da)} DAs intersect North Hastings.")

    print("Joining real StatCan population-density figures (table 98-10-0015-01)...")
    density = load_population_density()
    da = da.merge(density, on="DAUID", how="left")
    missing = da["population_density"].isna().sum()
    if missing:
        print(f"  WARNING: {missing} DA(s) had no matching population-density row.")

    print(f"Simplifying geometry (tolerance={SIMPLIFY_TOLERANCE_DEGREES} degrees)...")
    da["geometry"] = da.geometry.simplify(SIMPLIFY_TOLERANCE_DEGREES, preserve_topology=True)

    output = da[["DAUID", "population", "land_area_km2", "population_density", "geometry"]]

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    output.to_file(OUTPUT_GEOJSON, driver="GeoJSON")
    print(f"Wrote {len(output)} DA polygons to {OUTPUT_GEOJSON}")


if __name__ == "__main__":
    main()

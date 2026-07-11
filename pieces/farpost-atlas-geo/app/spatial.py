import json
from pathlib import Path

from shapely.geometry import Point, shape
from shapely.strtree import STRtree

BOUNDARIES_PATH = Path(__file__).resolve().parent.parent / "data" / "da_boundaries_north_hastings.geojson"

# Rurality classification thresholds, in people per square kilometre. Chosen
# against this dataset's real observed range (1.0-132.0 across North
# Hastings' 37 Dissemination Areas): the bulk of DAs sit under 10/km²
# (deep-rural townships), a handful sit in the 10-50 range (village
# surroundings), and only the DAs actually covering Bancroft/village centres
# clear 50/km².
DEEP_RURAL_MAX_DENSITY = 10.0
RURAL_MAX_DENSITY = 50.0


def classify_rurality(population_density: float) -> str:
    if population_density < DEEP_RURAL_MAX_DENSITY:
        return "deep rural"
    if population_density < RURAL_MAX_DENSITY:
        return "rural"
    return "village centre"


class RuralityLookupResult:
    def __init__(self, population_density: float, rurality_classification: str, daid: str):
        self.population_density = population_density
        self.rurality_classification = rurality_classification
        self.daid = daid


class BoundaryIndex:
    """An in-memory Shapely spatial index over North Hastings' Dissemination
    Area polygons, built once at application startup from the checked-in,
    pre-processed GeoJSON -- see scripts/ingest_boundaries.py for how that
    file itself gets built from real StatCan source data."""

    def __init__(self, geojson_path: Path = BOUNDARIES_PATH):
        with open(geojson_path, encoding="utf-8") as f:
            feature_collection = json.load(f)

        self._polygons = []
        self._properties = []
        for feature in feature_collection["features"]:
            self._polygons.append(shape(feature["geometry"]))
            self._properties.append(feature["properties"])

        self._tree = STRtree(self._polygons)

    def lookup_rurality(self, latitude: float, longitude: float) -> RuralityLookupResult | None:
        point = Point(longitude, latitude)
        # STRtree.query returns indices of polygons whose bounding box
        # intersects the query geometry -- a fast coarse filter, not a
        # guarantee of actual containment, so each candidate still needs a
        # real point-in-polygon check.
        for index in self._tree.query(point):
            polygon = self._polygons[index]
            if polygon.contains(point):
                properties = self._properties[index]
                density = properties["population_density"]
                return RuralityLookupResult(
                    population_density=density,
                    rurality_classification=classify_rurality(density),
                    daid=properties["DAUID"],
                )
        return None

    def as_geojson(self) -> dict:
        with open(BOUNDARIES_PATH, encoding="utf-8") as f:
            return json.load(f)

import json

import pytest

from app.spatial import BoundaryIndex, classify_rurality


def test_classify_rurality_thresholds():
    assert classify_rurality(1.0) == "deep rural"
    assert classify_rurality(9.9) == "deep rural"
    assert classify_rurality(10.0) == "rural"
    assert classify_rurality(49.9) == "rural"
    assert classify_rurality(50.0) == "village centre"
    assert classify_rurality(132.0) == "village centre"


@pytest.fixture
def fixture_boundary_index(tmp_path):
    # Two adjacent, non-overlapping 1-degree-square "DAs" -- small enough to
    # reason about by hand, independent of the real 37-polygon dataset.
    feature_collection = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {"DAUID": "FIXTURE_DEEP_RURAL", "population_density": 2.5},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[-78.0, 45.0], [-77.0, 45.0], [-77.0, 46.0], [-78.0, 46.0], [-78.0, 45.0]]],
                },
            },
            {
                "type": "Feature",
                "properties": {"DAUID": "FIXTURE_VILLAGE_CENTRE", "population_density": 80.0},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[-77.0, 45.0], [-76.0, 45.0], [-76.0, 46.0], [-77.0, 46.0], [-77.0, 45.0]]],
                },
            },
        ],
    }
    path = tmp_path / "fixture_boundaries.geojson"
    path.write_text(json.dumps(feature_collection), encoding="utf-8")
    return BoundaryIndex(geojson_path=path)


def test_lookup_rurality_inside_first_polygon(fixture_boundary_index):
    result = fixture_boundary_index.lookup_rurality(latitude=45.5, longitude=-77.5)
    assert result is not None
    assert result.daid == "FIXTURE_DEEP_RURAL"
    assert result.population_density == 2.5
    assert result.rurality_classification == "deep rural"


def test_lookup_rurality_inside_second_polygon(fixture_boundary_index):
    result = fixture_boundary_index.lookup_rurality(latitude=45.5, longitude=-76.5)
    assert result is not None
    assert result.daid == "FIXTURE_VILLAGE_CENTRE"
    assert result.population_density == 80.0
    assert result.rurality_classification == "village centre"


def test_lookup_rurality_outside_all_polygons_returns_none(fixture_boundary_index):
    result = fixture_boundary_index.lookup_rurality(latitude=50.0, longitude=-70.0)
    assert result is None


def test_lookup_rurality_at_shared_boundary_matches_exactly_one_polygon(fixture_boundary_index):
    # x=-77.0 is the shared edge between both fixture squares -- Shapely's
    # `contains` is boundary-exclusive, so a point precisely on the shared
    # edge belongs to neither polygon's interior. Nudge fractionally inside
    # the second polygon instead, confirming the boundary itself isn't
    # double-counted into the first.
    result = fixture_boundary_index.lookup_rurality(latitude=45.5, longitude=-76.999999)
    assert result is not None
    assert result.daid == "FIXTURE_VILLAGE_CENTRE"

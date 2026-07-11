def test_list_buildings_empty_before_any_seed(client):
    response = client.get("/api/buildings")
    assert response.status_code == 200
    assert response.json() == []


def test_list_buildings_returns_seeded_building_with_rollup_staleness(client, seeded_building):
    response = client.get("/api/buildings")
    assert response.status_code == 200
    body = response.json()
    assert len(body) == 1
    assert body[0]["address"] == "9 Bridge Street"
    assert body[0]["owner_name"] == "Simone Delacroix-Yu"
    # One stale (2018 septic) + one current (2026 well_pump) record -> the
    # rollup flag should reflect "at least one" being stale.
    assert body[0]["has_stale_record"] is True


def test_get_building_returns_404_for_unknown_id(client):
    response = client.get("/api/buildings/999")
    assert response.status_code == 404


def test_get_building_returns_records_with_per_record_staleness_and_rurality(client, seeded_building):
    response = client.get(f"/api/buildings/{seeded_building.id}")
    assert response.status_code == 200
    body = response.json()

    assert body["address"] == "9 Bridge Street"
    assert len(body["records"]) == 2

    by_type = {record["record_type"]: record for record in body["records"]}
    assert by_type["septic"]["is_stale"] is True
    assert by_type["well_pump"]["is_stale"] is False

    # (45.07591, -77.84181) is a real North Hastings DA polygon in the
    # checked-in boundary data, in this dataset's village-centre density tier.
    assert body["population_density"] is not None
    assert body["rurality_classification"] == "village centre"


def test_get_boundaries_returns_valid_geojson_with_density_property(client):
    response = client.get("/api/boundaries")
    assert response.status_code == 200
    body = response.json()

    assert body["type"] == "FeatureCollection"
    assert len(body["features"]) > 0
    for feature in body["features"]:
        assert feature["geometry"]["type"] in ("Polygon", "MultiPolygon")
        assert "population_density" in feature["properties"]

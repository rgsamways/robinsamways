import os
from pathlib import Path

# Set before any `app.*` import: app.db reads DATABASE_URL at import time.
# Tests get their own real (if lightweight) SQLite database rather than
# mocking persistence entirely -- TrackedBuilding/TrackedRecord querying is
# itself the thing worth integration-testing here, unlike api/'s Salesforce
# router where the database was incidental and only the outbound HTTP call
# needed monkeypatching. A file (not `:memory:`) so the same data is visible
# across the connection pool's multiple connections.
TEST_DB_PATH = Path(__file__).resolve().parent / "test.sqlite3"
if TEST_DB_PATH.exists():
    TEST_DB_PATH.unlink()
os.environ["DATABASE_URL"] = f"sqlite+aiosqlite:///{TEST_DB_PATH}"

from datetime import date

import pytest
from fastapi.testclient import TestClient

from app.db import async_session
from app.main import app
from app.models import RecordType, TrackedBuilding, TrackedRecord


@pytest.fixture
def client():
    # Used as a context manager (unlike api/'s tests) since this piece's
    # lifespan is safe to run in full here -- it only touches the test
    # SQLite file above and reads a local GeoJSON, no live external service.
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
async def seeded_building(client):
    async with async_session() as session:
        building = TrackedBuilding(
            address="9 Bridge Street",
            latitude=45.07591,
            longitude=-77.84181,  # a real North Hastings DA polygon (village-centre tier)
            owner_name="Simone Delacroix-Yu",
            region_name="Bancroft",
        )
        session.add(building)
        await session.flush()
        session.add(
            TrackedRecord(
                building_id=building.id,
                record_type=RecordType.septic,
                last_recorded_date=date(2018, 1, 1),  # well past the 36-month threshold
                notes=None,
            )
        )
        session.add(
            TrackedRecord(
                building_id=building.id,
                record_type=RecordType.well_pump,
                last_recorded_date=date(2026, 5, 15),  # recent, not stale
                notes=None,
            )
        )
        await session.commit()
        await session.refresh(building)
        return building

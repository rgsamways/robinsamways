"""Seeds farpost-atlas-geo's Postgres database with 13 fictional tracked
buildings across North Hastings and their tracked records.

Coordinates are real representative points sampled from inside the actual
Dissemination Area polygons in data/da_boundaries_north_hastings.geojson
(via shapely's representative_point(), not eyeballed), spanning that
dataset's real observed density range -- so the spatial join and rurality
classification both have genuine variation to show, not just fake numbers.
Owner names and addresses are fictional, deliberately distinct from
/farpost's own worked "Marlene" example. Run with: python scripts/seed.py
"""

import asyncio
from datetime import date

from app.db import async_session, init_db
from app.models import RecordType, TrackedBuilding, TrackedRecord

# Named date buckets, chosen so each record type's staleness threshold
# (see app/staleness.py) lands on a genuinely different side of "stale" for
# a mix of record types -- not just uniformly current or uniformly overdue.
VERY_RECENT = date(2026, 5, 15)  # current for every record type
RECENT = date(2024, 9, 1)  # current for every record type
MID = date(2022, 11, 1)  # stale for septic only
OLD = date(2021, 1, 1)  # stale for septic, well_pump, electrical_panel
VERY_OLD = date(2018, 1, 1)  # stale for every record type

BUILDINGS = [
    {
        "address": "88 Weslemkoon Lake Road",
        "region_name": "Wollaston Township",
        "latitude": 44.96533,
        "longitude": -77.34589,
        "owner_name": "Derek Fenwick",
        "records": [
            (RecordType.septic, OLD, "Tank pumped by Bancroft Septic Service."),
            (RecordType.well_pump, VERY_RECENT, None),
            (RecordType.foundation, RECENT, "Minor hairline crack noted, monitored."),
        ],
    },
    {
        "address": "1470 Elephant Lake Road",
        "region_name": "Limerick Township",
        "latitude": 44.94754,
        "longitude": -77.51901,
        "owner_name": "Priya Chandrasekaran",
        "records": [
            (RecordType.septic, RECENT, None),
            (RecordType.electrical_panel, VERY_OLD, "Original 100A panel, pre-2000."),
        ],
    },
    {
        "address": "56 Papineau Lake Road",
        "region_name": "Limerick Township",
        "latitude": 44.70636,
        "longitude": -77.38143,
        "owner_name": "Marcus Whitfeld",
        "records": [
            (RecordType.septic, MID, None),
            (RecordType.well_pump, MID, "Pressure tank replaced."),
            (RecordType.foundation, OLD, None),
            (RecordType.electrical_panel, RECENT, "Upgraded to 200A."),
        ],
    },
    {
        "address": "302 Baptiste Lake Road",
        "region_name": "Hastings Highlands",
        "latitude": 45.28092,
        "longitude": -78.05449,
        "owner_name": "Sandra Okonkwo-Reyes",
        "records": [
            (RecordType.well_pump, OLD, None),
            (RecordType.foundation, VERY_RECENT, "New poured concrete foundation."),
        ],
    },
    {
        "address": "19 Fire Route 22",
        "region_name": "Carlow/Mayo Township",
        "latitude": 45.24955,
        "longitude": -77.34211,
        "owner_name": "Elijah Tremblay-Voss",
        "records": [
            (RecordType.septic, VERY_RECENT, None),
            (RecordType.electrical_panel, OLD, None),
            (RecordType.foundation, MID, None),
        ],
    },
    {
        "address": "740 Diamond Lake Road",
        "region_name": "Tudor and Cashel Township",
        "latitude": 44.64315,
        "longitude": -77.73194,
        "owner_name": "Nadia Bergstrom",
        "records": [
            (RecordType.septic, VERY_OLD, "No record of pump-out since original install."),
            (RecordType.well_pump, VERY_OLD, None),
        ],
    },
    {
        "address": "12 Musclow Road",
        "region_name": "Faraday Township",
        "latitude": 45.15215,
        "longitude": -77.58484,
        "owner_name": "Colton Aberfoyle",
        "records": [
            (RecordType.septic, RECENT, None),
            (RecordType.well_pump, RECENT, None),
            (RecordType.foundation, RECENT, "Well-maintained, seasonal cottage."),
        ],
    },
    {
        "address": "5 Hybla Road",
        "region_name": "Faraday Township",
        "latitude": 45.03474,
        "longitude": -77.96187,
        "owner_name": "Renata Kowalczyk",
        "records": [
            (RecordType.septic, MID, None),
            (RecordType.electrical_panel, MID, None),
        ],
    },
    {
        "address": "148 York River Road",
        "region_name": "Faraday Township",
        "latitude": 45.02137,
        "longitude": -77.85547,
        "owner_name": "Owen Mattheson",
        "records": [
            (RecordType.septic, VERY_RECENT, None),
            (RecordType.well_pump, OLD, None),
            (RecordType.foundation, OLD, None),
            (RecordType.electrical_panel, MID, "Breaker panel labelled and photographed."),
        ],
    },
    {
        "address": "27 Bay Lake Road",
        "region_name": "Carlow/Mayo Township",
        "latitude": 45.36122,
        "longitude": -77.63311,
        "owner_name": "Bridget O'Halloran",
        "records": [
            (RecordType.well_pump, RECENT, None),
            (RecordType.foundation, VERY_OLD, None),
        ],
    },
    {
        "address": "9 Bridge Street",
        "region_name": "Bancroft",
        "latitude": 45.07591,
        "longitude": -77.84181,
        "owner_name": "Simone Delacroix-Yu",
        "records": [
            (RecordType.septic, VERY_RECENT, None),
            (RecordType.electrical_panel, RECENT, None),
        ],
    },
    {
        "address": "22 Station Street",
        "region_name": "Bancroft",
        "latitude": 45.07283,
        "longitude": -77.87485,
        "owner_name": "Harold Whitbeck",
        "records": [
            (RecordType.septic, OLD, None),
            (RecordType.well_pump, MID, None),
            (RecordType.foundation, RECENT, None),
        ],
    },
    {
        "address": "41 Hastings Street North",
        "region_name": "Bancroft",
        "latitude": 45.05985,
        "longitude": -77.87588,
        "owner_name": "Aisha Okafor-Lindqvist",
        "records": [
            (RecordType.septic, MID, None),
            (RecordType.well_pump, VERY_OLD, "Original well pump, homeowner unsure of age."),
            (RecordType.electrical_panel, VERY_RECENT, None),
            (RecordType.foundation, RECENT, None),
        ],
    },
]


async def main() -> None:
    await init_db()
    async with async_session() as session:
        for entry in BUILDINGS:
            building = TrackedBuilding(
                address=entry["address"],
                latitude=entry["latitude"],
                longitude=entry["longitude"],
                owner_name=entry["owner_name"],
                region_name=entry["region_name"],
            )
            session.add(building)
            await session.flush()  # assigns building.id without committing yet

            for record_type, last_recorded_date, notes in entry["records"]:
                session.add(
                    TrackedRecord(
                        building_id=building.id,
                        record_type=record_type,
                        last_recorded_date=last_recorded_date,
                        notes=notes,
                    )
                )

        await session.commit()

    total_records = sum(len(b["records"]) for b in BUILDINGS)
    print(f"Seeded {len(BUILDINGS)} buildings, {total_records} tracked records.")


if __name__ == "__main__":
    asyncio.run(main())

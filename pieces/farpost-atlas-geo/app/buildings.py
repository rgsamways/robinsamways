from datetime import date

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from sqlmodel import select

from app.db import async_session
from app.models import RecordType, TrackedBuilding, TrackedRecord
from app.staleness import compute_staleness

router = APIRouter()


class BuildingSummaryOut(BaseModel):
    id: int
    address: str
    latitude: float
    longitude: float
    owner_name: str
    region_name: str
    has_stale_record: bool


class TrackedRecordOut(BaseModel):
    id: int
    record_type: RecordType
    last_recorded_date: date
    notes: str | None
    is_stale: bool
    months_stale: int


class BuildingDetailOut(BaseModel):
    id: int
    address: str
    latitude: float
    longitude: float
    owner_name: str
    region_name: str
    records: list[TrackedRecordOut]
    population_density: float | None
    rurality_classification: str | None


def _to_record_out(record: TrackedRecord) -> TrackedRecordOut:
    is_stale, months_stale = compute_staleness(record.record_type, record.last_recorded_date)
    return TrackedRecordOut(
        id=record.id,
        record_type=record.record_type,
        last_recorded_date=record.last_recorded_date,
        notes=record.notes,
        is_stale=is_stale,
        months_stale=months_stale,
    )


@router.get("/api/buildings", response_model=list[BuildingSummaryOut])
async def list_buildings() -> list[BuildingSummaryOut]:
    async with async_session() as session:
        buildings = (await session.exec(select(TrackedBuilding))).all()
        results = []
        for building in buildings:
            records = (
                await session.exec(select(TrackedRecord).where(TrackedRecord.building_id == building.id))
            ).all()
            has_stale = any(compute_staleness(r.record_type, r.last_recorded_date)[0] for r in records)
            results.append(
                BuildingSummaryOut(
                    id=building.id,
                    address=building.address,
                    latitude=building.latitude,
                    longitude=building.longitude,
                    owner_name=building.owner_name,
                    region_name=building.region_name,
                    has_stale_record=has_stale,
                )
            )
        return results


@router.get("/api/buildings/{building_id}", response_model=BuildingDetailOut)
async def get_building(building_id: int, request: Request) -> BuildingDetailOut:
    async with async_session() as session:
        building = await session.get(TrackedBuilding, building_id)
        if building is None:
            raise HTTPException(status_code=404, detail="Building not found")

        records = (
            await session.exec(select(TrackedRecord).where(TrackedRecord.building_id == building_id))
        ).all()

    boundary_index = request.app.state.boundary_index
    rurality = boundary_index.lookup_rurality(building.latitude, building.longitude)

    return BuildingDetailOut(
        id=building.id,
        address=building.address,
        latitude=building.latitude,
        longitude=building.longitude,
        owner_name=building.owner_name,
        region_name=building.region_name,
        records=[_to_record_out(r) for r in records],
        population_density=rurality.population_density if rurality else None,
        rurality_classification=rurality.rurality_classification if rurality else None,
    )


@router.get("/api/boundaries")
async def get_boundaries(request: Request) -> dict:
    boundary_index = request.app.state.boundary_index
    return boundary_index.as_geojson()

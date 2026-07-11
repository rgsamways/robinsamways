from datetime import date
from enum import Enum

from sqlmodel import Field, SQLModel


class RecordType(str, Enum):
    septic = "septic"
    well_pump = "well_pump"
    foundation = "foundation"
    electrical_panel = "electrical_panel"


class TrackedBuilding(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    address: str
    latitude: float
    longitude: float
    owner_name: str
    region_name: str


class TrackedRecord(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    building_id: int = Field(foreign_key="trackedbuilding.id")
    record_type: RecordType
    last_recorded_date: date
    notes: str | None = None

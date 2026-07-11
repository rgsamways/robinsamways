from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import models  # noqa: F401  (registers SQLModel metadata)
from app.buildings import router as buildings_router
from app.db import init_db
from app.spatial import BoundaryIndex


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    # Built once at startup from the checked-in GeoJSON -- see
    # app/spatial.py and scripts/ingest_boundaries.py.
    app.state.boundary_index = BoundaryIndex()
    yield


app = FastAPI(title="Farpost Atlas Geo", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://robinsamways.ca",
        "https://www.robinsamways.ca",
        "http://localhost:3000",
    ],
    allow_methods=["GET"],
    allow_headers=["Content-Type"],
)

app.include_router(buildings_router)


@app.get("/health")
async def health() -> dict:
    return {"status": "ok"}

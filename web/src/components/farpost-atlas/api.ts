const API_URL = process.env.NEXT_PUBLIC_FARPOST_ATLAS_API_URL ?? "http://localhost:8000";

export type BuildingSummary = {
  id: number;
  address: string;
  latitude: number;
  longitude: number;
  owner_name: string;
  region_name: string;
  has_stale_record: boolean;
};

export type TrackedRecord = {
  id: number;
  record_type: "septic" | "well_pump" | "foundation" | "electrical_panel";
  last_recorded_date: string;
  notes: string | null;
  is_stale: boolean;
  months_stale: number;
};

export type BuildingDetail = {
  id: number;
  address: string;
  latitude: number;
  longitude: number;
  owner_name: string;
  region_name: string;
  records: TrackedRecord[];
  population_density: number | null;
  rurality_classification: string | null;
};

export type BoundaryFeatureCollection = {
  type: "FeatureCollection";
  features: {
    type: "Feature";
    properties: { DAUID: string; population: number; land_area_km2: number; population_density: number };
    geometry: GeoJSON.Geometry;
  }[];
};

export async function getBuildings(): Promise<BuildingSummary[]> {
  const response = await fetch(`${API_URL}/api/buildings`);
  if (!response.ok) throw new Error("request failed");
  return response.json();
}

export async function getBuilding(id: number): Promise<BuildingDetail> {
  const response = await fetch(`${API_URL}/api/buildings/${id}`);
  if (!response.ok) throw new Error("request failed");
  return response.json();
}

export async function getBoundaries(): Promise<BoundaryFeatureCollection> {
  const response = await fetch(`${API_URL}/api/boundaries`);
  if (!response.ok) throw new Error("request failed");
  return response.json();
}

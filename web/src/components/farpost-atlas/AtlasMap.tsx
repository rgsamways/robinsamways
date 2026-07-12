"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css";
import { getBuildings, getBoundaries, type BuildingSummary, type BoundaryFeatureCollection } from "./api";

// Leaflet's default marker icon references image URLs relative to the
// package itself, which breaks under a bundler unless pointed at real URLs
// explicitly -- the standard, documented workaround.
const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const staleMarkerIcon = L.icon({
  ...markerIcon.options,
  className: "atlas-marker-stale",
});

const NORTH_HASTINGS_CENTER: [number, number] = [45.05, -77.85];

function densityToFillColor(density: number): string {
  // Sequential ramp, light-to-dark by density, matching this dataset's real
  // observed tiers (see app/spatial.py's classify_rurality thresholds).
  if (density < 10) return "#fde68a";
  if (density < 50) return "#f59e0b";
  return "#b45309";
}

function BoundaryOverlay({ data }: { data: BoundaryFeatureCollection }) {
  return (
    <GeoJSON
      data={data as unknown as GeoJSON.GeoJsonObject}
      style={(feature) => ({
        fillColor: densityToFillColor(feature?.properties.population_density ?? 0),
        fillOpacity: 0.35,
        color: "var(--accent)",
        weight: 1,
      })}
      onEachFeature={(feature, layer) => {
        const { population_density, DAUID } = feature.properties;
        layer.bindTooltip(
          `${population_density} people/km² (Dissemination Area ${DAUID})`,
          { sticky: true }
        );
      }}
    />
  );
}

export default function AtlasMap() {
  const [buildings, setBuildings] = useState<BuildingSummary[]>([]);
  const [boundaries, setBoundaries] = useState<BoundaryFeatureCollection | null>(null);
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    getBuildings()
      .then((data) => {
        setBuildings(data);
        setStatus("loaded");
      })
      .catch(() => setStatus("error"));
  }, []);

  useEffect(() => {
    if (showOverlay && !boundaries) {
      getBoundaries()
        .then(setBoundaries)
        .catch(() => setBoundaries(null));
    }
  }, [showOverlay, boundaries]);

  if (status === "error") {
    return (
      <p className="text-sm">
        Couldn&rsquo;t reach the live Farpost Atlas backend right now. Try refreshing.
      </p>
    );
  }

  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-xs">
        <input
          type="checkbox"
          checked={showOverlay}
          onChange={(event) => setShowOverlay(event.target.checked)}
          className="h-4 w-4"
        />
        Show rural-density overlay (North Hastings Dissemination Areas)
      </label>
      <div className="h-[480px] w-full overflow-hidden border border-foreground/20">
        <MapContainer center={NORTH_HASTINGS_CENTER} zoom={10} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {showOverlay && boundaries && <BoundaryOverlay data={boundaries} />}
          <MarkerClusterGroup chunkedLoading>
            {buildings.map((building) => (
              <Marker
                key={building.id}
                position={[building.latitude, building.longitude]}
                icon={building.has_stale_record ? staleMarkerIcon : markerIcon}
              >
                <Popup>
                  <p className="font-semibold">{building.address}</p>
                  <p className="text-xs">{building.region_name}</p>
                  <Link href={`/farpost/farpost-atlas/${building.id}`} className="text-accent underline">
                    View tracked records &rarr;
                  </Link>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";

// Leaflet touches `window` at module-evaluation time, so it can only ever
// render client-side -- `ssr: false` is only valid from within a Client
// Component boundary in the App Router, hence this thin wrapper around the
// real map component.
const AtlasMap = dynamic(() => import("./AtlasMap"), {
  ssr: false,
  loading: () => <p className="text-sm text-muted">Loading map…</p>,
});

export default function AtlasMapLoader() {
  return <AtlasMap />;
}

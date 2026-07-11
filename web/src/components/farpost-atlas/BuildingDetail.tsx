"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBuilding, type BuildingDetail as BuildingDetailData } from "./api";

type LoadStatus = "loading" | "loaded" | "not-found" | "error";

const RECORD_TYPE_LABELS: Record<string, string> = {
  septic: "Septic",
  well_pump: "Well pump",
  foundation: "Foundation",
  electrical_panel: "Electrical panel",
};

export default function BuildingDetail({ buildingId }: { buildingId: number }) {
  const [building, setBuilding] = useState<BuildingDetailData | null>(null);
  const [status, setStatus] = useState<LoadStatus>("loading");

  useEffect(() => {
    setStatus("loading");
    getBuilding(buildingId)
      .then((data) => {
        setBuilding(data);
        setStatus("loaded");
      })
      .catch((error) => {
        setStatus(error?.message === "request failed" ? "not-found" : "error");
      });
  }, [buildingId]);

  if (status === "loading") {
    return (
      <main className="py-10">
        <p className="text-muted">Loading…</p>
      </main>
    );
  }
  if (status === "not-found") {
    return (
      <main className="py-10">
        <p className="text-sm">No tracked building found with that id.</p>
        <Link href="/narrative/farpost-atlas" className="mt-2 inline-block text-sm text-accent hover:underline">
          ← Back to the map
        </Link>
      </main>
    );
  }
  if (status === "error" || !building) {
    return (
      <main className="py-10">
        <p className="text-sm">
          Couldn&rsquo;t reach the live Farpost Atlas backend right now. Try refreshing.
        </p>
      </main>
    );
  }

  return (
    <main className="py-10">
      <p className="text-xs">
        <Link href="/narrative/farpost-atlas" className="text-accent hover:underline">
          ← Back to the map
        </Link>
      </p>
      <h1 className="mt-2 text-xl font-bold">
        <span className="text-accent">$</span> {building.address}
      </h1>
      <p className="mt-1 text-sm text-muted">
        {building.region_name} · owner on record: {building.owner_name}
      </p>
      {building.rurality_classification && (
        <p className="mt-1 text-sm">
          Rurality: <span className="text-accent">{building.rurality_classification}</span>{" "}
          <span className="text-muted">
            ({building.population_density} people/km² in this Dissemination Area)
          </span>
        </p>
      )}

      <section>
        <h2 className="mb-4 mt-10 text-sm font-bold tracking-wide">
          <span className="text-accent">##</span> TRACKED_RECORDS
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-foreground/20 text-left text-muted">
                <th className="py-1 pr-4 font-semibold">Record type</th>
                <th className="py-1 pr-4 font-semibold">Last recorded</th>
                <th className="py-1 pr-4 font-semibold">Status</th>
                <th className="py-1 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody>
              {building.records.map((record) => (
                <tr key={record.id} className="border-b border-foreground/10">
                  <td className="py-1 pr-4">{RECORD_TYPE_LABELS[record.record_type]}</td>
                  <td className="py-1 pr-4">{record.last_recorded_date}</td>
                  <td className="py-1 pr-4">
                    {record.is_stale ? (
                      <span>{record.months_stale} months stale</span>
                    ) : (
                      <span className="text-accent">current</span>
                    )}
                  </td>
                  <td className="py-1 text-muted">{record.notes ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted">
          A fact surfaced, not a verdict — the same framing Farpost itself uses for staleness.
        </p>
      </section>
    </main>
  );
}

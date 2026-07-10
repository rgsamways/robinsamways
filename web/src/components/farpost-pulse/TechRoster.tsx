"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getTechs, type Tech } from "./api";

type LoadStatus = "loading" | "loaded" | "error";

export default function TechRoster() {
  const [techs, setTechs] = useState<Tech[]>([]);
  const [status, setStatus] = useState<LoadStatus>("loading");

  useEffect(() => {
    const load = async () => {
      setStatus("loading");
      try {
        const data = await getTechs();
        setTechs(data);
        setStatus("loaded");
      } catch {
        setStatus("error");
      }
    };
    load();
  }, []);

  if (status === "loading") {
    return <p className="text-muted">Loading the tech roster…</p>;
  }
  if (status === "error") {
    return (
      <p className="text-sm">
        Couldn&rsquo;t reach the live Function App right now. Try refreshing.
      </p>
    );
  }
  if (techs.length === 0) {
    return <p className="text-muted">No technicians seeded yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {techs.map((tech) => (
        <Link
          key={tech.id}
          href={`/narrative/farpost-pulse/${tech.id}`}
          className="block border border-foreground/20 p-4 transition hover:border-accent"
        >
          <h3 className="text-sm font-bold text-accent">{tech.name}</h3>
          <p className="mt-1 text-xs text-muted">{tech.role}</p>
          <p className="mt-3 text-sm">
            {tech.snapshotStat.value != null
              ? `${tech.snapshotStat.value}${tech.snapshotStat.unit}`
              : "—"}{" "}
            <span className="text-xs text-muted">{tech.snapshotStat.label}</span>
          </p>
        </Link>
      ))}
    </div>
  );
}

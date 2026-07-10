"use client";

import { useEffect, useState } from "react";
import SectionHeader from "@/components/SectionHeader";
import BarChart from "./BarChart";
import { getDashboardPatterns, type DashboardPatterns } from "./api";

type LoadStatus = "loading" | "loaded" | "error";

export default function DashboardContent() {
  const [data, setData] = useState<DashboardPatterns | null>(null);
  const [status, setStatus] = useState<LoadStatus>("loading");

  useEffect(() => {
    const load = async () => {
      setStatus("loading");
      try {
        const result = await getDashboardPatterns();
        setData(result);
        setStatus("loaded");
      } catch {
        setStatus("error");
      }
    };
    load();
  }, []);

  if (status === "loading") {
    return <p className="text-muted">Loading dashboard data…</p>;
  }
  if (status === "error" || !data) {
    return (
      <p className="text-sm">
        Couldn&rsquo;t reach the live Function App right now. Try refreshing.
      </p>
    );
  }

  const barData = data.techCompletionRates.map((tech) => ({
    label: tech.techName,
    value: tech.tagCompletionRate,
  }));

  return (
    <>
      <section>
        <SectionHeader title="TAG_COMPLETION_PER_TECH" />
        <BarChart
          data={barData}
          unit="%"
          ariaLabel={`Tag completion per technician: ${barData
            .map((point) => `${point.label} ${point.value ?? "no data"}%`)
            .join(", ")}`}
        />
      </section>

      <section>
        <SectionHeader title="MOST_COMMONLY_MISSED_ANGLE" />
        <p className="text-sm">
          {data.mostMissedAngleOrgWide ? (
            <>
              Org-wide, the most commonly missed angle is{" "}
              <span className="font-semibold text-accent">
                {data.mostMissedAngleOrgWide.replace(/-/g, " ")}
              </span>
              .
            </>
          ) : (
            "No missed angles recorded yet."
          )}
        </p>
      </section>

      <section>
        <SectionHeader title="TURNAROUND_TREND" />
        <p className="text-sm">
          Org-wide average turnaround is{" "}
          <span className="font-semibold text-accent">{data.avgTurnaroundHoursOrgWide}h</span>,
          trending{" "}
          <span className="font-semibold text-accent">{data.turnaroundTrendOrgWide}</span>.
        </p>
      </section>
    </>
  );
}

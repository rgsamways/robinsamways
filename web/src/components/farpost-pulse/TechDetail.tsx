"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import {
  getTechs,
  getTechJobs,
  generateCoachingTip,
  type Tech,
  type Job,
} from "./api";
import TrendChart from "./TrendChart";

type LoadStatus = "loading" | "loaded" | "not-found" | "error";
type TipStatus = "idle" | "loading" | "loaded" | "error";

export default function TechDetail({ techId }: { techId: string }) {
  const [tech, setTech] = useState<Tech | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [tipStatus, setTipStatus] = useState<TipStatus>("idle");
  const [tip, setTip] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setStatus("loading");
      try {
        const [techs, techJobs] = await Promise.all([getTechs(), getTechJobs(techId)]);
        const matchedTech = techs.find((candidate) => candidate.id === techId);
        if (!matchedTech) {
          setStatus("not-found");
          return;
        }
        setTech(matchedTech);
        setJobs(techJobs);
        setStatus("loaded");
      } catch {
        setStatus("error");
      }
    };
    load();
  }, [techId]);

  const handleGenerateTip = async () => {
    setTipStatus("loading");
    try {
      const result = await generateCoachingTip(techId);
      setTip(result.tip);
      setTipStatus("loaded");
    } catch {
      setTipStatus("error");
    }
  };

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
        <p className="text-sm">No technician found with that id.</p>
        <Link href="/farpost/farpost-pulse" className="mt-2 inline-block text-sm text-accent hover:underline">
          ← Back to Tech Roster
        </Link>
      </main>
    );
  }
  if (status === "error") {
    return (
      <main className="py-10">
        <p className="text-sm">
          Couldn&rsquo;t reach the live Function App right now. Try refreshing.
        </p>
      </main>
    );
  }

  const jobsSortedDesc = [...jobs].sort((a, b) => b.date.localeCompare(a.date));
  const trendData = jobs.map((job) => ({ label: job.date, value: job.turnaroundHours }));

  return (
    <main className="py-10">
      <p className="text-xs">
        <Link href="/farpost/farpost-pulse" className="text-accent hover:underline">
          ← Tech Roster
        </Link>
      </p>
      <h1 className="mt-2 text-xl font-bold">
        <span className="text-accent">$</span> {tech?.name}
      </h1>
      <p className="mt-1 text-sm text-muted">
        {tech?.role} · {jobs.length} jobs on record
      </p>

      <section>
        <SectionHeader title="JOB_HISTORY" />
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-foreground/20 text-left text-muted">
                <th className="py-1 pr-4 font-semibold">Date</th>
                <th className="py-1 pr-4 font-semibold">Property Type</th>
                <th className="py-1 pr-4 font-semibold">Photos</th>
                <th className="py-1 pr-4 font-semibold">Angles Missed</th>
                <th className="py-1 pr-4 font-semibold">NFC Tags</th>
                <th className="py-1 font-semibold">Turnaround</th>
              </tr>
            </thead>
            <tbody>
              {jobsSortedDesc.map((job) => (
                <tr key={job.id} className="border-b border-foreground/10">
                  <td className="py-1 pr-4">{job.date}</td>
                  <td className="py-1 pr-4">{job.propertyType}</td>
                  <td className="py-1 pr-4">
                    {job.photosTaken}/{job.photosRequired}
                  </td>
                  <td className="py-1 pr-4">
                    {job.anglesMissed.length === 0
                      ? "—"
                      : job.anglesMissed.map((angle) => angle.replace(/-/g, " ")).join(", ")}
                  </td>
                  <td className="py-1 pr-4">
                    {job.nfcTagsScanned}/{job.nfcTagsExpected}
                  </td>
                  <td className="py-1">{job.turnaroundHours}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <SectionHeader title="TURNAROUND_TREND" />
        <TrendChart data={trendData} unit="h" metricLabel={`${tech?.name}'s turnaround time`} />
      </section>

      <section>
        <SectionHeader title="COACHING" />
        <button
          type="button"
          onClick={handleGenerateTip}
          disabled={tipStatus === "loading"}
          className="border border-accent px-4 py-2 text-sm font-semibold text-accent transition hover:bg-accent hover:text-background disabled:opacity-50"
        >
          {tipStatus === "loading" ? "Generating…" : "Generate Coaching Tip"}
        </button>
        {tipStatus === "loaded" && tip && (
          <div className="mt-3 border-l-4 border-accent bg-skills-bg px-4 py-3 text-sm">{tip}</div>
        )}
        {tipStatus === "error" && (
          <p className="mt-3 text-xs">Couldn&rsquo;t generate a tip right now — try again.</p>
        )}
      </section>
    </main>
  );
}

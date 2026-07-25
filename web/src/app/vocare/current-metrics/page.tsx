import type { Metadata } from "next";
import StatusSnapshot from "@/components/project-record/StatusSnapshot";
import { parseProjectStatus } from "@/components/project-record/types";
import rawVocareStatus from "@/data/vocare-status.json";

export const metadata: Metadata = {
  title: "Vocare Current Metrics · Robin Samways",
};

export default function VocareCurrentMetricsPage() {
  const status = parseProjectStatus(rawVocareStatus, "vocare-status.json");

  return (
    <main className="py-10">
      <h1 className="text-xl font-bold">
        <span className="text-accent">$</span>{" "}Vocare &middot; Current Metrics
      </h1>
      <p className="mt-2 text-sm text-muted">
        A dated, written status snapshot — not a live chart. Vocare&rsquo;s
        real repository is separate from this site&rsquo;s build process, so
        this is updated by hand as real progress happens.
      </p>

      <div className="mt-8">
        <StatusSnapshot status={status} />
      </div>
    </main>
  );
}

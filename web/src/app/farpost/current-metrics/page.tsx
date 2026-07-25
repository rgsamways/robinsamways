import type { Metadata } from "next";
import FarpostTabBar from "@/components/farpost/FarpostTabBar";
import StatusSnapshot from "@/components/project-record/StatusSnapshot";
import { parseProjectStatus } from "@/components/project-record/types";
import rawFarpostStatus from "@/data/farpost-status.json";

export const metadata: Metadata = {
  title: "Farpost Current Metrics · Robin Samways",
};

export default function FarpostCurrentMetricsPage() {
  const status = parseProjectStatus(rawFarpostStatus, "farpost-status.json");

  return (
    <main className="py-10">
      <FarpostTabBar />
      <h1 className="text-xl font-bold">
        <span className="text-accent">$</span>{" "}Farpost &middot; Current Metrics
      </h1>
      <p className="mt-2 text-sm text-muted">
        A dated, written status snapshot — not a live chart. Farpost&rsquo;s
        actual rebuild lives in a separate, gitignored repository this
        site&rsquo;s build process can&rsquo;t reach, so this is updated by
        hand as real progress happens, the same way{" "}
        <code>docs/metrics.md</code> narrates this site&rsquo;s own history.
      </p>

      <div className="mt-8">
        <StatusSnapshot status={status} />
      </div>
    </main>
  );
}

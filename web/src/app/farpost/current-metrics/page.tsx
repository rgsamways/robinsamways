import type { Metadata } from "next";
import FarpostTabBar from "@/components/farpost/FarpostTabBar";
import PageHeading from "@/components/PageHeading";
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
      <PageHeading title="Farpost · Current Metrics">
        A dated, written status snapshot — not a live chart. Farpost&rsquo;s
        actual rebuild lives in a separate, gitignored repository this
        site&rsquo;s build process can&rsquo;t reach, so this is updated by
        hand as real progress happens, the same way{" "}
        <code>docs/metrics.md</code> narrates this site&rsquo;s own history.
      </PageHeading>

      <div className="mt-8">
        <StatusSnapshot status={status} />
      </div>
    </main>
  );
}

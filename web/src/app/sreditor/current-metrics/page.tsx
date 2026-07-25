import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import StatusSnapshot from "@/components/project-record/StatusSnapshot";
import { parseProjectStatus } from "@/components/project-record/types";
import rawSreditorStatus from "@/data/sreditor-status.json";

export const metadata: Metadata = {
  title: "Sreditor Current Metrics · Robin Samways",
};

export default function SreditorCurrentMetricsPage() {
  const status = parseProjectStatus(rawSreditorStatus, "sreditor-status.json");

  return (
    <main className="py-10">
      <PageHeading title="Sreditor · Current Metrics">
        A dated, written status snapshot — not a live chart. Sreditor lives
        in its own separate repository this site&rsquo;s build process
        can&rsquo;t reach, so this is updated by hand as real progress
        happens.
      </PageHeading>

      <div className="mt-8">
        <StatusSnapshot status={status} />
      </div>
    </main>
  );
}

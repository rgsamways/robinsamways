import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import FeatureStatusList from "@/components/project-record/FeatureStatusList";
import { parseProjectStatus } from "@/components/project-record/types";
import rawFarpostStatus from "@/data/farpost-status.json";

export const metadata: Metadata = {
  title: "Farpost Feature List · Robin Samways",
};

export default function FarpostFeatureListPage() {
  const status = parseProjectStatus(rawFarpostStatus, "farpost-status.json");

  return (
    <main className="py-10">
      <PageHeading title="Farpost · Feature List">
        Real and planned Farpost capabilities, each flagged shipped or
        planned against the live rebuild in <code>siloes/farpost/</code> —
        not the original production system, which already has its own
        working version of the dispatch and building-record features below.
      </PageHeading>

      <div className="mt-8">
        <FeatureStatusList features={status.features} />
      </div>
    </main>
  );
}

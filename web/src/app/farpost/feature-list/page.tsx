import type { Metadata } from "next";
import FarpostTabBar from "@/components/farpost/FarpostTabBar";
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
      <FarpostTabBar />
      <h1 className="text-xl font-bold">
        <span className="text-accent">$</span> Farpost &middot; Feature List
      </h1>
      <p className="mt-2 text-sm text-muted">
        Real and planned Farpost capabilities, each flagged shipped or
        planned against the live rebuild in <code>siloes/farpost/</code> —
        not the original production system, which already has its own
        working version of the dispatch and building-record features below.
      </p>

      <div className="mt-8">
        <FeatureStatusList features={status.features} />
      </div>
    </main>
  );
}

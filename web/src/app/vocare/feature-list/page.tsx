import type { Metadata } from "next";
import FeatureStatusList from "@/components/project-record/FeatureStatusList";
import { parseProjectStatus } from "@/components/project-record/types";
import rawVocareStatus from "@/data/vocare-status.json";

export const metadata: Metadata = {
  title: "Vocare Feature List · Robin Samways",
};

export default function VocareFeatureListPage() {
  const status = parseProjectStatus(rawVocareStatus, "vocare-status.json");

  return (
    <main className="py-10">
      <h1 className="text-xl font-bold">
        <span className="text-accent">$</span>{" "}Vocare &middot; Feature List
      </h1>
      <p className="mt-2 text-sm text-muted">
        Real and planned Vocare capabilities, each flagged shipped or
        planned against the live product.
      </p>

      <div className="mt-8">
        <FeatureStatusList features={status.features} />
      </div>
    </main>
  );
}

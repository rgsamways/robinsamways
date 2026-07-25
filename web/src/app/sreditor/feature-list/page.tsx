import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import FeatureStatusList from "@/components/project-record/FeatureStatusList";
import { parseProjectStatus } from "@/components/project-record/types";
import rawSreditorStatus from "@/data/sreditor-status.json";

export const metadata: Metadata = {
  title: "Sreditor Feature List · Robin Samways",
};

export default function SreditorFeatureListPage() {
  const status = parseProjectStatus(rawSreditorStatus, "sreditor-status.json");

  return (
    <main className="py-10">
      <PageHeading title="Sreditor · Feature List">
        Real and planned Sreditor capabilities, each flagged shipped or
        planned against the live, unpublished local build.
      </PageHeading>

      <div className="mt-8">
        <FeatureStatusList features={status.features} />
      </div>
    </main>
  );
}

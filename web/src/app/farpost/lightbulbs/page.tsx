import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import LightbulbsList from "@/components/project-record/LightbulbsList";
import { parseProjectStatus } from "@/components/project-record/types";
import rawFarpostStatus from "@/data/farpost-status.json";

export const metadata: Metadata = {
  title: "Farpost Lightbulbs · Robin Samways",
};

export default function FarpostLightbulbsPage() {
  const status = parseProjectStatus(rawFarpostStatus, "farpost-status.json");

  return (
    <main className="py-10">
      <PageHeading
        title="Farpost · Lightbulbs"
        descriptionClassName="mt-2 text-sm leading-relaxed text-muted"
      >
        An idea doesn&rsquo;t need a build decision to be worth capturing —
        it just needs its own record. Ideas specific to Farpost, one step
        upstream of a bug or a metric.
      </PageHeading>

      <div className="mt-8">
        <LightbulbsList entries={status.lightbulbs} />
      </div>
    </main>
  );
}

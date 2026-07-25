import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import LightbulbsList from "@/components/project-record/LightbulbsList";
import { parseProjectStatus } from "@/components/project-record/types";
import rawSreditorStatus from "@/data/sreditor-status.json";

export const metadata: Metadata = {
  title: "Sreditor Lightbulbs · Robin Samways",
};

export default function SreditorLightbulbsPage() {
  const status = parseProjectStatus(rawSreditorStatus, "sreditor-status.json");

  return (
    <main className="py-10">
      <PageHeading
        title="Sreditor · Lightbulbs"
        descriptionClassName="mt-2 text-sm leading-relaxed text-muted"
      >
        An idea doesn&rsquo;t need a build decision to be worth capturing —
        it just needs its own record. Ideas specific to Sreditor, one step
        upstream of a bug or a metric.
      </PageHeading>

      <div className="mt-8">
        <LightbulbsList entries={status.lightbulbs} />
      </div>
    </main>
  );
}

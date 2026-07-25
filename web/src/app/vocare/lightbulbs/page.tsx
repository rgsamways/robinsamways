import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import LightbulbsList from "@/components/project-record/LightbulbsList";
import { parseProjectStatus } from "@/components/project-record/types";
import rawVocareStatus from "@/data/vocare-status.json";

export const metadata: Metadata = {
  title: "Vocare Lightbulbs · Robin Samways",
};

export default function VocareLightbulbsPage() {
  const status = parseProjectStatus(rawVocareStatus, "vocare-status.json");

  return (
    <main className="py-10">
      <PageHeading
        title="Vocare · Lightbulbs"
        descriptionClassName="mt-2 text-sm leading-relaxed text-muted"
      >
        An idea doesn&rsquo;t need a build decision to be worth capturing —
        it just needs its own record. Ideas specific to Vocare, one step
        upstream of a bug or a metric.
      </PageHeading>

      <div className="mt-8">
        <LightbulbsList entries={status.lightbulbs} />
      </div>
    </main>
  );
}

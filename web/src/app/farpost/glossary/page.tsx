import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import GlossaryList from "@/components/project-record/GlossaryList";
import { parseProjectStatus } from "@/components/project-record/types";
import rawFarpostStatus from "@/data/farpost-status.json";

export const metadata: Metadata = {
  title: "Farpost Glossary · Robin Samways",
};

export default function FarpostGlossaryPage() {
  const status = parseProjectStatus(rawFarpostStatus, "farpost-status.json");

  return (
    <main className="py-10">
      <PageHeading
        title="Farpost · Glossary"
        descriptionClassName="mt-2 text-sm leading-relaxed text-muted"
      >
        Technical terms used elsewhere on Farpost&rsquo;s pages, translated
        for a reader who wasn&rsquo;t in the room when the decision was made.
      </PageHeading>

      <div className="mt-8">
        <GlossaryList terms={status.glossary} />
      </div>
    </main>
  );
}

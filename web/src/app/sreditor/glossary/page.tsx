import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import GlossaryList from "@/components/project-record/GlossaryList";
import { parseProjectStatus } from "@/components/project-record/types";
import rawSreditorStatus from "@/data/sreditor-status.json";

export const metadata: Metadata = {
  title: "Sreditor Glossary · Robin Samways",
};

export default function SreditorGlossaryPage() {
  const status = parseProjectStatus(rawSreditorStatus, "sreditor-status.json");

  return (
    <main className="py-10">
      <PageHeading
        title="Sreditor · Glossary"
        descriptionClassName="mt-2 text-sm leading-relaxed text-muted"
      >
        Technical terms used elsewhere on Sreditor&rsquo;s pages, translated
        for a reader who wasn&rsquo;t in the room when the decision was made.
      </PageHeading>

      <div className="mt-8">
        <GlossaryList terms={status.glossary} />
      </div>
    </main>
  );
}

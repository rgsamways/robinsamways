import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import GlossaryList from "@/components/project-record/GlossaryList";
import { parseProjectStatus } from "@/components/project-record/types";
import rawVocareStatus from "@/data/vocare-status.json";

export const metadata: Metadata = {
  title: "Vocare Glossary · Robin Samways",
};

export default function VocareGlossaryPage() {
  const status = parseProjectStatus(rawVocareStatus, "vocare-status.json");

  return (
    <main className="py-10">
      <PageHeading
        title="Vocare · Glossary"
        descriptionClassName="mt-2 text-sm leading-relaxed text-muted"
      >
        Technical terms used elsewhere on Vocare&rsquo;s pages, translated
        for a reader who wasn&rsquo;t in the room when the decision was made.
      </PageHeading>

      <div className="mt-8">
        <GlossaryList terms={status.glossary} />
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import BugListSection from "@/components/project-record/BugListSection";
import { parseProjectStatus } from "@/components/project-record/types";
import rawVocareStatus from "@/data/vocare-status.json";

export const metadata: Metadata = {
  title: "Vocare Bug List · Robin Samways",
};

export default function VocareBugListPage() {
  const status = parseProjectStatus(rawVocareStatus, "vocare-status.json");

  return (
    <main className="py-10">
      <PageHeading title="Vocare · Bug List">
        Real bugs actually hit building Vocare, each paired with the fix —
        the messy, unpolished record, not a curated highlight reel.
      </PageHeading>

      <div className="mt-8">
        <BugListSection entries={status.bugList} />
      </div>
    </main>
  );
}

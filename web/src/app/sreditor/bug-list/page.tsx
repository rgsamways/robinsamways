import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import BugListSection from "@/components/project-record/BugListSection";
import { parseProjectStatus } from "@/components/project-record/types";
import rawSreditorStatus from "@/data/sreditor-status.json";

export const metadata: Metadata = {
  title: "Sreditor Bug List · Robin Samways",
};

export default function SreditorBugListPage() {
  const status = parseProjectStatus(rawSreditorStatus, "sreditor-status.json");

  return (
    <main className="py-10">
      <PageHeading title="Sreditor · Bug List">
        Real bugs actually hit building Sreditor, each paired with the fix —
        the messy, unpolished record, not a curated highlight reel.
      </PageHeading>

      <div className="mt-8">
        <BugListSection entries={status.bugList} />
      </div>
    </main>
  );
}

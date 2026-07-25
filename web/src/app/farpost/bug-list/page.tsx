import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import BugListSection from "@/components/project-record/BugListSection";
import { parseProjectStatus } from "@/components/project-record/types";
import rawFarpostStatus from "@/data/farpost-status.json";

export const metadata: Metadata = {
  title: "Farpost Bug List · Robin Samways",
};

export default function FarpostBugListPage() {
  const status = parseProjectStatus(rawFarpostStatus, "farpost-status.json");

  return (
    <main className="py-10">
      <PageHeading title="Farpost · Bug List">
        Real bugs actually hit building the rebuild, each paired with the fix
        — the messy, unpolished record, not a curated highlight reel.
      </PageHeading>

      <div className="mt-8">
        <BugListSection entries={status.bugList} />
      </div>
    </main>
  );
}

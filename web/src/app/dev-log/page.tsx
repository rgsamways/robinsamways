import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import { CODE_SHOWCASE_ENTRIES } from "@/components/dev-log/codeShowcase";
import DevLogEntryList from "@/components/dev-log/DevLogEntryList";

export const metadata: Metadata = {
  title: "Dev Log · Robin Samways",
};

const ENTRIES = [...CODE_SHOWCASE_ENTRIES].sort((a, b) =>
  b.publishedAtUtc.localeCompare(a.publishedAtUtc)
);

export default function DevLogPage() {
  return (
    <main className="py-10">
      <PageHeading title="Dev Log">
        The unpolished, ongoing record — real, verified code and development
        experience from Robin&rsquo;s own projects, most recent first.
      </PageHeading>

      <DevLogEntryList entries={ENTRIES} />
    </main>
  );
}

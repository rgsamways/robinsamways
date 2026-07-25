import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Sreditor Upgrade Path · Robin Samways",
};

export default function SreditorUpgradePathPage() {
  return (
    <main className="py-10">
      <PageHeading title="Sreditor · Upgrade Path">
        Planned evolutions beyond the immediate publish step covered in Build
        Plan.
      </PageHeading>

      <section>
        <SectionHeader title="SOURCE_ADAPTERS_BEYOND_OPENSPEC" />
        <p className="text-sm leading-relaxed">
          The adapter interface that reads a project&rsquo;s change history is
          already designed to be tool-agnostic. Whether a second source
          format (a different spec-driven workflow, or plain git history) is
          ever worth building depends on whether Sreditor gets real use
          outside this project first.
        </p>
      </section>

      <section>
        <SectionHeader title="REPORT_OUTPUT_BEYOND_MARKDOWN" />
        <p className="text-sm leading-relaxed">
          <code>sreditor report</code> only produces T661-structured markdown
          today. PDF or CSV output would make a claim easier to hand directly
          to an accountant, but isn&rsquo;t built yet.
        </p>
      </section>

      <section>
        <SectionHeader title="BEYOND_CANADAS_SRED" />
        <p className="text-sm leading-relaxed">
          Sreditor&rsquo;s three-part-test judgment logic is written against
          Canada&rsquo;s CRA SR&amp;ED program specifically, not a general
          international R&amp;D tax-credit tool. Whether that generalizes to
          other countries&rsquo; equivalent programs is an open question, not
          a committed roadmap item.
        </p>
      </section>
    </main>
  );
}

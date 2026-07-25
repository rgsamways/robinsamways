import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Sreditor Outlook · Robin Samways",
};

export default function SreditorOutlookPage() {
  return (
    <main className="py-10">
      <PageHeading title="Sreditor · Outlook">
        Where Sreditor is headed beyond the near-term publish step.
      </PageHeading>

      <section>
        <SectionHeader title="POSITIONING" />
        <p className="text-sm leading-relaxed">
          Sreditor&rsquo;s structural pitch is direct-to-developer,
          transparent, and no-markup — every judgment prompt is plain,
          readable TypeScript, and every call runs against the
          developer&rsquo;s own Anthropic account at standard rates. That is
          the reason a solo developer or a tiny CCPC is a market the funded,
          per-seat-priced competitors in this space aren&rsquo;t built to
          serve.
        </p>
      </section>

      <section>
        <SectionHeader title="TEACHING_THE_PRACTICE" />
        <p className="text-sm leading-relaxed">
          The original idea behind Sreditor wasn&rsquo;t a product first — it
          was a habit worth writing down, using this project&rsquo;s own R&amp;D
          log as the working example. Long term, that framing stays
          intact: Sreditor is as much about teaching other developers to run
          their own contemporaneous SR&amp;ED documentation practice as it is
          about the tool itself.
        </p>
      </section>
    </main>
  );
}

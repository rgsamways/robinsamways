import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Pulse Design Notes · Robin Samways",
};

export default function FarpostPulseDesignNotesPage() {
  return (
    <main className="py-10">
      <PageHeading title="Pulse · Design Notes">
        Why seed data is patterned rather than randomized, and why coaching
        tips are isolated behind one function boundary.
      </PageHeading>

      <section>
        <SectionHeader title="PATTERNED_SEED_DATA" />
        <p className="text-sm leading-relaxed">
          The seeded technicians are deliberately patterned, not randomized:
          at least one consistently-strong performer, at least one with a
          specific recurring weakness, and the rest showing gradual
          improvement across their job history. Random data would produce a
          flat or noisy trend chart that proves nothing about whether the
          coaching mechanic actually surfaces something meaningful — a
          patterned dataset is what makes it possible to check, just by
          looking at a tech&rsquo;s trend chart, that the improvement or
          weakness the seed data intended to show up actually does.
        </p>
      </section>

      <section>
        <SectionHeader title="ISOLATED_TIP_FUNCTION" />
        <p className="text-sm leading-relaxed">
          Coaching-tip generation is isolated behind a single{" "}
          <code>generateCoachingTip(techStats)</code> function boundary,
          rather than the canned-tip logic being spread across the request
          handler. That isolation is what makes swapping in a real Azure
          OpenAI call later a contained, one-file change — the request
          handler, the rate limiting, and the Cosmos DB write to{" "}
          <code>coachingHistory</code> stay exactly as they are; only what
          happens inside that one function changes. Design decisions get
          made once, up front, specifically so the mock isn&rsquo;t a
          dead end.
        </p>
      </section>
    </main>
  );
}

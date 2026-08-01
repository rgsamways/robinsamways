import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Pulse AI Notes · Robin Samways",
};

export default function FarpostPulseAiNotesPage() {
  return (
    <main className="py-10">
      <PageHeading title="Pulse · AI Notes">
        How AI was used to build this piece, then an honest account of how
        AI is — and isn&rsquo;t yet — used inside it.
      </PageHeading>

      <section>
        <SectionHeader title="BUILD_PROCESS" />
        <p className="text-sm leading-relaxed">
          Pulse was built with Claude Code pairing throughout — scaffolding
          the Azure Functions app structure, the Cosmos DB container and
          partition-key design, and the seed-data generation scripts, then
          iterating on the trend-chart and coaching-tip UI against real
          responses from the running Function App rather than static
          mockups.
        </p>
      </section>

      <section>
        <SectionHeader title="COACHING_TIPS_ARE_CURRENTLY_MOCKED" />
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            <strong>
              Coaching-tip generation is currently mocked, not live AI.
            </strong>{" "}
            <code>generateCoachingTip(techStats)</code> returns a canned or
            randomized tip from a small local array of examples rather than
            a real Azure OpenAI call, pending model deployment quota. This
            page states that plainly rather than implying the tip generation
            is live AI today — the same honesty standard this site already
            holds itself to elsewhere (Bug List, Testing & Verification)
            when there&rsquo;s genuinely nothing more to report yet.
          </p>
          <p>
            What&rsquo;s real is the architecture around the mock: tip
            generation is isolated behind that single function boundary
            specifically so swapping in a real model call is a contained,
            one-file change later, not a rewrite. See{" "}
            <a
              href="/techstacks/farpost-pulse/design-notes"
              className="text-accent underline"
            >
              Design Notes
            </a>{" "}
            for why that isolation was designed in up front.
          </p>
        </div>
      </section>
    </main>
  );
}

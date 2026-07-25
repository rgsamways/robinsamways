import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Testing & Verification · Dev Log · Robin Samways",
};

export default function TestingVerificationPage() {
  return (
    <main className="py-10">
      <PageHeading title="Dev Log · Testing & Verification">
        How this site actually gets verified.
      </PageHeading>

      <section>
        <SectionHeader title="TESTING_AND_VERIFICATION" />
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            Every part of this site now has a real, committed,
            framework-based test suite — not one-off scripts written for a
            single verification pass and thrown away. The frontend (
            <code>web/</code>) has Vitest for pure-logic unit tests and a
            Playwright end-to-end suite covering navigation and real
            interactive flows. The API (<code>api/</code>) has pytest, both
            unit tests for standalone logic and integration tests exercising
            real endpoints through FastAPI&rsquo;s <code>TestClient</code>.
            Farpost Pulse&rsquo;s Azure Functions backend uses Node&rsquo;s
            own built-in test runner, keeping that piece dependency-light on
            purpose.
          </p>
          <p>
            The honest part: there&rsquo;s still no CI pipeline. Nothing runs
            these suites automatically on push — running them today is a
            manual step, not an enforced gate. That&rsquo;s a deliberate,
            named trade-off for a solo project at this stage, not a gap
            being quietly hidden. Coverage is representative rather than
            exhaustive too — the highest-value, highest-risk logic in each
            piece, extended incrementally as code that matters actually
            changes, rather than a retrofit of everything that already
            works.
          </p>
          <p>
            One more distinction worth being upfront about: committed test
            suites complement, rather than replace, real verification
            against live external services. A mocked Salesforce or Cosmos DB
            call only proves the mock&rsquo;s shape is right — the
            Salesforce OAuth flow and the Anthropic recommendation call have
            each also been verified against the real, live service
            directly, since that&rsquo;s the only way to know the actual
            integration works, not just the code that assumes it does.
          </p>
        </div>
      </section>
    </main>
  );
}

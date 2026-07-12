import type { Metadata } from "next";
import SectionHeader from "@/components/SectionHeader";
import { GLOSSARY_ENTRIES } from "@/components/dev-log/glossary";
import { BUG_LOG_ENTRIES } from "@/components/dev-log/bugLog";
import { parseMetricsSnapshots } from "@/components/dev-log/metrics";
import MetricsDashboard from "@/components/dev-log/MetricsDashboard";
import rawMetricsData from "@/data/metrics.json";

export const metadata: Metadata = {
  title: "Dev Log · Robin Samways",
};

export default function DevLogPage() {
  const snapshots = parseMetricsSnapshots(rawMetricsData);

  return (
    <main className="py-10">
      <h1 className="text-xl font-bold">
        <span className="text-accent">$</span> Dev Log
      </h1>
      <p className="mt-2 text-sm text-muted">
        The unpolished, ongoing record — plain-language explanations, how this
        site actually gets verified, real code-metrics history, and real bugs
        hit along the way.
      </p>

      <section>
        <SectionHeader title="GLOSSARY" />
        <p className="mb-4 text-sm leading-relaxed">
          A growing "X, in layman's terms" list — plain-language explanations of
          tools and concepts used elsewhere on this site, for a reader who
          doesn't already know the jargon.
        </p>
        <dl className="space-y-4 text-sm">
          {GLOSSARY_ENTRIES.map((entry) => (
            <div key={entry.term}>
              <dt className="font-semibold text-accent">
                {entry.term}, in layman&rsquo;s terms
              </dt>
              <dd className="mt-1 leading-relaxed">{entry.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <SectionHeader title="TESTING_AND_VERIFICATION" />
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            Every part of this site now has a real, committed, framework-based
            test suite — not one-off scripts written for a single verification
            pass and thrown away. The frontend (<code>web/</code>) has Vitest for
            pure-logic unit tests and a Playwright end-to-end suite covering
            navigation and real interactive flows. The API (<code>api/</code>)
            has pytest, both unit tests for standalone logic and integration
            tests exercising real endpoints through FastAPI&rsquo;s{" "}
            <code>TestClient</code>. Farpost Pulse&rsquo;s Azure Functions
            backend uses Node&rsquo;s own built-in test runner, keeping that
            piece dependency-light on purpose.
          </p>
          <p>
            The honest part: there&rsquo;s still no CI pipeline. Nothing runs
            these suites automatically on push — running them today is a
            manual step, not an enforced gate. That&rsquo;s a deliberate,
            named trade-off for a solo project at this stage, not a gap being
            quietly hidden. Coverage is representative rather than exhaustive
            too — the highest-value, highest-risk logic in each piece, extended
            incrementally as code that matters actually changes, rather than a
            retrofit of everything that already works.
          </p>
          <p>
            One more distinction worth being upfront about: committed test
            suites complement, rather than replace, real verification against
            live external services. A mocked Salesforce or Cosmos DB call only
            proves the mock&rsquo;s shape is right — the Salesforce OAuth flow
            and the Anthropic recommendation call have each also been verified
            against the real, live service directly, since that&rsquo;s the
            only way to know the actual integration works, not just the code
            that assumes it does.
          </p>
        </div>
      </section>

      <section>
        <SectionHeader title="METRICS" />
        <MetricsDashboard snapshots={snapshots} />
      </section>

      <section>
        <SectionHeader title="BUG_LOG" />
        <p className="mb-4 text-sm leading-relaxed">
          Real bugs actually hit during development, each paired with the
          underlying concept it reveals — the messy, unpolished record, not a
          curated highlight reel.
        </p>
        <div className="space-y-8">
          {BUG_LOG_ENTRIES.map((entry) => (
            <article key={entry.slug} id={entry.slug} className="scroll-mt-4">
              <h3 className="text-sm font-bold">
                <span className="text-accent">&gt;</span> {entry.title}
              </h3>
              <p className="mt-1 text-xs text-muted">{entry.date}</p>

              <p className="mt-3 text-xs font-semibold text-accent">The bug</p>
              <div className="mt-1 space-y-3 text-sm leading-relaxed">
                {entry.theBug.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <p className="mt-3 text-xs font-semibold text-accent">The concept</p>
              <div className="mt-1 space-y-3 text-sm leading-relaxed">
                {entry.theConcept.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

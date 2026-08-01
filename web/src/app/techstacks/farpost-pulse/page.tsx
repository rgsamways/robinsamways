import type { Metadata } from "next";
import Link from "next/link";
import PageHeading from "@/components/PageHeading";
import SectionHeader from "@/components/SectionHeader";
import TechRoster from "@/components/farpost-pulse/TechRoster";

export const metadata: Metadata = {
  title: "Farpost Pulse · Robin Samways",
};

export default function FarpostPulsePage() {
  return (
    <main className="py-10">
      <PageHeading title="Farpost Pulse">
        A field-tech coaching dashboard — real Azure serverless, built to
        get genuine hands-on time with a stack I wanted to actually know,
        not just read about.
      </PageHeading>

      <section>
        <SectionHeader title="ORIGIN_STORY" />
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            React and Node.js I already know well. Azure serverless and
            building against a real AI SDK were pieces I&rsquo;d only read
            about, never actually built with — the gap between knowing a
            stack exists on paper and having current, hands-on time in it. I
            wanted to close that the honest way: build something real with
            it, not work through another tutorial.
          </p>
          <p>
            Rather than a generic to-do-list demo, I applied the stack to a
            domain I actually know firsthand — Farpost&rsquo;s own
            field-documentation problem — coaching field technicians on the
            same kind of job-quality patterns Farpost itself cares about: a
            real Azure Functions backend, a real Cosmos DB, called directly
            from a real React frontend.
          </p>
        </div>
      </section>

      <section>
        <SectionHeader title="ARCHITECTURE" />
        <p className="text-sm leading-relaxed">
          The backend is a genuinely separate Azure Functions app calling a
          real Cosmos DB account — not reimplemented in this site&rsquo;s own
          Python/FastAPI <code>api/</code>, on purpose. See{" "}
          <a
            href="/techstacks/farpost-pulse/architecture"
            className="text-accent underline"
          >
            Architecture
          </a>{" "}
          for the full explanation.
        </p>
      </section>

      <section>
        <SectionHeader title="TECH_STACK" />
        <p className="text-sm leading-relaxed">
          Azure Functions (Node.js), Cosmos DB, and a Next.js frontend — see{" "}
          <a
            href="/techstacks/farpost-pulse/tech-stack"
            className="text-accent underline"
          >
            Tech Stack
          </a>{" "}
          for the full reasoning behind each choice.
        </p>
      </section>

      <section>
        <SectionHeader title="ACCESSIBILITY" />
        <p className="text-sm leading-relaxed">
          Semantic HTML throughout (real <code>table</code>s for tabular job
          data, real <code>button</code>s for actions), keyboard-navigable
          controls, and charts that carry an <code>aria-label</code>{" "}
          summarizing the data they show — a chart alone isn&rsquo;t
          accessible, so the underlying numbers are always available to a
          screen reader too. Same monospace/single-accent-color language as
          the rest of this site, not a different visual style for this one
          page.
        </p>
      </section>

      <section>
        <SectionHeader title="TECH_ROSTER" />
        <p className="mb-4 text-sm leading-relaxed">
          Six seeded field technicians. Each card shows one snapshot stat —
          select a technician to see their full job history, generate a
          coaching tip, and view their trend.
        </p>
        <TechRoster />
        <Link
          href="/techstacks/farpost-pulse/dashboard"
          className="mt-6 inline-block border border-accent px-4 py-2 text-sm font-semibold text-accent transition hover:bg-accent hover:text-background"
        >
          View team dashboard →
        </Link>
      </section>
    </main>
  );
}

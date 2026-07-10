import type { Metadata } from "next";
import Link from "next/link";
import HamburgerMenu from "@/components/HamburgerMenu";
import SectionHeader from "@/components/SectionHeader";
import TechRoster from "@/components/farpost-pulse/TechRoster";

const SECTION_LINKS = [
  { href: "#origin-story", label: "Origin Story" },
  { href: "#architecture", label: "Architecture" },
  { href: "#tech-stack", label: "Tech Stack" },
  { href: "#design-notes", label: "Design Notes" },
  { href: "#tech-roster", label: "Tech Roster" },
];

export const metadata: Metadata = {
  title: "Farpost Pulse · Robin Samways",
};

export default function FarpostPulsePage() {
  return (
    <main className="py-10">
      <div className="flex items-start gap-3">
        <HamburgerMenu links={SECTION_LINKS} ariaLabel="page sections menu" />
        <div>
          <h1 className="text-xl font-bold">
            <span className="text-accent">$</span> Farpost Pulse
          </h1>
          <p className="mt-2 text-sm text-muted">
            A field-tech coaching dashboard — real Azure serverless, built to
            get genuine hands-on time with a stack I wanted to actually know,
            not just read about.
          </p>
        </div>
      </div>

      <section>
        <SectionHeader id="origin-story" title="ORIGIN_STORY" />
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
        <SectionHeader id="architecture" title="ARCHITECTURE" />
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            The frontend lives in this same repo, next to every other page on
            this site. The backend is a genuinely separate Azure Functions
            app (<code>farpost-pulse-func</code>), calling a real Cosmos DB
            account (<code>farpost-pulse-cosmos</code>) — not reimplemented
            in this site&rsquo;s own Python/FastAPI <code>api/</code>, on
            purpose. The whole point of this page is getting genuine,
            hands-on time with Node.js and Azure serverless specifically;
            doing it in Python would defeat that entirely.
          </p>
          <p>
            Unlike Credential Flow&rsquo;s relationship with Salesforce,
            there&rsquo;s no secret this frontend needs to hide server-side —
            the Function App holds its own Cosmos DB connection string (and,
            later, an Azure OpenAI key) entirely on its own side, never sent
            to the browser. So the frontend calls the Function App directly
            over HTTP, no proxy through this site&rsquo;s own <code>api/</code>{" "}
            — simpler, and a more honest picture of the architecture being
            shown off.
          </p>
          <p>
            The four HTTP endpoints run at anonymous auth level — a function
            key embedded in a public frontend&rsquo;s client-side JS is
            extractable by anyone regardless, so it would add friction
            without real protection. Nothing sensitive is at stake here; all
            of this data is seeded and fake. The one write endpoint,{" "}
            <code>POST /api/coaching/generate</code>, still gets a per-IP
            rate limiter, the same pattern already used for Credential
            Flow&rsquo;s write endpoints — cheap insurance against abuse,
            especially once a real AI call (with a real per-request cost) is
            wired in.
          </p>
        </div>
      </section>

      <section>
        <SectionHeader id="tech-stack" title="TECH_STACK" />
        <div className="overflow-x-auto text-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-foreground/20 text-left text-muted">
                <th className="py-1 pr-4 font-semibold">Layer</th>
                <th className="py-1 pr-4 font-semibold">Choice</th>
                <th className="py-1 font-semibold">Why</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">Frontend</td>
                <td className="py-2 pr-4 align-top">Next.js / React</td>
                <td className="py-2 align-top">
                  Same stack as every other page on this site — no separate
                  frontend deploy for this one piece.
                </td>
              </tr>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">Backend</td>
                <td className="py-2 pr-4 align-top">
                  Azure Functions, Node.js, Flex Consumption
                </td>
                <td className="py-2 align-top">
                  The stack I wanted genuine hands-on time with — proving
                  real Node.js/Azure serverless experience, not just reading
                  about it.
                </td>
              </tr>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">Database</td>
                <td className="py-2 pr-4 align-top">Azure Cosmos DB (NoSQL API)</td>
                <td className="py-2 align-top">
                  Partitioned by technician (<code>techId</code>) — the
                  natural query shape throughout is &ldquo;everything for one
                  tech.&rdquo;
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 align-top">Coaching tips</td>
                <td className="py-2 pr-4 align-top">
                  Mocked for now; Azure OpenAI once quota clears
                </td>
                <td className="py-2 align-top">
                  Isolated in one function, so swapping the real model call
                  in later is a one-file change, not a rewrite.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <SectionHeader id="design-notes" title="DESIGN_NOTES" />
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
        <SectionHeader id="tech-roster" title="TECH_ROSTER" />
        <p className="mb-4 text-sm leading-relaxed">
          Six seeded field technicians. Each card shows one snapshot stat —
          select a technician to see their full job history, generate a
          coaching tip, and view their trend.
        </p>
        <TechRoster />
        <Link
          href="/narrative/farpost-pulse/dashboard"
          className="mt-6 inline-block border border-accent px-4 py-2 text-sm font-semibold text-accent transition hover:bg-accent hover:text-background"
        >
          View team dashboard →
        </Link>
      </section>
    </main>
  );
}

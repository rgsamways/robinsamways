import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Pulse Architecture · Robin Samways",
};

export default function FarpostPulseArchitecturePage() {
  return (
    <main className="py-10">
      <PageHeading title="Pulse · Architecture">
        The three Cosmos DB containers, their partition keys, and the four
        HTTP endpoints that tie them together.
      </PageHeading>

      <section>
        <SectionHeader title="OVERVIEW" />
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            The frontend lives in this same repo, next to every other page
            on this site. The backend is a genuinely separate Azure
            Functions app (<code>farpost-pulse-func</code>), calling a real
            Cosmos DB account (<code>farpost-pulse-cosmos</code>) — not
            reimplemented in this site&rsquo;s own Python/FastAPI{" "}
            <code>api/</code>, on purpose. The whole point of this page is
            getting genuine, hands-on time with Node.js and Azure serverless
            specifically; doing it in Python would defeat that entirely.
          </p>
          <p>
            Unlike Credential Flow&rsquo;s relationship with Salesforce,
            there&rsquo;s no secret this frontend needs to hide server-side —
            the Function App holds its own Cosmos DB connection string (and,
            later, an Azure OpenAI key) entirely on its own side, never sent
            to the browser. So the frontend calls the Function App directly
            over HTTP, no proxy through this site&rsquo;s own{" "}
            <code>api/</code> — simpler, and a more honest picture of the
            architecture being shown off.
          </p>
        </div>
      </section>

      <section>
        <SectionHeader title="PARTITION_SCHEME" />
        <div className="overflow-x-auto text-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-foreground/20 text-left text-muted">
                <th className="py-1 pr-4 font-semibold">Container</th>
                <th className="py-1 pr-4 font-semibold">Partition key</th>
                <th className="py-1 font-semibold">Holds</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">
                  <code>techs</code>
                </td>
                <td className="py-2 pr-4 align-top">
                  <code>/id</code>
                </td>
                <td className="py-2 align-top">One record per seeded field technician</td>
              </tr>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">
                  <code>jobs</code>
                </td>
                <td className="py-2 pr-4 align-top">
                  <code>/techId</code>
                </td>
                <td className="py-2 align-top">Job history, 20-30 per tech</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 align-top">
                  <code>coachingHistory</code>
                </td>
                <td className="py-2 pr-4 align-top">
                  <code>/techId</code>
                </td>
                <td className="py-2 align-top">Generated coaching tips, referencing their source jobs</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm leading-relaxed">
          Every job and coaching-tip query is scoped to a single
          tech&rsquo;s partition, never a cross-partition fan-out — the
          natural query shape throughout this piece is &ldquo;everything for
          one tech,&rdquo; and partitioning by <code>techId</code> means that
          query is always a fast, single-partition read rather than a
          scatter-gather across the whole container.
        </p>
      </section>

      <section>
        <SectionHeader title="HTTP_ENDPOINTS" />
        <div className="overflow-x-auto text-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-foreground/20 text-left text-muted">
                <th className="py-1 pr-4 font-semibold">Endpoint</th>
                <th className="py-1 font-semibold">Returns</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">
                  <code>GET /api/techs</code>
                </td>
                <td className="py-2 align-top">
                  All seeded technicians, each with a snapshot stat
                </td>
              </tr>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">
                  <code>GET /api/techs/{"{id}"}/jobs</code>
                </td>
                <td className="py-2 align-top">One tech&rsquo;s job history</td>
              </tr>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">
                  <code>POST /api/coaching/generate</code>
                </td>
                <td className="py-2 align-top">
                  Generates and stores a coaching tip for a tech
                  (rate-limited per IP)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 align-top">
                  <code>GET /api/dashboard/patterns</code>
                </td>
                <td className="py-2 align-top">Aggregated cross-tech stats</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm leading-relaxed">
          All four run at anonymous auth level — a function key embedded in
          a public frontend&rsquo;s client-side JS is extractable by anyone
          regardless, so it would add friction without real protection.
          Nothing sensitive is at stake here; all of this data is seeded and
          fake. The one write endpoint,{" "}
          <code>POST /api/coaching/generate</code>, still gets a per-IP rate
          limiter, the same pattern already used for Credential
          Flow&rsquo;s write endpoints — cheap insurance against abuse,
          especially once a real AI call (with a real per-request cost) is
          wired in.
        </p>
      </section>
    </main>
  );
}

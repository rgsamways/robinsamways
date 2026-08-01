import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Pulse Tech Stack · Robin Samways",
};

export default function FarpostPulseTechStackPage() {
  return (
    <main className="py-10">
      <PageHeading title="Pulse · Tech Stack">
        Genuine hands-on Azure serverless experience — the stated purpose of
        this piece, not Python pretending to be Node.
      </PageHeading>

      <section>
        <SectionHeader title="TECH_STACK" />
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
                  HTTP-triggered, anonymous-auth — the stack I wanted genuine
                  hands-on time with, proving real Node.js/Azure serverless
                  experience, not just reading about it. Deliberately not
                  reimplemented in this site&rsquo;s shared Python{" "}
                  <code>api/</code>, per this site&rsquo;s own
                  portfolio-piece isolation convention&rsquo;s
                  different-runtime trigger.
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 align-top">Database</td>
                <td className="py-2 pr-4 align-top">Azure Cosmos DB (NoSQL API)</td>
                <td className="py-2 align-top">
                  Three containers — <code>techs</code> (partitioned by{" "}
                  <code>/id</code>), <code>jobs</code> and{" "}
                  <code>coachingHistory</code> (both partitioned by{" "}
                  <code>/techId</code>) — the natural query shape throughout
                  is &ldquo;everything for one tech.&rdquo;
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

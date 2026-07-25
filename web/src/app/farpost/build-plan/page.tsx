import type { Metadata } from "next";
import Link from "next/link";
import FarpostTabBar from "@/components/farpost/FarpostTabBar";
import PageHeading from "@/components/PageHeading";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Farpost Build Plan · Robin Samways",
};

export default function FarpostBuildPlanPage() {
  return (
    <main className="py-10">
      <FarpostTabBar />
      <PageHeading title="Farpost · Build Plan">
        Forward build sequencing for the real Farpost rebuild, as far as it
        can currently be forecast — this is provisional and will evolve as
        the build itself progresses, not a fixed roadmap.
      </PageHeading>

      <section>
        <SectionHeader title="PHASE_1_PORT_THE_CORE" />
        <div className="space-y-3 text-sm leading-relaxed">
          <p>
            Port the two pieces of domain logic that already work in
            production — reputation-ranked dispatch (see{" "}
            <Link href="/farpost/farpost-dispatch" className="text-accent hover:underline">
              Farpost Dispatch
            </Link>
            ) and NFC-tagged building records with per-category fact
            staleness — onto the converged siloes stack (Fastify, Drizzle,
            Postgres). This phase is deliberately a port, not a rewrite: the
            logic is already proven, only the runtime underneath it changes.
          </p>
          <p>
            Replace the original stack&rsquo;s ad hoc auth with
            better-auth&rsquo;s passwordless magic-link flow, matching
            Vocare&rsquo;s already-proven pattern, so every siloes project
            shares one design even though each keeps its own separate
            accounts and database.
          </p>
        </div>
      </section>

      <section>
        <SectionHeader title="PHASE_2_BUILD_WHAT_WAS_ONLY_DEMOED" />
        <div className="space-y-3 text-sm leading-relaxed">
          <p>
            Atlas and Pulse started as standalone portfolio demos (
            <Link href="/farpost/farpost-atlas" className="text-accent hover:underline">
              Atlas
            </Link>
            ,{" "}
            <Link href="/farpost/farpost-pulse" className="text-accent hover:underline">
              Pulse
            </Link>
            ) because there wasn&rsquo;t time to build them into the real
            product on its own stack. Now that the product itself is being
            rebuilt, both ideas move from standalone demo to real feature:
            Atlas&rsquo;s rural-density map overlay and Pulse&rsquo;s
            AI-assisted coaching tips get built against real dispatch and
            building-record data, not the illustrative data their demo pages
            use today.
          </p>
        </div>
      </section>

      <section>
        <SectionHeader title="PHASE_3_CUTOVER" />
        <div className="space-y-3 text-sm leading-relaxed">
          <p>
            Once the rebuild covers the original system&rsquo;s real usage,
            cut real traffic over from the MongoDB/FastAPI/Twilio production
            system to the new build, and retire the original stack. No date
            is set for this yet — it depends on how Phases 1 and 2 actually
            go, not a target picked in advance.
          </p>
        </div>
      </section>
    </main>
  );
}

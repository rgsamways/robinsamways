import type { Metadata } from "next";
import FarpostTabBar from "@/components/farpost/FarpostTabBar";
import PageHeading from "@/components/PageHeading";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Farpost Upgrade Path · Robin Samways",
};

export default function FarpostUpgradePathPage() {
  return (
    <main className="py-10">
      <FarpostTabBar />
      <PageHeading title="Farpost · Upgrade Path">
        Planned upgrades and evolutions to the live build, beyond the
        immediate rebuild work covered in Build Plan.
      </PageHeading>

      <section>
        <SectionHeader title="CROSS_SILO_IDENTITY_ABSTRACTION" />
        <p className="text-sm leading-relaxed">
          Farpost and Vocare currently share only a documented design
          pattern for authentication, not any actual code, database, or
          session — each project keeps its own fully separate accounts by
          deliberate choice. An open, unresolved question in the siloes
          program is whether a shared, cross-silo abstract user/session
          class is ever worth building without violating that separation.
          If it ever is, Farpost would be one of the first two projects to
          adopt it.
        </p>
      </section>

      <section>
        <SectionHeader title="LIVE_SILO_HOMEPAGE_EMBED" />
        <p className="text-sm leading-relaxed">
          <code>CLAUDE.md</code>&rsquo;s silo-isolation convention already
          commits to each project eventually getting a homepage under this
          site&rsquo;s Work group that embeds its actual live build, sourced
          directly from <code>siloes/farpost/</code> — not just documentation
          pages like this one. That&rsquo;s a deliberately separate, larger
          piece of work, not yet scheduled.
        </p>
      </section>
    </main>
  );
}

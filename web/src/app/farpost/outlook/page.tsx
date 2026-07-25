import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Farpost Outlook · Robin Samways",
};

export default function FarpostOutlookPage() {
  return (
    <main className="py-10">
      <PageHeading title="Farpost · Outlook">
        Where Farpost is headed beyond the near-term build plan.
      </PageHeading>

      <section>
        <SectionHeader title="POSITIONING" />
        <p className="text-sm leading-relaxed">
          Farpost&rsquo;s core value proposition — a building record that
          outlives any single owner, insurer, or contractor — doesn&rsquo;t
          need a network effect to already be useful to one owner. Long
          term, that same durability is what could let it become the
          neutral, carrier-agnostic layer that owners, brokers, and
          contractors already have reason to trust, without any of them
          needing to build it themselves.
        </p>
      </section>

      <section>
        <SectionHeader title="BEYOND_RURAL_ONTARIO" />
        <p className="text-sm leading-relaxed">
          Today&rsquo;s coverage area — North Hastings and the wider
          Canadian Shield — reflects where the original availability gap was
          most acute, not a ceiling on the idea. Nothing about a
          tag-anchored, per-building record is geographically specific;
          expanding coverage is a matter of demand and dispatch-network
          density, not a platform rebuild.
        </p>
      </section>
    </main>
  );
}

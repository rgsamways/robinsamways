import type { Metadata } from "next";
import FarpostTabBar from "@/components/farpost/FarpostTabBar";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Farpost Outlook · Robin Samways",
};

export default function FarpostOutlookPage() {
  return (
    <main className="py-10">
      <FarpostTabBar />
      <h1 className="text-xl font-bold">
        <span className="text-accent">$</span> Farpost &middot; Outlook
      </h1>
      <p className="mt-2 text-sm text-muted">
        Where Farpost is headed beyond the near-term build plan.
      </p>

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

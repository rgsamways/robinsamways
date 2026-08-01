import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Atlas Setup Gallery · Robin Samways",
};

export default function FarpostAtlasSetupGalleryPage() {
  return (
    <main className="py-10">
      <PageHeading title="Atlas · Setup Gallery">
        Nothing to show here yet.
      </PageHeading>

      <section>
        <SectionHeader title="STATUS" />
        <p className="text-sm leading-relaxed">
          Atlas&rsquo;s deployment is mostly code plus a static,
          pre-processed GeoJSON file — whether there&rsquo;s a genuine
          external-infrastructure step behind it worth photographing (e.g.
          how <code>farpost-atlas-geo</code>&rsquo;s Postgres host is
          actually provisioned) hasn&rsquo;t been settled yet. Rather than
          padding this page with unrelated or staged screenshots, it stays an
          honest placeholder until that&rsquo;s worked out.
        </p>
      </section>
    </main>
  );
}

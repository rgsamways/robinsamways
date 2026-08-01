import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Atlas AI Notes · Robin Samways",
};

export default function FarpostAtlasAiNotesPage() {
  return (
    <main className="py-10">
      <PageHeading title="Atlas · AI Notes">
        An honest gap, not a fabricated feature.
      </PageHeading>

      <section>
        <SectionHeader title="NO_AI_MECHANIC_TODAY" />
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            Unlike Credential Flow, Dispatch, and Pulse, Atlas does not use
            AI as part of its own mechanic today. The spatial join is real
            GIS work — Shapely, an in-memory index, a genuine point-in-polygon
            lookup — but nothing about resolving a coordinate to a rurality
            classification currently involves a language model.
          </p>
          <p>
            That&rsquo;s a known, tracked gap as of{" "}
            <span className="font-semibold text-accent">2026-08-01</span>,
            not an oversight being quietly skipped. Bringing AI into
            Atlas&rsquo;s geospatial piece in a way that&rsquo;s genuine —
            not a token feature bolted on just to fill this page — is
            deferred to a future change, worked out once there&rsquo;s an
            actual idea worth building rather than AI for its own sake.
          </p>
        </div>
      </section>
    </main>
  );
}

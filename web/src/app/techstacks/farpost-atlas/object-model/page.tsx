import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Atlas Object Model · Robin Samways",
};

export default function FarpostAtlasObjectModelPage() {
  return (
    <main className="py-10">
      <PageHeading title="Atlas · Object Model">
        The two record types <code>farpost-atlas-geo</code>&rsquo;s Postgres
        database stores, and how they relate.
      </PageHeading>

      <section>
        <SectionHeader title="TRACKED_BUILDING" />
        <p className="mb-4 text-sm leading-relaxed">
          One row per seeded building on the map.
        </p>
        <div className="overflow-x-auto text-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-foreground/20 text-left text-muted">
                <th className="py-1 pr-4 font-semibold">Field</th>
                <th className="py-1 font-semibold">Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">id</td>
                <td className="py-2 align-top">Primary key</td>
              </tr>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">address</td>
                <td className="py-2 align-top">Display address on the map and detail page</td>
              </tr>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">latitude, longitude</td>
                <td className="py-2 align-top">
                  The coordinate pair the spatial join runs against
                </td>
              </tr>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">owner name</td>
                <td className="py-2 align-top">Seeded fictional owner, for narrative color</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 align-top">region name</td>
                <td className="py-2 align-top">
                  The North Hastings municipality this building sits in
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <SectionHeader title="TRACKED_RECORD" />
        <p className="mb-4 text-sm leading-relaxed">
          One row per tracked fact about a building — septic, well pump,
          foundation, or electrical panel.
        </p>
        <div className="overflow-x-auto text-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-foreground/20 text-left text-muted">
                <th className="py-1 pr-4 font-semibold">Field</th>
                <th className="py-1 font-semibold">Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">id</td>
                <td className="py-2 align-top">Primary key</td>
              </tr>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">building id</td>
                <td className="py-2 align-top">Foreign key to the owning TrackedBuilding</td>
              </tr>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">record type</td>
                <td className="py-2 align-top">
                  One of septic, well pump, foundation, or electrical panel
                </td>
              </tr>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">last-recorded date</td>
                <td className="py-2 align-top">Source for the computed staleness fact</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 align-top">notes</td>
                <td className="py-2 align-top">Free-text detail, e.g. septic tank location</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <SectionHeader title="RELATIONSHIP" />
        <p className="text-sm leading-relaxed">
          Every <code>TrackedRecord</code> belongs to exactly one{" "}
          <code>TrackedBuilding</code> — a straightforward one-to-many, the
          same shape as Farpost&rsquo;s own building-to-record relationship
          that this piece deliberately echoes at a mapped, regional scale.
        </p>
      </section>
    </main>
  );
}

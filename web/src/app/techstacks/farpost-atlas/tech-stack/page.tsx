import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Atlas Tech Stack · Robin Samways",
};

export default function FarpostAtlasTechStackPage() {
  return (
    <main className="py-10">
      <PageHeading title="Atlas · Tech Stack">
        The real technology choices behind the spatial join, and what&rsquo;s
        genuine GIS work versus a lighter-weight stand-in for a production
        GIS stack.
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
                <td className="py-2 pr-4 align-top">Backend</td>
                <td className="py-2 pr-4 align-top">FastAPI, Python</td>
                <td className="py-2 align-top">
                  Same framework as this site&rsquo;s own <code>api/</code>,
                  kept as a genuinely separate service rather than shared —
                  the point is proving the isolation convention&rsquo;s
                  heavy-dependency trigger, not reusing infrastructure.
                </td>
              </tr>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">Spatial join</td>
                <td className="py-2 pr-4 align-top">
                  Shapely (in-memory STRtree)
                </td>
                <td className="py-2 align-top">
                  A genuine point-in-polygon index at real request time — the
                  actual GIS work this piece exists to prove, not pins
                  dropped on a map and called &ldquo;GIS.&rdquo;
                </td>
              </tr>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">Boundary ingestion</td>
                <td className="py-2 pr-4 align-top">
                  GeoPandas (one-time script)
                </td>
                <td className="py-2 align-top">
                  A lighter-weight stand-in role, not a runtime dependency:
                  reprojection, simplification, and the population-density
                  join all happen once, locally, before this piece ever
                  ships.
                </td>
              </tr>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">Database</td>
                <td className="py-2 pr-4 align-top">Postgres</td>
                <td className="py-2 align-top">
                  Tracked buildings and their records — ordinary relational
                  data, matching this site&rsquo;s existing Postgres pattern.
                  No PostGIS extension; see{" "}
                  <a
                    href="/techstacks/farpost-atlas/design-notes"
                    className="text-accent underline"
                  >
                    Design Notes
                  </a>{" "}
                  for why.
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 align-top">Map</td>
                <td className="py-2 pr-4 align-top">Leaflet / react-leaflet</td>
                <td className="py-2 align-top">
                  No API key or vendor account needed, unlike Mapbox — the
                  standard, well-documented choice for rendering clustered
                  markers and a real GeoJSON polygon overlay.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <SectionHeader title="WHAT_MAKES_THIS_REAL_GIS" />
        <p className="text-sm leading-relaxed">
          The distinction that matters: Shapely&rsquo;s in-memory{" "}
          <code>STRtree</code> is a real spatial index queried on every
          request, not a decorative map. GeoPandas, by contrast, never runs
          in the deployed service at all — it&rsquo;s a one-time local
          ingestion tool, the same &ldquo;heavy/native dependency kept out of
          the shared runtime&rdquo; pattern this site&rsquo;s portfolio-piece
          isolation convention exists to describe.
        </p>
      </section>
    </main>
  );
}

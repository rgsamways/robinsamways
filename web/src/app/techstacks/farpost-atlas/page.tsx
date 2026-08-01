import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import SectionHeader from "@/components/SectionHeader";
import AtlasMapLoader from "@/components/farpost-atlas/AtlasMapLoader";

export const metadata: Metadata = {
  title: "Farpost Atlas · Robin Samways",
};

export default function FarpostAtlasPage() {
  return (
    <main className="py-10">
      <PageHeading title="Farpost Atlas">
        A real geospatial join against Statistics Canada census boundary
        data — real GIS work, not pins on a map.
      </PageHeading>

      <section>
        <SectionHeader title="ORIGIN_STORY" />
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            Every Narrative piece so far proved a skill category the last one
            already established — OAuth integration, a serverless backend, an
            AI SDK. None of them proved genuine spatial or GIS work, a
            distinct technical category on its own. I wanted a piece built
            specifically to close that gap: a real point-in-polygon spatial
            join against real Statistics Canada census boundary data, not
            markers dropped on a map and called &ldquo;GIS.&rdquo;
          </p>
          <p>
            Farpost Atlas also directly echoes <a href="/farpost" className="text-accent underline">Farpost</a>
            &rsquo;s own real staleness mechanic — the septic{" "}
            &ldquo;last pumped 3 years ago&rdquo; fact surfaced on Farpost&rsquo;s
            own page — applied to a whole region of tracked buildings instead
            of one worked example. Each seeded building here carries tracked
            records (septic, well pump, foundation, electrical panel), each
            aging at its own realistic pace, each flagged as a fact surfaced,
            not a verdict passed — the same principle, at a mapped, regional
            scale.
          </p>
        </div>
      </section>

      <section>
        <SectionHeader title="ARCHITECTURE" />
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            The backend, <code>farpost-atlas-geo</code>, is a genuinely
            separate Python/FastAPI service running a real Shapely spatial
            join against an in-memory index built from Statistics Canada
            boundary data — no PostGIS, deliberately, at this piece&rsquo;s
            scale. See{" "}
            <a href="/techstacks/farpost-atlas/architecture" className="text-accent underline">
              Architecture
            </a>{" "}
            for the full spatial-join explanation and the three HTTP
            endpoints it exposes.
          </p>
        </div>
      </section>

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
                <td className="py-2 pr-4 align-top">Shapely (in-memory STRtree)</td>
                <td className="py-2 align-top">
                  A genuine point-in-polygon index at real request time — no
                  PostGIS, since a few dozen polygons is well within what an
                  in-memory index handles without heavier infrastructure.
                </td>
              </tr>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">Boundary ingestion</td>
                <td className="py-2 pr-4 align-top">GeoPandas (one-time script)</td>
                <td className="py-2 align-top">
                  Reprojection, simplification, and the population-density
                  join all happen once, locally — never a runtime dependency
                  of the deployed service itself.
                </td>
              </tr>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">Database</td>
                <td className="py-2 pr-4 align-top">Postgres</td>
                <td className="py-2 align-top">
                  Tracked buildings and their records — ordinary relational
                  data, matching this site&rsquo;s existing Postgres pattern.
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
        <SectionHeader title="MAP" />
        <p className="mb-4 text-sm leading-relaxed">
          Seeded tracked buildings across North Hastings, Ontario — clustered
          markers, each linking to that building&rsquo;s own tracked-record
          detail page. Toggle the rural-density overlay to see the real
          Dissemination Area boundaries the spatial join runs against.
        </p>
        <AtlasMapLoader />
      </section>
    </main>
  );
}

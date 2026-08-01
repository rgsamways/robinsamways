import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Atlas Architecture · Robin Samways",
};

export default function FarpostAtlasArchitecturePage() {
  return (
    <main className="py-10">
      <PageHeading title="Atlas · Architecture">
        How a building&rsquo;s coordinates actually resolve to a rurality
        classification.
      </PageHeading>

      <section>
        <SectionHeader title="SPATIAL_JOIN" />
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            The backend, <code>farpost-atlas-geo</code>, is a genuinely
            separate Python/FastAPI service — promoted out of this
            site&rsquo;s shared <code>api/</code> from day one, not
            prototyped there first. Shapely is a real runtime dependency of a
            live spatial join, not a one-off local script —{" "}
            <code>geopandas</code>, used only in the one-time ingestion step
            below, deliberately isn&rsquo;t.
          </p>
          <p>
            No PostGIS. At this scale — a few dozen North Hastings
            Dissemination Area polygons, a dozen-odd tracked buildings — a
            spatial database extension would be real weight for no real
            benefit. Instead, a small in-memory Shapely{" "}
            <code>STRtree</code> is built once at application startup from a
            pre-processed GeoJSON file, and every{" "}
            <code>GET /api/buildings/{"{id}"}</code> request runs a genuine
            point-in-polygon query against it. Tracked buildings and their
            records themselves live in an ordinary small Postgres database —
            only the boundary-polygon lookup gets the spatial index.
          </p>
          <p>
            The one-time ingestion step is where <code>geopandas</code>{" "}
            actually earns its keep: reprojecting Statistics Canada&rsquo;s
            2021 Census Dissemination Area boundary file out of its native
            Lambert conformal conic projection into the WGS84 coordinates
            Leaflet expects, simplifying geometry for web rendering, and
            joining each polygon&rsquo;s real, StatCan-computed
            population-density figure by <code>DAUID</code>. That step runs
            once, locally, before this page ever ships — never part of the
            live request path.
          </p>
          <p>
            The frontend calls <code>farpost-atlas-geo</code> directly from
            the browser, the same relationship{" "}
            <a
              href="/techstacks/farpost-pulse"
              className="text-accent underline"
            >
              Farpost Pulse
            </a>{" "}
            has with its own backend — nothing sensitive is at stake here
            (every building is seeded and fictional), so a server-side proxy
            through this site&rsquo;s own <code>api/</code> would add
            complexity without adding real protection.
          </p>
        </div>
      </section>

      <section>
        <SectionHeader title="HTTP_ENDPOINTS" />
        <div className="overflow-x-auto text-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-foreground/20 text-left text-muted">
                <th className="py-1 pr-4 font-semibold">Endpoint</th>
                <th className="py-1 font-semibold">Returns</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">
                  <code>GET /api/buildings</code>
                </td>
                <td className="py-2 align-top">
                  All seeded buildings, with coordinates and a rollup
                  staleness flag.
                </td>
              </tr>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">
                  <code>GET /api/buildings/{"{id}"}</code>
                </td>
                <td className="py-2 align-top">
                  One building&rsquo;s full tracked-record list, each with
                  per-record staleness, plus its rurality classification from
                  the spatial join.
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 align-top">
                  <code>GET /api/boundaries</code>
                </td>
                <td className="py-2 align-top">
                  A GeoJSON <code>FeatureCollection</code> of North Hastings
                  Dissemination Area polygons, each carrying a
                  population-density property.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import HamburgerMenu from "@/components/HamburgerMenu";
import SectionHeader from "@/components/SectionHeader";
import AtlasMapLoader from "@/components/farpost-atlas/AtlasMapLoader";
import FarpostTabBar from "@/components/farpost/FarpostTabBar";

const SECTION_LINKS = [
  { href: "#origin-story", label: "Origin Story" },
  { href: "#architecture", label: "Architecture" },
  { href: "#tech-stack", label: "Tech Stack" },
  { href: "#map", label: "Map" },
];

export const metadata: Metadata = {
  title: "Farpost Atlas · Robin Samways",
};

export default function FarpostAtlasPage() {
  return (
    <main className="py-10">
      <FarpostTabBar />
      <div className="flex items-start gap-3">
        <HamburgerMenu links={SECTION_LINKS} ariaLabel="page sections menu" />
        <div>
          <h1 className="text-xl font-bold">
            <span className="text-accent">$</span> Farpost Atlas
          </h1>
          <p className="mt-2 text-sm text-muted">
            A real geospatial join against Statistics Canada census boundary
            data — real GIS work, not pins on a map.
          </p>
        </div>
      </div>

      <section>
        <SectionHeader id="origin-story" title="ORIGIN_STORY" />
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
        <SectionHeader id="architecture" title="ARCHITECTURE" />
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            The backend, <code>farpost-atlas-geo</code>, is a genuinely
            separate Python/FastAPI service — promoted out of this
            site&rsquo;s shared <code>api/</code> from day one, not prototyped
            there first. Shapely{" "}
            is a real runtime dependency of a live spatial join, not a one-off local script —{" "}
            <code>geopandas</code>, used only in the one-time ingestion step
            below, deliberately isn&rsquo;t. That&rsquo;s exactly the
            &ldquo;heavy/native dependency&rdquo; case this
            site&rsquo;s own portfolio-piece isolation convention was written
            to describe, before this piece existed to actually prove it.
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
            <a href="/farpost/farpost-pulse" className="text-accent underline">Farpost Pulse</a>
            {" "}has with its own backend — nothing sensitive is at stake
            here (every building is seeded and fictional), so a server-side
            proxy through this site&rsquo;s own <code>api/</code> would add
            complexity without adding real protection.
          </p>
        </div>
      </section>

      <section>
        <SectionHeader id="tech-stack" title="TECH_STACK" />
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
        <SectionHeader id="map" title="MAP" />
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

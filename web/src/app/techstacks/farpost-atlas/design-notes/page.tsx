import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Atlas Design Notes · Robin Samways",
};

export default function FarpostAtlasDesignNotesPage() {
  return (
    <main className="py-10">
      <PageHeading title="Atlas · Design Notes">
        Why Shapely plus an in-memory index instead of a real PostGIS-backed
        spatial database, and what would actually have to change to scale
        this past its current fixed dataset.
      </PageHeading>

      <section>
        <SectionHeader title="WHY_NOT_POSTGIS" />
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            PostGIS is the correct answer once a spatial dataset is large,
            changes at runtime, or needs to be joined against other tables
            inside the database itself. Atlas has none of those pressures
            today: a fixed set of North Hastings Dissemination Area
            polygons, a dozen-odd seeded buildings, and a lookup that only
            ever needs &ldquo;which polygon contains this point.&rdquo;
            Standing up a Postgres spatial extension for that would be real
            infrastructure weight — an install step, an extension to keep
            patched, a query planner to reason about — bought for a query
            pattern a small in-memory Shapely{" "}
            <code>STRtree</code>, rebuilt once at process startup, already
            answers correctly and quickly.
          </p>
          <p>
            The trade-off is real, not free: the in-memory index means every
            deployed instance needs the same GeoJSON file baked in at
            startup, and any change to the underlying boundary data means a
            redeploy, not a database update. For a fixed 2021 Census
            Dissemination Area dataset that isn&rsquo;t expected to change,
            that&rsquo;s an acceptable trade against not running a heavier
            spatial database for a workload this small.
          </p>
        </div>
      </section>

      <section>
        <SectionHeader title="WHAT_SCALING_WOULD_CHANGE" />
        <p className="text-sm leading-relaxed">
          The in-memory approach stops making sense the moment the boundary
          data needs to update independently of a deploy (e.g. a new census
          release, or coverage expanding beyond North Hastings), or the
          polygon count grows large enough that rebuilding the index at every
          cold start becomes slow. Either of those is the actual trigger for
          moving to PostGIS: durable, queryable spatial storage that can be
          updated without redeploying the service, with the point-in-polygon
          query pushed down into the database itself instead of held in
          application memory.
        </p>
      </section>
    </main>
  );
}

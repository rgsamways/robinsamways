import type { Metadata } from "next";
import SectionHeader from "@/components/SectionHeader";
import { parseMetricsSnapshots } from "@/components/dev-log/metrics";
import MetricsDashboard from "@/components/dev-log/MetricsDashboard";
import rawMetricsData from "@/data/metrics.json";

export const metadata: Metadata = {
  title: "Metrics · Dev Log · Robin Samways",
};

export default function DevLogMetricsPage() {
  const snapshots = parseMetricsSnapshots(rawMetricsData);

  return (
    <main className="py-10">
      <h1 className="text-xl font-bold">
        <span className="text-accent">$</span> Dev Log &middot; Metrics
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Real code-metrics history for this site&rsquo;s own source
        (<code>web/</code>, <code>api/</code>, <code>pieces/</code>).
      </p>

      <section>
        <SectionHeader title="METRICS" />
        <MetricsDashboard snapshots={snapshots} />
      </section>
    </main>
  );
}

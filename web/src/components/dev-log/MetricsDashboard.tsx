import type { MetricsSnapshot } from "./metrics";
import MetricsTrendChart from "./MetricsTrendChart";

function StatTile({ label, value, delta }: { label: string; value: string; delta?: string }) {
  return (
    <div className="border border-foreground/20 p-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-lg font-bold text-accent">{value}</p>
      {delta && <p className="mt-0.5 text-xs text-muted">{delta}</p>}
    </div>
  );
}

function formatDelta(current: number, previous: number, unit = ""): string {
  const change = current - previous;
  if (change === 0) return "flat vs. previous snapshot";
  const sign = change > 0 ? "+" : "";
  return `${sign}${change}${unit} vs. previous snapshot`;
}

export default function MetricsDashboard({ snapshots }: { snapshots: MetricsSnapshot[] }) {
  if (snapshots.length === 0) {
    return <p className="text-sm text-muted">No snapshots logged yet.</p>;
  }

  const latest = snapshots[snapshots.length - 1];
  const previous = snapshots.length > 1 ? snapshots[snapshots.length - 2] : null;

  const codeLineSeries = snapshots.map((snapshot) => ({ label: snapshot.date, value: snapshot.code }));
  const complexitySeries = snapshots.map((snapshot) => ({ label: snapshot.date, value: snapshot.complexity }));
  const drynessSeries = snapshots.map((snapshot) => ({ label: snapshot.date, value: snapshot.drynessPercent }));

  return (
    <div>
      <p className="text-sm leading-relaxed">
        Real <code>scc</code> (Sloc Cloc and Code) snapshots, taken right before archiving every OpenSpec
        change — the same running history logged internally in{" "}
        <code>docs/metrics.md</code>, mirrored here. Not curated highlights: every snapshot this project has
        ever taken is below.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Files" value={latest.files.toLocaleString()} />
        <StatTile
          label="Code lines"
          value={latest.code.toLocaleString()}
          delta={previous ? formatDelta(latest.code, previous.code) : undefined}
        />
        <StatTile
          label="Complexity"
          value={latest.complexity.toLocaleString()}
          delta={previous ? formatDelta(latest.complexity, previous.complexity) : undefined}
        />
        <StatTile
          label="DRYness"
          value={`${latest.drynessPercent}%`}
          delta={previous ? formatDelta(latest.drynessPercent, previous.drynessPercent, "pt") : undefined}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <MetricsTrendChart data={codeLineSeries} metricLabel="Code lines" />
        <MetricsTrendChart data={complexitySeries} metricLabel="Complexity" />
        <MetricsTrendChart data={drynessSeries} unit="%" metricLabel="DRYness" />
      </div>

      <ul className="mt-6 space-y-3 text-xs">
        {[...snapshots].reverse().map((snapshot) => (
          <li key={snapshot.change} className="border-l-2 border-accent pl-3">
            <p className="text-muted">
              {snapshot.date} · <span className="text-accent">{snapshot.change}</span>
            </p>
            <p className="mt-0.5">{snapshot.note}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

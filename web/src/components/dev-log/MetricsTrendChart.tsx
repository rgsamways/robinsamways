type TrendPoint = { label: string; value: number };

// Same single-accent-line pattern as Farpost Pulse's TrendChart — deliberately
// consistent with the rest of the site rather than introducing a categorical
// palette for what's still just one series per chart.
export default function MetricsTrendChart({
  data,
  unit = "",
  metricLabel,
}: {
  data: TrendPoint[];
  unit?: string;
  metricLabel: string;
}) {
  if (data.length === 0) {
    return <p className="text-sm text-muted">Not enough snapshots yet for a trend.</p>;
  }

  const width = 320;
  const height = 120;
  const padding = 16;
  const values = data.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const first = values[0];
  const last = values[values.length - 1];
  const direction = last > first ? "trending up" : last < first ? "trending down" : "holding steady";
  const ariaLabel = `${metricLabel} across ${data.length} snapshots: ranged from ${min}${unit} to ${max}${unit}, ${direction} (${first}${unit} to ${last}${unit})`;

  const coordinates = data.map((point, index) => {
    const x = padding + (index / Math.max(data.length - 1, 1)) * (width - padding * 2);
    const y = height - padding - ((point.value - min) / range) * (height - padding * 2);
    return { x, y };
  });

  const polylinePoints = coordinates.map(({ x, y }) => `${x},${y}`).join(" ");

  return (
    <div>
      <p className="text-xs font-semibold text-accent">{metricLabel}</p>
      <svg viewBox={`0 0 ${width} ${height}`} className="mt-1 w-full" role="img" aria-label={ariaLabel}>
        <polyline points={polylinePoints} fill="none" stroke="var(--accent)" strokeWidth={2} />
        {coordinates.map((point, index) => (
          <circle key={index} cx={point.x} cy={point.y} r={2.5} fill="var(--accent)" />
        ))}
      </svg>
      <div className="mt-1 flex justify-between text-xs text-muted">
        <span>
          {data[0].value}
          {unit}
        </span>
        <span>
          {data[data.length - 1].value}
          {unit}
        </span>
      </div>
    </div>
  );
}

type TrendPoint = { label: string; value: number };

export default function TrendChart({
  data,
  unit = "",
  metricLabel,
}: {
  data: TrendPoint[];
  unit?: string;
  metricLabel: string;
}) {
  if (data.length === 0) {
    return <p className="text-sm text-muted">Not enough data yet for a trend.</p>;
  }

  const width = 600;
  const height = 160;
  const padding = 20;
  const values = data.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  // Summarize the whole series (min/max/direction), not just the first and
  // last points — those can coincidentally match even when the chart shows
  // real variation in between, which would otherwise under-describe the
  // trend for anyone using a screen reader.
  const first = values[0];
  const last = values[values.length - 1];
  const direction = last > first ? "trending up" : last < first ? "trending down" : "holding steady";
  const ariaLabel = `${metricLabel} across ${data.length} jobs: ranged from ${min}${unit} to ${max}${unit}, ${direction} (${first}${unit} to ${last}${unit})`;

  const coordinates = data.map((point, index) => {
    const x = padding + (index / Math.max(data.length - 1, 1)) * (width - padding * 2);
    const y = height - padding - ((point.value - min) / range) * (height - padding * 2);
    return { x, y };
  });

  const polylinePoints = coordinates.map(({ x, y }) => `${x},${y}`).join(" ");

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label={ariaLabel}>
        <polyline points={polylinePoints} fill="none" stroke="var(--accent)" strokeWidth={2} />
        {coordinates.map((point, index) => (
          <circle key={index} cx={point.x} cy={point.y} r={2.5} fill="var(--accent)" />
        ))}
      </svg>
      <div className="mt-1 flex justify-between text-xs text-muted">
        <span>
          {data[0].label}: {data[0].value}
          {unit}
        </span>
        <span>
          {data[data.length - 1].label}: {data[data.length - 1].value}
          {unit}
        </span>
      </div>
    </div>
  );
}

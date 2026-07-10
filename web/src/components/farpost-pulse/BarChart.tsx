type BarPoint = { label: string; value: number | null };

export default function BarChart({
  data,
  unit = "",
  ariaLabel,
}: {
  data: BarPoint[];
  unit?: string;
  ariaLabel: string;
}) {
  const max = Math.max(...data.map((point) => point.value ?? 0), 1);

  return (
    <div className="space-y-2" role="img" aria-label={ariaLabel}>
      {data.map((point) => (
        <div key={point.label} className="flex items-center gap-2 text-xs">
          <span className="w-32 shrink-0 truncate">{point.label}</span>
          <div className="h-4 flex-1 bg-skills-bg">
            <div
              className="h-4 bg-accent"
              style={{ width: `${point.value != null ? (point.value / max) * 100 : 0}%` }}
            />
          </div>
          <span className="w-16 shrink-0 text-right text-muted">
            {point.value != null ? `${point.value}${unit}` : "—"}
          </span>
        </div>
      ))}
    </div>
  );
}

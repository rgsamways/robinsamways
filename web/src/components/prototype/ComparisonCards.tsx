type ComparisonList = { label: string; items: string[] };

// Farpost's "Without Farpost / With Farpost" pattern from its
// "Every building forgets" section. Reuses --concept/--concept-dim as the
// "positive" highlight color (green here) rather than adding a dedicated
// token — the "without" side just stays muted/gray, same weight relationship
// ConceptBlock already uses for its one highlighted color vs. plain text.
export default function ComparisonCards({
  without,
  withThis,
}: {
  without: ComparisonList;
  withThis: ComparisonList;
}) {
  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2">
      <div className="rounded-md border border-foreground/15 bg-skills-bg px-4 py-4">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
          {without.label}
        </div>
        <ul className="space-y-1.5 text-sm text-muted">
          {without.items.map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden>✗</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-md border border-[var(--concept-dim)] bg-[var(--concept)]/[0.08] px-4 py-4">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--concept)]">
          {withThis.label}
        </div>
        <ul className="space-y-1.5 text-sm">
          {withThis.items.map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden className="text-[var(--concept)]">
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

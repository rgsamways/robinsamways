import type { BugListEntry } from "./types";

export default function BugListSection({ entries }: { entries: BugListEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-muted">
        No bugs logged yet for this project — this page will grow as real ones get hit.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {entries.map((entry) => (
        <article key={entry.slug} id={entry.slug} className="scroll-mt-4">
          <h3 className="text-sm font-bold">
            <span className="text-accent">&gt;</span> {entry.title}
          </h3>
          <p className="mt-1 text-xs text-muted">{entry.date}</p>

          <p className="mt-3 text-xs font-semibold text-accent">The bug</p>
          <div className="mt-1 space-y-3 text-sm leading-relaxed">
            {entry.theBug.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <p className="mt-3 text-xs font-semibold text-accent">The fix</p>
          <div className="mt-1 space-y-3 text-sm leading-relaxed">
            {entry.theFix.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

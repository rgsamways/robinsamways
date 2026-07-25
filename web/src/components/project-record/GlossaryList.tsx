import type { GlossaryTerm } from "./types";

export default function GlossaryList({ terms }: { terms: GlossaryTerm[] }) {
  if (terms.length === 0) {
    return (
      <p className="text-sm text-muted">No terms specific to this project yet.</p>
    );
  }

  return (
    <dl className="space-y-4 text-sm">
      {terms.map((entry) => (
        <div key={entry.term}>
          <dt className="font-semibold text-accent">{entry.term}, in layman&rsquo;s terms</dt>
          <dd className="mt-1 leading-relaxed">{entry.answer}</dd>
        </div>
      ))}
    </dl>
  );
}

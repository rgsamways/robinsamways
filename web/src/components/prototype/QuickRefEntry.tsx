import type { ReactNode } from "react";

// Lifted from design-system-handoff.md §2 — the teal/accent "syntax" block.
// Rides the site's existing --accent rather than a second color, since
// quick-ref content maps to the one accent robinsamways.ca already has.
export default function QuickRefEntry({
  desc,
  code,
}: {
  desc: ReactNode;
  code: ReactNode;
}) {
  return (
    <div className="mb-5">
      <span className="mb-2 inline-block rounded border border-accent/40 bg-accent/10 px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-accent">
        Quick ref
      </span>
      <div className="mb-1.5 text-[0.92rem] text-muted">{desc}</div>
      <pre className="overflow-x-auto rounded-md border border-foreground/20 border-l-[3px] border-l-accent/60 bg-skills-bg px-3.5 py-3">
        <code className="font-mono text-[0.87rem]">{code}</code>
      </pre>
    </div>
  );
}

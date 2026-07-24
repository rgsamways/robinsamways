import type { ReactNode } from "react";

// Lifted from design-system-handoff.md §2 — the amber "why/judgment" callout.
// Uses --concept/--concept-dim rather than --accent since it's a distinct
// second accent the real site has no equivalent of (see ThemeToggleShell).
export default function ConceptBlock({ children }: { children: ReactNode }) {
  return (
    <div className="mb-5 rounded-md border border-[var(--concept-dim)] border-l-[3px] border-l-[var(--concept)] bg-[var(--concept)]/[0.08] px-[18px] py-3.5 text-[0.92rem]">
      <span className="mb-2 inline-block rounded border border-[var(--concept-dim)] bg-[var(--concept)]/10 px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--concept)]">
        Concept
      </span>
      <div>{children}</div>
    </div>
  );
}

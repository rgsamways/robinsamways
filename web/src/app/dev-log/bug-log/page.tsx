import type { Metadata } from "next";
import SectionHeader from "@/components/SectionHeader";
import { BUG_LOG_ENTRIES } from "@/components/dev-log/bugLog";

export const metadata: Metadata = {
  title: "Bug Log · Dev Log · Robin Samways",
};

export default function BugLogPage() {
  return (
    <main className="py-10">
      <h1 className="text-xl font-bold">
        <span className="text-accent">$</span>{" "}Dev Log &middot; Bug Log
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Real bugs actually hit during development, each paired with the
        underlying concept it reveals — the messy, unpolished record, not a
        curated highlight reel.
      </p>

      <section>
        <SectionHeader title="BUG_LOG" />
        <div className="space-y-8">
          {BUG_LOG_ENTRIES.map((entry) => (
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

              <p className="mt-3 text-xs font-semibold text-accent">The concept</p>
              <div className="mt-1 space-y-3 text-sm leading-relaxed">
                {entry.theConcept.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

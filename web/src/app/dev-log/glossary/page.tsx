import type { Metadata } from "next";
import SectionHeader from "@/components/SectionHeader";
import { GLOSSARY_ENTRIES } from "@/components/dev-log/glossary";

export const metadata: Metadata = {
  title: "Glossary · Dev Log · Robin Samways",
};

export default function GlossaryPage() {
  return (
    <main className="py-10">
      <h1 className="text-xl font-bold">
        <span className="text-accent">$</span> Dev Log &middot; Glossary
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Translating a technical decision for someone who wasn&rsquo;t in the
        room when it was made is its own skill, distinct from making the
        decision itself — a stakeholder, a hiring manager, or a curious
        reader shouldn&rsquo;t need the jargon to follow the reasoning. This
        growing "X, in layman&rsquo;s terms" list is that skill applied to
        the tools and concepts used elsewhere on this site, not a bare
        dictionary.
      </p>

      <section>
        <SectionHeader title="GLOSSARY" />
        <dl className="space-y-4 text-sm">
          {GLOSSARY_ENTRIES.map((entry) => (
            <div key={entry.term}>
              <dt className="font-semibold text-accent">{entry.term}, in layman&rsquo;s terms</dt>
              <dd className="mt-1 leading-relaxed">{entry.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}

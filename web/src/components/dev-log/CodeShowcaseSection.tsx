import CodeBlock from "@/components/CodeBlock";
import { CODE_SHOWCASE_ENTRIES } from "./codeShowcase";

export default function CodeShowcaseSection() {
  return (
    <div className="space-y-10">
      {CODE_SHOWCASE_ENTRIES.map((entry) => (
        <article key={entry.slug} className="scroll-mt-4">
          <p className="text-xs uppercase tracking-wide text-muted">
            {entry.project} &middot; {entry.category} &middot; {entry.date}
          </p>
          <h3 className="mt-1 text-sm font-bold">
            <span className="text-accent">&gt;</span> {entry.title}
          </h3>

          <div className="mt-3 space-y-3 text-sm leading-relaxed">
            {entry.framing.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-4 space-y-4">
            {entry.codeBlocks.map((block, index) => (
              <CodeBlock key={index}>{block.code}</CodeBlock>
            ))}
          </div>

          <p className="mt-3 text-xs font-semibold text-accent">The fix</p>
          <div className="mt-1 space-y-3 text-sm leading-relaxed">
            {entry.theFix.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <p className="mt-3 text-xs font-semibold text-accent">Why this matters</p>
          <div className="mt-1 space-y-3 text-sm leading-relaxed">
            {entry.whyThisMatters.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

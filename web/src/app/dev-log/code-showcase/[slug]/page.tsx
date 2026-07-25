import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CodeBlock from "@/components/CodeBlock";
import Timestamp from "@/components/dev-log/Timestamp";
import { CODE_SHOWCASE_ENTRIES } from "@/components/dev-log/codeShowcase";

export function generateStaticParams() {
  return CODE_SHOWCASE_ENTRIES.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = CODE_SHOWCASE_ENTRIES.find((candidate) => candidate.slug === slug);
  return { title: entry ? `${entry.title} · Code Showcase · Robin Samways` : "Code Showcase · Robin Samways" };
}

export default async function CodeShowcaseArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = CODE_SHOWCASE_ENTRIES.find((candidate) => candidate.slug === slug);
  if (!entry) notFound();

  return (
    <main className="py-10">
      <article>
        <p className="text-xs uppercase tracking-wide text-muted">
          {entry.project} &middot; {entry.category}
        </p>
        <h1 className="mt-1 text-xl font-bold">
          <span className="text-accent">$</span> {entry.title}
        </h1>
        <div className="mt-2">
          <Timestamp utc={entry.publishedAtUtc} />
        </div>

        <div className="mt-4 space-y-3 text-sm leading-relaxed">
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
    </main>
  );
}

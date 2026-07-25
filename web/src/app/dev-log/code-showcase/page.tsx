import type { Metadata } from "next";
import Link from "next/link";
import Timestamp from "@/components/dev-log/Timestamp";
import { CODE_SHOWCASE_ENTRIES } from "@/components/dev-log/codeShowcase";

export const metadata: Metadata = {
  title: "Code Showcase · Dev Log · Robin Samways",
};

export default function CodeShowcaseIndexPage() {
  return (
    <main className="py-10">
      <h1 className="text-xl font-bold">
        <span className="text-accent">$</span> Dev Log &middot; Code Showcase
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Real, verified code pulled straight from the Farpost project — not
        illustrative examples — each paired with the plain-language
        reasoning and the engineering judgment behind it.
      </p>

      <ul className="mt-8 space-y-6">
        {CODE_SHOWCASE_ENTRIES.map((entry) => (
          <li key={entry.slug} className="border-b border-foreground/10 pb-6">
            <p className="text-xs uppercase tracking-wide text-muted">
              {entry.project} &middot; {entry.category}
            </p>
            <h2 className="mt-1 text-sm font-bold">
              <Link href={`/dev-log/code-showcase/${entry.slug}`} className="hover:text-accent">
                <span className="text-accent">&gt;</span> {entry.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm leading-relaxed">{entry.teaser}</p>
            <div className="mt-2">
              <Timestamp utc={entry.publishedAtUtc} />
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

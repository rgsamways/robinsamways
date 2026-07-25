import type { Metadata } from "next";
import Link from "next/link";
import PageHeading from "@/components/PageHeading";
import Timestamp from "@/components/dev-log/Timestamp";
import { CODE_SHOWCASE_ENTRIES } from "@/components/dev-log/codeShowcase";

export const metadata: Metadata = {
  title: "Dev Log · Robin Samways",
};

const ENTRIES = [...CODE_SHOWCASE_ENTRIES].sort((a, b) =>
  b.publishedAtUtc.localeCompare(a.publishedAtUtc)
);

export default function DevLogPage() {
  return (
    <main className="py-10">
      <PageHeading title="Dev Log">
        The unpolished, ongoing record — real, verified code and development
        experience from Robin&rsquo;s own projects, most recent first.
      </PageHeading>

      <ul className="mt-8 space-y-6">
        {ENTRIES.map((entry) => (
          <li key={entry.slug} className="border-b border-foreground/10 pb-6">
            <p className="text-xs uppercase tracking-wide text-muted">
              {entry.project} &middot; {entry.category}
            </p>
            <h2 className="mt-1 text-sm font-bold">
              <Link href={`/dev-log/${entry.slug}`} className="hover:text-accent">
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

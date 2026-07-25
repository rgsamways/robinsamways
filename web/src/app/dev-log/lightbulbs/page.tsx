import type { Metadata } from "next";
import Link from "next/link";
import PageHeading from "@/components/PageHeading";
import { LIGHTBULB_ENTRIES } from "@/data/lightbulbs";

export const metadata: Metadata = {
  title: "Lightbulbs · Dev Log · Robin Samways",
};

export default function LightbulbsPage() {
  return (
    <main className="py-10">
      <PageHeading
        title="Dev Log · Lightbulbs"
        descriptionClassName="mt-2 text-sm leading-relaxed text-muted"
      >
        An idea doesn&rsquo;t need a build decision to be worth capturing —
        it just needs its own record. This is the idea stage of development
        logging, one step upstream of a bug or a metric: unscoped notes that
        may or may not ever become something real.
      </PageHeading>

      <ul className="mt-8 space-y-5">
        {LIGHTBULB_ENTRIES.map((entry) => (
          <li key={entry.slug} className="border-b border-foreground/10 pb-5">
            <h2 className="text-sm font-bold">
              <span className="text-accent">&gt;</span> {entry.title}
            </h2>
            <p className="mt-1 text-xs text-muted">Logged {entry.dateLogged}</p>
            <p className="mt-2 text-sm leading-relaxed">{entry.summary}</p>
            {entry.graduatedTo && (
              <p className="mt-2 text-sm">
                <Link href={entry.graduatedTo.href} className="text-accent hover:underline">
                  {entry.graduatedTo.label}
                </Link>
              </p>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}

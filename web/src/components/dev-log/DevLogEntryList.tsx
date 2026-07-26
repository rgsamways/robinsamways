"use client";

import Link from "next/link";
import { useState } from "react";
import type { CodeShowcaseEntry, Topic } from "./codeShowcase";
import { filterEntriesByTopic } from "./filterByTopic";
import Timestamp from "./Timestamp";
import TopicFilter, { ALL_TOPICS } from "./TopicFilter";

// Owns the topic-filter selection state — the hub page itself stays a
// Server Component; only the interactive pill bar + filtered list need to
// be client-rendered, matching SectionFilterBar's own split.
export default function DevLogEntryList({ entries }: { entries: CodeShowcaseEntry[] }) {
  const [selectedTopic, setSelectedTopic] = useState<Topic | typeof ALL_TOPICS>(ALL_TOPICS);
  const visibleEntries = filterEntriesByTopic(entries, selectedTopic);

  return (
    <>
      <TopicFilter selected={selectedTopic} onSelect={setSelectedTopic} />

      <ul className="mt-8 space-y-6">
        {visibleEntries.map((entry) => (
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
    </>
  );
}

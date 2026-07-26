import { TOPICS, type Topic } from "./codeShowcase";

// D2 (dev-log-topics): single-select, not multi-select — every entry has
// exactly one clear best-fit topic (confirmed while drafting the topic
// taxonomy), so this reuses the site's single-select active-pill pattern
// (one selection at a time, an "All" reset state) rather than the
// multi-select OR-logic pill filter Tech/Stacks uses for tags that can
// genuinely overlap.
export const ALL_TOPICS = "All" as const;

export default function TopicFilter({
  selected,
  onSelect,
}: {
  selected: Topic | typeof ALL_TOPICS;
  onSelect: (topic: Topic | typeof ALL_TOPICS) => void;
}) {
  const options: (Topic | typeof ALL_TOPICS)[] = [ALL_TOPICS, ...TOPICS];

  return (
    <div role="group" aria-label="filter by topic" className="mt-8 flex flex-wrap gap-2">
      {options.map((topic) => {
        const isActive = topic === selected;
        return (
          <button
            key={topic}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(topic)}
            className={
              isActive
                ? "cursor-pointer rounded-full border border-accent bg-accent px-4 py-1 text-xs font-semibold text-background"
                : "cursor-pointer rounded-full border border-foreground/20 px-4 py-1 text-xs font-semibold text-muted transition hover:border-accent hover:text-accent"
            }
          >
            {topic}
          </button>
        );
      })}
    </div>
  );
}

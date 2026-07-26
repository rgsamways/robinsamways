import { describe, expect, test } from "vitest";
import { filterEntriesByTopic } from "../filterByTopic";

type Entry = { slug: string; topic: "Engineering" | "Business Model" | "Human Factors" };

const ENTRIES: Entry[] = [
  { slug: "a", topic: "Engineering" },
  { slug: "b", topic: "Business Model" },
  { slug: "c", topic: "Engineering" },
];

describe("filterEntriesByTopic", () => {
  test("'All' shows every entry, regardless of topic", () => {
    expect(filterEntriesByTopic(ENTRIES, "All")).toEqual(ENTRIES);
  });

  test("selecting a topic shows only entries with that topic", () => {
    expect(filterEntriesByTopic(ENTRIES, "Engineering")).toEqual([ENTRIES[0], ENTRIES[2]]);
  });

  test("a topic with zero matching entries returns an empty result without erroring", () => {
    expect(filterEntriesByTopic(ENTRIES, "Human Factors")).toEqual([]);
  });
});

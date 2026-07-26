import type { Topic } from "./codeShowcase";

export function filterEntriesByTopic<T extends { topic: Topic }>(
  entries: T[],
  selectedTopic: Topic | "All"
): T[] {
  if (selectedTopic === "All") return entries;
  return entries.filter((entry) => entry.topic === selectedTopic);
}

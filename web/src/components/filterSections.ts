export function filterSections<T extends { id: string }>(
  sections: T[],
  activeIds: string[]
): T[] {
  if (activeIds.length === 0) return sections;
  return sections.filter((section) => activeIds.includes(section.id));
}

export function filterProjectsByTags<T extends { tags?: string[] }>(
  projects: T[],
  activeTags: string[]
): T[] {
  if (activeTags.length === 0) return projects;
  return projects.filter((project) => project.tags?.some((tag) => activeTags.includes(tag)));
}

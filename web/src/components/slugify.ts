// Shared with SectionHeader.tsx (which id's are generated with) and
// PageOutline.tsx conceptually — outline entries just read whatever id
// SectionHeader already assigned, rather than re-deriving slugs themselves.
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Pure — takes the registry of slugs already used on this page and mutates
// it with whatever id it resolves to, so a same-page collision gets a
// numeric suffix (`-2`, `-3`, ...) instead of two elements sharing one id.
export function resolveUniqueSlug(title: string, usedSlugs: Set<string>): string {
  const base = slugify(title);
  let candidate = base;
  let suffix = 2;
  while (usedSlugs.has(candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  usedSlugs.add(candidate);
  return candidate;
}

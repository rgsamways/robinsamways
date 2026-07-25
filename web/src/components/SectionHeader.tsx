import { cache } from "react";
import { resolveUniqueSlug } from "./slugify";

// `cache()` scopes this Set to a single Server Component render pass, so
// ids stay unique per page without leaking across requests or pages
// rendered later in the same process. Outside an actual RSC render (e.g. a
// client-component ancestor) it simply doesn't memoize — every call gets a
// fresh, empty Set, which degrades to "no collision detection" rather than
// throwing or leaking stale state; harmless since same-page collisions are
// a defensive edge case, not the common path.
const getUsedSlugsForThisPage = cache(() => new Set<string>());

export default function SectionHeader({ title }: { title: string }) {
  const id = resolveUniqueSlug(title, getUsedSlugsForThisPage());

  return (
    <div className="mb-4 mt-10 flex items-center gap-3">
      <h2 id={id} className="whitespace-nowrap text-sm font-bold tracking-wide">
        <span className="text-accent">##</span> {title}
      </h2>
      <hr className="flex-1 border-t border-accent" />
    </div>
  );
}

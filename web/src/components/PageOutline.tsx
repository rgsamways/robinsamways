"use client";

import { List } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Section = { id: string; title: string };

const MIN_SECTIONS_TO_SHOW = 2;

// D3: heading discovery is a client-side DOM scan, not a build-time or
// props-based registry — the outline's entries come from the exact same
// rendered `<h2 id>` elements `SectionHeader` already produces, so they can
// never drift out of sync with the page's real content.
function scanSections(): Section[] {
  return Array.from(document.querySelectorAll<HTMLHeadingElement>("main h2[id]")).map(
    (heading) => ({
      // `SectionHeader`'s own "##" decorative prefix is part of the
      // heading's visible text (`textContent` includes it) but reads as a
      // stray artifact once lifted into a standalone outline list.
      id: heading.id,
      title: (heading.textContent ?? "").replace(/^##\s*/, "").trim(),
    })
  );
}

export default function PageOutline() {
  const pathname = usePathname();
  const [sections, setSections] = useState<Section[]>([]);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Re-scan on mount and on every route change — a fresh page's headings
  // replace the previous page's entirely, and any open panel closes with it.
  useEffect(() => {
    setSections(scanSections());
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // D5: IntersectionObserver over the real heading elements, not manual
  // scroll-offset math. `intersecting` tracks every section currently in
  // view; the active entry is always the first of those in document order,
  // since IntersectionObserver's own callback order isn't guaranteed to
  // match page order.
  useEffect(() => {
    if (sections.length < MIN_SECTIONS_TO_SHOW) return;

    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => element !== null);
    if (elements.length === 0) return;

    const intersecting = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) intersecting.add(entry.target.id);
          else intersecting.delete(entry.target.id);
        }
        const firstVisible = sections.find((section) => intersecting.has(section.id));
        if (firstVisible) setActiveId(firstVisible.id);
      },
      { rootMargin: "0px 0px -80% 0px" }
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [sections]);

  // D2: a page with fewer than two sections has nothing worth outlining —
  // render nothing at all, not even a disabled trigger.
  if (sections.length < MIN_SECTIONS_TO_SHOW) return null;

  function handleSelect(id: string) {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="On this page"
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-skills-bg"
      >
        <List className="h-5 w-5" />
      </button>

      {/* Portalled to document.body: RightRail's own rail element carries a
          CSS transform (the mobile slide animation, forced on at xl+ too)
          unconditionally, and a transformed ancestor becomes the containing
          block for `position: fixed` descendants — so rendered in place,
          this panel's `fixed inset-0` would resolve against the rail's own
          box, not the viewport. `open` only ever flips true from the
          trigger's onClick, which can't fire before mount/hydration, so
          this never runs during the server-rendered pass — no `document`
          access before `document` exists. */}
      {open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="On this page"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          >
            <div
              onClick={(event) => event.stopPropagation()}
              className="relative flex max-h-full w-full max-w-sm flex-col overflow-auto border border-accent bg-background p-4"
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center text-lg text-accent hover:bg-accent hover:text-background"
              >
                ×
              </button>
              <p className="mb-3 pr-8 text-sm font-bold text-accent">On this page</p>
              <ul className="space-y-1 text-sm">
                {sections.map((section) => (
                  <li key={section.id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(section.id)}
                      aria-current={section.id === activeId ? "true" : undefined}
                      className={
                        section.id === activeId
                          ? "block w-full rounded-md px-2 py-1 text-left font-semibold text-accent"
                          : "block w-full rounded-md px-2 py-1 text-left text-muted transition hover:text-accent"
                      }
                    >
                      {section.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

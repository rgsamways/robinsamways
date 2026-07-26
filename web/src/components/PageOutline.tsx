"use client";

import { List } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  REDUCED_MOTION_STORAGE_KEY,
  resolveInitialReducedMotionPref,
  shouldReduceMotion,
} from "./reducedMotion";

type Section = { id: string; title: string };

const MIN_SECTIONS_TO_SHOW = 2;
// Matches globals.css's `.outline-target-glow` animation duration — the
// class comes off on this timer rather than `animationend`, since reduced
// motion drops the animation entirely (`animation: none` never fires that
// event) but still needs the highlight removed after the same interval.
const GLOW_DURATION_MS = 1400;

// D3 (page-outline-nav): heading discovery is a client-side DOM scan, not a
// build-time or props-based registry — the outline's entries come from the
// exact same rendered `<h2 id>` elements `SectionHeader` already produces,
// so they can never drift out of sync with the page's real content.
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

// D2 (mobile-chrome-redesign): a plain inline block now, not a click-to-open
// panel — no `createPortal`, no open/close state, no Escape listener.
// Visibility is CSS-only (`hidden xl:block`), matching every other
// responsive element on this site, dropped from mobile entirely.
export default function PageOutline() {
  const pathname = usePathname();
  const [sections, setSections] = useState<Section[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // While true, the observer below re-asserts "first visible" every time it
  // fires but must not act on it — a just-clicked selection is still
  // authoritative until its scroll settles. Without this, a click-triggered
  // smooth scroll to a section that can never satisfy the observer's own
  // rootMargin band gets silently overwritten mid-flight, back to whatever
  // the observer still considers visible.
  const suppressObserverRef = useRef(false);
  const suppressTimeoutRef = useRef<number | undefined>(undefined);
  const clearSuppressionRef = useRef<(() => void) | null>(null);

  // Tracks the currently-glowing heading so a rapid second click removes the
  // first click's highlight (and its pending timeout) before starting a new
  // one, rather than leaving a stale timer that clears the wrong element.
  const glowTimeoutRef = useRef<number | undefined>(undefined);
  const glowElementRef = useRef<HTMLElement | null>(null);

  // D3 (sync-page-outline-with-filters): the highest section count seen
  // during this page view, not the instantaneous count — once a page has
  // ever crossed MIN_SECTIONS_TO_SHOW it stays "eligible" for the rest of
  // the view, so filtering down to 1 still shows that 1 entry instead of
  // the outline disappearing and reappearing as pills toggle.
  const maxSectionsSeenRef = useRef(0);

  useEffect(() => {
    return () => {
      if (suppressTimeoutRef.current !== undefined) {
        window.clearTimeout(suppressTimeoutRef.current);
      }
      if (clearSuppressionRef.current) {
        window.removeEventListener("scrollend", clearSuppressionRef.current);
      }
      if (glowTimeoutRef.current !== undefined) {
        window.clearTimeout(glowTimeoutRef.current);
      }
    };
  }, []);

  // Re-scan on mount, on every route change, and whenever the page's own
  // rendered heading structure changes for any other reason (D1: a generic
  // MutationObserver on `main`, not a callback/context wired to whatever
  // in-page filter component caused the change — SectionFilterBar today,
  // anything else tomorrow, all get this for free). The observer is
  // recreated per pathname since `main`'s subtree is entirely new content
  // after navigation anyway.
  useEffect(() => {
    maxSectionsSeenRef.current = 0;

    function rescan() {
      const next = scanSections();
      if (next.length > maxSectionsSeenRef.current) {
        maxSectionsSeenRef.current = next.length;
      }
      setSections(next);
      // D4: a filtered-out active section resets to null rather than a
      // guessed replacement — the IntersectionObserver re-establishes a
      // real active section on the next scroll regardless.
      setActiveId((current) =>
        current !== null && !next.some((section) => section.id === current) ? null : current
      );
    }

    rescan();

    const container = document.querySelector("main");
    if (!container) return;

    // D2: a single pill toggle can remove/add several SectionHeader
    // subtrees in one React commit, which would otherwise deliver several
    // mutation records at once — debounce so one settled DOM batch produces
    // one re-scan.
    let debounceHandle: number | undefined;
    const observer = new MutationObserver(() => {
      if (debounceHandle !== undefined) window.clearTimeout(debounceHandle);
      debounceHandle = window.setTimeout(rescan, 50);
    });
    observer.observe(container, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      if (debounceHandle !== undefined) window.clearTimeout(debounceHandle);
    };
  }, [pathname]);

  // D5: IntersectionObserver over the real heading elements, not manual
  // scroll-offset math. `intersecting` tracks every section currently in
  // view; the active entry is always the first of those in document order,
  // since IntersectionObserver's own callback order isn't guaranteed to
  // match page order.
  useEffect(() => {
    if (maxSectionsSeenRef.current < MIN_SECTIONS_TO_SHOW) return;

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
        if (suppressObserverRef.current) return;
        const firstVisible = sections.find((section) => intersecting.has(section.id));
        if (firstVisible) setActiveId(firstVisible.id);
      },
      // Top trim matches globals.css's `scroll-margin-top` on `h2[id]`
      // (Header.tsx's sticky height) — without it, the "active" band would
      // still start at the literal viewport top, underneath where the
      // header now visually sits.
      { rootMargin: "-176px 0px -60% 0px" }
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [sections]);

  // D3: gated on the max ever seen this page view, not the instantaneous
  // count — a page that's crossed the threshold keeps its outline even when
  // filtering narrows it down to 1; a page that's never crossed it stays
  // hidden regardless of how many sections happen to be visible right now.
  if (maxSectionsSeenRef.current < MIN_SECTIONS_TO_SHOW) return null;

  function handleSelect(id: string) {
    // Don't wait on the IntersectionObserver to confirm this — a short
    // trailing section near the bottom of the page may never satisfy its
    // rootMargin band if the document can't scroll far enough to bring it
    // there, which would otherwise leave the previously active entry
    // highlighted after a click that clearly went elsewhere.
    setActiveId(id);

    // Suppress the observer until this click's own smooth scroll settles —
    // it keeps firing mid-scroll and would otherwise silently overwrite the
    // selection above with whatever it still considers "first visible."
    suppressObserverRef.current = true;
    if (suppressTimeoutRef.current !== undefined) {
      window.clearTimeout(suppressTimeoutRef.current);
    }
    // A second click before the first one's scroll settled would otherwise
    // leave the first click's listener attached — if it later fires it
    // would clear suppression for *this* click, since both closures share
    // the same ref. Remove it before installing the new one.
    if (clearSuppressionRef.current) {
      window.removeEventListener("scrollend", clearSuppressionRef.current);
    }

    const clearSuppression = () => {
      suppressObserverRef.current = false;
      window.removeEventListener("scrollend", clearSuppression);
      if (suppressTimeoutRef.current !== undefined) {
        window.clearTimeout(suppressTimeoutRef.current);
        suppressTimeoutRef.current = undefined;
      }
      clearSuppressionRef.current = null;
    };
    clearSuppressionRef.current = clearSuppression;

    window.addEventListener("scrollend", clearSuppression, { once: true });
    // Fallback for browsers without `scrollend` support — matches a
    // typical smooth-scroll's settle time, so suppression still lifts even
    // there.
    suppressTimeoutRef.current = window.setTimeout(clearSuppression, 1000);

    // Read fresh at the moment of the click rather than caching it in state
    // — this is the one animated behavior on the site that a plain CSS
    // class can't gate (an explicit `behavior` option here always overrides
    // CSS `scroll-behavior`), and a fresh read means a preference changed
    // on /settings takes effect on the very next click, with no separate
    // signaling needed between the two components.
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reducedMotionPref = resolveInitialReducedMotionPref(
      localStorage.getItem(REDUCED_MOTION_STORAGE_KEY)
    );
    const reduceMotion = shouldReduceMotion(reducedMotionPref, prefersReducedMotion);

    const target = document.getElementById(id);
    if (!target) return;

    // Glows the whole heading strip (## through the end of the solid line),
    // not just the heading text — SectionHeader.tsx's own wrapper, found via
    // its marker class rather than assumed DOM shape. Falls back to the
    // heading itself if that wrapper isn't there for some reason.
    const glowTarget = target.closest<HTMLElement>(".section-heading-row") ?? target;

    // A momentary highlight — real feedback even when the page is already
    // scrolled as far as it can go and a trailing section can't visibly move
    // any further. If the previous glow is still showing, clear it (and its
    // timeout) before starting a fresh one.
    if (glowTimeoutRef.current !== undefined) {
      window.clearTimeout(glowTimeoutRef.current);
      glowElementRef.current?.classList.remove("outline-target-glow");
    }
    glowTarget.classList.remove("outline-target-glow");
    void glowTarget.offsetWidth; // Force reflow so re-triggering the same element restarts the animation.
    glowTarget.classList.add("outline-target-glow");
    glowElementRef.current = glowTarget;
    glowTimeoutRef.current = window.setTimeout(() => {
      glowTarget.classList.remove("outline-target-glow");
      glowTimeoutRef.current = undefined;
      glowElementRef.current = null;
    }, GLOW_DURATION_MS);

    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  return (
    <nav aria-label="On this page" className="hidden xl:block">
      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted">
        <List className="h-3.5 w-3.5" />
        On this page
      </p>
      <ul className="space-y-1 text-sm">
        {sections.map((section) => (
          <li key={section.id}>
            {/* The left border is the "strip" — always present (subtle,
                muted) so every entry has one, brightened to the accent
                color only for the active entry. A fixed border-width on
                both states (color-only change) avoids any width jitter
                when the selection moves. */}
            <button
              type="button"
              onClick={() => handleSelect(section.id)}
              aria-current={section.id === activeId ? "true" : undefined}
              className={
                section.id === activeId
                  ? "block w-full cursor-pointer border-l-2 border-accent px-2 py-1 text-left font-semibold text-accent"
                  : "block w-full cursor-pointer border-l-2 border-foreground/20 px-2 py-1 text-left text-muted transition hover:border-accent/50 hover:text-accent"
              }
            >
              {section.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

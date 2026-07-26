"use client";

import { ChevronDown, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { capRecentEntries } from "./dev-log/capRecentEntries";
import { CODE_SHOWCASE_ENTRIES } from "./dev-log/codeShowcase";
import { useMobileNav } from "./MobileNavContext";
import { isExpanded, type NavGroup, type NavLink } from "./navTree";

const PROJECT_RECORD_CHILDREN = (base: string): NavLink[] => [
  { href: `${base}/build-plan`, label: "Build Plan" },
  { href: `${base}/feature-list`, label: "Feature List" },
  { href: `${base}/tech-stack`, label: "Tech Stack" },
  { href: `${base}/upgrade-path`, label: "Upgrade Path" },
  { href: `${base}/current-metrics`, label: "Current Metrics" },
  { href: `${base}/outlook`, label: "Outlook" },
  { href: `${base}/bug-list`, label: "Bug List" },
  { href: `${base}/testing-verification`, label: "Testing & Verification" },
  { href: `${base}/lightbulbs`, label: "Lightbulbs" },
  { href: `${base}/glossary`, label: "Glossary" },
];

// D3 (dev-log-topics): caps at the 5 most recent, plus a trailing "View
// All" link to /dev-log — Dev Log is an unbounded, growing stream, not a
// fixed page set like Farpost/Vocare/Sreditor's 10-item submenus.
const DEV_LOG_ENTRIES: NavLink[] = [
  ...capRecentEntries(
    [...CODE_SHOWCASE_ENTRIES].sort((a, b) => b.publishedAtUtc.localeCompare(a.publishedAtUtc))
  ).map((entry) => ({ href: `/dev-log/${entry.slug}`, label: entry.title })),
  { href: "/dev-log", label: "View All" },
];

const NAV_GROUPS: NavGroup[] = [
  {
    heading: "Site",
    links: [
      { href: "/", label: "Home" },
      { href: "/services", label: "Services" },
      { href: "/metrics", label: "Metrics" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Work",
    links: [
      { href: "/farpost", label: "Farpost", children: PROJECT_RECORD_CHILDREN("/farpost") },
      { href: "/vocare", label: "Vocare", children: PROJECT_RECORD_CHILDREN("/vocare") },
      { href: "/sreditor", label: "Sreditor", children: PROJECT_RECORD_CHILDREN("/sreditor") },
    ],
  },
  {
    heading: "Experiments",
    links: [
      {
        href: "/techstacks",
        label: "Experiments",
        children: [
          { href: "/techstacks/farpost-atlas", label: "Atlas" },
          { href: "/techstacks/farpost-dispatch", label: "Dispatch" },
          { href: "/techstacks/farpost-pulse", label: "Pulse" },
          { href: "/techstacks/credential-flow", label: "Credential Flow" },
        ],
      },
    ],
  },
  {
    heading: "Writing",
    links: [{ href: "/dev-log", label: "Dev Log", children: DEV_LOG_ENTRIES }],
  },
  {
    heading: "Ops",
    links: [{ href: "/ops/deploy", label: "Deploy Runbook" }],
  },
];

function NavItem({
  link,
  pathname,
  overrides,
  onToggle,
  onNavigate,
  depth,
}: {
  link: NavLink;
  pathname: string;
  overrides: Record<string, boolean>;
  onToggle: (href: string) => void;
  onNavigate: () => void;
  depth: number;
}) {
  const hasChildren = !!link.children?.length;
  const expanded = hasChildren && isExpanded(link, pathname, overrides);

  return (
    <li>
      <div className="flex items-center">
        <Link
          href={link.href}
          onClick={onNavigate}
          aria-current={pathname === link.href ? "page" : undefined}
          className="block flex-1 rounded px-2 py-1.5 text-sm hover:bg-skills-bg hover:text-accent"
        >
          {link.label}
        </Link>
        {hasChildren && (
          <button
            type="button"
            onClick={() => onToggle(link.href)}
            aria-expanded={expanded}
            aria-label={`${expanded ? "Collapse" : "Expand"} ${link.label}`}
            className="flex h-7 w-7 shrink-0 items-center justify-center text-muted hover:text-accent"
          >
            {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>

      {hasChildren && expanded && (
        <ul className="ml-3 border-l border-foreground/10 pl-2">
          {link.children!.map((child) => (
            <NavItem
              key={child.href}
              link={child}
              pathname={pathname}
              overrides={overrides}
              onToggle={onToggle}
              onNavigate={onNavigate}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function DrawerNav() {
  const { open, setOpen } = useMobileNav();
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  function toggleGroup(href: string) {
    setOverrides((current) => ({
      ...current,
      [href]: !isExpanded({ href, label: "" }, pathname, current),
    }));
  }

  return (
    <>
      {/* Full-width, pointer-events-none shell matching the content column's
          own box (mx-auto max-w-6xl + the same px-6 the content div uses) so
          this brand pill tracks the content's left edge instead of the
          viewport's, once the content column stops being a fixed width
          below xl. Only the actual link re-enables pointer events. The
          hamburger trigger now lives in RightRail's icon cluster (task 3),
          not here — this row is brand-pill-only. */}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-30 xl:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6">
          <Link
            href="/"
            aria-hidden="true"
            tabIndex={-1}
            className="pointer-events-auto flex h-9 items-center rounded-md border border-foreground/20 bg-background px-3 text-sm font-bold"
          >
            <span className="text-accent">$</span>&nbsp;Robin Samways
          </Link>
        </div>
      </div>

      {/* D5: full-viewport takeover, not a narrow slide-in drawer — no
          backdrop, since nothing else is visible behind an opaque
          full-viewport panel. Closes via Escape, the close button, or
          selecting a link; the shared `open` boolean comes from
          MobileNavContext since RightRail's icon cluster is what triggers
          it now (D1). */}
      <nav
        aria-label="Site"
        data-testid="mobile-nav-panel"
        className={`motion-safe-transition fixed inset-0 z-50 overflow-y-auto border-r border-foreground/20 bg-background px-5 py-6 transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } xl:sticky xl:top-0 xl:z-auto xl:h-screen xl:w-64 xl:translate-x-0 xl:shrink-0`}
      >
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold" onClick={() => setOpen(false)}>
            <span className="text-accent">$</span> Robin Samways
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-foreground/20 xl:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {NAV_GROUPS.map((group) => (
          <div key={group.heading} className="mb-5">
            <h2 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
              {group.heading}
            </h2>
            <ul>
              {group.links.map((link) => (
                <NavItem
                  key={link.href}
                  link={link}
                  pathname={pathname}
                  overrides={overrides}
                  onToggle={toggleGroup}
                  onNavigate={() => setOpen(false)}
                  depth={0}
                />
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </>
  );
}

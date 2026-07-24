"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./themed-scrollbar.module.css";

type NavLink = { href: string; label: string };
type NavGroup = { heading: string; links: NavLink[] };
type TocItem = { id: string; label: string };

// Mock reorganization of the site's current flat link list (Home, Farpost,
// Sreditor, Tech/Stacks, Dev Log, Services) into grouped sections, plus
// `ops/deploy` — a real route that exists today but isn't linked from the
// current hamburger menu — surfaced here as an example of a "new top-level."
const NAV_GROUPS: NavGroup[] = [
  {
    heading: "Site",
    links: [
      { href: "/", label: "Home" },
      { href: "/services", label: "Services" },
    ],
  },
  {
    heading: "Work",
    links: [
      { href: "/farpost", label: "Farpost" },
      { href: "/techstacks", label: "Tech/Stacks" },
    ],
  },
  {
    heading: "Writing",
    links: [
      { href: "/dev-log", label: "Dev Log" },
      { href: "/sreditor", label: "Sreditor" },
    ],
  },
  {
    heading: "Ops",
    links: [{ href: "/ops/deploy", label: "Deploy Runbook" }],
  },
];

export default function DrawerNav({ pageToc }: { pageToc?: TocItem[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
        aria-expanded={open}
        className="fixed left-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-md border border-foreground/20 bg-background text-lg lg:hidden"
      >
        ☰
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <nav
        aria-label="Site"
        className={`${styles.themedScroll} fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto border-r border-foreground/20 bg-background px-5 py-6 transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:w-64 lg:translate-x-0 lg:shrink-0`}
      >
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold" onClick={() => setOpen(false)}>
            <span className="text-accent">$</span> Robin Samways
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
            className="text-lg lg:hidden"
          >
            ✕
          </button>
        </div>

        {NAV_GROUPS.map((group) => (
          <div key={group.heading} className="mb-5">
            <h2 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
              {group.heading}
            </h2>
            <ul>
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded px-2 py-1.5 text-sm hover:bg-skills-bg hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {pageToc && pageToc.length > 0 && (
          <div className="mt-7 border-t border-foreground/20 pt-4">
            <h2 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
              On this page
            </h2>
            <ul>
              {pageToc.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    className="block rounded px-2 py-1.5 text-sm hover:bg-skills-bg hover:text-accent"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </>
  );
}

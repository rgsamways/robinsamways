"use client";

import Link from "next/link";
import { useState } from "react";

type HamburgerMenuLink = { href: string; label: string };

export default function HamburgerMenu({
  links,
  ariaLabel,
}: {
  links: HamburgerMenuLink[];
  ariaLabel: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={open ? `Close ${ariaLabel}` : `Open ${ariaLabel}`}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center text-xl leading-none"
      >
        {open ? "✕" : "☰"}
      </button>
      {open && (
        <nav className="absolute left-0 top-full z-10 mt-2 w-56 border border-foreground/20 bg-background shadow-md">
          <ul>
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 text-sm hover:bg-skills-bg"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}

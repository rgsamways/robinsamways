"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/farpost", label: "Farpost" },
  { href: "/dev-log", label: "Dev Log" },
];

export default function MenuToggle() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
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

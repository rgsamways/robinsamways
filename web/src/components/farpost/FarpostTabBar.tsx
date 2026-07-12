"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/farpost", label: "Origins" },
  { href: "/farpost/farpost-atlas", label: "Atlas" },
  { href: "/farpost/farpost-dispatch", label: "Dispatch" },
  { href: "/farpost/farpost-pulse", label: "Pulse" },
];

export default function FarpostTabBar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Farpost sections" className="mb-8 flex flex-wrap gap-2">
      {TABS.map((tab) => {
        const isActive =
          tab.href === "/farpost" ? pathname === "/farpost" : pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className={
              isActive
                ? "rounded-full border border-accent bg-accent px-4 py-1 text-xs font-semibold text-background"
                : "rounded-full border border-foreground/20 px-4 py-1 text-xs font-semibold text-muted transition hover:border-accent hover:text-accent"
            }
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

"use client";

import { LogIn, Settings, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import PageOutline from "./PageOutline";

// Mirrors DrawerNav.tsx's responsive drawer mechanism on the opposite edge.
// Nav icons only — the theme toggle relocated to /settings, and settings
// bootstrapping (applying every persisted preference on mount) lives in
// SettingsBootstrap, mounted separately in the root layout. See D2/D7 in
// site-settings-page/design.md.
export default function RightRail() {
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
      {/* Mirrors DrawerNav's shell so this group tracks the content
          column's right edge instead of the viewport's — same box, right
          edge instead of left. */}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-30 xl:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-end gap-4 px-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open display options"
            aria-expanded={open}
            className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-md border border-foreground/20 bg-background"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 xl:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        data-testid="nav-rail"
        // `motion-safe-transition` is the reduced-motion CSS hook (D4,
        // globals.css's `.reduce-motion` rule) — surgically scoped to this
        // one element rather than a blanket `*` override, since reduced
        // motion is only meant to gate this slide transition and
        // PageOutline's scroll, not incidental hover-color transitions
        // elsewhere on the site.
        className={`motion-safe-transition fixed inset-y-0 right-0 z-50 flex w-16 flex-col items-center gap-2 border-l border-foreground/20 bg-background py-6 transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        } xl:sticky xl:top-0 xl:z-auto xl:h-screen xl:w-16 xl:translate-x-0 xl:shrink-0`}
      >
        <Link
          href="/settings"
          aria-label="Site settings"
          className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-skills-bg"
        >
          <Settings className="h-5 w-5" />
        </Link>
        <Link
          href="/account"
          aria-label="Account"
          className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-skills-bg"
        >
          <User className="h-5 w-5" />
        </Link>
        <Link
          href="/sign-in"
          aria-label="Sign in"
          className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-skills-bg"
        >
          <LogIn className="h-5 w-5" />
        </Link>
        <PageOutline />
      </div>
    </>
  );
}

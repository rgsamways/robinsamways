"use client";

import { LogIn, Menu, Settings, User } from "lucide-react";
import Link from "next/link";
import { useMobileNav } from "./MobileNavContext";
import PageOutline from "./PageOutline";

// D4: both the Account and Sign In links always render — exactly one is
// ever visible at a time, toggled purely by CSS keyed off the
// `data-signed-in` attribute on <html> (see globals.css), not React state.
// RightRail mounts once at the root layout and never remounts on
// client-side navigation, so a state read on mount would go stale the
// instant a visitor signs in or out.
function AccountOrSignInLinks({ className }: { className: string }) {
  return (
    <>
      <Link href="/account" aria-label="Account" className={`signed-in-only ${className}`}>
        <User className="h-5 w-5" />
      </Link>
      <Link href="/sign-in" aria-label="Sign in" className={`signed-out-only ${className}`}>
        <LogIn className="h-5 w-5" />
      </Link>
    </>
  );
}

// Mirrors DrawerNav.tsx's responsive shell on the opposite edge. RightRail's
// own separate mobile trigger-and-slide-panel mechanism is retired (D1/D5 in
// mobile-chrome-redesign) — Account-or-Sign-In and Settings are now direct
// top-bar icons on mobile, and the menu icon opens DrawerNav's full-viewport
// nav via the shared MobileNavContext, nothing opens here anymore.
export default function RightRail() {
  const { setOpen } = useMobileNav();

  return (
    <>
      {/* Mirrors DrawerNav's shell so this cluster tracks the content
          column's right edge instead of the viewport's — same box, right
          edge instead of left. Order: Account-or-Sign-In, Menu, Settings. */}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-30 xl:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-end gap-2 px-6">
          <AccountOrSignInLinks className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-md border border-foreground/20 bg-background" />
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
            className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-md border border-foreground/20 bg-background"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link
            href="/settings"
            aria-label="Site settings"
            className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-md border border-foreground/20 bg-background"
          >
            <Settings className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* D3: widened to xl:w-64 (matching DrawerNav's own width), persistent
          on desktop, hidden entirely on mobile — its icons live in the top
          bar above instead. */}
      <div
        data-testid="right-rail"
        className="hidden xl:sticky xl:top-0 xl:z-auto xl:flex xl:h-screen xl:w-64 xl:shrink-0 xl:flex-col xl:gap-6 xl:border-l xl:border-foreground/20 xl:bg-background xl:px-5 xl:py-6"
      >
        <div className="flex items-center gap-2">
          <Link
            href="/settings"
            aria-label="Site settings"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-foreground/20 hover:bg-skills-bg"
          >
            <Settings className="h-5 w-5" />
          </Link>
          <AccountOrSignInLinks className="flex h-9 w-9 items-center justify-center rounded-md border border-foreground/20 hover:bg-skills-bg" />
        </div>

        <PageOutline />
      </div>
    </>
  );
}

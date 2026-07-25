"use client";

import { Lightbulb, LogIn, Settings, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import PageOutline from "./PageOutline";
import { resolveInitialTheme, THEME_STORAGE_KEY, type Theme } from "./theme";

// Mirrors DrawerNav.tsx's responsive drawer mechanism on the opposite edge.
// Ships with one control (the light/dark toggle, ported from the retired
// ThemeToggle.tsx without behavior changes) but uses the full drawer shell
// rather than a single floating button, so a second control fits later
// without restructuring this component.
export default function RightRail() {
  const [theme, setTheme] = useState<Theme>("light");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(resolveInitialTheme(stored, prefersDark));
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem(THEME_STORAGE_KEY, next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }

  const isLight = theme === "light";

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
        className={`fixed inset-y-0 right-0 z-50 flex w-16 flex-col items-center gap-2 border-l border-foreground/20 bg-background py-6 transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        } xl:sticky xl:top-0 xl:z-auto xl:h-screen xl:w-16 xl:translate-x-0 xl:shrink-0`}
      >
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
        <button
          type="button"
          aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
          aria-pressed={isLight}
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-skills-bg"
        >
          <Lightbulb className={isLight ? "h-5 w-5 text-accent" : "h-5 w-5 text-muted opacity-50"} />
        </button>
        <PageOutline />
      </div>
    </>
  );
}

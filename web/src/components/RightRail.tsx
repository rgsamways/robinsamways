"use client";

import { Lightbulb, Settings } from "lucide-react";
import { useEffect, useState } from "react";
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
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open display options"
        aria-expanded={open}
        className="fixed right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-md border border-foreground/20 bg-background xl:hidden"
      >
        <Settings className="h-5 w-5" />
      </button>

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
        <button
          type="button"
          aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
          aria-pressed={isLight}
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-skills-bg"
        >
          <Lightbulb className={isLight ? "h-5 w-5 text-accent" : "h-5 w-5 text-muted opacity-50"} />
        </button>
      </div>
    </>
  );
}

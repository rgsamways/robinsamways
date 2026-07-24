"use client";

import { Lightbulb, Palette } from "lucide-react";
import { useEffect, useState } from "react";
import ThemeMenu from "./ThemeMenu";
import { useMockTheme } from "./theme-context";
import styles from "./themed-scrollbar.module.css";

// Mirrors DrawerNav.tsx's exact responsive pattern (mobile trigger +
// backdrop + sliding drawer, sticky rail on desktop) but anchored right and
// icon-only, per Robin's ask: "display like the left navigation drawer in
// laptop view, and collapse as a drawer that can be opened in mobile view."
export default function RightRail() {
  const { mode, setMode } = useMockTheme();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isLight = mode === "light";

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
        aria-label="Open display options"
        aria-expanded={open}
        className="fixed right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-md border border-foreground/20 bg-background text-lg lg:hidden"
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

      <div
        className={`${styles.themedScroll} fixed inset-y-0 right-0 z-50 flex w-16 flex-col items-center gap-2 overflow-y-auto border-l border-foreground/20 bg-background py-6 transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        } lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:w-16 lg:translate-x-0 lg:shrink-0`}
      >
        <button
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label="Change theme"
          aria-expanded={menuOpen}
          aria-pressed={menuOpen}
          className={
            menuOpen
              ? "flex h-10 w-10 items-center justify-center rounded-md bg-accent text-background"
              : "flex h-10 w-10 items-center justify-center rounded-md text-muted hover:bg-skills-bg hover:text-accent"
          }
        >
          <Palette className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={() => setMode(isLight ? "dark" : "light")}
          aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
          aria-pressed={isLight}
          className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-skills-bg"
        >
          <Lightbulb className={isLight ? "h-5 w-5 text-accent" : "h-5 w-5 text-muted opacity-50"} />
        </button>
      </div>

      {menuOpen && <ThemeMenu onClose={() => setMenuOpen(false)} />}
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { resolveInitialTheme, THEME_STORAGE_KEY, type Theme } from "../theme";

// Relocated from RightRail.tsx — same `theme.ts` storage key and resolve
// function, just a different component renders the control (D2/D7).
export default function ThemeSetting() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(resolveInitialTheme(stored, prefersDark));
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem(THEME_STORAGE_KEY, next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }

  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={isLight}
      className="border border-accent px-4 py-2 text-sm font-semibold text-accent transition hover:bg-accent hover:text-background"
    >
      {isLight ? "Switch to dark mode" : "Switch to light mode"}
    </button>
  );
}

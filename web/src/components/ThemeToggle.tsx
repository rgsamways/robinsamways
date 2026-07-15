"use client";

import { Lightbulb } from "lucide-react";
import { useEffect, useState } from "react";
import { resolveInitialTheme, THEME_STORAGE_KEY, type Theme } from "./theme";

export default function ThemeToggle() {
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
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      aria-pressed={isLight}
      onClick={toggleTheme}
      className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center"
    >
      <Lightbulb
        className={isLight ? "h-5 w-5 text-accent" : "h-5 w-5 text-muted opacity-50"}
      />
    </button>
  );
}

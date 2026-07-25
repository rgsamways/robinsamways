"use client";

import { useEffect } from "react";
import { FONT_SCALE_STORAGE_KEY, fontScaleValue, resolveInitialFontScale } from "./fontScale";
import {
  REDUCED_MOTION_STORAGE_KEY,
  resolveInitialReducedMotionPref,
  shouldReduceMotion,
} from "./reducedMotion";
import { resolveInitialTheme, THEME_STORAGE_KEY } from "./theme";

// D2: the one place all three persisted settings get applied on mount, on
// every page — mounted once in the root layout, alongside DrawerNav/
// RightRail, rather than living inside a nav component. Theme is also
// applied by layout.tsx's own blocking inline `<Script>` (there specifically
// to avoid a flash on first paint) — reapplying it here is redundant but
// harmless; font-scale and reduced-motion have no such blocking-script
// equivalent, so a brief flash on first load is the same accepted trade-off
// theme's own mount-effect already had before that script existed.
export default function SettingsBootstrap() {
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = resolveInitialTheme(localStorage.getItem(THEME_STORAGE_KEY), prefersDark);
    document.documentElement.classList.toggle("dark", theme === "dark");

    const fontScale = resolveInitialFontScale(localStorage.getItem(FONT_SCALE_STORAGE_KEY));
    document.documentElement.style.setProperty("--font-scale", fontScaleValue(fontScale));

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reducedMotionPref = resolveInitialReducedMotionPref(
      localStorage.getItem(REDUCED_MOTION_STORAGE_KEY)
    );
    document.documentElement.classList.toggle(
      "reduce-motion",
      shouldReduceMotion(reducedMotionPref, prefersReducedMotion)
    );
  }, []);

  return null;
}

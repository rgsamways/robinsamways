"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { archivoBlack, inter, playfairDisplay, poppins, workSans } from "./fonts";
import { BODY_FONT, THEMES } from "./theme-catalog";
import {
  ThemeContext,
  type Mode,
  type Silo,
  type ThemeKey,
  type ThemeScope,
} from "./theme-context";
import styles from "./themed-scrollbar.module.css";

export default function ThemeToggleShell({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeKey>("current");
  const [mode, setMode] = useState<Mode>("light");
  const [scope, setScope] = useState<ThemeScope>("site");
  const [selectedSilos, setSelectedSilos] = useState<Silo[]>([]);
  const tokens = THEMES[theme][mode];

  const toggleSilo = (silo: Silo) => {
    setSelectedSilos((prev) =>
      prev.includes(silo) ? prev.filter((s) => s !== silo) : [...prev, silo],
    );
  };

  // CSS custom properties aren't part of @types/react's CSSProperties, so
  // this is built as a plain string record and cast at the JSX usage site.
  const style: Record<string, string> = {
    "--background": tokens.background,
    "--foreground": tokens.foreground,
    "--muted": tokens.muted,
    "--accent": tokens.accent,
    "--skills-bg": tokens.skillsBg,
    "--concept": tokens.concept,
    "--concept-dim": tokens.conceptDim,
    fontFamily: BODY_FONT[theme],
  };

  return (
    <ThemeContext.Provider
      value={{ theme, mode, scope, selectedSilos, setTheme, setMode, setScope, toggleSilo }}
    >
      <div
        style={style as CSSProperties}
        className={`${inter.variable} ${archivoBlack.variable} ${poppins.variable} ${playfairDisplay.variable} ${workSans.variable} ${styles.themedScroll} fixed inset-0 z-50 overflow-y-auto bg-background text-foreground`}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

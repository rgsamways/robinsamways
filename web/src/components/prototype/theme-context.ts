"use client";

import { createContext, useContext } from "react";

export type ThemeKey = "current" | "handoff" | "ads" | "vocare" | "farpost";
export type Mode = "light" | "dark";
export type ThemeScope = "site" | "silos";

// Robin's own in-progress projects (docs/lightbulbs/rsw-lb-project-silos.md)
// — used only for the theme menu's illustrative "apply to selected silos"
// checklist, since real silo pages don't exist yet in this mock.
export const SILOS = ["Farpost", "Vocare", "Sreditor"] as const;
export type Silo = (typeof SILOS)[number];

type ThemeControls = {
  theme: ThemeKey;
  mode: Mode;
  scope: ThemeScope;
  selectedSilos: Silo[];
  setTheme: (theme: ThemeKey) => void;
  setMode: (mode: Mode) => void;
  setScope: (scope: ThemeScope) => void;
  toggleSilo: (silo: Silo) => void;
};

export const ThemeContext = createContext<ThemeControls>({
  theme: "current",
  mode: "light",
  scope: "site",
  selectedSilos: [],
  setTheme: () => {},
  setMode: () => {},
  setScope: () => {},
  toggleSilo: () => {},
});

export function useMockTheme() {
  return useContext(ThemeContext);
}

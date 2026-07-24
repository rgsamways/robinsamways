import type { Mode, ThemeKey } from "./theme-context";

type ThemeTokens = {
  background: string;
  foreground: string;
  muted: string;
  accent: string;
  skillsBg: string;
  concept: string;
  conceptDim: string;
};

// Theme color/label/font data, kept separate from ThemeToggleShell.tsx so
// ThemeMenu.tsx can import it without creating a circular import back
// through the component that renders it (ThemeToggleShell -> RightRail ->
// ThemeMenu -> back to ThemeToggleShell would otherwise be a cycle).
//
// Colors apply to the same variable names globals.css already defines
// (--background, --foreground, --muted, --accent, --skills-bg) plus two new
// ones (--concept, --concept-dim) for a theme's second "judgment" accent.
// `current`'s two modes are the real site's actual light/dark tokens from
// globals.css. `handoff`'s light mode and all of `ads` are invented, since
// neither source had a light or a third variant to copy. `vocare` and
// `farpost` are close reads of real screenshots of those two projects
// (Robin's own, not external references) — farpost's dark mode is invented
// since no dark Farpost screens exist yet.
export const THEMES: Record<ThemeKey, Record<Mode, ThemeTokens>> = {
  current: {
    light: {
      background: "#ffffff",
      foreground: "#171717",
      muted: "#525252",
      accent: "#d97706",
      skillsBg: "#f5f5f4",
      concept: "#d97706",
      conceptDim: "#b45309",
    },
    dark: {
      background: "#0a0a0a",
      foreground: "#e5e5e5",
      muted: "#a1a1aa",
      accent: "#fbbf24",
      skillsBg: "#1c1917",
      concept: "#fbbf24",
      conceptDim: "#92400e",
    },
  },
  handoff: {
    dark: {
      background: "#12151a",
      foreground: "#dce1e8",
      muted: "#7d8794",
      accent: "#5fb4a2",
      skillsBg: "#181c22",
      concept: "#c98a3a",
      conceptDim: "#6b4d24",
    },
    light: {
      background: "#f5f9f8",
      foreground: "#182024",
      muted: "#5b6b70",
      accent: "#2f8f79",
      skillsBg: "#e6efec",
      concept: "#a5672a",
      conceptDim: "#d9b98c",
    },
  },
  ads: {
    dark: {
      background: "#170b21",
      foreground: "#f7edff",
      muted: "#b79ed1",
      accent: "#b34bf0",
      skillsBg: "#241030",
      concept: "#ff4d5e",
      conceptDim: "#7f1d1d",
    },
    light: {
      background: "#ffffff",
      foreground: "#1e1024",
      muted: "#6b5b7a",
      accent: "#7c3aed",
      skillsBg: "#f3e8ff",
      concept: "#dc2626",
      conceptDim: "#fecaca",
    },
  },
  vocare: {
    light: {
      background: "#f2ede3",
      foreground: "#3a3226",
      muted: "#7a6b53",
      accent: "#4f6d57",
      skillsBg: "#fbfaf7",
      concept: "#4f6d57",
      conceptDim: "#cddcc9",
    },
    dark: {
      background: "#141210",
      foreground: "#ede6d8",
      muted: "#a89a80",
      accent: "#86a893",
      skillsBg: "#211d17",
      concept: "#86a893",
      conceptDim: "#37453a",
    },
  },
  farpost: {
    light: {
      background: "#ffffff",
      foreground: "#16213a",
      muted: "#64748b",
      accent: "#f97316",
      skillsBg: "#eef1f6",
      concept: "#16a34a",
      conceptDim: "#86efac",
    },
    dark: {
      background: "#0b0f19",
      foreground: "#eef1f6",
      muted: "#94a3b8",
      accent: "#fb923c",
      skillsBg: "#151b29",
      concept: "#4ade80",
      conceptDim: "#14532d",
    },
  },
};

export const THEME_KEYS = Object.keys(THEMES) as ThemeKey[];

export const THEME_LABELS: Record<ThemeKey, string> = {
  current: "Current",
  handoff: "Handoff",
  ads: "Ad",
  vocare: "Vocare",
  farpost: "Farpost",
};

export const BODY_FONT: Record<ThemeKey, string> = {
  current: "var(--font-mono)",
  handoff: "var(--font-inter)",
  ads: "var(--font-ad-body)",
  vocare: "var(--font-vocare-body)",
  // Reuses Inter rather than a new font — Farpost's real typeface reads as a
  // plain modern grotesque sans close enough to Inter that a dedicated
  // Google Font import wouldn't buy much distinction.
  farpost: "var(--font-inter)",
};

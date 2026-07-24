"use client";

import { useEffect } from "react";
import { THEME_KEYS, THEME_LABELS, THEMES } from "./theme-catalog";
import { SILOS, useMockTheme } from "./theme-context";

export default function ThemeMenu({ onClose }: { onClose: () => void }) {
  const { theme, setTheme, scope, setScope, selectedSilos, toggleSilo } = useMockTheme();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <div className="fixed inset-0 z-[65]" onClick={onClose} aria-hidden="true" />

      <div
        role="dialog"
        aria-label="Change theme"
        style={{ fontFamily: "var(--font-mono)" }}
        className="fixed right-4 top-16 z-[70] w-72 rounded-md border border-foreground/20 bg-background p-4 text-xs shadow-lg lg:right-20 lg:top-6"
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="font-semibold text-foreground">Theme</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-muted hover:text-accent"
          >
            ✕
          </button>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-2">
          {THEME_KEYS.map((key) => {
            const swatch = THEMES[key].light;
            const active = theme === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setTheme(key)}
                aria-pressed={active}
                className={`flex flex-col items-center gap-1.5 rounded-md border p-2 ${
                  active ? "border-accent" : "border-foreground/15 hover:border-foreground/30"
                }`}
              >
                <span
                  aria-hidden
                  className="h-6 w-6 rounded-full border border-foreground/20"
                  style={{
                    background: `linear-gradient(135deg, ${swatch.background} 50%, ${swatch.accent} 50%)`,
                  }}
                />
                <span className="text-[0.65rem] font-semibold text-foreground">
                  {THEME_LABELS[key]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="border-t border-foreground/10 pt-3">
          <div className="mb-1.5 text-[0.65rem] font-semibold uppercase tracking-wider text-muted">
            Apply to
          </div>
          <div
            role="group"
            aria-label="Theme scope"
            className="flex gap-1 rounded-md border border-foreground/15 p-0.5"
          >
            {(["site", "silos"] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setScope(key)}
                aria-pressed={scope === key}
                className={
                  scope === key
                    ? "flex-1 rounded px-2 py-1 font-semibold bg-accent text-background"
                    : "flex-1 rounded px-2 py-1 font-semibold text-muted hover:text-accent"
                }
              >
                {key === "site" ? "Whole site" : "Selected silos"}
              </button>
            ))}
          </div>

          {scope === "silos" && (
            <div className="mt-2">
              <ul className="space-y-1">
                {SILOS.map((silo) => (
                  <li key={silo}>
                    <label className="flex items-center gap-2 rounded px-1 py-1 hover:bg-skills-bg">
                      <input
                        type="checkbox"
                        checked={selectedSilos.includes(silo)}
                        onChange={() => toggleSilo(silo)}
                      />
                      <span>{silo}</span>
                    </label>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[0.65rem] italic text-muted">
                Illustrative only — this mock is one page, so both scopes
                currently render the same content.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

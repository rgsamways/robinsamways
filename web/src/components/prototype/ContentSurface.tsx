"use client";

import type { ReactNode } from "react";
import { useMockTheme } from "./theme-context";

// vocare.ca's defining layout trait is a content card floating on a
// slightly different canvas color, not full-bleed content. Only the Vocare
// theme opts into that — every other theme renders children unwrapped, so
// this stays a no-op until that theme is active.
export default function ContentSurface({ children }: { children: ReactNode }) {
  const { theme } = useMockTheme();

  if (theme !== "vocare") {
    return <>{children}</>;
  }

  return (
    <div className="rounded-2xl border border-foreground/10 bg-skills-bg px-8 py-8 shadow-sm">
      {children}
    </div>
  );
}

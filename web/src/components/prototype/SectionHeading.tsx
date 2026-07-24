"use client";

import type { ReactNode } from "react";
import { useMockTheme } from "./theme-context";

export default function SectionHeading({
  children,
  icon,
}: {
  children: ReactNode;
  icon?: string;
}) {
  const { theme } = useMockTheme();

  if (theme === "farpost") {
    return (
      <h2 className="mb-4 text-2xl font-extrabold tracking-tight text-foreground">
        {children}
      </h2>
    );
  }

  if (theme === "vocare") {
    return (
      <h2
        style={{ fontFamily: "var(--font-vocare-heading)" }}
        className="mb-4 text-2xl italic text-foreground"
      >
        {children}
      </h2>
    );
  }

  if (theme === "ads") {
    return (
      <h2
        style={{ fontFamily: "var(--font-ad-heading)" }}
        className="mb-4 flex items-center gap-2 text-3xl uppercase tracking-tight text-accent"
      >
        {icon && <span>{icon}</span>}
        {children}
      </h2>
    );
  }

  if (theme === "handoff") {
    return (
      <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-foreground">
        {icon && <span className="text-accent">{icon}</span>}
        {children}
      </h2>
    );
  }

  return (
    <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-accent">
      {children}
    </h2>
  );
}

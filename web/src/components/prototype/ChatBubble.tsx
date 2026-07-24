import type { ReactNode } from "react";

// Vocare's core UI idiom (the /practice conversation view). Rides the same
// --accent/--skills-bg/--background/--foreground tokens every other
// component here uses — the same "solid accent chip" pattern PillBar.tsx
// already establishes on the real site (bg-accent + text-background) — so
// it recolors correctly under all four themes, not just Vocare.
export default function ChatBubble({
  from,
  children,
}: {
  from: "user" | "assistant";
  children: ReactNode;
}) {
  if (from === "user") {
    return (
      <div className="ml-auto mb-3 max-w-[85%] rounded-2xl bg-accent px-4 py-2.5 text-sm text-background">
        {children}
      </div>
    );
  }

  // A fixed bg-skills-bg would collide with ContentSurface's own
  // bg-skills-bg card in the Vocare theme (bubble == card == invisible), so
  // this uses a foreground-relative tint instead — reads as "one shade off
  // whatever surface it's sitting on" whether that surface is the bare page
  // background (other themes) or a skills-bg card (Vocare).
  return (
    <div className="mr-auto mb-3 max-w-[85%] rounded-2xl border border-foreground/10 bg-foreground/[0.06] px-4 py-2.5 text-sm">
      {children}
    </div>
  );
}

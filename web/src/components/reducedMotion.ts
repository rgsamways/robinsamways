export type ReducedMotionPref = "system" | "on" | "off";

export const REDUCED_MOTION_STORAGE_KEY = "reduced-motion";

// Resolves only the *stored* preference — mirrors theme.ts's own split
// between "what's stored" and "what's actually applied," which for theme is
// folded into one function since it only ever has one external input (OS
// preference). Reduced motion has two independent inputs (an explicit
// override vs. the OS query), so they stay separate functions.
export function resolveInitialReducedMotionPref(stored: string | null): ReducedMotionPref {
  if (stored === "on" || stored === "off") return stored;
  return "system";
}

// D4: "System" (the default) defers entirely to the OS query; an explicit
// override in either direction takes precedence over it.
export function shouldReduceMotion(pref: ReducedMotionPref, osPrefersReduced: boolean): boolean {
  if (pref === "on") return true;
  if (pref === "off") return false;
  return osPrefersReduced;
}

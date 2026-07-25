import { describe, expect, test } from "vitest";
import { resolveInitialReducedMotionPref, shouldReduceMotion } from "../reducedMotion";

describe("resolveInitialReducedMotionPref", () => {
  test("stored 'on' and 'off' round-trip as-is", () => {
    expect(resolveInitialReducedMotionPref("on")).toBe("on");
    expect(resolveInitialReducedMotionPref("off")).toBe("off");
  });

  test("no stored value resolves to system", () => {
    expect(resolveInitialReducedMotionPref(null)).toBe("system");
  });

  test("an unrecognized stored value resolves to system", () => {
    expect(resolveInitialReducedMotionPref("system")).toBe("system");
    expect(resolveInitialReducedMotionPref("reduce")).toBe("system");
    expect(resolveInitialReducedMotionPref("")).toBe("system");
  });
});

describe("shouldReduceMotion", () => {
  test("on: always reduces, regardless of OS preference", () => {
    expect(shouldReduceMotion("on", true)).toBe(true);
    expect(shouldReduceMotion("on", false)).toBe(true);
  });

  test("off: never reduces, regardless of OS preference", () => {
    expect(shouldReduceMotion("off", true)).toBe(false);
    expect(shouldReduceMotion("off", false)).toBe(false);
  });

  test("system: defers entirely to the OS preference", () => {
    expect(shouldReduceMotion("system", true)).toBe(true);
    expect(shouldReduceMotion("system", false)).toBe(false);
  });
});

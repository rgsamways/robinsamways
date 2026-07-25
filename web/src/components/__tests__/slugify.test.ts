import { describe, expect, test } from "vitest";
import { resolveUniqueSlug, slugify } from "../slugify";

describe("slugify", () => {
  test("lowercases and hyphenates spaces", () => {
    expect(slugify("Bug Log")).toBe("bug-log");
  });

  test("replaces punctuation and collapses runs of separators into one hyphen", () => {
    expect(slugify("Phase 1 — Port The Core")).toBe("phase-1-port-the-core");
  });

  test("trims leading and trailing separators", () => {
    expect(slugify("--Setup Gallery!!")).toBe("setup-gallery");
  });

  test("handles an ampersand", () => {
    expect(slugify("Testing & Verification")).toBe("testing-verification");
  });
});

describe("resolveUniqueSlug", () => {
  test("returns the plain slug the first time a title is seen", () => {
    const used = new Set<string>();
    expect(resolveUniqueSlug("Overview", used)).toBe("overview");
  });

  test("suffixes the second occurrence of an identical title", () => {
    const used = new Set<string>();
    resolveUniqueSlug("Overview", used);
    expect(resolveUniqueSlug("Overview", used)).toBe("overview-2");
  });

  test("suffixes the third occurrence with -3, not -2 again", () => {
    const used = new Set<string>();
    resolveUniqueSlug("Overview", used);
    resolveUniqueSlug("Overview", used);
    expect(resolveUniqueSlug("Overview", used)).toBe("overview-3");
  });

  test("titles that collide only after slugifying still get disambiguated", () => {
    const used = new Set<string>();
    expect(resolveUniqueSlug("Overview!", used)).toBe("overview");
    expect(resolveUniqueSlug("Overview?", used)).toBe("overview-2");
  });

  test("distinct titles never collide", () => {
    const used = new Set<string>();
    expect(resolveUniqueSlug("Overview", used)).toBe("overview");
    expect(resolveUniqueSlug("Build Plan", used)).toBe("build-plan");
  });
});

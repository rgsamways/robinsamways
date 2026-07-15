import { describe, expect, test } from "vitest";
import { resolveInitialTheme } from "../theme";

describe("resolveInitialTheme", () => {
  test("a valid stored 'dark' preference wins over prefersDark: false", () => {
    expect(resolveInitialTheme("dark", false)).toBe("dark");
  });

  test("a valid stored 'light' preference wins over prefersDark: true", () => {
    expect(resolveInitialTheme("light", true)).toBe("light");
  });

  test("no stored value + prefersDark: true falls back to dark", () => {
    expect(resolveInitialTheme(null, true)).toBe("dark");
  });

  test("no stored value + prefersDark: false falls back to light", () => {
    expect(resolveInitialTheme(null, false)).toBe("light");
  });

  test("an invalid/garbage stored value is ignored and falls back to system preference", () => {
    expect(resolveInitialTheme("banana", true)).toBe("dark");
    expect(resolveInitialTheme("banana", false)).toBe("light");
  });
});

import { describe, expect, test } from "vitest";
import { fontScaleValue, resolveInitialFontScale } from "../fontScale";

describe("resolveInitialFontScale", () => {
  test("a valid stored scale round-trips as-is", () => {
    expect(resolveInitialFontScale("small")).toBe("small");
    expect(resolveInitialFontScale("default")).toBe("default");
    expect(resolveInitialFontScale("large")).toBe("large");
    expect(resolveInitialFontScale("xlarge")).toBe("xlarge");
  });

  test("no stored value defaults to default", () => {
    expect(resolveInitialFontScale(null)).toBe("default");
  });

  test("an unrecognized stored value defaults to default", () => {
    expect(resolveInitialFontScale("huge")).toBe("default");
    expect(resolveInitialFontScale("")).toBe("default");
  });
});

describe("fontScaleValue", () => {
  test("returns the expected multiplier for every scale", () => {
    expect(fontScaleValue("small")).toBe("0.875");
    expect(fontScaleValue("default")).toBe("1");
    expect(fontScaleValue("large")).toBe("1.125");
    expect(fontScaleValue("xlarge")).toBe("1.25");
  });
});

import { describe, expect, test } from "vitest";
import { canSubmitFeedback } from "../feedback";

describe("canSubmitFeedback", () => {
  test("a reaction alone is enough", () => {
    expect(canSubmitFeedback("positive", "")).toBe(true);
  });

  test("a comment alone is enough", () => {
    expect(canSubmitFeedback(null, "great page")).toBe(true);
  });

  test("both a reaction and a comment is enough", () => {
    expect(canSubmitFeedback("negative", "needs work")).toBe(true);
  });

  test("neither is not enough", () => {
    expect(canSubmitFeedback(null, "")).toBe(false);
  });

  test("a whitespace-only comment doesn't count as a comment", () => {
    expect(canSubmitFeedback(null, "   ")).toBe(false);
  });
});

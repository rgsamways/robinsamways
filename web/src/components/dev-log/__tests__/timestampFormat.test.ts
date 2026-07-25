import { describe, expect, it } from "vitest";
import { formatEasternLabel, formatUtcLabel } from "../timestampFormat";

describe("formatUtcLabel", () => {
  it("renders an ISO UTC timestamp truncated to the minute with a Z suffix", () => {
    expect(formatUtcLabel("2026-07-15T13:00:00Z")).toBe("2026-07-15T13:00Z");
  });
});

describe("formatEasternLabel", () => {
  it("converts a summer UTC timestamp to EDT", () => {
    expect(formatEasternLabel("2026-07-15T13:00:00Z")).toBe("9:00 AM EDT");
  });

  it("converts a winter UTC timestamp to EST, handling the DST boundary automatically", () => {
    expect(formatEasternLabel("2026-01-15T13:00:00Z")).toBe("8:00 AM EST");
  });
});

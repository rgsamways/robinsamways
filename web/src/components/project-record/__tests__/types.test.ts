import { describe, expect, it } from "vitest";
import { parseProjectStatus } from "../types";

const VALID = {
  asOf: "2026-07-24",
  deploymentStatus: "Live.",
  summary: "A summary.",
  highlights: ["One highlight."],
  features: [{ name: "Thing", status: "shipped", note: "A note.", href: "/x" }],
};

describe("parseProjectStatus", () => {
  it("parses a well-formed status file", () => {
    const result = parseProjectStatus(VALID, "test.json");
    expect(result.features).toEqual([
      { name: "Thing", status: "shipped", note: "A note.", href: "/x" },
    ]);
  });

  it("throws on a missing required string field", () => {
    const { asOf, ...rest } = VALID;
    void asOf;
    expect(() => parseProjectStatus(rest, "test.json")).toThrow(/asOf/);
  });

  it("throws on an invalid feature status", () => {
    const invalid = { ...VALID, features: [{ name: "Thing", status: "in_progress" }] };
    expect(() => parseProjectStatus(invalid, "test.json")).toThrow(/invalid "status"/);
  });

  it("omits note/href when not provided rather than inserting nulls", () => {
    const minimal = { ...VALID, features: [{ name: "Thing", status: "planned" }] };
    const result = parseProjectStatus(minimal, "test.json");
    expect(result.features[0]).toEqual({ name: "Thing", status: "planned", note: undefined, href: undefined });
  });
});

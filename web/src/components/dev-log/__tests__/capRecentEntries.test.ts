import { describe, expect, test } from "vitest";
import { capRecentEntries } from "../capRecentEntries";

describe("capRecentEntries", () => {
  test("returns exactly the cap's worth of entries when more exist", () => {
    const entries = Array.from({ length: 8 }, (_, i) => i);
    expect(capRecentEntries(entries, 5)).toEqual([0, 1, 2, 3, 4]);
  });

  test("returns every entry, unchanged, when fewer than the cap exist", () => {
    const entries = [0, 1, 2];
    expect(capRecentEntries(entries, 5)).toEqual([0, 1, 2]);
  });

  test("returns an empty array when no entries exist", () => {
    expect(capRecentEntries([], 5)).toEqual([]);
  });

  test("defaults to a cap of 5 when none is given", () => {
    const entries = Array.from({ length: 10 }, (_, i) => i);
    expect(capRecentEntries(entries)).toHaveLength(5);
  });
});

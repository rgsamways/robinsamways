import { describe, expect, test } from "vitest";
import { parseMetricsSnapshots } from "../metrics";

function validSnapshotData(overrides: Record<string, unknown> = {}) {
  return [
    {
      date: "2026-07-10",
      change: "some-change",
      label: "after archiving some-change",
      files: 10,
      lines: 100,
      code: 90,
      complexity: 20,
      uloc: 60,
      drynessPercent: 67,
      note: "a note",
      ...overrides,
    },
  ];
}

describe("parseMetricsSnapshots", () => {
  test("parses a well-formed snapshot", () => {
    const result = parseMetricsSnapshots(validSnapshotData());
    expect(result).toEqual([
      {
        date: "2026-07-10",
        change: "some-change",
        label: "after archiving some-change",
        files: 10,
        lines: 100,
        code: 90,
        complexity: 20,
        uloc: 60,
        drynessPercent: 67,
        note: "a note",
      },
    ]);
  });

  test("falls back to the change name when label is missing", () => {
    const result = parseMetricsSnapshots(validSnapshotData({ label: undefined }));
    expect(result[0].label).toBe("some-change");
  });

  test("defaults note to an empty string when missing", () => {
    const result = parseMetricsSnapshots(validSnapshotData({ note: undefined }));
    expect(result[0].note).toBe("");
  });

  test("throws when the top-level value is not an array", () => {
    expect(() => parseMetricsSnapshots({ not: "an array" })).toThrow(
      "metrics.json must contain an array of snapshots"
    );
  });

  test("throws when a required numeric field is missing or wrong type", () => {
    expect(() => parseMetricsSnapshots(validSnapshotData({ code: "not a number" }))).toThrow(
      /non-numeric "code"/
    );
  });

  test("throws when date or change is missing", () => {
    expect(() => parseMetricsSnapshots(validSnapshotData({ date: undefined }))).toThrow(
      /missing "date" or "change"/
    );
  });

  test("parses multiple snapshots in order", () => {
    const data = [
      validSnapshotData({ change: "first" })[0],
      validSnapshotData({ change: "second" })[0],
    ];
    const result = parseMetricsSnapshots(data);
    expect(result.map((snapshot) => snapshot.change)).toEqual(["first", "second"]);
  });
});

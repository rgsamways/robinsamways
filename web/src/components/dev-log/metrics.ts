export type MetricsSnapshot = {
  date: string;
  change: string;
  label: string;
  files: number;
  lines: number;
  code: number;
  complexity: number;
  uloc: number;
  drynessPercent: number;
  note: string;
};

const REQUIRED_NUMERIC_FIELDS = [
  "files",
  "lines",
  "code",
  "complexity",
  "uloc",
  "drynessPercent",
] as const;

// Kept deliberately strict (throws rather than silently rendering a broken
// dashboard) since web/src/data/metrics.json is hand-edited alongside
// docs/metrics.md at every archive checkpoint — a malformed entry should fail
// the build, not ship a wrong chart. Takes already-parsed data (a bundler
// JSON import, not raw text) — see web/src/app/dev-log/page.tsx.
export function parseMetricsSnapshots(data: unknown): MetricsSnapshot[] {
  if (!Array.isArray(data)) {
    throw new Error("metrics.json must contain an array of snapshots");
  }

  return data.map((entry, index) => {
    if (typeof entry !== "object" || entry === null) {
      throw new Error(`metrics.json entry ${index} is not an object`);
    }
    const record = entry as Record<string, unknown>;

    if (typeof record.date !== "string" || typeof record.change !== "string") {
      throw new Error(`metrics.json entry ${index} is missing "date" or "change"`);
    }
    for (const field of REQUIRED_NUMERIC_FIELDS) {
      if (typeof record[field] !== "number") {
        throw new Error(`metrics.json entry ${index} ("${record.change}") has a non-numeric "${field}"`);
      }
    }

    return {
      date: record.date,
      change: record.change,
      label: typeof record.label === "string" ? record.label : record.change,
      files: record.files as number,
      lines: record.lines as number,
      code: record.code as number,
      complexity: record.complexity as number,
      uloc: record.uloc as number,
      drynessPercent: record.drynessPercent as number,
      note: typeof record.note === "string" ? record.note : "",
    };
  });
}

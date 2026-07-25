export type ProjectFeature = {
  name: string;
  status: "shipped" | "planned";
  note?: string;
  href?: string;
};

export type ProjectStatus = {
  asOf: string;
  deploymentStatus: string;
  summary: string;
  highlights: string[];
  features: ProjectFeature[];
};

// Kept deliberately strict (throws rather than silently rendering a broken
// page) since farpost-status.json/vocare-status.json are hand-edited data
// files, not generated — a malformed "status" value should fail the build,
// not silently render as neither shipped nor planned. Takes already-parsed
// data (a bundler JSON import, not raw text).
export function parseProjectStatus(data: unknown, fileLabel: string): ProjectStatus {
  if (typeof data !== "object" || data === null) {
    throw new Error(`${fileLabel} must be an object`);
  }
  const record = data as Record<string, unknown>;

  if (typeof record.asOf !== "string" || typeof record.deploymentStatus !== "string" || typeof record.summary !== "string") {
    throw new Error(`${fileLabel} is missing "asOf", "deploymentStatus", or "summary"`);
  }
  if (!Array.isArray(record.highlights) || !Array.isArray(record.features)) {
    throw new Error(`${fileLabel} is missing "highlights" or "features" arrays`);
  }

  const features: ProjectFeature[] = record.features.map((entry, index) => {
    if (typeof entry !== "object" || entry === null) {
      throw new Error(`${fileLabel} feature ${index} is not an object`);
    }
    const feature = entry as Record<string, unknown>;
    if (typeof feature.name !== "string") {
      throw new Error(`${fileLabel} feature ${index} is missing "name"`);
    }
    if (feature.status !== "shipped" && feature.status !== "planned") {
      throw new Error(`${fileLabel} feature ${index} ("${feature.name}") has an invalid "status"`);
    }
    return {
      name: feature.name,
      status: feature.status,
      note: typeof feature.note === "string" ? feature.note : undefined,
      href: typeof feature.href === "string" ? feature.href : undefined,
    };
  });

  return {
    asOf: record.asOf,
    deploymentStatus: record.deploymentStatus,
    summary: record.summary,
    highlights: record.highlights.filter((h): h is string => typeof h === "string"),
    features,
  };
}

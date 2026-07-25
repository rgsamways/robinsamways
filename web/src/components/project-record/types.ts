export type ProjectFeature = {
  name: string;
  status: "shipped" | "planned";
  note?: string;
  href?: string;
};

export type BugListEntry = {
  slug: string;
  title: string;
  date: string;
  theBug: string[];
  theFix: string[];
};

export type LightbulbEntry = {
  slug: string;
  title: string;
  summary: string;
  dateLogged: string;
  graduatedTo?: { label: string; href: string };
};

export type GlossaryTerm = {
  term: string;
  answer: string;
};

export type ProjectStatus = {
  asOf: string;
  deploymentStatus: string;
  summary: string;
  highlights: string[];
  features: ProjectFeature[];
  testingVerification: string[];
  bugList: BugListEntry[];
  lightbulbs: LightbulbEntry[];
  glossary: GlossaryTerm[];
};

// Kept deliberately strict (throws rather than silently rendering a broken
// page) since farpost-status.json/vocare-status.json/sreditor-status.json
// are hand-edited data files, not generated — a malformed value should fail
// the build, not silently render wrong. Takes already-parsed data (a
// bundler JSON import, not raw text).
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

  const testingVerification = Array.isArray(record.testingVerification)
    ? record.testingVerification.filter((p): p is string => typeof p === "string")
    : [];

  const bugList: BugListEntry[] = Array.isArray(record.bugList)
    ? record.bugList.map((entry, index) => {
        if (typeof entry !== "object" || entry === null) {
          throw new Error(`${fileLabel} bugList entry ${index} is not an object`);
        }
        const bug = entry as Record<string, unknown>;
        if (typeof bug.slug !== "string" || typeof bug.title !== "string" || typeof bug.date !== "string") {
          throw new Error(`${fileLabel} bugList entry ${index} is missing "slug", "title", or "date"`);
        }
        return {
          slug: bug.slug,
          title: bug.title,
          date: bug.date,
          theBug: Array.isArray(bug.theBug) ? bug.theBug.filter((p): p is string => typeof p === "string") : [],
          theFix: Array.isArray(bug.theFix) ? bug.theFix.filter((p): p is string => typeof p === "string") : [],
        };
      })
    : [];

  const lightbulbs: LightbulbEntry[] = Array.isArray(record.lightbulbs)
    ? record.lightbulbs.map((entry, index) => {
        if (typeof entry !== "object" || entry === null) {
          throw new Error(`${fileLabel} lightbulbs entry ${index} is not an object`);
        }
        const bulb = entry as Record<string, unknown>;
        if (
          typeof bulb.slug !== "string" ||
          typeof bulb.title !== "string" ||
          typeof bulb.summary !== "string" ||
          typeof bulb.dateLogged !== "string"
        ) {
          throw new Error(`${fileLabel} lightbulbs entry ${index} is missing a required field`);
        }
        const graduatedTo =
          typeof bulb.graduatedTo === "object" && bulb.graduatedTo !== null
            ? (bulb.graduatedTo as Record<string, unknown>)
            : undefined;
        return {
          slug: bulb.slug,
          title: bulb.title,
          summary: bulb.summary,
          dateLogged: bulb.dateLogged,
          graduatedTo:
            graduatedTo && typeof graduatedTo.label === "string" && typeof graduatedTo.href === "string"
              ? { label: graduatedTo.label, href: graduatedTo.href }
              : undefined,
        };
      })
    : [];

  const glossary: GlossaryTerm[] = Array.isArray(record.glossary)
    ? record.glossary.map((entry, index) => {
        if (typeof entry !== "object" || entry === null) {
          throw new Error(`${fileLabel} glossary entry ${index} is not an object`);
        }
        const term = entry as Record<string, unknown>;
        if (typeof term.term !== "string" || typeof term.answer !== "string") {
          throw new Error(`${fileLabel} glossary entry ${index} is missing "term" or "answer"`);
        }
        return { term: term.term, answer: term.answer };
      })
    : [];

  return {
    asOf: record.asOf,
    deploymentStatus: record.deploymentStatus,
    summary: record.summary,
    highlights: record.highlights.filter((h): h is string => typeof h === "string"),
    features,
    testingVerification,
    bugList,
    lightbulbs,
    glossary,
  };
}

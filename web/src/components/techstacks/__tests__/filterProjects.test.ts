import { describe, expect, test } from "vitest";
import { filterProjectsByTags } from "../filterProjects";

type Project = { slug: string; tags: string[] };

const PROJECTS: Project[] = [
  { slug: "credential-flow", tags: ["Salesforce", "OAuth 2.0", "Anthropic AI"] },
  { slug: "future-azure-piece", tags: ["Azure", "TypeScript"] },
];

describe("filterProjectsByTags", () => {
  test("empty selection shows all projects", () => {
    expect(filterProjectsByTags(PROJECTS, [])).toEqual(PROJECTS);
  });

  test("a single active tag filters to matching projects only", () => {
    expect(filterProjectsByTags(PROJECTS, ["Salesforce"])).toEqual([PROJECTS[0]]);
  });

  test("multiple active tags use OR logic, not AND", () => {
    const result = filterProjectsByTags(PROJECTS, ["Salesforce", "Azure"]);
    expect(result).toEqual(PROJECTS);
  });

  test("a tag with zero matching projects returns an empty result without erroring", () => {
    expect(filterProjectsByTags(PROJECTS, ["AWS"])).toEqual([]);
  });
});

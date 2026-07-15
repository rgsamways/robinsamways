import { describe, expect, test } from "vitest";
import { filterSections } from "../filterSections";

type Section = { id: string; label: string };

const SECTIONS: Section[] = [
  { id: "glossary", label: "Glossary" },
  { id: "testing", label: "Testing & Verification" },
  { id: "metrics", label: "Metrics" },
  { id: "bug-log", label: "Bug Log" },
  { id: "code-showcase", label: "Code Showcase" },
];

describe("filterSections", () => {
  test("no active pills shows all sections", () => {
    expect(filterSections(SECTIONS, [])).toEqual(SECTIONS);
  });

  test("one active pill isolates it", () => {
    expect(filterSections(SECTIONS, ["bug-log"])).toEqual([SECTIONS[3]]);
  });

  test("multiple active pills show the union, not an intersection", () => {
    const result = filterSections(SECTIONS, ["bug-log", "code-showcase"]);
    expect(result).toEqual([SECTIONS[3], SECTIONS[4]]);
  });

  test("deactivating every pill restores all sections", () => {
    const oneActive = filterSections(SECTIONS, ["metrics"]);
    expect(oneActive).toEqual([SECTIONS[2]]);
    expect(filterSections(SECTIONS, [])).toEqual(SECTIONS);
  });
});

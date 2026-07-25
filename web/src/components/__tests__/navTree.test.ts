import { describe, expect, it } from "vitest";
import { isExpanded, pathMatches } from "../navTree";

describe("pathMatches", () => {
  it("matches the href itself", () => {
    expect(pathMatches("/farpost", "/farpost")).toBe(true);
  });

  it("matches a nested route", () => {
    expect(pathMatches("/farpost", "/farpost/build-plan")).toBe(true);
  });

  it("does not match an unrelated route with the same prefix", () => {
    expect(pathMatches("/farpost", "/farpost-atlas-unrelated")).toBe(false);
  });

  it("does not match a sibling route", () => {
    expect(pathMatches("/farpost", "/vocare")).toBe(false);
  });
});

describe("isExpanded", () => {
  const link = { href: "/farpost", label: "Farpost", children: [] };

  it("defaults to expanded when the active route is under the group", () => {
    expect(isExpanded(link, "/farpost/build-plan", {})).toBe(true);
  });

  it("defaults to collapsed when the active route is elsewhere", () => {
    expect(isExpanded(link, "/vocare", {})).toBe(false);
  });

  it("a manual override collapses an otherwise-active group", () => {
    expect(isExpanded(link, "/farpost/build-plan", { "/farpost": false })).toBe(false);
  });

  it("a manual override expands an otherwise-inactive group", () => {
    expect(isExpanded(link, "/vocare", { "/farpost": true })).toBe(true);
  });

  it("auto-expands the Experiments group when a piece route is active", () => {
    const experimentsLink = { href: "/techstacks", label: "Experiments", children: [] };
    expect(isExpanded(experimentsLink, "/techstacks/farpost-atlas", {})).toBe(true);
  });

  it("auto-expands Sreditor's 10-page submenu when one of its pages is active", () => {
    const sreditorLink = { href: "/sreditor", label: "Sreditor", children: [] };
    expect(isExpanded(sreditorLink, "/sreditor/bug-list", {})).toBe(true);
  });
});

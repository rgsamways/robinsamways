import { test, expect } from "@playwright/test";

const SECTION_PILLS = [
  { label: "Origin Story", heading: "ORIGIN_STORY" },
  { label: "Problems It Solves", heading: "PROBLEMS_FARPOST_SOLVES" },
  { label: "Lifecycle Example", heading: "BUILDING_LIFECYCLE_EXAMPLE" },
  { label: "Process", heading: "PROCESS" },
];

test.describe("/farpost section filter pill bar", () => {
  test("renders all four pills and every section by default", async ({ page }) => {
    await page.goto("/farpost");

    const group = page.getByRole("group", { name: "filter farpost sections" });
    for (const { label } of SECTION_PILLS) {
      await expect(group.getByRole("button", { name: label })).toBeVisible();
    }
    for (const { heading } of SECTION_PILLS) {
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    }
  });

  test("activating one pill isolates its section", async ({ page }) => {
    await page.goto("/farpost");

    const group = page.getByRole("group", { name: "filter farpost sections" });
    await group.getByRole("button", { name: "Process" }).click();

    await expect(page.getByRole("heading", { name: "PROCESS" })).toBeVisible();
    for (const { heading } of SECTION_PILLS) {
      if (heading === "PROCESS") continue;
      await expect(page.getByRole("heading", { name: heading })).toHaveCount(0);
    }
  });

  test("clearing every active pill restores all four sections", async ({ page }) => {
    await page.goto("/farpost");

    const group = page.getByRole("group", { name: "filter farpost sections" });
    const processPill = group.getByRole("button", { name: "Process" });
    await processPill.click();
    await expect(page.getByRole("heading", { name: "ORIGIN_STORY" })).toHaveCount(0);

    await processPill.click();
    for (const { heading } of SECTION_PILLS) {
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    }
  });

  test("FarpostTabBar navigation pills stay above the heading, untouched", async ({ page }) => {
    await page.goto("/farpost");

    const originsPill = page.getByRole("link", { name: "Origins" });
    await expect(originsPill).toHaveAttribute("aria-current", "page");
    await expect(page.getByRole("heading", { name: "$ Farpost" })).toBeVisible();
  });
});

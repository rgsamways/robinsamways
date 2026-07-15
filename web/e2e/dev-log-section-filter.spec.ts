import { test, expect } from "@playwright/test";

const SECTION_PILLS = [
  { label: "Glossary", heading: "GLOSSARY" },
  { label: "Testing & Verification", heading: "TESTING_AND_VERIFICATION" },
  { label: "Metrics", heading: "METRICS" },
  { label: "Bug Log", heading: "BUG_LOG" },
  { label: "Code Showcase", heading: "CODE_SHOWCASE" },
];

test.describe("/dev-log section filter pill bar", () => {
  test("renders all five pills and every section by default", async ({ page }) => {
    await page.goto("/dev-log");

    const group = page.getByRole("group", { name: "filter dev log sections" });
    for (const { label } of SECTION_PILLS) {
      await expect(group.getByRole("button", { name: label })).toBeVisible();
    }
    for (const { heading } of SECTION_PILLS) {
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    }
  });

  test("activating one pill hides the other four sections", async ({ page }) => {
    await page.goto("/dev-log");

    const group = page.getByRole("group", { name: "filter dev log sections" });
    await group.getByRole("button", { name: "Code Showcase" }).click();

    await expect(page.getByRole("heading", { name: "CODE_SHOWCASE" })).toBeVisible();
    for (const { heading } of SECTION_PILLS) {
      if (heading === "CODE_SHOWCASE") continue;
      await expect(page.getByRole("heading", { name: heading })).toHaveCount(0);
    }
  });

  test("clearing every active pill shows all five sections again", async ({ page }) => {
    await page.goto("/dev-log");

    const group = page.getByRole("group", { name: "filter dev log sections" });
    const codeShowcasePill = group.getByRole("button", { name: "Code Showcase" });
    await codeShowcasePill.click();
    await expect(page.getByRole("heading", { name: "GLOSSARY" })).toHaveCount(0);

    await codeShowcasePill.click();
    for (const { heading } of SECTION_PILLS) {
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    }
  });
});

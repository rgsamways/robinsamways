import { test, expect } from "@playwright/test";

const SECTION_PILLS = [
  { label: "Web Sites", heading: "WEB_SITES" },
  { label: "Web Applications", heading: "WEB_APPLICATIONS" },
  { label: "Native Applications", heading: "NATIVE_APPLICATIONS" },
  { label: "Platform", heading: "PLATFORM" },
  { label: "Hourly", heading: "HOURLY" },
  { label: "Field Documentation", heading: "FIELD_DOCUMENTATION" },
];

test.describe("/services section filter pill bar", () => {
  test("renders all six pills and every section by default", async ({ page }) => {
    await page.goto("/services");

    const group = page.getByRole("group", { name: "filter services sections" });
    for (const { label } of SECTION_PILLS) {
      await expect(group.getByRole("button", { name: label })).toBeVisible();
    }
    for (const { heading } of SECTION_PILLS) {
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    }
  });

  test("activating one pill isolates its section", async ({ page }) => {
    await page.goto("/services");

    const group = page.getByRole("group", { name: "filter services sections" });
    await group.getByRole("button", { name: "Platform" }).click();

    await expect(page.getByRole("heading", { name: "PLATFORM" })).toBeVisible();
    for (const { heading } of SECTION_PILLS) {
      if (heading === "PLATFORM") continue;
      await expect(page.getByRole("heading", { name: heading })).toHaveCount(0);
    }
  });

  test("clearing every active pill restores all six sections", async ({ page }) => {
    await page.goto("/services");

    const group = page.getByRole("group", { name: "filter services sections" });
    const platformPill = group.getByRole("button", { name: "Platform" });
    await platformPill.click();
    await expect(page.getByRole("heading", { name: "WEB_SITES" })).toHaveCount(0);

    await platformPill.click();
    for (const { heading } of SECTION_PILLS) {
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    }
  });
});

import { test, expect } from "@playwright/test";

const TAGS = [
  "Salesforce",
  "OAuth 2.0",
  "Anthropic AI",
  "Azure",
  "Python",
  "TypeScript",
  "PostgreSQL",
  "AWS",
  "Geospatial",
  "Experience Cloud",
];

test.describe("/techstacks pill filter", () => {
  test("renders a pill for every tag and every project by default, including Atlas, Dispatch, and Pulse", async ({
    page,
  }) => {
    await page.goto("/techstacks");

    const group = page.getByRole("group", { name: "filter by tag" });
    for (const tag of TAGS) {
      await expect(group.getByRole("button", { name: tag, exact: true })).toBeVisible();
    }
    const main = page.locator("main");
    await expect(main.getByRole("link", { name: /Credential Flow/ })).toBeVisible();
    await expect(main.getByRole("link", { name: /Farpost Atlas/ })).toBeVisible();
    await expect(main.getByRole("link", { name: /Farpost Dispatch/ })).toBeVisible();
    await expect(main.getByRole("link", { name: /Farpost Pulse/ })).toBeVisible();
  });

  test("activating the Geospatial tag isolates Atlas", async ({ page }) => {
    await page.goto("/techstacks");

    const group = page.getByRole("group", { name: "filter by tag" });
    await group.getByRole("button", { name: "Geospatial", exact: true }).click();

    const main = page.locator("main");
    await expect(main.getByRole("link", { name: /Farpost Atlas/ })).toBeVisible();
    await expect(main.getByRole("link", { name: /Credential Flow/ })).toHaveCount(0);
  });

  test("activating a second tag shows the union, not the intersection", async ({ page }) => {
    await page.goto("/techstacks");

    const group = page.getByRole("group", { name: "filter by tag" });
    const main = page.locator("main");
    await group.getByRole("button", { name: "Geospatial", exact: true }).click();
    await expect(main.getByRole("link", { name: /Credential Flow/ })).toHaveCount(0);

    // Credential Flow has no "Geospatial" tag, so a union (not an
    // intersection) with "Salesforce" is the only way it reappears here.
    await group.getByRole("button", { name: "Salesforce", exact: true }).click();
    await expect(main.getByRole("link", { name: /Credential Flow/ })).toBeVisible();
  });

  test("clearing every active pill restores the full project list", async ({ page }) => {
    await page.goto("/techstacks");

    const group = page.getByRole("group", { name: "filter by tag" });
    const main = page.locator("main");
    const azurePill = group.getByRole("button", { name: "Azure", exact: true });
    await azurePill.click();
    await expect(main.getByRole("link", { name: /Credential Flow/ })).toHaveCount(0);

    await azurePill.click();
    await expect(main.getByRole("link", { name: /Credential Flow/ })).toBeVisible();
  });
});

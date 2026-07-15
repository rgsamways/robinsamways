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
];

test.describe("/techstacks pill filter", () => {
  test("renders a pill for every tag and every project by default", async ({ page }) => {
    await page.goto("/techstacks");

    const group = page.getByRole("group", { name: "filter by tag" });
    for (const tag of TAGS) {
      await expect(group.getByRole("button", { name: tag, exact: true })).toBeVisible();
    }
    await expect(page.getByRole("link", { name: /Credential Flow/ })).toBeVisible();
  });

  test("activating a tag with no matching projects hides the list", async ({ page }) => {
    await page.goto("/techstacks");

    const group = page.getByRole("group", { name: "filter by tag" });
    await group.getByRole("button", { name: "Azure", exact: true }).click();

    await expect(page.getByRole("link", { name: /Credential Flow/ })).toHaveCount(0);
  });

  test("activating a second tag shows the union, not the intersection", async ({ page }) => {
    await page.goto("/techstacks");

    const group = page.getByRole("group", { name: "filter by tag" });
    await group.getByRole("button", { name: "Azure", exact: true }).click();
    await expect(page.getByRole("link", { name: /Credential Flow/ })).toHaveCount(0);

    // Credential Flow has no "Azure" tag, so a union (not an intersection) with
    // "Salesforce" is the only way it reappears here.
    await group.getByRole("button", { name: "Salesforce", exact: true }).click();
    await expect(page.getByRole("link", { name: /Credential Flow/ })).toBeVisible();
  });

  test("clearing every active pill restores the full project list", async ({ page }) => {
    await page.goto("/techstacks");

    const group = page.getByRole("group", { name: "filter by tag" });
    const azurePill = group.getByRole("button", { name: "Azure", exact: true });
    await azurePill.click();
    await expect(page.getByRole("link", { name: /Credential Flow/ })).toHaveCount(0);

    await azurePill.click();
    await expect(page.getByRole("link", { name: /Credential Flow/ })).toBeVisible();
  });
});

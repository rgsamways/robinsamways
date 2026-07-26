import { test, expect } from "@playwright/test";

test.describe("/dev-log hub", () => {
  test("lists every entry directly, most recent first, with no Code Showcase grouping node", async ({ page }) => {
    await page.goto("/dev-log");

    const main = page.locator("main");
    await expect(
      main.getByRole("link", { name: "The Bug That Silently Ate 2,706 Records" })
    ).toBeVisible();
    await expect(
      main.getByRole("link", { name: "Cosmos DB rejected my seed script — and the fix wasn't in the error message" })
    ).toBeVisible();

    await expect(main.getByRole("heading", { name: "Code Showcase" })).toHaveCount(0);
    await expect(main.getByRole("link", { name: "Bug Log", exact: true })).toHaveCount(0);
    await expect(main.getByRole("link", { name: "Metrics", exact: true })).toHaveCount(0);
    await expect(main.getByRole("link", { name: "Testing & Verification", exact: true })).toHaveCount(0);
    await expect(main.getByRole("link", { name: "Glossary", exact: true })).toHaveCount(0);
    await expect(main.getByRole("link", { name: "Lightbulbs", exact: true })).toHaveCount(0);
  });

  test("an entry renders at its own flattened route with the full article shape", async ({ page }) => {
    await page.goto("/dev-log/silent-slug-collision");

    const main = page.locator("main");
    await expect(main.getByRole("heading", { name: "The Bug That Silently Ate 2,706 Records" })).toBeVisible();
    await expect(main.getByText("Data Ingestion")).toBeVisible();
    await expect(main.getByText("The fix", { exact: true })).toBeVisible();
    await expect(main.getByText("Why this matters", { exact: true })).toBeVisible();
  });

  test("a ported bug entry renders at its own flattened route", async ({ page }) => {
    await page.goto("/dev-log/cosmos-db-shared-throughput");

    const main = page.locator("main");
    await expect(
      main.getByRole("heading", { name: "Cosmos DB rejected my seed script — and the fix wasn't in the error message" })
    ).toBeVisible();
    await expect(main.getByText("Farpost Pulse · Infrastructure")).toBeVisible();
  });

  test("an unknown entry slug 404s", async ({ page }) => {
    const response = await page.goto("/dev-log/not-a-real-article");
    expect(response?.status()).toBe(404);
  });

  test("old Code Showcase URLs redirect permanently to the flattened route", async ({ page }) => {
    await page.goto("/dev-log/code-showcase/silent-slug-collision");
    await expect(page).toHaveURL("/dev-log/silent-slug-collision");
  });

  test("old Code Showcase hub URL redirects to the Dev Log hub", async ({ page }) => {
    await page.goto("/dev-log/code-showcase");
    await expect(page).toHaveURL("/dev-log");
  });

  for (const path of ["/dev-log/bug-log", "/dev-log/testing-verification", "/dev-log/glossary", "/dev-log/lightbulbs"]) {
    test(`old ${path} redirects to the Dev Log hub`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveURL("/dev-log");
    });
  }

  test("old /dev-log/metrics redirects to its new home under Site", async ({ page }) => {
    await page.goto("/dev-log/metrics");
    await expect(page).toHaveURL("/metrics");
  });
});

test.describe("/dev-log topic filter", () => {
  test("loads with 'All' selected, showing entries from more than one topic", async ({ page }) => {
    await page.goto("/dev-log");

    const group = page.getByRole("group", { name: "filter by topic" });
    await expect(group.getByRole("button", { name: "All", exact: true })).toHaveAttribute(
      "aria-pressed",
      "true"
    );

    const main = page.locator("main");
    await expect(
      main.getByRole("link", { name: "The Bug That Silently Ate 2,706 Records" })
    ).toBeVisible();
    await expect(
      main.getByRole("link", { name: "What a Timed AI Interview Actually Measures" })
    ).toBeVisible();
  });

  test("selecting a topic shows only its entries", async ({ page }) => {
    await page.goto("/dev-log");

    const group = page.getByRole("group", { name: "filter by topic" });
    await group.getByRole("button", { name: "Human Factors", exact: true }).click();

    const main = page.locator("main");
    await expect(
      main.getByRole("link", { name: "What a Timed AI Interview Actually Measures" })
    ).toBeVisible();
    await expect(
      main.getByRole("link", { name: "The Bug That Silently Ate 2,706 Records" })
    ).toHaveCount(0);
  });

  test("selecting All after a topic restores the full list", async ({ page }) => {
    await page.goto("/dev-log");

    const group = page.getByRole("group", { name: "filter by topic" });
    await group.getByRole("button", { name: "Human Factors", exact: true }).click();
    const main = page.locator("main");
    await expect(
      main.getByRole("link", { name: "The Bug That Silently Ate 2,706 Records" })
    ).toHaveCount(0);

    await group.getByRole("button", { name: "All", exact: true }).click();
    await expect(
      main.getByRole("link", { name: "The Bug That Silently Ate 2,706 Records" })
    ).toBeVisible();
  });
});

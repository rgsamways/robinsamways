import { test, expect } from "@playwright/test";

const DEV_LOG_PAGES = [
  { label: "Bug Log", path: "/dev-log/bug-log", heading: "BUG_LOG" },
  { label: "Metrics", path: "/dev-log/metrics", heading: "METRICS" },
  { label: "Testing & Verification", path: "/dev-log/testing-verification", heading: "TESTING_AND_VERIFICATION" },
  { label: "Glossary", path: "/dev-log/glossary", heading: "GLOSSARY" },
  { label: "Code Showcase", path: "/dev-log/code-showcase" },
  { label: "Lightbulbs", path: "/dev-log/lightbulbs" },
];

test.describe("/dev-log hub", () => {
  test("links to all six sub-pages, in order, with no topic content rendered inline", async ({ page }) => {
    await page.goto("/dev-log");

    const main = page.locator("main");
    const links = main.locator("a");
    for (const { label } of DEV_LOG_PAGES) {
      await expect(main.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
    await expect(links.nth(0)).toHaveText("Bug Log");
    await expect(links.nth(5)).toHaveText("Lightbulbs");

    await expect(main.getByRole("heading", { name: "BUG_LOG" })).toHaveCount(0);
    await expect(main.getByRole("heading", { name: "GLOSSARY" })).toHaveCount(0);
  });

  for (const { label, path, heading } of DEV_LOG_PAGES.filter((p) => p.heading)) {
    test(`${label} renders at its own route`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("main").getByRole("heading", { name: heading!, level: 2 })).toBeVisible();
    });
  }
});

test.describe("Glossary framing", () => {
  test("introduces the list as a communication-skill demonstration, not a bare dictionary", async ({ page }) => {
    await page.goto("/dev-log/glossary");

    await expect(page.getByText(/translating a technical decision/i)).toBeVisible();
  });
});

test.describe("Code Showcase", () => {
  test("index lists articles with a title, teaser, and UTC/Eastern timestamp", async ({ page }) => {
    await page.goto("/dev-log/code-showcase");

    const main = page.locator("main");
    const firstArticleLink = main.getByRole("link", { name: "The Bug That Silently Ate 2,706 Records" });
    await expect(firstArticleLink).toBeVisible();
    await expect(main.getByText("A batch-loading race condition")).toBeVisible();
    await expect(main.getByText(/2026-07-15T13:00Z/)).toBeVisible();
  });

  test("an article page renders the full kicker/title/framing/code/fix/why-it-matters shape", async ({ page }) => {
    await page.goto("/dev-log/code-showcase/silent-slug-collision");

    const main = page.locator("main");
    await expect(main.getByRole("heading", { name: "The Bug That Silently Ate 2,706 Records" })).toBeVisible();
    await expect(main.getByText("Data Ingestion")).toBeVisible();
    await expect(main.getByText("The fix", { exact: true })).toBeVisible();
    await expect(main.getByText("Why this matters", { exact: true })).toBeVisible();
  });

  test("an unknown article slug 404s", async ({ page }) => {
    const response = await page.goto("/dev-log/code-showcase/not-a-real-article");
    expect(response?.status()).toBe(404);
  });
});

test.describe("Lightbulbs", () => {
  test("lists ideas from docs/lightbulbs, and a graduated idea links to its outcome", async ({ page }) => {
    await page.goto("/dev-log/lightbulbs");

    const main = page.locator("main");
    await expect(main.getByRole("heading", { name: "Farpost's Real Origin Story" })).toBeVisible();
    await expect(main.getByRole("link", { name: "See it live on the Farpost page" })).toHaveAttribute(
      "href",
      "/farpost"
    );
  });
});

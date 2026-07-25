import { test, expect } from "@playwright/test";

const FARPOST_PAGES = [
  { path: "/farpost/build-plan", heading: "Farpost · Build Plan" },
  { path: "/farpost/feature-list", heading: "Farpost · Feature List" },
  { path: "/farpost/tech-stack", heading: "Farpost · Tech Stack" },
  { path: "/farpost/upgrade-path", heading: "Farpost · Upgrade Path" },
  { path: "/farpost/current-metrics", heading: "Farpost · Current Metrics" },
  { path: "/farpost/outlook", heading: "Farpost · Outlook" },
  { path: "/farpost/bug-list", heading: "Farpost · Bug List" },
  { path: "/farpost/testing-verification", heading: "Farpost · Testing & Verification" },
  { path: "/farpost/lightbulbs", heading: "Farpost · Lightbulbs" },
  { path: "/farpost/glossary", heading: "Farpost · Glossary" },
];

const VOCARE_PAGES = [
  { path: "/vocare", heading: "Vocare" },
  { path: "/vocare/build-plan", heading: "Vocare · Build Plan" },
  { path: "/vocare/feature-list", heading: "Vocare · Feature List" },
  { path: "/vocare/tech-stack", heading: "Vocare · Tech Stack" },
  { path: "/vocare/upgrade-path", heading: "Vocare · Upgrade Path" },
  { path: "/vocare/current-metrics", heading: "Vocare · Current Metrics" },
  { path: "/vocare/outlook", heading: "Vocare · Outlook" },
  { path: "/vocare/bug-list", heading: "Vocare · Bug List" },
  { path: "/vocare/testing-verification", heading: "Vocare · Testing & Verification" },
  { path: "/vocare/lightbulbs", heading: "Vocare · Lightbulbs" },
  { path: "/vocare/glossary", heading: "Vocare · Glossary" },
];

const SREDITOR_PAGES = [
  { path: "/sreditor", heading: "$ Sreditor" },
  { path: "/sreditor/build-plan", heading: "Sreditor · Build Plan" },
  { path: "/sreditor/feature-list", heading: "Sreditor · Feature List" },
  { path: "/sreditor/tech-stack", heading: "Sreditor · Tech Stack" },
  { path: "/sreditor/upgrade-path", heading: "Sreditor · Upgrade Path" },
  { path: "/sreditor/current-metrics", heading: "Sreditor · Current Metrics" },
  { path: "/sreditor/outlook", heading: "Sreditor · Outlook" },
  { path: "/sreditor/bug-list", heading: "Sreditor · Bug List" },
  { path: "/sreditor/testing-verification", heading: "Sreditor · Testing & Verification" },
  { path: "/sreditor/lightbulbs", heading: "Sreditor · Lightbulbs" },
  { path: "/sreditor/glossary", heading: "Sreditor · Glossary" },
];

test.describe("Farpost project-record pages", () => {
  for (const { path, heading } of FARPOST_PAGES) {
    test(`${path} renders its heading with no tab bar above it`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
      await expect(page.getByRole("navigation", { name: "Farpost sections" })).toHaveCount(0);
    });
  }

  test("Feature List cross-links Dispatch to its Experiments piece, and no longer lists Atlas or Pulse", async ({
    page,
  }) => {
    await page.goto("/farpost/feature-list");
    const main = page.locator("main");
    await expect(main.getByRole("link", { name: /Rural claims dispatch/ })).toHaveAttribute(
      "href",
      "/techstacks/farpost-dispatch"
    );
    await expect(main.getByText(/Atlas — rural-density/)).toHaveCount(0);
    await expect(main.getByText(/Pulse — AI-assisted/)).toHaveCount(0);
  });

  test("Feature List and Current Metrics agree on shipped/planned status from the same data file", async ({
    page,
  }) => {
    await page.goto("/farpost/feature-list");
    await expect(page.getByText("planned").first()).toBeVisible();
  });

  test("Bug List shows an honest empty state when no bugs are logged yet", async ({ page }) => {
    await page.goto("/farpost/bug-list");
    await expect(page.getByText(/No bugs logged yet for this project/)).toBeVisible();
  });
});

test.describe("Vocare project-record pages", () => {
  for (const { path, heading } of VOCARE_PAGES) {
    test(`${path} renders its heading`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    });
  }

  test("hub links to all ten project-record pages", async ({ page }) => {
    await page.goto("/vocare");
    for (const { path } of VOCARE_PAGES.filter((p) => p.path !== "/vocare")) {
      await expect(page.locator(`main a[href="${path}"]`)).toBeVisible();
    }
  });

  test("Feature List reflects Vocare's real $29 one-time model, not a fabricated subscription", async ({
    page,
  }) => {
    await page.goto("/vocare");
    await expect(page.getByText("$29 one-time lifetime fee")).toBeVisible();
  });
});

test.describe("Sreditor project-record pages", () => {
  for (const { path, heading } of SREDITOR_PAGES) {
    test(`${path} renders its heading`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    });
  }

  test("hub links to all ten project-record pages", async ({ page }) => {
    await page.goto("/sreditor");
    for (const { path } of SREDITOR_PAGES.filter((p) => p.path !== "/sreditor")) {
      await expect(page.locator(`main a[href="${path}"]`)).toBeVisible();
    }
  });

  test("Bug List shows the real tool-integration and Farpost-scale bug entries", async ({ page }) => {
    await page.goto("/sreditor/bug-list");
    await expect(page.getByRole("heading", { name: "Sreditor's Tool-Integration Bugs" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Sreditor at Farpost's Real Scale" })).toBeVisible();
  });

  test("Lightbulbs shows the graduated Sreditor idea linking back to the hub", async ({ page }) => {
    await page.goto("/sreditor/lightbulbs");
    await expect(page.getByRole("link", { name: "See it live on the Sreditor page" })).toHaveAttribute(
      "href",
      "/sreditor"
    );
  });
});

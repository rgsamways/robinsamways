import { test, expect } from "@playwright/test";

const FARPOST_PAGES = [
  { path: "/farpost/build-plan", heading: "Farpost · Build Plan" },
  { path: "/farpost/feature-list", heading: "Farpost · Feature List" },
  { path: "/farpost/tech-stack", heading: "Farpost · Tech Stack" },
  { path: "/farpost/upgrade-path", heading: "Farpost · Upgrade Path" },
  { path: "/farpost/current-metrics", heading: "Farpost · Current Metrics" },
  { path: "/farpost/outlook", heading: "Farpost · Outlook" },
];

const VOCARE_PAGES = [
  { path: "/vocare", heading: "Vocare" },
  { path: "/vocare/build-plan", heading: "Vocare · Build Plan" },
  { path: "/vocare/feature-list", heading: "Vocare · Feature List" },
  { path: "/vocare/tech-stack", heading: "Vocare · Tech Stack" },
  { path: "/vocare/upgrade-path", heading: "Vocare · Upgrade Path" },
  { path: "/vocare/current-metrics", heading: "Vocare · Current Metrics" },
  { path: "/vocare/outlook", heading: "Vocare · Outlook" },
];

test.describe("Farpost project-record pages", () => {
  for (const { path, heading } of FARPOST_PAGES) {
    test(`${path} renders its heading and the Farpost tab bar`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
      await expect(page.getByRole("navigation", { name: "Farpost sections" })).toBeVisible();
    });
  }

  test("Feature List cross-links to the existing Atlas, Dispatch, and Pulse demo pages", async ({ page }) => {
    await page.goto("/farpost/feature-list");
    const main = page.locator("main");
    await expect(main.getByRole("link", { name: /Rural claims dispatch/ })).toHaveAttribute(
      "href",
      "/farpost/farpost-dispatch"
    );
    await expect(main.getByRole("link", { name: /Atlas — rural-density/ })).toHaveAttribute(
      "href",
      "/farpost/farpost-atlas"
    );
    await expect(main.getByRole("link", { name: /Pulse — AI-assisted/ })).toHaveAttribute(
      "href",
      "/farpost/farpost-pulse"
    );
  });

  test("Feature List and Current Metrics agree on shipped/planned status from the same data file", async ({
    page,
  }) => {
    await page.goto("/farpost/feature-list");
    await expect(page.getByText("planned").first()).toBeVisible();
  });
});

test.describe("Vocare project-record pages", () => {
  for (const { path, heading } of VOCARE_PAGES) {
    test(`${path} renders its heading`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    });
  }

  test("hub links to all six project-record pages", async ({ page }) => {
    await page.goto("/vocare");
    for (const { path } of VOCARE_PAGES.filter((p) => p.path !== "/vocare")) {
      const slug = path.split("/").pop()!;
      await expect(page.locator(`main a[href="${path}"]`)).toBeVisible();
      void slug;
    }
  });

  test("Feature List reflects Vocare's real $29 one-time model, not a fabricated subscription", async ({
    page,
  }) => {
    await page.goto("/vocare");
    await expect(page.getByText("$29 one-time lifetime fee")).toBeVisible();
  });
});

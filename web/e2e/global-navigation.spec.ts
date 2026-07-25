import { test, expect } from "@playwright/test";

const TOP_LEVEL_LINKS: { label: string; path: string }[] = [
  { label: "Farpost", path: "/farpost" },
  { label: "Vocare", path: "/vocare" },
  { label: "Experiments", path: "/techstacks" },
  { label: "Dev Log", path: "/dev-log" },
  { label: "Sreditor", path: "/sreditor" },
  { label: "Services", path: "/services" },
];

test.describe("global navigation drawer", () => {
  test("shows every top-level destination without needing a toggle on desktop", async ({ page }) => {
    await page.goto("/");

    const nav = page.getByRole("navigation", { name: "Site" });
    await expect(nav.getByRole("link", { name: "Home" })).toBeVisible();
    for (const { label } of TOP_LEVEL_LINKS) {
      await expect(nav.getByRole("link", { name: label, exact: true })).toBeVisible();
    }

    await expect(page.getByRole("button", { name: "Open navigation" })).toBeHidden();
  });

  for (const { label, path } of TOP_LEVEL_LINKS) {
    test(`navigates to ${label}`, async ({ page }) => {
      await page.goto("/");
      await page
        .getByRole("navigation", { name: "Site" })
        .getByRole("link", { name: label, exact: true })
        .click();

      await expect(page).toHaveURL(path);
    });
  }

  test("navigating away and back to Home works", async ({ page }) => {
    await page.goto("/farpost");
    await page.getByRole("navigation", { name: "Site" }).getByRole("link", { name: "Home" }).click();

    await expect(page).toHaveURL("/");
  });
});

test.describe("collapsible nav groups", () => {
  test("a group auto-expands when the active route is one of its children", async ({ page }) => {
    await page.goto("/farpost/build-plan");

    const nav = page.getByRole("navigation", { name: "Site" });
    await expect(nav.getByRole("button", { name: "Collapse Farpost" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Build Plan" })).toBeVisible();
  });

  test("a group stays collapsed by default on an unrelated page", async ({ page }) => {
    await page.goto("/");

    const nav = page.getByRole("navigation", { name: "Site" });
    await expect(nav.getByRole("button", { name: "Expand Farpost" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Build Plan" })).toBeHidden();
  });

  test("a collapsed group can be expanded manually without navigating away", async ({ page }) => {
    await page.goto("/");

    const nav = page.getByRole("navigation", { name: "Site" });
    await nav.getByRole("button", { name: "Expand Farpost" }).click();

    await expect(nav.getByRole("link", { name: "Build Plan" })).toBeVisible();
    await expect(page).toHaveURL("/");
  });

  test("manually collapsing the active group keeps it collapsed", async ({ page }) => {
    await page.goto("/farpost/build-plan");

    const nav = page.getByRole("navigation", { name: "Site" });
    await nav.getByRole("button", { name: "Collapse Farpost" }).click();

    await expect(nav.getByRole("link", { name: "Build Plan" })).toBeHidden();
  });

  test("Farpost submenu navigates to a project-record page", async ({ page }) => {
    await page.goto("/");

    const nav = page.getByRole("navigation", { name: "Site" });
    await nav.getByRole("button", { name: "Expand Farpost" }).click();
    await nav.getByRole("link", { name: "Feature List" }).click();

    await expect(page).toHaveURL("/farpost/feature-list");
  });

  test("Vocare submenu navigates to a project-record page", async ({ page }) => {
    await page.goto("/");

    const nav = page.getByRole("navigation", { name: "Site" });
    await nav.getByRole("button", { name: "Expand Vocare" }).click();
    await nav.getByRole("link", { name: "Current Metrics" }).click();

    await expect(page).toHaveURL("/vocare/current-metrics");
  });

  test("Dev Log submenu navigates to Bug Log", async ({ page }) => {
    await page.goto("/");

    const nav = page.getByRole("navigation", { name: "Site" });
    await nav.getByRole("button", { name: "Expand Dev Log" }).click();
    await nav.getByRole("link", { name: "Bug Log" }).click();

    await expect(page).toHaveURL("/dev-log/bug-log");
  });

  test("Code Showcase nests under Dev Log and lists articles by title", async ({ page }) => {
    await page.goto("/");

    const nav = page.getByRole("navigation", { name: "Site" });
    await nav.getByRole("button", { name: "Expand Dev Log" }).click();
    await nav.getByRole("button", { name: "Expand Code Showcase" }).click();

    const articleLink = nav.getByRole("link", { name: "The Bug That Silently Ate 2,706 Records" });
    await expect(articleLink).toBeVisible();
    await articleLink.click();

    await expect(page).toHaveURL("/dev-log/code-showcase/silent-slug-collision");
  });
});

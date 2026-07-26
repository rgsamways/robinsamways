import { test, expect } from "@playwright/test";

const SERVICES_SECTION_TITLES = [
  "WEB_SITES",
  "WEB_APPLICATIONS",
  "NATIVE_APPLICATIONS",
  "PLATFORM",
  "HOURLY",
  "FIELD_DOCUMENTATION",
  "TROUBLESHOOTING_QUESTIONS",
];

test.describe("page outline — desktop, always-visible inline list", () => {
  test("a page with 2+ sections shows every section, in document order, with no click needed", async ({
    page,
  }) => {
    await page.goto("/services");

    const outline = page.getByRole("navigation", { name: "On this page" });
    await expect(outline).toBeVisible();

    const entries = outline.locator("ul button");
    await expect(entries).toHaveCount(SERVICES_SECTION_TITLES.length);
    await expect(entries).toHaveText(SERVICES_SECTION_TITLES);
  });

  test("clicking an outline entry scrolls to its section and the outline stays visible", async ({
    page,
  }) => {
    await page.goto("/services");

    const outline = page.getByRole("navigation", { name: "On this page" });
    await outline.locator("ul button", { hasText: "FIELD_DOCUMENTATION" }).click();

    await expect(page.locator("#field-documentation")).toBeInViewport();
    await expect(outline).toBeVisible();
  });

  test("scrolling into a different section updates which entry is marked active", async ({
    page,
  }) => {
    await page.goto("/services");

    await page
      .locator("#troubleshooting-questions")
      .evaluate((element) => element.scrollIntoView({ block: "start" }));

    const outline = page.getByRole("navigation", { name: "On this page" });
    await expect(
      outline.locator("ul button", { hasText: "TROUBLESHOOTING_QUESTIONS" })
    ).toHaveAttribute("aria-current", "true");
  });

  test("clicking a trailing section near the page bottom marks it active immediately, even if it can never satisfy the observer's active band", async ({
    page,
  }) => {
    await page.goto("/");

    const outline = page.getByRole("navigation", { name: "On this page" });
    await outline.locator("ul button", { hasText: "CONTINUING_EDUCATION" }).click();

    await expect(
      outline.locator("ul button", { hasText: "CONTINUING_EDUCATION" })
    ).toHaveAttribute("aria-current", "true");

    await outline.locator("ul button", { hasText: "CONTACT" }).click();

    await expect(outline.locator("ul button", { hasText: "CONTACT" })).toHaveAttribute(
      "aria-current",
      "true"
    );
    await expect(
      outline.locator("ul button", { hasText: "CONTINUING_EDUCATION" })
    ).not.toHaveAttribute("aria-current", "true");
  });

  test("a page with zero sections shows no outline", async ({ page }) => {
    await page.goto("/sign-in");

    await expect(page.getByRole("navigation", { name: "On this page" })).toHaveCount(0);
  });

  test("a page with exactly one section shows no outline", async ({ page }) => {
    await page.goto("/metrics");

    await expect(page.getByRole("navigation", { name: "On this page" })).toHaveCount(0);
  });
});

test.describe("page outline — stays synced with in-page filtering", () => {
  test("filtering down to one section still shows that one entry", async ({ page }) => {
    await page.goto("/services");

    const pills = page.getByRole("group", { name: "filter services sections" });
    await pills.getByRole("button", { name: "Web Sites", exact: true }).click();

    const outline = page.getByRole("navigation", { name: "On this page" });
    const entries = outline.locator("ul button");
    await expect(entries).toHaveCount(1);
    await expect(entries).toHaveText(["WEB_SITES"]);
  });

  test("re-enabling a filter restores the additional entry live, no reload", async ({ page }) => {
    await page.goto("/services");

    const pills = page.getByRole("group", { name: "filter services sections" });
    await pills.getByRole("button", { name: "Web Sites", exact: true }).click();

    const outline = page.getByRole("navigation", { name: "On this page" });
    await expect(outline.locator("ul button")).toHaveCount(1);

    await pills.getByRole("button", { name: "Web Applications", exact: true }).click();

    await expect(outline.locator("ul button")).toHaveCount(2);
    await expect(outline.locator("ul button")).toHaveText(["WEB_SITES", "WEB_APPLICATIONS"]);
  });

  test("filtering out the active section clears the active marking", async ({ page }) => {
    await page.goto("/services");

    const outline = page.getByRole("navigation", { name: "On this page" });
    await outline.locator("ul button", { hasText: "WEB_SITES" }).click();
    await expect(outline.locator("ul button", { hasText: "WEB_SITES" })).toHaveAttribute(
      "aria-current",
      "true"
    );

    const pills = page.getByRole("group", { name: "filter services sections" });
    await pills.getByRole("button", { name: "Web Applications", exact: true }).click();

    await expect(outline.locator("ul button")).toHaveCount(1);
    await expect(outline.locator("ul button")).not.toHaveAttribute("aria-current", "true");
  });
});

test.describe("page outline — mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("no outline appears at all on mobile, regardless of section count", async ({ page }) => {
    await page.goto("/services");

    await expect(page.getByRole("navigation", { name: "On this page" })).toHaveCount(0);
  });
});

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

test.describe("page outline flyout", () => {
  test("a page with 2+ sections shows the trigger and lists every section in document order", async ({
    page,
  }) => {
    await page.goto("/services");

    const trigger = page.getByRole("button", { name: "On this page" });
    await expect(trigger).toBeVisible();

    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "On this page" });
    await expect(dialog).toBeVisible();

    const entries = dialog.locator("ul button");
    await expect(entries).toHaveCount(SERVICES_SECTION_TITLES.length);
    await expect(entries).toHaveText(SERVICES_SECTION_TITLES);
  });

  test("clicking an outline entry scrolls to its section and closes the panel", async ({
    page,
  }) => {
    await page.goto("/services");

    await page.getByRole("button", { name: "On this page" }).click();
    const dialog = page.getByRole("dialog", { name: "On this page" });
    await dialog.locator("ul button", { hasText: "FIELD_DOCUMENTATION" }).click();

    await expect(dialog).toBeHidden();
    await expect(page.locator("#field-documentation")).toBeInViewport();
  });

  test("Escape dismisses the open panel", async ({ page }) => {
    await page.goto("/services");

    await page.getByRole("button", { name: "On this page" }).click();
    const dialog = page.getByRole("dialog", { name: "On this page" });
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("a backdrop click dismisses the open panel", async ({ page }) => {
    await page.goto("/services");

    await page.getByRole("button", { name: "On this page" }).click();
    const dialog = page.getByRole("dialog", { name: "On this page" });
    await expect(dialog).toBeVisible();

    await dialog.click({ position: { x: 5, y: 5 } });
    await expect(dialog).toBeHidden();
  });

  test("the close button dismisses the open panel", async ({ page }) => {
    await page.goto("/services");

    await page.getByRole("button", { name: "On this page" }).click();
    const dialog = page.getByRole("dialog", { name: "On this page" });
    await expect(dialog).toBeVisible();

    await page.getByRole("button", { name: "Close" }).click();
    await expect(dialog).toBeHidden();
  });

  test("scrolling into a different section updates which entry is marked active", async ({
    page,
  }) => {
    await page.goto("/services");

    await page
      .locator("#troubleshooting-questions")
      .evaluate((element) => element.scrollIntoView({ block: "start" }));
    await page.getByRole("button", { name: "On this page" }).click();
    const dialog = page.getByRole("dialog", { name: "On this page" });

    await expect(
      dialog.locator("ul button", { hasText: "TROUBLESHOOTING_QUESTIONS" })
    ).toHaveAttribute("aria-current", "true");
  });

  test("a page with zero sections shows no outline trigger", async ({ page }) => {
    await page.goto("/sign-in");

    await expect(page.getByRole("button", { name: "On this page" })).toHaveCount(0);
  });

  test("a page with exactly one section shows no outline trigger", async ({ page }) => {
    await page.goto("/dev-log/glossary");

    await expect(page.getByRole("button", { name: "On this page" })).toHaveCount(0);
  });
});

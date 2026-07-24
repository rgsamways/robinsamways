import { test, expect } from "@playwright/test";

const NAV_LINKS: { label: string; path: string }[] = [
  { label: "Farpost", path: "/farpost" },
  { label: "Tech/Stacks", path: "/techstacks" },
  { label: "Dev Log", path: "/dev-log" },
  { label: "Sreditor", path: "/sreditor" },
  { label: "Services", path: "/services" },
];

test.describe("global navigation drawer", () => {
  test("shows every top-level destination without needing a toggle on desktop", async ({ page }) => {
    await page.goto("/");

    const nav = page.getByRole("navigation", { name: "Site" });
    await expect(nav.getByRole("link", { name: "Home" })).toBeVisible();
    for (const { label } of NAV_LINKS) {
      await expect(nav.getByRole("link", { name: label })).toBeVisible();
    }

    await expect(page.getByRole("button", { name: "Open navigation" })).toBeHidden();
  });

  for (const { label, path } of NAV_LINKS) {
    test(`navigates to ${label}`, async ({ page }) => {
      await page.goto("/");
      await page.getByRole("navigation", { name: "Site" }).getByRole("link", { name: label }).click();

      await expect(page).toHaveURL(path);
    });
  }

  test("navigating away and back to Home works", async ({ page }) => {
    await page.goto("/farpost");
    await page.getByRole("navigation", { name: "Site" }).getByRole("link", { name: "Home" }).click();

    await expect(page).toHaveURL("/");
  });
});

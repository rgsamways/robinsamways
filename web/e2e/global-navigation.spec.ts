import { test, expect } from "@playwright/test";

const GLOBAL_MENU_LINKS: { label: string; path: string }[] = [
  { label: "Farpost", path: "/farpost" },
  { label: "Sreditor", path: "/sreditor" },
  { label: "Tech/Stacks", path: "/techstacks" },
  { label: "Dev Log", path: "/dev-log" },
  { label: "Services", path: "/services" },
];

test.describe("global navigation menu", () => {
  test("opens, lists every top-level destination, and closes without navigating", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Open menu" });
    await toggle.click();

    const nav = page.getByRole("navigation", { name: "menu" });
    await expect(nav.getByRole("link", { name: "Home" })).toBeVisible();
    for (const { label } of GLOBAL_MENU_LINKS) {
      await expect(nav.getByRole("link", { name: label })).toBeVisible();
    }

    await page.getByRole("button", { name: "Close menu" }).click();
    await expect(nav).toBeHidden();
    await expect(page).toHaveURL("/");
  });

  for (const { label, path } of GLOBAL_MENU_LINKS) {
    test(`navigates to ${label} and closes the menu`, async ({ page }) => {
      await page.goto("/");
      await page.getByRole("button", { name: "Open menu" }).click();
      await page.getByRole("navigation", { name: "menu" }).getByRole("link", { name: label }).click();

      await expect(page).toHaveURL(path);
      await expect(page.getByRole("navigation", { name: "menu" })).toBeHidden();
    });
  }

  test("navigating away and back to Home works", async ({ page }) => {
    await page.goto("/farpost");
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("navigation", { name: "menu" }).getByRole("link", { name: "Home" }).click();

    await expect(page).toHaveURL("/");
  });
});

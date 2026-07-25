import { test, expect } from "@playwright/test";

test.describe("Farpost Dispatch case-study page", () => {
  test("renders real case-study content, not the old placeholder", async ({ page }) => {
    await page.goto("/techstacks/farpost-dispatch");

    await expect(page.getByRole("heading", { name: "Farpost Dispatch" })).toBeVisible();
    await expect(page.getByText("Coming soon")).toHaveCount(0);

    await expect(
      page.getByText(/separate, illustrative system, not Farpost.s real dispatch engine/)
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "OBJECT_MODEL" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "ARCHITECTURE" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "AI_MATCHING" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "TECH_STACK" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "SETUP_GALLERY" })).toBeVisible();
  });

  test("the old Farpost-nested URL redirects permanently to the new Experiments route", async ({ page }) => {
    const response = await page.goto("/farpost/farpost-dispatch");

    await expect(page).toHaveURL("/techstacks/farpost-dispatch");
    expect(response?.request().redirectedFrom()).not.toBeNull();
  });
});

import { test, expect, type Route } from "@playwright/test";

const API_URL = "http://localhost:8000";

async function mockFeedbackApi(route: Route) {
  const request = route.request();
  const url = new URL(request.url());

  if (url.pathname === "/feedback" && request.method() === "POST") {
    return route.fulfill({ status: 201, json: { status: "ok" } });
  }
  return route.fulfill({ status: 404, json: { error: "unmocked route in e2e spec" } });
}

test.describe("feedback widget", () => {
  test.beforeEach(async ({ page }) => {
    await page.route(`${API_URL}/**`, mockFeedbackApi);
  });

  test("renders on a non-homepage page", async ({ page }) => {
    await page.goto("/farpost");

    await expect(page.getByText("Feedback on this page")).toBeVisible();
    await expect(page.getByRole("button", { name: "Positive reaction" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Negative reaction" })).toBeVisible();
  });

  test("does not render on the homepage", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("Feedback on this page")).toHaveCount(0);
  });

  test("submit button stays disabled with neither field filled", async ({ page }) => {
    await page.goto("/farpost");

    await expect(page.getByRole("button", { name: "Send feedback" })).toBeDisabled();
  });

  test("a mocked successful submission shows the success confirmation without a reload", async ({
    page,
  }) => {
    await page.goto("/farpost");

    await page.getByRole("button", { name: "Positive reaction" }).click();
    await expect(page.getByRole("button", { name: "Send feedback" })).toBeEnabled();

    await page.getByRole("button", { name: "Send feedback" }).click();

    await expect(page.getByText("Thanks for the feedback.")).toBeVisible();
  });
});

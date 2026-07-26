import { test, expect, type Route } from "@playwright/test";

const API_URL = "http://localhost:8000";

async function mockContactApi(route: Route) {
  const request = route.request();
  const url = new URL(request.url());

  if (url.pathname === "/contact" && request.method() === "POST") {
    return route.fulfill({ status: 201, json: { status: "ok" } });
  }
  return route.fulfill({ status: 404, json: { error: "unmocked route in e2e spec" } });
}

test.describe("/contact page", () => {
  test.beforeEach(async ({ page }) => {
    await page.route(`${API_URL}/**`, mockContactApi);
  });

  test("renders the real contact form", async ({ page }) => {
    await page.goto("/contact");

    await expect(page.getByRole("heading", { name: "$ Contact" })).toBeVisible();
    await expect(page.getByLabel("name")).toBeVisible();
    await expect(page.getByLabel("email")).toBeVisible();
    await expect(page.getByLabel("message")).toBeVisible();
  });

  test("a mocked successful submission shows the success confirmation without a reload", async ({
    page,
  }) => {
    await page.goto("/contact");

    await page.getByLabel("name").fill("Test Visitor");
    await page.getByLabel("email").fill("visitor@example.com");
    await page.getByLabel("message").fill("Hello there.");
    await page.getByRole("button", { name: "Send", exact: true }).click();

    await expect(page.getByText(/your message has been sent/)).toBeVisible();
  });

  test("the homepage's Contact section links to /contact instead of showing the form", async ({
    page,
  }) => {
    await page.goto("/");

    const main = page.locator("main");
    await expect(main.getByLabel("name")).toHaveCount(0);
    await expect(main.getByLabel("email")).toHaveCount(0);

    await main.getByRole("link", { name: "Get in touch" }).click();
    await expect(page).toHaveURL("/contact");
  });
});

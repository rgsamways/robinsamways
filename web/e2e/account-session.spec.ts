import { test, expect } from "@playwright/test";

test.describe("session-conditional Account/Sign In icon (D4)", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.removeItem("rsw_session_token");
      window.localStorage.removeItem("rsw_session_email");
    });
  });

  test("a signed-out visitor sees Sign In, not Account", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Account" })).toHaveCount(0);
  });

  test("signing in swaps the icon to Account without a reload", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();

    // Mirrors storeSession()'s own effect directly — this test is about the
    // icon-swap mechanism (session.ts + CSS), not the sign-in flow's real
    // API call, which is out of scope here.
    await page.evaluate(() => {
      window.localStorage.setItem("rsw_session_token", "token-123");
      window.localStorage.setItem("rsw_session_email", "robin@example.com");
      document.documentElement.dataset.signedIn = "true";
    });

    await expect(page.getByRole("link", { name: "Account" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign in" })).toHaveCount(0);
  });

  test("signing out from /account swaps the icon back to Sign In and returns home", async ({
    page,
  }) => {
    // Registered after beforeEach's clearing script, so it runs after it on
    // every navigation — net effect: a real session is present when
    // /account's own mount effect (AccountSignOut) and SettingsBootstrap
    // both read it.
    await page.addInitScript(() => {
      window.localStorage.setItem("rsw_session_token", "token-123");
      window.localStorage.setItem("rsw_session_email", "robin@example.com");
    });
    await page.goto("/account");
    // A marker that only survives a client-side navigation, not a full
    // page reload — confirms clearSession() + router.push() genuinely
    // avoids a hard reload, per D4's side benefit and this capability's
    // "without requiring a full page reload" wording.
    await page.evaluate(() => {
      (window as unknown as { __noReloadMarker: boolean }).__noReloadMarker = true;
    });

    await expect(page.getByRole("link", { name: "Account" })).toBeVisible();
    await page.getByRole("button", { name: "Sign Out" }).click();

    await expect(page).toHaveURL("/");
    await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Account" })).toHaveCount(0);
    const markerSurvived = await page.evaluate(
      () => (window as unknown as { __noReloadMarker?: boolean }).__noReloadMarker
    );
    expect(markerSurvived).toBe(true);
  });

  test("a signed-in visitor on /account sees a working Sign Out control", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("rsw_session_token", "token-123");
      window.localStorage.setItem("rsw_session_email", "robin@example.com");
    });
    await page.goto("/account");

    await expect(page.getByText(/Isn.t live yet/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
  });

  test("a signed-out visitor on /account sees no Sign Out control", async ({ page }) => {
    await page.goto("/account");

    await expect(page.getByText(/Isn.t live yet/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign Out" })).toHaveCount(0);
  });
});

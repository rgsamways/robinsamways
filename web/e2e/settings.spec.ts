import { test, expect } from "@playwright/test";

test.describe("/settings — theme", () => {
  test("with no stored preference and a dark OS preference, any page loads in dark mode", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");

    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("the nav rail no longer renders a theme toggle", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("button", { name: /Switch to (dark|light) mode/ })
    ).toHaveCount(0);
  });

  test("activating the toggle on /settings switches the theme immediately", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/settings");

    await expect(page.locator("html")).not.toHaveClass(/dark/);

    await page.getByRole("button", { name: "Switch to dark mode" }).click();

    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect(page.getByRole("button", { name: "Switch to light mode" })).toBeVisible();
  });

  test("an explicit toggle persists across a reload and across a different page", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/settings");

    await page.getByRole("button", { name: "Switch to dark mode" }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    await page.reload();
    await expect(page.locator("html")).toHaveClass(/dark/);

    await page.goto("/services");
    await expect(page.locator("html")).toHaveClass(/dark/);
  });
});

test.describe("/settings — font size", () => {
  test("changing font size rescales the site immediately, without a reload", async ({
    page,
  }) => {
    await page.goto("/settings");

    const before = await page.evaluate(
      () => getComputedStyle(document.documentElement).fontSize
    );

    await page.getByRole("button", { name: "Extra Large" }).click();

    const after = await page.evaluate(
      () => getComputedStyle(document.documentElement).fontSize
    );
    expect(parseFloat(after)).toBeGreaterThan(parseFloat(before));
  });

  test("a chosen font size persists across a reload and across a different page", async ({
    page,
  }) => {
    await page.goto("/settings");
    await page.getByRole("button", { name: "Extra Large" }).click();
    const scaled = await page.evaluate(() => getComputedStyle(document.documentElement).fontSize);

    await page.reload();
    await expect
      .poll(() => page.evaluate(() => getComputedStyle(document.documentElement).fontSize))
      .toBe(scaled);

    await page.goto("/services");
    await expect
      .poll(() => page.evaluate(() => getComputedStyle(document.documentElement).fontSize))
      .toBe(scaled);
  });
});

test.describe("/settings — reduced motion", () => {
  test.beforeEach(async ({ page }) => {
    // Clear the shared marker class this describe block mutates directly,
    // so one test's explicit override doesn't leak state into the next.
    await page.addInitScript(() => {
      window.localStorage.removeItem("reduced-motion");
    });
  });

  test("System (the default) defers to an OS preference of reduce", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/services");

    const duration = await page
      .locator("[data-testid='nav-rail']")
      .evaluate((el) => getComputedStyle(el).transitionDuration);
    expect(duration).toBe("0s");
  });

  test("System (the default) defers to an OS preference of no-preference", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/services");

    const duration = await page
      .locator("[data-testid='nav-rail']")
      .evaluate((el) => getComputedStyle(el).transitionDuration);
    expect(duration).not.toBe("0s");
  });

  test("an explicit On override suppresses the rail transition regardless of OS preference", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/settings");

    await page.getByRole("button", { name: "On", exact: true }).click();

    const duration = await page
      .locator("[data-testid='nav-rail']")
      .evaluate((el) => getComputedStyle(el).transitionDuration);
    expect(duration).toBe("0s");
  });

  test("an explicit Off override keeps the rail transition even if the OS prefers reduced motion", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/settings");

    await page.getByRole("button", { name: "Off", exact: true }).click();

    const duration = await page
      .locator("[data-testid='nav-rail']")
      .evaluate((el) => getComputedStyle(el).transitionDuration);
    expect(duration).not.toBe("0s");
  });

  test("reduced motion off (default OS preference): the outline scrolls smoothly", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/services");
    await page.evaluate(() => {
      (window as unknown as { __behaviors: string[] }).__behaviors = [];
      const original = HTMLElement.prototype.scrollIntoView;
      HTMLElement.prototype.scrollIntoView = function (
        this: HTMLElement,
        opts?: boolean | ScrollIntoViewOptions
      ) {
        const behavior = typeof opts === "object" ? opts.behavior : undefined;
        (window as unknown as { __behaviors: string[] }).__behaviors.push(behavior ?? "auto");
        return original.call(this, opts);
      };
    });

    await page.getByRole("button", { name: "On this page" }).click();
    await page
      .getByRole("dialog", { name: "On this page" })
      .locator("ul button", { hasText: "FIELD_DOCUMENTATION" })
      .click();

    const behaviors = await page.evaluate(
      () => (window as unknown as { __behaviors: string[] }).__behaviors
    );
    expect(behaviors).toContain("smooth");
  });

  test("reduced motion on: the outline scrolls without animation", async ({ page }) => {
    await page.goto("/services");
    await page.evaluate(() => {
      window.localStorage.setItem("reduced-motion", "on");
      (window as unknown as { __behaviors: string[] }).__behaviors = [];
      const original = HTMLElement.prototype.scrollIntoView;
      HTMLElement.prototype.scrollIntoView = function (
        this: HTMLElement,
        opts?: boolean | ScrollIntoViewOptions
      ) {
        const behavior = typeof opts === "object" ? opts.behavior : undefined;
        (window as unknown as { __behaviors: string[] }).__behaviors.push(behavior ?? "auto");
        return original.call(this, opts);
      };
    });

    await page.getByRole("button", { name: "On this page" }).click();
    await page
      .getByRole("dialog", { name: "On this page" })
      .locator("ul button", { hasText: "FIELD_DOCUMENTATION" })
      .click();

    const behaviors = await page.evaluate(
      () => (window as unknown as { __behaviors: string[] }).__behaviors
    );
    expect(behaviors).toContain("auto");
    expect(behaviors).not.toContain("smooth");
  });
});

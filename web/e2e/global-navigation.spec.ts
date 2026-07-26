import { test, expect } from "@playwright/test";

const TOP_LEVEL_LINKS: { label: string; path: string }[] = [
  { label: "Farpost", path: "/farpost" },
  { label: "Vocare", path: "/vocare" },
  { label: "Experiments", path: "/techstacks" },
  { label: "Dev Log", path: "/dev-log" },
  { label: "Sreditor", path: "/sreditor" },
  { label: "Services", path: "/services" },
  { label: "Contact", path: "/contact" },
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

  test("Site group lists Home, Services, Metrics, and Contact, in that order", async ({ page }) => {
    await page.goto("/");

    const siteHeading = page.getByRole("heading", { name: "Site", exact: true });
    const siteLinks = siteHeading.locator("xpath=following-sibling::ul[1]").getByRole("link");

    await expect(siteLinks).toHaveText(["Home", "Services", "Metrics", "Contact"]);
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

  test("Dev Log submenu lists its entries directly, with no intermediate Code Showcase node", async ({ page }) => {
    await page.goto("/");

    const nav = page.getByRole("navigation", { name: "Site" });
    await nav.getByRole("button", { name: "Expand Dev Log" }).click();
    await expect(nav.getByRole("button", { name: "Expand Code Showcase" })).toHaveCount(0);

    // The most recently published entry — always in the capped 5, unlike an
    // older entry that could drop out as new ones are added.
    const articleLink = nav.getByRole("link", {
      name: "A 'Drift-Audited and Synced' Report That Wasn't",
    });
    await expect(articleLink).toBeVisible();
    await articleLink.click();

    await expect(page).toHaveURL("/dev-log/drift-audit-doesnt-self-verify");
  });

  test("Dev Log submenu caps at the 5 most recent entries, plus a working View All link", async ({
    page,
  }) => {
    await page.goto("/");

    const nav = page.getByRole("navigation", { name: "Site" });
    await nav.getByRole("button", { name: "Expand Dev Log" }).click();

    // An entry old enough to have dropped out of the cap — confirms this
    // is a bounded submenu, not every entry.
    await expect(
      nav.getByRole("link", { name: "The Bug That Silently Ate 2,706 Records" })
    ).toHaveCount(0);

    const viewAll = nav.getByRole("link", { name: "View All" });
    await expect(viewAll).toBeVisible();
    await viewAll.click();

    await expect(page).toHaveURL("/dev-log");
  });

  test("Sreditor submenu navigates to a project-record page", async ({ page }) => {
    await page.goto("/");

    const nav = page.getByRole("navigation", { name: "Site" });
    await nav.getByRole("button", { name: "Expand Sreditor" }).click();
    await nav.getByRole("link", { name: "Bug List" }).click();

    await expect(page).toHaveURL("/sreditor/bug-list");
  });

  test("Experiments is a top-level group, not nested under Work, and its submenu lists all four pieces", async ({
    page,
  }) => {
    await page.goto("/");

    const nav = page.getByRole("navigation", { name: "Site" });
    await nav.getByRole("button", { name: "Expand Farpost" }).click();
    await expect(nav.getByRole("link", { name: "Atlas" })).toHaveCount(0);

    await nav.getByRole("button", { name: "Expand Experiments" }).click();
    await expect(nav.getByRole("link", { name: "Atlas" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Dispatch" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Pulse" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Credential Flow" })).toBeVisible();

    await nav.getByRole("link", { name: "Atlas" }).click();
    await expect(page).toHaveURL("/techstacks/farpost-atlas");
  });
});

test.describe("mobile full-viewport nav takeover", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("opens covering the entire viewport, with no backdrop behind it", async ({ page }) => {
    await page.goto("/");
    const viewport = page.viewportSize()!;

    await page.getByRole("button", { name: "Open navigation" }).click();

    const panel = page.getByRole("navigation", { name: "Site" });
    await expect(panel).toBeVisible();
    // Waits out the slide-in transition rather than reading mid-animation.
    await expect.poll(async () => (await panel.boundingBox())?.x).toBe(0);
    const box = (await panel.boundingBox())!;
    expect(box.width).toBe(viewport.width);
    expect(box.height).toBe(viewport.height);
  });

  test("clicking within the open panel away from a link does not close it", async ({ page }) => {
    await page.goto("/");
    const viewport = page.viewportSize()!;

    await page.getByRole("button", { name: "Open navigation" }).click();
    const panel = page.getByRole("navigation", { name: "Site" });

    // There's no backdrop to click anymore — the old dismissible-backdrop
    // interaction is a deliberate breaking change (design.md's D5/Risks).
    await panel.getByRole("heading", { name: "Site" }).click();

    const box = (await panel.boundingBox())!;
    expect(box.x).toBe(0);
    expect(box.width).toBe(viewport.width);
  });

  test("Escape closes the nav without navigating", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Open navigation" }).click();
    const panel = page.getByRole("navigation", { name: "Site" });
    await expect(panel).toBeVisible();

    await page.keyboard.press("Escape");

    const box = (await panel.boundingBox())!;
    expect(box.x).toBeLessThan(0);
    await expect(page).toHaveURL("/");
  });

  test("the close button closes the nav", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Open navigation" }).click();
    const panel = page.getByRole("navigation", { name: "Site" });
    await page.getByRole("button", { name: "Close navigation" }).click();

    const box = (await panel.boundingBox())!;
    expect(box.x).toBeLessThan(0);
  });

  test("selecting a link navigates and closes the nav", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Open navigation" }).click();
    const panel = page.getByRole("navigation", { name: "Site" });
    await panel.getByRole("link", { name: "Services", exact: true }).click();

    await expect(page).toHaveURL("/services");
    const box = (await panel.boundingBox())!;
    expect(box.x).toBeLessThan(0);
  });
});

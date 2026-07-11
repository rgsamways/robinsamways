import { test, expect, type Route } from "@playwright/test";

const API_URL = "http://localhost:7071";

const TECHS = [
  {
    id: "t1",
    name: "Alex Rivera",
    role: "Field Technician",
    snapshotStat: { label: "Tag completion", value: 92, unit: "%" },
    jobCount: 3,
  },
];

const JOBS = [
  {
    id: "j1",
    techId: "t1",
    propertyType: "Single Family",
    date: "2026-07-01",
    photosRequired: 8,
    photosTaken: 8,
    anglesRequired: ["front", "rear", "roofline"],
    anglesMissed: [],
    nfcTagsExpected: 2,
    nfcTagsScanned: 2,
    turnaroundHours: 6,
  },
  {
    id: "j2",
    techId: "t1",
    propertyType: "Townhouse",
    date: "2026-07-05",
    photosRequired: 8,
    photosTaken: 7,
    anglesRequired: ["front", "rear", "roofline"],
    anglesMissed: ["roofline"],
    nfcTagsExpected: 2,
    nfcTagsScanned: 2,
    turnaroundHours: 9,
  },
];

const COACHING_TIP = {
  tip: "Steady work — no recurring red flags in the last few jobs.",
  generatedAt: "2026-07-10T00:00:00.000Z",
  basedOnJobIds: ["j1", "j2"],
};

async function mockFarpostPulseApi(route: Route) {
  const request = route.request();
  const url = new URL(request.url());

  if (url.pathname === "/api/techs" && request.method() === "GET") {
    return route.fulfill({ json: TECHS });
  }
  if (url.pathname === "/api/techs/t1/jobs" && request.method() === "GET") {
    return route.fulfill({ json: JOBS });
  }
  if (url.pathname === "/api/coaching/generate" && request.method() === "POST") {
    // Small artificial delay so the button's "Generating…" state is
    // actually observable instead of flashing faster than assertions poll.
    await new Promise((resolve) => setTimeout(resolve, 300));
    return route.fulfill({ json: COACHING_TIP });
  }
  return route.fulfill({ status: 404, json: { error: "unmocked route in e2e spec" } });
}

test.describe("Farpost Pulse: roster to coaching-tip flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.route(`${API_URL}/**`, mockFarpostPulseApi);
  });

  test("selecting a tech from the roster leads to their detail page and a generated tip", async ({ page }) => {
    await page.goto("/narrative/farpost-pulse");

    await expect(page.getByRole("heading", { name: "Alex Rivera" })).toBeVisible();
    await page.getByRole("link", { name: /Alex Rivera/ }).click();

    await expect(page).toHaveURL("/narrative/farpost-pulse/t1");
    await expect(page.getByRole("heading", { name: /Alex Rivera/ })).toBeVisible();
    await expect(page.getByRole("cell", { name: "2026-07-01" })).toBeVisible();
    await expect(page.getByRole("cell", { name: "2026-07-05" })).toBeVisible();

    const generateButton = page.getByRole("button", { name: /Generat/ });
    await generateButton.click();
    await expect(generateButton).toHaveText("Generating…");

    await expect(page.getByText(COACHING_TIP.tip)).toBeVisible();
    await expect(generateButton).toHaveText("Generate Coaching Tip");
  });
});

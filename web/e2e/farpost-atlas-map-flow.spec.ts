import { test, expect, type Route } from "@playwright/test";

const API_URL = "http://localhost:8000";

const BUILDINGS = [
  {
    id: 1,
    address: "88 Weslemkoon Lake Road",
    latitude: 44.96533,
    longitude: -77.34589,
    owner_name: "Derek Fenwick",
    region_name: "Wollaston Township",
    has_stale_record: true,
  },
];

const BUILDING_DETAIL = {
  id: 1,
  address: "88 Weslemkoon Lake Road",
  latitude: 44.96533,
  longitude: -77.34589,
  owner_name: "Derek Fenwick",
  region_name: "Wollaston Township",
  records: [
    {
      id: 1,
      record_type: "septic",
      last_recorded_date: "2021-01-01",
      notes: "Tank pumped by Bancroft Septic Service.",
      is_stale: true,
      months_stale: 66,
    },
    {
      id: 2,
      record_type: "well_pump",
      last_recorded_date: "2026-05-15",
      notes: null,
      is_stale: false,
      months_stale: 1,
    },
  ],
  population_density: 1.0,
  rurality_classification: "deep rural",
};

const BOUNDARIES = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { DAUID: "35110140", population: 613, land_area_km2: 632.8, population_density: 1.0 },
      geometry: {
        type: "Polygon",
        coordinates: [[[-77.5, 44.8], [-77.0, 44.8], [-77.0, 45.2], [-77.5, 45.2], [-77.5, 44.8]]],
      },
    },
  ],
};

async function mockFarpostAtlasApi(route: Route) {
  const request = route.request();
  const url = new URL(request.url());

  if (url.pathname === "/api/buildings") {
    return route.fulfill({ json: BUILDINGS });
  }
  if (url.pathname === "/api/buildings/1") {
    return route.fulfill({ json: BUILDING_DETAIL });
  }
  if (url.pathname === "/api/boundaries") {
    return route.fulfill({ json: BOUNDARIES });
  }
  return route.fulfill({ status: 404, json: { error: "unmocked route in e2e spec" } });
}

test.describe("Farpost Atlas: map to building-detail flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.route(`${API_URL}/**`, mockFarpostAtlasApi);
  });

  test("clicking a map marker's popup link navigates to that building's tracked records", async ({ page }) => {
    await page.goto("/farpost/farpost-atlas");

    const marker = page.locator(".leaflet-marker-icon").first();
    await expect(marker).toBeVisible();
    await marker.click();

    const popupLink = page.locator(".leaflet-popup-content a", { hasText: "View tracked records" });
    await expect(popupLink).toBeVisible();
    await expect(popupLink).toHaveAttribute("href", "/farpost/farpost-atlas/1");

    await popupLink.click();
    await expect(page).toHaveURL("/farpost/farpost-atlas/1");

    await expect(page.getByRole("heading", { name: "88 Weslemkoon Lake Road" })).toBeVisible();
    await expect(page.getByText("deep rural")).toBeVisible();
    await expect(page.getByRole("cell", { name: "66 months stale" })).toBeVisible();
    await expect(page.getByRole("cell", { name: "current" })).toBeVisible();
  });

  test("toggling the rural-density overlay renders the boundary polygon", async ({ page }) => {
    await page.goto("/farpost/farpost-atlas");
    await expect(page.locator(".leaflet-marker-icon").first()).toBeVisible();

    await page.getByText("Show rural-density overlay").click();

    await expect(page.locator("path.leaflet-interactive")).toHaveCount(1);
  });
});

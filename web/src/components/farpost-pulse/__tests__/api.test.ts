import { afterEach, describe, expect, test, vi } from "vitest";
import { generateCoachingTip, getTechJobs, getTechs } from "../api";

function mockFetchOnce(response: { ok: boolean; json?: () => Promise<unknown> }) {
  const fetchMock = vi.fn().mockResolvedValue(response);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getTechs", () => {
  test("returns the parsed JSON body on a successful response", async () => {
    const techs = [{ id: "t1", name: "Alex", role: "Field Tech" }];
    mockFetchOnce({ ok: true, json: async () => techs });
    await expect(getTechs()).resolves.toEqual(techs);
  });

  test("throws when the response is not ok", async () => {
    mockFetchOnce({ ok: false });
    await expect(getTechs()).rejects.toThrow("request failed");
  });
});

describe("getTechJobs", () => {
  test("requests the jobs endpoint for the given tech id", async () => {
    const fetchMock = mockFetchOnce({ ok: true, json: async () => [] });
    await getTechJobs("t1");
    const [url] = fetchMock.mock.calls[0];
    expect(url).toContain("/api/techs/t1/jobs");
  });
});

describe("generateCoachingTip", () => {
  test("POSTs the techId as a JSON body", async () => {
    const tip = { tip: "Nice work", generatedAt: "2026-07-10", basedOnJobIds: ["j1"] };
    const fetchMock = mockFetchOnce({ ok: true, json: async () => tip });

    const result = await generateCoachingTip("t1");

    expect(result).toEqual(tip);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toContain("/api/coaching/generate");
    expect(options.method).toBe("POST");
    expect(options.headers).toEqual({ "Content-Type": "application/json" });
    expect(JSON.parse(options.body)).toEqual({ techId: "t1" });
  });

  test("throws when the response is not ok", async () => {
    mockFetchOnce({ ok: false });
    await expect(generateCoachingTip("t1")).rejects.toThrow("request failed");
  });
});

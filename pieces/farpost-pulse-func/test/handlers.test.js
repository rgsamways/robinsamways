// Exercises each Azure Function's handler directly against an in-memory fake
// Cosmos container (no live Azure/Cosmos connection) — same "monkeypatch the
// shared client, test the business logic" pattern already used for
// Credential Flow's Salesforce integration in api/tests/test_loan_applications.py.
// Run with: npm test

const test = require("node:test");
const assert = require("node:assert/strict");
const Module = require("node:module");

const { generateSeedData } = require("../scripts/generateSeedData");

function makeFakeContainer(store, partitionKeyField) {
  return {
    items: {
      readAll: () => ({ fetchAll: async () => ({ resources: [...store] }) }),
      query: (querySpec) => ({
        fetchAll: async () => {
          const queryText = typeof querySpec === "string" ? querySpec : querySpec.query;
          const params = typeof querySpec === "string" ? [] : querySpec.parameters || [];
          let results = [...store];

          const techIdParam = params.find((param) => param.name === "@techId");
          if (queryText.includes("WHERE c.techId = @techId") && techIdParam) {
            results = results.filter((item) => item.techId === techIdParam.value);
          }

          if (queryText.includes("ORDER BY c.date DESC")) {
            results = [...results].sort((a, b) => b.date.localeCompare(a.date));
          } else if (queryText.includes("ORDER BY c.date ASC")) {
            results = [...results].sort((a, b) => a.date.localeCompare(b.date));
          }

          return { resources: results };
        },
      }),
      create: async (doc) => {
        store.push(doc);
        return { resource: doc };
      },
      upsert: async (doc) => {
        const idx = store.findIndex((item) => item.id === doc.id);
        if (idx >= 0) store[idx] = doc;
        else store.push(doc);
        return { resource: doc };
      },
    },
    item: (id, partitionKey) => ({
      read: async () => {
        const found = store.find((item) => item.id === id && item[partitionKeyField] === partitionKey);
        if (!found) {
          const err = new Error("NotFound");
          err.code = 404;
          throw err;
        }
        return { resource: found };
      },
    }),
  };
}

function loadHandlersWithFakeCosmos() {
  const { techs, jobs } = generateSeedData();
  const coachingHistory = [];

  const fakeTechsContainer = makeFakeContainer(techs, "id");
  const fakeJobsContainer = makeFakeContainer(jobs, "techId");
  const fakeCoachingHistoryContainer = makeFakeContainer(coachingHistory, "techId");

  const handlers = {};
  const originalLoad = Module._load;
  Module._load = function (request, parent, isMain) {
    const resolved = Module._resolveFilename(request, parent, isMain);
    if (resolved === require.resolve("../src/lib/cosmosClient")) {
      return {
        getTechsContainer: () => fakeTechsContainer,
        getJobsContainer: () => fakeJobsContainer,
        getCoachingHistoryContainer: () => fakeCoachingHistoryContainer,
      };
    }
    return originalLoad.apply(this, arguments);
  };

  const azureFunctions = require("@azure/functions");
  const originalHttp = azureFunctions.app.http;
  azureFunctions.app.http = (name, options) => {
    handlers[name] = options.handler;
  };

  // Each function file registers itself via app.http() as a side effect of
  // being required, and node:test's own module cache would otherwise return
  // the already-registered module on a second require() across test files —
  // force a fresh registration against this test run's fake containers.
  for (const name of ["techs", "techJobs", "coachingGenerate", "dashboardPatterns"]) {
    delete require.cache[require.resolve(`../src/functions/${name}`)];
    require(`../src/functions/${name}`);
  }

  azureFunctions.app.http = originalHttp;
  Module._load = originalLoad;

  return { handlers, techs, jobs, coachingHistory };
}

function fakeContext() {
  return { error: () => {} };
}

function fakeRequest({ params = {}, headers = {}, jsonBody } = {}) {
  return {
    params,
    headers: { get: (key) => headers[key.toLowerCase()] },
    json: async () => jsonBody,
  };
}

test("GET /api/techs", async (t) => {
  const { handlers } = loadHandlersWithFakeCosmos();
  const response = await handlers.techs(fakeRequest(), fakeContext());

  await t.test("status omitted (200 default)", () => {
    assert.equal(response.status, undefined);
  });
  await t.test("returns all 6 seeded techs", () => {
    assert.equal(response.jsonBody.length, 6);
  });
  await t.test("each tech has a numeric snapshotStat", () => {
    assert.ok(response.jsonBody.every((tech) => typeof tech.snapshotStat.value === "number"));
  });
  await t.test("the strong-pattern tech has a high tag-completion snapshot stat", () => {
    const priya = response.jsonBody.find((tech) => tech.name === "Priya Nair");
    assert.ok(priya.snapshotStat.value >= 90);
  });
});

test("GET /api/techs/{id}/jobs", async (t) => {
  const { handlers } = loadHandlersWithFakeCosmos();

  await t.test("returns 24 jobs for a known tech", async () => {
    const response = await handlers.techJobs(fakeRequest({ params: { id: "tech-priya-nair" } }), fakeContext());
    assert.equal(response.jsonBody.length, 24);
  });

  await t.test("jobs are sorted chronologically ascending", async () => {
    const response = await handlers.techJobs(fakeRequest({ params: { id: "tech-priya-nair" } }), fakeContext());
    for (let i = 1; i < response.jsonBody.length; i++) {
      assert.ok(response.jsonBody[i].date >= response.jsonBody[i - 1].date);
    }
  });

  await t.test("an unknown tech id returns 404", async () => {
    const response = await handlers.techJobs(fakeRequest({ params: { id: "tech-does-not-exist" } }), fakeContext());
    assert.equal(response.status, 404);
  });
});

test("POST /api/coaching/generate", async (t) => {
  await t.test("generates and stores a real coaching tip for a known tech", async () => {
    const { handlers, coachingHistory } = loadHandlersWithFakeCosmos();
    const response = await handlers.coachingGenerate(
      fakeRequest({ headers: { "x-forwarded-for": "203.0.113.1" }, jsonBody: { techId: "tech-jordan-reyes" } }),
      fakeContext()
    );

    assert.equal(response.status, undefined);
    assert.equal(typeof response.jsonBody.tip, "string");
    assert.ok(response.jsonBody.tip.length > 10);
    assert.equal(coachingHistory.length, 1);
    assert.equal(coachingHistory[0].techId, "tech-jordan-reyes");
    assert.ok(coachingHistory[0].basedOnJobIds.length > 0);
  });

  await t.test("an unknown tech id returns 404", async () => {
    const { handlers } = loadHandlersWithFakeCosmos();
    const response = await handlers.coachingGenerate(
      fakeRequest({ headers: { "x-forwarded-for": "203.0.113.2" }, jsonBody: { techId: "tech-does-not-exist" } }),
      fakeContext()
    );
    assert.equal(response.status, 404);
  });

  await t.test("a missing techId in the body returns 400", async () => {
    const { handlers } = loadHandlersWithFakeCosmos();
    const response = await handlers.coachingGenerate(
      fakeRequest({ headers: { "x-forwarded-for": "203.0.113.3" }, jsonBody: {} }),
      fakeContext()
    );
    assert.equal(response.status, 400);
  });

  await t.test("the 6th+ request from the same IP within the window is rate-limited (429)", async () => {
    const { handlers } = loadHandlersWithFakeCosmos();
    const rateLimitIp = "203.0.113.99";
    const statuses = [];
    for (let i = 0; i < 7; i++) {
      const response = await handlers.coachingGenerate(
        fakeRequest({ headers: { "x-forwarded-for": rateLimitIp }, jsonBody: { techId: "tech-priya-nair" } }),
        fakeContext()
      );
      statuses.push(response.status || 200);
    }
    assert.equal(statuses[5], 429);
    assert.equal(statuses[6], 429);
  });
});

test("GET /api/dashboard/patterns", async (t) => {
  const { handlers } = loadHandlersWithFakeCosmos();
  const response = await handlers.dashboardPatterns(fakeRequest(), fakeContext());

  await t.test("status omitted (200 default)", () => {
    assert.equal(response.status, undefined);
  });
  await t.test("returns per-tech completion rates for all 6 techs", () => {
    assert.equal(response.jsonBody.techCompletionRates.length, 6);
  });
  await t.test("per-tech rates use the tagCompletionRate field", () => {
    assert.ok(response.jsonBody.techCompletionRates.every((tech) => typeof tech.tagCompletionRate === "number"));
  });
  await t.test("the org-wide most-missed angle is roofline", () => {
    assert.equal(response.jsonBody.mostMissedAngleOrgWide, "roofline");
  });
});

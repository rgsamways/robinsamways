// Exercises each Azure Function's handler directly against an in-memory fake
// Cosmos container (no live Azure/Cosmos connection) — same "monkeypatch the
// shared client, test the business logic" pattern already used for
// Credential Flow's Salesforce integration in api/app/salesforce.py's test
// suite. Run with: node scripts/testHandlers.js

const path = require("path");
const Module = require("module");
const { generateSeedData } = require("./generateSeedData");

// ---- 1. Build in-memory data from the same seed generator used for real seeding ----
const { techs, jobs } = generateSeedData();
const coachingHistory = [];

function matchesTechId(item, techId) {
  return item.techId === techId;
}

function makeFakeContainer(store, partitionKeyField) {
  return {
    items: {
      readAll: () => ({ fetchAll: async () => ({ resources: [...store] }) }),
      query: (querySpec) => ({
        fetchAll: async () => {
          const queryText = typeof querySpec === "string" ? querySpec : querySpec.query;
          const params = typeof querySpec === "string" ? [] : querySpec.parameters || [];
          let results = [...store];

          const techIdParam = params.find((p) => p.name === "@techId");
          if (queryText.includes("WHERE c.techId = @techId") && techIdParam) {
            results = results.filter((item) => matchesTechId(item, techIdParam.value));
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

const fakeTechsContainer = makeFakeContainer(techs, "id");
const fakeJobsContainer = makeFakeContainer(jobs, "techId");
const fakeCoachingHistoryContainer = makeFakeContainer(coachingHistory, "techId");

// ---- 2. Intercept @azure/functions' app.http to capture handlers by name ----
const handlers = {};
const azureFunctionsPath = require.resolve("@azure/functions");
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

require("../src/functions/techs");
require("../src/functions/techJobs");
require("../src/functions/coachingGenerate");
require("../src/functions/dashboardPatterns");

azureFunctions.app.http = originalHttp;
Module._load = originalLoad;

// ---- 3. Fake request/context helpers ----
function fakeContext() {
  return { error: (...args) => console.error("  [function error log]", ...args) };
}

function fakeRequest({ params = {}, headers = {}, jsonBody } = {}) {
  return {
    params,
    headers: { get: (key) => headers[key.toLowerCase()] },
    json: async () => jsonBody,
  };
}

// ---- 4. Run the checks ----
const failures = [];
function check(label, condition) {
  console.log(`${condition ? "PASS" : "FAIL"}: ${label}`);
  if (!condition) failures.push(label);
}

async function main() {
  console.log("=== GET /api/techs ===");
  const techsResponse = await handlers.techs(fakeRequest(), fakeContext());
  check("status omitted (200 default)", techsResponse.status === undefined);
  check("returns 6 techs", techsResponse.jsonBody.length === 6);
  check(
    "each tech has a snapshotStat",
    techsResponse.jsonBody.every((t) => typeof t.snapshotStat.value === "number")
  );
  const priya = techsResponse.jsonBody.find((t) => t.name === "Priya Nair");
  console.log("  Priya Nair's snapshot stat:", JSON.stringify(priya.snapshotStat));
  check("Priya Nair (strong) has a high tag-completion snapshot stat", priya.snapshotStat.value >= 90);

  console.log("\n=== GET /api/techs/{id}/jobs ===");
  const jobsResponse = await handlers.techJobs(fakeRequest({ params: { id: "tech-priya-nair" } }), fakeContext());
  check("returns 24 jobs", jobsResponse.jsonBody.length === 24);
  check(
    "jobs sorted chronologically ascending",
    jobsResponse.jsonBody.every((job, i) => i === 0 || job.date >= jobsResponse.jsonBody[i - 1].date)
  );

  const missingJobsResponse = await handlers.techJobs(fakeRequest({ params: { id: "tech-does-not-exist" } }), fakeContext());
  check("unknown tech id -> 404", missingJobsResponse.status === 404);

  console.log("\n=== POST /api/coaching/generate ===");
  const coachingResponse = await handlers.coachingGenerate(
    fakeRequest({ headers: { "x-forwarded-for": "203.0.113.1" }, jsonBody: { techId: "tech-jordan-reyes" } }),
    fakeContext()
  );
  check("status omitted (200 default)", coachingResponse.status === undefined);
  check("returns a non-empty tip string", typeof coachingResponse.jsonBody.tip === "string" && coachingResponse.jsonBody.tip.length > 10);
  console.log("  generated tip:", JSON.stringify(coachingResponse.jsonBody.tip));
  check("tip stored in coachingHistory", coachingHistory.length === 1);
  check("stored record references the right tech", coachingHistory[0].techId === "tech-jordan-reyes");
  check("stored record references job ids it was based on", coachingHistory[0].basedOnJobIds.length > 0);

  const missingTechResponse = await handlers.coachingGenerate(
    fakeRequest({ headers: { "x-forwarded-for": "203.0.113.2" }, jsonBody: { techId: "tech-does-not-exist" } }),
    fakeContext()
  );
  check("coaching generate for unknown tech -> 404", missingTechResponse.status === 404);

  const missingBodyResponse = await handlers.coachingGenerate(
    fakeRequest({ headers: { "x-forwarded-for": "203.0.113.3" }, jsonBody: {} }),
    fakeContext()
  );
  check("coaching generate with no techId -> 400", missingBodyResponse.status === 400);

  console.log("\n=== POST /api/coaching/generate: rate limiting ===");
  const rateLimitIp = "203.0.113.99";
  const statuses = [];
  for (let i = 0; i < 7; i++) {
    const response = await handlers.coachingGenerate(
      fakeRequest({ headers: { "x-forwarded-for": rateLimitIp }, jsonBody: { techId: "tech-priya-nair" } }),
      fakeContext()
    );
    statuses.push(response.status || 200);
  }
  console.log("  statuses across 7 requests from the same IP:", statuses);
  check("6th+ request from the same IP is rate-limited (429)", statuses[5] === 429 && statuses[6] === 429);

  console.log("\n=== GET /api/dashboard/patterns ===");
  const dashboardResponse = await handlers.dashboardPatterns(fakeRequest(), fakeContext());
  check("status omitted (200 default)", dashboardResponse.status === undefined);
  check("returns per-tech completion rates for all 6 techs", dashboardResponse.jsonBody.techCompletionRates.length === 6);
  check(
    "per-tech rates use the renamed tagCompletionRate field",
    dashboardResponse.jsonBody.techCompletionRates.every((t) => typeof t.tagCompletionRate === "number")
  );
  check(
    "most commonly missed angle org-wide is roofline (Jordan Reyes' weak-angle pattern dominates)",
    dashboardResponse.jsonBody.mostMissedAngleOrgWide === "roofline"
  );
  console.log("  dashboard payload:", JSON.stringify(dashboardResponse.jsonBody, null, 2));

  console.log("\n" + (failures.length === 0 ? "ALL CHECKS PASSED" : `FAILURES: ${JSON.stringify(failures)}`));
  process.exit(failures.length === 0 ? 0 : 1);
}

main();

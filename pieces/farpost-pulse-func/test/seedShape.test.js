// Validates the generated seed data's shape and intentional patterns without
// any live Cosmos DB connection, per the migration plan's "validate shapes
// before wiring up the real SDK calls" approach. Run with: npm test

const test = require("node:test");
const assert = require("node:assert/strict");

const { generateSeedData } = require("../scripts/generateSeedData");
const {
  computeAngleCompletionRate,
  computeAvgTurnaroundHours,
  computeMostMissedAngle,
  computeTurnaroundTrend,
} = require("../src/lib/stats");

const { techs, jobs } = generateSeedData();

function jobsFor(techId) {
  return jobs.filter((job) => job.techId === techId).sort((a, b) => a.date.localeCompare(b.date));
}

test("seed data shape", async (t) => {
  await t.test("generates 6 techs", () => {
    assert.equal(techs.length, 6);
  });

  await t.test("generates 144 jobs (24 per tech x 6 techs)", () => {
    assert.equal(jobs.length, 144);
  });

  await t.test("each tech has exactly 24 jobs", () => {
    for (const tech of techs) {
      assert.equal(
        jobs.filter((job) => job.techId === tech.id).length,
        24,
        `${tech.name} should have 24 jobs`
      );
    }
  });
});

test("seed data intentional patterns", async (t) => {
  const strong = techs.find((tech) => tech.pattern === "strong");
  const weakAngle = techs.find((tech) => tech.pattern === "weak-angle");
  const slowTurnaround = techs.find((tech) => tech.pattern === "slow-turnaround");
  const improving = techs.filter((tech) => tech.pattern === "improving");

  await t.test("strong tech has high angle completion (>= 90%)", () => {
    assert.ok(computeAngleCompletionRate(jobsFor(strong.id)) >= 90);
  });

  await t.test("weak-angle tech's most-missed angle is roofline", () => {
    assert.equal(computeMostMissedAngle(jobsFor(weakAngle.id)), "roofline");
  });

  await t.test("slow-turnaround tech averages >= 28h", () => {
    assert.ok(computeAvgTurnaroundHours(jobsFor(slowTurnaround.id)) >= 28);
  });

  await t.test("at least 3 improving techs are seeded", () => {
    assert.ok(improving.length >= 3);
  });

  await t.test("every improving tech's computed trend is actually 'improving'", () => {
    for (const tech of improving) {
      assert.equal(
        computeTurnaroundTrend(jobsFor(tech.id)),
        "improving",
        `${tech.name} should show an improving trend`
      );
    }
  });
});

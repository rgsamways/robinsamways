// Validates the generated seed data's shape and intentional patterns without
// any live Cosmos DB connection, per this change's migration plan ("validate
// shapes before wiring up the real SDK calls"). Run with: npm run test:seed-shape

const { generateSeedData } = require("./generateSeedData");
const {
  computeAngleCompletionRate,
  computeAvgTurnaroundHours,
  computeMostMissedAngle,
  computeTurnaroundTrend,
} = require("../src/lib/stats");

const { techs, jobs } = generateSeedData();

const failures = [];
function check(label, condition) {
  console.log(`${condition ? "PASS" : "FAIL"}: ${label}`);
  if (!condition) failures.push(label);
}

check("6 techs generated", techs.length === 6);
check("144 jobs generated (24 per tech x 6 techs)", jobs.length === 144);

for (const tech of techs) {
  check(`${tech.name} has 24 jobs`, jobs.filter((j) => j.techId === tech.id).length === 24);
}

const jobsByTech = Object.fromEntries(
  techs.map((tech) => [
    tech.id,
    jobs.filter((j) => j.techId === tech.id).sort((a, b) => a.date.localeCompare(b.date)),
  ])
);

console.log("\n=== Per-tech computed stats ===");
for (const tech of techs) {
  const techJobs = jobsByTech[tech.id];
  const angleRate = computeAngleCompletionRate(techJobs);
  const avgTurnaround = computeAvgTurnaroundHours(techJobs);
  const mostMissed = computeMostMissedAngle(techJobs);
  const trend = computeTurnaroundTrend(techJobs);
  console.log(
    `${tech.name} (${tech.pattern}): angleCompletion=${angleRate}%, avgTurnaround=${avgTurnaround}h, mostMissed=${mostMissed}, trend=${trend}`
  );
}

console.log("\n=== Intentional-pattern assertions ===");
const strong = techs.find((t) => t.pattern === "strong");
const weakAngle = techs.find((t) => t.pattern === "weak-angle");
const slowTurnaround = techs.find((t) => t.pattern === "slow-turnaround");
const improving = techs.filter((t) => t.pattern === "improving");

check(
  "Strong tech has high angle completion (>= 90%)",
  computeAngleCompletionRate(jobsByTech[strong.id]) >= 90
);
check(
  "Weak-angle tech's most-missed angle is roofline",
  computeMostMissedAngle(jobsByTech[weakAngle.id]) === "roofline"
);
check(
  "Slow-turnaround tech averages >= 28h",
  computeAvgTurnaroundHours(jobsByTech[slowTurnaround.id]) >= 28
);
check("At least 3 improving techs seeded", improving.length >= 3);
for (const tech of improving) {
  check(`${tech.name} (improving) trend is "improving"`, computeTurnaroundTrend(jobsByTech[tech.id]) === "improving");
}

console.log("\n" + (failures.length === 0 ? "ALL CHECKS PASSED" : `FAILURES: ${JSON.stringify(failures)}`));
process.exit(failures.length === 0 ? 0 : 1);

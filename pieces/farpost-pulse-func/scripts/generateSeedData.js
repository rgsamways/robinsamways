// Pure data generator — no Cosmos DB dependency, so the shapes can be
// validated locally (see checkSeedShape.js) before any live SDK call is made,
// per this change's own migration plan.

const TECHS = [
  { id: "tech-priya-nair", name: "Priya Nair", pattern: "strong" },
  { id: "tech-jordan-reyes", name: "Jordan Reyes", pattern: "weak-angle" },
  { id: "tech-riley-okafor", name: "Riley Okafor", pattern: "slow-turnaround" },
  { id: "tech-mateo-alvarez", name: "Mateo Alvarez", pattern: "improving" },
  { id: "tech-casey-thompson", name: "Casey Thompson", pattern: "improving" },
  { id: "tech-devon-clarke", name: "Devon Clarke", pattern: "improving" },
];

const PROPERTY_TYPES = ["Single-Family", "Multi-Family", "Commercial", "Rural/Acreage"];

const ANGLE_TYPES = [
  "exterior-front",
  "exterior-rear",
  "roofline",
  "foundation",
  "interior-kitchen",
  "interior-bath",
  "mechanical-room",
  "electrical-panel",
];

const JOBS_PER_TECH = 24;

function seededRandom(seed) {
  // Small deterministic PRNG (mulberry32) so a re-run produces the same
  // dataset — useful for the demo staying stable across reseeds.
  let state = seed;
  return function random() {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomInt(random, min, max) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function pick(random, arr) {
  return arr[randomInt(random, 0, arr.length - 1)];
}

function generateJobsForTech(random, tech, startDate) {
  const jobs = [];

  for (let i = 0; i < JOBS_PER_TECH; i++) {
    const progress = i / (JOBS_PER_TECH - 1); // 0 (first job) -> 1 (most recent)
    const date = new Date(startDate);
    date.setDate(date.getDate() + i * 7); // roughly weekly cadence

    let baseMissChance;
    let baseTurnaround;
    let roofline_bias = 0;

    switch (tech.pattern) {
      case "strong":
        baseMissChance = 0.03;
        baseTurnaround = 18;
        break;
      case "weak-angle":
        baseMissChance = 0.08;
        baseTurnaround = 22;
        roofline_bias = 0.65; // consistently misses roofline specifically
        break;
      case "slow-turnaround":
        baseMissChance = 0.05;
        baseTurnaround = 34;
        break;
      case "improving":
      default:
        // Miss chance and turnaround both start high and fall as progress -> 1.
        baseMissChance = 0.32 * (1 - progress);
        baseTurnaround = 30 - 12 * progress;
        break;
    }

    const anglesRequired = [...ANGLE_TYPES];
    const anglesMissed = anglesRequired.filter((angle) => {
      const chance = angle === "roofline" && roofline_bias > 0 ? roofline_bias : baseMissChance;
      return random() < chance;
    });

    const photosRequired = randomInt(random, 10, 14);
    const photosTaken = Math.max(0, photosRequired - anglesMissed.length - randomInt(random, 0, 1));
    const nfcTagsExpected = randomInt(random, 2, 4);
    const nfcTagsScanned = Math.max(0, nfcTagsExpected - (random() < baseMissChance ? 1 : 0));
    const turnaroundHours = Math.max(4, Math.round(baseTurnaround + randomInt(random, -4, 4)));

    jobs.push({
      id: `job-${tech.id}-${String(i).padStart(2, "0")}`,
      techId: tech.id,
      propertyType: pick(random, PROPERTY_TYPES),
      date: date.toISOString().slice(0, 10),
      photosRequired,
      photosTaken,
      anglesRequired,
      anglesMissed,
      nfcTagsExpected,
      nfcTagsScanned,
      turnaroundHours,
    });
  }

  return jobs;
}

function generateSeedData() {
  const random = seededRandom(20260710);
  const startDate = new Date("2026-01-05");

  const techs = TECHS.map(({ id, name, pattern }) => ({ id, name, role: "Field Technician", pattern }));
  const jobs = TECHS.flatMap((tech) => generateJobsForTech(random, tech, startDate));

  return { techs, jobs };
}

module.exports = {
  generateSeedData,
  ANGLE_TYPES,
  PROPERTY_TYPES,
};

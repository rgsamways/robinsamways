// Writes the generated seed data to the real Cosmos DB account. Run locally
// with a real COSMOS_CONNECTION_STRING in local.settings.json (or exported in
// the shell) via `npm run seed` — never run automatically, never part of the
// deployed Function App itself (see .funcignore).

const fs = require("fs");
const path = require("path");
const { CosmosClient } = require("@azure/cosmos");
const { generateSeedData } = require("./generateSeedData");

// Load local.settings.json's Values into process.env when running outside
// `func start` (which does this automatically), so `node scripts/seed.js`
// works the same way without extra tooling.
function loadLocalSettings() {
  const settingsPath = path.join(__dirname, "..", "local.settings.json");
  if (!fs.existsSync(settingsPath)) return;
  const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
  for (const [key, value] of Object.entries(settings.Values || {})) {
    if (!(key in process.env)) process.env[key] = value;
  }
}
loadLocalSettings();

const DATABASE_NAME = process.env.COSMOS_DATABASE_NAME || "farpost-pulse";

async function ensureContainer(database, id, partitionKeyPath) {
  const { container } = await database.containers.createIfNotExists({
    id,
    partitionKey: { paths: [partitionKeyPath] },
  });
  return container;
}

async function upsertAll(container, items, label) {
  let count = 0;
  for (const item of items) {
    await container.items.upsert(item);
    count += 1;
  }
  console.log(`  upserted ${count} ${label}`);
}

async function main() {
  const connectionString = process.env.COSMOS_CONNECTION_STRING;
  if (!connectionString) {
    console.error(
      "COSMOS_CONNECTION_STRING is not set. Add it to local.settings.json (see local.settings.json.example) or export it before running this script."
    );
    process.exit(1);
  }

  const client = new CosmosClient(connectionString);
  const { database } = await client.databases.createIfNotExists({
    id: DATABASE_NAME,
    throughput: 1000,
  });

  console.log(`Seeding Cosmos DB database "${DATABASE_NAME}"...`);

  const techsContainer = await ensureContainer(database, "techs", "/id");
  const jobsContainer = await ensureContainer(database, "jobs", "/techId");
  await ensureContainer(database, "coachingHistory", "/techId");

  const { techs, jobs } = generateSeedData();

  await upsertAll(techsContainer, techs, "techs");
  await upsertAll(jobsContainer, jobs, "jobs");

  console.log("Seed complete.");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

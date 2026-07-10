const { CosmosClient } = require("@azure/cosmos");

const DATABASE_NAME = process.env.COSMOS_DATABASE_NAME || "farpost-pulse";

let cachedClient;

function getClient() {
  if (!cachedClient) {
    const connectionString = process.env.COSMOS_CONNECTION_STRING;
    if (!connectionString) {
      throw new Error("COSMOS_CONNECTION_STRING is not set");
    }
    cachedClient = new CosmosClient(connectionString);
  }
  return cachedClient;
}

function getDatabase() {
  return getClient().database(DATABASE_NAME);
}

function getTechsContainer() {
  return getDatabase().container("techs");
}

function getJobsContainer() {
  return getDatabase().container("jobs");
}

function getCoachingHistoryContainer() {
  return getDatabase().container("coachingHistory");
}

module.exports = {
  DATABASE_NAME,
  getClient,
  getDatabase,
  getTechsContainer,
  getJobsContainer,
  getCoachingHistoryContainer,
};

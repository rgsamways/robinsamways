const { app } = require("@azure/functions");
const { getTechsContainer, getJobsContainer } = require("../lib/cosmosClient");
const { computeTagCompletionRate } = require("../lib/stats");

async function getJobsForTech(jobsContainer, techId) {
  const { resources } = await jobsContainer.items
    .query({
      query: "SELECT * FROM c WHERE c.techId = @techId",
      parameters: [{ name: "@techId", value: techId }],
    })
    .fetchAll();
  return resources;
}

app.http("techs", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "techs",
  handler: async (request, context) => {
    try {
      const techsContainer = getTechsContainer();
      const jobsContainer = getJobsContainer();

      const { resources: techs } = await techsContainer.items.readAll().fetchAll();

      const results = await Promise.all(
        techs.map(async (tech) => {
          const jobs = await getJobsForTech(jobsContainer, tech.id);
          return {
            id: tech.id,
            name: tech.name,
            role: tech.role,
            snapshotStat: {
              label: "Tag completion",
              value: computeTagCompletionRate(jobs),
              unit: "%",
            },
            jobCount: jobs.length,
          };
        })
      );

      return { jsonBody: results };
    } catch (error) {
      context.error("GET /api/techs failed:", error);
      return { status: 502, jsonBody: { error: "Unable to reach the data store right now" } };
    }
  },
});

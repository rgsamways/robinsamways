const { app } = require("@azure/functions");
const { getJobsContainer } = require("../lib/cosmosClient");

app.http("techJobs", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "techs/{id}/jobs",
  handler: async (request, context) => {
    const techId = request.params.id;

    try {
      const jobsContainer = getJobsContainer();
      const { resources: jobs } = await jobsContainer.items
        .query({
          query: "SELECT * FROM c WHERE c.techId = @techId ORDER BY c.date ASC",
          parameters: [{ name: "@techId", value: techId }],
        })
        .fetchAll();

      if (jobs.length === 0) {
        return { status: 404, jsonBody: { error: "No jobs found for this technician" } };
      }

      return { jsonBody: jobs };
    } catch (error) {
      context.error(`GET /api/techs/${techId}/jobs failed:`, error);
      return { status: 502, jsonBody: { error: "Unable to reach the data store right now" } };
    }
  },
});

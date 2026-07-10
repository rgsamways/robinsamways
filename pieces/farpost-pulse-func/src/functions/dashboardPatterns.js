const { app } = require("@azure/functions");
const { getTechsContainer, getJobsContainer } = require("../lib/cosmosClient");
const {
  computeTagCompletionRate,
  computeAvgTurnaroundHours,
  computeMostMissedAngle,
  computeTurnaroundTrend,
} = require("../lib/stats");

app.http("dashboardPatterns", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "dashboard/patterns",
  handler: async (request, context) => {
    try {
      const techsContainer = getTechsContainer();
      const jobsContainer = getJobsContainer();

      const { resources: techs } = await techsContainer.items.readAll().fetchAll();
      const { resources: allJobs } = await jobsContainer.items
        .query("SELECT * FROM c ORDER BY c.date ASC")
        .fetchAll();

      const techCompletionRates = techs.map((tech) => {
        const techJobs = allJobs.filter((job) => job.techId === tech.id);
        return {
          techId: tech.id,
          techName: tech.name,
          tagCompletionRate: computeTagCompletionRate(techJobs),
        };
      });

      const mostMissedAngleOrgWide = computeMostMissedAngle(allJobs);
      const avgTurnaroundHoursOrgWide = computeAvgTurnaroundHours(allJobs);
      const turnaroundTrendOrgWide = computeTurnaroundTrend(allJobs);

      return {
        jsonBody: {
          techCompletionRates,
          mostMissedAngleOrgWide,
          avgTurnaroundHoursOrgWide,
          turnaroundTrendOrgWide,
        },
      };
    } catch (error) {
      context.error("GET /api/dashboard/patterns failed:", error);
      return { status: 502, jsonBody: { error: "Unable to reach the data store right now" } };
    }
  },
});

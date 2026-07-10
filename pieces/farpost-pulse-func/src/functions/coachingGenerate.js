const { randomUUID } = require("crypto");
const { app } = require("@azure/functions");
const { getTechsContainer, getJobsContainer, getCoachingHistoryContainer } = require("../lib/cosmosClient");
const {
  computeAngleCompletionRate,
  computeAvgTurnaroundHours,
  computeMostMissedAngle,
  computeTurnaroundTrend,
} = require("../lib/stats");
const { generateCoachingTip } = require("../lib/generateCoachingTip");
const { isRateLimited, getClientIp } = require("../lib/rateLimiter");

const RECENT_JOB_COUNT = 8;

app.http("coachingGenerate", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "coaching/generate",
  handler: async (request, context) => {
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return { status: 429, jsonBody: { error: "Too many requests" } };
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return { status: 400, jsonBody: { error: "Invalid request body" } };
    }

    const techId = body && body.techId;
    if (!techId || typeof techId !== "string") {
      return { status: 400, jsonBody: { error: "techId is required" } };
    }

    try {
      const techsContainer = getTechsContainer();
      const jobsContainer = getJobsContainer();
      const coachingHistoryContainer = getCoachingHistoryContainer();

      let tech;
      try {
        const { resource } = await techsContainer.item(techId, techId).read();
        tech = resource;
      } catch (error) {
        if (error.code !== 404) throw error;
      }
      if (!tech) {
        return { status: 404, jsonBody: { error: "Technician not found" } };
      }

      const { resources: allJobs } = await jobsContainer.items
        .query({
          query: "SELECT * FROM c WHERE c.techId = @techId ORDER BY c.date DESC",
          parameters: [{ name: "@techId", value: techId }],
        })
        .fetchAll();

      if (allJobs.length === 0) {
        return { status: 404, jsonBody: { error: "No job history to base a tip on" } };
      }

      const recentJobs = allJobs.slice(0, RECENT_JOB_COUNT);
      const chronological = [...recentJobs].reverse();

      const techStats = {
        techName: tech.name,
        angleCompletionRate: computeAngleCompletionRate(recentJobs),
        mostMissedAngle: computeMostMissedAngle(recentJobs),
        avgTurnaroundHours: computeAvgTurnaroundHours(recentJobs),
        turnaroundTrend: computeTurnaroundTrend(chronological),
        jobCount: recentJobs.length,
      };

      const tip = generateCoachingTip(techStats);

      const coachingRecord = {
        id: randomUUID(),
        techId,
        generatedAt: new Date().toISOString(),
        tip,
        basedOnJobIds: recentJobs.map((job) => job.id),
      };
      await coachingHistoryContainer.items.create(coachingRecord);

      return {
        jsonBody: {
          tip,
          generatedAt: coachingRecord.generatedAt,
          basedOnJobIds: coachingRecord.basedOnJobIds,
        },
      };
    } catch (error) {
      context.error("POST /api/coaching/generate failed:", error);
      return { status: 502, jsonBody: { error: "Unable to generate a coaching tip right now" } };
    }
  },
});

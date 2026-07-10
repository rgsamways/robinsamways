// TODO: replace with a real Azure OpenAI call once the model deployment quota
// clears (Foundry project rgsamways-0644 / resource rgsamways-0644-resource —
// see docs/deployment-guide.md Part 8). Isolated in this one function so the
// swap later touches nothing else: same signature in, same string out.
const TIP_TEMPLATES = [
  (stats) =>
    `${stats.techName} is running ${stats.angleCompletionRate}% angle completion — solid. Keep the same pre-leave checklist habit going.`,
  (stats) =>
    stats.mostMissedAngle
      ? `${stats.techName}'s most commonly missed shot recently is ${stats.mostMissedAngle.replace(/-/g, " ")} — a quick mental checklist item before leaving site should close that gap.`
      : `${stats.techName} hasn't missed the same angle twice in a row recently — nice consistency.`,
  (stats) =>
    stats.turnaroundTrend === "improving"
      ? `${stats.techName}'s turnaround time has been trending down (now averaging ${stats.avgTurnaroundHours}h) — whatever changed in the routine recently, keep doing it.`
      : stats.turnaroundTrend === "declining"
        ? `${stats.techName}'s turnaround time has crept up to ${stats.avgTurnaroundHours}h on average — worth checking if a specific property type or day-of-week is behind the slowdown.`
        : `${stats.techName}'s turnaround is holding steady around ${stats.avgTurnaroundHours}h — consistent, no red flags.`,
  (stats) =>
    `Across the last ${stats.jobCount} jobs, ${stats.techName} is averaging ${stats.angleCompletionRate}% angle completion and ${stats.avgTurnaroundHours}h turnaround — a good baseline to compare next month against.`,
];

function generateCoachingTip(techStats) {
  const template = TIP_TEMPLATES[Math.floor(Math.random() * TIP_TEMPLATES.length)];
  return template(techStats);
}

module.exports = { generateCoachingTip };

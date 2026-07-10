function round1(value) {
  return Math.round(value * 10) / 10;
}

// Percentage of required angle-shots actually captured across a set of jobs.
function computeAngleCompletionRate(jobs) {
  const totalRequired = jobs.reduce((sum, job) => sum + job.anglesRequired.length, 0);
  const totalMissed = jobs.reduce((sum, job) => sum + job.anglesMissed.length, 0);
  if (totalRequired === 0) return null;
  return round1(((totalRequired - totalMissed) / totalRequired) * 100);
}

// Percentage of expected NFC tags actually scanned across a set of jobs —
// "tag completion," distinct from angle-shot completion above.
function computeTagCompletionRate(jobs) {
  const totalExpected = jobs.reduce((sum, job) => sum + job.nfcTagsExpected, 0);
  const totalScanned = jobs.reduce((sum, job) => sum + job.nfcTagsScanned, 0);
  if (totalExpected === 0) return null;
  return round1((totalScanned / totalExpected) * 100);
}

function computeAvgTurnaroundHours(jobs) {
  if (jobs.length === 0) return null;
  const total = jobs.reduce((sum, job) => sum + job.turnaroundHours, 0);
  return round1(total / jobs.length);
}

// The angle type missed most often across a set of jobs, or null if none missed.
function computeMostMissedAngle(jobs) {
  const counts = {};
  for (const job of jobs) {
    for (const angle of job.anglesMissed) {
      counts[angle] = (counts[angle] || 0) + 1;
    }
  }
  let topAngle = null;
  let topCount = 0;
  for (const [angle, count] of Object.entries(counts)) {
    if (count > topCount) {
      topAngle = angle;
      topCount = count;
    }
  }
  return topAngle;
}

// Compares turnaround in the first half of a chronologically-sorted job list
// against the second half to describe a simple directional trend.
function computeTurnaroundTrend(jobsSortedByDateAsc) {
  if (jobsSortedByDateAsc.length < 4) return "stable";
  const midpoint = Math.floor(jobsSortedByDateAsc.length / 2);
  const firstHalfAvg = computeAvgTurnaroundHours(jobsSortedByDateAsc.slice(0, midpoint));
  const secondHalfAvg = computeAvgTurnaroundHours(jobsSortedByDateAsc.slice(midpoint));
  const delta = secondHalfAvg - firstHalfAvg;
  if (delta <= -2) return "improving";
  if (delta >= 2) return "declining";
  return "stable";
}

module.exports = {
  computeAngleCompletionRate,
  computeTagCompletionRate,
  computeAvgTurnaroundHours,
  computeMostMissedAngle,
  computeTurnaroundTrend,
};

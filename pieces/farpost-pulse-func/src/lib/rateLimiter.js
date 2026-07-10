// Same in-memory, per-IP sliding-window pattern already used by Credential Flow's
// write endpoints (api/app/salesforce.py's _is_rate_limited/_client_ip) — not
// reliable across multiple Function App instances under real scale-out, an
// accepted limitation for a demo, cheap insurance against abuse regardless.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;

const hitsByIp = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  const recentHits = (hitsByIp.get(ip) || []).filter((timestamp) => timestamp > cutoff);

  if (recentHits.length >= RATE_LIMIT_MAX_REQUESTS) {
    hitsByIp.set(ip, recentHits);
    return true;
  }

  recentHits.push(now);
  hitsByIp.set(ip, recentHits);
  return false;
}

function getClientIp(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return "unknown";
}

module.exports = { isRateLimited, getClientIp, RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS };

## Context

Farpost Pulse's placeholder shipped as part of `method-narrative-navigation` (archived 2026-07-10), scoped there explicitly as "nav slot now, content later." This change is that later content. Robin separately provisioned real Azure infrastructure for it in a parallel session (Resource Group `farpost-pulse-rg`, Cosmos DB `farpost-pulse-cosmos`, Function App `farpost-pulse-func`, Azure OpenAI Foundry project `rgsamways-0644`) before this change was scoped, and a Drive doc describing that work was initially misread as implying Farpost Pulse needed its own separate repo/codebase — that was wrong, corrected in conversation with Robin, and this design reflects the corrected understanding: Farpost Pulse is a page on robinsamways.ca, same as Credential Flow, with its compute genuinely living on Azure rather than in this repo's own `api/`.

## Goals / Non-Goals

**Goals:**
- Replace the placeholder with a real, working three-route app that demonstrates genuine hands-on Node.js + Azure serverless + an AI SDK experience — the specific skill gap that motivated this whole project.
- Keep the frontend inside this repo (consistent with every other page on the site) while keeping the backend genuinely on Azure (consistent with the demo's actual purpose and with this repo's `CLAUDE.md` "Portfolio piece isolation" convention).
- Ship something fully functional and demoable today, without waiting on the Azure OpenAI quota increase.
- Correct the wrong "separate project" framing currently live on the `/narrative` index.

**Non-Goals:**
- Wiring in the real Azure OpenAI call — isolated in one function, swapped later once quota clears.
- Vector search across `coachingHistory` for cross-tech pattern matching — a stretch goal from the original concept doc; the `embedding` field can exist in the data model unused.
- Actually deploying the Function App code to Azure — this change delivers source code and configuration guidance; Robin deploys it himself, same way he provisioned the resources.
- Any change to Credential Flow, Farpost, Method, or Sreditor.

## Decisions

- **Backend is genuinely Azure Functions, not reimplemented in `api/`.** Considered and rejected: building the same functionality in this repo's existing Python/FastAPI/Postgres stack, which would be less work and avoid a second backend entirely. Rejected because it would defeat the demo's actual purpose — the point is proving Node.js + Azure serverless experience specifically, not "a coaching demo, technology unspecified." This also follows `CLAUDE.md`'s "Portfolio piece isolation" convention directly: a piece needing its own stack gets its own deployable, not merged into `api/`'s shared dependencies.
- **Frontend calls the Function App directly from the browser, not proxied through `api/`.** Unlike Credential Flow's relationship with Salesforce, there's no secret that needs hiding server-side here — the Function App holds its own Cosmos DB connection string and (later) Azure OpenAI key as its own application settings, never sent to the client. A direct client-to-serverless call is both simpler and a more honest demonstration of the architecture being shown off. The Function App's base URL is exposed via a `NEXT_PUBLIC_FARPOST_PULSE_API_URL` environment variable.
- **HTTP triggers use anonymous auth level.** Considered function-level keys, rejected: a key embedded in a public frontend's client-side JS is extractable by anyone regardless, so it provides no real protection here, only friction. Nothing sensitive is at stake — all data is seeded/fake. Anonymous is the honest choice for a public demo.
- **`POST /api/coaching/generate` gets a lightweight per-IP rate limiter**, matching the pattern already established for Credential Flow's write endpoints. In-memory, per Function App instance — acknowledged as not perfectly reliable across Flex Consumption's scale-out (a known, accepted limitation for a demo, not a production system), but cheap insurance against abuse, especially once the real Azure OpenAI call (which costs real money per request) is wired in later. `GET` endpoints stay unrate-limited; nothing they return is expensive to compute.
- **Cosmos DB partition keys**: `techs` partitioned by `/id`, `jobs` and `coachingHistory` both partitioned by `/techId` — the natural query pattern throughout is "give me everything for one tech."
- **Three routes, not one page.** Already settled with Robin directly: the roster, an individual tech's detail, and the aggregate dashboard are genuinely different interactive views a visitor navigates between, unlike Credential Flow's single scrolling case study. Method vs. Narrative decides *what kind of story*; page count is a separate, per-entry decision based on how much room the content needs.
- **Tags for the `/narrative` index entry**: Azure Functions, Cosmos DB, React. Azure OpenAI is deliberately excluded from the tags in this change, since the real call isn't live yet — added when the follow-up change wires it in, so tags stay accurate to what's actually true at any given time rather than aspirational.
- **Section structure**: Farpost Pulse is Narrative-type, so the Method-type PROBLEM/EXISTING_APPROACHES/HYPOTHESIS/METHOD/RESULTS/CONCLUSION structure (formalized in `method-index`) does not apply. It follows the same free-form case-study shape as Credential Flow and Farpost.

## Risks / Trade-offs

- [Anonymous-auth Function endpoints have no request authentication] → acceptable; all data is fake/seeded, and the rate limiter on the one write endpoint bounds abuse cost.
- [In-memory rate limiting isn't reliable across multiple Function App instances under real scale-out] → acceptable for a demo's realistic traffic; revisit if this ever needs production-grade guarantees (e.g., once ported toward farpost.ca).
- [Building against a mocked AI function means the "AI-generated" tips aren't real until the follow-up change lands] → acceptable and explicit; the mock is clearly marked with a `// TODO`, and everything else (data flow, UI, endpoints) is fully real and functional in the meantime.
- [CORS misconfiguration on the Function App would silently break the frontend once deployed] → mitigated by making CORS an explicit task with the exact origins needed (production domain + localhost), not left implicit.

## Migration Plan

1. Write the Azure Functions app source: the four HTTP-triggered endpoints, the Cosmos DB client wiring, the seed-data script, the mocked `generateCoachingTip()`, the rate limiter on the create-coaching endpoint.
2. Write the seed data generation script and run it against local/mock data first, per the original build brief's own suggested order — no live Cosmos DB connection needed to validate the data shapes before wiring up the real SDK calls.
3. Build the three Next.js routes in this repo, against the local/mock data initially, then against the real Function App endpoints once both sides are ready.
4. Document the CORS configuration Robin needs to apply on the Function App (exact origins), and the `NEXT_PUBLIC_FARPOST_PULSE_API_URL` environment variable this repo needs set in Vercel.
5. Correct the `/narrative` index's Farpost Pulse teaser and add its tags.
6. Robin deploys the Function App code to `farpost-pulse-func` himself and sets the frontend env var — outside this change's own scope, but documented clearly enough to hand off cleanly.

## Open Questions

- Exact wording for the landing page's case-study narrative prose (the curiosity-driven learning origin story, architecture rationale) — first-pass draft acceptable, same "flag if exact wording is wanted instead" pattern used on prior changes.
- Whether `POST /api/coaching/generate`'s rate limit threshold should match Credential Flow's exact numbers or be set independently — left to whoever implements this, using Credential Flow's existing limiter as a starting point.

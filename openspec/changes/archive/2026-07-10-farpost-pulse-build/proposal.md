## Why

Farpost Pulse currently exists only as a "coming soon" placeholder at `/narrative/farpost-pulse`, and its teaser text on the `/narrative` index incorrectly describes it as "a separate, already-scoped project" — a stale framing from earlier confusion, not accurate to how it's actually meant to work. Robin wanted genuine, current hands-on experience with React, Node.js, Azure serverless, and an AI SDK — not just familiarity on paper. Farpost Pulse exists to close that gap through real, hands-on building — a curiosity-driven learning project, not a response to any specific external party's feedback — and building it for real, not leaving it as a placeholder, is the actual point.

## What Changes

- Build the real Farpost Pulse app as three routes under `/narrative/farpost-pulse`, replacing the placeholder: a landing page (case-study narrative plus a tech roster), a per-tech detail page, and an org-wide dashboard page.
- Frontend lives in this repo (`web/src/app/narrative/farpost-pulse/`), same as every other page on the site. Backend is the already-provisioned Azure Functions app (`farpost-pulse-func`), genuinely running on Azure — reading/writing Cosmos DB (`farpost-pulse-cosmos`), called over HTTP from the Next.js frontend. This mirrors the existing relationship Credential Flow has with Salesforce: an external system this repo calls out to, not something reimplemented in this repo's own Python/FastAPI stack. Doing it any other way would defeat the demo's actual purpose (proving Node/Azure serverless experience specifically).
- AI coaching-tip generation is built against a stubbed/mocked function for this change — Azure OpenAI's model deployment is blocked on a quota increase (submitted, 1-2 business day turnaround as of 2026-07-10). The real call is isolated in one function, swapped in later as a small, separate follow-up.
- Correct the `/narrative` index's Farpost Pulse teaser (removing the "separate, already-scoped project" framing) and give it real tags, replacing its current placeholder entry.
- Seed data: 5-8 fake field techs with 20-30 jobs each, patterned so even mocked coaching tips look meaningful.
- **BREAKING**: `/narrative/farpost-pulse` stops rendering a placeholder; the route now serves real content with a different structure (three routes instead of one placeholder page).

## Capabilities

### New Capabilities
- `farpost-pulse`: the full app — three routes, the Cosmos DB data model, the Azure Functions endpoints, seed data, mocked coaching-tip generation, and the CORS requirement allowing this repo's frontend to call the Function App.

### Modified Capabilities
- `narrative-index`: the "Farpost Pulse placeholder route" requirement is replaced with a requirement describing its real content (three routes, not a placeholder); the index's teaser/scenario for Farpost Pulse updates to reflect real, accurate copy instead of "coming soon" and the incorrect "separate project" framing; Farpost Pulse's entry gains tags.

## Impact

- New routes: `web/src/app/narrative/farpost-pulse/page.tsx` (rewritten, was a placeholder), `web/src/app/narrative/farpost-pulse/[techId]/page.tsx`, `web/src/app/narrative/farpost-pulse/dashboard/page.tsx`.
- New Azure Functions app source (Node.js, HTTP-triggered functions, deployed separately to the already-provisioned `farpost-pulse-func` resource — not part of this repo's own Railway/Vercel deploy).
- `openspec/specs/narrative-index/spec.md`: delta as described above.
- New: `openspec/specs/farpost-pulse/spec.md`.
- No change to `api/`, Credential Flow, Farpost, Method, or Sreditor.

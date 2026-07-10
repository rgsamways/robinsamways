# farpost-pulse-func

Azure Functions (Node.js, Flex Consumption) backend for Farpost Pulse —
`web/src/app/narrative/farpost-pulse/`'s live data source. Deploys to the
already-provisioned `farpost-pulse-func` Azure resource; deployment and
production configuration steps live in `docs/deployment-guide.md` (Part 8a),
mirrored at `/ops/deploy` on the live site — this file just covers local dev.

## Local setup

```
npm install
cp local.settings.json.example local.settings.json
# fill in COSMOS_CONNECTION_STRING with a real value — never commit this file
npm run seed            # writes seed data to the real Cosmos DB
npm start                # runs the Function App locally (requires Azure Functions Core Tools)
```

## Verifying without a live Cosmos DB connection

Two scripts validate the code without ever touching Azure:

- `npm run test:seed-shape` — validates the generated seed data's shapes and
  intentional patterns (one strong tech, one weak-angle tech, one
  slow-turnaround tech, three improving techs) using pure functions only.
- `npm run test:handlers` — exercises all four HTTP handlers directly against
  an in-memory fake Cosmos client, including the coaching-tip generator and
  the per-IP rate limiter.

## Endpoints

- `GET /api/techs` — seeded technicians with a snapshot stat (tag completion).
- `GET /api/techs/{id}/jobs` — one technician's job history.
- `POST /api/coaching/generate` — generates and stores a mocked coaching tip
  (rate-limited per IP; see `src/lib/generateCoachingTip.js`'s `// TODO` for
  the real Azure OpenAI swap once quota clears).
- `GET /api/dashboard/patterns` — cross-tech aggregate stats.

All four run at anonymous auth level — see `openspec/changes/farpost-pulse-build/design.md`
for why.

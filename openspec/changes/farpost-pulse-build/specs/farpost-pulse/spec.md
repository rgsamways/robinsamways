## ADDED Requirements

### Requirement: Farpost Pulse landing page
The `/narrative/farpost-pulse` route SHALL render a landing page combining written case-study narrative (the a company feedback origin story, architecture rationale, tech stack reasoning) with a tech roster listing 5-8 seeded field technicians, each showing one snapshot stat and linking to that tech's own detail page.

#### Scenario: Visitor sees the roster
- **WHEN** a visitor loads `/narrative/farpost-pulse`
- **THEN** the page shows the case-study narrative and a roster of seeded technicians, each with a snapshot stat and a link to `/narrative/farpost-pulse/{techId}`

### Requirement: Tech detail page
The `/narrative/farpost-pulse/{techId}` route SHALL render one technician's job history table, a "Generate Coaching Tip" control, and a trend chart showing that technician's tag-completion or turnaround trend across their recent jobs.

#### Scenario: Visitor views a tech's job history and trend
- **WHEN** a visitor navigates to `/narrative/farpost-pulse/{techId}` for a valid seeded tech
- **THEN** the page shows that tech's job history table and a trend chart reflecting their last several jobs

#### Scenario: Visitor generates a coaching tip
- **WHEN** a visitor activates the "Generate Coaching Tip" control
- **THEN** the page shows a loading state, then displays a fresh tip returned by `POST /api/coaching/generate` for that tech

### Requirement: Dashboard page
The `/narrative/farpost-pulse/dashboard` route SHALL render org-wide charts aggregating stats across all seeded technicians: tag completion per tech, the most commonly missed angle type, and a turnaround trend.

#### Scenario: Visitor views the dashboard
- **WHEN** a visitor loads `/narrative/farpost-pulse/dashboard`
- **THEN** the page shows charts reflecting aggregated data returned by `GET /api/dashboard/patterns`

### Requirement: Cosmos DB data model
Farpost Pulse's Azure Functions backend SHALL store data in three Cosmos DB (NoSQL API) containers: `techs` (partitioned by `/id`), `jobs` (partitioned by `/techId`), and `coachingHistory` (partitioned by `/techId`), matching the FieldTech/Job/CoachingHistory shapes defined in this change's design.md.

#### Scenario: Job records are queryable by technician
- **WHEN** the backend queries jobs for a given `techId`
- **THEN** the query is scoped to that tech's partition, without a cross-partition fan-out

### Requirement: Seed data with intentional patterns
The Azure Functions backend SHALL be seeded with 5-8 fake field technicians and 20-30 jobs each, patterned so that at least one tech is consistently strong, at least one tech has a specific recurring weakness, and the remainder show gradual improvement across their job history.

#### Scenario: Trend chart reflects a genuine improvement pattern
- **WHEN** a visitor views the trend chart for a tech seeded with a gradual-improvement pattern
- **THEN** the chart shows an upward trend across that tech's job history, not flat or random data

### Requirement: Azure Functions HTTP endpoints
The Azure Functions app SHALL expose four HTTP-triggered, anonymous-auth endpoints: `GET /api/techs` (list all seeded techs with a snapshot stat), `GET /api/techs/{id}/jobs` (job history for one tech), `POST /api/coaching/generate` (generates and stores a coaching tip for a tech), and `GET /api/dashboard/patterns` (aggregated cross-tech stats).

#### Scenario: Listing techs returns seeded data
- **WHEN** a client sends `GET /api/techs`
- **THEN** the API returns the seeded technician list, each with a snapshot stat

#### Scenario: Coaching generation is rate-limited
- **WHEN** a client exceeds the configured per-IP submission rate on `POST /api/coaching/generate`
- **THEN** the API responds with 429 and does not generate or store a new tip for the excess requests

### Requirement: Mocked coaching-tip generation
`POST /api/coaching/generate`'s tip text SHALL be produced by a single isolated function, `generateCoachingTip(techStats)`, which in this change returns a canned or randomized tip from a small local array of examples rather than a real Azure OpenAI call, clearly marked with a comment indicating it is a placeholder pending model deployment quota.

#### Scenario: Generated tip is stored in history
- **WHEN** `generateCoachingTip()` returns a tip for a given tech
- **THEN** the tip is stored as a new `coachingHistory` record referencing that tech and the job records it was based on, before being returned to the caller

### Requirement: Cross-origin access from robinsamways.ca
The Azure Functions app SHALL be configured to accept cross-origin requests from robinsamways.ca's production domain and from localhost during development, so the Next.js frontend can call it directly from the browser.

#### Scenario: Browser request from the production domain succeeds
- **WHEN** a browser on robinsamways.ca's production domain sends a request to the Function App
- **THEN** the request succeeds without being blocked by a CORS preflight failure

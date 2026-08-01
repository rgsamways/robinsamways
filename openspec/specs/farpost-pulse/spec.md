# farpost-pulse Specification

## Purpose
TBD - created by archiving change farpost-pulse-build. Update Purpose after archive.
## Requirements
### Requirement: Farpost Pulse landing page
The `/techstacks/farpost-pulse` route SHALL render a landing page combining written case-study narrative (a curiosity-driven learning story — getting genuine hands-on time with a stack the author wanted to actually know, not just read about) with a tech roster listing 5-8 seeded field technicians, each showing one snapshot stat and linking to that tech's own detail page. The page SHALL briefly summarize the architecture rationale and tech-stack reasoning and link to the dedicated Architecture and Tech Stack pages for full depth, rather than carrying that detail in full itself. The narrative SHALL NOT reference any specific company, interview, or named individual — the framing is exploratory learning, not a response to feedback from any real party.

#### Scenario: Visitor sees the roster
- **WHEN** a visitor loads `/techstacks/farpost-pulse`
- **THEN** the page shows the case-study narrative and a roster of seeded technicians, each with a snapshot stat and a link to `/techstacks/farpost-pulse/{techId}`

#### Scenario: Visitor sees a brief architecture/stack summary linking to the full pages
- **WHEN** a visitor reads the landing page's architecture and tech-stack summary
- **THEN** the copy is brief and links to `/techstacks/farpost-pulse/architecture` and `/techstacks/farpost-pulse/tech-stack` for the full explanations

### Requirement: Tech detail page
The `/farpost/farpost-pulse/{techId}` route SHALL render one technician's job history table, a "Generate Coaching Tip" control, and a trend chart showing that technician's tag-completion or turnaround trend across their recent jobs.

#### Scenario: Visitor views a tech's job history and trend
- **WHEN** a visitor navigates to `/farpost/farpost-pulse/{techId}` for a valid seeded tech
- **THEN** the page shows that tech's job history table and a trend chart reflecting their last several jobs

#### Scenario: Visitor generates a coaching tip
- **WHEN** a visitor activates the "Generate Coaching Tip" control
- **THEN** the page shows a loading state, then displays a fresh tip returned by `POST /api/coaching/generate` for that tech

### Requirement: Dashboard page
The `/farpost/farpost-pulse/dashboard` route SHALL render org-wide charts aggregating stats across all seeded technicians: tag completion per tech, the most commonly missed angle type, and a turnaround trend.

#### Scenario: Visitor views the dashboard
- **WHEN** a visitor loads `/farpost/farpost-pulse/dashboard`
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

### Requirement: Tech Stack page documents Pulse's real technology choices
The `/techstacks/farpost-pulse/tech-stack` route SHALL document Pulse's real stack — Azure Functions (HTTP-triggered, anonymous-auth), Cosmos DB (NoSQL API), and the Next.js frontend — as the piece's stated purpose: genuine hands-on Azure serverless experience, not Python pretending to be Node.

#### Scenario: Visitor sees the real stack, not marketing language
- **WHEN** a visitor loads `/techstacks/farpost-pulse/tech-stack`
- **THEN** the page names Azure Functions, Cosmos DB, and the specific container partition scheme, rather than describing the piece only in generic "serverless" terms

### Requirement: Architecture page describes the Functions/Cosmos DB design
The `/techstacks/farpost-pulse/architecture` route SHALL describe the three Cosmos DB containers (`techs` partitioned by `/id`, `jobs` partitioned by `/techId`, `coachingHistory` partitioned by `/techId`), the four HTTP endpoints (`/api/techs`, `/api/techs/{id}/jobs`, `/api/coaching/generate`, `/api/dashboard/patterns`), and why job/coaching-history queries are scoped to a single tech's partition rather than a cross-partition fan-out.

#### Scenario: Visitor understands the partition scheme
- **WHEN** a visitor reads `/techstacks/farpost-pulse/architecture`
- **THEN** the copy explains each container's partition key and why per-tech queries avoid a cross-partition fan-out

### Requirement: Object Model page documents FieldTech, Job, and CoachingHistory
The `/techstacks/farpost-pulse/object-model` route SHALL document the `FieldTech`, `Job`, and `CoachingHistory` record shapes and how a generated coaching tip is stored as a `coachingHistory` record referencing both the tech and the job records it was based on.

#### Scenario: Visitor sees how a coaching tip links back to its source jobs
- **WHEN** a visitor loads `/techstacks/farpost-pulse/object-model`
- **THEN** the page shows that a stored `coachingHistory` record references the tech and the specific job records it was generated from

### Requirement: Design Notes page explains the seed-data patterning and the isolated tip-generation function
The `/techstacks/farpost-pulse/design-notes` route SHALL explain why seed data is patterned (consistent-strong, recurring-weakness, and gradual-improvement technicians) rather than randomized, and why coaching-tip generation is isolated behind a single `generateCoachingTip(techStats)` function boundary.

#### Scenario: Visitor understands why the tip function is isolated
- **WHEN** a visitor reads `/techstacks/farpost-pulse/design-notes`
- **THEN** the copy explains that isolating `generateCoachingTip()` behind one function boundary is what makes swapping in a real model call later a contained change, not a rewrite

### Requirement: AI Notes page discloses that coaching-tip generation is currently mocked
The `/techstacks/farpost-pulse/ai-notes` route SHALL cover, in order, how AI tooling was used to build Pulse, then how AI is used (and not yet used) inside Pulse itself: `generateCoachingTip()` currently returns a canned or randomized tip from a small local array rather than a real Azure OpenAI call, pending model deployment quota, and the page SHALL state this plainly rather than implying the tip generation is live AI today.

#### Scenario: Visitor reads an honest disclosure of the mock
- **WHEN** a visitor reads the product half of `/techstacks/farpost-pulse/ai-notes`
- **THEN** the copy states plainly that tip generation is currently mocked pending Azure OpenAI deployment quota, and describes the real, swappable function boundary the mock sits behind

### Requirement: Setup Gallery page shows real Azure configuration
The `/techstacks/farpost-pulse/setup-gallery` route SHALL show real screenshots of the genuine Azure configuration work behind Pulse (the Function App, Cosmos DB account and container setup, and CORS configuration for robinsamways.ca), each with a caption explaining what it shows and why it matters, per the site's established Setup Gallery pattern.

#### Scenario: Visitor sees real configuration screenshots, not staged ones
- **WHEN** a visitor loads `/techstacks/farpost-pulse/setup-gallery`
- **THEN** the page shows real screenshots of the actual Azure Function App and Cosmos DB configuration, not illustrative or staged images


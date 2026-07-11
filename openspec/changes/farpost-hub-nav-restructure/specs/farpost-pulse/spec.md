## MODIFIED Requirements

### Requirement: Farpost Pulse landing page
The `/farpost/farpost-pulse` route SHALL render a landing page combining written case-study narrative (a curiosity-driven learning story — getting genuine hands-on time with a stack the author wanted to actually know, not just read about — plus architecture rationale and tech stack reasoning) with a tech roster listing 5-8 seeded field technicians, each showing one snapshot stat and linking to that tech's own detail page. The narrative SHALL NOT reference any specific company, interview, or named individual — the framing is exploratory learning, not a response to feedback from any real party.

#### Scenario: Visitor sees the roster
- **WHEN** a visitor loads `/farpost/farpost-pulse`
- **THEN** the page shows the case-study narrative and a roster of seeded technicians, each with a snapshot stat and a link to `/farpost/farpost-pulse/{techId}`

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

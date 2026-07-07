## ADDED Requirements

### Requirement: FastAPI app skeleton with Postgres connectivity
The `/api` directory SHALL contain a FastAPI application using SQLModel for its data layer, configured to connect to a Postgres database via a connection string supplied through an environment variable.

#### Scenario: API starts and connects to Postgres
- **WHEN** the API is started with a valid `DATABASE_URL` environment variable pointing at a reachable Postgres instance
- **THEN** the app starts without errors and establishes a database connection

### Requirement: Health check endpoint
The API SHALL expose a `GET /health` endpoint that returns a 200 response confirming the service (and its database connection) is up.

#### Scenario: Health check succeeds
- **WHEN** a client sends `GET /health`
- **THEN** the API responds with HTTP 200 and a JSON body indicating the service and database are healthy

### Requirement: Railway deployment readiness
The `/api` app SHALL be structured so it can be deployed to Railway with minimal configuration: a `Procfile`, `railway.json`, or equivalent start command, plus dependency declaration (e.g. `requirements.txt` or `pyproject.toml`) sufficient for Railway's Python builder to install and run it.

#### Scenario: Railway can build and start the service
- **WHEN** the `/api` directory is deployed as a Railway service linked to a Railway Postgres addon
- **THEN** Railway installs dependencies, starts the app using the declared start command, and the `/health` endpoint responds successfully

### Requirement: No business endpoints beyond health check
The API SHALL NOT include any Salesforce, CRM, or other business-domain endpoints in this change — those are explicitly deferred to a later change.

#### Scenario: API surface is limited to infrastructure concerns
- **WHEN** the API's route table is inspected
- **THEN** only the health check endpoint (and any framework-default routes such as docs) are present

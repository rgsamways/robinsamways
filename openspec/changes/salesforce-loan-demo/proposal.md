## Why

Robin has a pre-recorded interview 2026-07-09 for Application Architect – CRM & LOS at Servus Credit Union, who run Salesforce Financial Services Cloud plus a Loan Origination System and are hiring specifically for their "Relationship Empowerment Platforms Team." Both `api-foundation` and `site-navigation` already carry explicit placeholders for this exact deferred piece — it's time to build it. A live, working Salesforce integration on the portfolio site is the single most direct piece of evidence Robin can point to during that interview.

## What Changes

- Provision a custom Loan Application object model in Robin's Salesforce Developer Edition org (`Loan_Application__c`, with lookups to standard Contact and Account objects), plus a Record-Triggered Flow providing basic status-workflow automation — built on standard objects rather than Financial Services Cloud or Agentforce, since those require paid licenses unavailable in a free Developer Edition org.
- Add a Salesforce REST API client to `/api` using raw `httpx` (not the `simple-salesforce` wrapper) implementing the OAuth 2.0 Client Credentials Flow with an in-memory, expiry-aware access-token cache.
- Add `GET /salesforce/loan-applications` (list) and `POST /salesforce/loan-applications` (create, rate-limited) endpoints to `/api`.
- Replace the `/portfolio` placeholder page with a real case-study write-up (the architecture, the Client Credentials Flow choice, the explicit Financial Services Cloud/Agentforce licensing limitation, and the structural parallel to Farpost's professional-reputation graph) plus a live demo widget that calls the new endpoints against Robin's real Salesforce org.

## Capabilities

### New Capabilities
- `salesforce-loan-demo`: The end-to-end Salesforce integration case study — the `Loan_Application__c` object model and its status-workflow Flow, the httpx-based OAuth2 Client Credentials Flow client with token caching, the `/salesforce/loan-applications` API endpoints, and the `/portfolio` page's case-study content and live demo widget.

### Modified Capabilities
- `api-foundation`: The requirement "No business endpoints beyond health check" currently excludes Salesforce endpoints explicitly, deferring them to "a later change." This is that change — the requirement is relaxed to also permit the `/salesforce/*` endpoints defined by `salesforce-loan-demo`.
- `site-navigation`: The Portfolio route currently must render a placeholder "coming soon" page. That scenario is superseded — the Portfolio route now renders the real case-study content and demo widget defined by `salesforce-loan-demo`.

## Impact

- Salesforce: new custom object (`Loan_Application__c`), custom fields, one Record-Triggered Flow, object/field permissions for the Client Credentials Flow "Run As" user, a handful of seed records — all provisioned manually via Salesforce Setup, not application code.
- `api`: new `salesforce.py` module (OAuth2 client, token cache, SOQL query + sobject create helpers), new route module, CORS middleware gains `GET` alongside existing `POST`, new env vars `SALESFORCE_DOMAIN` / `SALESFORCE_CLIENT_ID` / `SALESFORCE_CLIENT_SECRET` (local `.env` + Railway config vars), reuses the `contact-form` capability's honeypot + per-IP rate-limiting pattern for the public create endpoint.
- `web`: `portfolio/page.tsx` rewritten from placeholder to real content; new components for the case-study write-up and the live demo widget (list + create), styled per the existing monospace/`SectionHeader`/single-accent-color convention.
- `docs/stack.md`: Salesforce REST API + OAuth2 Client Credentials Flow added as a live runtime dependency.
- `docs/sreditor/`: an entry logging the `invalid_client_id` / External Client App registration issue encountered and resolved during this session's manual Salesforce setup (genuine technological uncertainty resolved through experimentation, per this repo's SR&ED convention).

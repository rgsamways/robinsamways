## MODIFIED Requirements

### Requirement: Portfolio case-study content
The `/techstacks/credential-flow` page (titled "Credential Flow", formerly "Salesforce Loan Demo") SHALL present a written case study, stating explicitly that Financial Services Cloud and Agentforce were not used because they require paid licenses unavailable in a free Developer Edition org. It SHALL briefly summarize the integration's architecture, the reason for choosing the OAuth 2.0 Client Credentials Flow and raw `httpx` over a wrapper library, and the structural parallel between this object model and Farpost's professional-reputation graph, linking to the dedicated Architecture, Design Notes, and Object Model pages for full depth, rather than carrying that detail in full itself as it did before this change.

#### Scenario: Licensing limitation is stated explicitly
- **WHEN** a visitor reads the `/techstacks/credential-flow` case study
- **THEN** the copy explicitly states that Financial Services Cloud and Agentforce were not used due to licensing, rather than implying full parity with a production Salesforce implementation

#### Scenario: Visitor sees a brief summary linking to the full design-reasoning page
- **WHEN** a visitor reads the landing page's summary of why OAuth 2.0 Client Credentials Flow and raw `httpx` were chosen
- **THEN** the copy is brief and links to `/techstacks/credential-flow/design-notes` for the full reasoning

## ADDED Requirements

### Requirement: Tech Stack page documents Credential Flow's real technology choices
The `/techstacks/credential-flow/tech-stack` route SHALL document Credential Flow's real stack — Salesforce Developer Edition, OAuth 2.0 Client Credentials Flow via raw `httpx`, the custom `Loan_Application__c` object, a Record-Triggered Flow for decision-date stamping, and the Anthropic API used for the recommended-next-action feature (per the `salesforce-relationship-view` capability).

#### Scenario: Visitor sees the real stack, not marketing language
- **WHEN** a visitor loads `/techstacks/credential-flow/tech-stack`
- **THEN** the page names the OAuth 2.0 Client Credentials Flow, raw `httpx`, and the Record-Triggered Flow specifically, rather than describing the piece only in generic "Salesforce integration" terms

### Requirement: Architecture page describes the OAuth token lifecycle and the CRUD endpoint surface
The `/techstacks/credential-flow/architecture` route SHALL describe the OAuth 2.0 Client Credentials token lifecycle (fetch on first call, cache and reuse until expiry, refresh on expiry), the four HTTP endpoints (list, create, scoped status-only update, status-gated delete), and the layered protections on write endpoints (honeypot, minimum-fill-time, per-IP rate limiting, profanity blocklist, and Archived-record delete protection).

#### Scenario: Visitor understands the token caching behavior
- **WHEN** a visitor reads `/techstacks/credential-flow/architecture`
- **THEN** the copy explains that a cached token is reused across calls and only refreshed once expired, rather than re-fetching a token on every request

#### Scenario: Visitor understands why Archived records can't be deleted
- **WHEN** a visitor reads the architecture page's delete-endpoint section
- **THEN** the copy explains that the API checks a record's Status server-side and refuses to delete Archived (seed) records regardless of caller

### Requirement: Object Model page documents the Loan Application schema and its parallel to Farpost's reputation graph
The `/techstacks/credential-flow/object-model` route SHALL document the `Loan_Application__c` object's fields and lookups (Applicant, Account, Amount Requested, Status, Submitted Date, Decision Date), the automated decision-date-stamping Flow, and the structural parallel between this object model and Farpost's professional-reputation graph (per the `salesforce-relationship-view` capability's Field History Tracking timeline).

#### Scenario: Visitor sees the field list and the automated stamping behavior
- **WHEN** a visitor loads `/techstacks/credential-flow/object-model`
- **THEN** the page shows every `Loan_Application__c` field and states that Decision Date is stamped automatically by a Flow when Status changes to Approved or Denied, not by manual entry

### Requirement: Design Notes page explains the OAuth/httpx choice and the licensing limitation
The `/techstacks/credential-flow/design-notes` route SHALL explain why the OAuth 2.0 Client Credentials Flow was implemented via direct `httpx` calls rather than a Salesforce SDK/wrapper library, and SHALL restate the Financial Services Cloud/Agentforce licensing limitation with the specific reasoning behind each design choice this constraint drove (e.g. calling the Anthropic API directly instead of using Agentforce for the recommended-next-action feature).

#### Scenario: Visitor understands the httpx-over-wrapper reasoning
- **WHEN** a visitor reads `/techstacks/credential-flow/design-notes`
- **THEN** the copy explains the specific reason raw `httpx` was chosen over a Salesforce wrapper library for the token client

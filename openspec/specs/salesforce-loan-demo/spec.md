# salesforce-loan-demo Specification

## Purpose
TBD - created by archiving change salesforce-loan-demo. Update Purpose after archive.
## Requirements
### Requirement: Loan Application object model in Salesforce
Robin's Salesforce Developer Edition org SHALL contain a custom `Loan_Application__c` object with a lookup to the standard Contact object (Applicant), a lookup to the standard Account object, an Amount Requested currency field, a Status picklist (Draft, Submitted, Under Review, Approved, Denied), a Submitted Date field, and a Decision Date field.

#### Scenario: Loan Application record links an Applicant and an Account
- **WHEN** a `Loan_Application__c` record is created with an Applicant (Contact) and an Account
- **THEN** the record stores both lookups and both related records can be traversed from it

### Requirement: Automated decision-date stamping
A Record-Triggered Flow SHALL set `Decision_Date__c` to the current date automatically when a `Loan_Application__c` record's `Status__c` changes to Approved or Denied.

#### Scenario: Decision date is stamped on approval
- **WHEN** a `Loan_Application__c` record's Status changes from Under Review to Approved
- **THEN** its Decision Date field is automatically set to the current date without manual entry

#### Scenario: Decision date is stamped on denial
- **WHEN** a `Loan_Application__c` record's Status changes from Under Review to Denied
- **THEN** its Decision Date field is automatically set to the current date without manual entry

#### Scenario: Decision date is untouched by other status changes
- **WHEN** a `Loan_Application__c` record's Status changes to any value other than Approved or Denied
- **THEN** its Decision Date field is not modified by the Flow

### Requirement: OAuth 2.0 Client Credentials Flow token client
The API SHALL authenticate to Salesforce using the OAuth 2.0 Client Credentials Flow via direct `httpx` calls to the org's token endpoint, and SHALL cache the resulting access token in memory, reusing it until it is expired or about to expire rather than requesting a new token for every call.

#### Scenario: Token is fetched on first Salesforce call
- **WHEN** the API makes its first Salesforce API call since starting
- **THEN** it first requests an access token from Salesforce's OAuth token endpoint using the configured Consumer Key and Secret, then uses that token for the Salesforce API call

#### Scenario: Cached token is reused
- **WHEN** the API makes a second Salesforce API call while the previously fetched token is still valid
- **THEN** it reuses the cached token without requesting a new one

#### Scenario: Expired token is refreshed
- **WHEN** the API makes a Salesforce API call after the cached token has expired
- **THEN** it requests a new access token before making the call

### Requirement: List loan applications endpoint
The API SHALL expose a `GET /salesforce/loan-applications` endpoint that queries Salesforce for existing `Loan_Application__c` records and returns them as JSON, including the Applicant name, Account name, Amount Requested, Status, Submitted Date, and Decision Date.

#### Scenario: Listing returns live Salesforce data
- **WHEN** a client sends `GET /salesforce/loan-applications`
- **THEN** the API queries Salesforce via its cached OAuth token and returns the current set of Loan Application records as JSON

### Requirement: Create loan application endpoint
The API SHALL expose a `POST /salesforce/loan-applications` endpoint that creates a new `Loan_Application__c` record in Salesforce from the submitted Applicant, Account, Amount Requested, and Status values, stamping the Submitted Date server-side, and SHALL apply the same honeypot, minimum-fill-time, and per-IP rate-limiting protections used by the `contact-form` capability's `POST /contact` endpoint, plus a profanity blocklist check on the Applicant and Account name fields.

#### Scenario: Valid submission creates a real Salesforce record
- **WHEN** a client sends `POST /salesforce/loan-applications` with valid Applicant, Account, Amount Requested, and Status values
- **THEN** the API creates a new `Loan_Application__c` record in Salesforce with the submitted Status (defaulting to Draft if omitted), stamps Submitted Date to the current date, and returns a success response including the new record's identifier

#### Scenario: Status is restricted to the settable values
- **WHEN** a client submits a Status value that is not one of Draft, Submitted, Under Review, Approved, or Denied (in particular, Archived)
- **THEN** the API rejects the submission with a 422 and does not create a Salesforce record — Archived is reachable only by editing Salesforce directly, never through this endpoint

#### Scenario: Honeypot-filled submission is silently dropped
- **WHEN** a submission arrives with the honeypot field populated
- **THEN** the API does not create a Salesforce record and returns a success-looking response

#### Scenario: Excess requests from the same IP are rejected
- **WHEN** a client exceeds the configured submission rate from the same IP address
- **THEN** the API responds with 429 and does not create a Salesforce record for the excess requests

#### Scenario: Submission containing a blocked word is rejected
- **WHEN** a client submits an Applicant or Account name containing a word from the profanity blocklist, matched on whole-word boundaries
- **THEN** the API rejects the submission with a generic 422, without revealing that the rejection was specifically due to content moderation

### Requirement: Scoped Status-only update endpoint
The API SHALL expose a `PATCH /salesforce/loan-applications/{id}` endpoint that updates only the Status field of an existing `Loan_Application__c` record, restricted to the same settable Status values as creation, and SHALL apply the same per-IP rate-limiting as the create endpoint.

#### Scenario: Valid status update
- **WHEN** a client sends `PATCH /salesforce/loan-applications/{id}` with a Status value from Draft, Submitted, Under Review, Approved, or Denied
- **THEN** the API updates only the record's Status field in Salesforce, leaving every other field (including Decision Date, which remains exclusively Flow-controlled) untouched

#### Scenario: Archived or invalid status value is rejected
- **WHEN** a client sends a Status value that is not one of the settable values (in particular, Archived)
- **THEN** the API rejects the request with a 422 and does not call Salesforce

### Requirement: Status-gated delete endpoint
The API SHALL expose a `DELETE /salesforce/loan-applications/{id}` endpoint that permanently deletes a `Loan_Application__c` record in Salesforce, but SHALL first check the record's current Status server-side and refuse to delete it if the Status is Archived, since Archived records (the original seed data) must remain permanently protected from public deletion regardless of what any client sends.

#### Scenario: Non-Archived record is deleted
- **WHEN** a client sends `DELETE /salesforce/loan-applications/{id}` for a record whose current Status is not Archived
- **THEN** the API deletes the record in Salesforce and it no longer appears in subsequent list results

#### Scenario: Archived record is protected from deletion
- **WHEN** a client sends `DELETE /salesforce/loan-applications/{id}` for a record whose current Status is Archived, regardless of whether the request originates from the site's own UI or a direct API call
- **THEN** the API responds with 403 and does not call Salesforce's delete operation — the record continues to exist afterward

#### Scenario: Unknown or malformed record id
- **WHEN** a client sends `DELETE` or `PATCH` for a record id that doesn't exist, or that doesn't match Salesforce's id format
- **THEN** the API responds with 404 (unknown id) or 422 (malformed id) without attempting a Salesforce call for a malformed id

### Requirement: Sortable, filterable, paginated live demo table
The live demo widget's table SHALL support click-to-sort on every displayed column, a Status filter (including Archived, for visibility of the seed records), and pagination at 10 records per page with a total-results counter, applied client-side over the already-fetched list.

#### Scenario: Sorting and filtering compose
- **WHEN** a visitor filters the table to a specific Status and then sorts by another column
- **THEN** the displayed rows reflect both the filter and the sort order together

#### Scenario: Pagination reflects the true total
- **WHEN** the filtered/sorted result set contains more than 10 records
- **THEN** the table shows only the current page's 10 records, with a counter reflecting the true total and Previous/Next controls that stay in range as the filter changes or a record is created/updated/deleted

### Requirement: Portfolio case-study content
The `/narrative/credential-flow` page (titled "Credential Flow", formerly "Salesforce Loan Demo") SHALL present a written case study covering the architecture of this integration, the reason for choosing the OAuth 2.0 Client Credentials Flow and raw `httpx` over a wrapper library, an explicit statement that Financial Services Cloud and Agentforce were not used because they require paid licenses unavailable in a free Developer Edition org, and the structural parallel between this object model and Farpost's professional-reputation graph.

#### Scenario: Licensing limitation is stated explicitly
- **WHEN** a visitor reads the `/narrative/credential-flow` case study
- **THEN** the copy explicitly states that Financial Services Cloud and Agentforce were not used due to licensing, rather than implying full parity with a production Salesforce implementation

### Requirement: Live demo widget on the Portfolio page
The `/narrative/credential-flow` page SHALL include a live demo widget that fetches and displays current Loan Application records from `GET /salesforce/loan-applications`, and allows a visitor to trigger `POST /salesforce/loan-applications` to create a new demo record, with loading, success, and error states.

#### Scenario: Visitor views live data
- **WHEN** a visitor loads the `/narrative/credential-flow` page
- **THEN** the demo widget fetches and renders the current list of Loan Application records from the live Salesforce org

#### Scenario: Visitor triggers a demo creation
- **WHEN** a visitor uses the demo widget's create action
- **THEN** the widget calls `POST /salesforce/loan-applications`, shows a loading state, and then shows either a success confirmation with the new record reflected in the list or an error state


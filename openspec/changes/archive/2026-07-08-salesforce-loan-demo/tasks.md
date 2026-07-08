## 1. Salesforce: object model (manual, Robin — not a CLI/code task)

- [x] 1.1 Create custom object `Loan_Application__c` (label "Loan Application")
- [x] 1.2 Add lookup field to standard Contact object, labeled "Applicant"
- [x] 1.3 Add lookup field to standard Account object
- [x] 1.4 Add `Amount_Requested__c` currency field
- [x] 1.5 Add `Status__c` picklist field with values: Draft, Submitted, Under Review, Approved, Denied (default Draft)
- [x] 1.6 Add `Submitted_Date__c` date field
- [x] 1.7 Add `Decision_Date__c` date field
- [x] 1.8 Build a Record-Triggered Flow on `Loan_Application__c`: when `Status__c` changes to Approved or Denied, set `Decision_Date__c` to TODAY() — verified both branches live (Approved and Denied seed records both got auto-stamped; an "Under Review" record correctly did not)
- [x] 1.9 Grant the Client Credentials Flow "Run As" user (`rgsamways.4eb74f70474f@agentforce.com`) read/create/edit object permissions and field-level security on `Loan_Application__c` and its fields — System Administrator profile already had full object/field access by default; confirmed rather than changed
- [x] 1.10 Create 2-3 seed `Loan_Application__c` records (each linked to a Contact and Account) with varied Status values so the demo has real data on first load — 3 created (Approved, Under Review, Denied)
- [x] 1.11 Smoke-test: confirm a manual token request + SOQL query against `Loan_Application__c` returns the seed data before handing off to the API work below — confirmed live via PowerShell, `totalSize: 3`

## 2. API: Salesforce OAuth2 client

- [x] 2.1 Add `api/app/salesforce.py` implementing the OAuth 2.0 Client Credentials Flow token request via `httpx` (grant_type=client_credentials, client_id, client_secret, posted to `{SALESFORCE_DOMAIN}/services/oauth2/token`)
- [x] 2.2 Implement an in-memory access-token cache (token + expiry) that reuses a valid token and refetches only when expired or about to expire
- [x] 2.3 Add `SALESFORCE_DOMAIN`, `SALESFORCE_CLIENT_ID`, `SALESFORCE_CLIENT_SECRET` to `api/.env.example` and document them for local `.env`
- [x] 2.4 Implement a SOQL query helper against Salesforce's REST API (`/services/data/vXX.0/query`) for listing `Loan_Application__c` records with their related Contact/Account names
- [x] 2.5 Implement an sobject-create helper against Salesforce's REST API (`/services/data/vXX.0/sobjects/Loan_Application__c`) for creating a new record

## 3. API: routes

- [x] 3.1 Add `GET /salesforce/loan-applications` returning Applicant name, Account name, Amount Requested, Status, Submitted Date, and Decision Date for each record
- [x] 3.2 Add `POST /salesforce/loan-applications` accepting Applicant, Account, and Amount Requested, creating a Draft-status record in Salesforce
- [x] 3.3 Apply the same honeypot + minimum-fill-time + per-IP sliding-window rate limiting used by `POST /contact` to `POST /salesforce/loan-applications`
- [x] 3.4 Add `GET` to the CORS middleware's allowed methods in `api/app/main.py` (currently `POST`-only)
- [x] 3.5 Handle Salesforce API/token errors as clean 4xx/5xx responses without leaking the Consumer Key/Secret or raw Salesforce error bodies to the client

## 4. Web: portfolio case-study page

- [x] 4.1 Replace `web/src/app/portfolio/page.tsx` placeholder with the case-study write-up: architecture overview, why Client Credentials Flow + raw httpx, explicit Financial Services Cloud/Agentforce licensing-limitation statement, and the Farpost professional-reputation-graph parallel
- [x] 4.2 Build a demo widget component that fetches `GET /salesforce/loan-applications` on load and renders the list (Applicant, Account, Amount, Status, Submitted Date, Decision Date) in the site's monospace/`SectionHeader` styling
- [x] 4.3 Add a "create a demo application" action wired to `POST /salesforce/loan-applications` with loading/success/error states, refreshing the list on success
- [x] 4.4 Ensure the page matches the existing single-accent-color, monospace/terminal design language used elsewhere on the site

## 5. Verification

- [ ] 5.1 Load `/portfolio` locally and confirm the live list renders real data from Salesforce — requires real `SALESFORCE_DOMAIN`/`CLIENT_ID`/`CLIENT_SECRET` and section 1's object model; CLI has neither. Verified the widget's rendering logic instead against a local mock server shaped like the real endpoint response (list render, create flow, loading/success/error states all correct) — Robin's to confirm against the real org.
- [ ] 5.2 Trigger the create action and confirm the new record appears both in Salesforce (verify in Setup UI) and in the page's list — same access gap as 5.1; Robin's to confirm.
- [x] 5.3 Confirm honeypot-filled and rate-limit-exceeding submissions are handled per spec (silently dropped / 429) — verified against the real `api/app/salesforce.py` route code (fake but realistic env vars): honeypot/too-fast submissions return 201 without ever attempting a Salesforce call (confirmed via server log); burst of 10 requests triggers 429 after the 5-request/60s threshold.
- [x] 5.4 Confirm a request from a disallowed origin is blocked by CORS — verified via preflight: `GET` now in `access-control-allow-methods`, allowed origin gets `access-control-allow-origin`, disallowed origin gets rejected with no CORS header.
- [x] 5.5 Run `npm run build` in `/web` and confirm it succeeds
- [x] 5.6 Update `docs/stack.md` to record the Salesforce REST API and OAuth 2.0 Client Credentials Flow as a live runtime dependency
- [x] 5.7 Log the `invalid_client_id` / External Client App registration issue encountered and resolved this session in `docs/sreditor/`, per this repo's SR&ED convention — `docs/sreditor/2026/2026-07-07-salesforce-external-client-app-invalid-client-id.md`

## 6. Deploy

- [ ] 6.1 Add `SALESFORCE_DOMAIN`, `SALESFORCE_CLIENT_ID`, `SALESFORCE_CLIENT_SECRET` to Railway's `/api` service config vars
- [ ] 6.2 Push and confirm Railway redeploys `/api` with the new endpoints; confirm `/health` still returns 200
- [ ] 6.3 Push and confirm Vercel redeploys `/web` with the new Portfolio page
- [ ] 6.4 Load production `/portfolio` and confirm the live demo widget works end-to-end against the real Salesforce org

## 1. Salesforce: Field History Tracking (manual, Robin — not a CLI/code task)

- [ ] 1.1 Enable Field History Tracking on `Loan_Application__c` (Object Manager → Loan Application → Details → "Track Field History"), then enable it specifically for `Status__c` in the field's own edit page
- [ ] 1.2 Add the "Loan Application History" related list to the Loan Application page layout, so history entries are visible/verifiable in Setup too, not just via API
- [ ] 1.3 Smoke-test: change a record's Status in Setup (e.g. Under Review → Approved), confirm a new `Loan_Application__History` entry appears with the correct old value, new value, and timestamp — do this before CLI builds the API/UI on top of it

## 2. API: Anthropic client + new endpoints

- [x] 2.1 Add `api/app/ai.py` implementing a small Anthropic API client via raw `httpx` (matching `salesforce.py`'s existing "show the mechanics" pattern, not the `anthropic` SDK) — `POST https://api.anthropic.com/v1/messages`, headers `content-type: application/json`, `x-api-key: {ANTHROPIC_API_KEY}`, `anthropic-version: 2023-06-01`, model `claude-haiku-4-5`, `max_tokens` around 150, no streaming, no tools
- [x] 2.2 Add `ANTHROPIC_API_KEY` to `api/.env.example` and document it for local `.env`, following the existing `SALESFORCE_*`/`RESEND_API_KEY` pattern
- [x] 2.3 Add a SOQL query helper in `api/app/salesforce.py` for Account-grouped Loan Applications — same `LOAN_APPLICATION_FIELDS` shape as `list_loan_applications`, but including `Account__c`/`Account__r.Name` for grouping and ordered so applications for the same Account are adjacent
- [x] 2.4 Add a SOQL query helper for a single application's `Status__c` history — query `Loan_Application__History` filtered to `Field = 'Status__c'` and the given `ParentId`, ordered by `CreatedDate`, returning old value, new value, and timestamp per entry
- [x] 2.5 Add `GET /salesforce/accounts` (or similar) returning Loan Applications grouped by Account, reusing the query helper from 2.3
- [x] 2.6 Add `GET /salesforce/loan-applications/{id}/history` returning the real Field History Tracking entries from 2.4
- [x] 2.7 Add `GET /salesforce/loan-applications/{id}/recommendation` — fetches the application's Status and Submitted Date, calls the Anthropic client from 2.1 with a short prompt describing that context, returns the generated suggestion as plain text
- [x] 2.8 Apply the existing per-IP rate limiter (reuse `_is_rate_limited`/`_client_ip`) to the recommendation endpoint — it costs real Anthropic API spend per call, unlike the read-only history/account endpoints
- [x] 2.9 Handle Anthropic API errors (timeout, non-200, malformed response) as a clean 502 without leaking the API key or raw response body to the client

## 3. Web: relationship view UI

- [x] 3.1 Build an Account-grouped relationship view component under `web/src/components/portfolio/` — lets a visitor select an Account and see its Loan Applications grouped together, fetching from `GET /salesforce/accounts`
- [x] 3.2 Add a "recommended next action" display per application (e.g. an expand/button that fetches `GET /salesforce/loan-applications/{id}/recommendation` on demand, not automatically for every row) with loading/success/error states
- [x] 3.3 Add a real status-change timeline display per application, fetching `GET /salesforce/loan-applications/{id}/history` and rendering each entry as old value → new value with its timestamp
- [x] 3.4 Wire the new components into `web/src/app/portfolio/page.tsx`, alongside the existing `LIVE_DEMO` section
- [x] 3.5 Add portfolio page copy explicitly tying the Field History Tracking timeline back to the existing `FARPOST_PARALLEL` section's "computed from events, not a stored score" framing
- [x] 3.6 Match the existing monospace/single-accent-color/`SectionHeader`/`InfoTooltip` design language used elsewhere on the site

## 4. Verification

- [x] 4.1 Run `npm run build` in `/web` and confirm it succeeds
- [x] 4.2 Confirm the recommendation endpoint is rate-limited per the same rules as create/update
- [x] 4.3 Confirm the history endpoint returns an appropriate empty state (not an error) for an application with no Status changes since tracking was enabled
- [x] 4.4 Update `docs/stack.md` to record the Anthropic API and Salesforce Field History Tracking as live runtime dependencies

## 5. Deploy

- [ ] 5.1 Add `ANTHROPIC_API_KEY` to Railway's `/api` service config vars
- [ ] 5.2 Push and confirm Railway redeploys `/api` with the new endpoints; confirm `/health` still returns 200
- [ ] 5.3 Push and confirm Vercel redeploys `/web` with the new relationship-view UI
- [ ] 5.4 Load production `/portfolio` and confirm the Account-grouped view, AI recommendation, and real Field History Tracking timeline all work end-to-end against the real Salesforce org and real Anthropic API

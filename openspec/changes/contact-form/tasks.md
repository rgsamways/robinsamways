## 1. API: data model and persistence

- [x] 1.1 Add `ContactSubmission` SQLModel (name, email, message, created_at, ip_address) to `api/app/models.py`
- [x] 1.2 Confirm `init_db` picks up the new table on next deploy (mirrors how `Ping` was added)

## 2. API: contact endpoint

- [x] 2.1 Add CORS middleware to `api/app/main.py` restricted to `https://robinsamways.ca`, `https://www.robinsamways.ca`, `http://localhost:3000`
- [x] 2.2 Add `POST /contact` route with a Pydantic/SQLModel request schema (name, email, message, honeypot field, client-rendered-at timestamp)
- [x] 2.3 Implement server-side validation (non-empty fields, valid email format) returning 4xx on failure
- [x] 2.4 Implement honeypot + minimum-fill-time check that silently no-ops (still returns success) without persisting or notifying
- [x] 2.5 Implement in-memory per-IP sliding-window rate limiter returning 429 on excess
- [x] 2.6 Persist valid submissions to Postgres before attempting the email send
- [x] 2.7 Send notification email via Resend REST API (httpx), catching and logging failures without failing the request
- [x] 2.8 Add `RESEND_API_KEY` usage matching the existing Railway env var (already configured from the deployment work) — confirm no new env var needed

## 3. Web: contact form UI

- [x] 3.1 Build `Contact` component styled per the existing `##`-marker section convention (matches Profile/Experience/Skills styling)
- [x] 3.2 Add name/email/message fields, hidden honeypot field, and a form-rendered-at timestamp captured on mount
- [x] 3.3 Implement client-side validation (required fields, email format) with inline error states
- [x] 3.4 Wire submission to `POST /contact` on the API origin, with loading/success/error states and no full page reload
- [x] 3.5 Insert the Contact section into the homepage after Continuing Education and before the footer

## 4. Verification

- [x] 4.1 Submit a valid test entry end-to-end locally (web dev server → local or Railway API) and confirm a row appears in Postgres and an email arrives via Resend
- [x] 4.2 Confirm a submission with the honeypot filled is silently dropped (no DB row, no email, still a success response)
- [x] 4.3 Confirm rate limiting triggers a 429 after exceeding the configured threshold
- [x] 4.4 Confirm a request from a disallowed origin is blocked by CORS
- [x] 4.5 Run `npm run build` in `/web` and confirm it still succeeds with the new section
- [x] 4.6 Update `docs/stack.md` to record Resend's transactional-send API as a live runtime dependency (not just account/DNS config)

## 5. Deploy

- [ ] 5.1 Push and confirm Railway redeploys `/api` with the new table/route
- [ ] 5.2 Push and confirm Vercel redeploys `/web` with the new section
- [ ] 5.3 Submit a real test entry against production and confirm end-to-end delivery

## Why

The homepage currently lists an email/phone as static text but gives a visitor no lower-friction way to reach out. A contact form turns a passive resume page into something a recruiter can act on directly, and the infra to support it (Resend for outbound email, Postgres for persistence) is already live in production.

## What Changes

- Add a Contact section to the homepage, styled consistently with the existing `##`-marker section convention (Profile, Experience, Skills, Education), containing a name / email / message form.
- Add a `POST /contact` endpoint to the API that validates the submission, stores it in Postgres, and sends a notification email to Robin via Resend.
- Narrow the existing `api-foundation` restriction that limits the API to only the health check endpoint — this change is the deferred "later change" that restriction anticipated.

## Capabilities

### New Capabilities
- `contact-form`: End-to-end contact form capability — the homepage form, the `POST /contact` API endpoint, a `ContactSubmission` DB table, and a Resend email notification sent on each submission.

### Modified Capabilities
- `resume-homepage`: Adds a Contact section to the homepage, placed after Continuing Education and before the footer.
- `api-foundation`: Relaxes "No business endpoints beyond health check" to explicitly permit the `POST /contact` endpoint added by `contact-form`, while still excluding Salesforce/CRM/other business-domain endpoints.

## Impact

- `web`: new `Contact` component + client-side form state/submission handling; homepage layout gains one section.
- `api`: new route module, new SQLModel table (`ContactSubmission`), Resend API integration (`RESEND_API_KEY` env var already configured in Railway from the deployment work), basic validation (non-empty fields, valid email format) and rate limiting to deter spam submissions.
- `docs/stack.md`: add Resend's transactional-send API as a runtime dependency (already listed for the deployment guide's inbound/outbound email split, but this is its first actual runtime use from application code rather than just Cloudflare/Resend account config).

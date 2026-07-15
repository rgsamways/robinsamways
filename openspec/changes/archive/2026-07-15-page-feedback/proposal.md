## Why

There's currently no way for a visitor to react to what they're looking at on any page except the homepage (which has its own, separate contact form). Robin wants a lightweight way to hear a reaction — a quick positive/negative signal, a short comment, or a critique of the idea/concept/code on that specific page — without building a separate form per page.

## What Changes

- Add one reusable feedback widget, rendered at the bottom of every page except the homepage, via the root layout — so it applies automatically to every current and future page with zero per-page wiring.
- The widget captures: an optional positive/negative reaction, an optional free-text comment, and the current page's path automatically — a visitor must provide at least one of reaction or comment to submit.
- Feedback is private: stored in Postgres and emailed to Robin via Resend, the same pattern the existing contact form already uses. It is never displayed back to visitors (no public comments, no moderation-for-display concern).
- Reuses and extracts the contact form's existing anti-spam pattern (honeypot + minimum-fill-time + per-IP rate limiting) into shared backend helpers, so `/contact` and the new `/feedback` endpoint both use one implementation instead of two copies.
- Also extracts the contact form's Resend-sending logic into a shared helper for the same reason.

## Capabilities

### New Capabilities
- `page-feedback`: the feedback widget's presence/placement, its submission behavior, and the private storage+notification behavior of its backend endpoint.

### Modified Capabilities
(none — `contact-form`'s requirements don't change; its implementation is refactored to share helpers, not its behavior)

## Impact

- `web/src/app/layout.tsx` — renders the new widget after `{children}`, self-excluding on `/`.
- `web/src/components/FeedbackWidget.tsx` (new) + a pure validation helper + its Vitest suite.
- `api/app/feedback.py` (new) — `POST /feedback` endpoint, mirroring `contact.py`'s shape.
- `api/app/models.py` — new `FeedbackSubmission` table.
- `api/app/rate_limit.py` (new, extracted from `contact.py`) + `api/app/notify.py` (new, extracted from `contact.py`) — `contact.py` updated to use both; its own behavior unchanged.
- `api/app/main.py` — registers the new feedback router.
- New pytest coverage for `/feedback`, mirroring `tests/test_loan_applications.py`'s `TestClient` pattern (currently, `/contact` itself has no dedicated pytest coverage — this change doesn't retroactively add that, only covers the new endpoint).
- New Playwright e2e coverage for the widget's presence/absence and submission flow.
- `docs/metrics.md` + `web/src/data/metrics.json` — new `scc` snapshot appended at archive time.

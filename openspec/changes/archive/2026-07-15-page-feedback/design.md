## Context

The homepage already has a contact form (`ContactForm.tsx` + `POST /contact`) with an established, working pattern: client-side validation, a honeypot + minimum-fill-time anti-bot check, per-IP rate limiting, Postgres persistence before a best-effort Resend notification email, and success shown without a full reload. Robin confirmed the new feedback feature should follow the same private-to-him, email-notified shape — not public comments — so this is largely the same pattern applied to a second, much simpler form, rendered everywhere instead of once.

A second existing precedent, `salesforce.py`'s loan-application endpoint, uses `moderation.py`'s `contains_blocked_word` check on free text — but only because that text lands in a live public demo record other visitors can see. Feedback text is never displayed to anyone but Robin (via email), so that check doesn't apply here; this is closer to `/contact`'s trust model than the loan demo's.

## Goals / Non-Goals

**Goals:**
- One feedback widget, rendered automatically at the bottom of every page except the homepage, with zero per-page configuration.
- A visitor can submit a positive/negative reaction, a comment, or both — but not neither.
- Feedback reaches Robin the same way contact form submissions do: persisted, then emailed.
- Deduplicate the anti-spam/rate-limiting and Resend-sending logic that `/feedback` would otherwise copy from `/contact`.

**Non-Goals:**
- Public display of feedback, or any moderation-for-display logic (blocked-word filtering) — not needed for private, email-only content.
- An admin page for browsing feedback history — Robin chose email-per-submission, matching the contact form.
- Any change to `/contact`'s own behavior — its logic is refactored to use shared helpers, but its requirements/behavior are unchanged.
- Per-page customization of the widget (different copy/fields on different pages) — it's one engine, identical everywhere it renders.

## Decisions

**1. The widget lives in `layout.tsx`, self-excluding on the homepage — not copy-pasted into each page.**
`FeedbackWidget.tsx` is a client component rendered once, after `{children}`, in `web/src/app/layout.tsx` (alongside `Header`). It calls `usePathname()` (already used by `FarpostTabBar`) and renders `null` when the path is `/`. This is what makes it "one engine" in the literal sense Robin asked for: a new page added anywhere in the app gets the widget automatically, with no page-level code to write or forget.

**2. Backend shape mirrors `/contact` almost exactly: a new `FeedbackSubmission` table, a `POST /feedback` endpoint, persist-then-notify, honeypot + fill-time + rate limiting.**
Fields: `page: str` (the submitting page's path, sent by the client, not inferred server-side — the server has no other way to know which page a browser POST came from), `sentiment: "positive" | "negative" | None`, `comment: str | None`, `ip_address`, `created_at`. Server-side validation requires a non-empty `page`, and requires at least one of `sentiment` or a non-empty (post-trim) `comment` — matching the "not neither" UI rule so a client-side bug can't silently produce empty rows. `comment` is capped at 2000 characters server-side (a new, small defensive limit `/contact`'s own `message` field doesn't have — reasonable here since this endpoint is reachable from every page with no login, a larger anonymous attack surface than one homepage form).

**3. Extract the anti-spam rate-limiter and the Resend-sending call into shared helpers; `/contact` moves onto them too.**
`contact.py` today has its own private `_is_rate_limited`/`_client_ip`/`_rate_limit_hits` and its own inline `_send_notification_email`. Rather than paste both into `feedback.py`, extract:
- `api/app/rate_limit.py`: a small `RateLimiter` (window seconds, max requests) that `contact.py` and `feedback.py` each instantiate separately (so a burst of feedback submissions can't exhaust `/contact`'s budget or vice versa — separate buckets, shared implementation) plus the shared `_client_ip` extraction.
- `api/app/notify.py`: `send_email(subject: str, text: str, reply_to: str | None = None) -> None`, wrapping the existing Resend `httpx` call. Both endpoints build their own subject/body text and call this.
`contact.py` is updated to call both instead of its own private copies — its endpoint behavior, response shape, and existing tests' expectations are unchanged; this is a pure internal refactor, the same kind of extraction already done for `CodeBlock`/`filterSections`/`PillBar` on the frontend.

**4. Widget UI: one form, not two separate interactions.**
A single `<form>`: two toggle buttons (lucide-react `ThumbsUp`/`ThumbsDown`, matching the theme-toggle's precedent of using lucide icons rather than emoji) where at most one can be selected at a time and either can be deselected by clicking it again, plus a `<textarea>` for an optional comment, plus one "Send feedback" submit button — disabled until at least one of reaction-selected or comment-non-empty is true. Alternative considered: instant-submit-on-click reaction buttons, separate from a comment form — rejected as two different interaction models on one small widget, and harder to reconcile with the honeypot/fill-time anti-bot check, which assumes a single submit event.

**5. A pure `canSubmitFeedback(sentiment, comment)` function backs the submit-button's disabled state, unit-tested directly.**
Mirrors this project's established pattern (`filterSections`, `resolveInitialTheme`) of keeping the one piece of actual logic pure and testable, with the surrounding component as a thin, untested-by-unit-test wrapper — covered instead by e2e.

## Risks / Trade-offs

- **[Risk]** A feedback widget on every page, unauthenticated, is a bigger anonymous-submission surface than one homepage contact form. → **Mitigation**: same anti-spam pattern as `/contact` (honeypot, fill-time, per-IP rate limit) applied per-endpoint, plus the new comment length cap; no new attack surface pattern, just wider reach of an already-trusted one.
- **[Risk]** Refactoring `contact.py` to use the new shared helpers touches working, already-shipped code with no dedicated pytest coverage of its own today. → **Mitigation**: the refactor is behavior-preserving by construction (same logic, moved not changed); manually re-verify `/contact` still works via the same live-service check method already used elsewhere on this project for un-mocked integrations, and the new `/feedback` pytest suite exercises the now-shared helpers indirectly.
- **[Risk]** Rendering the widget from the root layout means it mounts on every navigation, including pages with heavy client-side content (e.g. Farpost Atlas's Leaflet map) — a badly-behaved widget could add jank. → **Mitigation**: it's a small, self-contained form with no polling/animation/effects beyond mount-time state, the same complexity class as `ThemeToggle` or `MenuToggle`, both of which already run on every page without issue.

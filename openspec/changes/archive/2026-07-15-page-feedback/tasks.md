## 1. Shared backend helpers (extracted from contact.py)

- [x] 1.1 Create `api/app/rate_limit.py`: a `RateLimiter` (configurable window/max-requests) plus the `_client_ip(request)` helper, extracted from `contact.py`'s existing private implementation with no behavior change.
- [x] 1.2 Create `api/app/notify.py`: `send_email(subject: str, text: str, reply_to: str | None = None) -> None`, extracted from `contact.py`'s existing `_send_notification_email`'s Resend `httpx` call, generalized to take a subject/body instead of contact-specific fields.
- [x] 1.3 Update `api/app/contact.py` to instantiate its own `RateLimiter` from `rate_limit.py` and call `notify.send_email(...)` instead of its own private copies; confirm its request/response shape and existing behavior are unchanged.

## 2. Feedback data model and endpoint

- [x] 2.1 Add `FeedbackSubmission` to `api/app/models.py`: `id`, `page: str`, `sentiment: str | None`, `comment: str | None`, `ip_address: str`, `created_at`, mirroring `ContactSubmission`'s shape.
- [x] 2.2 Create `api/app/feedback.py`: `POST /feedback` accepting `page`, optional `sentiment` (`"positive"` | `"negative"`), optional `comment` (max 2000 chars), `honeypot`, `rendered_at` — validates `page` is non-empty and at least one of `sentiment`/non-empty `comment` is present, applies the honeypot/fill-time check and its own `RateLimiter` instance (separate bucket from `/contact`'s), persists to Postgres, then calls `notify.send_email(...)` with the page, sentiment, and comment.
- [x] 2.3 Register the new router in `api/app/main.py`.

## 3. Feedback widget (frontend)

- [x] 3.1 Create a pure `canSubmitFeedback(sentiment: "positive" | "negative" | null, comment: string): boolean` helper (e.g. in `web/src/components/FeedbackWidget.tsx` or a small sibling module) and its Vitest unit test covering: reaction only, comment only, both, neither.
- [x] 3.2 Create `web/src/components/FeedbackWidget.tsx`: a client component using `usePathname()` to read the current page (rendering `null` on `/`), a form with two lucide-react (`ThumbsUp`/`ThumbsDown`) toggle buttons (mutually exclusive, deselectable), a comment `<textarea>`, and a submit button gated by `canSubmitFeedback`. Includes the honeypot field and a `rendered_at` timestamp captured on mount, matching `ContactForm.tsx`'s existing anti-bot pattern. Shows an inline success confirmation on submit, without a page reload.
- [x] 3.3 Render `<FeedbackWidget />` in `web/src/app/layout.tsx`, after `{children}`.

## 4. Test coverage

- [x] 4.1 Confirm the Vitest suite from task 3.1 passes via `npm run test`.
- [x] 4.2 Add `api/tests/test_feedback.py` (mirroring `tests/test_loan_applications.py`'s `TestClient` pattern): valid submission with only sentiment, valid with only comment, rejected when both are absent, honeypot-filled submission silently dropped, rate limit independent of `/contact`'s.
- [x] 4.3 Run the full `pytest` suite in `api/` and confirm `/contact`'s existing tests still pass unmodified after the task 1.3 refactor.
- [x] 4.4 Add a new Playwright e2e spec: widget renders on a non-homepage page, does not render on `/`, submit button stays disabled with neither field filled, and a mocked successful submission (via `page.route`, consistent with this project's existing mocked-backend e2e convention) shows the success confirmation without a reload.
- [x] 4.5 Run `npm run build` in `web/` and confirm a clean build.

## 5. Metrics and wrap-up

- [x] 5.1 Run `scc` against `web/src`, `api`, and `pieces`; append the new snapshot to `docs/metrics.md` (date, change name, headline numbers, one-line delta from the previous snapshot) and to `web/src/data/metrics.json`.
- [x] 5.2 If the new snapshot's DRYness drops below 55% or falls more than 10 points from the previous snapshot, log it as an open item in `docs/issues.md` per `CLAUDE.md`'s scc convention.
- [x] 5.3 Report status back to Robin for the drift audit against `openspec/specs/page-feedback/spec.md` before archiving.

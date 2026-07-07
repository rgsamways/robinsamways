## Context

`/web` (robinsamways.ca, Vercel) and `/api` (api.robinsamways.ca, Railway) are separate origins — the API currently has no CORS middleware because its only route, `/health`, has never needed to be called from the browser. This is the first browser-originated request to `/api`, so CORS becomes a real decision here, not boilerplate.

Resend is already live for the deployment guide's outbound mail (`RESEND_API_KEY` set in Railway), but nothing in application code calls it yet — this change is Resend's first use as a runtime dependency rather than just account/DNS configuration.

## Goals / Non-Goals

**Goals:**
- A visitor can submit name/email/message from the homepage and have it reliably captured, even if the notification email fails or is delayed (see the Cloudflare Email Routing debugging earlier this build — email delivery has already proven to be a place where things silently go wrong).
- Robin gets notified promptly by email when someone submits the form.
- Basic spam resistance without adding a CAPTCHA dependency this close to the interview deadline.

**Non-Goals:**
- No admin UI to browse past submissions (a raw DB query is enough for now; a list view is a future lightbulb, not in scope here).
- No file attachments, threading/reply-in-app, or multi-recipient routing.

## Decisions

**DB write happens before the email send, and the email failing does not fail the request.** The submission is the durable record; the email is a best-effort notification. If Resend is down or slow, the visitor still gets a success response and the row is in Postgres — this directly addresses today's discovery that email delivery can fail silently. If the Resend call throws, catch it, log it, and still return 201.

**CORS is restricted to the known web origins**, not `allow_origins=["*"]`: `https://robinsamways.ca`, `https://www.robinsamways.ca`, and `http://localhost:3000` for local dev. A public API with a wildcard origin plus a POST endpoint is an easy spam/abuse vector; there's no reason a browser anywhere else needs to call this endpoint.

**Spam mitigation via a honeypot field + minimum fill-time check, not a CAPTCHA.** A hidden form field (real users never fill it; bots often do) combined with rejecting submissions faster than ~2 seconds after the form rendered catches the bulk of naive bots with zero added dependency or user friction. If spam becomes a real problem post-launch, revisit with Cloudflare Turnstile (already on Cloudflare, free, no third-party script from another vendor).

**Resend called via direct REST API call (`httpx`), not the `resend` Python SDK.** `/api`'s dependency list is currently minimal (FastAPI, SQLModel, asyncpg); a one-endpoint REST POST doesn't justify an extra SDK dependency. `httpx` is already a transitive dependency of FastAPI's test client ecosystem and is a natural fit for the one async HTTP call needed.

**Rate limiting is a simple in-memory per-IP sliding window**, not Redis-backed. Railway's single API instance and this endpoint's low expected volume make an in-memory limiter sufficient; a distributed limiter would be over-engineering for a resume site's contact form.

## Risks / Trade-offs

- [In-memory rate limiting resets on every deploy/restart] → Acceptable; the goal is deterring casual spam bursts, not airtight protection. Revisit only if abuse is actually observed.
- [Honeypot + timing check is a weak spam filter compared to a CAPTCHA] → Acceptable trade-off for shipping speed before the interview; the DB record means even a spam submission is at worst noise, not data loss.
- [Resend call failing silently means Robin might miss a real submission notification] → Mitigated by the DB write happening first and always succeeding independently — worst case, Robin checks the DB and finds it, rather than losing the submission entirely.

## Open Questions

- None blocking — flagged here if spam volume or the honeypot's effectiveness turns out to need revisiting after launch.

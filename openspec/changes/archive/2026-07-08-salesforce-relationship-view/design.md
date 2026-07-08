## Context

`salesforce-loan-demo` shipped a flat list + create + scoped Status-update against a `Loan_Application__c` object. It's a real, working integration, but structurally it's just one table. This change adds three read-only extensions chosen specifically because they map to Servus's actual stated priorities (a "Relationship Empowerment Platforms Team" and an in-progress Agentforce/Deloitte pilot), not because they're generically impressive features.

## Goals / Non-Goals

**Goals:**
- Demonstrate relationship-centric data modeling (Account → many Loan Applications) as a real, navigable view, not just implied by the underlying lookups.
- Demonstrate AI-assisted workflow using tools Robin genuinely has access to (Anthropic API), as an honest analog to Agentforce rather than a claim of using it.
- Demonstrate a real Salesforce audit-trail capability (Field History Tracking) rather than fabricating a timeline from the two date fields already on the object.
- Keep all three additions read-only against Salesforce — no new write surface.

**Non-Goals:**
- Not attempting to use or simulate Salesforce Agentforce itself — it isn't licensed on this Developer Edition org, and pretending otherwise would contradict the honesty already established in `LICENSING_LIMITATIONS`.
- Not building a general-purpose relationship graph UI — this is one specific, small Account → Loan Applications grouping, not a reusable component.
- Not adding authentication/visitor accounts to scope who sees what — everything remains public, same as the existing demo.
- Not persisting AI suggestions anywhere — generated fresh per request, not stored, matching the site's existing "compute fresh, don't store a derived judgment" instinct already established for Farpost's reputation graph.

## Decisions

- **Field History Tracking over a derived timeline.** Salesforce's own audit-trail feature (`Loan_Application__History`, auto-created when field history tracking is enabled on `Status__c`) gives genuine old-value/new-value/timestamp records. Deriving a fake timeline from just `Submitted_Date__c`/`Decision_Date__c` would be strictly less impressive and less honest — it wouldn't show intermediate status transitions (e.g. Submitted → Under Review) at all.
- **Anthropic API called directly, not through an SDK abstraction**, consistent with the existing `salesforce.py` pattern of using raw `httpx` for Salesforce itself — same "show the mechanics" instinct applied consistently.
- **AI suggestions generated on-demand, not cached/stored.** Each request to the recommendation endpoint calls the Anthropic API fresh. This avoids a new persistence concern and keeps the feature's cost/complexity bounded — acceptable for demo-scale traffic given the same rate-limiting pattern already used elsewhere.
- **Account-grouped view reuses the existing `list_loan_applications` SOQL pattern**, just grouped by `Account__c` rather than flat — no new Salesforce object or field needed, purely a query/presentation change.
- **All three features are GET-only new surface.** No change to the existing Create/Status-update write paths, and no new write endpoints — keeps the abuse-risk profile unchanged from what was already decided in `salesforce-loan-demo`.

## Risks / Trade-offs

- [A new `ANTHROPIC_API_KEY` becomes a second third-party API cost/dependency alongside Salesforce] → Bounded by the same per-IP rate limiting pattern used elsewhere; demo-scale traffic keeps cost negligible.
- [Field History Tracking must be enabled manually in Salesforce Setup before the timeline endpoint has any data to show] → Sequenced as the first task in this change's Salesforce section, same "Robin does this manually first" pattern as the original object model.
- [The AI recommendation could occasionally produce an awkward or unhelpful suggestion, since it's live-generated, not curated] → Low stakes for a demo (worst case: a slightly generic suggestion, not a broken page) — no fallback beyond standard error-state handling needed.
- [Field History Tracking retention/behavior specifics in a Developer Edition org haven't been verified yet] → First Salesforce task includes a smoke test (change a record's Status, confirm a history entry appears) before building the API/UI on top of it, same pattern as the original Flow smoke test.

## Migration Plan

N/A — additive, read-only extension to an already-shipped capability. No existing data or write paths change.

## Open Questions

- Whether the Account-grouped view replaces the flat list or sits alongside it as a second mode/tab — leaning toward "alongside," implementation detail to confirm when building the UI.

## Anthropic API integration specifics

- **Model: `claude-haiku-4-5`.** This is a short, single-turn, no-tool-use suggestion (~1 sentence) generated from a small structured context (status, days-in-status, submitted date) — Haiku 4.5 is fast and cheap ($1/$5 per MTok vs. $3/$15 intro-priced for Sonnet 5 or $5/$25 for Opus 4.8) with no thinking/effort overhead to configure, which fits a public demo endpoint where cost exposure should stay low regardless of traffic. Don't default to Opus 4.8 here — that guidance is for general-purpose/quality-sensitive work, not a one-line templated suggestion.
- **Endpoint (raw httpx, matching `salesforce.py`'s existing pattern):** `POST https://api.anthropic.com/v1/messages`, headers `content-type: application/json`, `x-api-key: {ANTHROPIC_API_KEY}`, `anthropic-version: 2023-06-01`. Body: `{"model": "claude-haiku-4-5", "max_tokens": 150, "messages": [{"role": "user", "content": "..."}]}`. No streaming, no tools, no thinking config needed (Haiku 4.5 doesn't support adaptive thinking/effort — irrelevant for this task anyway).
- **Rate/cost exposure:** standard tier-based API rate limits apply automatically, but the real risk for a public demo is unbounded *request volume* driving up Anthropic API spend, not hitting a rate limit. Reuse the existing per-IP sliding-window rate limiter (`_is_rate_limited`/`_client_ip` from `salesforce.py`) on the new recommendation endpoint — same pattern already applied to Salesforce create/update.

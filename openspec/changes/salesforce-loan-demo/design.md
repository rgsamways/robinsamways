## Context

Servus Credit Union runs Salesforce Financial Services Cloud plus a Loan Origination System, ran an Agentforce pilot with Deloitte, and is hiring for a "Relationship Empowerment Platforms Team" — the role Robin is interviewing for. FSC and Agentforce both require paid licenses not available in a free Salesforce Developer Edition org, so this change cannot and does not attempt to literally replicate Servus's stack. It builds the closest honest approximation on standard objects, and says so explicitly in the case-study copy rather than implying parity it doesn't have.

Earlier this session, a Salesforce Developer Edition org was created and an External Client App ("Loan Demo 2") was configured for the OAuth 2.0 Client Credentials Flow, confirmed working end-to-end via a manual token request. The Loan Application object model itself does not exist yet — that's part of this change's task list, done manually in Salesforce Setup rather than through application code.

The existing site already anticipated this change: `api-foundation`'s spec explicitly defers "Salesforce, CRM, or other business-domain endpoints" to "a later change," and `site-navigation` already has a `/portfolio` route rendering a placeholder. This change is that later change.

## Goals / Non-Goals

**Goals:**
- A working, live Salesforce integration reachable from the public site, backed by a real (if simplified) object model in Robin's own org.
- Demonstrate OAuth 2.0 Client Credentials Flow protocol mechanics directly (raw `httpx`, explicit token handling), not just library usage.
- An honest case-study narrative: what was built, why it's simplified relative to Servus's actual stack, and the structural parallel to Farpost's professional-reputation graph.
- Reuse this site's own established conventions (rate limiting, monospace/terminal styling, env var patterns) rather than introducing new ones.

**Non-Goals:**
- No attempt to replicate Financial Services Cloud, Agentforce, or any other licensed product — explicitly out of reach on a free Developer Edition org.
- No Apex code for the status-workflow behavior — a declarative Record-Triggered Flow is sufficient and also demonstrates comfort with Salesforce's low-code automation tooling, relevant to an Architect role that bridges both.
- No general-purpose Salesforce SDK or abstraction layer — this is a narrow client for exactly the endpoints this demo needs, not a reusable library.
- No user accounts or per-visitor data — the demo widget operates against one shared set of records in Robin's dev org.

## Decisions

- **Raw `httpx` instead of `simple-salesforce`.** The point of this case study is to demonstrate OAuth2 protocol mechanics — token requests, expiry, refresh — not to show that a Python package can be installed. A wrapper library would hide exactly the mechanics worth showing.
- **OAuth 2.0 Client Credentials Flow, with an in-memory expiry-aware token cache.** This is a server-to-server integration with no user in the loop, matching how a backend service would actually call Salesforce in production. The API process caches the access token and its expiry in memory and only refetches when it's expired or about to expire, rather than fetching a fresh token per request — this is the detail that actually demonstrates understanding of the flow's lifecycle, not just its happy path.
- **Custom `Loan_Application__c` object on standard Contact/Account, not Financial Services Cloud.** A lookup-based custom object with a Status picklist is enough to demonstrate the relationship model (Applicant → Loan Application → Account) and status-driven automation without needing licenses this org doesn't have. The case-study copy states this limitation explicitly.
- **A Record-Triggered Flow, not an Apex trigger, for the status-workflow behavior** (`Decision_Date__c` auto-populated when `Status__c` moves to Approved or Denied). Chosen deliberately to show fluency in Salesforce's declarative automation, which is a distinct, relevant skill for an Architect role, not a fallback for lacking Apex ability.
- **Public `POST /salesforce/loan-applications` reuses `contact-form`'s honeypot + minimum-fill-time + per-IP sliding-window rate limiting.** This endpoint writes real records into a live external system with a finite daily API call quota (Developer Edition orgs have modest daily limits) — the same abuse-resistance pattern already proven on this site applies directly.
- **Env vars follow the existing `RESEND_API_KEY`/`DATABASE_URL` pattern**: `SALESFORCE_DOMAIN`, `SALESFORCE_CLIENT_ID`, `SALESFORCE_CLIENT_SECRET` via local `.env` (gitignored) and Railway config vars in production — no new secrets-management approach introduced.
- **CORS gains `GET`.** The middleware in `api/app/main.py` currently only allows `POST` (added for `/contact`); the new list endpoint needs `GET` added to the same allowed-origins list, nothing broader.

## Risks / Trade-offs

- [Free Developer Edition orgs have finite daily REST API call limits] → Token caching minimizes token-endpoint calls; rate limiting on the create endpoint bounds worst-case traffic from the public internet.
- [A public write endpoint against a real external org carries some abuse risk even with rate limiting] → The object model has no real-world business value if spammed (it's a dev-org demo, not production data); honeypot + rate limit match the bar already accepted for `contact-form`.
- [External Client Apps are a newer Salesforce framework than legacy Connected Apps and, per this session's own experience, can silently fail to register correctly] → If the Salesforce OAuth setup ever needs to be redone, budget real time for the possibility that a freshly created External Client App may need to be deleted and recreated once before its Consumer Key is recognized by the token endpoint — this happened once this session with no identifiable root cause, resolved only by recreating the app. Worth a `docs/sreditor/` entry as a genuine unresolved platform quirk.
- [In-memory token cache means every API process restart/redeploy refetches a token] → Acceptable; a token fetch is a cheap, fast operation and this is a single-instance Railway deployment.
- [Case-study content risks reading as over-claiming parity with Servus's actual FSC/Agentforce stack] → Mitigated by stating the licensing limitation explicitly and directly in the copy itself, not just in supporting docs — consistent with this site's existing portfolio-transparency theme.

## Migration Plan

N/A — additive change. No existing data or users affected; the `/portfolio` placeholder is replaced wholesale, not incrementally migrated.

## Open Questions

- Exact Salesforce REST API version to target — use whatever is current stable at implementation time; not architecturally significant.
- Final wording/length of the case-study narrative copy — draft during implementation, Robin to review against the actual interview talking points before considering this change done.

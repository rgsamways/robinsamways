# rsw-lb-azure-client-credentials-flow

**Slug:** rsw-lb-azure-client-credentials-flow
**Date logged:** 2026-07-11
**Status:** unscoped — idea captured, not yet spec'd
**Related:** `/techstacks/credential-flow` (the Salesforce piece this directly parallels, being renamed back to "Salesforce Client Credentials Flow" to leave room for this), `farpost-pulse` (already the Azure Functions/Cosmos DB piece — this needs its own, non-overlapping domain object)

## The gap

Credential Flow's real pull, confirmed directly in conversation, is two specific things: a real live Salesforce integration, and the OAuth 2.0 Client Credentials Flow itself — a standard, industry-recognizable grant type (used by Spotify's Web API, Microsoft Entra ID/Graph, Auth0, Okta, Keycloak, AWS Cognito) for machine-to-machine auth. That recognizability is provider-agnostic — nothing about it is Salesforce-specific. Tech/Stacks' pill filter already seeds Azure and AWS as forward-looking tags with no project behind them yet.

## The idea

**Azure Client Credentials Flow** — the same OAuth grant type demonstrated in Credential Flow, this time authenticating against Microsoft Entra ID instead of Salesforce. Real open design fork, not yet resolved:

- **Call Microsoft Graph API directly** (e.g. read directory data) — simplest to stand up, but it's calling Microsoft's own API, not something built and secured from scratch. Thinner pull than Credential Flow's actual shape.
- **Build a small custom protected API** (e.g. an Azure Function App that validates Entra ID app-role claims from the incoming token) — closer to Credential Flow's real shape: a real OAuth grant *plus* a real thing built and secured with it, not just a call to someone else's endpoint. Needs its own small domain object, distinct from Farpost Pulse's existing Azure Functions/Cosmos DB territory, to avoid feeling redundant with a piece that already showcases that stack.

## Why it matters beyond convenience

- Directly follows from a real naming decision: Credential Flow is being renamed "Salesforce Client Credentials Flow" specifically to leave this door open without a future collision or rename churn.
- Reinforces the same signal Credential Flow already sends — real OAuth mechanics, not a vendor SDK's abstraction — against a second, differently-shaped identity provider, which is a stronger claim than doing it once ("I understand the standard" vs. "I know one vendor's flavor of it").
- Fills the already-seeded Azure tag on `/techstacks` with a real project instead of an empty pill.

## Open questions

- Which design fork above — call Graph API, or build+protect a custom API? Not yet resolved; the custom-API path is the stronger story but costs more scope, and needs a real (small) domain object that doesn't overlap Farpost Pulse's existing Azure Functions/Cosmos DB footprint.
- If the custom-API path is chosen, what's the domain object? Not yet brainstormed.
- Real Entra ID app-registration/licensing constraints on a free tier haven't been researched yet — worth checking before committing, same diligence already done for Credential Flow's Financial Services Cloud/Agentforce licensing disclosure.

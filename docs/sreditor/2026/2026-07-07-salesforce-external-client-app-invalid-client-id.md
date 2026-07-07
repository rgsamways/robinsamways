# Salesforce External Client App rejected a correctly-configured Consumer Key with invalid_client_id

**Date:** 2026-07-07
**Project change:** openspec/changes/salesforce-loan-demo
**Time invested (approx):** unclear exactly — this happened during the manual Salesforce Developer Edition org setup and OAuth configuration session that preceded the CLI implementation work; reconstructed here from the account captured in `design.md`'s Risks section and `proposal.md`'s Impact section rather than logged live at the time.

## Technological uncertainty

Salesforce's newer "External Client App" framework (distinct from legacy Connected Apps) was used to register an OAuth 2.0 Client Credentials Flow client ("Loan Demo 2") against a fresh Developer Edition org. The app was configured per Salesforce's own documented process — Client Credentials Flow enabled, a "Run As" user assigned, a Consumer Key/Secret pair generated — yet a token request against `{domain}/services/oauth2/token` using that Consumer Key returned `invalid_client_id`, with nothing in Salesforce's Setup UI, event logs, or documentation indicating why a visibly correctly-configured app would be rejected at the token endpoint.

## Hypothesis / approach

Initial assumption: a configuration mistake — either the Client Credentials Flow policy, the assigned "Run As" user's permissions, an IP restriction, or a copy-paste error in the Consumer Key/Secret. The approach was to methodically re-check each of those against Salesforce's documented setup steps before considering anything platform-side.

## Investigation

- Re-verified Client Credentials Flow was enabled on the External Client App's OAuth policy.
- Confirmed a "Run As" user was assigned and that user had appropriate permissions.
- Regenerated the Consumer Secret and retried the token request with the fresh value, ruling out a stale/mistyped secret.
- Retried the token request multiple times across a short window, ruling out a simple propagation-delay theory (no change in behavior over time).
- With every documented configuration point checked and re-checked without finding a discrepancy, escalated to suspecting the app registration itself rather than its configuration — deleted the External Client App entirely and recreated it from scratch with identical settings (same OAuth policies, same Client Credentials Flow setup, same "Run As" user).
- The newly created app's Consumer Key worked on the very first token request, with zero other changes made.

## Outcome

Recreating the External Client App from scratch resolved the issue. No root cause was ever identified — nothing in Salesforce's Setup UI, debug logs, or public documentation explained why the first app's Consumer Key was rejected while a second app, built with identical configuration, worked immediately. This reads as a genuine platform-side registration quirk rather than a configuration error, but with only one occurrence there's no way to confirm that from the outside.

## Knowledge gained

External Client Apps are a newer, apparently less mature registration framework than legacy Connected Apps, and can — at least once, under unknown conditions — fail to fully register a Consumer Key with the token endpoint even when every visible setting matches Salesforce's own documented process exactly. For any future Salesforce OAuth integration work (on this project or elsewhere), it's worth budgeting real time for the possibility that a freshly created External Client App may need to be deleted and recreated once before its Consumer Key is honored, rather than assuming a persistent `invalid_client_id` error necessarily means a configuration mistake. If this recurs on a future org, it would be worth deliberately testing whether it's reproducible (e.g., creating several apps back-to-back) to determine whether it's a consistent platform behavior or a rare propagation edge case — this single instance isn't enough evidence either way.

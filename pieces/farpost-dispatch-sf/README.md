# farpost-dispatch-sf

A real Salesforce DX project backing Farpost Dispatch — `web/src/app/farpost/farpost-dispatch/`'s
case-study page. Custom fields on Contact, a `Job__c` object, an Apex matching
service that calls Anthropic via a Named Credential (the callout originates
*inside* Salesforce, the mirror image of Credential Flow's Python-calls-out
direction), and a concurrency-safe claim service — professionals self-claim
jobs, first-claim-wins. Deploys to Robin's Developer Edition org; full
deployment/configuration steps live in `docs/deployment-guide.md`'s "Portfolio
piece deployments" part, mirrored at `/ops/deploy` on the live site.

Zero relationship to Farpost's real, live dispatch engine — same founding
story for narrative color, no shared code, data, or infrastructure. See
`openspec/changes/farpost-dispatch-build/design.md` for the full rationale.

## A genuinely different verification constraint than every other piece here

There is no local Salesforce CLI/runtime in the environment this project was
authored in. Every Apex class and test class below is real, hand-authored
source, structurally reviewed for correctness — but **none of it has been
deployed or run**. `sf apex run test` against a real org is Robin's own
verification step, documented in `docs/deployment-guide.md`, not something
already confirmed passing here.

## Structure

```
force-app/main/default/
  objects/Contact/fields/       Service_Region__c, Certifications__c,
                                 Availability_Status__c, Rating__c
  objects/Job__c/                the Job__c object + its fields
  classes/
    JobMatchingService.cls        eligible-candidate query + Anthropic callout + ranking
    JobClaimService.cls           row-locked (FOR UPDATE), status-guarded claim
    OpenJobsController.cls         backs the Partner-facing job board LWC
    *Test.cls                     HttpCalloutMock-covered Apex tests for all three
  namedCredentials/Anthropic_API.namedCredential-meta.xml
  permissionsets/Farpost_Dispatch_Partner.permissionset-meta.xml
  lwc/
    jobRecommendationPanel/       ops-side, on the Job__c record page
    openJobsBoard/                Partner Community portal page, with the Claim action
scripts/apex/seed.apex            fictional professionals + jobs, run once post-deploy
```

## Named Credential: a deliberate implementation choice

`Anthropic_API.namedCredential-meta.xml` uses the classic single-object
`NamedCredential` metadata type (`customHeaders` for `x-api-key` and
`anthropic-version`), not the newer split `ExternalCredential`/`NamedCredential`
model design.md calls "the current recommended pattern." Both are fully
supported; the classic format's schema has been stable for a decade and I
could verify its correctness by memory with high confidence, while the newer
split model has had real schema churn across recent releases I have no way to
validate without deploy access. Functionally equivalent for this piece's
single-shared-key, Named-Principal use case — Robin can migrate to the newer
model later if the per-user-auth flexibility it offers ever becomes relevant,
which it isn't here.

The real secret never sits in metadata as plaintext, even as a placeholder:
`protocol` is `Password` (not `NoAuthentication`), with a placeholder
`username` (`apikey` — Anthropic doesn't use it, but the Password auth
protocol requires one) and no `password` element at all — Robin enters the
real API key as the Named Credential's **Password** field via Setup UI after
deploying, which Salesforce stores masked and never returns on retrieve
(genuinely different from a custom header's value, which round-trips in
plaintext). The `x-api-key` custom header's value is the merge field
`{!$Credential.Password}`, so Salesforce substitutes the real, masked
password into that header at request time — the callout gets the real key,
metadata never holds it. Same never-commit-the-real-secret precedent as every
other API credential in this repo, enforced by the masked field itself this
time rather than by convention alone.

## Deploying and seeding (Robin's manual steps)

Full steps are in `docs/deployment-guide.md`. Short version:

```
sf project deploy start --source-dir force-app --target-org <org alias>
sf apex run --file scripts/apex/seed.apex --target-org <org alias>
sf apex run test --target-org <org alias> --code-coverage --result-format human
```

Then, via Setup UI (no metadata for these — inherently point-and-click):
create the Experience Cloud site, assign Partner Community licenses, enter
the real Anthropic API key as the Named Credential's **Password** field, and
place the two LWCs on the Job__c record page and the Experience Builder portal
page respectively.

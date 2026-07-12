## 1. Salesforce DX project scaffold

- [x] 1.1 Scaffold `pieces/farpost-dispatch-sf/` as a Salesforce DX project (`sfdx-project.json`, `force-app/main/default/` structure) — a new piece under `pieces/`, isolated per `CLAUDE.md`'s "Portfolio piece isolation" convention (Apex is a different runtime than every other piece here)
- [x] 1.2 Author custom field metadata on the standard Contact object: `Service_Region__c` (picklist — real North Hastings-area municipality names, for narrative continuity with Farpost Atlas, no data sharing), `Certifications__c` (multi-select picklist — trade categories mirroring Atlas's tracked-record types: septic/well, electrical, foundation/structural, roofing, general inspection), `Availability_Status__c` (picklist: Available/Unavailable), `Rating__c` (Number(2,1))
- [x] 1.3 Author the `Job__c` custom object and its fields: `Job_Type__c` (picklist, same values as Certifications__c), `Region__c` (picklist, same values as Service_Region__c), `Urgency__c` (picklist: High/Medium/Low), `Status__c` (picklist: Open/Claimed/Completed), `Assigned_Professional__c` (lookup to Contact), `Description__c` (long text area)

## 2. Apex services

- [x] 2.1 Author the Named Credential + External Credential metadata (`Anthropic_API`, pointing at `https://api.anthropic.com`, Named Principal auth — definition only, no secret value committed)
- [x] 2.2 Author `JobMatchingService.cls`: query eligible Contacts (Service_Region__c matches Job.Region__c, Certifications__c includes Job.Job_Type__c, Availability_Status__c = Available), build a candidate shortlist sorted by Rating__c, call Anthropic via the Named Credential with job + candidate details, parse the response into a ranked list with natural-language reasoning text per candidate
- [x] 2.3 Author `JobClaimService.cls`: `claimJob(Id jobId, Id professionalId)` — row-locks the Job__c record (`FOR UPDATE`), re-checks Status__c == Open inside the lock, updates Status__c to Claimed and sets Assigned_Professional__c; throws a handled exception if the job was already claimed
- [x] 2.4 Write `JobMatchingServiceTest.cls` with `HttpCalloutMock` coverage (tests never make a live Anthropic call) — cover the eligible-candidate filter, the ranking/sort, and the response-parsing path
- [x] 2.5 Write `JobClaimServiceTest.cls` — cover a successful claim, and a second claim attempt on an already-claimed job being correctly rejected
- [x] 2.6 Author `Farpost_Dispatch_Partner`, a permission set scoping exactly the object/field access Partner Community users need (their own Contact self-fields, Job__c read, the claim action) — no broader access than that

## 3. Lightning Web Components

- [x] 3.1 Author `jobRecommendationPanel` LWC (ops-side, placed on the Job__c record page): a button that calls `JobMatchingService`, displaying the ranked candidate list with reasoning
- [x] 3.2 Author `openJobsBoard` LWC (Partner Community portal page): shows open jobs matching the logged-in Professional's own Service_Region__c/Certifications__c, AI-recommended jobs flagged, each with a Claim action calling `JobClaimService.claimJob`, with a clear "already claimed" state if a claim attempt is rejected

## 4. Seed data

- [x] 4.1 Write an Apex data-seeding script (`pieces/farpost-dispatch-sf/scripts/apex/seed.apex`, run via `sf apex run` once deployed): fictional Professionals (Contacts) spanning multiple regions, certifications, and ratings; fictional Jobs spanning multiple regions, job types, and urgency levels — patterned so real matching variation is visible (some jobs with several eligible candidates, some with few, a genuine ratings spread)

## 5. robinsamways.ca case-study page

- [x] 5.1 Rewrite `web/src/app/farpost/farpost-dispatch/page.tsx` from its placeholder to a real case-study page: opening section stating plainly this is a separate, illustrative system built to demonstrate Salesforce/Experience Cloud skills, with zero relationship to Farpost's real, live dispatch engine; an object-model section; an architecture section (Salesforce DX, Apex, Named Credential, source-driven deployment); an AI-matching section explaining the Apex-originated Anthropic callout as the complementary counterpart to Credential Flow's Python-originated one; a tech-stack table; a `SETUP_GALLERY` section placeholder noting real screenshots are a follow-up once Robin completes the manual configuration
- [x] 5.2 SKIPPED, flagged rather than followed silently: this task predates `page-chrome-simplification` (archived since this proposal was written), which removed every local per-page `HamburgerMenu` sitewide and retired the `project-page-navigation` capability entirely. Adding one back here would directly contradict the current, already-shipped site convention and this change's own spec delta (neither the `farpost-dispatch` nor `farpost-page-content` deltas require a local menu). No local menu added, matching every other Farpost-hub page's current state.
- [x] 5.3 Check for JSX whitespace-glue regressions proactively via headless-browser text extraction, per this project's recurring SWC/Turbopack quirk

## 6. Spec and documentation sync

- [x] 6.1 Apply the `farpost-page-content` spec delta: remove the "Dispatch renders as a placeholder page" requirement, add the real case-study content requirements
- [x] 6.2 Add a new Farpost Dispatch/Salesforce subsection to `docs/deployment-guide.md`'s "Portfolio piece deployments" part: installing the Salesforce CLI, authenticating to the org, `sf project deploy start`, running the seed script and Apex tests, creating the Experience Cloud site via the setup wizard, assigning Partner Community licenses, entering the real Anthropic API key into the Named Credential, building the Experience Builder page layout with the two LWCs
- [x] 6.3 Sync `/ops/deploy` to match the updated `docs/deployment-guide.md`, per `CLAUDE.md`
- [x] 6.4 Add new entries to `docs/stack.md`: Salesforce DX/Apex, Experience Cloud/Partner Community, Named Credentials, Salesforce CLI (`sf`)
- [x] 6.5 Log a handoff to Robin via `docs/issues.md` (per the handoff-logging convention) covering: the manual deployment/configuration steps from 6.2, and that once he's completed them, a `SetupGallery` for this piece (real screenshots) is a real, non-blocking follow-up — same precedent as Atlas's and Pulse's own still-pending galleries

## 7. Verification

- [x] 7.1 Confirm `web/src/app/farpost/farpost-dispatch/page.tsx` renders correctly: all required sections present, pill-tab bar shows Dispatch active, no whitespace-glue regressions (no local menu — see 5.2's note; that mechanic was retired sitewide by the already-archived `page-chrome-simplification`)
- [x] 7.2 `npm run build` clean in `/web`, no console warnings
- [x] 7.3 Write/update a Playwright e2e check confirming `/farpost/farpost-dispatch` renders its real content (not the old placeholder text) and the pill-tab bar navigates correctly, per this repo's "tests ship with the feature" convention
- [x] 7.4 Confirm every new Apex/metadata file is syntactically well-formed and internally consistent (field references, object references) via a careful source review — this cannot be substituted for actually deploying and running tests in a real org, which is Robin's own verification step once he completes section 6.2's manual deployment. Done: all 20 XML files programmatically checked for balanced tags, correct XML declarations, and the Salesforce metadata namespace; every SOQL/Apex field reference (Contact and Job__c) and every picklist value literal used in the test/seed data cross-checked by hand against each field's declared `valueSet`; every LWC↔Apex wire/imperative-call cross-checked against actual class/method names and parameter names; the Named Credential's `callout:Anthropic_API` reference confirmed to match its metadata file's developer name. No deploy-time validation is possible without a live org — genuinely unverified until Robin runs `sf apex run test` per Part 8c.
- [x] 7.5 Run `scc --dryness --exclude-dir .git,.hg,.svn,node_modules,.venv web/src api pieces` and log the snapshot to `docs/metrics.md` **and** `web/src/data/metrics.json` before archiving this change, per `CLAUDE.md`. Deviated from the literal command given: added `raw` back to `--exclude-dir` (omitted in the handoff text, but `pieces/farpost-atlas-geo/data/raw/` — ~420MB, gitignored — still exists on disk and would have reintroduced the exact false-inflation bug already documented above the Snapshots section) and added `--count-as cls:Apex` (scc's default `.cls` mapping is legacy Visual Basic for Applications, not Apex — without it, 5 of 6 `.cls` files miscounted). Both flagged here rather than silently applied.

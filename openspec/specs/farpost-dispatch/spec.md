# farpost-dispatch Specification

## Purpose
TBD - created by archiving change farpost-dispatch-build. Update Purpose after archive.
## Requirements
### Requirement: Professional and Job object model
Robin's Salesforce Developer Edition org SHALL contain custom fields on the standard Contact object — Service Region (picklist), Certifications (multi-select picklist), Availability Status (picklist: Available/Unavailable), and Rating (decimal) — and a custom `Job__c` object with Job Type (picklist), Region (picklist), Urgency (picklist: High/Medium/Low), Status (picklist: Open/Claimed/Completed), Assigned Professional (lookup to Contact), and Description.

#### Scenario: A Job record captures matching-relevant fields
- **WHEN** a `Job__c` record is created with a Job Type, Region, and Urgency
- **THEN** the record stores all three fields, along with a Status defaulting to Open and no Assigned Professional until claimed

### Requirement: AI-assisted candidate matching
An Apex service SHALL, given a Job, query Contacts whose Service Region matches the Job's Region, whose Certifications include the Job's Job Type, and whose Availability Status is Available, then call Anthropic's API via a Named Credential (the callout originating from Apex, not from any external system) to produce a ranked list of candidates with natural-language reasoning for each recommendation, ordered using each candidate's Rating as a secondary signal.

#### Scenario: Matching returns a ranked, reasoned shortlist
- **WHEN** the matching service is invoked for a Job with at least one eligible candidate
- **THEN** it returns a ranked list of eligible Professionals, each with a short natural-language explanation of why they were recommended

#### Scenario: No eligible candidates
- **WHEN** the matching service is invoked for a Job with zero Contacts matching Region, Certification, and Availability
- **THEN** it returns an empty result without calling Anthropic

### Requirement: Concurrency-safe job claiming
An Apex service SHALL allow a Professional to claim an Open Job, row-locking the Job record and re-verifying its Status is still Open before updating it to Claimed and setting the Assigned Professional, rejecting the claim if another claim has already succeeded.

#### Scenario: A Professional successfully claims an open job
- **WHEN** a Professional claims a Job whose Status is Open
- **THEN** the Job's Status becomes Claimed, its Assigned Professional is set to that Professional, and the operation succeeds

#### Scenario: A second claim on an already-claimed job is rejected
- **WHEN** a Professional attempts to claim a Job whose Status is already Claimed
- **THEN** the claim is rejected and the Job's existing Assigned Professional is unchanged

### Requirement: Partner Community portal for Professionals
The Salesforce org SHALL expose an Experience Cloud site, accessible to Partner Community-licensed Professional users, showing each logged-in Professional the open Jobs matching their own Service Region and Certifications, with AI-recommended jobs indicated, and a Claim action.

#### Scenario: A Professional sees their own matching open jobs
- **WHEN** a Professional logs into the portal
- **THEN** they see Open Jobs whose Region and Job Type match their own Service Region and Certifications

#### Scenario: A Professional claims a job from the portal
- **WHEN** a Professional activates the Claim action on an open Job they're viewing
- **THEN** the claim service is invoked and the portal reflects the resulting success or already-claimed state

### Requirement: Ops-side recommendation panel
A Lightning Web Component on the Job record page SHALL let an internal Salesforce user trigger the matching service for that Job and view the ranked, reasoned candidate list.

#### Scenario: An internal user requests recommendations for a Job
- **WHEN** an internal user activates the recommendation panel on a Job record
- **THEN** the panel displays the ranked candidate list with reasoning, or an empty state if no candidates are eligible

### Requirement: Case-study page distinguishes this from Farpost's real dispatch engine
The `/farpost/farpost-dispatch` page SHALL state plainly, in its opening content, that this is a separate, illustrative Salesforce-built system created to demonstrate Experience Cloud/Apex/AI-integration skills, with no data, code, or infrastructure relationship to Farpost's real, live dispatch engine.

#### Scenario: Visitor reads the non-relationship statement
- **WHEN** a visitor loads `/farpost/farpost-dispatch`
- **THEN** the page's opening content explicitly states this system has no relationship to Farpost's real production dispatch engine, before describing the piece itself

### Requirement: Case-study page covers the object model, architecture, and AI-matching mechanic
The `/farpost/farpost-dispatch` page SHALL include sections covering: the Professional/Job object model, the Salesforce DX/Apex architecture (including that this is source-driven, git-tracked, and deployed via the Salesforce CLI rather than configured only through the Setup UI), and the AI-matching mechanic — explicitly framed as the complementary counterpart to Credential Flow's existing Anthropic-powered recommendation feature, since this callout originates from inside Salesforce (Apex) rather than from an external caller.

#### Scenario: Visitor reads the architecture section
- **WHEN** a visitor reads the page's architecture section
- **THEN** the copy explains that the Salesforce metadata and Apex code are real, git-tracked source deployed via the Salesforce CLI, not manual Setup-UI-only configuration

#### Scenario: Visitor reads the AI-matching section
- **WHEN** a visitor reads the page's AI-matching section
- **THEN** the copy explicitly draws the contrast with Credential Flow's AI feature — this callout originates from Apex inside Salesforce, Credential Flow's originates from Python outside it

### Requirement: Case-study page has no live public demo
The `/farpost/farpost-dispatch` page SHALL NOT include a live, publicly-accessible embed of or login link to the Salesforce Experience Cloud site, since exposing real login credentials for a free Developer Edition org publicly risks abuse and governor-limit exhaustion.

#### Scenario: Visitor cannot log into the live org from the page
- **WHEN** a visitor reads `/farpost/farpost-dispatch`
- **THEN** the page contains no working login link or embedded widget connecting to the live Salesforce org

## MODIFIED Requirements

### Requirement: Case-study page distinguishes this from Farpost's real dispatch engine
The `/techstacks/farpost-dispatch` route SHALL state plainly, in its opening content, that this is a separate, illustrative Salesforce-built system created to demonstrate Experience Cloud/Apex/AI-integration skills, with no data, code, or infrastructure relationship to Farpost's real, live dispatch engine.

#### Scenario: Visitor reads the non-relationship statement
- **WHEN** a visitor loads `/techstacks/farpost-dispatch`
- **THEN** the page's opening content explicitly states this system has no relationship to Farpost's real production dispatch engine, before describing the piece itself

### Requirement: Case-study page summarizes the object model, architecture, and AI-matching mechanic and links to their dedicated pages
The `/techstacks/farpost-dispatch` route SHALL briefly summarize the Professional/Job object model, the Salesforce DX/Apex architecture, and the AI-matching mechanic, linking to the dedicated Object Model, Architecture, and AI Notes pages for full depth, rather than carrying the full detail of each on this landing page as it did before this change.

#### Scenario: Visitor reads a brief summary linking to the full architecture page
- **WHEN** a visitor reads the landing page's architecture summary
- **THEN** the copy is brief and links to `/techstacks/farpost-dispatch/architecture` for the full explanation of the source-driven, git-tracked Salesforce DX/Apex build

#### Scenario: Visitor reads a brief summary linking to the full AI-matching page
- **WHEN** a visitor reads the landing page's AI-matching summary
- **THEN** the copy is brief and links to `/techstacks/farpost-dispatch/ai-notes` for the full mechanic and its contrast with Credential Flow's AI feature

### Requirement: Case-study page has no live public demo
The `/techstacks/farpost-dispatch` route SHALL NOT include a live, publicly-accessible embed of or login link to the Salesforce Experience Cloud site, since exposing real login credentials for a free Developer Edition org publicly risks abuse and governor-limit exhaustion.

#### Scenario: Visitor cannot log into the live org from the page
- **WHEN** a visitor reads `/techstacks/farpost-dispatch`
- **THEN** the page contains no working login link or embedded widget connecting to the live Salesforce org

## ADDED Requirements

### Requirement: Tech Stack page documents Dispatch's real technology choices
The `/techstacks/farpost-dispatch/tech-stack` route SHALL document Dispatch's real stack — Salesforce DX, Apex, Experience Cloud, and the Anthropic API called via a Named Credential — distinguishing what's source-driven and git-tracked from what's configured only through the Setup UI.

#### Scenario: Visitor sees the real stack, not marketing language
- **WHEN** a visitor loads `/techstacks/farpost-dispatch/tech-stack`
- **THEN** the page names Salesforce DX, Apex, Experience Cloud, and the Named-Credential-based Anthropic callout specifically

### Requirement: Architecture page describes the Salesforce DX/Apex build and distinguishes it from Farpost's real dispatch engine
The `/techstacks/farpost-dispatch/architecture` route SHALL state plainly, before any other content, that this is a separate, illustrative Salesforce-built system with no data, code, or infrastructure relationship to Farpost's real, live dispatch engine, and SHALL explain that the Salesforce metadata and Apex code are real, git-tracked source deployed via the Salesforce CLI, not manual Setup-UI-only configuration, plus the concurrency-safe job-claiming mechanism and the Partner Community portal.

#### Scenario: Visitor reads the non-relationship statement before anything else
- **WHEN** a visitor loads `/techstacks/farpost-dispatch/architecture`
- **THEN** the page's opening content explicitly states this system has no relationship to Farpost's real production dispatch engine, before describing the piece itself

#### Scenario: Visitor reads that the build is source-driven
- **WHEN** a visitor reads the page's architecture section
- **THEN** the copy explains that the Salesforce metadata and Apex code are real, git-tracked source deployed via the Salesforce CLI, not manual Setup-UI-only configuration

### Requirement: Object Model page documents the Professional and Job schema
The `/techstacks/farpost-dispatch/object-model` route SHALL document the Contact-object custom fields (Service Region, Certifications, Availability Status, Rating) and the `Job__c` object's fields (Job Type, Region, Urgency, Status, Assigned Professional, Description), presented as a reference page distinct from the architecture narrative.

#### Scenario: Visitor sees the Contact extensions and the Job object together
- **WHEN** a visitor loads `/techstacks/farpost-dispatch/object-model`
- **THEN** the page shows both the Contact custom fields and the full `Job__c` field list, with Job's Status default (Open) and its Assigned Professional lookup called out

### Requirement: Design Notes page explains why the AI callout originates from Apex
The `/techstacks/farpost-dispatch/design-notes` route SHALL explain the design reasoning behind having the AI-matching callout originate from inside Salesforce (Apex via Named Credential) rather than an external caller, and SHALL explain why the page has no live, publicly-accessible embed of or login link to the Experience Cloud site (governor-limit exhaustion and credential-abuse risk on a free Developer Edition org).

#### Scenario: Visitor understands why there's no live demo
- **WHEN** a visitor reads `/techstacks/farpost-dispatch/design-notes`
- **THEN** the copy explains the governor-limit and credential-exposure reasoning, matching the existing "no live public demo" requirement for this piece

### Requirement: AI Notes page covers both build process and the Apex-native matching mechanic
The `/techstacks/farpost-dispatch/ai-notes` route SHALL cover, in order, how AI tooling was used to build Dispatch, then how AI is used inside Dispatch itself — the Apex service that queries eligible Contacts and calls Anthropic's API via a Named Credential to produce a ranked, reasoned candidate list — explicitly drawing the contrast with Credential Flow's AI feature: this callout originates from Apex inside Salesforce, Credential Flow's originates from Python outside it.

#### Scenario: Visitor reads the AI-matching mechanic and its contrast with Credential Flow
- **WHEN** a visitor reads the product half of `/techstacks/farpost-dispatch/ai-notes`
- **THEN** the copy explicitly draws the contrast with Credential Flow's AI feature — this callout originates from Apex inside Salesforce, Credential Flow's originates from Python outside it

#### Scenario: No eligible candidates is described accurately
- **WHEN** a visitor reads how the matching service behaves with zero eligible candidates
- **THEN** the copy accurately states that Anthropic is not called at all in that case, matching the existing matching-service requirement

### Requirement: Setup Gallery page shows real Experience Cloud and Salesforce DX configuration
The `/techstacks/farpost-dispatch/setup-gallery` route SHALL show real screenshots of the genuine Salesforce configuration work behind Dispatch (Experience Cloud site setup, Partner Community licensing, Named Credential configuration for the Anthropic callout), each with a caption explaining what it shows and why it matters, per the site's established Setup Gallery pattern.

#### Scenario: Visitor sees real configuration screenshots, not staged ones
- **WHEN** a visitor loads `/techstacks/farpost-dispatch/setup-gallery`
- **THEN** the page shows real screenshots of the actual Experience Cloud and Named Credential configuration, not illustrative or staged images

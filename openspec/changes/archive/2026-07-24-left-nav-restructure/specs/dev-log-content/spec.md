## MODIFIED Requirements

### Requirement: Dev Log renders as a hub linking to six real sub-pages
The `/dev-log` route SHALL render a hub page — a heading, a short intro blurb, and links to its six sub-pages, in this order: Bug Log, Metrics, Testing & Verification, Glossary, Code Showcase, and Lightbulbs — rather than rendering any topic's content directly on `/dev-log` itself.

#### Scenario: Visitor sees the hub and its six links
- **WHEN** a visitor loads `/dev-log`
- **THEN** the page shows the heading, intro blurb, and a link to each of Bug Log, Metrics, Testing & Verification, Glossary, Code Showcase, and Lightbulbs, in that order, with no topic content rendered inline

### Requirement: Glossary section explains technical terms in plain language, framed as a communication skill
The Glossary page SHALL present the same growing list of "X, in layman's terms" entries as before, launching with at least 5 terms actually used elsewhere on this site (Twilio, OAuth 2.0 Client Credentials Flow, SOQL, Field History Tracking, NFC/RFID), each explained without assuming prior technical background. The page's introductory copy SHALL explicitly frame the list as a demonstration of translating technical decisions for a non-technical audience, rather than presenting it as a bare dictionary.

#### Scenario: Visitor reads a glossary entry
- **WHEN** a visitor reads a Glossary entry
- **THEN** the term is explained in plain language, without assuming the reader already knows related jargon

#### Scenario: Visitor reads the page's framing
- **WHEN** a visitor loads the Glossary page
- **THEN** the introductory copy explains the list as evidence of translating technical work for a non-technical audience, not just a term dictionary

### Requirement: Code Showcase entries present real Farpost code with a plain-language framing and payoff, each at its own route with a timestamp
The Code Showcase index (`/dev-log/code-showcase`) SHALL list at least 10 entries, each showcasing one genuine, verified piece of code from the Farpost project, each linking to its own route (`/dev-log/code-showcase/<slug>`). Each entry's page SHALL include: a kicker identifying the project, category, and date; a title; a timestamp shown in UTC alongside its Eastern-time equivalent; 1-2 plain-language framing paragraphs a non-engineer reader can follow; one or more annotated code blocks; a labeled "The fix" explanation of the technical specifics; and a labeled "Why this matters" explanation translating the fix into a named engineering competency (e.g. root-cause diagnosis, judgment under ambiguity, defensive design, verification discipline).

#### Scenario: Visitor reads a Code Showcase article at its own route
- **WHEN** a visitor loads `/dev-log/code-showcase/<slug>` for a given entry
- **THEN** the page shows the kicker, title, UTC/Eastern timestamp, framing paragraphs, real code, "The fix," and "Why this matters," in that order, describing genuine code from the Farpost project rather than an illustrative or paraphrased example

#### Scenario: Timestamp shows both UTC and Eastern time
- **WHEN** a visitor reads a Code Showcase article's timestamp
- **THEN** both the UTC time and its Eastern-time equivalent are shown, clearly labeled, so the reader does not need to convert it themselves

#### Scenario: Code Showcase entries visually match the rest of the Dev Log page
- **WHEN** a visitor views a Code Showcase entry alongside a Bug Log entry
- **THEN** both use the same code-block and labeled-subsection styling, rather than two different visual systems

## ADDED Requirements

### Requirement: Bug Log renders at its own route
The bug-log entries (per the existing "Bug-log entries pair a real bug with the concept it reveals" requirement) SHALL render at `/dev-log/bug-log`.

#### Scenario: Visitor loads the Bug Log route
- **WHEN** a visitor loads `/dev-log/bug-log`
- **THEN** the page shows the bug-log entries described elsewhere in this capability

### Requirement: Metrics renders at its own route
The Metrics content (per the existing "Metrics section shows real code-metrics history" requirement) SHALL render at `/dev-log/metrics`.

#### Scenario: Visitor loads the Metrics route
- **WHEN** a visitor loads `/dev-log/metrics`
- **THEN** the page shows the real scc snapshot history described elsewhere in this capability

### Requirement: Testing & Verification renders at its own route
The Testing & Verification content (per the existing "Testing & Verification section describes real practice honestly" requirement) SHALL render at `/dev-log/testing-verification`.

#### Scenario: Visitor loads the Testing & Verification route
- **WHEN** a visitor loads `/dev-log/testing-verification`
- **THEN** the page shows the testing-practice content described elsewhere in this capability

### Requirement: Glossary renders at its own route
The Glossary content SHALL render at `/dev-log/glossary`.

#### Scenario: Visitor loads the Glossary route
- **WHEN** a visitor loads `/dev-log/glossary`
- **THEN** the page shows the glossary entries and framing described elsewhere in this capability

## REMOVED Requirements

### Requirement: A pill bar filters Dev Log sections by visibility
**Reason**: Dev Log's five topics are no longer sections filtered on one page — each is now its own route, reachable directly from the left nav's collapsible Dev Log submenu (per the `site-navigation` capability), making an on-page visibility filter redundant.
**Migration**: Visitors reach a specific topic by navigating to its own route (e.g. `/dev-log/bug-log`) directly, or via the left nav, instead of toggling a pill on `/dev-log` itself.

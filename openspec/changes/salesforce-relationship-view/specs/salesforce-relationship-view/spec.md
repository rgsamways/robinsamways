## ADDED Requirements

### Requirement: Account-grouped relationship view
The system SHALL provide a view of all Loan Applications tied to a single Account, grouped together, as an alternative to the existing flat list — a concrete instance of relationship-centric data unification rather than one undifferentiated table.

#### Scenario: Visitor selects an Account and sees only its Loan Applications
- **WHEN** a visitor selects an Account from the relationship view
- **THEN** the page shows only the Loan Applications linked to that Account, grouped together

#### Scenario: Grouped view shows the same fields as the flat list
- **WHEN** a visitor views an Account's grouped Loan Applications
- **THEN** each application shows Applicant, Amount Requested, Status, Submitted Date, and Decision Date, consistent with the flat list

### Requirement: AI-assisted recommended next action
The system SHALL generate a short, AI-assisted "recommended next action" suggestion for a given Loan Application, based on its current Status and how long it has been in that status, by calling the Anthropic API directly — not Salesforce Agentforce, which is not licensed on this org.

#### Scenario: Visitor requests a recommendation and receives a suggestion
- **WHEN** a visitor requests a recommendation for a specific Loan Application
- **THEN** the system returns a short, human-readable suggested next action generated from that application's Status and time-in-status

#### Scenario: Recommendation reflects time spent in the current status
- **WHEN** an application has been in its current Status for a notable amount of time (e.g. several days in Under Review with no change)
- **THEN** the generated suggestion references that duration rather than being generic to the Status alone

#### Scenario: Anthropic API failure degrades cleanly
- **WHEN** the Anthropic API call fails or times out
- **THEN** the page shows a clean error state for the recommendation without breaking the rest of the page

### Requirement: Real status-change timeline via Field History Tracking
The system SHALL surface the real Salesforce Field History Tracking audit trail for `Status__c` changes on a Loan Application as a status-change timeline, rather than deriving a synthetic timeline from `Submitted_Date__c`/`Decision_Date__c`.

#### Scenario: Visitor views an application's real status-change history
- **WHEN** a visitor views the timeline for a Loan Application that has had one or more Status changes
- **THEN** the system shows each change as an old-value → new-value entry with its timestamp, sourced from Salesforce's `Loan_Application__History` object

#### Scenario: Application with no recorded status changes
- **WHEN** a visitor views the timeline for a Loan Application with no Field History Tracking entries yet (e.g. never had its Status changed since tracking was enabled)
- **THEN** the system shows an appropriate empty state rather than an error

#### Scenario: Timeline copy parallels the Farpost reputation graph
- **WHEN** a visitor reads the portfolio page's explanation of this timeline
- **THEN** the copy explicitly draws the parallel to Farpost's professional-reputation graph — both are computed from a real event/history log, not a derived or fabricated summary

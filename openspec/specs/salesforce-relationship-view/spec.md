# salesforce-relationship-view Specification

## Purpose
TBD - created by archiving change salesforce-relationship-view. Update Purpose after archive.
## Requirements
### Requirement: Account-grouped relationship view
The system SHALL provide a view of all Loan Applications tied to a single Account, grouped together, as an alternative to the existing flat list — a concrete instance of relationship-centric data unification rather than one undifferentiated table.

#### Scenario: Visitor selects an Account and sees only its Loan Applications
- **WHEN** a visitor selects an Account from the relationship view
- **THEN** the page shows only the Loan Applications linked to that Account, grouped together

#### Scenario: Grouped view shows the same fields as the flat list
- **WHEN** a visitor views an Account's grouped Loan Applications
- **THEN** each application shows Applicant, Amount Requested, Status, Submitted Date, and Decision Date, consistent with the flat list

#### Scenario: Grouped view stays in sync with the flat list
- **WHEN** a visitor creates, updates the status of, or deletes a Loan Application through the flat list's demo widget
- **THEN** the Account-grouped view reflects that change without requiring a page reload, and if the mutated record was the only application tied to the currently selected Account, the view falls back to another Account or an appropriate empty state rather than showing a stale selection

### Requirement: Sortable, filterable, paginated per-Account table
The Account-grouped view's table SHALL support click-to-sort on every displayed column, a Status filter (including Archived), and pagination at 10 records per page with a total-results counter, applied client-side over the selected Account's applications — consistent with the same interaction pattern on the flat list.

#### Scenario: Sorting and filtering compose within the selected Account
- **WHEN** a visitor filters the selected Account's applications to a specific Status and then sorts by another column
- **THEN** the displayed rows reflect both the filter and the sort order together, scoped to that Account only

#### Scenario: Selecting a different Account resets paging
- **WHEN** a visitor switches the selected Account while on a page other than the first
- **THEN** the table resets to page 1 for the newly selected Account's applications

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

### Requirement: Curated Salesforce Setup screenshot gallery
The `/portfolio` page SHALL include a gallery of curated screenshots evidencing the real Salesforce Setup configuration and live data behind this integration (the Decision Date Flow's canvas, the Loan Application object's field list, the External Client App's OAuth Policies, a live record detail view, its Field History Tracking related list, and masked production environment variables), placed after the live demos, with each image opening from a thumbnail into a dialog rather than embedding at full size.

#### Scenario: Thumbnail opens a full-size view with context
- **WHEN** a visitor clicks or taps a gallery thumbnail
- **THEN** a dialog opens showing the full image scaled to fit the viewport, its descriptive caption, and a dimmed backdrop

#### Scenario: Gallery and its dialog work on mobile
- **WHEN** a visitor views the gallery on a mobile-width viewport
- **THEN** the thumbnail grid and the opened dialog both remain usable without relying on a keyboard — the dialog is dismissible via a visible close control or tapping the backdrop, in addition to Escape


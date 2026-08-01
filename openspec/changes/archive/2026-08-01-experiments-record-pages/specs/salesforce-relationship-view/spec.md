## MODIFIED Requirements

### Requirement: Curated Salesforce Setup screenshot gallery
The `/techstacks/credential-flow/setup-gallery` route SHALL include a gallery of curated screenshots evidencing the real Salesforce Setup configuration and live data behind this integration (the Decision Date Flow's canvas, the Loan Application object's field list, the External Client App's OAuth Policies, a live record detail view, its Field History Tracking related list, and masked production environment variables), rendered by a Credential-Flow-owned `SetupGallery` component (`web/src/components/credential-flow/SetupGallery.tsx`) rather than the shared `web/src/components/portfolio/SetupGallery.tsx`, with each image opening from a thumbnail into a dialog rather than embedding at full size. This moves the gallery from the `/portfolio` page (or wherever it currently renders) onto its own dedicated page under the Credential Flow submenu — the existing screenshots and captions carry over unchanged; only the route and owning component change.

#### Scenario: Thumbnail opens a full-size view with context
- **WHEN** a visitor clicks or taps a gallery thumbnail on `/techstacks/credential-flow/setup-gallery`
- **THEN** a dialog opens showing the full image scaled to fit the viewport, its descriptive caption, and a dimmed backdrop

#### Scenario: Gallery and its dialog work on mobile
- **WHEN** a visitor views the gallery on a mobile-width viewport
- **THEN** the thumbnail grid and the opened dialog both remain usable without relying on a keyboard — the dialog is dismissible via a visible close control or tapping the backdrop, in addition to Escape

### Requirement: Real status-change timeline via Field History Tracking
The system SHALL surface the real Salesforce Field History Tracking audit trail for `Status__c` changes on a Loan Application as a status-change timeline, rather than deriving a synthetic timeline from `Submitted_Date__c`/`Decision_Date__c`.

#### Scenario: Visitor views an application's real status-change history
- **WHEN** a visitor views the timeline for a Loan Application that has had one or more Status changes
- **THEN** the system shows each change as an old-value → new-value entry with its timestamp, sourced from Salesforce's `Loan_Application__History` object

#### Scenario: Application with no recorded status changes
- **WHEN** a visitor views the timeline for a Loan Application with no Field History Tracking entries yet (e.g. never had its Status changed since tracking was enabled)
- **THEN** the system shows an appropriate empty state rather than an error

#### Scenario: Timeline copy parallels the Farpost reputation graph
- **WHEN** a visitor reads the Object Model page's explanation of this timeline (per the `salesforce-loan-demo` capability's Object Model page requirement)
- **THEN** the copy explicitly draws the parallel to Farpost's professional-reputation graph — both are computed from a real event/history log, not a derived or fabricated summary

## ADDED Requirements

### Requirement: AI Notes page covers build process and the recommended-next-action feature
The `/techstacks/credential-flow/ai-notes` route SHALL cover, in order, how AI tooling was used to build Credential Flow, then how AI is used inside Credential Flow itself — the AI-assisted recommended-next-action feature (per the existing "AI-assisted recommended next action" requirement), calling the Anthropic API directly rather than Salesforce Agentforce, which is not licensed on this org.

#### Scenario: Visitor reads the real AI feature and why Agentforce wasn't used
- **WHEN** a visitor reads the product half of `/techstacks/credential-flow/ai-notes`
- **THEN** the copy describes the recommended-next-action feature and restates that Agentforce was not used because it isn't licensed on this free Developer Edition org

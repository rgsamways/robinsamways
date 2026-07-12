## MODIFIED Requirements

### Requirement: Portfolio case-study content
The `/techstacks/credential-flow` page (titled "Credential Flow", formerly "Salesforce Loan Demo") SHALL present a written case study covering the architecture of this integration, the reason for choosing the OAuth 2.0 Client Credentials Flow and raw `httpx` over a wrapper library, an explicit statement that Financial Services Cloud and Agentforce were not used because they require paid licenses unavailable in a free Developer Edition org, and the structural parallel between this object model and Farpost's professional-reputation graph.

#### Scenario: Licensing limitation is stated explicitly
- **WHEN** a visitor reads the `/techstacks/credential-flow` case study
- **THEN** the copy explicitly states that Financial Services Cloud and Agentforce were not used due to licensing, rather than implying full parity with a production Salesforce implementation

### Requirement: Live demo widget on the Portfolio page
The `/techstacks/credential-flow` page SHALL include a live demo widget that fetches and displays current Loan Application records from `GET /salesforce/loan-applications`, and allows a visitor to trigger `POST /salesforce/loan-applications` to create a new demo record, with loading, success, and error states.

#### Scenario: Visitor views live data
- **WHEN** a visitor loads the `/techstacks/credential-flow` page
- **THEN** the demo widget fetches and renders the current list of Loan Application records from the live Salesforce org

#### Scenario: Visitor triggers a demo creation
- **WHEN** a visitor uses the demo widget's create action
- **THEN** the widget calls `POST /salesforce/loan-applications`, shows a loading state, and then shows either a success confirmation with the new record reflected in the list or an error state

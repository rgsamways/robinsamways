## MODIFIED Requirements

### Requirement: No business endpoints beyond health check
The API SHALL NOT include any Salesforce, CRM, or other business-domain endpoints — those remain deferred to a later change. The `POST /contact` endpoint defined by the `contact-form` capability is explicitly permitted as the API's first non-infrastructure endpoint.

#### Scenario: API surface is limited to infrastructure concerns and the contact endpoint
- **WHEN** the API's route table is inspected
- **THEN** only the health check endpoint, the `POST /contact` endpoint, and any framework-default routes (such as docs) are present

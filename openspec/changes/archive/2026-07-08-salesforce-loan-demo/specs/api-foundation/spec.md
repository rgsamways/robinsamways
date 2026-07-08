## MODIFIED Requirements

### Requirement: No business endpoints beyond health check
The API SHALL NOT include any CRM or other business-domain endpoints beyond those explicitly permitted here. The `POST /contact` endpoint defined by the `contact-form` capability and the `GET /salesforce/loan-applications` / `POST /salesforce/loan-applications` endpoints defined by the `salesforce-loan-demo` capability are explicitly permitted as the API's non-infrastructure endpoints.

#### Scenario: API surface is limited to infrastructure concerns and the permitted business endpoints
- **WHEN** the API's route table is inspected
- **THEN** only the health check endpoint, the `POST /contact` endpoint, the `GET /salesforce/loan-applications` and `POST /salesforce/loan-applications` endpoints, and any framework-default routes (such as docs) are present

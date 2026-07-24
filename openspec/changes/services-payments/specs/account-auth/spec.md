## ADDED Requirements

### Requirement: Visitor can sign in via passwordless magic-link email
The system SHALL let a visitor request a sign-in link sent to their email address and SHALL authenticate them by that link, with no password ever collected or stored — mirroring the passwordless pattern already used by Vocare's real `better-auth` configuration, independently implemented (no shared runtime, session, or database with any other project).

#### Scenario: Requesting a sign-in link
- **WHEN** a visitor submits their email address to sign in
- **THEN** the system emails that address a time-limited sign-in link and does not ask for or store a password

#### Scenario: Following a valid sign-in link authenticates the visitor
- **WHEN** a visitor follows a sign-in link that has not expired or been used
- **THEN** the system creates or resumes their session and treats them as signed in

#### Scenario: An expired or reused link is rejected
- **WHEN** a visitor follows a sign-in link that has already expired or already been used
- **THEN** the system does not authenticate them and prompts them to request a new link

### Requirement: A signed-in identity is what billing records attach to
Every `Subscription` and `FulfillmentFee` record SHALL be attached to a real account created by this capability, not to a bare, unauthenticated email string.

#### Scenario: A new subscriber gets an account
- **WHEN** a visitor completes Stripe Checkout for the Troubleshooting & Questions plan without an existing account
- **THEN** the system creates an account for their email as part of that flow and attaches the resulting `Subscription` to it

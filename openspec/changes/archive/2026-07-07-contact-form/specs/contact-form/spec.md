## ADDED Requirements

### Requirement: Homepage contact form
The homepage SHALL include a contact form with `name`, `email`, and `message` fields, styled consistently with the site's existing single-accent-color monospace theme and section-header convention.

#### Scenario: Visitor submits the contact form
- **WHEN** a visitor fills in name, email, and message and submits the form
- **THEN** the browser sends the submission to the API and the form shows a success confirmation without a full page reload

#### Scenario: Client-side validation blocks empty or malformed submissions
- **WHEN** a visitor submits the form with an empty required field or an invalid email address
- **THEN** the form displays a validation error and does not submit

### Requirement: Contact submission endpoint
The API SHALL expose a `POST /contact` endpoint that accepts `name`, `email`, and `message`, validates them server-side (non-empty, valid email format), and rejects invalid submissions with a 4xx response.

#### Scenario: Valid submission is accepted
- **WHEN** a client sends `POST /contact` with valid name, email, and message fields
- **THEN** the API responds with a 2xx status confirming receipt

#### Scenario: Invalid submission is rejected
- **WHEN** a client sends `POST /contact` with a missing field or malformed email
- **THEN** the API responds with a 4xx status and does not create a submission record

### Requirement: Submission persisted before notification
The API SHALL persist every valid contact submission to Postgres before attempting to send a notification email, and SHALL return a success response to the client even if the notification email fails to send.

#### Scenario: Submission is durable regardless of email outcome
- **WHEN** a valid submission is received and the Resend email send fails or times out
- **THEN** the submission is still present in the database and the client still receives a success response

### Requirement: Email notification via Resend
The API SHALL send an email notification to Robin's address when a valid contact submission is received, using the Resend API and the same sending domain configured for outbound mail.

#### Scenario: Notification email is sent on valid submission
- **WHEN** a valid submission is persisted
- **THEN** the API attempts to send an email via Resend containing the submitted name, email, and message

### Requirement: Basic spam resistance without a CAPTCHA
The contact form SHALL include a hidden honeypot field and a minimum-fill-time check; the API SHALL silently discard submissions that fill the honeypot field or arrive faster than a plausible human fill time, without informing the sender.

#### Scenario: Honeypot-filled submission is silently dropped
- **WHEN** a submission arrives with the honeypot field populated
- **THEN** the API does not persist the submission or send a notification, and returns a success-looking response to avoid signaling the check to automated senders

#### Scenario: Too-fast submission is silently dropped
- **WHEN** a submission arrives less than the configured minimum time after the form was rendered
- **THEN** the API does not persist the submission or send a notification, and returns a success-looking response

### Requirement: Per-IP rate limiting
The API SHALL rate-limit `POST /contact` submissions per client IP using an in-memory sliding window, rejecting excess requests with a 429 response.

#### Scenario: Excess requests from the same IP are rejected
- **WHEN** a client exceeds the configured submission rate from the same IP address
- **THEN** the API responds with 429 and does not persist or notify for the excess requests

### Requirement: CORS restricted to known web origins
The API SHALL only accept cross-origin browser requests to `POST /contact` from `https://robinsamways.ca`, `https://www.robinsamways.ca`, and `http://localhost:3000`.

#### Scenario: Request from an unrecognized origin is blocked
- **WHEN** a browser at an origin other than the allowed list attempts to call `POST /contact`
- **THEN** the browser's CORS enforcement blocks the request based on the API's response headers

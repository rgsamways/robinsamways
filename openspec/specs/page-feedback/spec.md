# page-feedback Specification

## Purpose
TBD - created by archiving change page-feedback. Update Purpose after archive.
## Requirements
### Requirement: Feedback widget renders at the bottom of every page except the homepage
Every page of the site except the homepage (`/`) SHALL render a feedback widget at the bottom of the page's content, with no page-specific configuration required. A newly added page SHALL automatically include the widget without any change to that page's own code.

#### Scenario: Widget appears on a non-homepage page
- **WHEN** a visitor loads any page other than `/` (e.g. `/farpost`, `/dev-log`, `/techstacks/credential-flow`)
- **THEN** the feedback widget renders at the bottom of that page's content

#### Scenario: Widget does not appear on the homepage
- **WHEN** a visitor loads `/`
- **THEN** the feedback widget is not rendered, since the homepage already has its own contact form

### Requirement: A submission requires a reaction, a comment, or both
The feedback widget SHALL let a visitor optionally select a positive or negative reaction and optionally enter a free-text comment. The submit action SHALL be unavailable until at least one of a selected reaction or a non-empty comment is present.

#### Scenario: Submitting with only a reaction is allowed
- **WHEN** a visitor selects a positive or negative reaction without entering a comment
- **THEN** the widget allows the submission

#### Scenario: Submitting with only a comment is allowed
- **WHEN** a visitor enters a comment without selecting a reaction
- **THEN** the widget allows the submission

#### Scenario: Submitting with neither is blocked
- **WHEN** a visitor has selected no reaction and entered no comment
- **THEN** the submit action is unavailable

### Requirement: Submission is private — stored and emailed, never displayed
A valid submission SHALL be persisted to Postgres, tagged with the page it was submitted from, and SHALL trigger a best-effort email notification to Robin via Resend. Submitted feedback SHALL NOT be displayed to any site visitor, on the submitting page or elsewhere.

#### Scenario: Valid submission is persisted and emailed
- **WHEN** a visitor submits a valid reaction and/or comment from a given page
- **THEN** the submission is stored in Postgres tagged with that page's path, and an email notification is sent to Robin

#### Scenario: Submission succeeds for the visitor even if the notification email fails
- **WHEN** a valid submission is received and the Resend email send fails or times out
- **THEN** the submission is still persisted and the visitor still sees a success confirmation

#### Scenario: Feedback is never shown back to visitors
- **WHEN** any visitor loads any page, including one that has received feedback submissions
- **THEN** no previously submitted feedback content is displayed anywhere on the page

### Requirement: Feedback submission endpoint validates and rate-limits like the contact form
The API SHALL expose `POST /feedback`, accepting `page`, an optional `sentiment` (`positive` or `negative`), and an optional `comment` (capped at 2000 characters). It SHALL reject a submission missing `page` or missing both `sentiment` and a non-empty `comment` with a 4xx response, apply the same honeypot and minimum-fill-time anti-bot checks as `/contact` (silently discarding a failing submission with a success-looking response), and rate-limit per client IP independently of `/contact`'s own limit.

#### Scenario: Valid submission is accepted
- **WHEN** a client sends `POST /feedback` with a valid `page` and at least one of `sentiment`/`comment`
- **THEN** the API responds with a 2xx status confirming receipt

#### Scenario: Submission missing both sentiment and comment is rejected
- **WHEN** a client sends `POST /feedback` with a `page` but no `sentiment` and no non-empty `comment`
- **THEN** the API responds with a 4xx status and does not create a submission record

#### Scenario: Honeypot-filled or too-fast submission is silently dropped
- **WHEN** a submission arrives with the honeypot field populated, or faster than the configured minimum fill time
- **THEN** the API does not persist the submission or send a notification, and returns a success-looking response

#### Scenario: Excess requests from the same IP are rejected independently of /contact
- **WHEN** a client exceeds the configured submission rate to `/feedback` from one IP, while that same IP is still within `/contact`'s own separate limit
- **THEN** `POST /feedback` responds with 429 while `POST /contact` from the same IP is unaffected


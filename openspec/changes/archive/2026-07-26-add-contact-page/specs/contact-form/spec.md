## MODIFIED Requirements

### Requirement: Homepage contact form
The `/contact` page SHALL include a contact form with `name`, `email`, and `message` fields, styled consistently with the site's existing single-accent-color monospace theme and section-header convention. The form no longer renders on the homepage itself — the homepage's own Contact section links to `/contact` instead, per the `resume-homepage` capability.

#### Scenario: Visitor submits the contact form
- **WHEN** a visitor fills in name, email, and message on `/contact` and submits the form
- **THEN** the browser sends the submission to the API and the form shows a success confirmation without a full page reload

#### Scenario: Client-side validation blocks empty or malformed submissions
- **WHEN** a visitor submits the form with an empty required field or an invalid email address
- **THEN** the form displays a validation error and does not submit

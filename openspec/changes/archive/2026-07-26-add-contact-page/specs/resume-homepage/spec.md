## MODIFIED Requirements

### Requirement: Contact section present after Continuing Education
The homepage SHALL include a Contact section, placed after Continuing Education and before the footer, using the same `##`-marker section-header convention as the other resume sections (e.g. `## CONTACT`). This section SHALL contain a short pointer — one line of text and a link to `/contact` — rather than the contact form itself; the real form, defined by the `contact-form` capability, renders only on `/contact`.

#### Scenario: Contact section appears in the correct position
- **WHEN** a visitor scrolls through the full homepage
- **THEN** a Contact section with a `## CONTACT` style header appears after Continuing Education and before the footer

#### Scenario: The homepage's Contact section points to /contact rather than containing the form
- **WHEN** a visitor reaches the homepage's Contact section
- **THEN** they see a short pointer with a link to `/contact`, not the `name`/`email`/`message` form fields directly

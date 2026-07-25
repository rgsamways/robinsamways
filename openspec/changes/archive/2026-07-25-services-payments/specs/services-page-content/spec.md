## MODIFIED Requirements

### Requirement: Services page renders seven sections behind a pill filter bar
The `/services` route SHALL render a "$ Services" heading, followed by a short intro blurb, followed by a pill-style filter bar (matching `/dev-log`'s and `/farpost`'s existing pill-bar pattern) with one pill per section — Web Sites, Web Applications, Native Applications, Platform, Hourly, Field Documentation, and Troubleshooting & Questions — filtering which sections are shown. With no pills active, all seven sections are shown.

#### Scenario: Visitor sees all seven sections by default
- **WHEN** a visitor loads `/services` with no pills active
- **THEN** the page shows the Web Sites, Web Applications, Native Applications, Platform, Hourly, Field Documentation, and Troubleshooting & Questions sections

#### Scenario: Activating a pill isolates its section
- **WHEN** a visitor activates the "Platform" pill
- **THEN** only the Platform section remains visible; the other six are hidden

#### Scenario: Deactivating every pill shows every section again
- **WHEN** a visitor deactivates every active pill
- **THEN** all seven sections are shown again

### Requirement: Each section ends with a call-to-action
Every section except Field Documentation and Troubleshooting & Questions SHALL end with a call-to-action linking to the homepage contact form. The Field Documentation section SHALL end with a call-to-action linking to `field.farpost.ca` instead. The Troubleshooting & Questions section SHALL end with a working subscribe control that starts a Stripe Checkout session instead.

#### Scenario: A standard section's call-to-action links to the contact form
- **WHEN** a visitor reads the Web Sites, Web Applications, Native Applications, Platform, or Hourly section
- **THEN** that section ends with a link to the homepage contact form

#### Scenario: Field Documentation's call-to-action links externally
- **WHEN** a visitor reads the Field Documentation section
- **THEN** that section ends with a link to `field.farpost.ca` rather than the homepage contact form

#### Scenario: Troubleshooting & Questions ends with a subscribe control
- **WHEN** a visitor reads the Troubleshooting & Questions section
- **THEN** that section ends with a working subscribe control that starts a Stripe Checkout session, rather than a contact-form link

## REMOVED Requirements

### Requirement: No section displays a price or rate
**Reason**: Policy reversed by Robin — every section may now show pricing information, understated and shown at the point payment is actually being asked for, never on the homepage.
**Migration**: See the new "Sections may display pricing information" requirement below.

## ADDED Requirements

### Requirement: Sections may display pricing information
Any section on the Services page MAY display pricing information, shown in an understated, non-promotional way rather than as a marketing headline. A section whose scope is fixed (Troubleshooting & Questions, Hourly) SHALL display a real price or rate. A section whose scope is inherently variable (Web Sites' tiers, Web Applications, Native Applications, Platform) MAY instead state plainly that pricing is quoted per project and disclosed before any payment is collected, rather than showing one fixed figure for work that doesn't have one. No pricing information of any kind SHALL appear on the homepage.

#### Scenario: A fixed-scope section shows a real price
- **WHEN** a visitor reads the Troubleshooting & Questions or Hourly section
- **THEN** that section displays its real price or rate

#### Scenario: A variable-scope section states pricing is quoted per project
- **WHEN** a visitor reads the Platform section
- **THEN** that section states that pricing is quoted per project and disclosed before payment, without displaying one fixed dollar figure

#### Scenario: The homepage never mentions pricing
- **WHEN** a visitor loads the homepage
- **THEN** no pricing information from any `/services` category appears anywhere on it

### Requirement: The site remains free to browse outside Troubleshooting & Questions
No part of the site other than actually subscribing to or managing the Troubleshooting & Questions plan SHALL require sign-in or payment. Browsing `/services`, reading any section's content or pricing information, and using the homepage contact form SHALL remain open to every visitor, signed in or not.

#### Scenario: An unauthenticated visitor can read every section
- **WHEN** a visitor who has never signed in loads `/services`
- **THEN** they can read all seven sections in full, including pricing information, without being prompted to sign in or pay

#### Scenario: The contact form stays open to everyone
- **WHEN** a visitor who is not signed in and not a subscriber submits the homepage contact form
- **THEN** the system accepts the submission the same as it does today, with no sign-in or payment required

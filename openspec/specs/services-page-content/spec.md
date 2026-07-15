# services-page-content Specification

## Purpose
TBD - created by archiving change services-page. Update Purpose after archive.
## Requirements
### Requirement: Services page renders six sections behind a pill filter bar
The `/services` route SHALL render a "$ Services" heading, followed by a short intro blurb, followed by a pill-style filter bar (matching `/dev-log`'s and `/farpost`'s existing pill-bar pattern) with one pill per section — Web Sites, Web Applications, Native Applications, Platform, Hourly, and Field Documentation — filtering which sections are shown. With no pills active, all six sections are shown.

#### Scenario: Visitor sees all six sections by default
- **WHEN** a visitor loads `/services` with no pills active
- **THEN** the page shows the Web Sites, Web Applications, Native Applications, Platform, Hourly, and Field Documentation sections

#### Scenario: Activating a pill isolates its section
- **WHEN** a visitor activates the "Platform" pill
- **THEN** only the Platform section remains visible; the other five are hidden

#### Scenario: Deactivating every pill shows every section again
- **WHEN** a visitor deactivates every active pill
- **THEN** all six sections are shown again

### Requirement: Services page has an intro blurb beneath its heading
The "$ Services" heading SHALL be followed by a short intro blurb (one to two sentences) stating that Robin is a developer available for freelance/contract work, matching the intro-blurb pattern already used on the Sreditor, Tech/Stacks, and Farpost hub pages.

#### Scenario: Visitor sees the intro blurb under the heading
- **WHEN** a visitor loads `/services`
- **THEN** the page shows a short intro blurb directly beneath the "$ Services" heading, stating that Robin is a developer available for freelance/contract work

### Requirement: Web Sites section presents three packages without public pricing
The Web Sites section SHALL present three distinct packages, each with a name and a description of what it includes, and SHALL NOT display any dollar figure or rate for any package.

#### Scenario: Visitor sees three distinct packages
- **WHEN** a visitor reads the Web Sites section
- **THEN** three named packages are shown, each with its own description of scope, and none displays a price

### Requirement: No section displays a price or rate
No section on the Services page (Web Sites, Web Applications, Native Applications, Platform, Hourly, or Field Documentation) SHALL display a dollar figure, rate, or other pricing information; each instead directs an interested visitor to make contact.

#### Scenario: Hourly section has no visible rate
- **WHEN** a visitor reads the Hourly section
- **THEN** no hourly rate or dollar figure is shown, and the section directs the visitor to make contact instead

### Requirement: Each section ends with a call-to-action
Every section except Field Documentation SHALL end with a call-to-action linking to the homepage contact form. The Field Documentation section SHALL end with a call-to-action linking to `field.farpost.ca` instead.

#### Scenario: A standard section's call-to-action links to the contact form
- **WHEN** a visitor reads the Web Sites, Web Applications, Native Applications, Platform, or Hourly section
- **THEN** that section ends with a link to the homepage contact form

#### Scenario: Field Documentation's call-to-action links externally
- **WHEN** a visitor reads the Field Documentation section
- **THEN** that section ends with a link to `field.farpost.ca` rather than the homepage contact form


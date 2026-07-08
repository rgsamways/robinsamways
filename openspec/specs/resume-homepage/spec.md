# resume-homepage Specification

## Purpose
TBD - created by archiving change initial-site-scaffold. Update Purpose after archive.
## Requirements
### Requirement: Header replicates resume header layout
The homepage header SHALL display a literal `$` prompt immediately before the text "Robin Samways", a circular or rounded-square headshot image positioned at the top-right of the header, and a thin horizontal rule dividing the header from the body content below it. The `$` SHALL be rendered in the site's single accent color; the rest of the header text SHALL be in the default dark body text color.

#### Scenario: Header renders on page load
- **WHEN** a visitor loads the homepage
- **THEN** the header shows `$ Robin Samways` with the `$` in the accent color, a headshot image top-right, and a horizontal rule beneath the header

### Requirement: Section headers use literal Markdown syntax
Each resume section (Profile, Experience, Skills, Education, Continuing Education) SHALL render its heading as literal Markdown-style text (e.g. `## PROFILE`, `## EXPERIENCE`, `## SKILLS`, `## EDUCATION`, `## CONTINUING_EDUCATION`), with the `##` marker in the accent color and the section name in the default body text color. Each section header SHALL be followed by a short horizontal rule.

#### Scenario: Section headers render with markdown-style markers
- **WHEN** a visitor scrolls through the homepage
- **THEN** each section heading displays its literal `##` prefix in the accent color, followed by the section name, followed by a short horizontal rule

### Requirement: Single monospace font and single accent color
The homepage SHALL use one monospace font (JetBrains Mono) consistently for all text, and SHALL use exactly one warm orange/amber accent color applied to: the `$` prompt, the word "post" within "Farpost", the tel/email contact labels, the `##` section markers, right-aligned experience date ranges, the horizontal rule under each section header, and the Skills box's left border. All other text SHALL be black/dark-gray on a white/light background.

#### Scenario: Accent color used consistently across all designated elements
- **WHEN** the homepage is rendered
- **THEN** the `$`, "post" in "Farpost", contact labels, `##` markers, date ranges, section-header rules, and the Skills box left border all use the same accent color, and no other element uses that color

### Requirement: Experience section lists all roles with correct details
The Experience section SHALL list, in reverse chronological order, each of: Farpost (2026 — Present), Impres Pharma (2012 — 2025), FileTrack Solutions (2009 — 2012), Padre Software (2004 — 2009), Concept Interactive (2001 — 2004), and Instructor at George Brown College (c. 2000). Each entry SHALL show the employer/role name, a right-aligned accent-colored date range, and line items prefixed with a `›` arrow bullet.

#### Scenario: Experience entries render in order with correct date ranges
- **WHEN** a visitor views the Experience section
- **THEN** all six entries appear in reverse chronological order, each with its date range right-aligned in the accent color and its detail lines prefixed with `›`

#### Scenario: Farpost start date reflects corrected founding year
- **WHEN** a visitor views the Farpost entry
- **THEN** the date range reads "2026 — Present", not 2025

#### Scenario: Impres Pharma tenure reflects corrected timeline
- **WHEN** a visitor views the Impres Pharma entry
- **THEN** the date range reads "2012 — 2025" (13 years), not a range implying 16 years

#### Scenario: Impres Pharma role framing reflects team leadership, not solo work
- **WHEN** a visitor views the Impres Pharma entry's bullet list
- **THEN** the first bullet reads "Lead developer of a proprietary web-based CRM for pharmaceutical sales and marketing operations across Canada" and the last bullet reads "Team lead managing the full product lifecycle across 13 years of continuous operation" — not "Original architect..." or "Sole developer..."

### Requirement: Skills section renders as a shaded, left-bordered box
The Skills section SHALL render as a visually distinct box with a shaded background and an accent-colored left border, containing aligned `label   value` rows (e.g. `languages   Python · TypeScript · JavaScript`) styled like a code block, for at least: languages, frameworks, data, infra, and practice.

#### Scenario: Skills box renders with aligned rows
- **WHEN** a visitor views the Skills section
- **THEN** a shaded box with an accent-colored left border displays each label/value row, with labels vertically aligned and values separated by `·`

### Requirement: Footer styled as a code comment
The homepage footer SHALL render as a code comment, with `// 25 yrs · independent remote developer since 2009` left-aligned and `EN native · FR novice` right-aligned, both using the `//` comment convention visually associated with the monospace theme.

#### Scenario: Footer renders with left and right aligned comment text
- **WHEN** a visitor scrolls to the bottom of the homepage
- **THEN** the footer shows the tenure comment left-aligned and the language proficiency text right-aligned, styled to read as a code comment

### Requirement: Profile, Education, and Continuing Education content present
The homepage SHALL include a Profile section with a short blurb, an Education section listing the George Brown College Diploma and the BA Geography from the University of Windsor, and a Continuing Education section listing University of Waterloo coursework (2025 — 2026).

#### Scenario: All resume sections are present
- **WHEN** a visitor views the full homepage
- **THEN** Profile, Experience, Skills, Education, and Continuing Education sections are all present with their respective content

#### Scenario: Profile blurb credits architecture role without overclaiming originality
- **WHEN** a visitor reads the Profile section
- **THEN** it includes the sentence "Architect of enterprise CRM and integration systems." — not "Original architect of enterprise CRM and integration systems."

### Requirement: Contact section present after Continuing Education
The homepage SHALL include a Contact section, placed after Continuing Education and before the footer, using the same `##`-marker section-header convention as the other resume sections (e.g. `## CONTACT`), and containing the contact form defined by the `contact-form` capability.

#### Scenario: Contact section appears in the correct position
- **WHEN** a visitor scrolls through the full homepage
- **THEN** a Contact section with a `## CONTACT` style header appears after Continuing Education and before the footer


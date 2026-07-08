## MODIFIED Requirements

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

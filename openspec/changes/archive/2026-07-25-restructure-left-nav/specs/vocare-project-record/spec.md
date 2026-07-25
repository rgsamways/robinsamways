## MODIFIED Requirements

### Requirement: Vocare hub presents project background and links to its project-record pages
The `/vocare` route SHALL render a heading, a short project-background blurb introducing Vocare, and links to its ten project-record pages, in this order: Build Plan, Feature List, Tech Stack, Upgrade Path, Current Metrics, Outlook, Bug List, Testing & Verification, Lightbulbs, and Glossary. Embedding Vocare's actual live build on this page remains explicitly out of scope for this requirement, tracked separately.

#### Scenario: Visitor sees the hub and its ten links
- **WHEN** a visitor loads `/vocare`
- **THEN** the page shows the heading, project-background blurb, and links to each of Build Plan, Feature List, Tech Stack, Upgrade Path, Current Metrics, Outlook, Bug List, Testing & Verification, Lightbulbs, and Glossary, in that order

## ADDED Requirements

### Requirement: Bug List documents real bugs found and fixed in Vocare
The `/vocare/bug-list` route SHALL present a running, dated account of real bugs found and fixed during Vocare's development, sourced from `vocare-status.json`, each entry naming the bug, its real or likely cause, and how it was resolved. The page SHALL honestly state if no entries exist yet, rather than fabricating placeholder bugs.

#### Scenario: Visitor reads a bug-list entry
- **WHEN** a visitor loads `/vocare/bug-list` after at least one entry exists in `vocare-status.json`
- **THEN** the page shows that entry's date, description, and resolution

#### Scenario: Empty bug list is stated honestly
- **WHEN** a visitor loads `/vocare/bug-list` before any entries exist
- **THEN** the page states plainly that no bugs have been logged yet, rather than showing fabricated entries

### Requirement: Testing & Verification describes Vocare's real testing practice
The `/vocare/testing-verification` route SHALL describe Vocare's actual testing practice — what's covered, what isn't, and whether it's automated or manual — sourced from `vocare-status.json`, without overclaiming automation that doesn't exist.

#### Scenario: Visitor reads an accurate account of Vocare's testing practice
- **WHEN** a visitor reads `/vocare/testing-verification`
- **THEN** the copy accurately reflects Vocare's real current testing state as recorded in `vocare-status.json`

### Requirement: Lightbulbs surfaces Vocare-specific idea-capture entries
The `/vocare/lightbulbs` route SHALL render a public listing of idea-capture entries specific to Vocare, sourced from `vocare-status.json`, presenting each idea's title and one-line summary.

#### Scenario: Visitor sees Vocare's own lightbulb ideas
- **WHEN** a visitor loads `/vocare/lightbulbs`
- **THEN** the page lists Vocare-specific idea entries from `vocare-status.json`, not ideas belonging to other projects

### Requirement: Glossary explains Vocare-specific technical terms in plain language
The `/vocare/glossary` route SHALL present a growing list of "X, in layman's terms" entries specific to Vocare's own domain and technical choices, sourced from `vocare-status.json`, each explained without assuming prior technical background.

#### Scenario: Visitor reads a Vocare glossary entry
- **WHEN** a visitor reads an entry on `/vocare/glossary`
- **THEN** the term is explained in plain language, without assuming the reader already knows related jargon

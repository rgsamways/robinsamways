## ADDED Requirements

### Requirement: Bug List documents real bugs Farpost's rebuild has found and fixed
The `/farpost/bug-list` route SHALL present a running, dated account of real bugs found and fixed during Farpost's rebuild, sourced from `farpost-status.json`, each entry naming the bug, its real or likely cause, and how it was resolved. The page SHALL honestly state if no entries exist yet, rather than fabricating placeholder bugs.

#### Scenario: Visitor reads a bug-list entry
- **WHEN** a visitor loads `/farpost/bug-list` after at least one entry exists in `farpost-status.json`
- **THEN** the page shows that entry's date, description, and resolution

#### Scenario: Empty bug list is stated honestly
- **WHEN** a visitor loads `/farpost/bug-list` before any entries exist
- **THEN** the page states plainly that no bugs have been logged yet, rather than showing fabricated entries

### Requirement: Testing & Verification describes Farpost's real testing practice
The `/farpost/testing-verification` route SHALL describe Farpost's actual testing practice for the rebuild — what's covered, what isn't, and whether it's automated or manual — sourced from `farpost-status.json`, without overclaiming automation that doesn't exist.

#### Scenario: Visitor reads an accurate account of Farpost's testing practice
- **WHEN** a visitor reads `/farpost/testing-verification`
- **THEN** the copy accurately reflects Farpost's real current testing state as recorded in `farpost-status.json`

### Requirement: Lightbulbs surfaces Farpost-specific idea-capture entries
The `/farpost/lightbulbs` route SHALL render a public listing of idea-capture entries specific to Farpost, sourced from `farpost-status.json`, presenting each idea's title and one-line summary.

#### Scenario: Visitor sees Farpost's own lightbulb ideas
- **WHEN** a visitor loads `/farpost/lightbulbs`
- **THEN** the page lists Farpost-specific idea entries from `farpost-status.json`, not ideas belonging to other projects

### Requirement: Glossary explains Farpost-specific technical terms in plain language
The `/farpost/glossary` route SHALL present a growing list of "X, in layman's terms" entries specific to Farpost's own domain and technical choices, sourced from `farpost-status.json`, each explained without assuming prior technical background.

#### Scenario: Visitor reads a Farpost glossary entry
- **WHEN** a visitor reads an entry on `/farpost/glossary`
- **THEN** the term is explained in plain language, without assuming the reader already knows related jargon

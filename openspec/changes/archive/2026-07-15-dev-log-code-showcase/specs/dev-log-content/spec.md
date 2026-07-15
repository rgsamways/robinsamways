## RENAMED Requirements
- FROM: `### Requirement: Dev Log renders real content with a local section menu`
- TO: `### Requirement: Dev Log renders real content organized into five filterable sections`

## MODIFIED Requirements

### Requirement: Dev Log renders real content organized into five filterable sections
The `/dev-log` route SHALL render real content organized into five sections, in this order: Glossary, Testing & Verification, Metrics, Bug Log, and Code Showcase. A pill-style filter bar above the sections (per the "A pill bar filters Dev Log sections by visibility" requirement) SHALL let a visitor show only a chosen subset of these sections.

#### Scenario: Visitor sees all five sections
- **WHEN** a visitor loads `/dev-log` with no pills active
- **THEN** the page shows the Glossary, Testing & Verification, Metrics, Bug Log, and Code Showcase sections, in that order

## ADDED Requirements

### Requirement: A pill bar filters Dev Log sections by visibility
The `/dev-log` route SHALL display a horizontal row of pills above its sections, one per section (Glossary, Testing & Verification, Metrics, Bug Log, Code Showcase). Activating a pill toggles it on or off; when one or more pills are active, only the corresponding sections are shown. With no pills active, all sections are shown.

#### Scenario: Activating a pill isolates its section
- **WHEN** a visitor activates the "Code Showcase" pill
- **THEN** only the Code Showcase section remains visible; the other four are hidden

#### Scenario: Activating multiple pills shows the union of their sections
- **WHEN** a visitor activates both the "Bug Log" and "Code Showcase" pills
- **THEN** both the Bug Log and Code Showcase sections are shown, and the other three remain hidden

#### Scenario: Deactivating every pill shows every section again
- **WHEN** a visitor deactivates every active pill
- **THEN** all five sections are shown again

### Requirement: Code Showcase entries present real Farpost code with a plain-language framing and payoff
The Code Showcase section SHALL present at least 10 entries, each showcasing one genuine, verified piece of code from the Farpost project. Each entry SHALL include: a kicker identifying the project, category, and date; a title; 1-2 plain-language framing paragraphs a non-engineer reader can follow; one or more annotated code blocks; a labeled "The fix" explanation of the technical specifics; and a labeled "Why this matters" explanation translating the fix into a named engineering competency (e.g. root-cause diagnosis, judgment under ambiguity, defensive design, verification discipline).

#### Scenario: Visitor reads a Code Showcase entry
- **WHEN** a visitor reads a Code Showcase entry
- **THEN** it shows the kicker, title, framing paragraphs, real code, "The fix," and "Why this matters," in that order, describing genuine code from the Farpost project rather than an illustrative or paraphrased example

#### Scenario: Code Showcase entries visually match the rest of the Dev Log page
- **WHEN** a visitor views a Code Showcase entry alongside a Bug Log entry on the same page
- **THEN** both use the same code-block and labeled-subsection styling, rather than two different visual systems

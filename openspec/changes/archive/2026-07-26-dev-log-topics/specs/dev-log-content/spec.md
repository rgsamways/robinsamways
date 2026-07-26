## ADDED Requirements

### Requirement: Every Dev Log entry belongs to exactly one topic, and the hub can filter by it
Each Dev Log entry SHALL carry a `topic` value from a fixed set — Engineering, Process & Verification, Architecture & Stack Decisions, Business Model, Human Factors — in addition to its existing project/category/date fields. The `/dev-log` hub page SHALL show a single-select topic filter that, when a topic is selected, shows only entries with that topic, most recent first; an "All" option SHALL restore the full unfiltered list.

#### Scenario: Selecting a topic filters the list
- **WHEN** a visitor on `/dev-log` selects a topic
- **THEN** only entries with that topic are shown, most recent first

#### Scenario: Selecting All shows every entry
- **WHEN** a visitor on `/dev-log` selects "All," or loads the page fresh
- **THEN** every Dev Log entry is shown, most recent first, regardless of topic

## MODIFIED Requirements

### Requirement: Dev Log renders as a hub linking to its entries directly
The `/dev-log` route SHALL render a hub page — a heading, a short intro blurb, a single-select topic filter (per the "Every Dev Log entry belongs to exactly one topic" requirement), and a list of links to every Dev Log entry (the former Code Showcase articles, now direct children of Dev Log, plus any future posts), most recent first — rather than rendering any entry's content directly on `/dev-log` itself, and rather than grouping entries under an intermediate "Code Showcase" heading.

#### Scenario: Visitor sees the hub, its topic filter, and its entries
- **WHEN** a visitor loads `/dev-log`
- **THEN** the page shows the heading, intro blurb, the topic filter defaulted to "All," and a link to every Dev Log entry, most recent first, with no intermediate "Code Showcase" grouping and no Bug Log/Metrics/Testing & Verification/Glossary links

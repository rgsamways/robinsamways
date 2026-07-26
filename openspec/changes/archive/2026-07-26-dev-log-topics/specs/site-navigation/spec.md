## MODIFIED Requirements

### Requirement: Writing group's Dev Log entry links to a collapsible submenu of Dev Log pages
The Writing group's "Dev Log" entry SHALL be a link to `/dev-log` (rendering a short hub landing, per the `dev-log-content` capability) and SHALL also expose a collapsible submenu listing the 5 most recently published Dev Log entries by title, most recent first, followed by a trailing "View All" link to `/dev-log` — not every entry, since Dev Log is an unbounded, growing stream rather than a fixed page set. Dev Log no longer has Bug Log, Metrics, Testing & Verification, Glossary, or Lightbulbs as its own sub-pages — that content now lives per-Work-project (or, for Metrics, under Site).

#### Scenario: Dev Log submenu lists the 5 most recent entries plus View All
- **WHEN** a visitor expands the Dev Log group under Writing, and more than 5 Dev Log entries exist
- **THEN** the submenu lists the 5 most recently published entries by title, most recent first, followed by a "View All" link to `/dev-log`, with no "Code Showcase" grouping node anywhere in the tree

#### Scenario: Fewer than 5 entries exist
- **WHEN** fewer than 5 Dev Log entries exist
- **THEN** the submenu lists all of them, most recent first, still followed by the "View All" link

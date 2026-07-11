## REMOVED Requirements

### Requirement: Narrative renders as a showcase index of story-driven pages
**Reason**: The Method/Narrative story-type organization is retired in favor of a subject-based one. Narrative's three members split by whether they're Farpost-tied: Farpost Pulse and Farpost Atlas move under the new Farpost hub; Credential Flow moves to the new Tech/Stacks index.
**Migration**: Farpost Pulse and Farpost Atlas move to `/farpost/farpost-pulse*` and `/farpost/farpost-atlas*` (see `farpost-pulse` and `farpost-atlas`'s modified requirements). Credential Flow moves to `/techstacks/credential-flow` (see the new `tech-stacks-index` capability). The `/narrative` route is removed with no redirect.

### Requirement: Project entries support optional display tags
**Reason**: This requirement was scoped to "a showcase index (Method or Narrative)," both of which are retired.
**Migration**: The new `tech-stacks-index` capability defines an equivalent optional-tags requirement for its own project entries. Farpost's hub pieces (Atlas, Pulse) don't use a tag-row pattern at all — they're full pages reached via the pill-tab bar, not index-card entries.

### Requirement: Credential Flow content lives at its own route
**Reason**: Credential Flow moves out of Narrative into the new Tech/Stacks index.
**Migration**: See the new `tech-stacks-index` capability's equivalent requirement, updated to `/techstacks/credential-flow`.

## REMOVED Requirements

### Requirement: Dispatch renders as a placeholder page
**Reason**: Superseded by the real Farpost Dispatch build (`farpost-dispatch-build`) — the placeholder is replaced with real case-study content.
**Migration**: See the new `farpost-dispatch` capability's case-study-page requirements, and this delta's added requirement below.

## ADDED Requirements

### Requirement: Dispatch renders as a real case-study page
The `/farpost/farpost-dispatch` route SHALL render the real Farpost Dispatch case-study page (its required sections and content are specified by the `farpost-dispatch` capability), replacing the earlier placeholder entirely.

#### Scenario: Visitor sees real content, not a placeholder
- **WHEN** a visitor loads `/farpost/farpost-dispatch`
- **THEN** the page shows the real case-study content — not "coming soon" placeholder text — while still rendering the shared Farpost pill-tab bar with Dispatch indicated as active

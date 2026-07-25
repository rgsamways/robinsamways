## REMOVED Requirements

### Requirement: Farpost renders as a hub with a pill-tab bar to its sub-pieces
**Reason**: Atlas, Dispatch, and Pulse moved out of Farpost's own page entirely, to the top-level Experiments group (per `tech-stacks-index`), since they were never actually part of Farpost's project work — they explored ideas relevant to Farpost without being built as Farpost. With those three tabs gone, the tab bar would have exactly one tab (Origins) left, which is not a meaningful navigation control.
**Migration**: Farpost's own sub-pages (Build Plan, Feature List, etc.) remain reachable via the left-nav submenu under Work, a separate navigation surface unaffected by this removal. Atlas/Dispatch/Pulse are now reachable via the Experiments group.

### Requirement: Dispatch renders as a real case-study page
**Reason**: Dispatch's route and content moved out of the Farpost hub structure entirely, to `/techstacks/farpost-dispatch`, alongside Atlas and Pulse.
**Migration**: See the `tech-stacks-index` capability's "Atlas, Dispatch, and Pulse content lives at their own routes under Experiments" requirement.

## MODIFIED Requirements

### Requirement: Farpost hub has an intro blurb beneath its heading
The `/farpost` page's "$ Farpost" heading SHALL be followed directly by a short intro blurb (one to two sentences), matching the pattern already used on the Sreditor and Experiments pages' own headings.

#### Scenario: Visitor sees the intro blurb under the heading
- **WHEN** a visitor loads `/farpost`
- **THEN** the page shows a short intro blurb directly beneath the "$ Farpost" heading

### Requirement: A pill bar filters the Origins tab's own sections by visibility
The `/farpost` page SHALL display a horizontal row of pills below its "$ Farpost" heading and intro blurb, above the Origin Story section, one pill per section (Origin Story, Problems It Solves, Lifecycle Example, Process). Activating a pill toggles it on or off; when one or more pills are active, only the corresponding sections are shown. With no pills active, all sections are shown.

#### Scenario: Filter bar renders below the heading and intro blurb
- **WHEN** a visitor loads `/farpost`
- **THEN** the "$ Farpost" heading and intro blurb appear first, then the section-filter pill bar, then the Origin Story section

#### Scenario: Activating a pill isolates its section
- **WHEN** a visitor activates the "Process" pill
- **THEN** only the Process section remains visible; the other three are hidden

#### Scenario: Activating multiple pills shows the union of their sections
- **WHEN** a visitor activates both the "Origin Story" and "Process" pills
- **THEN** both the Origin Story and Process sections are shown, and the other two remain hidden

#### Scenario: Deactivating every pill shows every section again
- **WHEN** a visitor deactivates every active pill
- **THEN** all four sections are shown again

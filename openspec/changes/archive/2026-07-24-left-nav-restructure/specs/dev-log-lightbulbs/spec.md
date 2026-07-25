## ADDED Requirements

### Requirement: Lightbulbs page surfaces docs/lightbulbs entries publicly
The `/dev-log/lightbulbs` route SHALL render a public listing of this repo's `docs/lightbulbs/` idea-capture entries, sourced from `docs/lightbulbs/rsw-lb-index.md`, presenting each idea's slug/title and one-line summary, adapted for a public reader rather than raw internal markdown.

#### Scenario: Visitor sees a list of lightbulb ideas
- **WHEN** a visitor loads `/dev-log/lightbulbs`
- **THEN** the page lists every entry from `docs/lightbulbs/rsw-lb-index.md` with a one-line summary each

### Requirement: A lightbulb entry that has graduated into a real change links to it
An entry whose originating lightbulb file notes it graduated into a real OpenSpec change (per `docs/lightbulbs/`'s own convention of leaving a pointer in the original file) SHALL show that pointer publicly, linking to the resulting site content where one exists.

#### Scenario: Graduated idea shows its outcome
- **WHEN** a visitor reads a lightbulb entry that has graduated into shipped site content
- **THEN** the entry links to where that idea ended up on the live site

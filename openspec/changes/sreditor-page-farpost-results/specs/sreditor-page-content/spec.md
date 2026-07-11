## MODIFIED Requirements

### Requirement: Content reflects Sreditor's real, verifiable state
The page's content SHALL describe Sreditor's actual built state — specific, checkable facts (file counts, test counts, what commands work end-to-end, what's still unfinished) — rather than aspirational or illustrative claims about what it might eventually do. When Sreditor has been run against an external project's real history, not just its own build, the RESULTS section SHALL state that result with the same specificity, including the denominator (how much of the external project was judged) and how any claim it surfaced was actually found, not just whether it was found.

#### Scenario: RESULTS section states real, specific facts
- **WHEN** a visitor reads the RESULTS section
- **THEN** it states concrete, verifiable facts about Sreditor's actual implementation state, including what remains unfinished, not just what works

#### Scenario: RESULTS section reflects calibration against an external project
- **WHEN** Sreditor has been run against a real external project's own history
- **THEN** the RESULTS section states that result as a specific, checkable fact (e.g. how many changes were judged, how many claims surfaced, and whether a claim was found through a single change or through rollup synthesizing multiple changes) rather than continuing to describe calibration as untested against external, genuinely eligible work

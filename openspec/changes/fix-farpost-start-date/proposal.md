## Why

While drafting the Farpost page's origin story tonight, Robin caught that the dispatch app was actually built in late May **2026**, not 2025 as the homepage resume currently states — the resume's Farpost date range is factually wrong and needs correcting before the interview.

## What Changes

- Correct the Farpost entry's date range on the homepage Experience section from "2025 — Present" to "2026 — Present".
- No other entries change — Impres Pharma's "2012 — 2025" range is untouched, since Robin only flagged the Farpost date as wrong.

## Capabilities

### Modified Capabilities
- `resume-homepage`: the Farpost entry's date range requirement is corrected from 2025 to 2026.

## Impact

- `web/src/components/resume/Experience.tsx`: one date string change.
- `openspec/specs/resume-homepage/spec.md`: the archived spec's Farpost date range needs the same correction via this change's delta.

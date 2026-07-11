## Why

Dev Log has been a placeholder ("// coming soon") since this site's very first scaffold. Four real ideas have accumulated as lightbulbs since — a layman's-terms glossary, an honest testing-practice writeup, a public dev-metrics dashboard, and a real-bug-plus-concept entry format — all captured, none prioritized or built. Time to build it for real, in the order Robin already confirmed.

## What Changes

- Replace the placeholder with a real `/dev-log` page combining two "living" sections (grow continuously, never a discrete dated entry) and a set of discrete, dated entries (grow over time as new ones get written):
  - **Glossary** — a growing "X, in layman's terms" Q&A list, launching with 5 starter terms (Twilio, OAuth 2.0 Client Credentials Flow, SOQL, Field History Tracking, NFC/RFID) already named in the source lightbulb.
  - **Testing & Verification entry** — an adapted, public-facing version of `docs/testing.md`'s honest engineering-practice story (real suites, what each covers, still no CI and why).
  - **Metrics dashboard** — a live chart/tally sourced from `docs/metrics.md`'s snapshot history, requiring a real (if modest) data pipeline — see design.md.
  - **Bug-and-concept entries** — launching with two, not one: the Cosmos DB shared-vs-dedicated-throughput bug and the Flex Consumption silent-zero-functions bug, both already logged as real Sreditor entries, adapted into public-facing writeups aimed at other developers.
- Add a local `HamburgerMenu` to the page, per the established per-page navigation pattern, linking to each of the four sections.

## Capabilities

### New Capabilities
- `dev-log-content`: the real `/dev-log` page — its four sections, the metrics data pipeline, and its local navigation menu.

### Modified Capabilities
- `site-navigation`: the Dev Log placeholder-route requirement is replaced with a requirement describing its real content, matching the pattern already used for Farpost, Method, and Narrative.

## Impact

- `web/src/app/dev-log/page.tsx`: rewritten from placeholder to real content.
- New component(s) for the metrics dashboard chart, and a new structured data source for it (see design.md).
- `openspec/specs/site-navigation/spec.md`: delta as described above.
- New: `openspec/specs/dev-log-content/spec.md`.
- No change to Method, Narrative, Farpost, or any existing project page.

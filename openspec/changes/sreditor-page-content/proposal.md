## Why

`/method/sreditor` has been a placeholder since Method/Narrative shipped, and Sreditor is the first real test of the Method-type section structure (PROBLEM → EXISTING_APPROACHES → HYPOTHESIS → METHOD → RESULTS → CONCLUSION) — written down as a requirement earlier but never actually used. Robin built Sreditor for real tonight, in its own repo, and brought back a complete, structured brief mapping cleanly onto that exact structure. Time to place it.

## What Changes

- Replace the `/method/sreditor` placeholder with real content: all six required sections, using the verbatim copy in this change's `design.md`.
- Update Method's index entry for Sreditor — new teaser copy reflecting what it actually is now, plus tags (TypeScript, Node.js, Claude/Anthropic API, OpenSpec, CLI).
- Add a local `HamburgerMenu` to the page, matching every other project page's established pattern, linking to all six sections.

## Capabilities

### New Capabilities
- `sreditor-page-content`: the real `/method/sreditor` page content, its six required sections, and its local navigation menu.

### Modified Capabilities
None to `method-index` itself — its existing requirements (index rendering, the Method-type section-structure rule) already anticipated this; this change is the first page to actually satisfy them, not a change to what they require.

## Impact

- `web/src/app/method/sreditor/page.tsx`: rewritten from placeholder to real content, verbatim copy from `design.md`.
- `web/src/app/method/page.tsx`: Sreditor's `PROJECTS` entry gets updated teaser text and tags.
- New: `openspec/specs/sreditor-page-content/spec.md`.
- No change to any other existing page.

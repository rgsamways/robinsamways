## Why

An individual project page's local menu (Credential Flow, Farpost Pulse, and eventually Sreditor) currently only links to that page's own on-page sections — there's no way back to the Method or Narrative index it's published under except the browser's back button or reopening the global site menu and navigating down again. The global menu solves the equivalent problem for the whole site by always listing Home first; project pages need the same "one click back to where you came from" for their own parent index.

## What Changes

- The project-page local menu requirement gains a link back to the page's parent index (Narrative for Credential Flow and Farpost Pulse; Method for Sreditor, once it has a local menu) alongside its existing section links.
- Farpost is explicitly excluded — it has no parent index to link back to, since it's a top-level page at the same tier as Method and Narrative, not published under either.

## Capabilities

### Modified Capabilities
- `project-page-navigation`: the "project page's local menu links to its own sections" requirement is broadened to also require a link back to the page's parent index, with scenarios covering both Credential Flow (→ Narrative) and Farpost Pulse (→ Narrative).

## Impact

- `web/src/app/narrative/credential-flow/page.tsx`: local `HamburgerMenu`'s link list gains a link back to `/narrative`.
- `web/src/app/narrative/farpost-pulse/page.tsx`: local `HamburgerMenu`'s link list gains a link back to `/narrative`.
- No change to Farpost's local menu, or to the Method/Narrative index pages' own local menus (those already link to their child project pages, which is the equivalent relationship in the other direction).
- `openspec/specs/project-page-navigation/spec.md`: delta as described above.

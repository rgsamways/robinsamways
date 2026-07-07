## Why

Robin wants the deployment runbook (`docs/deployment-guide.md`) available as an actual page on the live site, styled consistently with the rest of the site rather than as a separately-styled artifact — but not yet linked from navigation, since the deployment process itself hasn't happened and the page isn't meant to be publicly discoverable yet.

## What Changes

- Add a new route at `/ops/deploy` rendering the deployment runbook content using the site's existing design system (JetBrains Mono, the single amber accent token, `##`-style section headers, `›` bullets, Skills-box-style callouts) rather than a one-off visual treatment.
- The route exists and is directly reachable by URL, but is **not** added to the header nav menu and is marked `noindex` so it doesn't surface in search results or site navigation.
- Content mirrors `docs/deployment-guide.md`'s eight parts but is authored as site components, not generated from the markdown file at build time — kept in sync manually whenever the guide changes (same pattern as the Skills box and other hand-authored resume content).

## Capabilities

### New Capabilities
- `deployment-runbook-page`: An unlisted `/ops/deploy` route rendering the deployment runbook using the site's own design system.

### Modified Capabilities
(none)

## Impact

- Affected code: new route/components under `web/src/app/ops/deploy/`, reusing existing site primitives (`SectionHeader`, accent token, etc.) where they fit.
- No change to `docs/deployment-guide.md` itself, which remains the source of truth Chat/CLI keep the page in sync with.
- No nav/menu change — `site-navigation`'s existing requirements (three linked routes) are unaffected; this route is deliberately outside that set.

## ADDED Requirements

### Requirement: Unlisted route renders the deployment runbook
The site SHALL have a route at `/ops/deploy` rendering the deployment runbook content (the same eight parts as `docs/deployment-guide.md`: DNS cutover, `.com` forwarding, Vercel deploy, Railway + Postgres deploy, Postgres verification, email, end-to-end verification checklist, troubleshooting), styled using the site's existing design system rather than a separate visual treatment.

#### Scenario: Route renders the full runbook
- **WHEN** a visitor navigates directly to `/ops/deploy`
- **THEN** the page renders all eight parts of the deployment runbook, using the site's JetBrains Mono font, single amber accent token, `##`-style section headers, and `›`-bullet step styling consistent with the rest of the site

### Requirement: Route is unlisted, not publicly discoverable
The `/ops/deploy` route SHALL NOT appear in the header navigation menu, and SHALL be marked non-indexable (e.g. a `noindex` meta tag) so it does not surface in search engine results. It remains directly reachable by anyone who knows the URL.

#### Scenario: Route absent from navigation
- **WHEN** a visitor opens the header menu on any page
- **THEN** Portfolio, Farpost, and Dev Log are listed, and no link to `/ops/deploy` appears

#### Scenario: Route marked non-indexable
- **WHEN** a search engine crawler or the page's own metadata is inspected
- **THEN** the `/ops/deploy` page includes a `noindex` directive

### Requirement: Content kept in sync with the source runbook
The `/ops/deploy` page's content SHALL be manually kept in sync with `docs/deployment-guide.md` whenever that document changes — it is not generated from the markdown file at build time.

#### Scenario: Guide updated with a new step
- **WHEN** `docs/deployment-guide.md` gains a new step, gotcha, or service
- **THEN** the corresponding content on `/ops/deploy` is updated to match before the change is considered complete

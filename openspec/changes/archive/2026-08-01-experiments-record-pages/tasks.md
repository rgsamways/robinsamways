## 1. Nav shape fix

- [x] 1.1 Remove the redundant middle `{href: "/techstacks", label: "Experiments", children: [...]}` node in `DrawerNav.tsx`'s `NAV_GROUPS`; the Experiments heading's `links` become Atlas, Dispatch, Pulse, and Credential Flow directly
- [x] 1.2 Add a trailing `{href: "/techstacks", label: "View All"}` plain link after Credential Flow, mirroring Dev Log's existing "View All" entry
- [x] 1.3 Add an `EXPERIMENT_RECORD_CHILDREN(base)` helper (mirroring `PROJECT_RECORD_CHILDREN`) generating the six-page submenu: Tech Stack, Architecture, Object Model, Design Notes, AI Notes, Setup Gallery
- [x] 1.4 Verify Work's and Writing's existing groups render unchanged (regression check before wiring any new Experiment submenu)

## 2. Atlas pages

- [x] 2.1 Resolve the Setup Gallery open question with Robin: does `farpost-atlas-geo` have a genuine external config step to photograph, or none? — Robin: undecided, ship an honest stub for now
- [x] 2.2 Trim `/techstacks/farpost-atlas`'s architecture-rationale copy to a brief summary linking to the new Architecture page
- [x] 2.3 Create `/techstacks/farpost-atlas/tech-stack` (Shapely, in-memory GeoJSON index, Leaflet)
- [x] 2.4 Create `/techstacks/farpost-atlas/architecture` (startup-time index load, per-request point-in-polygon lookup, the three HTTP endpoints)
- [x] 2.5 Create `/techstacks/farpost-atlas/object-model` (`TrackedBuilding`/`TrackedRecord` schema and relationship)
- [x] 2.6 Create `/techstacks/farpost-atlas/design-notes` (why Shapely + in-memory index over real PostGIS; what scaling would change)
- [x] 2.7 Create `/techstacks/farpost-atlas/ai-notes` as an honest, dated stub — no AI mechanic today, deferred to a future change
- [x] 2.8 Create `/techstacks/farpost-atlas/setup-gallery` per task 2.1's answer — real screenshots, or an honest "nothing to show" statement
- [x] 2.9 Wire the Atlas submenu into `DrawerNav.tsx`

## 3. Dispatch pages

- [x] 3.1 Trim `/techstacks/farpost-dispatch` to the non-relationship disclaimer plus brief summaries of object model, architecture, and AI-matching, each linking to its dedicated page
- [x] 3.2 Create `/techstacks/farpost-dispatch/tech-stack` (Salesforce DX, Apex, Experience Cloud, Named-Credential Anthropic callout)
- [x] 3.3 Create `/techstacks/farpost-dispatch/architecture` (non-relationship statement first, then source-driven build, concurrency-safe claiming, Partner Community portal)
- [x] 3.4 Create `/techstacks/farpost-dispatch/object-model` (Contact custom fields, `Job__c` fields)
- [x] 3.5 Create `/techstacks/farpost-dispatch/design-notes` (Apex-native AI callout reasoning; why no live public demo)
- [x] 3.6 Create `/techstacks/farpost-dispatch/ai-notes` (build-process AI use, then the ranked/reasoned matching mechanic and its contrast with Credential Flow)
- [x] 3.7 Create `/techstacks/farpost-dispatch/setup-gallery` component, scoped to accept real Experience Cloud / Named Credential screenshots — flag to Robin that screenshots need capturing before this page has real content (shipped as an honest "screenshots coming soon" stub)
- [x] 3.8 Wire the Dispatch submenu into `DrawerNav.tsx`

## 4. Pulse pages

- [x] 4.1 Trim `/techstacks/farpost-pulse` to a brief architecture/tech-stack summary linking to the dedicated pages
- [x] 4.2 Create `/techstacks/farpost-pulse/tech-stack` (Azure Functions, Cosmos DB, Next.js frontend)
- [x] 4.3 Create `/techstacks/farpost-pulse/architecture` (three Cosmos containers, partition keys, four HTTP endpoints)
- [x] 4.4 Create `/techstacks/farpost-pulse/object-model` (`FieldTech`/`Job`/`CoachingHistory` shapes and cross-references)
- [x] 4.5 Create `/techstacks/farpost-pulse/design-notes` (seed-data patterning rationale; isolated `generateCoachingTip()` function boundary)
- [x] 4.6 Create `/techstacks/farpost-pulse/ai-notes`, explicitly disclosing that tip generation is currently mocked pending Azure OpenAI deployment quota
- [x] 4.7 Create `/techstacks/farpost-pulse/setup-gallery` component, scoped to accept real Azure Function App / Cosmos DB screenshots — flag to Robin that screenshots need capturing before this page has real content (shipped as an honest "screenshots coming soon" stub)
- [x] 4.8 Wire the Pulse submenu into `DrawerNav.tsx`

## 5. Credential Flow pages

- [x] 5.1 Trim `/techstacks/credential-flow` to the licensing statement plus brief summaries of architecture, design reasoning, and object model, each linking to its dedicated page
- [x] 5.2 Create `/techstacks/credential-flow/tech-stack` (OAuth 2.0 Client Credentials via raw `httpx`, `Loan_Application__c`, Record-Triggered Flow, Anthropic API)
- [x] 5.3 Create `/techstacks/credential-flow/architecture` (token lifecycle, four endpoints, layered write protections, Archived-record delete protection)
- [x] 5.4 Create `/techstacks/credential-flow/object-model` (`Loan_Application__c` fields/lookups, decision-date Flow, the Farpost reputation-graph parallel)
- [x] 5.5 Create `/techstacks/credential-flow/design-notes` (raw `httpx` over a wrapper library; FSC/Agentforce licensing limitation and what it drove)
- [x] 5.6 Create `/techstacks/credential-flow/ai-notes` (build-process AI use, then the recommended-next-action feature and why Agentforce wasn't used)
- [x] 5.7 Migrate the existing Setup Gallery: build `web/src/components/credential-flow/SetupGallery.tsx` from `web/src/components/portfolio/SetupGallery.tsx`'s existing screenshots/captions (`web/public/images/salesforce-setup/`), create `/techstacks/credential-flow/setup-gallery`, remove Credential Flow's usage of the shared component
- [x] 5.8 Confirm nothing else references `web/src/components/portfolio/SetupGallery.tsx` before considering it for removal in a later cleanup (not this change's job to delete it) — confirmed via grep, no remaining references
- [x] 5.9 Wire the Credential Flow submenu into `DrawerNav.tsx`

## 6. Test coverage

- [x] 6.1 Update `web/e2e/global-navigation.spec.ts`: no redundant "Experiments > Experiments" node; each of Atlas/Dispatch/Pulse/Credential Flow expands its own six-page submenu; "View All" navigates to `/techstacks`
- [x] 6.2 Add e2e coverage navigating to all 24 new sub-pages via their nav submenus, at least asserting each renders without error
- [x] 6.3 Add e2e or unit coverage asserting Atlas's AI Notes page states the "no AI mechanic yet" disclosure, and Pulse's AI Notes page states the "currently mocked" disclosure — these are load-bearing honesty claims, not just prose
- [x] 6.4 Add unit coverage for the `EXPERIMENT_RECORD_CHILDREN` helper mirroring existing `PROJECT_RECORD_CHILDREN` test coverage in `navTree.test.ts`

## 7. Verification and cleanup

- [x] 7.1 Run the full Vitest and Playwright suites and fix any regressions
- [x] 7.2 Manually click through the full new Experiments nav structure at both mobile and desktop viewports
- [x] 7.3 Update `docs/stack.md` if any new one-off tooling is introduced while building this — none introduced, no update needed
- [x] 7.4 Run `scc` against `web/src`, `api`, and `pieces`; append the snapshot to `docs/metrics.md` and `web/src/data/metrics.json` per `CLAUDE.md`'s metrics convention, before archiving
- [x] 7.5 Confirm with Robin whether Dispatch's and Pulse's Setup Gallery pages ship with an honest "screenshots coming soon" placeholder state, or whether this change waits on Robin capturing those screenshots first before archiving — resolved at kickoff: ship as stubs, don't wait

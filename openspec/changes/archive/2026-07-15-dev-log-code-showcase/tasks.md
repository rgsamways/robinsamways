## 1. Shared CodeBlock relocation

- [x] 1.1 Move `web/src/components/ops/CodeBlock.tsx` to a shared, non-`ops`-specific path (e.g. `web/src/components/CodeBlock.tsx`); no behavior/prop changes.
- [x] 1.2 Update `web/src/app/ops/deploy/page.tsx`'s import to the new path; confirm `/ops/deploy` still renders identically.

## 2. Code Showcase content

- [x] 2.1 Read `docs/farpost-devlog-handoff-robinsamways.md` in full before writing anything, per its own instructions.
- [x] 2.2 Define `CodeShowcaseEntry` type and `CODE_SHOWCASE_ENTRIES` data in `web/src/components/dev-log/codeShowcase.ts`, mirroring `bugLog.ts`'s `BugLogEntry[]` pattern: `slug`, `project`, `category`, `date`, `title`, `framing: string[]`, `codeBlocks: { language: string; code: string }[]`, `theFix: string[]`, `whyThisMatters: string[]`.
- [x] 2.3 Add Entry 1 ("The Bug That Silently Ate 2,706 Records") to `CODE_SHOWCASE_ENTRIES` using the handoff's approved template content verbatim (translated into the typed data shape — same substance, no rewriting of its prose).
- [x] 2.4 Write and add Entries 2-10 (generic dispatch loop; reputation floors; corroborating weak signals; the Stripe cache-verification fix; the Stripe pending-invoice-items footgun; webhook idempotency; Twilio signature scheme mismatch; per-category fact-staleness decay; the async-safe Claude integration) to `CODE_SHOWCASE_ENTRIES` — real framing prose and callout copy written from each entry's context notes in the handoff, matching Entry 1's shape, not the raw notes pasted as-is.

## 3. Code Showcase rendering

- [x] 3.1 Create a `CodeShowcase.tsx` rendering component in `web/src/components/dev-log/`, reusing the relocated shared `CodeBlock` for code and Bug Log's existing labeled-subsection markup pattern (kicker/title, then "The fix" / "Why this matters" as `text-accent`-labeled paragraph groups) for the callouts.
- [x] 3.2 Wire the Code Showcase section into `web/src/app/dev-log/page.tsx` as the fifth section, after Bug Log.

## 4. Section filter bar

- [x] 4.1 Create pure helper `web/src/components/dev-log/filterSections.ts`, mirroring `techstacks/filterProjects.ts`: given the five section ids and the active-pill set, returns which ids are visible (empty active set = all visible).
- [x] 4.2 Add `web/src/components/dev-log/__tests__/filterSections.test.ts` covering: no active pills shows all sections, one active pill isolates it, multiple active pills union, deactivating all restores all — mirroring `filterProjects.test.ts`'s coverage shape.
- [x] 4.3 Create a client component (e.g. `DevLogSectionFilter.tsx`) mirroring `TechStacksBrowser.tsx`'s pill markup (`role="group"`, `aria-pressed`, active/inactive styling) that owns pill state and conditionally renders five pre-built section nodes passed to it as props.
- [x] 4.4 Update `web/src/app/dev-log/page.tsx` to build the five section nodes (Glossary, Testing & Verification, Metrics, Bug Log, Code Showcase) and pass them into the new filter component instead of rendering them as bare, unconditional `<section>`s.

## 5. Test coverage

- [x] 5.1 Confirm `web/src/components/dev-log/__tests__/filterSections.test.ts` (task 4.2) passes via `npm run test`.
- [x] 5.2 Add or extend a Playwright e2e spec covering the `/dev-log` pill bar: all five pills render, activating one pill hides the other four sections, clearing all active pills shows all five sections again.
- [x] 5.3 Run `npm run build` in `web/` and confirm a clean build.

## 6. Metrics and wrap-up

- [x] 6.1 Run `scc` against `web/src`, `api`, and `pieces`; append the new snapshot to `docs/metrics.md` (date, change name, headline numbers, one-line delta from the previous snapshot) and to `web/src/data/metrics.json`.
- [x] 6.2 If the new snapshot's DRYness drops below 55% or falls more than 10 points from the previous snapshot, log it as an open item in `docs/issues.md` per `CLAUDE.md`'s scc convention.
- [x] 6.3 Report status back to Robin for the drift audit against `openspec/specs/dev-log-content/spec.md` before archiving.
